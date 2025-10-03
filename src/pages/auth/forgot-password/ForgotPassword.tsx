import { useState } from "react";
import { Alert, Button, Input } from "@heroui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LOGIN_ERROR_CODE } from "@/constants/errorMsg";
import api from "@/services/api/http";
import { AxiosError } from "axios";

import type { FC } from "react";

const schema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const initialValues = {
  email: "",
};

const ErrorMessages = {
  [LOGIN_ERROR_CODE.INVALID_REQUEST]: "Email is required",
  [LOGIN_ERROR_CODE.USER_NOT_FOUND]: "Cannot find user with this email",
  [LOGIN_ERROR_CODE.INTERNAL_SERVER_ERROR]: "Internal server error",
};

const ForgotPassword: FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    onSubmit: async (values) => {

      // clear error and success
      setError(null);
      setSuccess(null);
      try {
        await api.post("/api/v1/auth/forgot-password", values);
        setSuccess(
          "Email sent successfully. Please check your email for the reset password link."
        );
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
      <div className="p-4 w-full max-w-md mx-auto shadow-lg rounded-lg bg-content1">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold w-full text-center">
            Forgot Password
          </h1>
          <div className="h-8"></div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
          >
            {success && (
              <>
                <Alert
                  hideIcon
                  color="success"
                  title={success}
                  onClose={() => setSuccess(null)}
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

            {error && (
              <>
                <Alert
                  hideIcon
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
              type="email"
              placeholder="Password"
              name="email"
              label="Email"
              isInvalid={!!formik.errors.email && formik.touched.email}
              errorMessage={
                formik.errors.email && formik.touched.email
                  ? formik.errors.email
                  : ""
              }
              value={formik.values.email}
              onValueChange={(value) => {
                formik.setFieldValue("email", value);
              }}
              onBlur={() => {
                formik.setFieldTouched("email", true);
              }}
            />
            <div className="h-4"></div>
            <Button
              type="submit"
              className="w-full"
              color="primary"
              isDisabled={formik.isSubmitting || !formik.isValid}
              isLoading={formik.isSubmitting}
            >
              Send Reset Password Email
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
