import { Avatar, Tab, Tabs } from "@heroui/react";
import { type FC } from "react";
import ProfileInfo from "./components/ProfileInfo";
import ProfilePassword from "./components/ProfilePassword";

const Profile: FC = () => {
  return (
    <div className="px-4">
      <div className="flex items-center gap-2">
        <Avatar
          className="w-8 h-8 rounded-full object-cover"
          color={"primary"}
        />
        <span className="text-2xl">{"123123"}</span>
      </div>
      <div className="h-4"></div>
      <Tabs variant="underlined" color="primary">
        <Tab key="info" title="Info">
          <ProfileInfo />
        </Tab>
        <Tab key="password" title="Password">
          <ProfilePassword />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Profile;
