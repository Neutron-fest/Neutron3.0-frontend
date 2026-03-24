"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useReviewProposals } from "@/src/hooks/api/useReviews";
import { LoadingState } from "@/src/components/LoadingState";

export default function ReviewsPage() {
  const [status, setStatus] = useState("PENDING");
  const { data, isLoading } = useReviewProposals({ status });

  const proposals = useMemo(() => data?.proposals || [], [data]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Box sx={{ maxWidth: 1100 }}>
      <Typography
        sx={{ color: "#f4f4f5", fontSize: 24, fontWeight: 700, mb: 1 }}
      >
        Competition Edit Reviews
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.45)", mb: 3 }}>
        Review pending club proposals and approve or reject them.
      </Typography>

      <Box sx={{ mb: 2 }}>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#f4f4f5",
            borderRadius: 8,
            padding: "8px 10px",
          }}
        >
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </Box>

      <Box
        sx={{
          borderRadius: 2,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
          overflow: "hidden",
        }}
      >
        {proposals.length ? (
          proposals.map((proposal) => (
            <Box
              key={proposal.id}
              sx={{
                p: 2,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                "&:first-of-type": { borderTop: "none" },
              }}
            >
              <Typography sx={{ color: "#f4f4f5", fontWeight: 600 }}>
                {proposal.competitionTitle}
              </Typography>
              <Typography
                sx={{ color: "rgba(255,255,255,0.45)", fontSize: 13, mb: 1 }}
              >
                {proposal.summary || "No summary"} • {proposal.status}
              </Typography>
              <Link
                href={`/admin/sa/reviews/${proposal.id}`}
                style={{ textDecoration: "none" }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 1,
                    border: "1px solid rgba(168,85,247,0.35)",
                    color: "#d8b4fe",
                    background: "rgba(168,85,247,0.12)",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Review Proposal
                </Box>
              </Link>
            </Box>
          ))
        ) : (
          <Box sx={{ p: 2 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.45)" }}>
              No proposals found.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
