CREATE OR REPLACE FUNCTION public.claim_admin_if_none()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _claimed boolean := false;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext('public.claim_admin_if_none'));

  IF EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'::public.app_role
  ) THEN
    RETURN false;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  GET DIAGNOSTICS _claimed = ROW_COUNT;
  RETURN _claimed;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_admin_if_none() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_admin_if_none() TO authenticated;