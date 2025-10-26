import { useState } from "react";
import { Alert, Button, Input } from "@heroui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LOGIN_ERROR_CODE } from "@/constants/errorMsg";
import api from "@/services/api/http";
import { AxiosError } from "axios";
import Countdown from "react-countdown";

import type { FC } from "react";
import { pad } from "@/utils/strings";

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
  [LOGIN_ERROR_CODE.TOO_MANY_REQUESTS]:
    "Too many requests, please try again later",
};

const ForgotPassword: FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    onSubmit: async (values) => {
      // clear error and success
      setError(null);
      setSuccess(null);
      try {
        const response = await api.post("/api/v1/auth/forgot-password", values);
        const _retryAfter = response?.retryAfter;
        setRetryAfter(_retryAfter);
        setSuccess(
          "Email sent successfully. Please check your email for the reset password link."
        );
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 429) {
            const _retryAfter = error.response?.data?.data?.retryAfter;
            setRetryAfter(_retryAfter);
            setError(ErrorMessages[LOGIN_ERROR_CODE.TOO_MANY_REQUESTS]);
            return;
          }

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
            {retryAfter ? (
              <div className="flex items-center gap-1 justify-center italic">
                <span className="text-sm">Try again in:</span>
                <Countdown
                  date={retryAfter}
                  onComplete={() => setRetryAfter(null)}
                  renderer={(props) => {
                    return <span className="text-sm"> {pad(props.minutes, 2)}:{pad(props.seconds, 2)}</span>;
                  }}
                />
              </div>
            ) : (
              <Button
                type="submit"
                className="w-full"
                color="primary"
                isDisabled={formik.isSubmitting || !formik.isValid}
                isLoading={formik.isSubmitting}
              >
                Send Reset Password Email
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
