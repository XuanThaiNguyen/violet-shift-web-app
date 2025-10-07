import api from "@/services/api/http";
import { useMe } from "@/states/apis/me";
import { pad } from "@/utils/strings";
import { addToast, Button, DatePicker, Input } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { useQueryClient } from "@tanstack/react-query";
import { isValid } from "date-fns";
import { useFormik } from "formik";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import * as Yup from "yup";

interface ProfileSubmitValues {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  preferredName?: string;
  birthdate?: string;
  mobileNumber?: string;
  phoneNumber?: string;
}

const initialClientValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  preferredName: "",
  birthdate: "",
  mobileNumber: "",
  phoneNumber: "",
};

const profileSchema = Yup.object({
  firstName: Yup.string(),
  middleName: Yup.string(),
  lastName: Yup.string(),
  preferredName: Yup.string(),
  birthdate: Yup.date(),
  mobileNumber: Yup.string(),
  phoneNumber: Yup.string(),
});

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profileUser } = useMe();
  const init: ProfileSubmitValues = {
    ...initialClientValues,
    firstName: profileUser?.firstName,
    middleName: profileUser?.middleName,
    lastName: profileUser?.lastName,
    preferredName: profileUser?.preferredName,
    birthdate: profileUser?.birthdate,
    mobileNumber: profileUser?.mobileNumber,
    phoneNumber: profileUser?.phoneNumber,
  };

  const profileFormik = useFormik<ProfileSubmitValues>({
    initialValues: init,
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      try {
        await api.patch("/api/v1/me", values);
        addToast({
          title: "Profile updated",
          description: "Profile updated successfully",
          color: "success",
          timeout: 2000,
          isClosing: true,
        });
        queryClient.invalidateQueries({ queryKey: ["me"] });
        navigate("/profile");
      } catch {
        addToast({
          title: "Profile update failed",
          color: "danger",
          timeout: 2000,
          isClosing: true,
        });
      }
    },
  });

  const birthdate =
    profileFormik.values.birthdate &&
    isValid(new Date(profileFormik.values.birthdate))
      ? new Date(profileFormik.values.birthdate)
      : null;

  return (
    <div className="px-4 w-full">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/profile")}
      >
        <ArrowLeft />
        <span>Back to Profile</span>
      </div>
      <div className="h-4"></div>
      <form
        className="px-4 py-8 mx-auto shadow-lg rounded-lg bg-content1"
        onSubmit={(e) => {
          e.preventDefault();
          profileFormik.handleSubmit();
        }}
      >
        <div className="flex flex-col">
          <span className="flex-1">Name:</span>
          <div className="h-2"></div>
          <div className="flex-5">
            <div className="flex gap-8">
              <Input
                label=""
                type="text"
                placeholder="First Name"
                name="firstName"
                isInvalid={
                  !!profileFormik.errors.firstName &&
                  profileFormik.touched.firstName
                }
                errorMessage={
                  profileFormik.errors.firstName &&
                  profileFormik.touched.firstName
                    ? profileFormik.errors.firstName
                    : ""
                }
                value={profileFormik.values.firstName}
                onValueChange={(value) => {
                  profileFormik.setFieldValue("firstName", value);
                }}
                onBlur={() => {
                  profileFormik.setFieldTouched("firstName", true);
                }}
              />
              <Input
                label=""
                type="text"
                placeholder="Middle Name"
                name="middleName"
                isInvalid={
                  !!profileFormik.errors.middleName &&
                  profileFormik.touched.middleName
                }
                errorMessage={
                  profileFormik.errors.middleName &&
                  profileFormik.touched.middleName
                    ? profileFormik.errors.middleName
                    : ""
                }
                value={profileFormik.values.middleName}
                onValueChange={(value) => {
                  profileFormik.setFieldValue("middleName", value);
                }}
                onBlur={() => {
                  profileFormik.setFieldTouched("middleName", true);
                }}
              />
              <Input
                label=""
                type="text"
                placeholder="Last Name"
                name="lastName"
                isInvalid={
                  !!profileFormik.errors.lastName &&
                  profileFormik.touched.lastName
                }
                errorMessage={
                  profileFormik.errors.lastName &&
                  profileFormik.touched.lastName
                    ? profileFormik.errors.lastName
                    : ""
                }
                value={profileFormik.values.lastName}
                onValueChange={(value) => {
                  profileFormik.setFieldValue("lastName", value);
                }}
                onBlur={() => {
                  profileFormik.setFieldTouched("lastName", true);
                }}
              />
            </div>
          </div>
        </div>
        <div className="h-8"></div>
        <div className="flex flex-col">
          <span className="flex-1">Preferred Name:</span>
          <div className="h-2"></div>
          <Input
            className="flex-5"
            type="text"
            placeholder="Preferred Name"
            name="preferredName"
            isInvalid={
              !!profileFormik.errors.preferredName &&
              profileFormik.touched.preferredName
            }
            errorMessage={
              profileFormik.errors.preferredName &&
              profileFormik.touched.preferredName
                ? profileFormik.errors.preferredName
                : ""
            }
            value={profileFormik.values.preferredName}
            onValueChange={(value) => {
              profileFormik.setFieldValue("preferredName", value);
            }}
            onBlur={() => {
              profileFormik.setFieldTouched("preferredName", true);
            }}
          />
        </div>
        <div className="h-8"></div>
        <div className="flex flex-col">
          <span className="flex-1">Date of Birth:</span>
          <div className="h-2"></div>
          <DatePicker
            showMonthAndYearPickers
            label=""
            name="birthdate"
            isInvalid={
              !!profileFormik.errors.birthdate &&
              profileFormik.touched.birthdate
            }
            errorMessage={
              profileFormik.errors.birthdate && profileFormik.touched.birthdate
                ? profileFormik.errors.birthdate
                : ""
            }
            value={
              birthdate
                ? new CalendarDate(
                    birthdate.getFullYear(),
                    birthdate.getMonth() + 1,
                    birthdate.getDate()
                  )
                : null
            }
            onChange={(value) => {
              const val = value
                ? `${pad(value.year, 4)}-${pad(value.month)}-${pad(value.day)}`
                : null;
              profileFormik.setFieldValue("birthdate", val);
            }}
            onBlur={() => {
              profileFormik.setFieldTouched("birthdate", true);
            }}
          />
        </div>
        <div className="h-8"></div>
        <div className="flex flex-col">
          <span className="flex-1">Mobile number:</span>
          <div className="h-2"></div>
          <Input
            label=""
            type="text"
            placeholder="Mobile Number"
            name="mobileNumber"
            isInvalid={
              !!profileFormik.errors.mobileNumber &&
              profileFormik.touched.mobileNumber
            }
            errorMessage={
              profileFormik.errors.mobileNumber &&
              profileFormik.touched.mobileNumber
                ? profileFormik.errors.mobileNumber
                : ""
            }
            value={profileFormik.values.mobileNumber}
            onValueChange={(value) => {
              profileFormik.setFieldValue("mobileNumber", value);
            }}
            onBlur={() => {
              profileFormik.setFieldTouched("mobileNumber", true);
            }}
          />
        </div>
        <div className="h-8"></div>
        <div className="flex flex-col">
          <span className="flex-1">Phone number:</span>
          <div className="h-2"></div>
          <Input
            label=""
            type="text"
            placeholder="Phone Number"
            name="phoneNumber"
            isInvalid={
              !!profileFormik.errors.phoneNumber &&
              profileFormik.touched.phoneNumber
            }
            errorMessage={
              profileFormik.errors.phoneNumber &&
              profileFormik.touched.phoneNumber
                ? profileFormik.errors.phoneNumber
                : ""
            }
            value={profileFormik.values.phoneNumber}
            onValueChange={(value) => {
              profileFormik.setFieldValue("phoneNumber", value);
            }}
            onBlur={() => {
              profileFormik.setFieldTouched("phoneNumber", true);
            }}
          />
        </div>
        <div className="h-8"></div>
        <div className="flex justify-end">
          <Button type="submit" color="primary">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileUpdate;
