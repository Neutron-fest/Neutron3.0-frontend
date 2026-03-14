"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  CircularProgress,
  TextField,
  MenuItem,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  InputAdornment,
  Alert,
} from "@mui/material";
import {
  UserCheck,
  Search,
  CheckCircle2,
  Users,
  BarChart3,
  Info,
} from "lucide-react";
import { useSnackbar } from "notistack";
import {
  useFestAttendanceStats,
  useCompetitionAttendanceStats,
  useMarkCompetitionAttendance,
  useSearchParticipants,
} from "@/src/hooks/api/useAttendance";
import { useCompetitions } from "@/src/hooks/api/useCompetitions";
import { LoadingState } from "@/src/components/LoadingState";

// ────────────────────────────────────────────────────── helpers ──

const inputSx = {
  "& .MuiOutlinedInput-root": {
    background: "rgba(255,255,255,0.04)",
    borderRadius: "8px",
    color: "rgba(255,255,255,0.9)",
    fontFamily: "'Syne', sans-serif",
    fontSize: 13,
    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.18)" },
    "&.Mui-focused fieldset": { borderColor: "rgba(168,85,247,0.75)" },
    "& input": {
      color: "rgba(255,255,255,0.9)",
      fontFamily: "'Syne', sans-serif",
      fontSize: 13,
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.38)",
    fontFamily: "'Syne', sans-serif",
    fontSize: 12,
    "&.Mui-focused": { color: "rgba(192,132,252,0.95)" },
  },
  "& .MuiSelect-icon": { color: "rgba(255,255,255,0.45)" },
};

function pct(attended, total) {
  if (!total) return 0;
  return Math.round((attended / total) * 100);
}

// ─────────────────────────────────── stat card ──

function StatCard({ icon: Icon, label, value, sub, accent = "#a855f7" }) {
  return (
    <Paper
      sx={{
        p: 3,
        background: "#0c0c0c",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          backgroundColor: `${accent}22`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={24} color={accent} />
      </Box>
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255,255,255,0.45)",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "#fff",
            fontWeight: 700,
            lineHeight: 1.3,
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {value}
        </Typography>
        {sub && (
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {sub}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

// ──────────────────────────────────────────────── main page ──

export default function AttendancePage() {
  const { enqueueSnackbar } = useSnackbar();

  // Competition selector for per-competition stats
  const [statsCompId, setStatsCompId] = useState("");

  // Mark attendance: competition + search
  const [markCompId, setMarkCompId] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [markingUserId, setMarkingUserId] = useState(null);
  const [markedIds, setMarkedIds] = useState(new Set());

  // Debounce search input
  const [debounceTimer, setDebounceTimer] = useState(null);
  function handleQueryChange(value) {
    setQuery(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const t = setTimeout(() => setDebouncedQuery(value), 400);
    setDebounceTimer(t);
  }

  // Data hooks
  const { data: competitions = [], isLoading: compsLoading } =
    useCompetitions();
  const { data: festStats, isLoading: festLoading } = useFestAttendanceStats();
  const { data: compStats, isLoading: compStatsLoading } =
    useCompetitionAttendanceStats(statsCompId || null);
  const {
    data: participants = [],
    isLoading: searchLoading,
    isFetching: searchFetching,
  } = useSearchParticipants(debouncedQuery);
  const { mutateAsync: markAttendance } = useMarkCompetitionAttendance();

  async function handleMarkAttendance(userId) {
    if (!markCompId) {
      enqueueSnackbar("Please select a competition first", {
        variant: "warning",
      });
      return;
    }
    setMarkingUserId(userId);
    try {
      await markAttendance({ competitionId: markCompId, userId });
      setMarkedIds((prev) => new Set(prev).add(userId));
      enqueueSnackbar("Attendance marked", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to mark attendance",
        { variant: "error" },
      );
    } finally {
      setMarkingUserId(null);
    }
  }

  // Fest stats values
  const festTotal = festStats?.totalRegistered ?? festStats?.total ?? 0;
  const festAttended = festStats?.totalAttended ?? festStats?.attended ?? 0;
  const festPct = pct(festAttended, festTotal);

  // Competition stats values
  const compTotal = compStats?.totalRegistered ?? compStats?.total ?? 0;
  const compAttended = compStats?.totalAttended ?? compStats?.attended ?? 0;
  const compPct = pct(compAttended, compTotal);

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
            <UserCheck size={15} color="rgba(255,255,255,0.7)" />
          </Box>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
              color: "#f4f4f5",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Attendance
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
          Track participant attendance across the fest and individual
          competitions
        </Typography>
      </Box>

      {/* ── Stats row ── */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Fest overall */}
        <Grid item xs={12} sm={6} md={4}>
          {festLoading ? (
            <Paper
              sx={{
                p: 3,
                background: "#0c0c0c",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                minHeight: 110,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={24} sx={{ color: "#a855f7" }} />
            </Paper>
          ) : (
            <StatCard
              icon={Users}
              label="Overall Fest Attendance"
              value={`${festPct}%`}
              sub={`${festAttended} of ${festTotal} participants`}
              accent="#a855f7"
            />
          )}
        </Grid>

        {/* Competition stats */}
        <Grid item xs={12} sm={6} md={8}>
          <Paper
            sx={{
              p: 3,
              background: "#0c0c0c",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <BarChart3 size={20} color="#38bdf8" />
              <Typography
                variant="subtitle2"
                sx={{ color: "#fff", fontWeight: 600 }}
              >
                Per-Competition Stats
              </Typography>
            </Box>
            <TextField
              select
              label="Select competition"
              value={statsCompId}
              onChange={(e) => setStatsCompId(e.target.value)}
              size="small"
              fullWidth
              disabled={compsLoading}
              sx={{ mb: 2, ...inputSx }}
            >
              <MenuItem value="">Select a competition…</MenuItem>
              {competitions.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name || c.title}
                </MenuItem>
              ))}
            </TextField>
            {statsCompId &&
              (compStatsLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={16} sx={{ color: "#a855f7" }} />
                  <Typography variant="caption" sx={{ color: "#71717a" }}>
                    Loading…
                  </Typography>
                </Box>
              ) : compStats ? (
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ color: "#38bdf8", fontWeight: 700 }}
                    >
                      {compPct}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#71717a" }}>
                      Check-in rate
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ color: "#fff", fontWeight: 700 }}
                    >
                      {compAttended}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#71717a" }}>
                      Attended
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ color: "#fff", fontWeight: 700 }}
                    >
                      {compTotal}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#71717a" }}>
                      Registered
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="caption" sx={{ color: "#52525b" }}>
                  No data available
                </Typography>
              ))}
          </Paper>
        </Grid>
      </Grid>

      {/* ── Mark Attendance section ── */}
      <Paper
        sx={{
          p: 3,
          background: "#0c0c0c",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <UserCheck size={20} color="#4ade80" />
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
            Mark Attendance
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={5}>
            <TextField
              select
              label="Competition"
              value={markCompId}
              onChange={(e) => setMarkCompId(e.target.value)}
              size="small"
              fullWidth
              disabled={compsLoading}
              sx={inputSx}
            >
              <MenuItem value="">Select competition…</MenuItem>
              {competitions.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name || c.title}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={7}>
            <TextField
              placeholder="Search participant by name or email…"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              size="small"
              fullWidth
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {searchFetching ? (
                      <CircularProgress size={14} sx={{ color: "#71717a" }} />
                    ) : (
                      <Search size={16} color="#71717a" />
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        {!markCompId && query.length > 0 && (
          <Alert
            severity="info"
            icon={<Info size={16} />}
            sx={{
              backgroundColor: "#0369a122",
              color: "#38bdf8",
              border: "1px solid #0369a1",
              mb: 2,
              "& .MuiAlert-icon": { color: "#38bdf8" },
            }}
          >
            Select a competition above to mark attendance for the participants
            below
          </Alert>
        )}

        {/* Search results */}
        {debouncedQuery.length >= 2 && (
          <>
            {searchLoading ? (
              <LoadingState message="Searching participants…" size="small" />
            ) : participants.length === 0 ? (
              <Typography
                variant="body2"
                sx={{ color: "#52525b", textAlign: "center", py: 3 }}
              >
                No participants found for &ldquo;{debouncedQuery}&rdquo;
              </Typography>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  background: "#0a0a0a",
                  borderColor: "rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <List disablePadding>
                  {participants.map((p, idx) => {
                    const name = p.name || p.user?.name || "Unknown";
                    const email = p.email || p.user?.email || "";
                    const userId = p.id || p.userId;
                    const isMarking = markingUserId === userId;
                    const alreadyMarked = markedIds.has(userId);

                    return (
                      <Box key={userId || idx}>
                        {idx > 0 && <Divider sx={{ borderColor: "#1f1f23" }} />}
                        <ListItem
                          sx={{
                            py: 1.5,
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.02)",
                            },
                          }}
                          secondaryAction={
                            alreadyMarked ? (
                              <Chip
                                label="Marked"
                                size="small"
                                icon={<CheckCircle2 size={12} />}
                                sx={{
                                  backgroundColor: "#16a34a22",
                                  color: "#4ade80",
                                  fontSize: 11,
                                  "& .MuiChip-icon": { color: "#4ade80" },
                                }}
                              />
                            ) : (
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleMarkAttendance(userId)}
                                disabled={isMarking || !markCompId}
                                startIcon={
                                  isMarking ? (
                                    <CircularProgress size={12} />
                                  ) : (
                                    <UserCheck size={12} />
                                  )
                                }
                                sx={{
                                  backgroundColor: "#16a34a",
                                  "&:hover": { backgroundColor: "#15803d" },
                                  "&.Mui-disabled": {
                                    backgroundColor: "#3f3f46",
                                    color: "#71717a",
                                  },
                                  textTransform: "none",
                                  fontWeight: 600,
                                  fontSize: 12,
                                  fontFamily: "'Syne', sans-serif",
                                  borderRadius: "8px",
                                }}
                              >
                                Mark Attended
                              </Button>
                            )
                          }
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                backgroundColor: "#3f3f46",
                                fontSize: 14,
                                fontWeight: 700,
                              }}
                            >
                              {name.charAt(0).toUpperCase()}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                sx={{ color: "#fff", fontWeight: 500 }}
                              >
                                {name}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                sx={{ color: "#71717a" }}
                              >
                                {email}
                                {p.department && ` · ${p.department}`}
                              </Typography>
                            }
                          />
                        </ListItem>
                      </Box>
                    );
                  })}
                </List>
              </Paper>
            )}
          </>
        )}

        {debouncedQuery.length < 2 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
              gap: 1,
              color: "#3f3f46",
            }}
          >
            <Search size={20} />
            <Typography variant="body2">
              Type at least 2 characters to search
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
