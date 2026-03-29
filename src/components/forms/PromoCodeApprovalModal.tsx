"use client";

import { useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { X, Plus } from "lucide-react";
import { useSnackbar } from "notistack";
import { useRequestPromoCodeApproval } from "@/src/hooks/api/useCompetitions";

export default function PromoCodeApprovalModal({
  open,
  onClose,
  competition,
  registrationFee,
}:any) {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: requestApproval, isPending } = useRequestPromoCodeApproval();

  const [promoCodes, setPromoCodes] = useState<any>([]);
  const [currentCode, setCurrentCode] = useState<any>({
    code: "",
    discountType: "PERCENT",
    discountValue: 0,
  });
  const [error, setError] = useState("");

  const handleAddCode = () => {
    setError("");

    if (!currentCode.code.trim()) {
      setError("Code is required");
      return;
    }

    if (!Number.isFinite(currentCode.discountValue)) {
      setError("Discount value must be a number");
      return;
    }

    if (currentCode.discountValue <= 0) {
      setError("Discount value must be greater than 0");
      return;
    }

    if (
      currentCode.discountType === "PERCENT" &&
      currentCode.discountValue > 100
    ) {
      setError("Percent discount cannot exceed 100%");
      return;
    }

    if (
      currentCode.discountType === "FLAT" &&
      registrationFee &&
      currentCode.discountValue > registrationFee
    ) {
      setError(
        `Flat discount cannot exceed registration fee of ₹${registrationFee}`,
      );
      return;
    }

    const newCode = {
      code: currentCode.code.trim().toUpperCase(),
      discountType: currentCode.discountType,
      discountValue: Number(currentCode.discountValue),
    };

    setPromoCodes([...promoCodes, newCode]);
    setCurrentCode({ code: "", discountType: "PERCENT", discountValue: 0 });
  };

  const handleRemoveCode = (index:any) => {
    setPromoCodes(promoCodes.filter((_:any, i:any) => i !== index));
  };

  const handleSubmit = async () => {
    if (promoCodes.length === 0) {
      setError("Add at least one promo code");
      return;
    }

    requestApproval(
      {
        competitionId: competition?.id,
        promoCodes,
      },
      {
        onSuccess: (response) => {
          const backendMessage = response?.message;
          enqueueSnackbar(
            backendMessage ||
              `Promo code request submitted (${promoCodes.length} code${promoCodes.length !== 1 ? "s" : ""})`,
            { variant: "success" },
          );
          setPromoCodes([]);
          setCurrentCode({
            code: "",
            discountType: "PERCENT",
            discountValue: 0,
          });
          onClose();
        },
        onError: (err:any) => {
          const message =
            err?.response?.data?.message || "Failed to request approval";
          setError(message);
          enqueueSnackbar(message, { variant: "error" });
        },
      },
    );
  };

  if (!competition) return null;

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
          borderRadius: "14px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
        },
      }}
    >
      <Box>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
              color: "#f4f4f5",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Request Promo Code Approval
          </Typography>
          <IconButton
            onClick={onClose}
            disabled={isPending}
            sx={{ color: "rgba(255,255,255,0.4)" }}
          >
            <X size={18} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Box>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'DM Mono', monospace",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                mb: 1,
              }}
            >
              Competition
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#e4e4e7" }}>
              {competition?.title}
            </Typography>
            {registrationFee > 0 && (
              <Typography
                sx={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)",
                  mt: 0.5,
                }}
              >
                Registration Fee: ₹{registrationFee}
              </Typography>
            )}
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
                mb: 2,
              }}
            >
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'DM Mono', monospace",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Add Promo Code
            </Typography>

            <TextField
              label="Code"
              value={currentCode.code}
              onChange={(e) =>
                setCurrentCode({ ...currentCode, code: e.target.value })
              }
              placeholder="E.g., SUMMER20"
              disabled={isPending}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#e4e4e7",
                  fontSize: 13,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.12)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.2)",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#a855f7",
                  },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255,255,255,0.25)",
                  opacity: 1,
                },
              }}
              size="small"
            />

            <FormControl size="small" disabled={isPending}>
              <Select
                value={currentCode.discountType}
                onChange={(e) =>
                  setCurrentCode({
                    ...currentCode,
                    discountType: e.target.value,
                  })
                }
                sx={{
                  color: "#e4e4e7",
                  fontSize: 13,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.12)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.2)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#a855f7",
                  },
                }}
              >
                <MenuItem value="PERCENT">Percentage</MenuItem>
                <MenuItem value="FLAT">Flat Amount</MenuItem>
              </Select>
              <FormHelperText sx={{ color: "rgba(255,255,255,0.3)" }}>
                {currentCode.discountType === "PERCENT" ? "%" : "₹"}
              </FormHelperText>
            </FormControl>

            <TextField
              label="Discount Value"
              type="number"
              value={currentCode.discountValue}
              onChange={(e) =>
                setCurrentCode({
                  ...currentCode,
                  discountValue: parseFloat(e.target.value) || 0,
                })
              }
              disabled={isPending}
              inputProps={{
                step: currentCode.discountType === "PERCENT" ? 1 : 10,
                min: 0,
                max:
                  currentCode.discountType === "PERCENT"
                    ? 100
                    : registrationFee || 10000,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#e4e4e7",
                  fontSize: 13,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.12)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.2)",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#a855f7",
                  },
              }}
              size="small"
            />

            <Button
              onClick={handleAddCode}
              disabled={isPending || !currentCode.code.trim()}
              sx={{
                background: "rgba(168,85,247,0.2)",
                color: "#c084fc",
                border: "1px solid rgba(168,85,247,0.3)",
                textTransform: "none",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 500,
                fontSize: 12,
                py: 1,
                "&:hover": {
                  background: "rgba(168,85,247,0.3)",
                  borderColor: "rgba(168,85,247,0.5)",
                },
              }}
            >
              <Plus size={14} style={{ marginRight: 6 }} />
              Add Code
            </Button>
          </Box>

          {promoCodes.length > 0 && (
            <Box sx={{ mt: 2.5 }}>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "'DM Mono', monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  mb: 1,
                }}
              >
                Codes to Submit ({promoCodes.length})
              </Typography>

              <TableContainer
                sx={{
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  mb: 2,
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow
                      sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <TableCell
                        sx={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "10px 12px",
                        }}
                      >
                        Code
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "10px 12px",
                        }}
                      >
                        Type
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "10px 12px",
                        }}
                      >
                        Value
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "10px 12px",
                          textAlign: "center",
                        }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {promoCodes.map((code:any, idx:any) => (
                      <TableRow
                        key={idx}
                        sx={{
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          "&:last-child": { borderBottom: "none" },
                        }}
                      >
                        <TableCell
                          sx={{
                            color: "#e4e4e7",
                            fontSize: 12,
                            fontFamily: "'DM Mono', monospace",
                            padding: "10px 12px",
                            fontWeight: 600,
                          }}
                        >
                          {code.code}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "rgba(255,255,255,0.6)",
                            fontSize: 12,
                            padding: "10px 12px",
                          }}
                        >
                          {code.discountType === "PERCENT" ? "%" : "₹"}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#4ade80",
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "10px 12px",
                          }}
                        >
                          {code.discountValue}
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "10px 12px",
                            textAlign: "center",
                          }}
                        >
                          <IconButton
                            onClick={() => handleRemoveCode(idx)}
                            disabled={isPending}
                            size="small"
                            sx={{ color: "#f87171" }}
                          >
                            <X size={14} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Footer */}
          <Box
            sx={{
              p: 3,
              display: "flex",
              gap: 1.5,
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Button
              onClick={onClose}
              disabled={isPending}
              variant="outlined"
              sx={{
                color: "rgba(255,255,255,0.5)",
                borderColor: "rgba(255,255,255,0.12)",
                textTransform: "none",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 500,
                flex: 1,
                "&:hover": {
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.2)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending || promoCodes.length === 0}
              variant="contained"
              sx={{
                background: "linear-gradient(90deg, #a855f7, #7c3aed)",
                color: "#ffffff",
                textTransform: "none",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                flex: 1,
                "&:hover": {
                  background: "linear-gradient(90deg, #9333ea, #6d28d9)",
                },
              }}
            >
              {isPending ? (
                <>
                  <CircularProgress size={14} sx={{ color: "white", mr: 1 }} />
                  Submitting...
                </>
              ) : (
                `Request Approval (${promoCodes.length})`
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
