import { User, ShieldCheck, Cpu } from "lucide-react";

export const USER_ROLES = {
  OPERATOR: "operator",
  COMMANDER: "commander",
  ADMIN: "admin",
} as const;

export const ROLE_OPTIONS = [
  {
    value: USER_ROLES.OPERATOR,
    label: "Mission Operator",
    icon: User,
  },
  {
    value: USER_ROLES.COMMANDER,
    label: "Squadron Commander",
    icon: ShieldCheck,
  },
  {
    value: USER_ROLES.ADMIN,
    label: "System Admin",
    icon: Cpu,
  },
];

export const SQUADRONS = [
  "No. 216 Squadron",
  "No. 17 Test & Evaluation",
  "No. 31 Squadron",
  "No. 54 Squadron",
  "Leonardo Flight Systems",
  "RCO Rapid Prototyping Unit",
  "No. 1 Group Command",
] as const;

export const SQUADRON_OPTIONS = SQUADRONS.map((squadron) => ({
  value: squadron,
  label: squadron,
}));

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

//export const CLOUDINARY_UPLOAD_URL = getEnvVar("VITE_CLOUDINARY_UPLOAD_URL");
//export const CLOUDINARY_CLOUD_NAME = getEnvVar("VITE_CLOUDINARY_CLOUD_NAME");
export const BACKEND_BASE_URL = getEnvVar("VITE_BACKEND_BASE_URL");

export const BASE_URL = import.meta.env.VITE_API_URL;
export const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY;
export const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY;
export const REFRESH_TOKEN_URL = `${BASE_URL}/refresh-token`;
//export const CLOUDINARY_UPLOAD_PRESET = getEnvVar(
//  "VITE_CLOUDINARY_UPLOAD_PRESET",
//);

export const commanders = [
  {
    id: "1",
    name: "Wg Cdr Sarah Lyons",
  },
  {
    id: "2",
    name: "Sqn Ldr James ‘Ace’ Miller",
  },
  {
    id: "3",
    name: "Dr. Elena Rossi (Leonardo Engineering)",
  },
];

export const acps = [
  {
    id: 1,
    name: "Electronic Warfare",
    code: "EW",
  },
  {
    id: 2,
    name: "Surveillance & Recon",
    code: "ISR",
  },
  {
    id: 3,
    name: "Kinetic Strike",
    code: "KINETIC",
  },
  {
    id: 4,
    name: "Decoy Swarm",
    code: "DECOY",
  },
];
