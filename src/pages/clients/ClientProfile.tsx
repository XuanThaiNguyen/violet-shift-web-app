import { Tab, Tabs } from "@heroui/react";
import { useParams } from "react-router";
import ClientDetail from "./components/ClientDetail";

const ClientProfile = () => {
  const { id } = useParams();

  return (
    <div className="px-4">
      <Tabs variant="underlined" color="primary">
        <Tab key="profile" title="Profile">
          <ClientDetail clientId={id || ""} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ClientProfile;
