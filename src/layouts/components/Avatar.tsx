import type { IClient } from "@/types/client";
import type { User as IUser } from "@/types/user";
import { Avatar, User } from "@heroui/react";

const UserAvatar = ({
  user,
  size = 32,
}: {
  user?: IClient | IUser;
  size?: number;
}) => {
  if (!user)
    return (
      <Avatar
        className={`w-[${size}px] h-[${size}px] rounded-full object-cover`}
        color={"primary"}
      />
    );

  const actualName = `${user?.firstName}+${user?.lastName}`;

  const avatar = user?.avatar
    ? user.avatar
    : `https://ui-avatars.com/api/?name=${actualName}`;

  return (
    <User
      as="button"
      avatarProps={{
        src: avatar,
        style: {
          width: size,
          height: size,
        },
      }}
      className={`transition-transform cursor-pointer`}
      name={""}
    />
  );
};

export default UserAvatar;
