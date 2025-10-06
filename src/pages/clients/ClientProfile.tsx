import { Tab, Tabs } from "@heroui/react";
import { useNavigate, useParams } from "react-router";
import ClientDetail from "./components/ClientDetail";
import { ArrowLeft } from "lucide-react";

const ClientProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="px-4">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/clients/list")}
      >
        <ArrowLeft />
        <span>Back to Client List</span>
      </div>
      <div className="h-4"></div>
      <Tabs variant="underlined" color="primary">
        <Tab key="profile" title="Profile">
          <ClientDetail clientId={id || ""} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ClientProfile;
