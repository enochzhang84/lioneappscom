DROP FUNCTION IF EXISTS public.claim_admin_if_none();

CREATE OR REPLACE FUNCTION public.prevent_extra_admin_self_claims()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'admin'::public.app_role THEN
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

DROP TRIGGER IF EXISTS trg_prevent_extra_admin_self_claims ON public.user_roles;
CREATE TRIGGER trg_prevent_extra_admin_self_claims
  BEFORE INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_extra_admin_self_claims();

DROP POLICY IF EXISTS "First signed-in user can claim admin" ON public.user_roles;
CREATE POLICY "First signed-in user can claim admin" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND role = 'admin'::public.app_role);

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;