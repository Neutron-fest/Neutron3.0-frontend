"use client";

import { Controller } from "react-hook-form";
import { Box } from "@mui/material";
import { FieldGroup, inputCss } from "./CompetitionBasicInfoStep";

export default function CompetitionScheduleVenueStep({ control, errors }) {
  const dateInputCss = {
    ...inputCss,
    colorScheme: "dark",
  };

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2.5 }}>
      {/* Start Time */}
      <FieldGroup label="Start Time" error={errors.startTime}>
        <Controller
          name="startTime"
          control={control}
          render={({ field }) => (
            <input type="datetime-local" {...field} style={dateInputCss} />
          )}
        />
      </FieldGroup>

      {/* End Time */}
      <FieldGroup label="End Time" error={errors.endTime}>
        <Controller
          name="endTime"
          control={control}
          render={({ field }) => (
            <input type="datetime-local" {...field} style={dateInputCss} />
          )}
        />
      </FieldGroup>

      {/* Registration Deadline — spans full width */}
      <FieldGroup
        label="Registration Deadline"
        error={errors.registrationDeadline}
        span={2}
      >
        <Controller
          name="registrationDeadline"
          control={control}
          render={({ field }) => (
            <input type="datetime-local" {...field} style={dateInputCss} />
          )}
        />
      </FieldGroup>

      {/* Venue Name — full width */}
      <FieldGroup label="Venue Name" error={errors.venueName} span={2}>
        <Controller
          name="venueName"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder="e.g. Main Auditorium"
              style={inputCss}
            />
          )}
        />
      </FieldGroup>

      {/* Room */}
      <FieldGroup label="Room" error={errors.venueRoom}>
        <Controller
          name="venueRoom"
          control={control}
          render={({ field }) => (
            <input {...field} placeholder="e.g. Room 201" style={inputCss} />
          )}
        />
      </FieldGroup>

      {/* Floor */}
      <FieldGroup label="Floor" error={errors.venueFloor}>
        <Controller
          name="venueFloor"
          control={control}
          render={({ field }) => (
            <input {...field} placeholder="e.g. 2nd Floor" style={inputCss} />
          )}
        />
      </FieldGroup>
    </Box>
  );
}
