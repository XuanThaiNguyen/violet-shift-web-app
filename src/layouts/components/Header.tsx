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
import { Link } from "react-router";

import type { FC } from "react";

const Header: FC = () => {
  const { toggleSidebar } = useSidebarStore();
  return (
    <header className="bg-primary text-primary-foreground py-3 px-4 flex items-center justify-between gap-2 sticky top-0 left-0 z-40 w-full shadow-lg">
      <Menu className="cursor-pointer" size={20} onClick={toggleSidebar} />
      <Popover placement="bottom-start">
        <PopoverTrigger>
          <User
            as="button"
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            }}
            className="transition-transform [&>span]:w-8 [&>span]:h-8 cursor-pointer"
            name="Tony Reichert"
          />
        </PopoverTrigger>
        <PopoverContent className="w-56 flex flex-col gap-0 p-0 shadow-md">
          <div className="w-full flex flex-col justify-center items-center py-4 bg-primary text-primary-foreground gap-2">
            <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
            <p className="text-sm font-medium">Tony Reichert</p>
            <p className="text-xs text-primary-foreground/50">tony.reichert@example.com</p>
          </div>
          <div className="flex justify-between items-center gap-2 w-full p-2">
            <Button
              as={Link}
              className="px-2 py-1 h-8 rounded-sm"
              to="/profile"
              variant="light"
              startContent={<Cog size={12} />}
            >
              Profile
            </Button>
            <Button
              as={Link} 
              className="px-2 py-1 h-8 rounded-sm"
              to="/logout"
              startContent={<DoorOpen size={12} />}
              variant="light"
              color="danger"
            >
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </header>
  );
};

export default Header;
