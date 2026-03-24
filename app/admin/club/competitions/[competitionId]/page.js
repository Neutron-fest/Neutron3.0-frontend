"use client";

import { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useSnackbar } from "notistack";
import {
  useClubCompetitionDetail,
  useClubCompetitionFormResponses,
  useClubCompetitionRegistrations,
  useSubmitCompetitionEditProposal,
} from "@/src/hooks/api/useClub";
import { LoadingState } from "@/src/components/LoadingState";

const EditableInput = ({ label, value, onChange }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: 12, mb: 0.5 }}>
      {label}
    </Typography>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#f4f4f5",
        borderRadius: 8,
        padding: "10px 12px",
        fontSize: 14,
      }}
    />
  </Box>
);

export default function ClubCompetitionDetailPage() {
  const params = useParams();
  const competitionId = params?.competitionId;
  const { enqueueSnackbar } = useSnackbar();

  const { data: competition, isLoading: competitionLoading } =
    useClubCompetitionDetail(competitionId);
  const { data: registrations = [], isLoading: registrationsLoading } =
    useClubCompetitionRegistrations(competitionId);
  const { data: responses = [], isLoading: responsesLoading } =
    useClubCompetitionFormResponses(competitionId);
  const submitProposalMutation = useSubmitCompetitionEditProposal();

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [venueName, setVenueName] = useState("");
  const [summary, setSummary] = useState("");

  const loading =
    competitionLoading || registrationsLoading || responsesLoading;

  const initialValues = useMemo(() => {
    if (!competition) return null;
    return {
      title: competition.title || "",
      shortDescription: competition.shortDescription || "",
      venueName: competition.venueName || "",
    };
  }, [competition]);

  const handleSubmit = async () => {
    try {
      const payload = {
        title,
        shortDescription,
        venueName,
      };

      await submitProposalMutation.mutateAsync({
        competitionId,
        payload,
        summary,
        changeDescription: summary,
      });

      enqueueSnackbar("Edit proposal submitted", { variant: "success" });
      setSummary("");
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || error?.message || "Failed to submit",
        { variant: "error" },
      );
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!competition) {
    return (
      <Typography sx={{ color: "rgba(255,255,255,0.45)" }}>
        Competition not found.
      </Typography>
    );
  }

  const titleValue = title || initialValues?.title || "";
  const shortDescriptionValue =
    shortDescription || initialValues?.shortDescription || "";
  const venueNameValue = venueName || initialValues?.venueName || "";

  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Typography
        sx={{ color: "#f4f4f5", fontSize: 24, fontWeight: 700, mb: 1 }}
      >
        {competition.title}
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.45)", mb: 3 }}>
        Propose edits, view registrations, and inspect form responses.
      </Typography>

      <Box
        sx={{
          p: 2,
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 2,
          background: "rgba(255,255,255,0.02)",
          mb: 3,
        }}
      >
        <Typography sx={{ color: "#f4f4f5", fontWeight: 600, mb: 1.5 }}>
          Submit Edit Proposal
        </Typography>
        <EditableInput label="Title" value={titleValue} onChange={setTitle} />
        <EditableInput
          label="Short Description"
          value={shortDescriptionValue}
          onChange={setShortDescription}
        />
        <EditableInput
          label="Venue Name"
          value={venueNameValue}
          onChange={setVenueName}
        />
        <EditableInput label="Summary" value={summary} onChange={setSummary} />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitProposalMutation.isPending}
          style={{
            border: "1px solid rgba(168,85,247,0.35)",
            background: "rgba(168,85,247,0.2)",
            color: "#e9d5ff",
            borderRadius: 8,
            padding: "9px 14px",
            cursor: submitProposalMutation.isPending
              ? "not-allowed"
              : "pointer",
            fontWeight: 600,
          }}
        >
          {submitProposalMutation.isPending
            ? "Submitting..."
            : "Submit Proposal"}
        </button>
      </Box>

      <Box
        sx={{
          p: 2,
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 2,
          background: "rgba(255,255,255,0.02)",
          mb: 3,
        }}
      >
        <Typography sx={{ color: "#f4f4f5", fontWeight: 600, mb: 1.5 }}>
          Registrations ({registrations.length})
        </Typography>
        {registrations.slice(0, 25).map((registration) => (
          <Box
            key={registration.registrationId}
            sx={{
              py: 1,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              "&:first-of-type": { borderTop: "none", pt: 0 },
            }}
          >
            <Typography sx={{ color: "#f4f4f5", fontSize: 14 }}>
              {registration.name} ({registration.email})
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
              Status: {registration.status}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          p: 2,
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 2,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <Typography sx={{ color: "#f4f4f5", fontWeight: 600, mb: 1.5 }}>
          Form Responses ({responses.length})
        </Typography>
        {responses.slice(0, 25).map((response) => (
          <Box
            key={response.responseId}
            sx={{
              py: 1,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              "&:first-of-type": { borderTop: "none", pt: 0 },
            }}
          >
            <Typography sx={{ color: "#f4f4f5", fontSize: 14 }}>
              {response.fieldLabel}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
              {response.respondentName} •{" "}
              {response.value || JSON.stringify(response.jsonValue || "")}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
