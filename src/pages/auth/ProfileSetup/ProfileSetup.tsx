import { useEffect, useMemo } from "react";
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
import { genderOptions } from "@/constants/userOptions";
import api from "@/services/api/http";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { MultiSelect } from "@/components/multi-select/MultiSelect";
import { useGetLanguages } from "@/states/apis/languagues";
import { EMPTY_ARRAY } from "@/constants/empty";

import type { FC } from "react";

const schema = Yup.object({
  avatar: Yup.string(),
  firstName: Yup.string().required("First name is required"),
  middleName: Yup.string(),
  lastName: Yup.string().required("Last name is required"),
  preferredName: Yup.string(),
  mobile: Yup.string(),
  birthdate: Yup.date().required("birthdate is required"),
  gender: Yup.string()
    .oneOf(genderOptions.map((option) => option.value))
    .required("Gender is required"),
  languages: Yup.array().of(Yup.string()).optional(),
});

const initialValues = {
  avatar: "",
  firstName: "",
  middleName: "",
  lastName: "",
  preferredName: "",
  mobile: "",
  birthdate: "",
  gender: "",
  languages: [],
};

const ProfileSetup: FC = () => {
  const navigate = useNavigate();
  const { data: languages } = useGetLanguages();
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
        const res = await api.patch("/api/v1/me", values);
        queryClient.invalidateQueries({ queryKey: ["me"], stale: true });
        queryClient.setQueriesData({ queryKey: ["me"] }, res);
        navigate("/");
        addToast({
          title: "Profile updated",
          description: "Profile updated successfully",
          color: "success",
          timeout: 2000,
          isClosing: true,
        });
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

  const languageOptions = useMemo(() => {
    return languages?.map((language) => ({
      label: language.name,
      value: language.key,
    })) || EMPTY_ARRAY;
  }, [languages]);

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
              <Input
                type="number"
                placeholder="Mobile"
                name="mobile"
                label="Mobile"
                className="col-span-2"
                isInvalid={!!formik.errors.mobile && formik.touched.mobile}
                errorMessage={
                  formik.errors.mobile && formik.touched.mobile
                    ? formik.errors.mobile
                    : ""
                }
                value={formik.values.mobile}
                onValueChange={(value) => {
                  formik.setFieldValue("mobile", value);
                }}
                onBlur={() => {
                  formik.setFieldTouched("mobile", true);
                }}
              />
              <MultiSelect
                maxCount={1}
                label="Languages"
                // name="languages"
                placeholder="Select Languages"
                options={languageOptions}
                placement="top-end"
                className="col-span-2"
                classNames={{
                  content: "max-w-md",
                }}
                value={formik.values.languages || EMPTY_ARRAY}
                onValueChange={(value) => {
                  formik.setFieldValue("languages", value);
                }}

              />
              <Input
                className="col-span-2"
                type="text"
                placeholder="Address"
                name="address"
                label="Address"
                isInvalid={!!formik.errors.address && formik.touched.address}
                errorMessage={
                  formik.errors.address && formik.touched.address
                    ? formik.errors.address
                    : ""
                }
                value={formik.values.address}
                onValueChange={(value) => {
                  formik.setFieldValue("address", value);
                }}
                onBlur={() => {
                  formik.setFieldTouched("address", true);
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

export default ProfileSetup;
