import { salutationTypeOptions } from "@/constants/clientOptions";
import {
  employmentTypeOptions,
  genderOptions,
  roleOptions,
} from "@/constants/userOptions";
import type { CreateUser } from "@/types/user";
import { pad } from "@/utils/strings";
import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Input,
  Select,
  SelectItem,
  SelectSection,
} from "@heroui/react";
import type { FormikState } from "formik";
import { CalendarDate } from "@internationalized/date";
import { useNavigate } from "react-router";

interface StaffInfoProps {
  handleSubmit: () => void;
  setFieldValue: (field: string, value: CreateUser[keyof CreateUser]) => void;
  errors: FormikState<CreateUser>["errors"];
  touched: FormikState<CreateUser>["touched"];
  values: CreateUser;
  setFieldTouched: (field: string, value: boolean) => void;
  birthdate: Date | null;
  isPending: boolean;
  mode: "add" | "update";
  staffId?: string;
}

const StaffInfo = ({
  staffId,
  birthdate,
  isPending,
  mode = "add",
  handleSubmit,
  setFieldValue,
  errors,
  touched,
  values,
  setFieldTouched,
}: StaffInfoProps) => {
  const navigate = useNavigate();

  return (
    <form
      className="p-4 mx-auto shadow-lg rounded-lg bg-content1"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <h1 className="text-2xl font-bold">
        {mode === "add" ? "Add" : "Update"} Staff
      </h1>
      <div className="h-8"></div>

      <div className="flex">
        <span className="flex-1">
          Name <span className="text-sm text-danger">*</span>:
        </span>
        <div className="flex-5">
          <Checkbox
            size="sm"
            isSelected={!!values?.salutation}
            onValueChange={(value) => {
              if (value) {
                setFieldValue("salutation", "Mr");
              } else {
                setFieldValue("salutation", undefined);
              }
            }}
          >
            Use salutation
          </Checkbox>
          <div className="h-8"></div>
          <Select
            isDisabled={values?.salutation === undefined}
            label=""
            name="salutation"
            placeholder="Select salutation"
            className="w-72"
            isInvalid={!!errors?.salutation && touched?.salutation}
            errorMessage={
              errors?.salutation && touched?.salutation
                ? errors?.salutation
                : ""
            }
            selectedKeys={[values?.salutation || ""]}
            onSelectionChange={([value]) => {
              setFieldValue("salutation", value as string);
            }}
            onBlur={() => {
              setFieldTouched("salutation", true);
            }}
            classNames={{
              trigger: "cursor-pointer",
            }}
          >
            {salutationTypeOptions.map((option) => (
              <SelectItem key={option.label}>{option.label}</SelectItem>
            ))}
          </Select>
          <div className="h-8"></div>
          <div className="flex gap-8">
            <Input
              label=""
              type="text"
              placeholder="First Name"
              name="firstName"
              isInvalid={!!errors.firstName && touched.firstName}
              errorMessage={
                errors.firstName && touched.firstName ? errors.firstName : ""
              }
              value={values.firstName}
              onValueChange={(value) => {
                setFieldValue("firstName", value);
              }}
              onBlur={() => {
                setFieldTouched("firstName", true);
              }}
            />
            <Input
              label=""
              type="text"
              placeholder="Middle Name"
              name="middleName"
              isInvalid={!!errors.middleName && touched.middleName}
              errorMessage={
                errors.middleName && touched.middleName ? errors.middleName : ""
              }
              value={values.middleName}
              onValueChange={(value) => {
                setFieldValue("middleName", value);
              }}
              onBlur={() => {
                setFieldTouched("middleName", true);
              }}
            />
            <Input
              label=""
              type="text"
              placeholder="Last Name"
              name="lastName"
              isInvalid={!!errors.lastName && touched.lastName}
              errorMessage={
                errors.lastName && touched.lastName ? errors.lastName : ""
              }
              value={values.lastName}
              onValueChange={(value) => {
                setFieldValue("lastName", value);
              }}
              onBlur={() => {
                setFieldTouched("lastName", true);
              }}
            />
          </div>
        </div>
      </div>
      <div className="h-8"></div>
      <div className="flex items-center">
        <span className="flex-1">Preferred Name:</span>
        <Input
          className="flex-5"
          type="text"
          placeholder="Preferred Name"
          name="preferredName"
          isInvalid={!!errors.preferredName && touched.preferredName}
          errorMessage={
            errors.preferredName && touched.preferredName
              ? errors.preferredName
              : ""
          }
          value={values.preferredName}
          onValueChange={(value) => {
            setFieldValue("preferredName", value);
          }}
          onBlur={() => {
            setFieldTouched("preferredName", true);
          }}
        />
      </div>
      <div className="h-8"></div>
      <div className="flex items-center">
        <span className="flex-1">Gender:</span>
        <div className="flex-5 flex justify-between gap-10 items-center">
          <Select
            label=""
            name="gender"
            placeholder="Gender"
            className="w-72"
            isInvalid={!!errors.gender && touched.gender}
            errorMessage={errors.gender && touched.gender ? errors.gender : ""}
            selectedKeys={[values.gender || ""]}
            onSelectionChange={([value]) => {
              setFieldValue("gender", value as string);
            }}
            onBlur={() => {
              setFieldTouched("gender", true);
            }}
          >
            {genderOptions.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
          <div className="items-center flex gap-4">
            <span>Date of Birth:</span>
            <DatePicker
              className="w-120"
              showMonthAndYearPickers
              label=""
              name="birthdate"
              isInvalid={!!errors.birthdate && touched.birthdate}
              errorMessage={
                errors.birthdate && touched.birthdate ? errors.birthdate : ""
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
                setFieldValue("birthdate", val as string);
              }}
              onBlur={() => {
                setFieldTouched("birthdate", true);
              }}
            />
          </div>
        </div>
      </div>
      <div className="h-8"></div>
      <div className="flex items-center">
        <span className="flex-1">Address:</span>
        <Input
          className="flex-5"
          label=""
          type="text"
          placeholder="Address"
          name="address"
          isInvalid={!!errors.address && touched.address}
          errorMessage={errors.address && touched.address ? errors.address : ""}
          value={values.address}
          onValueChange={(value) => {
            setFieldValue("address", value);
          }}
          onBlur={() => {
            setFieldTouched("address", true);
          }}
        />
      </div>
      <div className="h-8"></div>
      <div className="flex items-center">
        <span className="flex-1">Contact:</span>
        <div className="flex-5 flex justify-between gap-12 items-center">
          <Input
            className="flex-5"
            label=""
            type="text"
            placeholder="Mobile Number"
            name="mobileNumber"
            isInvalid={!!errors.mobileNumber && touched.mobileNumber}
            errorMessage={
              errors.mobileNumber && touched.mobileNumber
                ? errors.mobileNumber
                : ""
            }
            value={values.mobileNumber}
            onValueChange={(value) => {
              setFieldValue("mobileNumber", value);
            }}
            onBlur={() => {
              setFieldTouched("mobileNumber", true);
            }}
          />
          <Input
            className="flex-5"
            label=""
            type="text"
            placeholder="Phone Number"
            name="phoneNumber"
            isInvalid={!!errors.phoneNumber && touched.phoneNumber}
            errorMessage={
              errors.phoneNumber && touched.phoneNumber
                ? errors.phoneNumber
                : ""
            }
            value={values.phoneNumber}
            onValueChange={(value) => {
              setFieldValue("phoneNumber", value);
            }}
            onBlur={() => {
              setFieldTouched("phoneNumber", true);
            }}
          />
        </div>
      </div>
      <div className="h-8"></div>
      <div className="flex items-center">
        <span className="flex-1">
          Email <span className="text-sm text-danger">*</span>:
        </span>
        <Input
          className="flex-5"
          label=""
          type="text"
          placeholder="Email"
          name="email"
          isInvalid={!!errors.email && touched.email}
          errorMessage={errors.email && touched.email ? errors.email : ""}
          value={values.email}
          onValueChange={(value) => {
            setFieldValue("email", value);
          }}
          onBlur={() => {
            setFieldTouched("email", true);
          }}
        />
      </div>
      <div className="h-8"></div>
      <div className="flex items-center">
        <span className="flex-1">Languages:</span>
      </div>
      <div className="h-8"></div>
      <div className="flex items-center">
        <span className="flex-1">
          Employment Type <span className="text-sm text-danger">*</span>:{" "}
        </span>
        <div className="flex-5">
          <Select
            label=""
            name="employmentType"
            placeholder="Select employment type"
            classNames={{
              trigger: "cursor-pointer",
            }}
            selectedKeys={[values.employmentType || ""]}
            onSelectionChange={([value]) => {
              setFieldValue("employmentType", value as string);
            }}
            onBlur={() => {
              setFieldTouched("employmentType", true);
            }}
          >
            {employmentTypeOptions.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="h-8"></div>
      <div className="flex items-center">
        <span className="flex-1">
          Role <span className="text-sm text-danger">*</span>:{" "}
        </span>
        <div className="flex-5">
          <Select
            label=""
            name="role"
            size="sm"
            placeholder="Select role"
            selectionMode="single"
            isInvalid={!!errors.role && touched.role}
            selectedKeys={[values.role || ""]}
            onSelectionChange={([value]) => {
              setFieldValue("role", value as string);
            }}
            onBlur={() => {
              setFieldTouched("role", true);
            }}
            classNames={{
              trigger: "cursor-pointer",
            }}
          >
            <SelectSection showDivider title="">
              {roleOptions.carer.map((role) => (
                <SelectItem key={role.value}>{role.name}</SelectItem>
              ))}
            </SelectSection>

            <SelectSection title="Office User">
              {roleOptions.officer.map((role) => (
                <SelectItem key={role.value}>{role.name}</SelectItem>
              ))}
            </SelectSection>
          </Select>
        </div>
      </div>
      <div className="h-8"></div>
      <Divider />
      <div className="h-8"></div>
      <div className="flex justify-end gap-4">
        {mode === "add" ? (
          <></>
        ) : (
          <Button onPress={() => navigate(`/staffs/${staffId}`)}>Cancel</Button>
        )}
        <Button type="submit" color="primary" isLoading={isPending}>
          {mode === "add" ? "Create" : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default StaffInfo;
