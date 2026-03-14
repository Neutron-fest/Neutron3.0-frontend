"use client";

import { Controller, useWatch } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import { FieldGroup, FieldLabel, inputCss } from "./CompetitionBasicInfoStep";

const TOGGLE_LABELS = [
  {
    name: "registrationsOpen",
    label: "Registrations Open",
    description: "Allow new participants to register",
  },
  {
    name: "requiresApproval",
    label: "Requires Approval",
    description: "Teams need DH sign-off before joining",
  },
  {
    name: "autoApproveTeams",
    label: "Auto-Approve Teams",
    description: "Skip manual review, approve instantly",
  },
  {
    name: "isPaid",
    label: "Paid Event",
    description: "Participants must pay the registration fee",
  },
  {
    name: "perPerson",
    label: "Fee Per Person",
    description: "Charge fee per team member (not per team)",
  },
  {
    name: "attendanceRequired",
    label: "Attendance Required",
    description: "Track participant check-in on event day",
  },
];

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        border: "none",
        background: checked ? "rgba(168,85,247,0.7)" : "rgba(255,255,255,0.1)",
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.2s",
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 21 : 3,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
        }}
      />
    </button>
  );
}

export default function CompetitionRegistrationConfigStep({ control, errors }) {
  const competitionType = useWatch({ control, name: "type" });
  const isTeam = competitionType === "TEAM";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxHeight: "100%",
        overflowY: "auto",
        pr: 0.5,
      }}
    >
      {/* Numeric limits */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2.5 }}>
        <FieldGroup
          label="Registration Fee (₹)"
          error={errors.registrationFee}
          span={2}
        >
          <Controller
            name="registrationFee"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min="0"
                placeholder="0"
                style={inputCss}
              />
            )}
          />
        </FieldGroup>

        <FieldGroup label="Max Registrations" error={errors.maxRegistrations}>
          <Controller
            name="maxRegistrations"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min="1"
                placeholder="Unlimited"
                style={inputCss}
              />
            )}
          />
        </FieldGroup>

        {isTeam && (
          <>
            <FieldGroup label="Min Team Size" error={errors.minTeamSize}>
              <Controller
                name="minTeamSize"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="1"
                    placeholder="e.g. 2"
                    style={inputCss}
                  />
                )}
              />
            </FieldGroup>

            <FieldGroup label="Max Team Size" error={errors.maxTeamSize}>
              <Controller
                name="maxTeamSize"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="1"
                    placeholder="e.g. 5"
                    style={inputCss}
                  />
                )}
              />
            </FieldGroup>
          </>
        )}
      </Box>

      {/* Boolean toggles */}
      <Box
        sx={{
          borderRadius: "10px",
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        {TOGGLE_LABELS.map((item, i) => (
          <Controller
            key={item.name}
            name={item.name}
            control={control}
            render={({ field }) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2.5,
                  py: 1.75,
                  borderBottom:
                    i < TOGGLE_LABELS.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                  "&:hover": { background: "rgba(255,255,255,0.02)" },
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.8)",
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.3)",
                      fontFamily: "'DM Mono', monospace",
                      mt: 0.25,
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
                <Toggle checked={!!field.value} onChange={field.onChange} />
              </Box>
            )}
          />
        ))}
      </Box>
    </Box>
  );
}
