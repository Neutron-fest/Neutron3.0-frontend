"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { LifeBuoy, X, Send, Paperclip } from "lucide-react";
import { useSnackbar } from "notistack";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateIssue } from "@/src/hooks/api/useIssues";

const ISSUE_IMAGE_MAX_MB = 5;
const ISSUE_IMAGE_MAX_BYTES = ISSUE_IMAGE_MAX_MB * 1024 * 1024;
const ISSUE_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/avif,image/gif";

export default function SupportIssueWidget() {
  const { user, loading } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: createIssue, isPending } = useCreateIssue();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<any>(null);

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!(imageFile instanceof File)) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl: any = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  if (loading || !user) return null;

  const handleSubmit = async () => {
    const trimmed = message.trim();

    if (!trimmed) {
      enqueueSnackbar("Please describe your issue", { variant: "warning" });
      return;
    }

    if (trimmed.length < 10) {
      enqueueSnackbar("Please provide a little more detail", {
        variant: "warning",
      });
      return;
    }

    if (imageFile && imageFile.size > ISSUE_IMAGE_MAX_BYTES) {
      enqueueSnackbar(`Image exceeds ${ISSUE_IMAGE_MAX_MB}MB limit`, {
        variant: "warning",
      });
      return;
    }

    try {
      await createIssue({ message: trimmed, image: imageFile });
      setMessage("");
      setImageFile(null);
      setOpen(false);
      enqueueSnackbar("Issue submitted to support queue", {
        variant: "success",
      });
    } catch (error: any) {
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to submit issue",
        { variant: "error" },
      );
    }
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setImageFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      enqueueSnackbar("Only image files are allowed", {
        variant: "warning",
      });
      return;
    }

    if (file.size > ISSUE_IMAGE_MAX_BYTES) {
      enqueueSnackbar(`Image exceeds ${ISSUE_IMAGE_MAX_MB}MB limit`, {
        variant: "warning",
      });
      return;
    }

    setImageFile(file);
  };

  return (
    <>
      {open && (
        <Box
          sx={{
            position: "fixed",
            right: { xs: 12, sm: 16 },
            bottom: { xs: 74, sm: 82 },
            width: { xs: "calc(100vw - 24px)", sm: 360 },
            maxWidth: 360,
            zIndex: 1350,
            background: "#0e0e0e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.55)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: 1.75,
              py: 1.25,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography
              sx={{
                color: "#f4f4f5",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'Syne', sans-serif",
              }}
            >
              Support Request
            </Typography>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              disabled={isPending}
              sx={{ color: "rgba(255,255,255,0.45)" }}
            >
              <X size={14} />
            </IconButton>
          </Box>

          <Box sx={{ p: 1.75 }}>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 11,
                mb: 1,
                fontFamily: "'Syne', sans-serif",
              }}
            >
              Submit your issue. DH and SA can review it in the Issues
              dashboard.
            </Typography>

            <TextField
              multiline
              minRows={4}
              maxRows={8}
              fullWidth
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Describe your issue..."
              disabled={isPending}
              sx={{
                mb: 1.25,
                "& .MuiOutlinedInput-root": {
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(255,255,255,0.9)",
                  borderRadius: "8px",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 13,
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255,255,255,0.18)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(168,85,247,0.75)",
                  },
                },
              }}
            />

            <Box sx={{ mb: 1.25 }}>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  border: "1px solid rgba(168,85,247,0.3)",
                  borderRadius: 8,
                  padding: "8px 12px",
                  color: "#e9d5ff",
                  background: "rgba(168,85,247,0.12)",
                  fontSize: 12,
                  cursor: isPending ? "not-allowed" : "pointer",
                  opacity: isPending ? 0.6 : 1,
                }}
              >
                <Paperclip size={14} />
                {imageFile instanceof File ? imageFile.name : "Attach image"}
                <input
                  type="file"
                  accept={ISSUE_IMAGE_ACCEPT}
                  disabled={isPending}
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </label>

              <Typography
                sx={{
                  mt: 0.75,
                  fontSize: 10,
                  color: "rgba(255,255,255,0.3)",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                Optional image · max {ISSUE_IMAGE_MAX_MB}MB ·
                JPG/PNG/WEBP/AVIF/GIF
              </Typography>

              {imageFile instanceof File && (
                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: 10,
                    color:
                      imageFile.size > ISSUE_IMAGE_MAX_BYTES
                        ? "#f87171"
                        : "rgba(255,255,255,0.35)",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  Size: {(imageFile.size / (1024 * 1024)).toFixed(2)} MB
                </Typography>
              )}

              {previewUrl && (
                <Box
                  sx={{
                    mt: 1,
                    position: "relative",
                    width: "100%",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Issue image preview"
                    sx={{
                      display: "block",
                      width: "100%",
                      height: 140,
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => setImageFile(null)}
                    disabled={isPending}
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      background: "rgba(0,0,0,0.45)",
                      color: "#fff",
                      "&:hover": {
                        background: "rgba(0,0,0,0.62)",
                      },
                    }}
                  >
                    <X size={12} />
                  </IconButton>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 10,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {message.trim().length} / 1000
              </Typography>

              <Button
                onClick={handleSubmit}
                disabled={
                  isPending ||
                  message.trim().length < 10 ||
                  (imageFile && imageFile.size > ISSUE_IMAGE_MAX_BYTES)
                }
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 600,
                  fontSize: 12,
                  background: "linear-gradient(90deg, #a855f7, #7c3aed)",
                  minWidth: 126,
                  "&:hover": {
                    background: "linear-gradient(90deg, #9333ea, #6d28d9)",
                  },
                  "&.Mui-disabled": {
                    background: "rgba(255,255,255,0.14)",
                    color: "rgba(255,255,255,0.3)",
                  },
                }}
                startIcon={
                  isPending ? (
                    <CircularProgress size={12} sx={{ color: "#fff" }} />
                  ) : (
                    <Send size={12} />
                  )
                }
              >
                {isPending ? "Sending..." : "Submit"}
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      <Button
        onClick={() => setOpen((prev) => !prev)}
        variant="contained"
        sx={{
          position: "fixed",
          right: { xs: 12, sm: 16 },
          bottom: { xs: 14, sm: 16 },
          zIndex: 1351,
          borderRadius: "999px",
          textTransform: "none",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 600,
          fontSize: 12,
          px: 1.6,
          py: 0.9,
          minWidth: "unset",
          background: open
            ? "rgba(255,255,255,0.16)"
            : "linear-gradient(90deg, #a855f7, #7c3aed)",
          color: "#fff",
          border: open
            ? "1px solid rgba(255,255,255,0.28)"
            : "1px solid rgba(168,85,247,0.45)",
          "&:hover": {
            background: open
              ? "rgba(255,255,255,0.22)"
              : "linear-gradient(90deg, #9333ea, #6d28d9)",
          },
        }}
        startIcon={<LifeBuoy size={14} />}
      >
        Support
      </Button>
    </>
  );
}
