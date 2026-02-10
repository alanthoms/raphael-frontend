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

export const SQUADRON_OPTIONS = [
  {
    id: 5,
    value: "101st Reconnaissance Wing",
    label: "SQN-101: 101st Reconnaissance Wing",
    code: "SQN-101",
  },
  {
    id: 6,
    value: "502nd Electronic Strike Group",
    label: "SQN-502: 502nd Electronic Strike Group",
    code: "SQN-502",
  },
  {
    id: 7,
    value: "No. IX (Bomber) Squadron",
    label: "SQN-09: No. IX (Bomber) Squadron",
    code: "SQN-09",
  },
  {
    id: 8,
    value: "V-SQUAD: Rapid Response",
    label: "SQN-V: V-SQUAD: Rapid Response",
    code: "SQN-V",
  },
  {
    id: 9,
    value: "Maritime Guardian Unit",
    label: "SQN-SEA: Maritime Guardian Unit",
    code: "SQN-SEA",
  },
] as const;

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

export const BACKEND_BASE_URL = getEnvVar("VITE_BACKEND_BASE_URL");

export const BASE_URL = import.meta.env.VITE_API_URL;
export const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY;
export const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY;
export const REFRESH_TOKEN_URL = `${BASE_URL}/refresh-token`;

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
