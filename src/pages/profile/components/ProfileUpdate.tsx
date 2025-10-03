import {
  addToast,
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { useFormik } from "formik";
import * as Yup from "yup";
import { isValid } from "date-fns";
import { pad } from "@/utils/strings";
import api from "@/services/api/http";
import { useQueryClient } from "@tanstack/react-query";
import { useMe } from "@/states/apis/me";
import { employmentTypeOptions, genderOptions } from "@/constants/userOptions";

import type {  FC } from "react";

const profileSchema = Yup.object({
  avatar: Yup.string(),
  firstName: Yup.string().required("First name is required"),
  middleName: Yup.string(),
  lastName: Yup.string().required("Last name is required"),
  preferredName: Yup.string(),
  phone: Yup.string(),
  employmentType: Yup.string()
    .oneOf(employmentTypeOptions.map((option) => option.value))
    .required("Employment type is required"),
  birthdate: Yup.date().required("birthdate is required"),
  gender: Yup.string()
    .oneOf(genderOptions.map((option) => option.value))
    .required("Gender is required"),
});

const initialProfileValues = {
  avatar: "",
  firstName: "",
  lastName: "",
  preferredName: "",
  phone: "",
  birthdate: "",
  gender: "",
};

const ProfileUpdate: FC = () => {
  const queryClient = useQueryClient();
  const { data: user } = useMe();
  const init = {
    ...initialProfileValues,
    ...user,
  };
  const profileFormik = useFormik({
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

  const birthdate = isValid(new Date(profileFormik.values.birthdate))
    ? new Date(profileFormik.values.birthdate)
    : null;

  return (
    <div className="p-4 w-full mx-auto shadow-lg rounded-lg bg-content1">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold w-full text-center">Profile</h1>
        <div className="h-8"></div>

        {/* avatar */}
        <div className="w-16 h-16 bg-gray-300 rounded-md"></div>
        <div className="h-4"></div>

        <form className="" onSubmit={profileFormik.handleSubmit}>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-y-4 gap-x-2">
            <Input
              isRequired
              type="text"
              placeholder="First Name"
              name="firstName"
              label="First Name"
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
              isRequired
              type="text"
              placeholder="Last Name"
              name="lastName"
              label="Last Name"
              isInvalid={
                !!profileFormik.errors.lastName &&
                profileFormik.touched.lastName
              }
              errorMessage={
                profileFormik.errors.lastName && profileFormik.touched.lastName
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
            <Input
              type="text"
              placeholder="Middle Name"
              name="middleName"
              label="Middle Name"
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
              type="text"
              placeholder="Preferred Name"
              name="preferredName"
              label="Preferred Name"
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
            <Select
              isRequired
              label="Employment Type"
              name="employmentType"
              placeholder="Select Employment Type"
              isInvalid={
                !!profileFormik.errors.employmentType &&
                profileFormik.touched.employmentType
              }
              errorMessage={
                profileFormik.errors.employmentType &&
                profileFormik.touched.employmentType
                  ? profileFormik.errors.employmentType
                  : ""
              }
              selectedKeys={[profileFormik.values.employmentType ?? ""]}
              onSelectionChange={([value]) => {
                profileFormik.setFieldValue("employmentType", value as string);
              }}
              onBlur={() => {
                profileFormik.setFieldTouched("employmentType", true);
              }}
            >
              {employmentTypeOptions.map((option) => (
                <SelectItem key={option.value}>{option.label}</SelectItem>
              ))}
            </Select>
            <DatePicker
              showMonthAndYearPickers
              isRequired
              label="birthdate"
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
                  ? `${pad(value.year, 4)}-${pad(value.month)}-${pad(
                      value.day
                    )}`
                  : null;
                profileFormik.setFieldValue("birthdate", val);
              }}
              onBlur={() => {
                profileFormik.setFieldTouched("birthdate", true);
              }}
            />
            <Select
              isRequired
              label="Gender"
              name="gender"
              placeholder="Select Gender"
              isInvalid={
                !!profileFormik.errors.gender && profileFormik.touched.gender
              }
              errorMessage={
                profileFormik.errors.gender && profileFormik.touched.gender
                  ? profileFormik.errors.gender
                  : ""
              }
              selectedKeys={[profileFormik.values.gender]}
              onSelectionChange={([value]) => {
                profileFormik.setFieldValue("gender", value as string);
              }}
              onBlur={() => {
                profileFormik.setFieldTouched("gender", true);
              }}
            >
              {genderOptions.map((option) => (
                <SelectItem key={option.value}>{option.label}</SelectItem>
              ))}
            </Select>
            <Input
              type="number"
              placeholder="Phone"
              name="phone"
              label="Phone"
              isInvalid={
                !!profileFormik.errors.phone && profileFormik.touched.phone
              }
              errorMessage={
                profileFormik.errors.phone && profileFormik.touched.phone
                  ? profileFormik.errors.phone
                  : ""
              }
              value={profileFormik.values.phone}
              onValueChange={(value) => {
                profileFormik.setFieldValue("phone", value);
              }}
              onBlur={() => {
                profileFormik.setFieldTouched("phone", true);
              }}
            />
          </div>

          <div className="h-4"></div>

          <Button
            type="submit"
            className="w-full"
            color="primary"
            isDisabled={profileFormik.isSubmitting || !profileFormik.isValid}
            isLoading={profileFormik.isSubmitting}
          >
            Update Profile
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;
