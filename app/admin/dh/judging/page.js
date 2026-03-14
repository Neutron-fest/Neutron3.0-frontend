"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  ChevronDown,
  Star,
  Send,
  Trophy,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useSnackbar } from "notistack";
import {
  useMyJudgingCompetitions,
  useCompetitionRounds,
  usePendingJudges,
  useRoundLeaderboard,
  useAllScored,
  useSendLockRequest,
  useMarkTeamQualification,
} from "@/src/hooks/api/useJudging";
import { LoadingState } from "@/src/components/LoadingState";

// ────────────────────────────────────────────────────── helpers ──

const cellSx = { color: "#d4d4d8", borderColor: "#27272a" };
const headSx = { color: "#a1a1aa", borderColor: "#27272a", fontWeight: 600 };

// ─────────────────────────────── sub-component: leaderboard dialog ──

function LeaderboardDialog({ roundId, roundName, open, onClose }) {
  const { data: leaderboard = [], isLoading } = useRoundLeaderboard(
    open ? roundId : null,
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: "#0e0e0e",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#f4f4f5",
          fontWeight: 600,
          fontFamily: "'Syne', sans-serif",
          fontSize: 16,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        Leaderboard — {roundName}
      </DialogTitle>
      <DialogContent sx={{ pt: "16px !important" }}>
        {isLoading ? (
          <LoadingState message="Loading leaderboard…" />
        ) : leaderboard.length === 0 ? (
          <Typography sx={{ color: "#71717a", py: 2 }}>
            No scores available yet
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={headSx}>#</TableCell>
                  <TableCell sx={headSx}>Participant / Team</TableCell>
                  <TableCell sx={{ ...headSx, textAlign: "right" }}>
                    Score
                  </TableCell>
                  <TableCell sx={headSx}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard.map((entry, idx) => {
                  const name =
                    entry.team?.name ||
                    entry.teamName ||
                    entry.user?.name ||
                    entry.userName ||
                    `Entry ${idx + 1}`;
                  const score =
                    entry.totalScore ?? entry.score ?? entry.averageScore;
                  const qualified =
                    entry.qualificationStatus === "QUALIFIED" ||
                    entry.qualified === true;
                  const eliminated =
                    entry.qualificationStatus === "ELIMINATED" ||
                    entry.eliminated === true;
                  return (
                    <TableRow
                      key={entry.id || idx}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.02)",
                        },
                      }}
                    >
                      <TableCell sx={cellSx}>
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              idx === 0
                                ? "#fbbf24"
                                : idx === 1
                                  ? "#d1d5db"
                                  : idx === 2
                                    ? "#b45309"
                                    : "#71717a",
                            fontWeight: idx < 3 ? 700 : 400,
                          }}
                        >
                          {idx + 1}
                        </Typography>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#fff", fontWeight: 500 }}
                        >
                          {name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ ...cellSx, textAlign: "right" }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#a855f7", fontWeight: 700 }}
                        >
                          {score !== undefined && score !== null
                            ? Number(score).toFixed(2)
                            : "—"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={cellSx}>
                        {qualified && (
                          <Chip
                            label="Qualified"
                            size="small"
                            sx={{
                              backgroundColor: "#16a34a22",
                              color: "#4ade80",
                              fontSize: 10,
                            }}
                          />
                        )}
                        {eliminated && (
                          <Chip
                            label="Eliminated"
                            size="small"
                            sx={{
                              backgroundColor: "#dc262622",
                              color: "#f87171",
                              fontSize: 10,
                            }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "rgba(255,255,255,0.55)",
            textTransform: "none",
            fontFamily: "'Syne', sans-serif",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.1)",
            px: 2,
            "&:hover": {
              background: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255,255,255,0.2)",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ───────────────────────────────── sub-component: round card ──

function RoundCard({ round }) {
  const { enqueueSnackbar } = useSnackbar();
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  const roundId = round.id;
  const { data: pendingJudges = [], isLoading: pendingLoading } =
    usePendingJudges(roundId);
  const { data: allScored = false } = useAllScored(roundId);
  const { mutate: sendLockRequest, isPending: sendingLock } =
    useSendLockRequest();

  function handleLockRequest() {
    sendLockRequest(roundId, {
      onSuccess: () =>
        enqueueSnackbar("Lock request sent to SA", { variant: "success" }),
      onError: (err) =>
        enqueueSnackbar(
          err?.response?.data?.message || "Failed to send lock request",
          { variant: "error" },
        ),
    });
  }

  const totalJudges = round.totalJudges ?? round.judgesCount ?? "?";
  const scoredJudges =
    totalJudges !== "?" ? totalJudges - pendingJudges.length : undefined;
  const progress =
    typeof totalJudges === "number" && totalJudges > 0
      ? (scoredJudges / totalJudges) * 100
      : null;

  return (
    <Paper
      sx={{
        p: 2,
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "10px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        {/* Scoring progress */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>
              {round.name || `Round ${round.roundNumber ?? round.round ?? "?"}`}
            </Typography>
            {allScored ? (
              <Chip
                label="All Scored"
                size="small"
                icon={<CheckCircle2 size={10} />}
                sx={{
                  backgroundColor: "#16a34a22",
                  color: "#4ade80",
                  fontSize: 10,
                  "& .MuiChip-icon": { color: "#4ade80" },
                }}
              />
            ) : (
              <Chip
                label="In Progress"
                size="small"
                icon={<Clock size={10} />}
                sx={{
                  backgroundColor: "#92400e22",
                  color: "#fbbf24",
                  fontSize: 10,
                  "& .MuiChip-icon": { color: "#fbbf24" },
                }}
              />
            )}
          </Box>

          {progress !== null && (
            <Box sx={{ mb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography variant="caption" sx={{ color: "#71717a" }}>
                  Judge scoring progress
                </Typography>
                <Typography variant="caption" sx={{ color: "#a1a1aa" }}>
                  {scoredJudges}/{totalJudges}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#3f3f46",
                  "& .MuiLinearProgress-bar": { backgroundColor: "#a855f7" },
                }}
              />
            </Box>
          )}

          {/* Pending judges */}
          {pendingLoading ? (
            <Typography variant="caption" sx={{ color: "#71717a" }}>
              Loading…
            </Typography>
          ) : pendingJudges.length > 0 ? (
            <Box>
              <Typography
                variant="caption"
                sx={{ color: "#fbbf24", fontWeight: 600 }}
              >
                Waiting on {pendingJudges.length} judge
                {pendingJudges.length !== 1 ? "s" : ""}:
              </Typography>
              <Typography variant="caption" sx={{ color: "#71717a", ml: 0.5 }}>
                {pendingJudges
                  .map((j) => j.user?.name || j.name || "?")
                  .join(", ")}
              </Typography>
            </Box>
          ) : null}
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setLeaderboardOpen(true)}
            startIcon={<Trophy size={12} />}
            sx={{
              borderColor: "rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.65)",
              "&:hover": { borderColor: "#a855f7", color: "#a855f7" },
              textTransform: "none",
              fontSize: 11,
              fontFamily: "'Syne', sans-serif",
              borderRadius: "8px",
              whiteSpace: "nowrap",
            }}
          >
            Leaderboard
          </Button>
          <Tooltip
            title={
              !allScored
                ? "All judges must score before sending lock request"
                : ""
            }
          >
            <span>
              <Button
                size="small"
                variant="contained"
                onClick={handleLockRequest}
                disabled={!allScored || sendingLock}
                startIcon={
                  sendingLock ? (
                    <CircularProgress size={12} />
                  ) : (
                    <Send size={12} />
                  )
                }
                sx={{
                  backgroundColor: "#a855f7",
                  "&:hover": { backgroundColor: "#9333ea" },
                  "&.Mui-disabled": {
                    backgroundColor: "#3f3f46",
                    color: "#71717a",
                  },
                  textTransform: "none",
                  fontSize: 11,
                  fontFamily: "'Syne', sans-serif",
                  borderRadius: "8px",
                  whiteSpace: "nowrap",
                }}
              >
                Lock Request
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <LeaderboardDialog
        roundId={roundId}
        roundName={
          round.name || `Round ${round.roundNumber ?? round.round ?? "?"}`
        }
        open={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
      />
    </Paper>
  );
}

// ──────────────────────────────────── sub-component: competition panel ──

function CompetitionPanel({ competition }) {
  const compId = competition.id;
  const { data: rounds = [], isLoading: roundsLoading } =
    useCompetitionRounds(compId);

  return (
    <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      {roundsLoading ? (
        <LoadingState message="Loading rounds…" size="small" />
      ) : rounds.length === 0 ? (
        <Typography variant="body2" sx={{ color: "#52525b" }}>
          No rounds found for this competition
        </Typography>
      ) : (
        rounds.map((round) => <RoundCard key={round.id} round={round} />)
      )}
    </Box>
  );
}

// ──────────────────────────────────────────────── main page ──

export default function JudgingPage() {
  const { data: competitions = [], isLoading } = useMyJudgingCompetitions();

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "9px",
              background: "#111",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Star size={15} color="rgba(255,255,255,0.7)" />
          </Box>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
              color: "#f4f4f5",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Judging
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: 12,
            color: "rgba(255,255,255,0.3)",
            fontFamily: "'Syne', sans-serif",
            ml: 0.5,
          }}
        >
          Monitor scoring progress, view leaderboards and send lock requests
        </Typography>
      </Box>

      {isLoading ? (
        <LoadingState message="Loading your judging assignments…" />
      ) : competitions.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            background: "#0c0c0c",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px",
          }}
        >
          <Star size={40} color="#3f3f46" style={{ marginBottom: 12 }} />
          <Typography sx={{ color: "#71717a", mb: 1 }}>
            No judging assignments yet
          </Typography>
          <Typography variant="caption" sx={{ color: "#52525b" }}>
            You&apos;ll appear here when you&apos;re assigned as a judge on a
            competition
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {competitions.map((comp) => {
            const name = comp.name || comp.title || "Competition";
            const statusColor =
              comp.status === "OPEN"
                ? "#4ade80"
                : comp.status === "CLOSED"
                  ? "#fbbf24"
                  : "#a1a1aa";

            return (
              <Accordion
                key={comp.id}
                sx={{
                  background: "#0c0c0c",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px !important",
                  "&:before": { display: "none" },
                  "&.Mui-expanded": {
                    border: "1px solid rgba(168,85,247,0.35)",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ChevronDown size={20} color="#71717a" />}
                  sx={{
                    px: 3,
                    "& .MuiAccordionSummary-content": {
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Star size={20} color="#fff" />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#fff", fontWeight: 600, lineHeight: 1.3 }}
                    >
                      {name}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                      {comp.status && (
                        <Typography
                          variant="caption"
                          sx={{ color: statusColor, fontWeight: 600 }}
                        >
                          {comp.status}
                        </Typography>
                      )}
                      {comp.type && (
                        <Typography variant="caption" sx={{ color: "#52525b" }}>
                          · {comp.type}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  {comp.isHeadJudge && (
                    <Chip
                      label="Head Judge"
                      size="small"
                      sx={{
                        backgroundColor: "#fbbf2422",
                        color: "#fbbf24",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    />
                  )}
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3 }}>
                  <Divider
                    sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 2 }}
                  />
                  <CompetitionPanel competition={comp} />
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
