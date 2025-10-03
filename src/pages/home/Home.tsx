import { ROLE_IDS } from "@/constants/roles";
import { useMe } from "@/states/apis/me";
import { useEffect } from "react";
import { useNavigate } from "react-router";

import type { FC } from "react";

const roleRedirect = {
  [ROLE_IDS.CARER]: "/scheduler",
  [ROLE_IDS.HR]: "/scheduler",
  [ROLE_IDS.ADMIN]: "/scheduler",
  [ROLE_IDS.COORDINATOR]: "/scheduler",
  [ROLE_IDS.OFFICE_SUPPORT]: "/scheduler",
};

const Home: FC = () => {
  const { data: user, isLoading } = useMe();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    const redirect = roleRedirect[user?.role as keyof typeof roleRedirect];
    if (redirect) {
      navigate(redirect);
    }
  }, [user, navigate, isLoading]);

  return (
    <div className="w-full h-[calc(100vh-6rem)] px-4">
      <div className="w-full h-full flex items-center justify-center">
        <img
          src="/images/loading.gif"
          alt="loading"
          className="w-36 h-36 object-cover"
        />
      </div>
    </div>
  );
};

export default Home;
