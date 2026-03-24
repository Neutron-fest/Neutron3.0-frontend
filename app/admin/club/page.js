"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { useClubDashboard, useMyClubs } from "@/src/hooks/api/useClub";
import { LoadingState } from "@/src/components/LoadingState";

const StatCard = ({ label, value }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 2,
      border: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(255,255,255,0.02)",
    }}
  >
    <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: 12, mb: 0.5 }}>
      {label}
    </Typography>
    <Typography sx={{ color: "#f4f4f5", fontSize: 24, fontWeight: 700 }}>
      {value ?? 0}
    </Typography>
  </Box>
);

export default function ClubDashboardPage() {
  const { data: dashboard, isLoading: dashboardLoading } = useClubDashboard();
  const { data: clubs = [], isLoading: clubsLoading } = useMyClubs();

  if (dashboardLoading || clubsLoading) {
    return <LoadingState />;
  }

  return (
    <Box sx={{ maxWidth: 1100 }}>
      <Typography
        sx={{ color: "#f4f4f5", fontSize: 24, fontWeight: 700, mb: 1 }}
      >
        Club Dashboard
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.45)", mb: 3 }}>
        View your clubs, club competitions, and proposal activity.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard label="My Clubs" value={dashboard?.clubsCount} />
        <StatCard
          label="Club Competitions"
          value={dashboard?.competitionsCount}
        />
        <StatCard
          label="Pending Proposals"
          value={dashboard?.pendingProposalsCount}
        />
      </Box>

      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
          mb: 3,
        }}
      >
        <Typography sx={{ color: "#f4f4f5", fontWeight: 600, mb: 1.5 }}>
          Club Memberships
        </Typography>
        {clubs.length ? (
          clubs.map((club) => (
            <Box
              key={club.id}
              sx={{
                py: 1,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                "&:first-of-type": { borderTop: "none", pt: 0 },
              }}
            >
              <Typography sx={{ color: "#f4f4f5", fontWeight: 600 }}>
                {club.name}
              </Typography>
              <Typography
                sx={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}
              >
                Role: {club.memberRole}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography sx={{ color: "rgba(255,255,255,0.45)" }}>
            No club memberships found.
          </Typography>
        )}
      </Box>

      <Link href="/admin/club/competitions" style={{ textDecoration: "none" }}>
        <Box
          sx={{
            display: "inline-flex",
            px: 2,
            py: 1,
            borderRadius: 1.5,
            border: "1px solid rgba(168,85,247,0.35)",
            background: "rgba(168,85,247,0.12)",
            color: "#d8b4fe",
            fontWeight: 600,
          }}
        >
          Open Club Competitions
        </Box>
      </Link>
    </Box>
  );
}
