CREATE OR REPLACE FUNCTION public.prevent_extra_admin_self_claims()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'admin'::public.app_role
     AND auth.role() = 'authenticated'
     AND auth.uid() = NEW.user_id THEN
    PERFORM pg_advisory_xact_lock(hashtext('public.prevent_extra_admin_self_claims'));

    IF EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE role = 'admin'::public.app_role
        AND NOT (user_id = NEW.user_id AND role = NEW.role)
    ) THEN
      RAISE EXCEPTION 'Admin already exists';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.prevent_extra_admin_self_claims() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.prevent_extra_admin_self_claims() FROM anon;
REVOKE ALL ON FUNCTION public.prevent_extra_admin_self_claims() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.prevent_extra_admin_self_claims() TO service_role;