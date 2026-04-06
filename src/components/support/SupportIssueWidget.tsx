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
import SupportButton from "../Support_Button";
import styled from "styled-components";

const ISSUE_IMAGE_MAX_MB = 5;
const ISSUE_IMAGE_MAX_BYTES = ISSUE_IMAGE_MAX_MB * 1024 * 1024;
const ISSUE_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/avif,image/gif";

const StyledFormContainer = styled(Box)`
  position: fixed;
  z-index: 1350;
  background: #110505; /* Slightly dark red tinted background */
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(239, 68, 68, 0.15), 0 0 20px rgba(0, 0, 0, 0.8);
  overflow: hidden;

  /* Galaxy Starry Background Effect */
  .galaxy-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 0;
  }
  
  .galaxy-bg::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    opacity: 1;
    box-shadow:
      140px 20px #fff,
      325px 20px #fff,
      70px 120px #fff,
      20px 130px #fff,
      110px 80px #fff,
      280px 80px #fff,
      250px 350px #fff,
      280px 230px #fff,
      220px 190px #fff,
      350px 100px #fff,
      380px 80px #fff,
      320px 50px #fff;
    transition: all 1.5s ease-in-out;
    animation: 2s glowing-stars linear alternate infinite;
    animation-delay: 0.4s;
  }
  .galaxy-bg::after {
    content: "";
    position: absolute;
    top: -100px;
    left: -50px;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    opacity: 1;
    box-shadow:
      390px 330px #fff,
      320px 300px #fff,
      220px 280px #fff,
      280px 350px #fff,
      346px 170px #fff,
      320px 180px #fff,
      270px 150px #fff,
      200px 250px #fff,
      80px 20px #fff,
      190px 50px #fff,
      270px 20px #fff,
      120px 230px #fff,
      250px -1px #fff,
      150px 369px #fff;
    transition: all 2s ease-in-out;
    animation: 2s glowing-stars linear alternate infinite;
    animation-delay: 0.8s;
  }

  @keyframes glowing-stars {
    0% {
      opacity: 0.2;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 0.2;
    }
  }

  /* Content Wrapper to lift above stars */
  .content-wrapper {
    position: relative;
    z-index: 1;
    background: radial-gradient(
      circle at top right,
      rgba(239, 68, 68, 0.05),
      transparent 50%
    );
  }
`;

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
        <StyledFormContainer
          sx={{
            right: { xs: 12, sm: 16 },
            bottom: { xs: 74, sm: 82 },
            width: { xs: "calc(100vw - 24px)", sm: 360 },
            maxWidth: 360,
          }}
        >
          <div className="galaxy-bg" />
          <div className="content-wrapper">
            <Box
              sx={{
                px: 1.75,
                py: 1.25,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(239,68,68,0.15)",
              }}
            >
              <Typography
                sx={{
                  color: "#f87171",
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
                  color: "rgba(255,255,255,0.55)",
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
                    background: "rgba(255,255,255,0.02)",
                    color: "rgba(255,255,255,0.9)",
                    borderRadius: "8px",
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 13,
                    "& fieldset": {
                      borderColor: "rgba(239,68,68,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(239,68,68,0.4)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "rgba(239,68,68,0.8)",
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
                    border: "1px solid rgba(239,68,68,0.4)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    color: "#fca5a5",
                    background: "rgba(239,68,68,0.12)",
                    fontSize: 12,
                    cursor: isPending ? "not-allowed" : "pointer",
                    opacity: isPending ? 0.6 : 1,
                    transition: "all 0.2s ease",
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
                          : "rgba(255,255,255,0.45)",
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
                      border: "1px solid rgba(239,68,68,0.2)",
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
                    background: "linear-gradient(90deg, #ef4444, #dc2626)",
                    boxShadow: "0 4px 14px 0 rgba(239, 68, 68, 0.39)",
                    minWidth: 126,
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      background: "linear-gradient(90deg, #dc2626, #b91c1c)",
                      boxShadow: "0 6px 20px 0 rgba(239, 68, 68, 0.45)",
                    },
                    "&.Mui-disabled": {
                      background: "rgba(239,68,68,0.14)",
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
          </div>
        </StyledFormContainer>
      )}

      <Box
        sx={{
          position: "fixed",
          right: { xs: 12, sm: 16 },
          bottom: { xs: 14, sm: 16 },
          zIndex: 1351,
          transform: { xs: "scale(0.45)", sm: "scale(0.55)" },
          transformOrigin: "bottom right",
        }}
      >
        <SupportButton onClick={() => setOpen((prev) => !prev)} />
      </Box>
    </>
  );
}

