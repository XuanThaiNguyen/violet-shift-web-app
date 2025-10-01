import { Button, DatePicker, Input, Select, SelectItem } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { useFormik } from "formik";
import * as Yup from "yup";
import { isValid } from "date-fns";
import { pad } from "@/utils/strings";

import { type FC } from "react";

const schema = Yup.object({
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

const initialValues = {
  avatar: "",
  firstName: "",
  lastName: "",
  preferredName: "",
  phone: "",
  birthday: "",
  gender: "",
};

const Profile: FC = () => {
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      console.log("🚀 ~ values:", values);
      formik.resetForm();
    },
  });

  const birthday = isValid(new Date(formik.values.birthday))
    ? new Date(formik.values.birthday)
    : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
      <div className="p-4 w-full max-w-lg mx-auto shadow-lg rounded-lg bg-content1">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold w-full text-center">
            Profile setup
          </h1>
          <div className="h-8"></div>

          {/* avatar */}
          <div className="w-16 h-16 bg-gray-300 rounded-md"></div>
          <div className="h-4"></div>

          <form className="" onSubmit={formik.handleSubmit}>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-y-4 gap-x-2">
              <Input
                isRequired
                type="text"
                placeholder="First Name"
                name="firstName"
                label="First Name"
                isInvalid={
                  !!formik.errors.firstName && formik.touched.firstName
                }
                errorMessage={
                  formik.errors.firstName && formik.touched.firstName
                    ? formik.errors.firstName
                    : ""
                }
                value={formik.values.firstName}
                onValueChange={(value) => {
                  formik.setFieldValue("firstName", value);
                }}
                onBlur={() => {
                  formik.setFieldTouched("firstName", true);
                }}
              />
              <Input
                isRequired
                type="text"
                placeholder="Last Name"
                name="lastName"
                label="Last Name"
                isInvalid={!!formik.errors.lastName && formik.touched.lastName}
                errorMessage={
                  formik.errors.lastName && formik.touched.lastName
                    ? formik.errors.lastName
                    : ""
                }
                value={formik.values.lastName}
                onValueChange={(value) => {
                  formik.setFieldValue("lastName", value);
                }}
                onBlur={() => {
                  formik.setFieldTouched("lastName", true);
                }}
              />
              <Input
                type="text"
                placeholder="Preferred Name"
                name="preferredName"
                label="Preferred Name"
                isInvalid={
                  !!formik.errors.preferredName && formik.touched.preferredName
                }
                errorMessage={
                  formik.errors.preferredName && formik.touched.preferredName
                    ? formik.errors.firstName
                    : ""
                }
                value={formik.values.preferredName}
                onValueChange={(value) => {
                  formik.setFieldValue("preferredName", value);
                }}
                onBlur={() => {
                  formik.setFieldTouched("preferredName", true);
                }}
              />
              <DatePicker
                showMonthAndYearPickers
                isRequired
                label="Birthday"
                name="birthday"
                isInvalid={!!formik.errors.birthday && formik.touched.birthday}
                errorMessage={
                  formik.errors.birthday && formik.touched.birthday
                    ? formik.errors.birthday
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
                  formik.setFieldValue("birthday", val);
                }}
                onBlur={() => {
                  formik.setFieldTouched("birthday", true);
                }}
              />
              <Select
                isRequired
                label="Gender"
                name="gender"
                placeholder="Select Gender"
                isInvalid={!!formik.errors.gender && formik.touched.gender}
                errorMessage={
                  formik.errors.gender && formik.touched.gender
                    ? formik.errors.gender
                    : ""
                }
                value={formik.values.gender}
                onSelectionChange={([value]) => {
                  formik.setFieldValue("gender", value as string);
                }}
                onBlur={() => {
                  formik.setFieldTouched("gender", true);
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
                isInvalid={!!formik.errors.phone && formik.touched.phone}
                errorMessage={
                  formik.errors.phone && formik.touched.phone
                    ? formik.errors.phone
                    : ""
                }
                value={formik.values.phone}
                onValueChange={(value) => {
                  formik.setFieldValue("phone", value);
                }}
                onBlur={() => {
                  formik.setFieldTouched("phone", true);
                }}
              />
            </div>

            <div className="h-4"></div>

            <Button
              type="submit"
              className="w-full"
              color="primary"
              isDisabled={formik.isSubmitting || !formik.isValid}
              isLoading={formik.isSubmitting}
            >
              Update Profile
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
