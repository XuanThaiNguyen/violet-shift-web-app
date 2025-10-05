import {
  maritialStatusOptions,
  salutationTypeOptions,
} from "@/constants/clientOptions";
import {
  addToast,
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { genderOptions } from "@/constants/userOptions";
import { isValid } from "date-fns";
import { pad } from "@/utils/strings";
import { CalendarDate } from "@internationalized/date";
import api from "@/services/api/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ClientSubmitValues, IClient } from "@/types/client";
import { useNavigate } from "react-router";

const clientSchema = Yup.object({
  useSalutation: Yup.boolean(),
  salutation: Yup.string().oneOf(
    salutationTypeOptions.map((option) => option.value)
  ),
  firstName: Yup.string(),
  middleName: Yup.string(),
  lastName: Yup.string(),
  displayName: Yup.string().required("Display name is required"),
  gender: Yup.string().oneOf(genderOptions.map((option) => option.value)),
  maritialStatus: Yup.string().oneOf(
    maritialStatusOptions.map((option) => option.value)
  ),
  birthdate: Yup.date(),
  phoneNumber: Yup.string(),
  mobileNumber: Yup.string(),
  email: Yup.string(),
  apartmentNumber: Yup.string(),
  religion: Yup.string(),
  status: Yup.string().oneOf(["prospect", "active", "inactive"]),
});

const initialClientValues: IClient = {
  useSalutation: false,
  salutation: "",
  firstName: "",
  middleName: "",
  lastName: "",
  displayName: "",
  address: "",
  birthdate: "",
  gender: "",
  maritialStatus: "",
  apartmentNumber: "",
  phoneNumber: "",
  mobileNumber: "",
  email: "",
  religion: "",
  nationality: "",
  status: "active",
};

const createNewClient = async (values: IClient) => {
  const res = await api.post("/api/v1/clients", values);
  return res.data;
};

const AddClient = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createNewClient,
    onSuccess: () => {
      addToast({
        title: "Create client successful",
        color: "success",
        timeout: 2000,
        isClosing: true,
      });
      navigate("/clients/list");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: () => {
      addToast({
        title: "Create client failed",
        color: "danger",
        timeout: 2000,
        isClosing: true,
      });
    },
  });

  const clientFormik = useFormik<IClient>({
    initialValues: initialClientValues,
    validationSchema: clientSchema,
    onSubmit: async (values) => {
      const { salutation, useSalutation, displayName, status, ...others } =
        values;

      const filteredValues = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(others).filter(([_, v]) => v !== "")
      ) as Partial<IClient>;

      const newValues: ClientSubmitValues = useSalutation
        ? {
            ...filteredValues,
            useSalutation,
            salutation,
            displayName,
            status,
          }
        : { ...filteredValues, useSalutation, displayName, status };

      mutate(newValues);
    },
  });

  const birthdate =
    clientFormik.values.birthdate &&
    isValid(new Date(clientFormik.values.birthdate))
      ? new Date(clientFormik.values.birthdate)
      : null;

  return (
    <div className="px-4 w-full">
      <form
        className="px-4 py-8 mx-auto shadow-lg rounded-lg bg-content1"
        onSubmit={(e) => {
          e.preventDefault();
          clientFormik.handleSubmit();
        }}
      >
        <div className="flex">
          <span className="flex-1">Name:</span>
          <div className="flex-5">
            <Checkbox
              defaultSelected
              size="sm"
              isRequired={!!clientFormik.errors.useSalutation}
              isSelected={clientFormik.values.useSalutation}
              onValueChange={(value) => {
                console.log("valuevalue", value);

                clientFormik.setFieldValue(
                  "useSalutation",
                  !clientFormik.values.useSalutation
                );
              }}
            >
              Use salutation
            </Checkbox>
            <div className="h-8"></div>
            <Select
              isDisabled={!clientFormik.values.useSalutation}
              label=""
              name="salutation"
              placeholder="Select salutation"
              className="w-72"
              isInvalid={
                !!clientFormik.errors.salutation &&
                clientFormik.touched.salutation
              }
              errorMessage={
                clientFormik.errors.salutation &&
                clientFormik.touched.salutation
                  ? clientFormik.errors.salutation
                  : ""
              }
              value={clientFormik.values.salutation}
              selectedKeys={[clientFormik.values.salutation || ""]}
              onSelectionChange={([value]) => {
                clientFormik.setFieldValue("salutation", value as string);
              }}
              onBlur={() => {
                clientFormik.setFieldTouched("salutation", true);
              }}
            >
              {salutationTypeOptions.map((option) => (
                <SelectItem key={option.value}>{option.label}</SelectItem>
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
                  !!clientFormik.errors.firstName &&
                  clientFormik.touched.firstName
                }
                errorMessage={
                  clientFormik.errors.firstName &&
                  clientFormik.touched.firstName
                    ? clientFormik.errors.firstName
                    : ""
                }
                value={clientFormik.values.firstName}
                onValueChange={(value) => {
                  clientFormik.setFieldValue("firstName", value);
                }}
                onBlur={() => {
                  clientFormik.setFieldTouched("firstName", true);
                }}
              />
              <Input
                label=""
                type="text"
                placeholder="Middle Name"
                name="middleName"
                isInvalid={
                  !!clientFormik.errors.middleName &&
                  clientFormik.touched.middleName
                }
                errorMessage={
                  clientFormik.errors.middleName &&
                  clientFormik.touched.middleName
                    ? clientFormik.errors.middleName
                    : ""
                }
                value={clientFormik.values.middleName}
                onValueChange={(value) => {
                  clientFormik.setFieldValue("middleName", value);
                }}
                onBlur={() => {
                  clientFormik.setFieldTouched("middleName", true);
                }}
              />
              <Input
                label=""
                type="text"
                placeholder="Last Name"
                name="lastName"
                isInvalid={
                  !!clientFormik.errors.lastName &&
                  clientFormik.touched.lastName
                }
                errorMessage={
                  clientFormik.errors.lastName && clientFormik.touched.lastName
                    ? clientFormik.errors.lastName
                    : ""
                }
                value={clientFormik.values.lastName}
                onValueChange={(value) => {
                  clientFormik.setFieldValue("lastName", value);
                }}
                onBlur={() => {
                  clientFormik.setFieldTouched("lastName", true);
                }}
              />
            </div>
          </div>
        </div>
        <div className="h-8"></div>
        <div className="flex items-center">
          <span className="flex-1">Display Name:</span>
          <Input
            className="flex-5"
            isRequired
            type="text"
            placeholder="Display Name"
            name="displayName"
            isInvalid={
              !!clientFormik.errors.displayName &&
              clientFormik.touched.displayName
            }
            errorMessage={
              clientFormik.errors.displayName &&
              clientFormik.touched.displayName
                ? clientFormik.errors.displayName
                : ""
            }
            value={clientFormik.values.displayName}
            onValueChange={(value) => {
              clientFormik.setFieldValue("displayName", value);
            }}
            onBlur={() => {
              clientFormik.setFieldTouched("displayName", true);
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
              isInvalid={
                !!clientFormik.errors.gender && clientFormik.touched.gender
              }
              errorMessage={
                clientFormik.errors.gender && clientFormik.touched.gender
                  ? clientFormik.errors.gender
                  : ""
              }
              selectedKeys={[clientFormik.values.gender || ""]}
              onSelectionChange={([value]) => {
                clientFormik.setFieldValue("gender", value as string);
              }}
              onBlur={() => {
                clientFormik.setFieldTouched("gender", true);
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
                  !!clientFormik.errors.birthdate &&
                  clientFormik.touched.birthdate
                }
                errorMessage={
                  clientFormik.errors.birthdate &&
                  clientFormik.touched.birthdate
                    ? clientFormik.errors.birthdate
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
                  clientFormik.setFieldValue("birthdate", val);
                }}
                onBlur={() => {
                  clientFormik.setFieldTouched("birthdate", true);
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
            isInvalid={
              !!clientFormik.errors.address && clientFormik.touched.address
            }
            errorMessage={
              clientFormik.errors.address && clientFormik.touched.address
                ? clientFormik.errors.address
                : ""
            }
            value={clientFormik.values.address}
            onValueChange={(value) => {
              clientFormik.setFieldValue("address", value);
            }}
            onBlur={() => {
              clientFormik.setFieldTouched("address", true);
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
                !!clientFormik.errors.mobileNumber &&
                clientFormik.touched.mobileNumber
              }
              errorMessage={
                clientFormik.errors.mobileNumber &&
                clientFormik.touched.mobileNumber
                  ? clientFormik.errors.mobileNumber
                  : ""
              }
              value={clientFormik.values.mobileNumber}
              onValueChange={(value) => {
                clientFormik.setFieldValue("mobileNumber", value);
              }}
              onBlur={() => {
                clientFormik.setFieldTouched("mobileNumber", true);
              }}
            />
            <Input
              className="flex-5"
              label=""
              type="text"
              placeholder="Phone Number"
              name="phoneNumber"
              isInvalid={
                !!clientFormik.errors.phoneNumber &&
                clientFormik.touched.phoneNumber
              }
              errorMessage={
                clientFormik.errors.phoneNumber &&
                clientFormik.touched.phoneNumber
                  ? clientFormik.errors.phoneNumber
                  : ""
              }
              value={clientFormik.values.phoneNumber}
              onValueChange={(value) => {
                clientFormik.setFieldValue("phoneNumber", value);
              }}
              onBlur={() => {
                clientFormik.setFieldTouched("phoneNumber", true);
              }}
            />
          </div>
        </div>
        <div className="h-8"></div>
        <div className="flex items-center">
          <span className="flex-1">Email:</span>
          <Input
            className="flex-5"
            label=""
            type="text"
            placeholder="Email"
            name="email"
            isInvalid={
              !!clientFormik.errors.email && clientFormik.touched.email
            }
            errorMessage={
              clientFormik.errors.email && clientFormik.touched.email
                ? clientFormik.errors.email
                : ""
            }
            value={clientFormik.values.email}
            onValueChange={(value) => {
              clientFormik.setFieldValue("email", value);
            }}
            onBlur={() => {
              clientFormik.setFieldTouched("email", true);
            }}
          />
        </div>
        <div className="h-8"></div>
        <div className="flex items-center">
          <span className="flex-1">Religion:</span>
          <Input
            className="flex-5"
            label=""
            type="text"
            placeholder="Religion"
            name="religion"
            isInvalid={
              !!clientFormik.errors.religion && clientFormik.touched.religion
            }
            errorMessage={
              clientFormik.errors.religion && clientFormik.touched.religion
                ? clientFormik.errors.religion
                : ""
            }
            value={clientFormik.values.religion}
            onValueChange={(value) => {
              clientFormik.setFieldValue("religion", value);
            }}
            onBlur={() => {
              clientFormik.setFieldTouched("religion", true);
            }}
          />
        </div>
        <div className="h-8"></div>
        <div className="flex items-center">
          <span className="flex-1">Nationality:</span>
          <Input
            className="flex-5"
            label=""
            type="text"
            placeholder="Nationality"
            name="nationality"
            isInvalid={
              !!clientFormik.errors.nationality &&
              clientFormik.touched.nationality
            }
            errorMessage={
              clientFormik.errors.nationality &&
              clientFormik.touched.nationality
                ? clientFormik.errors.nationality
                : ""
            }
            value={clientFormik.values.nationality}
            onValueChange={(value) => {
              clientFormik.setFieldValue("nationality", value);
            }}
            onBlur={() => {
              clientFormik.setFieldTouched("nationality", true);
            }}
          />
        </div>
        <div className="h-8"></div>
        <div className="flex items-center">
          <span className="flex-1">Maritial Status:</span>
          <div className="flex-5">
            <Select
              label=""
              name="maritialStatus"
              placeholder="Maritial Status"
              className="w-72"
              isInvalid={
                !!clientFormik.errors.maritialStatus &&
                clientFormik.touched.maritialStatus
              }
              errorMessage={
                clientFormik.errors.maritialStatus &&
                clientFormik.touched.maritialStatus
                  ? clientFormik.errors.maritialStatus
                  : ""
              }
              value={clientFormik.values.maritialStatus}
              selectedKeys={[clientFormik.values.maritialStatus || ""]}
              onSelectionChange={([value]) => {
                clientFormik.setFieldValue("maritialStatus", value as string);
              }}
              onBlur={() => {
                clientFormik.setFieldTouched("maritialStatus", true);
              }}
            >
              {maritialStatusOptions.map((option) => (
                <SelectItem key={option.value}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="h-8"></div>
        <div className="flex items-center">
          <span className="flex-1">Languages:</span>
        </div>
        <div className="h-8"></div>
        <div className="flex items-center">
          <span className="flex-1">Client Status:</span>
          <div className="flex-5">
            <Checkbox
              defaultSelected
              size="sm"
              isSelected={clientFormik.values.status === "prospect"}
              onValueChange={() => {
                clientFormik.setFieldValue(
                  "status",
                  clientFormik.values.status === "prospect"
                    ? "active"
                    : "prospect"
                );
              }}
            >
              Client is a prospect
            </Checkbox>
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

export default AddClient;
