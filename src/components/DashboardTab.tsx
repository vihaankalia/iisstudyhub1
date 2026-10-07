import React, { useState, useEffect, useMemo } from "react";
import { QuizAttemptLog, StudentProfile, ChapterProgress } from "../types";
import { DAILY_QUIZZES, CBSE_SUBJECTS } from "../data/cbseData";
import { 
  TrendingUp, 
  Target, 
  Flame, 
  Sparkles, 
  HelpCircle,
  Play, 
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Award, 
  Calendar,
  XCircle, 
  BookOpen,
  CheckCircle2,
  Hourglass,
  RefreshCw,
  ArrowRight,
  GraduationCap,
  FileText,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Clock,
  Compass,
  Check
} from "lucide-react";

function renderCleanTextAndSymbols(text: string) {
  if (!text) return "";
  
  let cleaned = text
    .replace(/\\angle\s*([A-Za-z0-9])/g, "∠$1")
    .replace(/\\angle/g, "∠")
    .replace(/\$\\angle\s*([A-Za-z0-9])\$/g, "∠$1")
    .replace(/\$([A-Za-z0-9θ+-=/*·^²³\\ ]+)\$/g, "$1")
    .replace(/\\theta/g, "θ")
    .replace(/\\alpha/g, "α")
    .replace(/\\beta/g, "β")
    .replace(/\\pi/g, "π")
    .replace(/\\sqrt\{([^}]+)\}/g, "√$1")
    .replace(/\\sqrt/g, "√")
    .replace(/[\$\\]rightarrow/g, "→")
    .replace(/\\pm/g, "±")
    .replace(/\\deg/g, "°")
    .replace(/\^\{2\}/g, "²")
    .replace(/\^2/g, "²")
    .replace(/\^\{3\}/g, "³")
    .replace(/\^3/g, "³")
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\Delta/g, "Δ")
    .replace(/\\Sigma/g, "Σ");

  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  
  const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3/g;
  let match;
  let key = 0;
  
  while ((match = regex.exec(cleaned)) !== null) {
    const matchIndex = match.index;
    
    if (matchIndex > currentIndex) {
      parts.push(cleaned.slice(currentIndex, matchIndex));
    }
    
    if (match[1]) {
      parts.push(<strong key={key++} className="font-extrabold text-slate-900">{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={key++} className="italic text-slate-700">{match[4]}</em>);
    }
    
    currentIndex = regex.lastIndex;
  }
  
  if (currentIndex < cleaned.length) {
    parts.push(cleaned.slice(currentIndex));
  }
  
  return parts.length > 0 ? parts : cleaned;
}

interface TimerConfig {
  name: string;
  focusMinutes: number;
  breakMinutes: number;
  icon: string;
  description: string;
  colorClass: string;
}

const TIMER_STYLES: Record<string, TimerConfig> = {
  pomodoro: {
    name: "Classic Pomodoro",
    focusMinutes: 25,
    breakMinutes: 5,
    icon: "⏱️",
    description: "Standard focused blocks with light intervals to retain active concepts.",
    colorClass: "brand-red",
  },
  sprint: {
    name: "Revision Sprint",
    focusMinutes: 15,
    breakMinutes: 3,
    icon: "⚡",
    description: "Brief burst blocks for rapid math formula and science law memorization.",
    colorClass: "amber-600",
  },
  deep: {
    name: "Deep Cognitive Focus",
    focusMinutes: 50,
    breakMinutes: 10,
    icon: "🧠",
    description: "Extended learning sessions to read entire curriculum chapters in depth.",
    colorClass: "purple-600",
  },
  exam: {
    name: "Board Exam Simulation",
    focusMinutes: 90,
    breakMinutes: 15,
    icon: "📝",
    description: "Simulates actual timed sections to build long-duration focus and stamina.",
    colorClass: "blue-600",
  },
};

interface DashboardTabProps {
  profile: StudentProfile;
  chapterProgress: ChapterProgress[];
  quizHistory: QuizAttemptLog[];
  onLaunchDailyQuiz: (quizId: string, questions: any[]) => void;
  onSelectSubject?: (subjectId: string) => void;
  onNavigateTab?: (tab: string, prefilledPrompt?: string) => void;
}

export default function DashboardTab({
  profile,
  chapterProgress,
  quizHistory,
  onLaunchDailyQuiz,
  onSelectSubject,
  onNavigateTab,
}: DashboardTabProps) {
  const [recommendation, setRecommendation] = useState<string>("");
  const [loadingRecommend, setLoadingRecommend] = useState<boolean>(false);

  // Calendar month state
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date(2026, 9, 1)); // October 2026
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(5);

  // Timer states
  const [timerExpanded, setTimerExpanded] = useState<boolean>(() => {
    return localStorage.getItem("iis_timer_expanded") === "true";
  });
  const [timerStyle, setTimerStyle] = useState<string>(() => {
    return localStorage.getItem("iis_timer_style") || "pomodoro";
  });
  const [isBreak, setIsBreak] = useState<boolean>(() => {
    return localStorage.getItem("iis_timer_is_break") === "true";
  });
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const savedTime = localStorage.getItem("iis_timer_time_left");
    if (savedTime) return parseInt(savedTime, 10);
    return 25 * 60;
  });
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(() => {
    return parseInt(localStorage.getItem("iis_completed_sessions") || "0", 10);
  });
  const [totalFocusSeconds, setTotalFocusSeconds] = useState<number>(() => {
    return parseInt(localStorage.getItem("iis_total_focus_sec") || "0", 10);
  });
  const [alertSoundEnabled, setAlertSoundEnabled] = useState<boolean>(true);

  // Synchronize dynamic timer values to localStorage
  useEffect(() => {
    localStorage.setItem("iis_timer_expanded", String(timerExpanded));
  }, [timerExpanded]);

  useEffect(() => {
    localStorage.setItem("iis_timer_style", timerStyle);
  }, [timerStyle]);

  useEffect(() => {
    localStorage.setItem("iis_timer_is_break", String(isBreak));
  }, [isBreak]);

  useEffect(() => {
    localStorage.setItem("iis_timer_time_left", String(timeLeft));
  }, [timeLeft]);

  useEffect(() => {
    localStorage.setItem("iis_completed_sessions", String(completedSessionsCount));
  }, [completedSessionsCount]);

  useEffect(() => {
    localStorage.setItem("iis_total_focus_sec", String(totalFocusSeconds));
  }, [totalFocusSeconds]);

  // Audio tone
  const playChime = () => {
    if (!alertSoundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
  };

  // Timer interval ticker
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (!isBreak) {
            setTotalFocusSeconds((sec) => sec + 1);
          }

          if (prev <= 1) {
            playChime();
            const currentCfg = TIMER_STYLES[timerStyle] || TIMER_STYLES.pomodoro;
            if (!isBreak) {
              setIsBreak(true);
              setCompletedSessionsCount((c) => c + 1);
              return currentCfg.breakMinutes * 60;
            } else {
              setIsBreak(false);
              return currentCfg.focusMinutes * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isBreak, timerStyle, alertSoundEnabled]);

  const handleStyleSelect = (key: string) => {
    const cfg = TIMER_STYLES[key];
    if (cfg) {
      setTimerStyle(key);
      setIsRunning(false);
      setIsBreak(false);
      setTimeLeft(cfg.focusMinutes * 60);
    }
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    const cfg = TIMER_STYLES[timerStyle] || TIMER_STYLES.pomodoro;
    setTimeLeft(isBreak ? cfg.breakMinutes * 60 : cfg.focusMinutes * 60);
  };

  const handleSkipPhase = () => {
    setIsRunning(false);
    const cfg = TIMER_STYLES[timerStyle] || TIMER_STYLES.pomodoro;
    if (!isBreak) {
      setIsBreak(true);
      setTimeLeft(cfg.breakMinutes * 60);
    } else {
      setIsBreak(false);
      setTimeLeft(cfg.focusMinutes * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Fetch recommendations
  const fetchRecommendations = async () => {
    setLoadingRecommend(true);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weakAreas: profile.weakAreas,
          learningPace: profile.learningPace,
          quizHistory: quizHistory.slice(-5),
        }),
      });
      const data = await res.json();
      setRecommendation(data.recommendations || "Complete diagnostic logs to generate dynamic focus recommendations.");
    } catch (err) {
      setRecommendation("Target revision: Focus on weak areas such as Quadratic Equations, Trigonometry proofs, and Chemical Reactions using official NCERT Exemplar questions.");
    } finally {
      setLoadingRecommend(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [profile.weakAreas, profile.learningPace]);

  // Overall syllabus completion
  const totalChaptersCount = CBSE_SUBJECTS.reduce((acc, sub) => acc + sub.chapters.length, 0);
  const completedChaptersCount = chapterProgress.filter((p) => p.completed).length;
  const overallPercentage = totalChaptersCount > 0 ? Math.round((completedChaptersCount / totalChaptersCount) * 100) : 0;

  // Study Calendar month math
  const monthName = currentMonthDate.toLocaleString("default", { month: "long" });
  const yearNum = currentMonthDate.getFullYear();
  const daysInMonth = new Date(yearNum, currentMonthDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(yearNum, currentMonthDate.getMonth(), 1).getDay();

  // Calendar Scheduled Events (Matching Image 2 style tags)
  const scheduledStudyEvents: Record<number, { title: string; color: string; type: string }[]> = {
    3: [{ title: "Math", color: "bg-rose-500 text-white", type: "practice" }],
    4: [{ title: "Language", color: "bg-amber-500 text-white", type: "notes" }],
    6: [
      { title: "Science", color: "bg-teal-500 text-white", type: "notes" },
      { title: "Math", color: "bg-rose-500 text-white", type: "practice" }
    ],
    9: [{ title: "Social", color: "bg-amber-500 text-white", type: "notes" }],
    10: [
      { title: "Math", color: "bg-rose-500 text-white", type: "practice" },
      { title: "School Test", color: "bg-teal-500 text-white", type: "test" }
    ],
    11: [{ title: "Language", color: "bg-amber-500 text-white", type: "notes" }],
    14: [{ title: "AI / IT", color: "bg-purple-500 text-white", type: "practice" }],
    15: [{ title: "School Test", color: "bg-teal-500 text-white", type: "test" }],
    17: [{ title: "Math", color: "bg-rose-500 text-white", type: "practice" }],
    18: [{ title: "School Test", color: "bg-teal-500 text-white", type: "test" }],
    19: [{ title: "Language", color: "bg-amber-500 text-white", type: "notes" }],
    21: [{ title: "Science", color: "bg-teal-500 text-white", type: "practice" }],
    22: [{ title: "Language", color: "bg-amber-500 text-white", type: "notes" }],
    25: [{ title: "School Test", color: "bg-teal-500 text-white", type: "test" }],
    28: [{ title: "Math", color: "bg-rose-500 text-white", type: "practice" }],
    29: [{ title: "Board Mock", color: "bg-teal-500 text-white", type: "test" }],
  };

  // Upcoming lessons / tasks (Matching Image 2's left cards)
  const upcomingStudyTasks = [
    {
      id: "task-1",
      dateLabel: "Today",
      timeLabel: "4:00 PM",
      title: "Practice: Quadratic Equations & Triangles",
      subject: "Mathematics",
      subjectId: "mathematics",
      domain: "Standard & Basic Code 041",
      actionLabel: "Start Practice",
      avatarBg: "bg-sky-100 text-sky-700",
      avatarText: "M",
      badgeColor: "bg-sky-50 text-sky-800 border-sky-200",
    },
    {
      id: "task-2",
      dateLabel: "Today",
      timeLabel: "6:30 PM",
      title: "NCERT Exemplar: Chemical Reactions & Acids",
      subject: "Science",
      subjectId: "science",
      domain: "Chemistry & Physics Code 086",
      actionLabel: "Review Notes",
      avatarBg: "bg-emerald-100 text-emerald-700",
      avatarText: "S",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      id: "task-3",
      dateLabel: "Tomorrow",
      timeLabel: "10:00 AM",
      title: "Board Exam PYQs: Nationalism in India & Resources",
      subject: "Social Science",
      subjectId: "social-science",
      domain: "History & Geography Code 087",
      actionLabel: "Take Test",
      avatarBg: "bg-amber-100 text-amber-700",
      avatarText: "SS",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    }
  ];

  // Subject cover theme mapper
  const getSubjectCardStyles = (subId: string) => {
    switch (subId) {
      case "mathematics":
        return {
          bannerBg: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white",
          tagBg: "bg-blue-50 text-blue-700",
          domain: "Algebra · Geometry · Trigonometry",
          code: "Code 041"
        };
      case "science":
        return {
          bannerBg: "bg-gradient-to-br from-emerald-500 to-teal-700 text-white",
          tagBg: "bg-emerald-50 text-emerald-700",
          domain: "Physics · Chemistry · Biology",
          code: "Code 086"
        };
      case "social-science":
        return {
          bannerBg: "bg-gradient-to-br from-amber-500 to-orange-600 text-white",
          tagBg: "bg-amber-50 text-amber-700",
          domain: "History · Geography · Civics",
          code: "Code 087"
        };
      case "english":
        return {
          bannerBg: "bg-gradient-to-br from-rose-500 to-pink-600 text-white",
          tagBg: "bg-rose-50 text-rose-700",
          domain: "Literature · First Flight · Grammar",
          code: "Code 184"
        };
      case "hindi":
        return {
          bannerBg: "bg-gradient-to-br from-red-500 to-rose-700 text-white",
          tagBg: "bg-red-50 text-red-700",
          domain: "Course A & B · Kshitij · Sparsh",
          code: "Code 002"
        };
      case "ai":
      case "class-10-ai":
        return {
          bannerBg: "bg-gradient-to-br from-purple-500 to-violet-700 text-white",
          tagBg: "bg-purple-50 text-purple-700",
          domain: "AI Project Cycle · NLP · CV",
          code: "Code 417"
        };
      default:
        return {
          bannerBg: "bg-gradient-to-br from-slate-600 to-slate-800 text-white",
          tagBg: "bg-slate-100 text-slate-700",
          domain: "Class 10 Core Syllabus",
          code: "Code 100"
        };
    }
  };

  // Trends SVG chart
  const renderTrendsSVG = () => {
    if (quizHistory.length === 0) {
      return (
        <div className="h-44 flex items-center justify-center text-xs text-slate-400 italic">
          No practice quiz logs recorded yet. Take chapter quizzes to map progress.
        </div>
      );
    }

    const data = quizHistory.slice(-8);
    const height = 150;
    const width = 450;
    const padding = 25;

    const points = data.map((d, i) => {
      const x = padding + (i / Math.max(data.length - 1, 1)) * (width - 2 * padding);
      const y = height - padding - (d.score / 100) * (height - 2 * padding);
      return { x, y, score: d.score, date: d.date };
    });

    const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? "M" : "L"} ${p.x} ${p.y}`, "");

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40 overflow-visible">
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f5f9" strokeDasharray="3 3" />
          <path d={pathD} fill="none" stroke="#7F1D1D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#7F1D1D" strokeWidth="2" />
              <text x={p.x} y={p.y - 7} textAnchor="middle" className="font-mono text-[9px] font-bold fill-slate-700">
                {p.score}%
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div id="student-diagnostics-dashboard" className="space-y-8 animate-fade-in text-slate-900 pb-12">
      {/* 1. TOP WELCOMING GREETING (Exact aesthetic of Image 2) */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
            Hi, champion!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Welcome to <strong className="text-slate-800 font-semibold">IIS Study Hub</strong>. Here is your personalized Class 10 study plan and progress today, <strong className="text-slate-800 font-semibold">{profile.name}</strong>.
          </p>
        </div>

        {/* Study timer quick toggle button */}
        <button
          onClick={() => setTimerExpanded(!timerExpanded)}
          className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto ${
            timerExpanded
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Hourglass className="w-3.5 h-3.5 text-slate-400" />
          <span>{timerExpanded ? "Hide Focus Timer" : "Open Study Timer"}</span>
        </button>
      </div>

      {/* 2. TOP SPLIT ROW (Matching Image 2): Left "Upcoming lessons" + Right "Study Calendar" */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: UPCOMING STUDY PLAN (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight font-display">
              Upcoming lessons & revision
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              3 sessions scheduled
            </span>
          </div>

          <div className="space-y-3">
            {upcomingStudyTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all flex items-center justify-between gap-4"
              >
                {/* Left Date / Time Pill */}
                <div className="bg-sky-50 border border-sky-100 rounded-xl px-3 py-2 text-center min-w-[85px] shrink-0">
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {task.dateLabel}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">
                    {task.timeLabel}
                  </span>
                </div>

                {/* Center Title and Subject Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {task.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                    {task.subject} • {task.domain}
                  </p>
                </div>

                {/* Right Action / Icon */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => {
                      if (onSelectSubject) onSelectSubject(task.subjectId);
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                  >
                    {task.actionLabel}
                  </button>

                  <div className={`w-8 h-8 rounded-full ${task.avatarBg} flex items-center justify-center text-xs font-bold shrink-0 hidden sm:flex`}>
                    {task.avatarText}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE STUDY CALENDAR (Span 5, Matching Image 2) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          {/* Calendar Header with < > */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 font-display">
              {monthName}, {yearNum}
            </h3>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentMonthDate(new Date(yearNum, currentMonthDate.getMonth() - 1, 1))}
                className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentMonthDate(new Date(yearNum, currentMonthDate.getMonth() + 1, 1))}
                className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Table Grid */}
          <div className="border border-slate-150 rounded-xl overflow-hidden text-xs">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-150 text-[11px] font-semibold text-slate-500 text-center py-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 bg-white">
              {/* Padding empty days */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[50px] border-b border-r border-slate-100 bg-slate-50/40 p-1" />
              ))}

              {/* Month days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isSelected = selectedCalendarDay === dayNum;
                const events = scheduledStudyEvents[dayNum] || [];

                return (
                  <div
                    key={`day-${dayNum}`}
                    onClick={() => setSelectedCalendarDay(dayNum)}
                    className={`min-h-[50px] border-b border-r border-slate-100 p-1 flex flex-col justify-between transition-colors cursor-pointer select-none ${
                      isSelected ? "bg-slate-50 font-bold" : "hover:bg-slate-50/50"
                    }`}
                  >
                    <span className={`text-[10px] self-end block leading-none px-1 rounded ${
                      isSelected ? "bg-slate-900 text-white" : "text-slate-600"
                    }`}>
                      {dayNum}
                    </span>

                    <div className="space-y-0.5 mt-0.5">
                      {events.map((ev, eIdx) => (
                        <div
                          key={eIdx}
                          className={`text-[8.5px] px-1 py-0.5 rounded font-semibold truncate leading-none ${ev.color}`}
                        >
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Math
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-500" /> Science
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Social
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Click date to view</span>
          </div>
        </div>
      </div>

      {/* 3. COURSES SECTION (Matching Image 2's "My courses" + Action Promo Card) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight font-display">
            My courses
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {completedChaptersCount} of {totalChaptersCount} Total Chapters Prepared ({overallPercentage}%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Core Subject Cards (NO "NCERT CBSE" repetitive badges!) */}
          {CBSE_SUBJECTS.slice(0, 3).map((sub) => {
            const styles = getSubjectCardStyles(sub.id);
            const completedSubChapters = chapterProgress.filter(p => p.subjectId === sub.id && p.completed).length;
            const totalChapters = sub.chapters.length;
            const percent = totalChapters > 0 ? Math.round((completedSubChapters / totalChapters) * 100) : 0;

            return (
              <div
                key={sub.id}
                onClick={() => onSelectSubject && onSelectSubject(sub.id)}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Visual Header */}
                  <div className={`h-24 p-4 flex flex-col justify-between ${styles.bannerBg}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-white">
                        {styles.code}
                      </span>
                      <span className="text-[11px] text-white/90 font-mono font-semibold">
                        {completedSubChapters}/{totalChapters} Ch.
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {sub.name}
                    </h3>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-slate-600 font-medium">
                      {styles.domain}
                    </p>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                        <span>Preparation progress</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-900 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Open Chapters & Tests</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            );
          })}

          {/* Action Promo Card (Matching Image 2's right card "Find your best tutor / Go training to pass a test successfully") */}
          <div className="bg-gradient-to-br from-rose-50 via-slate-50 to-orange-50 border border-rose-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight font-display">
                Class 10 Board Exam Paper Maker
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Assemble official past-year board examination papers matching exact mark weightage and download clean, printable PDFs.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab && onNavigateTab("paper-maker")}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Go training to pass a test successfully</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Secondary Courses Grid for English, Hindi, and Artificial Intelligence */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {CBSE_SUBJECTS.slice(3, 6).map((sub) => {
            const styles = getSubjectCardStyles(sub.id);
            const completedSubChapters = chapterProgress.filter(p => p.subjectId === sub.id && p.completed).length;
            const totalChapters = sub.chapters.length;
            const percent = totalChapters > 0 ? Math.round((completedSubChapters / totalChapters) * 100) : 0;

            return (
              <div
                key={sub.id}
                onClick={() => onSelectSubject && onSelectSubject(sub.id)}
                className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                      {styles.code}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {completedSubChapters}/{totalChapters} Ch.
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                    {sub.name}
                  </h4>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">{percent}%</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. OPTIONAL EXPANDABLE FOCUS STUDY TIMER (Cleanly persistent) */}
      {timerExpanded && (
        <div id="pomodoro-timer-widget" className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-display flex items-center gap-1.5">
                <Hourglass className="w-4 h-4 text-slate-700" /> Focus Study Clock
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Maintain high academic stamina with structured study sprints.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                Sprints Done: <strong className="text-slate-900">{completedSessionsCount}</strong>
              </span>
              <span className="text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                Focused: <strong className="text-slate-900">{Math.floor(totalFocusSeconds / 60)}m</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Timer Styles */}
            <div className="md:col-span-6 grid grid-cols-2 gap-2 text-xs">
              {Object.entries(TIMER_STYLES).map(([key, cfg]) => {
                const isSelected = timerStyle === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleStyleSelect(key)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? "border-slate-900 bg-slate-900 text-white font-bold shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <span>{cfg.icon}</span>
                      <span>{cfg.name}</span>
                    </div>
                    <span className={`text-[10px] block mt-0.5 ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                      {cfg.focusMinutes}m work · {cfg.breakMinutes}m rest
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Timer Clock Display */}
            <div className="md:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[10px]">
                  {isBreak ? "Break Interval" : "Focused Study Sprint"}
                </span>
                <button
                  onClick={() => setAlertSoundEnabled(!alertSoundEnabled)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Toggle chime"
                >
                  {alertSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="text-4xl font-extrabold font-mono text-slate-900 tracking-tight">
                {formatTime(timeLeft)}
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="px-5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{isRunning ? "Pause" : "Start"}</span>
                </button>

                <button
                  onClick={handleResetTimer}
                  className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs cursor-pointer"
                  title="Reset timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleSkipPhase}
                  className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs cursor-pointer"
                  title="Skip interval"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. DIAGNOSTICS & TRENDS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Academic Progress Diagnostics */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 font-display flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-700" /> Academic Progress Diagnostics
            </h3>
            <span className="text-xs text-slate-400 font-medium">Practice Quiz Scores</span>
          </div>
          {renderTrendsSVG()}
        </div>

        {/* Study Advisor & Focus Areas */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-700" /> Focus Revision Guidance
            </h3>
            <button
              onClick={fetchRecommendations}
              disabled={loadingRecommend}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
              title="Refresh recommendations"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingRecommend ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl space-y-2 text-xs text-slate-700 leading-relaxed max-h-[170px] overflow-y-auto">
            {recommendation ? (
              recommendation.split("\n").map((para, i) => (
                <p key={i} className="my-1 leading-relaxed">
                  {renderCleanTextAndSymbols(para)}
                </p>
              ))
            ) : (
              <p className="text-slate-500 italic">
                Solve diagnostic quizzes and tests to generate dynamic personalized study recommendations.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 6. DAILY PRACTICE DRILL */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 font-display flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-700" /> Daily Practice Drills
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Quick 5-minute mixed question sets to evaluate memory retention.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-600 bg-slate-100 font-semibold px-2 py-0.5 rounded">
            Class 10 PYQs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {DAILY_QUIZZES.slice(0, 2).map((dQuiz) => {
            const isCompletedToday = quizHistory.some(
              (q) => q.type === "daily_quiz" && q.date.startsWith(dQuiz.date)
            );

            return (
              <div
                key={dQuiz.id}
                className="flex items-center justify-between border border-slate-200/80 rounded-xl p-3.5 bg-slate-50/50"
              >
                <div>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold block">{dQuiz.date}</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">
                    {dQuiz.questions.length} Diagnostic questions mix
                  </span>
                </div>

                {isCompletedToday ? (
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 border border-emerald-200 bg-emerald-50 py-1 px-2.5 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </span>
                ) : (
                  <button
                    onClick={() => onLaunchDailyQuiz(dQuiz.id, dQuiz.questions)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-1.5 px-3.5 rounded-lg cursor-pointer transition-colors shadow-xs"
                  >
                    Start Drill
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
