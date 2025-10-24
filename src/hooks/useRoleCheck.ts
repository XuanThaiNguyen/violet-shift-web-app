import { ROLE_IDS } from "@/constants/roles";
import { useMe } from "@/states/apis/me";

export const useRoleCheck = () => {
  const { data: user, isLoading } = useMe();

  const roleId = user?.role;

  const isAdmin = roleId === ROLE_IDS.ADMIN;
  const isHR = roleId === ROLE_IDS.HR;
  const isCoordinator = roleId === ROLE_IDS.COORDINATOR;
  const isOfficeSupport = roleId === ROLE_IDS.OFFICE_SUPPORT;
  const isCarer = roleId === ROLE_IDS.CARER;

  const notAdmin = !isAdmin;

  return {
    isLoading,
    roleId,
    isAdmin,
    notAdmin,
    isHR,
    isCoordinator,
    isOfficeSupport,
    isCarer,
  };
};
