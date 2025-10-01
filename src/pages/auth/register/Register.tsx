import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { Link } from "react-router";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
      <div className="p-4 w-full max-w-2xl mx-auto shadow-lg grid grid-cols-2 gap-4 rounded-lg bg-content1">
        <div className="col-span-2 md:col-span-1 flex flex-col">
          <h1 className="text-2xl font-bold w-full text-center">Register</h1>
          <div className="h-8"></div>
          <Input label="Email" type="email" placeholder="Email" />
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
          />
          <div className="h-4"></div>
          <span className="text-sm text-center">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-primary hover:text-primary-400 active:text-primary-300"
            >
              Register
            </Link>
          </span>
          <div className="h-8"></div>
          <Button className="w-full" color="primary">
            Register
          </Button>
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

export default Register;
