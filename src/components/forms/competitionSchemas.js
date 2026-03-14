import { z } from "zod";

export const EVENT_TYPES = ["COMPETITION", "WORKSHOP", "EVENT"];
export const COMPETITION_TYPES = ["SOLO", "TEAM"];
export const STATUS_OPTS = [
  "DRAFT",
  "OPEN",
  "CLOSED",
  "ARCHIVED",
  "CANCELLED",
  "POSTPONED",
];

// Fields validated per step (indices map to STEP_LABELS in modal)
export const STEP_FIELDS = [
  ["title", "shortDescription", "category", "eventType", "type", "status"],
  [
    "startTime",
    "endTime",
    "registrationDeadline",
    "venueName",
    "venueRoom",
    "venueFloor",
  ],
  ["rulesRichText"],
  [
    "registrationFee",
    "maxRegistrations",
    "minTeamSize",
    "maxTeamSize",
    "registrationsOpen",
    "requiresApproval",
    "autoApproveTeams",
    "attendanceRequired",
    "isPaid",
    "perPerson",
  ],
  [], // poster validated separately in the step component
];

const optCoercedInt = z
  .union([z.literal(""), z.string(), z.number()])
  .transform((v) => {
    if (v === "" || v === null || v === undefined) return undefined;
    const n = typeof v === "number" ? v : parseInt(String(v), 10);
    return isNaN(n) ? undefined : n;
  })
  .optional();

export const competitionSchema = z.object({
  // ── Step 1: Basic Info
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().optional(),
  category: z.string().optional(),
  eventType: z.enum(["COMPETITION", "WORKSHOP", "EVENT"]),
  type: z.enum(["SOLO", "TEAM"]),
  status: z.enum([
    "DRAFT",
    "OPEN",
    "CLOSED",
    "ARCHIVED",
    "CANCELLED",
    "POSTPONED",
  ]),

  // ── Step 2: Schedule & Venue
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  registrationDeadline: z.string().optional(),
  venueName: z.string().optional(),
  venueRoom: z.string().optional(),
  venueFloor: z.string().optional(),

  // ── Step 3: Rules
  rulesRichText: z.string().optional(),

  // ── Step 4: Registration Config
  registrationFee: z
    .union([z.literal(""), z.string(), z.number()])
    .transform((v) => {
      if (v === "" || v === undefined || v === null) return 0;
      const n = typeof v === "number" ? v : parseInt(String(v), 10);
      return isNaN(n) ? 0 : n;
    }),
  maxRegistrations: optCoercedInt,
  minTeamSize: optCoercedInt,
  maxTeamSize: optCoercedInt,
  registrationsOpen: z.boolean(),
  requiresApproval: z.boolean(),
  autoApproveTeams: z.boolean(),
  attendanceRequired: z.boolean(),
  isPaid: z.boolean(),
  perPerson: z.boolean(),
});

export const DEFAULT_VALUES = {
  title: "",
  shortDescription: "",
  category: "",
  eventType: "COMPETITION",
  type: "SOLO",
  status: "DRAFT",
  startTime: "",
  endTime: "",
  registrationDeadline: "",
  venueName: "",
  venueRoom: "",
  venueFloor: "",
  rulesRichText: "",
  registrationFee: 0,
  maxRegistrations: "",
  minTeamSize: "",
  maxTeamSize: "",
  registrationsOpen: true,
  requiresApproval: true,
  autoApproveTeams: false,
  attendanceRequired: false,
  isPaid: false,
  perPerson: false,
};

/** Build default values pre-filled from an existing competition object */
export function getEditDefaults(c) {
  const fmt = (d) => (d ? new Date(d).toISOString().slice(0, 16) : "");
  return {
    title: c.title ?? "",
    shortDescription: c.shortDescription ?? "",
    category: c.category ?? "",
    eventType: c.eventType ?? "COMPETITION",
    type: c.type ?? "SOLO",
    status: c.status ?? "DRAFT",
    startTime: fmt(c.startTime),
    endTime: fmt(c.endTime),
    registrationDeadline: fmt(c.registrationDeadline),
    venueName: c.venueName ?? "",
    venueRoom: c.venueRoom ?? "",
    venueFloor: c.venueFloor ?? "",
    rulesRichText: c.rulesRichText ?? "",
    registrationFee: c.registrationFee ?? 0,
    maxRegistrations: c.maxRegistrations ?? "",
    minTeamSize: c.minTeamSize ?? "",
    maxTeamSize: c.maxTeamSize ?? "",
    registrationsOpen: c.registrationsOpen ?? true,
    requiresApproval: c.requiresApproval ?? true,
    autoApproveTeams: c.autoApproveTeams ?? false,
    attendanceRequired: c.attendanceRequired ?? false,
    isPaid: c.isPaid ?? false,
    perPerson: c.perPerson ?? false,
  };
}
