import { Input } from "@heroui/react";
import React from "react";

const AddClient = () => {
  return (
    <div className="p-4 w-full">
      <div className="p-4 mx-auto shadow-lg rounded-lg bg-content1">
        <Input
          isRequired
          type="text"
          placeholder="First Name"
          name="firstName"
          label="First Name"
          variant="bordered"
          // isInvalid={
          //   !!profileFormik.errors.firstName &&
          //   profileFormik.touched.firstName
          // }
          // errorMessage={
          //   profileFormik.errors.firstName &&
          //   profileFormik.touched.firstName
          //     ? profileFormik.errors.firstName
          //     : ""
          // }
          value={"1"}
          // onValueChange={(value) => {
          //   profileFormik.setFieldValue("firstName", value);
          // }}
          // onBlur={() => {
          //   profileFormik.setFieldTouched("firstName", true);
          // }}
        />
      </div>
    </div>
  );
};

export default AddClient;
