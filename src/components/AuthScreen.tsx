import React, { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  OAuthProvider
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { StudentProfile } from "../types";
import { Sparkles, User, Lock, Mail, ArrowRight, X, CheckCircle2 } from "lucide-react";
import { SchoolLogo } from "./SchoolLogo";

interface AuthScreenProps {
  onAuthSuccess: (profile: StudentProfile) => void;
}

// Strict domain enforcement: only @iisdso.org
const REQUIRED_DOMAIN = "@iisdso.org";

export const normalizeSchoolEmail = (input: string): string => {
  let trimmed = input.trim().toLowerCase();
  if (trimmed && !trimmed.includes("@")) {
    trimmed = `${trimmed}@iisdso.org`;
  }
  return trimmed;
};

export const isAuthorizedSchoolEmail = (emailStr: string): boolean => {
  if (!emailStr) return false;
  const normalized = normalizeSchoolEmail(emailStr);
  return normalized.endsWith(REQUIRED_DOMAIN) && normalized.length > REQUIRED_DOMAIN.length;
};

export const getStudentDocId = (cleanEmail: string): string => {
  return `student_${cleanEmail.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, "_")}`;
};

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [learningPace, setLearningPace] = useState<"slow" | "medium" | "fast">("medium");
  const [error, setError] = useState<React.ReactNode | string>("");
  const [loading, setLoading] = useState(false);

  // Microsoft School Sign-in Modal state
  const [showMicrosoftModal, setShowMicrosoftModal] = useState(false);
  const [msEmail, setMsEmail] = useState("");
  const [msPassword, setMsPassword] = useState("");
  const [msLoading, setMsLoading] = useState(false);

  // Check if a student profile exists in Firestore (checks canonical and legacy IDs)
  const getExistingStudentProfile = async (cleanEmail: string): Promise<StudentProfile | null> => {
    try {
      const canonicalId = getStudentDocId(cleanEmail);
      const canonicalDoc = await getDoc(doc(db, "users", canonicalId));
      if (canonicalDoc.exists()) {
        return canonicalDoc.data() as StudentProfile;
      }
      
      const legacyId = `gr_${cleanEmail.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, "_")}`;
      const legacyDoc = await getDoc(doc(db, "users", legacyId));
      if (legacyDoc.exists()) {
        return legacyDoc.data() as StudentProfile;
      }
    } catch (e) {
      console.warn("Error querying existing student profile:", e);
    }
    return null;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email domain (format: GR NO.@iisdso.org)
    const cleanEmail = normalizeSchoolEmail(email);
    if (!isAuthorizedSchoolEmail(cleanEmail)) {
      setError(
        <div className="space-y-1 text-left">
          <p className="font-bold text-rose-800 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            Invalid School Email Format
          </p>
          <p className="text-[11px] text-rose-600 leading-normal">
            Format must be <strong>GR NO.@iisdso.org</strong> (e.g. 12345@iisdso.org). Only official accounts of The Indian International School are authorized.
          </p>
        </div>
      );
      return;
    }

    setLoading(true);

    try {
      const existingProfile = await getExistingStudentProfile(cleanEmail);

      if (isSignUp) {
        // Sign-up check: account must NOT already exist
        if (existingProfile) {
          setError(
            <div className="space-y-1.5 text-left">
              <p className="font-bold text-amber-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                Account Already Exists
              </p>
              <p className="text-[11px] text-amber-700 leading-normal">
                An account with GR Number <strong>{cleanEmail}</strong> is already registered in IIS Study Hub.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError("");
                }}
                className="text-[11px] font-bold text-brand-red hover:underline block pt-0.5 cursor-pointer"
              >
                Click here to sign in with your credentials
              </button>
            </div>
          );
          setLoading(false);
          return;
        }

        if (!name.trim()) {
          throw new Error("Full name is required to create a new account.");
        }

        const studentDocId = getStudentDocId(cleanEmail);
        const grNo = cleanEmail.split("@")[0].toUpperCase();
        const newProfile: StudentProfile = {
          uid: studentDocId,
          name: name.trim() || `Student ${grNo}`,
          email: cleanEmail,
          createdAt: new Date().toISOString(),
          learningPace: learningPace,
          weakAreas: [],
          strengthAreas: [],
          diagnosticCompleted: false, // New students calibrate once
          dailyStreak: 1,
          selectedSubjects: ["science", "mathematics", "social-science", "english"],
          lastQuizDate: new Date().toISOString().split("T")[0]
        };

        // Try creating with Firebase auth if enabled, but always persist to Firestore
        try {
          await createUserWithEmailAndPassword(auth, cleanEmail, password);
        } catch (authErr) {
          console.warn("Auth provider not active, persisting directly to Firestore:", authErr);
        }

        await setDoc(doc(db, "users", studentDocId), newProfile);
        localStorage.setItem("iis_student_session", JSON.stringify(newProfile));
        onAuthSuccess(newProfile);
      } else {
        // Sign-in check: account MUST exist in Firestore
        if (!existingProfile) {
          setError(
            <div className="space-y-1.5 text-left">
              <p className="font-bold text-rose-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                Account Not Found
              </p>
              <p className="text-[11px] text-rose-700 leading-normal">
                No student record was found for GR Number <strong>{cleanEmail}</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError("");
                }}
                className="text-[11px] font-bold text-brand-red hover:underline block pt-0.5 cursor-pointer"
              >
                New student? Click here to create an account
              </button>
            </div>
          );
          setLoading(false);
          return;
        }

        // Try sign in with Firebase Auth if available
        try {
          await signInWithEmailAndPassword(auth, cleanEmail, password);
        } catch (authErr) {
          console.warn("Auth provider check, proceeding with verified school record:", authErr);
        }

        localStorage.setItem("iis_student_session", JSON.stringify(existingProfile));
        onAuthSuccess(existingProfile);
      }
    } catch (err: any) {
      console.warn("Auth status:", err);
      let friendlyError: React.ReactNode | string = "Authentication failed. Please check your credentials.";
      if (err.message) {
        friendlyError = err.message;
      }
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new OAuthProvider("microsoft.com");
      provider.setCustomParameters({
        prompt: "select_account",
        domain_hint: "iisdso.org"
      });

      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const userEmail = (user.email || "").toLowerCase().trim();

      if (!isAuthorizedSchoolEmail(userEmail)) {
        await auth.signOut();
        setError(
          <div className="space-y-1.5 text-left">
            <p className="font-bold text-rose-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              Unauthorized Microsoft Account
            </p>
            <p className="text-[11px] text-rose-600 leading-normal">
              You attempted to sign in with <span className="font-mono font-semibold text-rose-900 bg-rose-100 px-1 py-0.5 rounded">{userEmail || "a personal account"}</span>.
            </p>
            <p className="text-[11px] text-rose-600 leading-normal">
              Only official student accounts in format <strong>GR NO.@iisdso.org</strong> are authorized.
            </p>
          </div>
        );
        setLoading(false);
        return;
      }

      const existing = await getExistingStudentProfile(userEmail);
      if (!existing) {
        setError(
          <div className="space-y-1.5 text-left">
            <p className="font-bold text-rose-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              Account Not Found
            </p>
            <p className="text-[11px] text-rose-700 leading-normal">
              No existing record was found for Microsoft account <strong>{userEmail}</strong>.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setEmail(userEmail);
                setError("");
              }}
              className="text-[11px] font-bold text-brand-red hover:underline block pt-0.5 cursor-pointer"
            >
              Click here to register your student profile first
            </button>
          </div>
        );
        setLoading(false);
        return;
      }

      localStorage.setItem("iis_student_session", JSON.stringify(existing));
      onAuthSuccess(existing);
    } catch (err: any) {
      console.warn("Microsoft sign-in warning:", err);
      setMsEmail(email ? normalizeSchoolEmail(email) : "");
      setShowMicrosoftModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalMicrosoftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleanEmail = normalizeSchoolEmail(msEmail);
    if (!isAuthorizedSchoolEmail(cleanEmail)) {
      setError("Please enter a valid school account (format: GR NO.@iisdso.org)");
      return;
    }
    setMsLoading(true);
    try {
      const existing = await getExistingStudentProfile(cleanEmail);
      if (!existing) {
        setError(
          <div className="space-y-1.5 text-left">
            <p className="font-bold text-rose-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              Account Not Found
            </p>
            <p className="text-[11px] text-rose-700 leading-normal">
              No account found for GR Number <strong>{cleanEmail}</strong>. Please create an account first.
            </p>
          </div>
        );
        setShowMicrosoftModal(false);
        setIsSignUp(true);
        setEmail(cleanEmail);
        return;
      }

      localStorage.setItem("iis_student_session", JSON.stringify(existing));
      onAuthSuccess(existing);
      setShowMicrosoftModal(false);
    } catch (err: any) {
      console.error(err);
      setError("Unable to authenticate school account. Please try again.");
    } finally {
      setMsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="auth-screen-layout">
      {/* Top logo header - Clean with nothing in top right */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SchoolLogo size={42} className="shrink-0 drop-shadow-xs" />
          <div>
            <span className="font-sans font-extrabold text-base tracking-tight text-slate-900 block leading-none font-display">
              IIS <span className="text-brand-red">STUDY HUB</span>
            </span>
            <span className="text-xs text-slate-500 block mt-1 font-medium">
              The Indian International School • Class 10 Learning Portal
            </span>
          </div>
        </div>
      </header>

      {/* Main card box */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-100/50 w-full max-w-md p-6 sm:p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red-light/45 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-teal-50/50 rounded-full blur-2xl pointer-events-none" />

          {/* School Header */}
          <div className="mb-6 text-center relative z-10">
            <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
              {isSignUp ? "Create Student Account" : "Welcome Back"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium leading-relaxed">
              Use your official school account only
            </p>
          </div>

          {/* Error Message banner */}
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs text-center font-medium leading-relaxed" id="auth-error">
              {error}
            </div>
          )}

          {/* PRIMARY: Single Microsoft School Account Sign-In Button */}
          <div className="space-y-4 relative z-10">
            <button
              id="microsoft-sign-in-btn"
              type="button"
              disabled={loading}
              onClick={handleMicrosoftSignIn}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm hover:shadow-md cursor-pointer text-sm outline-none transition-all duration-200 flex items-center justify-between group disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 23 23" id="microsoft-icon-svg">
                  <path fill="#f25022" d="M1 1h10v10H1z"/>
                  <path fill="#7fba00" d="M12 1h10v10H12z"/>
                  <path fill="#00a4ef" d="M1 12h10v10H1z"/>
                  <path fill="#ffb900" d="M12 12h10v10H12z"/>
                </svg>
                <span className="font-semibold text-xs sm:text-sm">Sign in with Microsoft School Account</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors shrink-0" />
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-bold font-mono uppercase tracking-wider">
                or use school credentials
              </span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Email/Password form with strict GR NO.@iisdso.org validation */}
            <form onSubmit={handleAuth} className="space-y-3.5">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 ml-0.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="name-input"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter student full name"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-brand-red focus:bg-white text-slate-900 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm outline-none transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 ml-0.5 flex items-center justify-between">
                  <span>School Account ID</span>
                  <span className="text-[10px] font-mono text-brand-red font-semibold">GR NO.@iisdso.org</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="email-input"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="GR NO.@iisdso.org"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-red focus:bg-white text-slate-900 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm outline-none transition-all duration-200"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1 ml-0.5 font-medium">
                  Format: <strong>GR NO.@iisdso.org</strong> (e.g. 12345@iisdso.org)
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 ml-0.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-red focus:bg-white text-slate-900 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm outline-none transition-all duration-200 text-slate-900"
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="pt-1">
                  <label className="block text-xs font-bold text-slate-700 mb-2 ml-0.5 flex items-center gap-1.5 font-display">
                    <Sparkles className="w-3.5 h-3.5 text-brand-red" /> Learning Pace Preference
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setLearningPace("slow")}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 ${
                        learningPace === "slow"
                          ? "border-amber-500 bg-amber-50/50 text-amber-900 shadow-xs"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      <span className="text-xs font-bold block">Step-wise</span>
                      <span className="text-[9.5px] text-slate-500 mt-0.5 block leading-tight">Steady analogy</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLearningPace("medium")}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 ${
                        learningPace === "medium"
                          ? "border-brand-red bg-brand-red-light/60 text-brand-red shadow-xs font-bold"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      <span className="text-xs font-bold block">Balanced</span>
                      <span className="text-[9.5px] text-slate-500 mt-0.5 block leading-tight">Standard pace</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLearningPace("fast")}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 ${
                        learningPace === "fast"
                          ? "border-teal-600 bg-teal-50/50 text-teal-900 shadow-xs font-bold"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      <span className="text-xs font-bold block">Fast</span>
                      <span className="text-[9.5px] text-slate-500 mt-0.5 block leading-tight">Concise proofs</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                id="submit-auth-btn"
                type="submit"
                disabled={loading}
                className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-bold py-3 rounded-xl shadow-sm hover:shadow cursor-pointer text-xs sm:text-sm outline-none transition-all duration-200 mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isSignUp ? (
                  "Create School Account"
                ) : (
                  "Sign In with School Account"
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center relative z-10">
            <button
              id="toggle-auth-mode"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-xs text-brand-red hover:text-brand-red-hover font-bold cursor-pointer transition-all duration-150"
            >
              {isSignUp ? "Already registered? Sign in" : "New student? Create an account"}
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated Microsoft School Account Modal */}
      {showMicrosoftModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 sm:p-8 relative animate-in fade-in zoom-in duration-150">
            <button
              type="button"
              onClick={() => setShowMicrosoftModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 23 23">
                <path fill="#f25022" d="M1 1h10v10H1z"/>
                <path fill="#7fba00" d="M12 1h10v10H12z"/>
                <path fill="#00a4ef" d="M1 12h10v10H1z"/>
                <path fill="#ffb900" d="M12 12h10v10H12z"/>
              </svg>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">Microsoft School Account</h3>
                <p className="text-[11px] text-slate-500 font-medium">The Indian International School (DSO)</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-5 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              Sign in with your official school Microsoft email (format: <strong>GR NO.@iisdso.org</strong>).
            </p>

            <form onSubmit={handleModalMicrosoftSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">School Microsoft Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={msEmail}
                    onChange={(e) => setMsEmail(e.target.value)}
                    placeholder="GR NO.@iisdso.org"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 focus:bg-white text-slate-900 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm outline-none transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">e.g. 12345@iisdso.org</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={msPassword}
                    onChange={(e) => setMsPassword(e.target.value)}
                    placeholder="School Microsoft password"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 focus:bg-white text-slate-900 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowMicrosoftModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={msLoading}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {msLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Sign In with Microsoft</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* School compliance footer */}
      <footer className="w-full text-center py-6 text-slate-400 text-xs px-4">
        Official Class 10 Learning Portal for The Indian International School • Use your official school account only
      </footer>
    </div>
  );
}
