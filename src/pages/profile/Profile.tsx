import { Tab, Tabs } from "@heroui/react";
import ProfileUpdate from "./components/ProfileUpdate";
import PasswordUpdate from "./components/PasswordUpdate";

import { type FC } from "react";

const Profile: FC = () => {
  return (
    <div className="px-4">
      <Tabs variant="underlined" color="primary" >
        <Tab key="profile" title="Profile">
          <ProfileUpdate />
        </Tab>
        <Tab key="password" title="Password">
          <PasswordUpdate />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Profile;
