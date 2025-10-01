import { Button, Input } from "@heroui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { type FC } from "react";

const passwordSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one digit")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm password is required"),
});

const initialPasswordValues = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
};

const PasswordUpdate: FC = () => {
  const profileFormik = useFormik({
    initialValues: initialPasswordValues,
    validationSchema: passwordSchema,
    onSubmit: (values) => {
      console.log("🚀 ~ values:", values);
      profileFormik.resetForm();
    },
  });

  return (
    <div className="p-4 w-full mx-auto shadow-lg rounded-lg bg-content1">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold w-full text-center">
          Change Password
        </h1>
        <div className="h-8"></div>

        <form className="" onSubmit={profileFormik.handleSubmit}>
          <div className="flex flex-col gap-y-4 gap-x-2">
            <Input
              isRequired
              type="text"
              placeholder="Current Password"
              name="currentPassword"
              label="Current Password"
              isInvalid={
                !!profileFormik.errors.currentPassword &&
                profileFormik.touched.currentPassword
              }
              errorMessage={
                profileFormik.errors.currentPassword &&
                profileFormik.touched.currentPassword
                  ? profileFormik.errors.currentPassword
                  : ""
              }
              value={profileFormik.values.currentPassword}
              onValueChange={(value) => {
                profileFormik.setFieldValue("currentPassword", value);
              }}
              onBlur={() => {
                profileFormik.setFieldTouched("currentPassword", true);
              }}
            />
            <Input
              isRequired
              type="text"
              placeholder="New Password"
              name="password"
              label="New Password"
              isInvalid={
                !!profileFormik.errors.password &&
                profileFormik.touched.password
              }
              errorMessage={
                profileFormik.errors.password && profileFormik.touched.password
                  ? profileFormik.errors.password
                  : ""
              }
              value={profileFormik.values.password}
              onValueChange={(value) => {
                profileFormik.setFieldValue("password", value);
              }}
              onBlur={() => {
                profileFormik.setFieldTouched("password", true);
              }}
            />
            <Input
              type="text"
              placeholder="Confirm Password"
              name="confirmPassword"
              label="Confirm Password"
              isInvalid={
                !!profileFormik.errors.confirmPassword &&
                profileFormik.touched.confirmPassword
              }
              errorMessage={
                profileFormik.errors.confirmPassword &&
                profileFormik.touched.confirmPassword
                  ? profileFormik.errors.confirmPassword
                  : ""
              }
              value={profileFormik.values.confirmPassword}
              onValueChange={(value) => {
                profileFormik.setFieldValue("confirmPassword", value);
              }}
              onBlur={() => {
                profileFormik.setFieldTouched("confirmPassword", true);
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
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PasswordUpdate;
