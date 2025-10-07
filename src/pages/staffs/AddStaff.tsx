import { salutationTypeOptions } from "@/constants/clientOptions";
import {
  addToast,
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Input,
  Select,
  SelectItem,
  SelectSection,
} from "@heroui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { employmentTypeOptions, genderOptions } from "@/constants/userOptions";
import { isValid } from "date-fns";
import { pad } from "@/utils/strings";
import { CalendarDate } from "@internationalized/date";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import type { CreateUser } from "@/types/user";
import { ROLE_IDS } from "@/constants/roles";
import { createNewStaff } from "@/states/apis/staff";

const roleOptions = {
  carer: [{ name: "Carer", value: ROLE_IDS.CARER }],
  officer: [
    { name: "HR", value: ROLE_IDS.HR },
    { name: "Admin", value: ROLE_IDS.ADMIN },
    { name: "Coordinator", value: ROLE_IDS.COORDINATOR },
    { name: "Office Support", value: ROLE_IDS.OFFICE_SUPPORT },
  ],
};

const clientSchema = Yup.object({
  salutation: Yup.string()
    .oneOf(salutationTypeOptions.map((option) => option.label))
    .optional(),
  firstName: Yup.string().required("First name is required"),
  middleName: Yup.string(),
  lastName: Yup.string().required("Last name is required"),
  preferredName: Yup.string(),
  gender: Yup.string()
    .oneOf(
      genderOptions.map((option) => option.value),
      "Unknown gender"
    )
    .optional(),
  birthdate: Yup.date(),
  phoneNumber: Yup.string(),
  mobileNumber: Yup.string(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string()
    .oneOf(Object.values(ROLE_IDS))
    .required("Role is required"),
  employmentType: Yup.string()
    .oneOf(
      employmentTypeOptions.map((option) => option.value),
      "Unknown employment type"
    )
    .required("Employment type is required"),
});

const initialClientValues: CreateUser = {
  employmentType: "full_time",
  role: "",
  firstName: "",
  lastName: "",
  email: "",
};

const AddStaff = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createNewStaff,
    onSuccess: () => {
      addToast({
        title: "Create staff successful",
        color: "success",
        timeout: 2000,
        isClosing: true,
      });
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
      navigate("/staffs/list");
    },
    onError: () => {
      addToast({
        title: "Create staff failed",
        color: "danger",
        timeout: 2000,
        isClosing: true,
      });
    },
  });

  const formik = useFormik<CreateUser>({
    initialValues: initialClientValues,
    validationSchema: clientSchema,
    onSubmit: async (values) => {
      mutate(values);
    },
  });

  const birthdate =
    formik.values.birthdate && isValid(new Date(formik.values.birthdate))
      ? new Date(formik.values.birthdate)
      : null;

  return (
    <div className="container mx-auto mb-10">
      <form
        className="p-4 mx-auto shadow-lg rounded-lg bg-content1"
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
      >
        <h1 className="text-2xl font-bold">Add Staff</h1>
        <div className="h-8"></div>

        <div className="flex">
          <span className="flex-1">
            Name <span className="text-sm text-danger">*</span>:
          </span>
          <div className="flex-5">
            <Checkbox
              size="sm"
              isSelected={!!formik.values.salutation}
              onValueChange={(value) => {
                if (value) {
                  formik.setFieldValue("salutation", "Mr");
                } else {
                  formik.setFieldValue("salutation", undefined);
                }
              }}
            >
              Use salutation
            </Checkbox>
            <div className="h-8"></div>
            <Select
              isDisabled={formik.values.salutation === undefined}
              label=""
              name="salutation"
              placeholder="Select salutation"
              className="w-72"
              isInvalid={
                !!formik.errors.salutation && formik.touched.salutation
              }
              errorMessage={
                formik.errors.salutation && formik.touched.salutation
                  ? formik.errors.salutation
                  : ""
              }
              selectedKeys={[formik.values.salutation || ""]}
              onSelectionChange={([value]) => {
                formik.setFieldValue("salutation", value as string);
              }}
              onBlur={() => {
                formik.setFieldTouched("salutation", true);
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
                label=""
                type="text"
                placeholder="Middle Name"
                name="middleName"
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
                label=""
                type="text"
                placeholder="Last Name"
                name="lastName"
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
            isInvalid={
              !!formik.errors.preferredName && formik.touched.preferredName
            }
            errorMessage={
              formik.errors.preferredName && formik.touched.preferredName
                ? formik.errors.preferredName
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
              isInvalid={!!formik.errors.gender && formik.touched.gender}
              errorMessage={
                formik.errors.gender && formik.touched.gender
                  ? formik.errors.gender
                  : ""
              }
              selectedKeys={[formik.values.gender || ""]}
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
            <div className="items-center flex gap-4">
              <span>Date of Birth:</span>
              <DatePicker
                className="w-120"
                showMonthAndYearPickers
                label=""
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
              isInvalid={
                !!formik.errors.mobileNumber && formik.touched.mobileNumber
              }
              errorMessage={
                formik.errors.mobileNumber && formik.touched.mobileNumber
                  ? formik.errors.mobileNumber
                  : ""
              }
              value={formik.values.mobileNumber}
              onValueChange={(value) => {
                formik.setFieldValue("mobileNumber", value);
              }}
              onBlur={() => {
                formik.setFieldTouched("mobileNumber", true);
              }}
            />
            <Input
              className="flex-5"
              label=""
              type="text"
              placeholder="Phone Number"
              name="phoneNumber"
              isInvalid={
                !!formik.errors.phoneNumber && formik.touched.phoneNumber
              }
              errorMessage={
                formik.errors.phoneNumber && formik.touched.phoneNumber
                  ? formik.errors.phoneNumber
                  : ""
              }
              value={formik.values.phoneNumber}
              onValueChange={(value) => {
                formik.setFieldValue("phoneNumber", value);
              }}
              onBlur={() => {
                formik.setFieldTouched("phoneNumber", true);
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
              selectedKeys={[formik.values.employmentType || ""]}
              onSelectionChange={([value]) => {
                formik.setFieldValue("employmentType", value as string);
              }}
              onBlur={() => {
                formik.setFieldTouched("employmentType", true);
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
              isInvalid={!!formik.errors.role && formik.touched.role}
              selectedKeys={[formik.values.role || ""]}
              onSelectionChange={([value]) => {
                formik.setFieldValue("role", value as string);
              }}
              onBlur={() => {
                formik.setFieldTouched("role", true);
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
          <Button>Cancel</Button>
          <Button type="submit" color="primary" isLoading={isPending}>
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddStaff;
