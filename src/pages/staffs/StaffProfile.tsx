import { getDisplayName } from "@/utils/strings";
import { Avatar, Tab, Tabs } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import StaffDetail from "./components/StaffDetail";
import { useStaffDetail } from "@/states/apis/staff";
import Worklogs from "./components/Worklogs";

const StaffProfile = () => {
  const navigate = useNavigate();
  const { id: staffId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawTab = searchParams.get("tab") ?? "profile";
  const selectedTab =
    rawTab === "worklogs" || rawTab === "profile" ? rawTab : "profile";
  const from = searchParams.get("from");
  const isFromWorklogs = from === "worklogs";

  const { data: detailStaff } = useStaffDetail(staffId || "");

  const _staffName = getDisplayName({
    salutation: detailStaff?.salutation,
    firstName: detailStaff?.firstName,
    middleName: detailStaff?.middleName,
    lastName: detailStaff?.lastName,
    preferredName: detailStaff?.preferredName,
  });

  if (!staffId) return <></>;

  return (
    <div className="px-4 mt-4">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => {
          if (isFromWorklogs) {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/worklogs");
            }
            return;
          }
          navigate("/staffs/list");
        }}
      >
        <ArrowLeft />
        <span className="text-sm">
          {isFromWorklogs ? "Back to Worklog List" : "Back to Staff List"}
        </span>
      </div>
      <div className="h-8"></div>
      <div className="flex items-center gap-2">
        <Avatar
          className="w-8 h-8 rounded-full object-cover"
          color={"primary"}
        />
        <span className="text-2xl">{_staffName || ""}</span>
      </div>
      <div className="h-4"></div>
      <Tabs
        variant="underlined"
        color="primary"
        selectedKey={selectedTab}
        onSelectionChange={(key) => {
          const tab = String(key);
          setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (tab === "profile") {
              next.delete("tab");
            } else {
              next.set("tab", tab);
            }
            return next;
          });
        }}
      >
        <Tab key="profile" title="Profile">
          <StaffDetail
            staffId={staffId || ""}
            detailStaff={detailStaff}
            staffName={_staffName}
          />
        </Tab>
        <Tab key="worklogs" title="Worklogs">
          <Worklogs />
        </Tab>
      </Tabs>
    </div>
  );
};

export default StaffProfile;
