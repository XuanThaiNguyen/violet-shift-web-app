import { useState } from "react";
import { Alert, Button, Input } from "@heroui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import type { FC } from "react";
import axios, { AxiosError } from "axios";
import { LOGIN_ERROR_CODE } from "@/constants/errorMsg";

const schema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one digit")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
});

const initialValues = {
  password: "",
  confirmPassword: "",
};

const ErrorMessages = {
  [LOGIN_ERROR_CODE.INVALID_REQUEST]: "Change password failed",
  [LOGIN_ERROR_CODE.INTERNAL_SERVER_ERROR]: "Internal server error",
};

const NewPassword: FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    onSubmit: async (values) => {
      // clear error
      setError(null);

      try {
        // due to axios interceptor will replace headers, so we need to use axios directly
        const response = await axios.post(
          "/api/v1/auth/new-password",
          {
            ...values,
          },
          {
            headers: {
              Authorization: token ?? "",
            },
            baseURL: import.meta.env.VITE_API_URL,
          }
        );

        const auth_token = response.data?.data?.token;
        queryClient.invalidateQueries({ queryKey: ["me"] });
        if (token) {
          localStorage.setItem("auth_token", auth_token);
          navigate("/");
        } else {
          navigate("/auth/login");
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          const errorCode = error.response?.data?.code;
          const msg = ErrorMessages[errorCode] ?? "Something went wrong";
          setError(msg);
        } else {
          setError("Something went wrong");
        }
      }
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
      <div className="p-4 w-full max-w-md mx-auto shadow-lg rounded-lg bg-content1">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold w-full text-center">
            New Password
          </h1>
          <div className="h-8"></div>
          <form onSubmit={formik.handleSubmit}>
            {error && (
              <>
                <Alert
                  color="danger"
                  title={error}
                  onClose={() => setError(null)}
                  classNames={{
                    title: "min-h-0",
                    mainWrapper: "min-h-0 ms-0",
                    closeButton: "min-h-0 w-auto h-auto translate-y-0",
                    base: "items-center",
                  }}
                  isClosable
                />
                <div className="h-4"></div>
              </>
            )}
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              label="Password"
              isInvalid={!!formik.errors.password && formik.touched.password}
              errorMessage={
                formik.errors.password && formik.touched.password
                  ? formik.errors.password
                  : ""
              }
              value={formik.values.password}
              onValueChange={(value) => {
                formik.setFieldValue("password", value);
              }}
              onBlur={() => {
                formik.setFieldTouched("password", true);
              }}
              endContent={
                showPassword ? (
                  <EyeIcon
                    className="cursor-pointer"
                    size={20}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <EyeOffIcon
                    className="cursor-pointer"
                    size={20}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )
              }
            />
            <div className="h-4"></div>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              name="confirmPassword"
              label="Confirm Password"
              isInvalid={
                !!formik.errors.confirmPassword &&
                formik.touched.confirmPassword
              }
              errorMessage={
                formik.errors.confirmPassword && formik.touched.confirmPassword
                  ? formik.errors.confirmPassword
                  : ""
              }
              value={formik.values.confirmPassword}
              onValueChange={(value) => {
                formik.setFieldValue("confirmPassword", value);
              }}
              onBlur={() => {
                formik.setFieldTouched("confirmPassword", true);
              }}
              endContent={
                showConfirmPassword ? (
                  <EyeIcon
                    className="cursor-pointer"
                    size={20}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                ) : (
                  <EyeOffIcon
                    className="cursor-pointer"
                    size={20}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                )
              }
            />
            <div className="h-4"></div>
            <Button
              type="submit"
              className="w-full"
              color="primary"
              isDisabled={formik.isSubmitting || !formik.isValid}
              isLoading={formik.isSubmitting}
            >
              Change Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
