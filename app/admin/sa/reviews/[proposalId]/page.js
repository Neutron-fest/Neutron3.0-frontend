"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import {
  useApproveReviewProposal,
  useRejectReviewProposal,
  useReviewProposalDetail,
} from "@/src/hooks/api/useReviews";
import { LoadingState } from "@/src/components/LoadingState";

const getDiffRows = (beforeSnapshot = {}, afterSnapshot = {}) => {
  const keys = Array.from(
    new Set([
      ...Object.keys(beforeSnapshot || {}),
      ...Object.keys(afterSnapshot || {}),
    ]),
  );

  return keys
    .filter(
      (key) =>
        JSON.stringify(beforeSnapshot?.[key]) !==
        JSON.stringify(afterSnapshot?.[key]),
    )
    .map((key) => ({
      key,
      before: beforeSnapshot?.[key],
      after: afterSnapshot?.[key],
    }));
};

const displayValue = (value) => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

export default function ReviewDetailPage() {
  const { proposalId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: proposal, isLoading } = useReviewProposalDetail(proposalId);
  const approveMutation = useApproveReviewProposal();
  const rejectMutation = useRejectReviewProposal();

  const diffRows = useMemo(
    () => getDiffRows(proposal?.beforeSnapshot, proposal?.afterSnapshot),
    [proposal],
  );

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync({ proposalId, reviewNotes });
      enqueueSnackbar("Proposal approved", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || error?.message || "Failed to approve",
        { variant: "error" },
      );
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      enqueueSnackbar("Rejection reason is required", { variant: "warning" });
      return;
    }

    try {
      await rejectMutation.mutateAsync({
        proposalId,
        rejectionReason,
        reviewNotes,
      });
      enqueueSnackbar("Proposal rejected", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || error?.message || "Failed to reject",
        { variant: "error" },
      );
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!proposal) {
    return (
      <Typography sx={{ color: "rgba(255,255,255,0.45)" }}>
        Proposal not found.
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Typography
        sx={{ color: "#f4f4f5", fontSize: 24, fontWeight: 700, mb: 1 }}
      >
        Proposal Review
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.45)", mb: 2 }}>
        {proposal.competitionTitle} • {proposal.status}
      </Typography>

      <Box
        sx={{
          p: 2,
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 2,
          background: "rgba(255,255,255,0.02)",
          mb: 2,
        }}
      >
        <Typography sx={{ color: "#f4f4f5", fontWeight: 600, mb: 1.5 }}>
          Field Diff
        </Typography>

        {diffRows.length ? (
          diffRows.map((row) => (
            <Box
              key={row.key}
              sx={{
                py: 1,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                "&:first-of-type": { borderTop: "none", pt: 0 },
              }}
            >
              <Typography
                sx={{
                  color: "#f4f4f5",
                  fontWeight: 600,
                  fontSize: 13,
                  mb: 0.5,
                }}
              >
                {row.key}
              </Typography>
              <Typography sx={{ color: "#fca5a5", fontSize: 12 }}>
                Before: {displayValue(row.before)}
              </Typography>
              <Typography sx={{ color: "#86efac", fontSize: 12 }}>
                After: {displayValue(row.after)}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography sx={{ color: "rgba(255,255,255,0.45)" }}>
            No differences found.
          </Typography>
        )}
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
          Decision
        </Typography>

        <textarea
          value={reviewNotes}
          onChange={(event) => setReviewNotes(event.target.value)}
          placeholder="Review notes (optional)"
          style={{
            width: "100%",
            minHeight: 80,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#f4f4f5",
            borderRadius: 8,
            padding: 10,
            marginBottom: 10,
          }}
        />

        <input
          value={rejectionReason}
          onChange={(event) => setRejectionReason(event.target.value)}
          placeholder="Rejection reason (required for reject)"
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#f4f4f5",
            borderRadius: 8,
            padding: "10px 12px",
            marginBottom: 12,
          }}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <button
            type="button"
            onClick={handleApprove}
            disabled={
              approveMutation.isPending || proposal.status !== "PENDING"
            }
            style={{
              border: "1px solid rgba(34,197,94,0.35)",
              background: "rgba(34,197,94,0.15)",
              color: "#86efac",
              borderRadius: 8,
              padding: "9px 14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Approve
          </button>
          <button
            type="button"
            onClick={handleReject}
            disabled={rejectMutation.isPending || proposal.status !== "PENDING"}
            style={{
              border: "1px solid rgba(239,68,68,0.35)",
              background: "rgba(239,68,68,0.15)",
              color: "#fca5a5",
              borderRadius: 8,
              padding: "9px 14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reject
          </button>
        </Box>
      </Box>
    </Box>
  );
}
