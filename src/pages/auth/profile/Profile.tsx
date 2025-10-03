import { useEffect } from "react";
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
import { useMe } from "@/states/apis/me";
import { employmentTypeOptions, genderOptions } from "@/constants/userOptions";
import api from "@/services/api/http";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import type { FC } from "react";

const schema = Yup.object({
  avatar: Yup.string(),
  firstName: Yup.string().required("First name is required"),
  middleName: Yup.string(),
  lastName: Yup.string().required("Last name is required"),
  preferredName: Yup.string(),
  phone: Yup.string(),
  birthdate: Yup.date().required("birthdate is required"),
  gender: Yup.string()
    .oneOf(genderOptions.map((option) => option.value))
    .required("Gender is required"),
  employmentType: Yup.string()
    .oneOf(employmentTypeOptions.map((option) => option.value))
    .required("Employment type is required"),
});

const initialValues = {
  avatar: "",
  firstName: "",
  middleName: "",
  employmentType: "full_time",
  lastName: "",
  preferredName: "",
  phone: "",
  birthdate: "",
  gender: "",
};

const Profile: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useMe();
  const init = {
    ...initialValues,
    ...user,
  };
  const formik = useFormik({
    initialValues: init,
    validationSchema: schema,
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
        navigate("/");
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

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      formik.setValues(init);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, user]);

  const birthdate = isValid(new Date(formik.values.birthdate))
    ? new Date(formik.values.birthdate)
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
                type="text"
                placeholder="Middle Name"
                name="middleName"
                label="Middle Name"
                isInvalid={
                  !!formik.errors.middleName && formik.touched.middleName
                }
                errorMessage={
                  formik.errors.middleName && formik.touched.middleName
                    ? formik.errors.middleName
                    : ""
                }
                value={formik.values.middleName}
                onValueChange={(value) => {
                  formik.setFieldValue("middleName", value);
                }}
                onBlur={() => {
                  formik.setFieldTouched("middleName", true);
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
              <Select
                isRequired
                label="Employment Type"
                name="employmentType"
                placeholder="Select Employment Type"
                isInvalid={
                  !!formik.errors.employmentType &&
                  formik.touched.employmentType
                }
                errorMessage={
                  formik.errors.employmentType && formik.touched.employmentType
                    ? formik.errors.employmentType
                    : ""
                }
                selectedKeys={[formik.values.employmentType]}
                onSelectionChange={([value]) => {
                  formik.setFieldValue("employmentType", value as string);
                }}
                onBlur={() => {
                  formik.setFieldTouched("employmentType", true);
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
                  !!formik.errors.birthdate && formik.touched.birthdate
                }
                errorMessage={
                  formik.errors.birthdate && formik.touched.birthdate
                    ? formik.errors.birthdate
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
                  formik.setFieldValue("birthdate", val);
                }}
                onBlur={() => {
                  formik.setFieldTouched("birthdate", true);
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
                selectedKeys={[formik.values.gender]}
                onSelectionChange={([value]) => {
                  formik.setFieldValue("gender", value as string);
                }}
                onBlur={() => {
                  formik.setFieldTouched("gender", true);
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
