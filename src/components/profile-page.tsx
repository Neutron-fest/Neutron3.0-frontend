"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Trash2,
  X,
  ChevronRight,
  Bell,
  Layout,
  User,
  Target,
  Mail,
  Download,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Upload,
  Calendar,
  Zap,
  Award,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProfileCard from "./ProfileCard";
import { useAuthMe } from "@/src/hooks/api/useAuth";
import {
  useAcceptTeamInvite,
  useDeclineTeamInvite,
  useMyRegistrations,
  usePendingTeamInvites,
} from "@/src/hooks/api/usePublicRegistration";
import {
  useMyQRCode,
  useUpdateUserProfile,
} from "@/src/hooks/api/useUserProfile";

const DashboardContext = React.createContext<{
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
  setExpandedID: (val: boolean) => void;
}>({
  showToast: () => {},
  setExpandedID: () => {},
});

function useDashboard() {
  return React.useContext(DashboardContext);
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "leader" | "member";
  status: "confirmed" | "pending";
  avatar: string;
}

interface EnrolledItem {
  kind: "competition" | "event";
  id: string;
  slug: string;
  title: string;
  image: string;
  category: string;
  date: string;
  status: "open" | "closed" | "cancelled" | "postponed";
  teamSize: string; // e.g. "1-3 Members" or "4 Members"
  team?: TeamMember[];
}

interface ProfileState {
  name: string;
  email: string;
  bio: string;
  college: string;
  year: string;
  gender: string;
  city: string;
  state: string;
  whatsapp: string;
  image: string;
  collegeIdPic: string;
  govtIdPic: string;
}

const EMPTY_PROFILE: ProfileState = {
  name: "",
  email: "",
  bio: "",
  college: "",
  year: "",
  gender: "",
  city: "",
  state: "",
  whatsapp: "",
  image: "",
  collegeIdPic: "",
  govtIdPic: "",
};

const STATUS_MAP: Record<string, EnrolledItem["status"]> = {
  OPEN: "open",
  ACTIVE: "open",
  REGISTRATION_OPEN: "open",
  CLOSED: "closed",
  REGISTRATION_CLOSED: "closed",
  POSTPONED: "postponed",
  CANCELLED: "cancelled",
};

function toDashboardStatus(status?: string): EnrolledItem["status"] {
  if (!status) return "closed";
  return STATUS_MAP[status.toUpperCase()] || "closed";
}

function formatTeamSize(min?: number, max?: number): string {
  if (typeof max !== "number" || max < 2) return "1 Member";
  const safeMin = typeof min === "number" && min > 0 ? min : 1;
  if (safeMin === max) return `${max} Members`;
  return `${safeMin}-${max} Members`;
}

function formatDisplayDate(value?: string | Date): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER"] as const;

function TeamPanel({ teamMembers, onViewMember }: { teamMembers: any[], onViewMember: (m: any) => void }) {
  return (
    <div className="space-y-4 p-4">
      <h3 className="text-[10px] uppercase font-bold text-white/30 tracking-widest font-mono mb-6">Active Task Force</h3>
      {teamMembers.map((m) => (
        <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer"
          onClick={() => onViewMember(m)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-emerald-500/10">
              {m.avatar ? <img src={m.avatar} className="w-full h-full object-cover" /> : null}
            </div>
            <div>
              <p className="text-[11px] font-bold text-white">{m.name}</p>
              <p className="text-[9px] text-white/40 uppercase font-mono">{m.role}</p>
            </div>
          </div>
          <ChevronRight size={14} className="text-white/20" />
        </div>
      ))}
    </div>
  );
}

function normalizeGender(value: string): string {
  const normalized = value.trim().toUpperCase();
  return GENDER_OPTIONS.includes(normalized as (typeof GENDER_OPTIONS)[number])
    ? normalized
    : "";
}

function timeAgo(value?: string | Date): string {
  if (!value) return "";
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "";
  const diffSec = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

function isTeamEvent(teamSize: string): boolean {
  const match = teamSize.match(/\d+/g);
  if (!match) return false;
  const max = parseInt(match[match.length - 1]);
  return max > 1;
}

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-1000 px-4 py-2.5 rounded-xl border border-white/10 bg-[#080808]/90 backdrop-blur-xl shadow-2xl flex items-center gap-2.5 min-w-50 max-w-[320px]"
    >
      <div
        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
          type === "success"
            ? "bg-emerald-500/10 text-emerald-400"
            : type === "error"
              ? "bg-rose-500/10 text-rose-400"
              : "bg-blue-500/10 text-blue-400"
        }`}
      >
        {type === "success" && <CheckCircle2 size={14} />}
        {type === "error" && <AlertCircle size={14} />}
        {type === "info" && <Bell size={14} />}
      </div>
      <p className="text-[10px] font-bold text-white tracking-wide truncate flex-1">
        {message}
      </p>
      <button
        onClick={onClose}
        className="text-white/20 hover:text-white transition-colors p-1"
      >
        <X size={12} />
      </button>
    </motion.div>
  );
}

function EditableRow({
  label,
  value,
  onChange,
  locked = false,
  type = "text",
  options,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  locked?: boolean;
  type?: string;
  options?: string[];
  placeholder?: string;
}) {
  const [draft, setDraft] = useState(value || "");

  useEffect(() => {
    setDraft(value || "");
  }, [value]);

  const save = () => {
    if (draft.trim() !== value) {
      onChange(draft.trim());
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 group">
      <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono w-1/3 shrink-0">
        {label}
      </span>

      <div className="flex-1 flex items-center justify-end gap-3 text-right overflow-hidden transition-all duration-300">
        {!locked ? (
          <div className="flex items-center gap-2 w-full max-w-[280px] animate-in fade-in slide-in-from-right-2">
            {options?.length ? (
              <select
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  onChange(e.target.value);
                }}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-[11px] text-white outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all font-mono"
              >
                {!draft && <option value="">Select {label}</option>}
                {options.map((option) => (
                  <option key={option} value={option} className="bg-neutral-900">
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={save}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    save();
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-[11px] text-white outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all font-mono placeholder:text-white/10"
              />
            )}
          </div>
        ) : (
          <span className="text-[11px] font-medium text-white/70 font-mono truncate max-w-[300px]">
            {value || <span className="text-white/10 italic">Unspecified</span>}
          </span>
        )}
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <label className="text-[10px] uppercase tracking-wider text-white/25 font-mono">
          {label}
        </label>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-[10px] text-white/20 hover:text-white/50 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
          >
            <svg
              width="10"
              height="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                strokeLinecap="round"
              />
              <path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                strokeLinecap="round"
              />
            </svg>
            Edit
          </button>
        )}
      </div>
      {editing ? (
        <div className="flex gap-2">
          <select
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setEditing(false);
            }}
            autoFocus
            className="flex-1 bg-[#111] border border-white/15 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/30 transition-all"
          >
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <button
            onClick={() => setEditing(false)}
            className="px-3 py-2 bg-white/5 border border-white/10 text-white/50 text-xs rounded-lg hover:bg-white/10 transition-colors shrink-0"
          >
            ✕
          </button>
        </div>
      ) : (
        <p
          className={`text-sm mt-0.5 ${value ? "text-white/80" : "text-white/25 italic"}`}
        >
          {value || "—"}
        </p>
      )}
    </div>
  );
}

function DocumentCard({
  label,
  type,
  date,
  onUpload,
  existingUrl,
  file,
  setFile,
}: {
  label: string;
  type: string;
  date: string;
  onUpload: (file: File) => void;
  existingUrl?: string;
  file?: File | null;
  setFile?: (file: File | null) => void;
}) {
  const { showToast } = useDashboard();
  const [localFile, setLocalFile] = useState<File | null>(file || null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [existingPreviewFailed, setExistingPreviewFailed] =
    useState<boolean>(false);
  const [uploading, setUploading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasExistingFile = Boolean(existingUrl && !localFile);
  const existingFileName = existingUrl
    ? decodeURIComponent(existingUrl.split("/").pop() || label)
    : label;
  const isImageFile = Boolean(localFile?.type?.startsWith("image/"));

  useEffect(() => {
    setExistingPreviewFailed(false);
  }, [existingUrl]);

  useEffect(() => {
    if (!localFile || !isImageFile) {
      setLocalPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(localFile);
    setLocalPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [localFile, isImageFile]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setUploading(true);
    try {
      await onUpload(f);
      setLocalFile(f);
    } catch {
      showToast("Failed to upload file.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`bg-white/2 border border-white/8 rounded-2xl p-4 flex flex-col gap-3 group/doc hover:border-white/20 hover:bg-white/5 transition-all duration-300 relative ${localFile ? "border-emerald-500/20" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFile}
      />
      <div
        className="w-full aspect-video rounded-xl bg-[#111] border border-white/5 overflow-hidden relative cursor-pointer"
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <p className="text-[8px] text-white/40 uppercase tracking-widest font-mono">
                Uploading...
              </p>
            </div>
          ) : localFile ? (
            isImageFile && localPreviewUrl ? (
              <img
                src={localPreviewUrl}
                alt={`${label} preview`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-emerald-500/10 to-teal-500/10 flex flex-col items-center justify-center p-4 text-center">
                <CheckCircle2 size={24} className="text-emerald-400 mb-2" />
                <p className="text-[8px] text-white/50 truncate w-full font-mono">
                  {localFile.name}
                </p>
              </div>
            )
          ) : hasExistingFile ? (
            !existingPreviewFailed ? (
              <img
                src={existingUrl}
                alt={`${label} preview`}
                className="w-full h-full object-cover"
                onError={() => setExistingPreviewFailed(true)}
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-blue-500/10 to-cyan-500/10 flex flex-col items-center justify-center p-4 text-center">
                <CheckCircle2 size={24} className="text-blue-400 mb-2" />
                <p className="text-[8px] text-white/50 truncate w-full font-mono">
                  {existingFileName}
                </p>
              </div>
            )
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/doc:bg-white/10 transition-all">
              <Upload
                size={18}
                className="text-white/20 group-hover/doc:text-white"
              />
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">
            {label}
          </h4>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all cursor-pointer"
            >
              <MoreVertical size={14} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-100"
                    onClick={() => setMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className="absolute bottom-full right-0 mb-2 w-32 bg-[#0c0c0c] border border-white/10 rounded-xl shadow-2xl z-101 overflow-hidden"
                  >
                    {[
                      {
                        label: "View",
                        icon: Layout,
                        action: () =>
                          showToast("Viewer restricted in beta.", "info"),
                      },
                      {
                        label: "Download",
                        icon: Download,
                        action: () =>
                          showToast("Download started...", "success"),
                      },
                      {
                        label: "Delete",
                        icon: Trash2,
                        action: () => {
                          setLocalFile(null);
                          showToast("File deleted.");
                        },
                        destructive: true,
                      },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={(e) => {
                          e.stopPropagation();
                          item.action();
                          setMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors text-left ${item.destructive ? "text-rose-400 hover:bg-rose-500/10" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                      >
                        <item.icon size={12} />
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-[9px] text-white/30 font-mono uppercase tracking-widest leading-none">
            {localFile
              ? (localFile.size / 1024 / 1024).toFixed(1) + " MB"
              : type}{" "}
            &bull;{" "}
            {localFile ? "Just now" : hasExistingFile ? "Uploaded" : date}
          </p>
          {(localFile || hasExistingFile) && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardWidget({
  title,
  children,
  className = "",
  onManage,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  onManage: () => void;
}) {
  return (
    <div
      className={`bg-white/3 border border-white/8 rounded-3xl p-6 backdrop-blur-2xl transition-all duration-300 hover:border-white/15 h-full ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 font-mono">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function TeamModal({
  item,
  onClose,
}: {
  item: EnrolledItem;
  onClose: () => void;
}) {
  const { showToast } = useDashboard();
  const [inviteEmail, setInviteEmail] = useState("");
  const [members, setMembers] = useState<TeamMember[]>(item.team || []);

  const maxStr = item.teamSize.match(/\d+/g);
  const maxMembers = maxStr ? parseInt(maxStr[maxStr.length - 1]) : 1;
  const canAdd = members.length < maxMembers;

  const [inviteError, setInviteError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);

  const handleInvite = () => {
    setInviteError("");

    const val = inviteEmail.trim();
    if (!val || !canAdd) return;

    if (
      members.some(
        (m) =>
          m.email.toLowerCase() === val.toLowerCase() ||
          m.name.toLowerCase() === val.toLowerCase(),
      )
    ) {
      setInviteError("User is already in your team.");
      return;
    }

    showToast(`Invite sent to ${val}.`, "success");
    setInviteEmail("");
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-[#080808] border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {item.title}
            </h2>
            <p className="text-xs text-white/30 mt-1 font-mono uppercase tracking-widest">
              Team Management &bull; {members.length}/{maxMembers} Slots
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto overflow-x-visible custom-scrollbar">
          {/* Members List */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20 font-mono">
              Active Members
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/3 border border-white/5 group hover:border-white/10 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0">
                    <img
                      src="/images/bg.jpeg"
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white truncate">
                      {member.name}
                    </p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono mt-0.5">
                      {member.role}
                    </p>
                  </div>
                  {member.role !== "leader" && (
                    <button
                      onClick={() => setMemberToRemove(member)}
                      className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-rose-500/20"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {memberToRemove && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-60 bg-black/95 flex items-center justify-center p-8"
              >
                <div className="text-center max-w-xs">
                  <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-6">
                    <Trash2 size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    Remove {memberToRemove.name}?
                  </h4>
                  <p className="text-xs text-white/40 mt-2 leading-relaxed">
                    This will revoke their access to this project immediately.
                  </p>
                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setMemberToRemove(null)}
                      className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setMembers((prev) =>
                          prev.filter((m) => m.id !== memberToRemove.id),
                        );
                        showToast(`${memberToRemove.name} removed.`, "info");
                        setMemberToRemove(null);
                      }}
                      className="flex-1 py-3 rounded-xl bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-rose-600 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Invitation Section */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20 font-mono">
                Invite Peers
              </h3>
              <span
                className={`text-[9px] uppercase tracking-widest font-mono ${canAdd ? "text-emerald-400" : "text-rose-400"}`}
              >
                {canAdd ? "Available Slots Open" : "Limit Reached"}
              </span>
            </div>

            <div className="relative">
              <div
                className={`p-1.5 rounded-2.5xl border transition-all flex items-center gap-2 ${isFocused ? "bg-white/5 border-white/20" : "bg-white/3 border-white/5"}`}
              >
                <div className="pl-3 text-white/20">
                  <Mail size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Enter name or email..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  disabled={!canAdd}
                  className="bg-transparent border-none outline-none flex-1 py-3 text-sm text-white placeholder:text-white/10 font-medium"
                />
                <button
                  onClick={() => handleInvite()}
                  disabled={!canAdd || !inviteEmail.trim()}
                  className="h-10 px-6 rounded-2xl bg-white text-black text-[10px] font-extrabold uppercase tracking-widest hover:bg-white/90 transition-all disabled:opacity-20 disabled:grayscale"
                >
                  Send
                </button>
              </div>
            </div>
            {inviteError && (
              <p className="text-[10px] text-rose-400 font-mono ml-2">
                {inviteError}
              </p>
            )}
          </div>
        </div>

        <div className="px-8 py-6 bg-white/2 border-t border-white/5 flex items-center justify-between">
          <p className="text-[9px] text-white/10 font-mono uppercase tracking-[0.3em]">
            Integrity verified &bull; 2m ago
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function EnrolledCard({ item, href }: { item: EnrolledItem; href: string }) {
  const [showTeam, setShowTeam] = useState(false);
  const hasTeam = isTeamEvent(item.teamSize);

  const statusColor: Record<string, string> = {
    open: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    closed: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    postponed: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    cancelled: "bg-white/5 border-white/10 text-white/30",
  };

  return (
    <>
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-white/14 transition-all duration-200 group">
        {/* Top row */}
        <div className="flex gap-4 items-center p-4">
          <div
            className="w-14 h-14 rounded-xl shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url(/images/bg.jpeg)` }}
          />
          <div className="flex-1 min-w-0">
            <Link href={href}>
              <p className="text-sm font-semibold text-white truncate hover:text-white/80 transition-colors">
                {item.title}
              </p>
            </Link>
            <p className="text-xs text-white/40 mt-0.5 truncate">
              {item.category} · {item.date}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span
                className={`px-2 py-0.5 rounded-md border text-[10px] uppercase tracking-wider font-mono ${statusColor[item.status]}`}
              >
                {item.status}
              </span>
              <span className="text-[10px] text-white/25 font-mono">
                {item.teamSize}
              </span>
            </div>
          </div>
        </div>

        {hasTeam && (
          <div className="px-4 pb-4 border-t border-white/5 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Avatar stack */}
                <div className="flex -space-x-2">
                  {(item.team || []).slice(0, 4).map((m) => (
                    <div
                      key={m.id || m.name}
                      className="w-6 h-6 rounded-full ring-1 ring-black/50 overflow-hidden bg-white/10"
                      title={m.name}
                    >
                      <img
                        src="/images/bg.jpeg"
                        alt={m.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {(item.team || []).length > 4 && (
                    <span className="w-6 h-6 rounded-full bg-white/10 border border-white/20 text-[10px] text-white/70 grid place-items-center font-mono">
                      +{(item.team || []).length - 4}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-white/45 font-mono">
                  {(item.team || []).length} member
                  {(item.team || []).length === 1 ? "" : "s"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowTeam(true)}
                className="px-3 py-1.5 rounded-lg border border-white/15 text-[10px] uppercase tracking-wider font-mono text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                View Team
              </button>
            </div>
          </div>
        )}
      </div>

      {showTeam && <TeamModal item={item} onClose={() => setShowTeam(false)} />}
    </>
  );
}

function MemberProfileModal({
  member,
  onClose,
}: {
  member: TeamMember | any;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-6 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative w-full max-w-sm bg-[#080808] border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        <div className="p-8 flex flex-col items-center text-center">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-white/10 mb-6 shadow-2xl transition-transform group-hover:scale-105 duration-500">
              <img
                src="/images/bg.jpeg"
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#080808]"></div>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            {member.name}
          </h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-mono mt-2">
            {member.role || "Member"}
          </p>

          <div className="w-full h-px bg-white/5 my-8"></div>

          <div className="w-full space-y-5 text-left">
            <div>
              <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest font-mono mb-2">
                About & Bio
              </p>
              <p className="text-xs text-white/50 leading-relaxed font-medium">
                Expert in {member.role || "this field"} with a focus on
                collaborative problem solving and innovative design thinking.
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest font-mono mb-3">
                Presence
              </p>
              <div className="flex gap-3">
                {["Github", "X", "LinkedIn"].map((sn) => (
                  <div
                    key={sn}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] text-white/40 font-mono uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  >
                    {sn}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-10 w-full py-4 rounded-2xl bg-white text-black text-[10px] font-extrabold uppercase tracking-widest shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 transition-all"
          >
            Close Member Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
}
function ProfilePanel({
  profile,
  set,
  onViewMember,
  teamMembers,
  userId,
  updateProfileMutation,
  setProfile,
}: {
  profile: ProfileState;
  set: (key: keyof ProfileState) => (val: string) => void;
  onViewMember: (m: any) => void;
  teamMembers: Array<{
    id: string;
    name: string;
    role: string;
    avatar: string;
    isMe?: boolean;
  }>;
  userId: string;
  updateProfileMutation: any;
  setProfile: (
    p: ProfileState | ((prev: ProfileState) => ProfileState),
  ) => void;
}) {
  const { showToast, setExpandedID } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);

  const isPersonalDataComplete = Boolean(
    (profile.name || profile.email) &&
    profile.gender &&
    (profile.city || profile.state),
  );

  const uploadFile =
    (field: "collegeIdPic" | "govtIdPic" | "image") => async (file: File) => {
      if (!userId) return;
      try {
        await updateProfileMutation.mutateAsync({
          userId,
          [field]: file,
        });
        setProfile((p: ProfileState) => ({
          ...p,
          [field]: URL.createObjectURL(file),
        }));
        showToast(`${field} uploaded successfully.`, "success");
      } catch {
        showToast(`Failed to upload ${field}.`, "error");
      }
    };

  const completedCount = [
    isPersonalDataComplete,
    Boolean(profile.college && profile.year),
    Boolean(profile.email),
    Boolean(profile.whatsapp),
    Boolean(profile.collegeIdPic),
    Boolean(profile.govtIdPic),
  ].filter(Boolean).length;
  const totalChecks = 6;
  const score = Math.round((completedCount / totalChecks) * 100);

  return (
    <div className="flex flex-col gap-6 w-full" data-lenis-prevent>
      <DashboardWidget
        title="Personal Status"
        onManage={() =>
          showToast(
            "Profile archival and history logs are currently restricted.",
            "info",
          )
        }
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4 px-1">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 font-mono">
              User Details
            </h4>
            <button
              onClick={() => {
                if (isEditing) {
                  setIsEditing(false);
                  showToast("Profile settings saved.", "info");
                } else {
                  setIsEditing(true);
                  showToast("Edit mode enabled.", "success");
                }
              }}
              className={`px-3 py-1.5 rounded-lg border text-[9px] font-bold uppercase tracking-widest transition-all ${
                isEditing
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {isEditing ? "Save Profile" : "Edit Profile"}
            </button>
          </div>

          <EditableRow
            label="Full Name"
            value={profile.name}
            onChange={set("name")}
            locked={!isEditing} 
          />
          <EditableRow
            label="Gender"
            value={profile.gender}
            onChange={set("gender")}
            options={["MALE", "FEMALE", "OTHER"]}
            placeholder="Select gender"
            locked={!isEditing}
          />
          <EditableRow
            label="Phone"
            value={profile.whatsapp}
            onChange={set("whatsapp")}
            placeholder="+91 XXXXX XXXXX"
            locked={!isEditing}
          />
          <EditableRow
            label="College"
            value={profile.college}
            onChange={set("college")}
            placeholder="Your college"
            locked={!isEditing}
          />
          <EditableRow
            label="Year of study"
            value={profile.year}
            onChange={set("year")}
            placeholder="e.g. 3rd Year"
            locked={!isEditing}
          />
          <EditableRow
            label="Email"
            value={profile.email}
            onChange={set("email")}
            locked
          />
          <EditableRow
            label="Address"
            value={`${profile.city}${profile.city && profile.state ? ", " : ""}${profile.state}`}
            locked={!isEditing}
            onChange={async (value: string) => {
              const [cityPart, ...rest] = value.split(",").map((s) => s.trim());
              const city = cityPart || "";
              const state = rest.join(", ") || "";
              if (profile.city === city && profile.state === state) return;
              setProfile((p) => ({ ...p, city, state }));
              if (!userId) return;
              try {
                await updateProfileMutation.mutateAsync({ userId, city, state });
                showToast("Profile updated.", "success");
              } catch { showToast("Failed.", "error"); }
            }}
          />
        </div>
      </DashboardWidget>
    </div>
  );
}

function CompetitionsPanel({ competitions }: { competitions: EnrolledItem[] }) {
  const { showToast } = useDashboard();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full" data-lenis-prevent>
      <div className="lg:col-span-12">
        <DashboardWidget
          title="My Competitions"
          onManage={() =>
            showToast("Competition migration logs in progress.", "info")
          }
        >
          <div className="space-y-4">
            {competitions.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/5 py-12 text-center">
                <p className="text-sm text-white/20 italic font-mono uppercase tracking-widest leading-relaxed">
                  No registrations found.
                </p>
                <Link
                  href="/competitions"
                  className="mt-4 inline-block text-[10px] font-bold text-white/50 hover:text-white uppercase tracking-[0.2em] transition-all"
                >
                  Explore all &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {competitions.map((c) => (
                  <EnrolledCard
                    key={c.slug}
                    item={c}
                    href={`/competitions/${c.slug}`}
                  />
                ))}
              </div>
            )}
          </div>
        </DashboardWidget>
      </div>
    </div>
  );
}

function EventsPanel({ events }: { events: EnrolledItem[] }) {
  const { showToast } = useDashboard();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full" data-lenis-prevent>
      <div className="lg:col-span-12">
        <DashboardWidget
          title="Enrolled Events"
          onManage={() =>
            showToast("Reviewing event enrollment history.", "info")
          }
        >
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/5 py-12 text-center">
                <p className="text-sm text-white/20 italic font-mono uppercase tracking-widest leading-relaxed">
                  No events found.
                </p>
                <Link
                  href="/events"
                  className="mt-4 inline-block text-[10px] font-bold text-white/50 hover:text-white uppercase tracking-[0.2em] transition-all"
                >
                  Browse Events &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((e) => (
                  <EnrolledCard
                    key={e.slug}
                    item={e}
                    href={`/events/${e.slug}`}
                  />
                ))}
              </div>
            )}
          </div>
        </DashboardWidget>
      </div>
    </div>
  );
}

function CalendarPanel({
  competitions,
  events,
}: {
  competitions: EnrolledItem[];
  events: EnrolledItem[];
}) {
  const { showToast } = useDashboard();
  const [viewMode, setViewMode] = useState<"schedule" | "month">("schedule");
  const [currentDate, setCurrentDate] = useState(new Date()); 

  const generateGoogleCalLink = (title: string, dateStr: string) => {
    const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
    const text = encodeURIComponent(title);
    const dayMatch = dateStr.match(/\d+/);
    const day = dayMatch ? dayMatch[0] : "01";
    const isApril = dateStr.toLowerCase().includes("apr");
    const month = isApril ? "04" : "03";
    const dateParam = `2026${month}${day.padStart(2, "0")}T100000Z/2026${month}${day.padStart(2, "0")}T120000Z`;
    return `${baseUrl}&text=${text}&dates=${dateParam}&details=Neutron+Event+Registry`;
  };

  const schedule = [
    ...competitions.map((c) => ({ ...c, type: "Competition" })),
    ...events.map((e) => ({ ...e, type: "Event" })),
  ].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  const groupedSchedule = schedule.reduce(
    (acc, item) => {
      const dateKey = new Date(item.date).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    },
    {} as Record<string, typeof schedule>,
  );

  const sortedDates = Object.keys(groupedSchedule)
    .filter((dateStr) => {
      const d = new Date(dateStr);
      return (
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear()
      );
    })
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const getDaysInMonthGrid = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, full: null });
    }
    for (let i = 1; i <= totalDays; i++) {
      const fullDate = new Date(year, month, i).toDateString();
      days.push({ day: i, full: fullDate });
    }
    while (days.length < 42) {
      days.push({ day: null, full: null });
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() - 1);
      if (next.getFullYear() < 2026) return prev;
      return next;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + 1);
      if (next.getFullYear() > 2026) return prev;
      return next;
    });
  };

  const currentMonthName = currentDate.toLocaleString("en-US", {
    month: "long",
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      <div className="lg:col-span-12">
        <DashboardWidget
          title="Schedule Dashboard"
          onManage={() =>
            showToast("Syncing with Google Calendar API...", "info")
          }
        >
          <div className="max-w-5xl mx-auto py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 px-4 gap-6">
              <div className="flex items-center gap-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {viewMode === "schedule" ? "Timeline" : currentMonthName}{" "}
                  <span className="text-white/20 ml-2 font-light">2026</span>
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              <div className="hidden md:flex items-center bg-white/5 p-1.5 rounded-2xl border border-white/10 gap-1">
                <button
                  onClick={() => setViewMode("schedule")}
                  className={`px-5 py-2 rounded-xl text-[10px] uppercase tracking-widest font-extrabold transition-all ${viewMode === "schedule" ? "bg-white text-black shadow-xl" : "text-white/40 hover:text-white"}`}
                >
                  Schedule
                </button>
                <button
                  onClick={() => setViewMode("month")}
                  className={`px-5 py-2 rounded-xl text-[10px] uppercase tracking-widest font-extrabold transition-all ${viewMode === "month" ? "bg-white text-black shadow-xl" : "text-white/40 hover:text-white"}`}
                >
                  Month
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {viewMode === "schedule" ? (
                <motion.div
                  key="schedule"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-16 px-4"
                >
                  <div className="flex items-center gap-4 mb-4 opacity-50">
                    <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent"></div>
                    <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] font-mono">
                      {currentMonthName} 2026
                    </h3>
                    <div className="h-px flex-1 bg-linear-to-l from-white/10 to-transparent"></div>
                  </div>

                  {sortedDates.length === 0 ? (
                    <div className="py-24 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                        <Calendar size={24} className="text-white/10" />
                      </div>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] font-mono">
                        No events aligned for this month
                      </p>
                      <button
                        onClick={handleNextMonth}
                        className="mt-6 text-[9px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-all"
                      >
                        Next Month &rarr;
                      </button>
                    </div>
                  ) : (
                    sortedDates.map((dateStr) => {
                      const dayEvents = groupedSchedule[dateStr];
                      const dateObj = new Date(dateStr);
                      const month = dateObj
                        .toLocaleString("en-US", { month: "short" })
                        .toUpperCase();
                      const day = dateObj.getDate();
                      const isToday = false;

                      return (
                        <div
                          key={dateStr}
                          className="flex flex-col md:flex-row gap-6 md:gap-12 relative group"
                        >
                          <div className="md:w-28 shrink-0 md:text-right md:sticky md:top-24 h-fit">
                            <div className="flex md:flex-col items-baseline md:items-end gap-2 md:gap-0">
                              <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-[0.3em] font-mono mb-1">
                                {month}
                              </p>
                              <p className="text-4xl md:text-5xl font-light text-white tracking-tighter leading-none">
                                {day}
                                <span className="text-sm md:text-base ml-1 opacity-20 font-mono">
                                  th
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex-1 space-y-6 pb-4 border-l-2 md:border-l-2 border-white/5 pl-8 md:pl-12 relative">
                            <div className="absolute -left-px top-4 bottom-0 w-0.5 bg-linear-to-b from-white/10 via-white/5 to-transparent"></div>

                            {dayEvents.map((item) => (
                              <div
                                key={item.slug}
                                className="relative group/item"
                              >
                                <div className="absolute -left-[37px] md:-left-[53px] top-5 w-4 h-4 rounded-full border-4 border-[#000000] bg-white/10 group-hover/item:bg-emerald-500 group-hover/item:scale-125 transition-all duration-300 z-10 shadow-[0_0_15px_rgba(16,185,129,0)] group-hover/item:shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>

                                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 hover:border-emerald-500/50 hover:bg-black/80 transition-all duration-500 flex flex-col lg:flex-row lg:items-center justify-between gap-8 group/card overflow-hidden relative shadow-2xl">
                                  <div className="absolute inset-0 bg-linear-to-br from-white/2 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-white/10 shrink-0 group-hover/card:scale-105 transition-transform duration-500">
                                      <img
                                        src="/images/bg.jpeg"
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <span
                                          className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${item.type === "Competition" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"}`}
                                        >
                                          {item.type}
                                        </span>
                                        <div className="flex items-center gap-2 text-white/30 text-[10px] font-mono">
                                          <Target
                                            size={12}
                                            className="text-white/20"
                                          />
                                          <span>10:00 — 18:00 IST</span>
                                        </div>
                                      </div>
                                      <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight group-hover/card:text-emerald-400 transition-colors duration-300">
                                        {item.title}
                                      </h4>
                                      <div className="flex items-center gap-4 mt-3">
                                        <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-mono">
                                          {item.category}
                                        </p>
                                        <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                        <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-mono">
                                          Global Entry
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 relative z-10">
                                    <button
                                      onClick={() => {
                                        const link = generateGoogleCalLink(
                                          item.title,
                                          item.date,
                                        );
                                        window.open(link, "_blank");
                                        showToast(
                                          "Syncing with Google Calendar...",
                                          "success",
                                        );
                                      }}
                                      className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:bg-white hover:text-black hover:border-white transition-all duration-300 text-[11px] font-bold uppercase tracking-widest flex items-center gap-3 group/btn"
                                    >
                                      <Calendar
                                        size={16}
                                        className="group-hover/btn:scale-110 transition-transform"
                                      />
                                      <span className="hidden sm:inline">
                                        Add to Calendar
                                      </span>
                                      <span className="sm:hidden">Sync</span>
                                    </button>
                                    <Link
                                      href={`/${item.type === "Competition" ? "competitions" : "events"}/${item.slug}`}
                                      className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                      <ChevronRight size={20} />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="month"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="px-4"
                >
                  <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (d) => (
                        <div
                          key={d}
                          className="bg-[#050505] p-4 text-center border-b border-white/10"
                        >
                          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-mono">
                            {d}
                          </span>
                        </div>
                      ),
                    )}
                    {getDaysInMonthGrid(currentDate).map((d, i) => {
                      const hasEvents = d.full ? groupedSchedule[d.full] : null;
                      return (
                        <div
                          key={`${d.full}-${i}`}
                          className={`bg-[#030303] min-h-[120px] p-4 border-r border-b border-white/5 group hover:bg-white/2 transition-all relative ${d.day ? "cursor-pointer" : "opacity-10 pointer-events-none"}`}
                          onClick={() => hasEvents && setViewMode("schedule")}
                        >
                          <span className="text-sm font-light text-white/20 group-hover:text-white transition-colors">
                            {d.day}
                          </span>
                          <div className="mt-4 space-y-1.5">
                            {hasEvents?.slice(0, 2).map((ev) => (
                              <div
                                key={ev.slug}
                                className={`h-1.5 w-full rounded-full ${ev.type === "Competition" ? "bg-amber-500" : "bg-emerald-500"} opacity-40 group-hover:opacity-100 transition-opacity`}
                              ></div>
                            ))}
                            {(hasEvents?.length || 0) > 2 && (
                              <div className="h-1 text-[8px] font-bold text-white/10 group-hover:text-white/40 font-mono text-center">
                                +{hasEvents!.length - 2} MORE
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DashboardWidget>
      </div>
    </div>
  );
}

function InboxPanel({
  invites,
  onAccept,
  onDecline,
  isMutating,
}: {
  invites: any[];
  onAccept: (inviteToken: string) => void;
  onDecline: (inviteToken: string) => void;
  isMutating: boolean;
}) {
  const { showToast } = useDashboard();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      <div className="lg:col-span-12">
        <DashboardWidget
          title="Team Invites"
          onManage={() =>
            showToast("Scanning global network for pending invites...", "info")
          }
        >
          <div className="space-y-3 max-w-4xl mx-auto py-4">
            {invites.length === 0 && (
              <div className="rounded-3xl border border-dashed border-white/5 py-12 text-center">
                <p className="text-sm text-white/20 italic font-mono uppercase tracking-widest leading-relaxed">
                  No pending invites.
                </p>
              </div>
            )}
            {invites.map((inv) => (
              <div
                key={inv.id}
                className="bg-white/3 border border-white/8 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 sm:items-center justify-between hover:border-white/20 hover:bg-white/5 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                    <img
                      src="/images/bg.jpeg"
                      alt={inv.user}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-white">
                      {inv.user}{" "}
                      <span className="text-white/30 font-normal ml-1">
                        invited you to join
                      </span>
                    </p>
                    <p className="text-[11px] text-amber-400 font-bold mt-1 uppercase tracking-wider">
                      {inv.title}
                    </p>
                    <div className="flex items-center gap-2.5 mt-2">
                      <span className="text-[9px] text-white/20 font-mono uppercase tracking-widest">
                        {inv.time}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/10"></span>
                      <span className="text-[9px] text-white/50 border border-white/10 rounded-lg px-2 py-0.5 bg-white/5 font-bold uppercase tracking-widest">
                        {inv.role}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => onDecline(inv.inviteToken)}
                    disabled={isMutating}
                    className="h-10 px-5 bg-white/5 border border-white/10 text-white hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => onAccept(inv.inviteToken)}
                    disabled={isMutating}
                    className="h-10 px-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                  >
                    Accept Invite
                  </button>
                </div>
              </div>
            ))}
          </div>
        </DashboardWidget>
      </div>
    </div>
  );
}

// ─── Retro Desktop Components ───────────────────────────────────────────

interface WinState {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minimized: boolean;
  zIndex: number;
}

function RetroWindow({
  id, title, icon, children, winState, onClose, onMinimize, onFocus,
  onDrag,
}: {
  id: string; title: string; icon: string; children: React.ReactNode;
  winState: WinState; onClose: () => void; onMinimize: () => void;
  onFocus: () => void; onDrag: (id: string, dx: number, dy: number) => void;
}) {
  const drag = useRef<{ startX: number; startY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus();
    drag.current = { startX: e.clientX, startY: e.clientY };
    const onMove = (ev: MouseEvent) => {
      if (!drag.current) return;
      onDrag(id, ev.clientX - drag.current.startX, ev.clientY - drag.current.startY);
      drag.current = { startX: ev.clientX, startY: ev.clientY };
    };
    const onUp = () => {
      drag.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  if (winState.minimized) return null;

  return (
    <div
      onClick={onFocus}
      style={{
        position: "absolute",
        left: winState.x,
        top: winState.y,
        width: winState.w,
        height: winState.h,
        zIndex: winState.zIndex,
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(138,122,90,0.3)",
        borderRadius: 8,
        boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)",
        background: "rgba(26,18,8,0.85)",
        backdropFilter: "blur(16px)",
        userSelect: "none",
        overflow: "hidden",
      }}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          background: "linear-gradient(180deg,rgba(90,128,64,0.9) 0%,rgba(58,88,40,0.9) 100%)",
          backdropFilter: "blur(12px)",
          padding: "4px 8px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          cursor: "grab",
          borderBottom: "1px solid rgba(42,64,24,0.5)",
          flexShrink: 0,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 14, height: 14 }}>
          {icon.startsWith("http") || icon.startsWith("/") ? (
            <img src={icon} alt={title} style={{ width: 14, height: 14, imageRendering: "pixelated" }} />
          ) : (
            <span style={{ fontSize: 11 }}>{icon}</span>
          )}
        </div>
        <span style={{ flex: 1, color: "#d4e8b0", fontSize: 10, fontFamily: "Courier New,monospace", fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1 }}>
          {title}
        </span>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onMinimize}
          style={{ width: 14, height: 14, background: "#a8c870", border: "1px solid #5a7830", borderRadius: 2, fontSize: 8, cursor: "pointer", color: "#2a4010", lineHeight: 1, marginRight: 2 }}
        >_</button>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onClose}
          style={{ width: 14, height: 14, background: "#c86040", border: "1px solid #8a3020", borderRadius: 2, fontSize: 8, cursor: "pointer", color: "#fff", lineHeight: 1 }}
        >✕</button>
      </div>
      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: 0 }} data-lenis-prevent>
        {children}
      </div>
    </div>
  );
}

function DesktopIcon({ id, icon, label, x, y, onClick, onDrag }: { 
  id: string; icon: string; label: string; x: number; y: number; onClick: () => void; onDrag: (id: string, dx: number, dy: number) => void;
}) {
  const [hover, setHover] = useState(false);
  const drag = useRef<{ startX: number; startY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    drag.current = { startX: e.clientX, startY: e.clientY };
    
    const onMove = (ev: MouseEvent) => {
      if (!drag.current) return;
      onDrag(id, ev.clientX - drag.current.startX, ev.clientY - drag.current.startY);
      drag.current = { startX: ev.clientX, startY: ev.clientY };
    };
    
    const onUp = () => {
      drag.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      onClick={(e) => {
        // Only trigger click if it wasn't a drag
        if (drag.current === null) onClick();
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        padding: "8px 6px", borderRadius: 4, cursor: "grab", width: 72,
        background: hover ? "rgba(90,160,64,0.25)" : "transparent",
        border: hover ? "1px dashed #4a8030" : "1px dashed transparent",
        transition: "background 0.15s, border 0.15s",
        zIndex: 5,
        userSelect: "none",
      }}
    >
      {icon.startsWith("http") || icon.startsWith("/") ? (
        <img src={icon} alt={label} style={{ width:32, height:32, imageRendering:"pixelated", filter: hover ? "brightness(1.2) drop-shadow(0 0 8px rgba(160,255,80,0.4))" : "brightness(0.9)" }} />
      ) : (
        <span style={{ fontSize: 32, lineHeight: 1, filter: hover ? "brightness(1.2) drop-shadow(0 0 8px rgba(160,255,80,0.4))" : "brightness(0.9)" }}>{icon}</span>
      )}
      <span style={{
        fontSize: 9, fontFamily: "Courier New,monospace", color: "#c8d8a0", textAlign: "center",
        textShadow: "1px 1px 0 #000", lineHeight: 1.2, maxWidth: 68, wordBreak: "break-word",
        textTransform: "uppercase", letterSpacing: 0.5,
        background: hover ? "#1a3010" : "transparent", padding: "1px 3px", borderRadius: 2,
      }}>{label}</span>
    </div>
  );
}

function RetroTaskbar({
  windows, wins, onRestore, profileName, onLogout, isLoggingOut,
}: {
  windows: { id: string; title: string; icon: string }[];
  wins: WinState[];
  onRestore: (id: string) => void;
  profileName: string;
  onLogout: () => void;
  isLoggingOut: boolean;
}) {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }));
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })), 30000);
    return () => clearInterval(t);
  }, []);

  const tbStyle: React.CSSProperties = {
    height: 30, background: "linear-gradient(180deg,#3a2808 0%,#1e1404 100%)",
    borderTop: "2px solid #5a4020", display: "flex", alignItems: "center",
    gap: 4, padding: "0 8px", flexShrink: 0,
  };
  const btnBase: React.CSSProperties = {
    padding: "2px 8px", fontSize: 9, fontFamily: "Courier New,monospace", cursor: "pointer",
    border: "1px solid #5a4020", borderRadius: 2, color: "#c8b880", textTransform: "uppercase",
    letterSpacing: 0.5, height: 20,
  };

  return (
    <div style={tbStyle}>
      <div style={{ ...btnBase, background: "linear-gradient(180deg,#5a4a2a,#3a2a0a)", fontWeight: "bold", color: "#e8d8a0", marginRight: 4 }}>
        ◈ NEUTRON
      </div>
      <div style={{ display: "flex", gap: 3, flex: 1, overflow: "hidden" }}>
        {windows.map((w) => {
          const ws = wins.find((s) => s.id === w.id);
          const isMin = ws?.minimized;
          return (
            <button key={w.id} onClick={() => onRestore(w.id)} style={{
              ...btnBase,
              background: isMin ? "transparent" : "linear-gradient(180deg,#3a5020,#2a3818)",
              opacity: isMin ? 0.6 : 1,
              display: "flex", alignItems: "center", gap: 4,
            }}>
              {w.icon.startsWith("http") || w.icon.startsWith("/") ? (
                <img src={w.icon} alt={w.title} style={{ width: 12, height: 12, imageRendering: "pixelated" }} />
              ) : (
                <span>{w.icon}</span>
              )}
              {w.title}
            </button>
          );
        })}
      </div>
      <button onClick={onLogout} disabled={isLoggingOut} style={{ ...btnBase, background: "transparent", color: "#a88860", marginRight: 4 }}>
        {isLoggingOut ? "..." : "⏻ EXIT"}
      </button>
      <div style={{ ...btnBase, background: "linear-gradient(180deg,#2a2010,#1a1408)", borderColor: "#3a2810", color: "#a8c870", minWidth: 60, textAlign: "center" }}>
        {time}
      </div>
    </div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  const authMeQuery = useAuthMe();
  const updateProfileMutation = useUpdateUserProfile();
  const myRegistrationsQuery = useMyRegistrations(Boolean(authMeQuery.data));
  const pendingInvitesQuery = usePendingTeamInvites(Boolean(authMeQuery.data));
  const acceptInviteMutation = useAcceptTeamInvite();
  const declineInviteMutation = useDeclineTeamInvite();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success"|"error"|"info" } | null>(null);
  const showToast = (message: string, type: "success"|"error"|"info" = "success") => {
    setToast(null);
    setTimeout(() => setToast({ message, type }), 10);
  };

  const [profile, setProfile] = useState<ProfileState>(EMPTY_PROFILE);
  const authUser = ((authMeQuery.data as any)?.data?.user || (authMeQuery.data as any)?.user || authMeQuery.data) as Record<string,any>|undefined;
  const userId = (authUser?.id || authUser?._id || "") as string;

  useEffect(() => {
    if (!authUser) return;
    setProfile({
      name: authUser.name||"", email: authUser.email||"", bio: authUser.bio||"",
      college: authUser.collegeName||"", year: authUser.yearOfStudy||"",
      gender: authUser.gender||"", city: authUser.city||"", state: authUser.state||"",
      whatsapp: authUser.whatsappNumber||"", image: authUser.image||"",
      collegeIdPic: authUser.collegeIdPic||"", govtIdPic: authUser.govtIdPic||"",
    });
  }, [authUser]);

  const set = (key: keyof ProfileState) => async (val: string) => {
    let normalized = key === "gender" ? normalizeGender(val??"") : (val??"").trim();
    if (key === "whatsapp") {
      const d = normalized.replace(/\D/g,"");
      if (d.length < 10 || d.length > 15) { showToast("Phone must be 10–15 digits.","error"); return; }
    }
    if (profile[key] === normalized) return;
    const previous = profile[key];
    setProfile((p) => ({ ...p, [key]: normalized }));
    if (!userId) return;
    const fieldMap: Partial<Record<keyof ProfileState, Record<string,string>>> = {
      city:{city:normalized}, state:{state:normalized}, college:{collegeName:normalized},
      gender:{gender:normalized}, whatsapp:{whatsappNumber:normalized}, year:{yearOfStudy:normalized},
    };
    const payload = fieldMap[key];
    if (!payload) return;
    if (key === "gender" && !normalized) return;
    try {
      await updateProfileMutation.mutateAsync({ userId, ...payload });
      showToast("Profile updated.","success");
    } catch {
      setProfile((p) => ({ ...p, [key]: previous }));
      showToast("Failed to update.","error");
    }
  };

  const [expandedID, setExpandedID] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any|null>(null);

  const isPersonalDataComplete = Boolean((profile.name||profile.email) && profile.gender && (profile.city||profile.state));
  const isIdentityComplete = Boolean(isPersonalDataComplete && profile.college && profile.year && profile.email && profile.whatsapp && profile.collegeIdPic && profile.govtIdPic);
  
  const completedCount = [
    isPersonalDataComplete, Boolean(profile.college && profile.year),
    Boolean(profile.email), Boolean(profile.whatsapp),
    Boolean(profile.collegeIdPic), Boolean(profile.govtIdPic)
  ].filter(Boolean).length;
  const totalChecks = 6;
  const score = Math.round((completedCount / totalChecks) * 100);

  const myQRCodeQuery = useMyQRCode(expandedID && isIdentityComplete);
  const qrCodeUrl = myQRCodeQuery.data;
  const shouldFlipToQR = isIdentityComplete && Boolean(qrCodeUrl);

  const registrations = Array.isArray(myRegistrationsQuery.data) ? myRegistrationsQuery.data : [];
  const enrolledItems: EnrolledItem[] = registrations.map((entry: any) => {
    const comp = entry?.competition || {};
    const kind: EnrolledItem["kind"] = String(comp?.eventType||comp?.type||"").toUpperCase().includes("EVENT") ? "event" : "competition";
    const id = String(comp?.id||"");
    if (!id) return null;
    return {
      kind, id, slug: id, title: comp?.title||"", image: comp?.posterPath||"",
      category: comp?.category||comp?.type||"",
      date: formatDisplayDate(comp?.startTime||comp?.createdAt),
      status: toDashboardStatus(comp?.status),
      teamSize: formatTeamSize(comp?.minTeamSize, comp?.maxTeamSize),
      team: [],
    };
  }).filter(Boolean) as EnrolledItem[];

  const competitionItems = enrolledItems.filter((i) => i.kind === "competition");
  const eventItems = enrolledItems.filter((i) => i.kind === "event");
  const teamMembers = [{ id: userId||"me", name: profile.name||"", role:"You", avatar: profile.image||"", isMe:true }];
  const pendingInvites = Array.isArray(pendingInvitesQuery.data) ? pendingInvitesQuery.data : [];
  const inboxInvites = pendingInvites.map((item: any) => ({
    id: item?.invite?.id||item?.invite?.inviteToken,
    inviteToken: item?.invite?.inviteToken,
    title: item?.competition?.title||"",
    user: item?.inviter?.name||item?.inviter?.email||"",
    avatar: item?.inviter?.image||"",
    time: timeAgo(item?.invite?.createdAt),
    role: item?.team?.name||"Team Invite",
  }));

  const isLoadingData = authMeQuery.isLoading || myRegistrationsQuery.isLoading || pendingInvitesQuery.isLoading;

  const desktopRef = useRef<HTMLDivElement>(null);

  const [activeCompTab, setActiveCompTab] = useState<"competitions" | "events" | "calendar">("competitions");
  const [isProfileEditing, setIsProfileEditing] = useState(false);

  const scanlineStyle: React.CSSProperties = {
    position:"absolute", inset:0, pointerEvents:"none", zIndex:50,
    backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 4px)",
    borderRadius:"inherit",
  };
  return (
    <DashboardContext.Provider value={{ showToast, setExpandedID }}>
      <style>{`
        @keyframes cockpitPulse { 0%,100%{opacity:0.3} 50%{opacity:0.8} }
        @keyframes bgDistort {
          0%,100% { transform: scale(1.08) translate3d(0,0,0); filter: contrast(1.1) saturate(0.85) sepia(0.35) hue-rotate(-12deg); }
          25% { transform: scale(1.085) translate3d(-0.6%,0.4%,0); filter: contrast(1.18) saturate(0.95) sepia(0.42) hue-rotate(-18deg); }
          50% { transform: scale(1.09) translate3d(0.4%,-0.5%,0); filter: contrast(1.24) saturate(1) sepia(0.5) hue-rotate(-22deg); }
          75% { transform: scale(1.085) translate3d(-0.3%,0.2%,0); filter: contrast(1.18) saturate(0.9) sepia(0.42) hue-rotate(-16deg); }
        }
        .panel-scroll::-webkit-scrollbar{width:4px;}
        .panel-scroll::-webkit-scrollbar-track{background:#060f1e;}
        .panel-scroll::-webkit-scrollbar-thumb{background:#1a5a86;}
      `}</style>

      <div style={{minHeight:"100vh",padding:"28px 12px",position:"relative",overflow:"hidden",background:"#0e0906",color:"#f6ddc2",fontFamily:"'Courier New',monospace"}}>
        <video autoPlay loop muted playsInline style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",zIndex:0,opacity:0.3,animation:"bgDistort 9s ease-in-out infinite alternate",transformOrigin:"center"}}>
          <source src="https://res.cloudinary.com/dpod2sj9t/video/upload/v1774807451/4K_Space_Star_scene_-_Free_M.G_Stock_Footage_2160p_1_mzc4g7.mp4" type="video/mp4" />
        </video>
        <div style={{position:"absolute",inset:0,zIndex:1,background:"radial-gradient(circle at 50% 8%, rgba(255,186,112,0.2), transparent 42%), radial-gradient(circle at 50% 88%, rgba(170,92,38,0.24), transparent 54%), linear-gradient(180deg, rgba(19,12,8,0.42), rgba(8,10,18,0.92))"}} />
        <div style={{position:"absolute",inset:0,zIndex:1,pointerEvents:"none",mixBlendMode:"screen",background:"repeating-linear-gradient(120deg, rgba(255,210,160,0.02) 0px, rgba(255,210,160,0.02) 2px, transparent 2px, transparent 10px)"}} />

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} style={{position:"relative",zIndex:2,maxWidth:1480,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:10,fontSize:11,letterSpacing:4,color:"#f1b579",textTransform:"uppercase"}}>Neutron Rocket Cockpit Console</div>

          <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.25 }} style={{position:"relative",padding:"44px 18px 24px",borderRadius:"32px 32px 22px 22px",background:"linear-gradient(180deg,#2a170f 0%, #1a100b 58%, #0f0906 100%)",boxShadow:"0 0 0 2px #533424, 0 24px 60px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,211,168,0.25)"}}>
            <div style={{position:"absolute",left:"12%",right:"12%",top:-88,height:180,borderRadius:"0 0 220px 220px",border:"8px solid rgba(97,64,40,0.95)",borderTop:"14px solid rgba(76,49,30,0.95)",boxShadow:"0 10px 30px rgba(0,0,0,0.45), inset 0 0 35px rgba(229,151,94,0.2)",pointerEvents:"none"}} />
            <div style={{position:"absolute",left:-48,top:96,width:110,height:"70%",transform:"skewY(-12deg)",borderRadius:"22px 0 0 22px",background:"linear-gradient(180deg,#2e1b12,#120a07)",boxShadow:"inset -1px 0 0 #70472f"}} />
            <div style={{position:"absolute",right:-48,top:96,width:110,height:"70%",transform:"skewY(12deg)",borderRadius:"0 22px 22px 0",background:"linear-gradient(180deg,#2e1b12,#120a07)",boxShadow:"inset 1px 0 0 #70472f"}} />

            <div style={{margin:"0 auto 12px",width:"min(460px,86%)",padding:"8px 14px",borderRadius:12,background:"linear-gradient(180deg,#27170f,#321d12)",border:"1px solid #825332",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:10,letterSpacing:2,color:"#f4c893"}}>MISSION CONTROL // PROFILE STATION</span>
              <span style={{fontSize:10,color:"#ffd08e"}}>{new Date().toLocaleTimeString()}</span>
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:12}}>
              {[{label:"Signal",value:"99%"},{label:"Hull",value:"Stable"},{label:"Sync",value:`${score}%`}].map((chip) => (
                <motion.div key={chip.label} whileHover={{ scale: 1.03 }} style={{padding:"6px 10px",borderRadius:8,border:"1px solid #8c5d3c",background:"rgba(62,36,20,0.45)",minWidth:96,textAlign:"center"}}>
                  <div style={{fontSize:9,color:"#dfa66d",letterSpacing:1,textTransform:"uppercase"}}>{chip.label}</div>
                  <div style={{fontSize:10,color:"#ffe2be",marginTop:2,fontWeight:700}}>{chip.value}</div>
                </motion.div>
              ))}
            </div>

            <div ref={desktopRef} style={{position:"relative",borderRadius:18,padding:14,border:"1px solid #70482f",background:"linear-gradient(180deg,#1a110c 0%, #0f0a06 100%)",boxShadow:"inset 0 0 35px rgba(191,117,61,0.2)"}}>
              <div style={scanlineStyle} />
              <div style={{position:"absolute",inset:0,pointerEvents:"none",borderRadius:16,background:"repeating-linear-gradient(0deg, rgba(255,255,255,0.015), rgba(255,255,255,0.015) 1px, transparent 1px, transparent 3px)"}} />
              <div style={{position:"absolute",left:12,right:12,top:8,height:38,borderRadius:10,border:"1px solid rgba(188,126,79,0.45)",background:"linear-gradient(180deg,rgba(72,44,25,0.42),rgba(30,18,12,0.15))",pointerEvents:"none"}} />

              <div style={{display:"grid",gridTemplateColumns:"1fr 1.4fr 1fr",gap:14,minHeight:560,marginTop:26}}>
                <motion.div whileHover={{ y: -3, boxShadow:"0 0 24px rgba(201,126,68,0.25)" }} style={{border:"1px solid #5b3a26",borderRadius:12,padding:12,background:"linear-gradient(180deg,#1e130d,#120b07)",display:"flex",flexDirection:"column",minHeight:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <h3 style={{margin:0,fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"#e7b47f"}}>Competitions</h3>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={()=>showToast("Competition controls are available in modules view.","info")} style={{fontSize:9,letterSpacing:1,padding:"4px 8px",borderRadius:6,border:"1px solid #8f633f",background:"rgba(142,96,56,0.2)",color:"#f6cd9d",cursor:"pointer"}}>EDIT</button>
                      <button onClick={()=>setActiveCompTab("competitions")} style={{fontSize:9,letterSpacing:1,padding:"4px 8px",borderRadius:6,border:"1px solid #8f633f",background:activeCompTab==="competitions"?"#5e3922":"transparent",color:"#f3c692",cursor:"pointer"}}>COMPS</button>
                      <button onClick={()=>setActiveCompTab("events")} style={{fontSize:9,letterSpacing:1,padding:"4px 8px",borderRadius:6,border:"1px solid #8f633f",background:activeCompTab==="events"?"#5e3922":"transparent",color:"#f3c692",cursor:"pointer"}}>EVENTS</button>
                    </div>
                  </div>
                  <div className="panel-scroll" style={{overflowY:"auto",paddingRight:4}}>
                    {(activeCompTab==="events"?eventItems:competitionItems).length===0?(
                      <div style={{fontSize:11,color:"#5e87aa",padding:"18px 8px",border:"1px dashed #224562",borderRadius:8}}>No {activeCompTab} yet.</div>
                    ):(
                      (activeCompTab==="events"?eventItems:competitionItems).map((item) => (
                        <motion.div key={`${item.kind}-${item.id}`} whileHover={{ x: 3, scale: 1.01 }} style={{padding:"10px 8px",marginBottom:8,borderRadius:8,border:"1px solid #674229",background:"rgba(57,33,18,0.4)"}}>
                          <div style={{fontSize:11,color:"#ffe1bf",fontWeight:700}}>{item.title || "Untitled"}</div>
                          <div style={{fontSize:10,color:"#d9a36f",marginTop:4}}>{item.category || item.kind.toUpperCase()}</div>
                          <div style={{fontSize:10,color:"#bb8554",marginTop:2}}>{item.date || "Date TBD"}  |  {item.status || "PENDING"}</div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -3, boxShadow:"0 0 30px rgba(214,139,76,0.3)" }} style={{border:"1px solid #764c31",borderRadius:14,padding:14,background:"radial-gradient(circle at 50% 0%, rgba(152,86,43,0.22), rgba(26,16,10,0.95) 56%)",display:"flex",flexDirection:"column",position:"relative"}}>
                  <div style={{position:"absolute",top:8,right:10,fontSize:9,letterSpacing:2,color:"#ffc480",textTransform:"uppercase",animation:"cockpitPulse 1.8s ease-in-out infinite"}}>{isLoadingData ? "Syncing..." : "Online"}</div>
                  <button
                    onClick={() => {
                      setIsProfileEditing((prev) => !prev);
                      showToast(isProfileEditing ? "Profile view locked." : "Profile edit mode enabled.", "info");
                    }}
                    style={{position:"absolute",top:8,left:10,fontSize:9,letterSpacing:1,padding:"4px 8px",borderRadius:6,border:"1px solid #8f633f",background:isProfileEditing?"rgba(142,96,56,0.36)":"rgba(142,96,56,0.2)",color:"#f6cd9d",cursor:"pointer"}}
                  >
                    {isProfileEditing ? "SAVE" : "EDIT"}
                  </button>
                  <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
                    <motion.div animate={{ boxShadow:["0 0 18px rgba(217,133,74,0.25)","0 0 30px rgba(217,133,74,0.48)","0 0 18px rgba(217,133,74,0.25)"] }} transition={{ duration: 3, repeat: Infinity }} style={{height:124,width:124,borderRadius:"50%",padding:4,border:"2px solid #b26b3b"}}>
                      <img src={profile.image||"/images/bg.jpeg"} alt={profile.name||"Profile"} style={{height:"100%",width:"100%",borderRadius:"50%",objectFit:"cover"}} />
                    </motion.div>
                  </div>
                  <div style={{textAlign:"center",marginBottom:10}}>
                    {isProfileEditing ? (
                      <input value={profile.name} onChange={(e)=>setProfile((p)=>({ ...p, name:e.target.value }))} style={{fontSize:16,color:"#ffe7cb",fontWeight:700,letterSpacing:1,textAlign:"center",width:"100%",background:"rgba(36,21,12,0.8)",border:"1px solid #9d633b",borderRadius:8,padding:"6px 8px"}} />
                    ) : (
                      <div style={{fontSize:18,color:"#ffe7cb",fontWeight:700,letterSpacing:1}}>{profile.name || "User"}</div>
                    )}
                    <div style={{fontSize:11,color:"#f0b77f",marginTop:3}}>{profile.email || "No email configured"}</div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:4}}>
                    <div style={{border:"1px solid #6a452c",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:9,color:"#d89f69"}}>COLLEGE</div>{isProfileEditing ? <input value={profile.college} onChange={(e)=>setProfile((p)=>({ ...p, college:e.target.value }))} style={{marginTop:4,width:"100%",fontSize:11,color:"#ffe2bf",background:"rgba(36,21,12,0.8)",border:"1px solid #9d633b",borderRadius:6,padding:"4px 6px"}} /> : <div style={{fontSize:11,color:"#ffe2bf",marginTop:4}}>{profile.college || "N/A"}</div>}</div>
                    <div style={{border:"1px solid #6a452c",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:9,color:"#d89f69"}}>YEAR</div>{isProfileEditing ? <input value={profile.year} onChange={(e)=>setProfile((p)=>({ ...p, year:e.target.value }))} style={{marginTop:4,width:"100%",fontSize:11,color:"#ffe2bf",background:"rgba(36,21,12,0.8)",border:"1px solid #9d633b",borderRadius:6,padding:"4px 6px"}} /> : <div style={{fontSize:11,color:"#ffe2bf",marginTop:4}}>{profile.year || "N/A"}</div>}</div>
                    <div style={{border:"1px solid #6a452c",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:9,color:"#d89f69"}}>LOCATION</div>{isProfileEditing ? <input value={[profile.city, profile.state].filter(Boolean).join(", ")} onChange={(e)=>{ const [cityPart, ...rest] = e.target.value.split(",").map((s) => s.trim()); setProfile((p)=>({ ...p, city: cityPart || "", state: rest.join(", ") || "" })); }} style={{marginTop:4,width:"100%",fontSize:11,color:"#ffe2bf",background:"rgba(36,21,12,0.8)",border:"1px solid #9d633b",borderRadius:6,padding:"4px 6px"}} /> : <div style={{fontSize:11,color:"#ffe2bf",marginTop:4}}>{[profile.city, profile.state].filter(Boolean).join(", ") || "N/A"}</div>}</div>
                    <div style={{border:"1px solid #6a452c",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:9,color:"#d89f69"}}>TEAM</div><div style={{fontSize:11,color:"#ffe2bf",marginTop:4}}>{teamMembers.length} Member</div></div>
                  </div>
                  <div style={{marginTop:10,border:"1px dashed #80553a",borderRadius:8,padding:"8px 10px",fontSize:10,color:"#e7af79"}}>
                    {isProfileEditing ? (
                      <textarea value={profile.bio} onChange={(e)=>setProfile((p)=>({ ...p, bio:e.target.value }))} rows={3} style={{width:"100%",fontSize:10,color:"#ffe2bf",background:"rgba(36,21,12,0.8)",border:"1px solid #9d633b",borderRadius:6,padding:"6px 8px",resize:"vertical"}} />
                    ) : (
                      profile.bio || "Add your bio to complete the mission profile."
                    )}
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -3, boxShadow:"0 0 24px rgba(201,126,68,0.25)" }} style={{border:"1px solid #5b3a26",borderRadius:12,padding:12,background:"linear-gradient(180deg,#1e130d,#120b07)",display:"flex",flexDirection:"column",minHeight:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <h3 style={{margin:0,fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"#e7b47f"}}>Inbox</h3>
                    <button onClick={()=>showToast("Inbox actions open from message cards.","info")} style={{fontSize:9,letterSpacing:1,padding:"4px 8px",borderRadius:6,border:"1px solid #8f633f",background:"rgba(142,96,56,0.2)",color:"#f6cd9d",cursor:"pointer"}}>EDIT</button>
                  </div>
                  <div className="panel-scroll" style={{overflowY:"auto",paddingRight:4}}>
                    {inboxInvites.length===0?(
                      <div style={{fontSize:11,color:"#5e87aa",padding:"18px 8px",border:"1px dashed #224562",borderRadius:8}}>No messages in your inbox.</div>
                    ):(
                      inboxInvites.map((invite) => (
                        <motion.div key={invite.id} whileHover={{ x: 3, scale: 1.01 }} style={{padding:"10px 8px",marginBottom:8,borderRadius:8,border:"1px solid #674229",background:"rgba(57,33,18,0.4)"}}>
                          <div style={{fontSize:11,color:"#ffe1bf",fontWeight:700}}>{invite.title || "Team Invite"}</div>
                          <div style={{fontSize:10,color:"#d9a36f",marginTop:4}}>From: {invite.user || "Unknown user"}</div>
                          <div style={{fontSize:10,color:"#bb8554",marginTop:2}}>{invite.time || "Just now"}  |  {invite.role || "Invite"}</div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>
            </div>

            <div style={{display:"flex",justifyContent:"center",gap:14,marginTop:14}}>
              <motion.button whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={logout} style={{background:"transparent",border:"1px solid #8f633f",color:"#f6cb9a",padding:"9px 22px",cursor:"pointer",letterSpacing:2,fontSize:10,borderRadius:8,textTransform:"uppercase"}}>Logout</motion.button>
              <motion.button whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={()=>setExpandedID(true)} style={{background:"linear-gradient(180deg,#f2b371,#d28342)",color:"#221309",border:"none",padding:"9px 22px",cursor:"pointer",letterSpacing:2,fontWeight:700,fontSize:10,borderRadius:8,textTransform:"uppercase"}}>Open Identity</motion.button>
            </div>
            <div style={{width:210,height:70,margin:"12px auto 0",clipPath:"polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",background:"linear-gradient(180deg,#3a2418,#22140d)",border:"1px solid #7f5436",boxShadow:"inset 0 0 18px rgba(183,119,68,0.25)"}} />
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
        {selectedMember&&<MemberProfileModal member={selectedMember} onClose={()=>setSelectedMember(null)}/>}
        {expandedID&&(
          <div className="fixed inset-0 z-200 flex items-center justify-center p-6">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setExpandedID(false)} className="absolute inset-0 bg-black/95 backdrop-blur-2xl"/>
            <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.8}} transition={{type:"spring",damping:20}} className="relative z-10 w-full max-w-md">
              <motion.div animate={{rotateY:shouldFlipToQR?180:0}} transition={{duration:0.8}} style={{transformStyle:"preserve-3d"}} className="relative w-full">
                <div style={{backfaceVisibility:"hidden"}}><ProfileCard name={profile.name} title={profile.college} handle={(profile.email||"").split("@")[0]||""} status={profile.year} contactText={isIdentityComplete?"SCANNABLE ID READY":"DOWNLOAD ID"} avatarUrl="/images/bg.jpeg" showUserInfo={false} enableTilt enableMobileTilt behindGlowColor="rgba(125,190,255,0.6)" iconUrl="🪪" behindGlowEnabled innerGradient="linear-gradient(145deg,#2e106520 0%,#1e3a8a40 100%)"/></div>
                <div style={{backfaceVisibility:"hidden",transform:"rotateY(180deg)"}} className="absolute inset-0 rounded-[30px] border border-white/10 bg-[#0a0a0a] p-6 flex flex-col items-center justify-center">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono mb-4">Entry QR</p>
                  {myQRCodeQuery.data?<img src={myQRCodeQuery.data} alt="QR" className="w-44 h-44 rounded-xl bg-white p-2"/>:<div className="w-44 h-44 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"><div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"/></div>}
                </div>
              </motion.div>
              <button onClick={()=>setExpandedID(false)} className="mt-12 mx-auto flex items-center gap-2 text-[10px] font-bold text-white/20 hover:text-rose-400 uppercase tracking-widest transition-all group">
                <X size={14} className="group-hover:rotate-90 transition-transform"/> Close Identity Viewer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardContext.Provider>
  );
}
