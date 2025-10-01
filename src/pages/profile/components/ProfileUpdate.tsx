import { Button, DatePicker, Input, Select, SelectItem } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { useFormik } from "formik";
import * as Yup from "yup";
import { isValid } from "date-fns";
import { pad } from "@/utils/strings";

import { type FC } from "react";

const profileSchema = Yup.object({
  avatar: Yup.string(),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  preferredName: Yup.string(),
  phone: Yup.string(),
  birthday: Yup.date().required("Birthday is required"),
  gender: Yup.string()
    .oneOf(["male", "female", "other"])
    .required("Gender is required"),
});

const initialProfileValues = {
  avatar: "",
  firstName: "",
  lastName: "",
  preferredName: "",
  phone: "",
  birthday: "",
  gender: "",
};

const ProfileUpdate: FC = () => {
  const profileFormik = useFormik({
    initialValues: initialProfileValues,
    validationSchema: profileSchema,
    onSubmit: (values) => {
      console.log("🚀 ~ values:", values);
      profileFormik.resetForm();
    },
  });

  const birthday = isValid(new Date(profileFormik.values.birthday))
    ? new Date(profileFormik.values.birthday)
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
                  ? profileFormik.errors.firstName
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
            <DatePicker
              showMonthAndYearPickers
              isRequired
              label="Birthday"
              name="birthday"
              isInvalid={
                !!profileFormik.errors.birthday &&
                profileFormik.touched.birthday
              }
              errorMessage={
                profileFormik.errors.birthday && profileFormik.touched.birthday
                  ? profileFormik.errors.birthday
                  : ""
              }
              value={
                birthday
                  ? new CalendarDate(
                      birthday.getFullYear(),
                      birthday.getMonth() + 1,
                      birthday.getDate()
                    )
                  : null
              }
              onChange={(value) => {
                const val = value
                  ? `${pad(value.year, 4)}-${pad(value.month)}-${pad(
                      value.day
                    )}`
                  : null;
                profileFormik.setFieldValue("birthday", val);
              }}
              onBlur={() => {
                profileFormik.setFieldTouched("birthday", true);
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
              value={profileFormik.values.gender}
              onSelectionChange={([value]) => {
                profileFormik.setFieldValue("gender", value as string);
              }}
              onBlur={() => {
                profileFormik.setFieldTouched("gender", true);
              }}
            >
              <SelectItem key="male">Male</SelectItem>
              <SelectItem key="female">Female</SelectItem>
              <SelectItem key="other">Other</SelectItem>
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
