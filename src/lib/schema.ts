import * as Z from "zod";

export const personnelSchema = Z.object({
  name: Z.string().min(2, "Name is required"),
  code: Z.string().email("Code must be a valid email"),
  role: Z.enum(["admin", "commander", "operator"], {
    required_error: "Role is required",
  }),
  squadron: Z.string(),
  image: Z.string().optional(),
  imgcldPubId: Z.string().optional(),
});

export const acpSchema = Z.object({
  name: Z.string().min(2, "Name is required"),
  code: Z.string().min(2, "Code is required"),
  description: Z.string().min(2, "Description is required"),
  squadron: Z.string().min(2, "Squadron is required"),
});

export const operationalWindowSchema = Z.object({
  day: Z.string().min(1, "Day is required"),
  startTime: Z.string().min(1, "Start time is required"),
  endTime: Z.string().min(1, "End time is required"),
});

export const missionSchema = Z.object({
  name: Z.string()
    .min(2, "Mission name must be at least 2 characters")
    .max(50, "Mission name must be at most 50 characters"),
  description: Z.string({
    required_error: "Mission objectives are required",
  }).min(5, "Objectives must be at least 5 characters"),
  acpProfileId: Z.coerce
    .number({
      required_error: "ACP model selection is required",
      invalid_type_error: "ACP model selection is required",
    })
    .min(1, "ACP model selection is required"),
  commanderId: Z.string().min(1, "Authorizing Commander is required"),
  capacity: Z.coerce
    .number({
      required_error: "Unit capacity is required",
      invalid_type_error: "Unit capacity is required",
    })
    .min(1, "Must assign at least 1 unit"),
  status: Z.enum(["active", "inactive"]),
  bannerUrl: Z.string({
    required_error: "Mission profile image is required",
  }).min(1, "Mission profile image is required"),
  bannerCldPubId: Z.string({ required_error: "Reference ID is required" }).min(
    1,
    "Reference ID is required",
  ),
  authCode: Z.string().optional(),
  windows: Z.array(operationalWindowSchema).optional(),
});

export const missionAssignmentSchema = Z.object({
  missionId: Z.coerce
    .number({
      required_error: "Mission ID is required",
      invalid_type_error: "Mission ID is required",
    })
    .min(1, "Mission ID is required"),
  operatorId: Z.string().min(1, "Operator ID is required"),
});
