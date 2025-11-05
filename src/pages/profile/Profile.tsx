import UserAvatar from "@/layouts/components/Avatar";
import { useMe } from "@/states/apis/me";
import { getDisplayName } from "@/utils/strings";
import { Tab, Tabs } from "@heroui/react";
import { useState, type FC } from "react";
import ProfileInfo from "./components/ProfileInfo";
import ProfilePassword from "./components/ProfilePassword";

const Profile: FC = () => {
  const { data: user } = useMe();

  const [selectedTab, setSelectedTab] = useState<"info" | "password">("info");

  const _fullName = getDisplayName({
    firstName: user?.firstName,
    lastName: user?.lastName,
    middleName: user?.middleName,
    salutation: user?.salutation,
    preferredName: user?.preferredName,
  });

  const changeToInfo = () => {
    setSelectedTab("info");
  };

  return (
    <div className="container mx-auto mt-4">
      <div className="flex items-center gap-2">
        <UserAvatar user={user} size={48} />
        <span className="text-2xl">{_fullName}</span>
      </div>
      <div className="h-4"></div>
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as "info" | "password")}
        variant="underlined"
        color="primary"
      >
        <Tab key="info" title="Info">
          <ProfileInfo />
        </Tab>
        <Tab key="password" title="Password">
          <ProfilePassword changeToInfo={changeToInfo} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Profile;
