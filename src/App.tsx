import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./lib/firebase";
import { ChapterProgress, QuizAttemptLog, StudentProfile } from "./types";
import { CBSE_SUBJECTS, CBSE_QUESTIONS } from "./data/cbseData";
import { SchoolLogo } from "./components/SchoolLogo";
import AuthScreen from "./components/AuthScreen";
import DiagnosticTest from "./components/DiagnosticTest";
import DashboardTab from "./components/DashboardTab";
import SubjectsTab from "./components/SubjectsTab";
import PracticeTimedTab from "./components/PracticeTimedTab";
import ChatCompanionTab from "./components/ChatCompanionTab";
import AIDoubtSolverTab from "./components/AIDoubtSolverTab";
import ExamPaperMakerTab from "./components/ExamPaperMaker/ExamPaperMakerTab";
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Timer, 
  Bot, 
  LogOut, 
  Flame, 
  Calendar,
  XCircle, 
  HelpCircle,
  Clock,
  Sparkles,
  FileText,
  Menu,
  X,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

// Helper to map student's weak topics to chapters
const getChaptersForWeakAreas = (weakAreas: string[]) => {
  const weakChaptersMap = new Map<string, { chapterId: string; subjectId: string; chapterTitle: string; subjectName: string; topics: string[] }>();
  
  weakAreas.forEach((topic) => {
    // Find questions with this topic
    const question = CBSE_QUESTIONS.find(q => q.topic.toLowerCase() === topic.toLowerCase());
    if (question) {
      const subject = CBSE_SUBJECTS.find(s => s.id === question.subjectId);
      const chapter = subject?.chapters.find(c => c.id === question.chapterId);
      
      if (chapter && subject) {
        const key = `${question.subjectId}_${question.chapterId}`;
        if (!weakChaptersMap.has(key)) {
          weakChaptersMap.set(key, {
            chapterId: question.chapterId,
            subjectId: question.subjectId,
            chapterTitle: chapter.title,
            subjectName: subject.name,
            topics: [topic]
          });
        } else {
          const item = weakChaptersMap.get(key)!;
          if (!item.topics.includes(topic)) {
            item.topics.push(topic);
          }
        }
      }
    } else {
      // If we don't find it directly by topic, check if any chapter title matches/contains the topic or vice versa
      CBSE_SUBJECTS.forEach((subject) => {
        subject.chapters.forEach((chapter) => {
          if (
            chapter.title.toLowerCase().includes(topic.toLowerCase()) ||
            topic.toLowerCase().includes(chapter.title.toLowerCase())
          ) {
            const key = `${subject.id}_${chapter.id}`;
            if (!weakChaptersMap.has(key)) {
              weakChaptersMap.set(key, {
                chapterId: chapter.id,
                subjectId: subject.id,
                chapterTitle: chapter.title,
                subjectName: subject.name,
                topics: [topic]
              });
            } else {
              const item = weakChaptersMap.get(key)!;
              if (!item.topics.includes(topic)) {
                item.topics.push(topic);
              }
            }
          }
        });
      });
    }
  });
  
  return Array.from(weakChaptersMap.values());
};

export default function App() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizAttemptLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "subjects" | "practice" | "paper-maker" | "chat" | "doubt-solver">("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Dynamic context for launching practice tests
  const [practiceSubjectId, setPracticeSubjectId] = useState<string | undefined>(undefined);
  const [practiceChapterId, setPracticeChapterId] = useState<string | undefined>(undefined);

  // Auto-selection pass to Syllabus list
  const [selectedSyllabusSubjectId, setSelectedSyllabusSubjectId] = useState<string | undefined>(undefined);

  // Daily Quiz overlay states
  const [activeDailyQuizQuestions, setActiveDailyQuizQuestions] = useState<any[] | null>(null);
  const [currentDqIdx, setCurrentDqIdx] = useState<number>(0);
  const [selectedDqOption, setSelectedDqOption] = useState<number | null>(null);
  const [dqAnswers, setDqAnswers] = useState<number[]>([]);
  const [dqTimeElapsed, setDqTimeElapsed] = useState<number>(0);
  const [dqTimerInterval, setDqTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [showDqResult, setShowDqResult] = useState<boolean>(false);
  const [submittingDq, setSubmittingDq] = useState<boolean>(false);

  // Streak maintenance alert states
  const [showStreakAlert, setShowStreakAlert] = useState<boolean>(false);
  const [suggestedWeakChapter, setSuggestedWeakChapter] = useState<{ chapterId: string; subjectId: string; chapterTitle: string; subjectName: string; topics: string[] } | null>(null);
  const [hoursSinceLastWeakEngagement, setHoursSinceLastWeakEngagement] = useState<number>(0);

  // Load student records from Firestore
  const loadStudentRecords = async (uid: string) => {
    try {
      // 1. Fetch main profile
      const profRef = doc(db, "users", uid);
      const profSnap = await getDoc(profRef);
      if (profSnap.exists()) {
        const storedProfile = profSnap.data() as StudentProfile;
        
        // Dynamic Daily Study Streak adjustment
        const todayStr = new Date().toISOString().split("T")[0];
        let streak = storedProfile.dailyStreak || 1;
        if (storedProfile.lastQuizDate) {
          const lastDate = new Date(storedProfile.lastQuizDate);
          const todayDate = new Date(todayStr);
          const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
          
          if (diffDays === 1) {
            streak += 1;
            await setDoc(profRef, { ...storedProfile, dailyStreak: streak, lastQuizDate: todayStr });
          } else if (diffDays > 1) {
            streak = 1; // Resets streak
            await setDoc(profRef, { ...storedProfile, dailyStreak: 1, lastQuizDate: todayStr });
          }
        }
        setProfile({ ...storedProfile, dailyStreak: streak });
        localStorage.setItem("iis_student_session", JSON.stringify({ ...storedProfile, dailyStreak: streak }));
      } else if (profile) {
        await setDoc(profRef, profile);
      }

      // 2. Fetch chapter progress subcollection
      const progQuery = query(collection(db, "users", uid, "progress"));
      const progSnap = await getDocs(progQuery);
      const progList: ChapterProgress[] = [];
      progSnap.forEach((d) => {
        progList.push({ id: d.id, ...d.data() } as ChapterProgress);
      });
      setChapterProgress(progList);

      // 3. Fetch completed quiz logs
      const quizzesQuery = query(collection(db, "users", uid, "quizzes"));
      const quizzesSnap = await getDocs(quizzesQuery);
      const quizzesList: QuizAttemptLog[] = [];
      quizzesSnap.forEach((d) => {
        quizzesList.push({ id: d.id, ...d.data() } as QuizAttemptLog);
      });
      setQuizHistory(quizzesList);
    } catch (err) {
      console.error("Error loading student records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if there is an active local student session
    const localSessionStr = localStorage.getItem("iis_student_session");
    if (localSessionStr) {
      try {
        const localProf = JSON.parse(localSessionStr) as StudentProfile;
        if (localProf && localProf.email && localProf.email.endsWith("@iisdso.org")) {
          setProfile(localProf);
          loadStudentRecords(localProf.uid);
        }
      } catch (e) {
        console.warn("Could not parse saved student session:", e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Enforce @iisdso.org domain strictly across sessions
        const email = (user.email || "").toLowerCase().trim();
        if (!email.endsWith("@iisdso.org")) {
          console.warn("Unauthorized domain detected, signing out:", email);
          localStorage.removeItem("iis_student_session");
          await signOut(auth);
          setProfile(null);
          setChapterProgress([]);
          setQuizHistory([]);
          setLoading(false);
          return;
        }
        loadStudentRecords(user.uid);
      } else {
        const savedSession = localStorage.getItem("iis_student_session");
        if (!savedSession) {
          setProfile(null);
          setChapterProgress([]);
          setQuizHistory([]);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Monitor engagement with weak chapters to maintain daily streak (48-hour threshold)
  useEffect(() => {
    if (!profile || profile.weakAreas.length === 0 || quizHistory.length === 0) {
      setShowStreakAlert(false);
      setSuggestedWeakChapter(null);
      return;
    }

    // 1. Map weak topics to their actual CBSE chapters
    const weakChapters = getChaptersForWeakAreas(profile.weakAreas);
    if (weakChapters.length === 0) {
      setShowStreakAlert(false);
      setSuggestedWeakChapter(null);
      return;
    }

    // 2. Sort by chapter high score from progress, to recommend the absolute weakest one first
    const sortedWeakChapters = [...weakChapters].sort((a, b) => {
      const progA = chapterProgress.find(p => p.chapterId === a.chapterId && p.subjectId === a.subjectId);
      const progB = chapterProgress.find(p => p.chapterId === b.chapterId && p.subjectId === b.subjectId);
      const scoreA = progA ? (progA.highScore || 0) : 0;
      const scoreB = progB ? (progB.highScore || 0) : 0;
      return scoreA - scoreB;
    });

    const targetWeakChapter = sortedWeakChapters[0];

    // 3. Find the last engagement time with ANY of the user's weak chapters
    const lastWeakEngagement = quizHistory
      .filter(attempt => weakChapters.some(wc => wc.chapterId === attempt.chapterId && wc.subjectId === attempt.subjectId))
      .reduce((max, attempt) => Math.max(max, new Date(attempt.date).getTime()), 0);

    const now = Date.now();
    const baselineTime = profile.createdAt ? new Date(profile.createdAt).getTime() : now;
    const lastEngagementTime = lastWeakEngagement > 0 ? lastWeakEngagement : baselineTime;

    const diffMs = now - lastEngagementTime;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    setHoursSinceLastWeakEngagement(diffHours);

    // If it is over 48 hours, show the alert
    if (diffHours >= 48) {
      setShowStreakAlert(true);
      setSuggestedWeakChapter(targetWeakChapter);
    } else {
      setShowStreakAlert(false);
      setSuggestedWeakChapter(null);
    }
  }, [profile, quizHistory, chapterProgress]);

  const handleUpdateChapterProgress = async (newProg: ChapterProgress) => {
    setChapterProgress((prev) => {
      const idx = prev.findIndex((p) => p.chapterId === newProg.chapterId && p.subjectId === newProg.subjectId);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = newProg;
        return copy;
      }
      return [...prev, newProg];
    });

    if (profile) {
      try {
        const pId = `${newProg.subjectId}_${newProg.chapterId}`;
        const progRef = doc(db, "users", profile.uid, "progress", pId);
        await setDoc(progRef, {
          ...newProg,
          id: pId,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error("Failed to save chapter progress to Firestore:", err);
      }
    }
  };

  const handleQuizSubmit = async (result: QuizAttemptLog, updatedProfile: StudentProfile) => {
    setQuizHistory((prev) => [...prev, result]);
    setProfile(updatedProfile);
    localStorage.setItem("iis_student_session", JSON.stringify(updatedProfile));

    if (profile) {
      try {
        const quizRef = doc(db, "users", profile.uid, "quizzes", result.id);
        await setDoc(quizRef, result);

        const profRef = doc(db, "users", profile.uid);
        await setDoc(profRef, updatedProfile, { merge: true });
      } catch (err) {
        console.error("Failed to save quiz results to Firestore:", err);
      }
    }
  };

  const handleLaunchChapterQuiz = (subjectId: string, chapterId: string) => {
    setPracticeSubjectId(subjectId);
    setPracticeChapterId(chapterId);
    setActiveTab("practice");
  };

  const handleLogout = async () => {
    setLoading(true);
    localStorage.removeItem("iis_student_session");
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Sign out warning:", e);
    }
    setProfile(null);
    setChapterProgress([]);
    setQuizHistory([]);
    setLoading(false);
  };

  // 4. DAILY QUIZ ROUTINES
  const handleLaunchDailyQuiz = (quizId: string, questions: any[]) => {
    setActiveDailyQuizQuestions(questions);
    setCurrentDqIdx(0);
    setSelectedDqOption(null);
    setDqAnswers([]);
    setDqTimeElapsed(0);
    setShowDqResult(false);

    const timer = setInterval(() => {
      setDqTimeElapsed((prev) => prev + 1);
    }, 1000);
    setDqTimerInterval(timer);
  };

  const handleNextDailyQuizQ = async () => {
    if (selectedDqOption === null || !activeDailyQuizQuestions) return;

    const updatedAnswers = [...dqAnswers, selectedDqOption];
    setDqAnswers(updatedAnswers);

    if (currentDqIdx < activeDailyQuizQuestions.length - 1) {
      setCurrentDqIdx((prev) => prev + 1);
      setSelectedDqOption(null);
    } else {
      // Finished daily quiz
      if (dqTimerInterval) clearInterval(dqTimerInterval);
      setSubmittingDq(true);

      let correctCount = 0;
      const weakTopics: string[] = [];

      activeDailyQuizQuestions.forEach((q, idx) => {
        const isCorrect = updatedAnswers[idx] === q.correctAnswerIndex;
        if (isCorrect) {
          correctCount++;
        } else {
          if (!weakTopics.includes(q.topic)) weakTopics.push(q.topic);
        }
      });

      const scorePct = Math.round((correctCount / activeDailyQuizQuestions.length) * 100);
      const attemptId = `daily_${Date.now()}`;

      if (profile) {
        const newLog: QuizAttemptLog = {
          id: attemptId,
          uid: profile.uid,
          subjectId: "general",
          chapterId: "all",
          type: "daily_quiz",
          score: scorePct,
          correctCount,
          totalCount: activeDailyQuizQuestions.length,
          timeTaken: dqTimeElapsed,
          date: new Date().toISOString(),
          weakTopicsIdentified: weakTopics,
        };

        try {
          await setDoc(doc(db, "users", profile.uid, "quizzes", attemptId), newLog);

          const currentWeak = [...profile.weakAreas];
          weakTopics.forEach((t) => {
            if (!currentWeak.includes(t)) currentWeak.push(t);
          });

          const updatedProfile: StudentProfile = {
            ...profile,
            weakAreas: currentWeak.slice(0, 8),
            lastQuizDate: new Date().toISOString().split("T")[0],
          };

          await setDoc(doc(db, "users", profile.uid), updatedProfile, { merge: true });
          localStorage.setItem("iis_student_session", JSON.stringify(updatedProfile));

          setQuizHistory((prev) => [...prev, newLog]);
          setProfile(updatedProfile);
          setShowDqResult(true);
        } catch (e) {
          console.error("Error committing daily quiz results:", e);
        }
      }
      setSubmittingDq(false);
    }
  };

  const handleCloseDailyQuiz = () => {
    if (dqTimerInterval) clearInterval(dqTimerInterval);
    setActiveDailyQuizQuestions(null);
    setShowDqResult(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center" id="global-loading">
        <div className="w-10 h-10 border-3 border-brand-red/20 border-t-brand-red rounded-full animate-spin mb-4" />
        <span className="text-xs text-slate-500 font-medium">
          Loading Class 10 Study Hub...
        </span>
      </div>
    );
  }

  // Auth Guard
  if (!profile) {
    return (
      <AuthScreen 
        onAuthSuccess={(prof) => {
          setProfile(prof);
          localStorage.setItem("iis_student_session", JSON.stringify(prof));
          loadStudentRecords(prof.uid);
        }} 
      />
    );
  }

  // NCERT Class 10 Diagnostic Guard
  if (profile && !profile.diagnosticCompleted) {
    return (
      <DiagnosticTest
        profile={profile}
        onComplete={async (weakAreas, strengthAreas) => {
          try {
            const userDocRef = doc(db, "users", profile.uid);
            const updated: StudentProfile = {
              ...profile,
              weakAreas,
              strengthAreas,
              diagnosticCompleted: true,
            };
            await setDoc(userDocRef, updated, { merge: true });
            localStorage.setItem("iis_student_session", JSON.stringify(updated));
            setProfile(updated);
          } catch (err) {
            console.error("Failed to commit diagnostic profile:", err);
          }
        }}
      />
    );
  }

  // Average Score Calculation for global header
  const totalQuizScoreSum = quizHistory.reduce((acc, attempt) => acc + attempt.score, 0);
  const avgQuizScore = quizHistory.length > 0 ? Math.round(totalQuizScoreSum / quizHistory.length) : 0;

  return (
    <div className="min-h-screen bg-slate-50/70 flex font-sans text-slate-900" id="app-workspace">
      {/* Mobile Sidebar Overlay Backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR (Matching Image 2) */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 w-64 xl:w-72 bg-white border-r border-slate-200/80 z-50 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
        id="app-sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header / Brand */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SchoolLogo size={36} className="shrink-0 drop-shadow-xs" />
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-slate-900 leading-tight font-display">
                  IIS <span className="text-brand-red">Study Hub</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Class 10 Learning Portal
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3.5 space-y-1.5 flex-1 overflow-y-auto">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-3 block py-1.5">
              Menu
            </span>

            <button
              id="nav-tab-dashboard"
              onClick={() => {
                setActiveTab("dashboard");
                setPracticeChapterId(undefined);
                setPracticeSubjectId(undefined);
                setSelectedSyllabusSubjectId(undefined);
                setMobileSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-brand-red text-white shadow-xs"
                  : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard</span>
              </div>
              {activeTab === "dashboard" && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
            </button>

            <button
              id="nav-tab-subjects"
              onClick={() => {
                setActiveTab("subjects");
                setPracticeChapterId(undefined);
                setPracticeSubjectId(undefined);
                setSelectedSyllabusSubjectId(undefined);
                setMobileSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "subjects"
                  ? "bg-brand-red text-white shadow-xs"
                  : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Syllabus & Chapters</span>
              </div>
              {activeTab === "subjects" && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
            </button>

            <button
              id="nav-tab-practice"
              onClick={() => {
                setActiveTab("practice");
                setMobileSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "practice"
                  ? "bg-brand-red text-white shadow-xs"
                  : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Timer className="w-4 h-4 shrink-0" />
                <span>Past Year Tests</span>
              </div>
              {activeTab === "practice" && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
            </button>

            <button
              id="nav-tab-paper-maker"
              onClick={() => {
                setActiveTab("paper-maker");
                setPracticeChapterId(undefined);
                setPracticeSubjectId(undefined);
                setSelectedSyllabusSubjectId(undefined);
                setMobileSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "paper-maker"
                  ? "bg-brand-red text-white shadow-xs"
                  : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 shrink-0" />
                <span>Exam Paper Maker</span>
              </div>
              <span className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded font-bold ${
                activeTab === "paper-maker"
                  ? "bg-white/20 text-white"
                  : "bg-emerald-100 text-emerald-800"
              }`}>
                100% PYQs
              </span>
            </button>

            <div className="pt-4 pb-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-3 block py-1.5">
                AI Assistants
              </span>
            </div>

            <button
              id="nav-tab-chat"
              onClick={() => {
                setActiveTab("chat");
                setPracticeChapterId(undefined);
                setPracticeSubjectId(undefined);
                setMobileSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "chat"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-purple-700 hover:bg-purple-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 shrink-0" />
                <span>Study Companion</span>
              </div>
              {activeTab === "chat" && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
            </button>

            <button
              id="nav-tab-doubt-solver"
              onClick={() => {
                setActiveTab("doubt-solver");
                setPracticeChapterId(undefined);
                setPracticeSubjectId(undefined);
                setMobileSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "doubt-solver"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-purple-700 hover:bg-purple-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>AI Doubt Solver</span>
              </div>
              {activeTab === "doubt-solver" && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
            </button>
          </div>

          {/* User Profile Card at Sidebar Bottom */}
          <div className="p-3.5 border-t border-slate-100 bg-slate-50/60">
            <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-brand-red-light border border-brand-red/20 shadow-2xs flex items-center justify-center text-brand-red font-bold text-xs select-none shrink-0">
                    {profile.name ? profile.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "S"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate leading-tight">{profile.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{profile.learningPace} Pace</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 shrink-0">
                  <Flame className="w-3 h-3 fill-amber-500" />
                  <span>{profile.dailyStreak}d</span>
                </div>
              </div>

              <button
                id="sidebar-logout-btn"
                onClick={handleLogout}
                className="w-full py-1.5 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-650 rounded-lg text-slate-500 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Log out of IIS Study Hub"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 lg:pl-64 xl:pl-72 flex flex-col min-h-screen min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-5 py-3 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-650 cursor-pointer transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 font-display">
                {activeTab === "dashboard" && "Dashboard Overview"}
                {activeTab === "subjects" && "Class 10 Syllabus & Chapterwise Question Bank"}
                {activeTab === "practice" && "Official Past Year Timed Practice"}
                {activeTab === "paper-maker" && "Class 10 Board Exam Paper Maker"}
                {activeTab === "chat" && "Personal AI Study Companion"}
                {activeTab === "doubt-solver" && "Socratic AI Doubt Solver"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Streak & Accuracy Stats (Clean, professional, NO pulsating lights) */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1 text-xs">
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
              <span className="font-bold text-slate-700">{profile.dailyStreak} Day Streak</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1 text-xs">
              <span className="text-slate-500">Accuracy:</span>
              <span className="font-bold text-emerald-600">{avgQuizScore}%</span>
            </div>

            <div className="w-8 h-8 rounded-full bg-brand-red-light border border-brand-red/20 flex items-center justify-center text-brand-red font-bold text-xs select-none">
              {profile.name ? profile.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "S"}
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Streak At Risk Alert */}
          {showStreakAlert && suggestedWeakChapter && activeTab === "dashboard" && (
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-amber-200 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in" id="streak-maintenance-alert">
              <div className="flex gap-3.5 items-start bg-transparent">
                <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 text-orange-600 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <Flame className="w-5 h-5 fill-orange-500" />
                </div>
                <div className="space-y-1 bg-transparent">
                  <div className="flex items-center gap-2 flex-wrap bg-transparent">
                    <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-orange-600 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/10">
                      Streak At Risk
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-bold">
                      Last engagement: {hoursSinceLastWeakEngagement} hours ago
                    </span>
                  </div>
                  <h4 className="font-display font-extrabold text-xs text-slate-850 tracking-tight leading-snug">
                    Revise your weakest chapters to secure your {profile.dailyStreak} Day Streak!
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed max-w-2xl">
                    You haven't engaged with your diagnosed weak topics (such as <strong className="text-slate-700 font-semibold">"{suggestedWeakChapter.topics.join(", ")}"</strong>) in over 48 hours. Take a quick revision test in <strong className="text-slate-700 font-semibold">{suggestedWeakChapter.subjectName}</strong>: <strong className="text-slate-700 font-semibold">"{suggestedWeakChapter.chapterTitle}"</strong> to boost your accuracy.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto bg-transparent">
                <button
                  id="streak-alert-dismiss-btn"
                  onClick={() => setShowStreakAlert(false)}
                  className="px-3.5 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-500 transition-colors cursor-pointer bg-white"
                >
                  Dismiss
                </button>
                <button
                  id="streak-alert-practice-btn"
                  onClick={() => handleLaunchChapterQuiz(suggestedWeakChapter.subjectId, suggestedWeakChapter.chapterId)}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-extrabold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Timer className="w-4 h-4" /> Practice Chapter Now
                </button>
              </div>
            </div>
          )}

          {/* Active Panel View */}
          <div id="active-panel" className="w-full">
            {activeTab === "dashboard" && (
              <DashboardTab
                profile={profile}
                chapterProgress={chapterProgress}
                quizHistory={quizHistory}
                onLaunchDailyQuiz={handleLaunchDailyQuiz}
                onSelectSubject={(subId) => {
                  setSelectedSyllabusSubjectId(subId);
                  setActiveTab("subjects");
                }}
                onNavigateTab={(tab, prefilledPrompt) => {
                  setActiveTab(tab as any);
                  if (prefilledPrompt) {
                    localStorage.setItem("iis_prefilled_chat_prompt", prefilledPrompt);
                  }
                }}
              />
            )}

            {activeTab === "subjects" && (
              <SubjectsTab
                profile={profile}
                chapterProgress={chapterProgress}
                onUpdateProgress={handleUpdateChapterProgress}
                onLaunchChapterQuiz={handleLaunchChapterQuiz}
                initialSubjectId={selectedSyllabusSubjectId}
              />
            )}

            {activeTab === "practice" && (
              <PracticeTimedTab
                key={`${practiceSubjectId}_${practiceChapterId}`}
                profile={profile}
                chapterProgress={chapterProgress}
                onQuizSubmit={handleQuizSubmit}
                initialSubjectId={practiceSubjectId}
                initialChapterId={practiceChapterId}
              />
            )}

            {activeTab === "paper-maker" && <ExamPaperMakerTab profile={profile} />}

            {activeTab === "chat" && <ChatCompanionTab profile={profile} />}
            {activeTab === "doubt-solver" && <AIDoubtSolverTab profile={profile} />}
          </div>
        </main>
      </div>

      {/* 5. OVERLAY MODAL: DAILY DRILL ARENA */}
      {activeDailyQuizQuestions && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="daily-quiz-overlay">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200/50 shadow-2xl p-6 md:p-8 space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto w-full">
            <button
              onClick={handleCloseDailyQuiz}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>

            {/* A: Ongoing quiz loop */}
            {!showDqResult ? (
              <div className="space-y-5" id="dq-loop">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-800 font-display">Daily Diagnostic Drill</span>
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Timer: {dqTimeElapsed}s</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-brand-red bg-brand-red-light py-1 px-2.5 rounded font-bold border border-brand-red-border/40">
                    Question {currentDqIdx + 1} of {activeDailyQuizQuestions.length}
                  </span>
                  <h3 className="font-display font-bold text-slate-900 text-lg md:text-xl mt-3 leading-snug">
                    {activeDailyQuizQuestions[currentDqIdx].question}
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {activeDailyQuizQuestions[currentDqIdx].options.map((opt: string, oIdx: number) => {
                    const isSelected = selectedDqOption === oIdx;
                    return (
                      <button
                        key={oIdx}
                        id={`dq-option-${oIdx}`}
                        onClick={() => setSelectedDqOption(oIdx)}
                        className={`w-full text-left p-3.5 rounded-lg border text-xs font-semibold select-text transition-all cursor-pointer ${
                          isSelected
                            ? "border-brand-red bg-brand-red-light/40 text-brand-red"
                            : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <button
                    id="dq-next-btn"
                    onClick={handleNextDailyQuizQ}
                    disabled={selectedDqOption === null || submittingDq}
                    className="w-full bg-brand-red hover:bg-brand-red-hover disabled:opacity-40 text-white font-bold py-3 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    {submittingDq ? (
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : currentDqIdx === activeDailyQuizQuestions.length - 1 ? (
                      "Submit Daily Drill"
                    ) : (
                      "Next Question"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // B: Finished result presentation
              <div className="space-y-5 text-center" id="dq-completed-report">
                <div className="w-14 h-14 bg-brand-red-light text-brand-red rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <Sparkles className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="font-display font-bold text-xl text-slate-900">Drill Evaluated!</h3>
                  <p className="text-xs text-slate-500 mt-1">Excellent consistency! Keep up the revision streaks.</p>
                </div>

                {/* Micro report */}
                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto py-3">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Score</span>
                    <span className="text-lg font-bold font-display text-brand-red block">
                      {quizHistory[quizHistory.length - 1]?.score}%
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Speed</span>
                    <span className="text-lg font-bold font-display text-green-600 block">
                      {quizHistory[quizHistory.length - 1]?.timeTaken}s
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    id="dq-close-btn"
                    onClick={handleCloseDailyQuiz}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-lg text-xs cursor-pointer"
                  >
                    Close & Return to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
