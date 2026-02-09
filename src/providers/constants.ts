import { Acp } from "@/types";

export const MOCK_ACPS: Acp[] = [
  {
    id: 1,
    code: "NYX-A1",
    name: "Viper 01",
    squadron: "No. 216 Squadron",
    description:
      "High-speed autonomous wingman specialized in Suppressing Enemy Air Defenses (SEAD). Equipped with electronic jamming pods.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    code: "NYX-A2",
    name: "Viper 02",
    squadron: "No. 216 Squadron",
    description:
      "Escort platform configured for air-to-air collaborative combat. Integrated with Tempest-class sensor fusion.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    code: "NYX-B1",
    name: "Ghost Eye",
    squadron: "No. 54 Squadron",
    description:
      "Stealth ISR (Intelligence, Surveillance, and Reconnaissance) unit with 24-hour loiter capability and thermal imaging.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    code: "NYX-X1",
    name: "R&D Prototype 01",
    squadron: "Leonardo Flight Systems",
    description:
      "Experimental airframe testing next-gen AI decision-making algorithms for autonomous dogfighting.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    code: "NYX-T1",
    name: "Test Bed Alpha",
    squadron: "No. 17 Test & Evaluation",
    description:
      "Evaluations unit for multi-platform swarming logic and low-latency satellite communication links.",
    createdAt: new Date().toISOString(),
  },
];
