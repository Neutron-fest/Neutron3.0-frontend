"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { useClubCompetitions } from "@/src/hooks/api/useClub";
import { LoadingState } from "@/src/components/LoadingState";

export default function ClubCompetitionsPage() {
  const { data: competitions = [], isLoading } = useClubCompetitions();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Box sx={{ maxWidth: 1100 }}>
      <Typography
        sx={{ color: "#f4f4f5", fontSize: 24, fontWeight: 700, mb: 1 }}
      >
        Club Competitions
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.45)", mb: 3 }}>
        Competitions assigned to your clubs.
      </Typography>

      <Box
        sx={{
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 2,
          overflow: "hidden",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        {competitions.length ? (
          competitions.map((competition) => (
            <Box
              key={competition.id}
              sx={{
                p: 2,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                "&:first-of-type": { borderTop: "none" },
              }}
            >
              <Typography sx={{ color: "#f4f4f5", fontWeight: 600 }}>
                {competition.title}
              </Typography>
              <Typography
                sx={{ color: "rgba(255,255,255,0.45)", fontSize: 13, mb: 1 }}
              >
                {competition.eventType} • {competition.status}
              </Typography>
              <Link
                href={`/admin/club/competitions/${competition.id}`}
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
                  View Details
                </Box>
              </Link>
            </Box>
          ))
        ) : (
          <Box sx={{ p: 2 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.45)" }}>
              No competitions available for your clubs.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
