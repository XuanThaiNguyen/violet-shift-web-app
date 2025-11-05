import { useState } from "react";
import { addToast, Button, Input } from "@heroui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/services/api/http";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { LOGIN_ERROR_CODE } from "@/constants/errorMsg";
import { AxiosError } from "axios";

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

const ErrorMessages = {
  [LOGIN_ERROR_CODE.INVALID_REQUEST]: "Password update failed",
  [LOGIN_ERROR_CODE.INVALID_CURRENT_PASSWORD]: "Current password is incorrect",
  [LOGIN_ERROR_CODE.INTERNAL_SERVER_ERROR]: "Internal server error",
};

const PasswordUpdate = ({ changeToInfo }: { changeToInfo: () => void }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const profileFormik = useFormik({
    initialValues: initialPasswordValues,
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      try {
        await api.post("/api/v1/auth/update-password", values);
        addToast({
          title: "Password updated",
          color: "success",
          timeout: 2000,
          isClosing: true,
        });
        changeToInfo();
      } catch (error) {
        let msg = "Something went wrong";
        if (error instanceof AxiosError) {
          const errorCode = error.response?.data?.code;
          msg = ErrorMessages[errorCode] ?? "Something went wrong";
        }
        addToast({
          title: "Password update failed",
          description: msg,
          color: "danger",
          timeout: 2000,
          isClosing: true,
        });
      }
    },
  });

  return (
    <div className="p-4 w-full mx-auto shadow-lg rounded-lg bg-content1">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold w-full text-center">
          Change Password
        </h1>
        <div className="h-8"></div>

        <form className="flex flex-col" onSubmit={profileFormik.handleSubmit}>
          <div className="flex flex-col gap-y-4 gap-x-2">
            <Input
              isRequired
              type={showCurrentPassword ? "text" : "password"}
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
              endContent={
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              }
            />
            <Input
              isRequired
              type={showPassword ? "text" : "password"}
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
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              }
            />
            <Input
              isRequired
              type={showConfirmPassword ? "text" : "password"}
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
              endContent={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              }
            />
          </div>

          <div className="h-6"></div>

          <Button
            type="submit"
            color="primary"
            className="self-end"
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
