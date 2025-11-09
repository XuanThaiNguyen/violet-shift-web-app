import { Link, useLocation } from "react-router";
import useSidebarStore from "../../states/app/sidebar";
import clsx from "clsx";
import {
  Calendar,
  ChevronRight,
  ChevronsRight,
  // Clock,
  PersonStanding,
  Settings,
  UsersRound,
} from "lucide-react";
import { useWindowSize } from "usehooks-ts";
import { Accordion, AccordionItem } from "@heroui/react";
import { ROLE_IDS } from "@/constants/roles";
import { useMe } from "@/states/apis/me";

import type { ComponentType, FC } from "react";

interface SidebarItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: ComponentType<any>;
  label: string;
  key: string;
  to: string;
  roles?: string[]; // empty array means all roles are allowed
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    icon: Calendar,
    key: "scheduler",
    label: "Scheduler",
    to: "/scheduler",
    roles: [
      ROLE_IDS.CARER,
      ROLE_IDS.ADMIN,
      ROLE_IDS.COORDINATOR,
      ROLE_IDS.OFFICE_SUPPORT,
    ],
  },
  // {
  //   icon: Clock,
  //   key: "worklogs",
  //   label: "Worklogs",
  //   to: "/worklogs",
  //   roles: [ROLE_IDS.ADMIN, ROLE_IDS.COORDINATOR],
  // },
  {
    icon: PersonStanding,
    key: "staffs",
    label: "Staffs",
    to: "/staffs",
    roles: [
      ROLE_IDS.ADMIN,
      ROLE_IDS.COORDINATOR,
      ROLE_IDS.OFFICE_SUPPORT,
      ROLE_IDS.HR,
    ],
    children: [
      {
        icon: ChevronsRight,
        key: "staff-list",
        label: "List",
        to: "/staffs/list",
        roles: [
          ROLE_IDS.ADMIN,
          ROLE_IDS.COORDINATOR,
          ROLE_IDS.OFFICE_SUPPORT,
          ROLE_IDS.HR,
        ],
      },
      {
        icon: ChevronsRight,
        key: "staff-archived-list",
        label: "Archived",
        to: "/staffs/archived",
        roles: [ROLE_IDS.ADMIN, ROLE_IDS.COORDINATOR],
      },
      {
        icon: ChevronsRight,
        key: "new-staff",
        label: "New",
        to: "/staffs/new",
        roles: [
          ROLE_IDS.ADMIN,
          ROLE_IDS.COORDINATOR,
          ROLE_IDS.OFFICE_SUPPORT,
          ROLE_IDS.HR,
        ],
      },
    ],
  },
  {
    icon: UsersRound,
    key: "clients",
    label: "Clients",
    to: "/clients",
    roles: [ROLE_IDS.ADMIN, ROLE_IDS.COORDINATOR],
    children: [
      {
        icon: ChevronsRight,
        key: "clients-list",
        label: "List",
        to: "/clients/list",
        roles: [ROLE_IDS.ADMIN, ROLE_IDS.COORDINATOR],
      },
      {
        icon: ChevronsRight,
        key: "clients-archived-list",
        label: "Archived",
        to: "/clients/archived",
        roles: [ROLE_IDS.ADMIN, ROLE_IDS.COORDINATOR],
      },
      {
        icon: ChevronsRight,
        key: "new-clients",
        label: "New",
        to: "/clients/new",
        roles: [ROLE_IDS.ADMIN, ROLE_IDS.COORDINATOR],
      },
    ],
  },
  {
    icon: Settings,
    key: "account",
    label: "Account",
    to: "/account",
    roles: [ROLE_IDS.ADMIN, ROLE_IDS.COORDINATOR],
    children: [
      {
        icon: ChevronsRight,
        key: "clients-list",
        label: "Prices",
        to: "/account/prices",
        roles: [ROLE_IDS.ADMIN, ROLE_IDS.COORDINATOR],
      },
    ],
  },
];

const Sidebar: FC = () => {
  const { isOpen, setIsOpen } = useSidebarStore();
  const { width } = useWindowSize();
  const { data: user } = useMe();

  const location = useLocation();
  return (
    <section
      className={clsx(
        "-z-10 lg:!z-50 fixed top-0 left-0 w-full h-screen",
        isOpen
          ? "z-50 lg:w-64"
          : "lg:w-18 animate-[delayZOffEffect_ease-in-out_0.3s_forwards]"
      )}
    >
      <div
        className={clsx(
          "fixed top-0 left-0 bg-black/60 w-full h-full transition-all duration-300 lg:!hidden",
          isOpen ? "opacity-100 lg:hidden" : "opacity-0"
        )}
        onClick={() => setIsOpen(false)}
      ></div>
      <nav
        className={clsx(
          "w-64 h-screen bg-content1 text-content1-foreground flex-shrink-0 transition-all duration-300",
          isOpen
            ? "translate-x-0"
            : "lg:w-18 lg:translate-x-0 -translate-x-full"
        )}
      >
        <h1 className="w-full flex-shrink-0 text-center text-lg font-semibold h-14 bg-primary text-primary-foreground flex items-center justify-center">
          <Link className="flex gap-2 items-center whitespace-nowrap" to="/">
            {/* should be logo here */}
            {/* <Home size={20} /> */}
            <span
              className={clsx(
                isOpen
                  ? "lg:animate-[fadeIn_ease-in-out_0.3s_forwards] "
                  : "lg:hidden"
              )}
            >
              Violet Shift
            </span>
          </Link>
        </h1>

        <div className="min-h-full overflow-y-auto flex flex-col p-2 gap-2 shadow-lg">
          {sidebarItems.map((item) => {
            const isActive = location.pathname?.includes(item.key);
            const Icon = item.icon;
            const isMobile = width < 1024;
            const isAllowed = item.roles
              ? item.roles.includes(user?.role ?? "")
              : true;

            if (!isAllowed) {
              return null;
            }

            if (item.children) {
              if (!isOpen && !isMobile) {
                return (
                  <div
                    className={clsx(
                      "hidden px-4 py-2 w-full cursor-pointer hover:bg-primary/20 hover:text-primary rounded-md",
                      isOpen ? "" : "lg:block"
                    )}
                    key={item.key}
                    onClick={() => setIsOpen(true)}
                  >
                    <Icon className="flex-shrink-0" size={20} />
                  </div>
                );
              }

              return (
                <Accordion
                  defaultExpandedKeys={isActive ? [item.key] : []}
                  key={item.key}
                >
                  <AccordionItem
                    startContent={<Icon size={20} />}
                    key={item.key}
                    title={item.label}
                    className="cursor-pointer"
                    classNames={{
                      title: "text-inherit",
                      trigger: "cursor-pointer gap-2",
                      heading: clsx(
                        "hover:bg-primary/20 hover:text-primary cursor-pointer rounded-md px-2 h-10",
                        isActive && "text-primary"
                      ),
                      content: "ml-2 ",
                      indicator:
                        "data-[open=true]:rotate-90 rtl:data-[open=true]:-rotate-90",
                    }}
                    indicator={<ChevronRight size={20} />}
                  >
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = location.pathname?.includes(
                        child.to
                      );
                      const isChildAllowed = child.roles
                        ? child.roles.includes(user?.role ?? "")
                        : true;

                      if (!isChildAllowed) {
                        return null;
                      }

                      return (
                        <Link
                          className={clsx(
                            "flex items-center gap-2 px-4 py-2 hover:bg-primary/20 hover:text-primary cursor-pointer rounded-md",
                            isChildActive && "text-primary"
                          )}
                          to={child.to}
                          key={child.key}
                        >
                          <ChildIcon className="flex-shrink-0" size={20} />
                          <span
                            className={clsx(
                              isOpen
                                ? "lg:animate-[fadeIn_ease-in-out_0.3s_forwards]"
                                : "lg:hidden"
                            )}
                          >
                            {child.label}
                          </span>
                        </Link>
                      );
                    })}
                  </AccordionItem>
                </Accordion>
              );
            }

            return (
              <Link
                className="flex items-center gap-2 px-4 py-2 hover:bg-primary/20 hover:text-primary cursor-pointer rounded-md"
                to={item.to}
                key={item.key}
              >
                <Icon className="flex-shrink-0" size={20} />
                <span
                  className={clsx(
                    isActive && "text-primary",
                    isOpen
                      ? "lg:animate-[fadeIn_ease-in-out_0.3s_forwards]"
                      : "lg:hidden"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </section>
  );
};

export default Sidebar;
