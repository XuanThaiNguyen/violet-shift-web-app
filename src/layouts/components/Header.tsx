import { useState } from "react";
import { Cog, DoorOpen, Menu } from "lucide-react";
import useSidebarStore from "../../states/app/sidebar";
import {
  Avatar,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User,
} from "@heroui/react";
import { Link, useNavigate } from "react-router";
import { useMe } from "@/states/apis/me";
import { useQueryClient } from "@tanstack/react-query";

import type { FC } from "react";

const Header: FC = () => {
  const { toggleSidebar } = useSidebarStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);

  const { data: user } = useMe();
  const avatar = user?.avatar
    ? user.avatar
    : "https://i.pravatar.cc/150?u=a042581f4e29026024d";
  const name = user?.preferredName
    ? user.preferredName
    : [user?.firstName, user?.middleName, user?.lastName].join(" ");

  const closePopover = () => {
    setIsOpen(false);
  };

  return (
    <header className="bg-primary text-primary-foreground py-3 px-4 flex items-center justify-between gap-2 sticky top-0 left-0 z-40 w-full shadow-lg h-14">
      <Menu className="cursor-pointer" size={20} onClick={toggleSidebar} />
      {user && (
        <Popover
          placement="bottom-start"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <PopoverTrigger>
            <User
              as="button"
              avatarProps={{
                src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
              }}
              className="transition-transform [&>span]:w-8 [&>span]:h-8 cursor-pointer"
              name={name}
            />
          </PopoverTrigger>
          <PopoverContent className="w-56 flex flex-col gap-0 p-0 shadow-md">
            <div className="w-full flex flex-col justify-center items-center py-4 bg-primary text-primary-foreground gap-2">
              <Avatar src={avatar} />
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-primary-foreground/50">{user.email}</p>
            </div>
            <div className="flex justify-between items-center gap-2 w-full p-2">
              <Button
                as={Link}
                className="px-2 py-1 h-8 rounded-sm"
                to="/profile"
                onPress={closePopover}
                variant="light"
                startContent={<Cog size={12} />}
              >
                Profile
              </Button>
              <Button
                as={Link}
                className="px-2 py-1 h-8 rounded-sm"
                onPress={() => {
                  localStorage.removeItem("auth_token");
                  navigate("/auth/login");
                  queryClient.clear();
                }}
                startContent={<DoorOpen size={12} />}
                variant="light"
                color="danger"
              >
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </header>
  );
};

export default Header;
