import { useState } from "react";
import { addToast, Alert, Button, Input } from "@heroui/react";
import { Link, useNavigate } from "react-router";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import api from "@/services/api/http";
import { useQueryClient } from "@tanstack/react-query";
import { LOGIN_ERROR_CODE } from "@/constants/errorMsg";
import { AxiosError } from "axios";

const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const initialLoginValues = {
  email: "",
  password: "",
};

const ErrorMessages = {
  [LOGIN_ERROR_CODE.INVALID_REQUEST]: "Email or password is incorrect",
  [LOGIN_ERROR_CODE.INTERNAL_SERVER_ERROR]: "Internal server error",
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
      <div className="p-4 w-full max-w-2xl mx-auto shadow-lg grid grid-cols-2 gap-4 rounded-lg bg-content1">
        <div className="col-span-2 md:col-span-1 flex flex-col">
          <h1 className="text-2xl font-bold w-full text-center">Login</h1>
          <div className="h-8"></div>
          <Formik
            initialValues={initialLoginValues}
            onSubmit={async (values) => {
              // clear error
              setError(null);
              try {
                const response = await api.post("/api/v1/auth/login", values);
                addToast({
                  title: "Login successfully",
                  description: "Redirecting to home page...",
                  color: "success",
                  timeout: 2000,
                  isClosing: true,
                });
                localStorage.setItem("auth_token", response.token);
                navigate("/");
                queryClient.invalidateQueries({ queryKey: ["me"] });
              } catch (error) {
                console.log("🚀 ~ error:", error);
                if (error instanceof AxiosError) {
                  const errorCode = error.response?.data?.code;
                  const msg =
                    ErrorMessages[errorCode] ?? "Something went wrong";
                  setError(msg);
                } else {
                  setError("Something went wrong");
                }
              }
            }}
            validationSchema={loginSchema}
          >
            {({
              values,
              setFieldValue,
              setFieldTouched,
              isSubmitting,
              isValid,
              errors,
              touched,
            }) => {
              return (
                <Form>
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
                    label="Email"
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={values.email}
                    onValueChange={(value) => setFieldValue("email", value)}
                    onBlur={() => setFieldTouched("email", true)}
                    isInvalid={!!errors.email && touched.email}
                    errorMessage={
                      errors.email && touched.email ? errors.email : ""
                    }
                  />
                  <div className="h-4"></div>
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
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
                    name="password"
                    value={values.password}
                    onValueChange={(value) => setFieldValue("password", value)}
                    onBlur={() => setFieldTouched("password", true)}
                    isInvalid={!!errors.password && touched.password}
                    errorMessage={
                      errors.password && touched.password ? errors.password : ""
                    }
                  />
                  <div className="h-4"></div>
                  <span className="text-sm text-center">
                    Forgot password?{" "}
                    <Link
                      to="/auth/forgot-password"
                      className="text-primary hover:text-primary-400 active:text-primary-300"
                    >
                      Reset password
                    </Link>
                  </span>
                  <div className="h-8"></div>
                  <Button
                    className="w-full"
                    color="primary"
                    type="submit"
                    isDisabled={isSubmitting || !isValid}
                    isLoading={isSubmitting}
                  >
                    Login
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </div>
        <div className="hidden md:block w-full h-full">
          <img
            src="/images/graphs/login.png"
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
