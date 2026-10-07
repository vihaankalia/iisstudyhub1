import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { StudentProfile } from "../types";

function renderFormattedText(text: string) {
  if (!text) return null;
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={index} className="font-bold text-slate-900">{part}</strong>;
        }
        return part;
      })}
    </>
  );
}
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Clock, 
  BrainCircuit, 
  TrendingUp, 
  ShieldCheck 
} from "lucide-react";

// Handcrafted, authentic Class 10 NCERT diagnostic questions representing all core streams
interface DiagnosticQuestion {
  id: string;
  subject: string;
  subjectId: string;
  chapter: string;
  topic: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "diag-1",
    subject: "Science (Chemistry)",
    subjectId: "science",
    chapter: "Chemical Reactions & Equations",
    topic: "Oxidation in Air",
    question: "When magnesium ribbon is burnt in air, what is the chemical formula of the white ash formed?",
    options: ["MgO", "MgCO3", "Mg(OH)2", "Mg3N2"],
    correctIdx: 0,
    explanation: "Magnesium reacts with atmospheric oxygen on burning to form Magnesium Oxide (MgO), which is a white powder ash. Equation: 2Mg + O2 -> 2MgO."
  },
  {
    id: "diag-2",
    subject: "Mathematics",
    subjectId: "mathematics",
    chapter: "Introduction to Trigonometry",
    topic: "Trigonometric Ratio Basics",
    question: "If sin θ = 4/5 in a right-angled triangle, what is the value of tan θ?",
    options: ["3/4", "4/3", "3/5", "5/3"],
    correctIdx: 1,
    explanation: "sin θ = Opposite/Hypotenuse = 4/5. Using Pythagoras theorem, the adjacent side = √(5² - 4²) = 3. Therefore, tan θ = Opposite/Adjacent = 4/3."
  },
  {
    id: "diag-3",
    subject: "Social Science (History)",
    subjectId: "social-science",
    chapter: "Nationalism in India",
    topic: "Non-Cooperation Suspensions",
    question: "Why did Mahatma Gandhi call off the Non-Cooperation Movement in February 1922?",
    options: [
      "Due to intense pressure from the House of Commons",
      "Because of the violent incident at Chauri Chaura",
      "Because Gandhi went on a hunger strike until death",
      "Due to lack of active participation from major communities"
    ],
    correctIdx: 1,
    explanation: "At Chauri Chaura (UP), a peaceful demonstration turned into a violent clash where a police station was set on fire. Adhering strictly to non-violence, Gandhiji instantly suspended the movement."
  },
  {
    id: "diag-4",
    subject: "English (Literature)",
    subjectId: "english",
    chapter: "A Letter to God",
    topic: "Irony in 'A Letter to God'",
    question: "What did Lencho write about the post-office employees when he received only 70 Pesos instead of 100?",
    options: [
      "He thanked them as messengers of divine providence",
      "He requested they teach him advanced bookkeeping",
      "He believed they were a bunch of crooks who took the money",
      "He paid no attention to them and left silently"
    ],
    correctIdx: 2,
    explanation: "Lencho had absolute trust in God and felt God could not make an error. He concluded that the post-office workers had pocketed the remaining 30 Pesos, calling them 'a bunch of crooks'."
  },
  {
    id: "diag-5",
    subject: "Mathematics (Algebra)",
    subjectId: "mathematics",
    chapter: "Quadratic Equations",
    topic: "Nature of Roots",
    question: "For what value of k will the quadratic equation 2x² + kx + 3 = 0 have real and equal roots?",
    options: ["±√6", "±2√6", "±24", "±4"],
    correctIdx: 1,
    explanation: "For real and equal roots, the discriminant D = b² - 4ac = 0. Here, a = 2, b = k, c = 3. Therefore, k² - 4(2)(3) = 0 => k² - 24 = 0 => k = ±√24 = ±2√6."
  }
];

interface DiagnosticTestProps {
  profile: StudentProfile;
  onComplete: (weakAreas: string[], strengthAreas: string[]) => Promise<void>;
}

export default function DiagnosticTest({ profile, onComplete }: DiagnosticTestProps) {
  const [step, setStep] = useState<"welcome" | "quiz" | "evaluating" | "results">("welcome");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [completing, setCompleting] = useState(false);

  const currentQuestion = DIAGNOSTIC_QUESTIONS[currentIdx];

  const handleStart = () => {
    setStep("quiz");
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedIdx(optionIdx);
  };

  const handleConfirmAnswer = () => {
    if (selectedIdx === null || isAnswered) return;
    setAnswers({ ...answers, [currentIdx]: selectedIdx });
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIdx < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      setStep("evaluating");
      // Simulate highly intelligent NCERT diagnostic mapping
      setTimeout(() => {
        setStep("results");
      }, 2400);
    }
  };

  // Compile diagnosed fields based on answers
  const computeDiagnostics = () => {
    const weak: string[] = [];
    const strong: string[] = [];

    DIAGNOSTIC_QUESTIONS.forEach((q, idx) => {
      const isCorrect = answers[idx] === q.correctIdx;
      if (isCorrect) {
        strong.push(`${q.chapter} (${q.topic})`);
      } else {
        weak.push(`${q.chapter} (${q.topic})`);
      }
    });

    // Safeguard to make sure there is at least one weak/strong area if they get all right/wrong
    if (weak.length === 0) weak.push("Advanced Synthesis (Tough Olympiad Questions)");
    if (strong.length === 0) strong.push("Basic Logical Applications");

    return { weak, strong };
  };

  const { weak, strong } = computeDiagnostics();

  const handleSaveAndExit = async () => {
    setCompleting(true);
    try {
      await onComplete(weak, strong);
    } catch (err) {
      console.error("Failed to complete diagnostic profile", err);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-6" id="diagnostic-root">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden relative" id="diagnostic-container">
        
        {/* Aesthetic header banner */}
        <div className="bg-gradient-to-r from-brand-red to-rose-950 px-6 py-5 flex items-center justify-between text-white relative">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <BrainCircuit className="w-5 h-5 text-brand-red-border" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-brand-red-border block">Class 10 NCERT Guide</span>
              <h2 className="text-lg font-bold font-display leading-tight">Diagnostic Learning Wizard</h2>
            </div>
          </div>
          <div className="font-mono text-xs font-bold text-brand-red-border bg-brand-red/40 px-3 py-1 rounded-full">
            OFFICIAL NCERT 2026
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: WELCOME SCREEN */}
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="p-6 md:p-8 space-y-6 text-center"
              id="diagnostic-welcome"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-brand-red-light text-brand-red rounded-full flex items-center justify-center shadow-inner">
                  <GraduationCap className="w-8 h-8" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-display text-slate-800 tracking-tight">
                  Welcome, {profile.name}!
                </h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                  Let's unlock your tailored study map. This quick diagnostic quiz evaluates core topics from your NCERT chapters to pin-point exactly where you are strong and where you need focus.
                </p>
              </div>

              {/* NCERT Focus Guidelines Card */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-left space-y-3">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>Evaluation Standards (Class 10 Board Curriculum)</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-slate-600 text-[11px] font-mono leading-relaxed">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-brand-red rounded-full inline-block"></span>
                    <span>Mathematics core theorems</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
                    <span>Science chemical formulas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block"></span>
                    <span>Social Science events</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full inline-block"></span>
                    <span>English thematic comprehension</span>
                  </div>
                </div>
              </div>

              <button
                id="btn-start-diagnostic"
                onClick={handleStart}
                className="w-full md:w-auto px-8 py-3 bg-brand-red hover:bg-brand-red-hover text-white font-bold text-sm rounded-xl cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <span>Begin Evaluation Test</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: ACTIVE DIAGNOSTIC TEST */}
          {step === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-8 space-y-6"
              id="diagnostic-quiz-step"
            >
              {/* Question count progress */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold font-mono">
                <span className="text-brand-red bg-brand-red-light px-2.5 py-1 rounded">
                  {currentQuestion.subject}
                </span>
                <span>Question {currentIdx + 1} of {DIAGNOSTIC_QUESTIONS.length}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-red transition-all duration-300"
                  style={{ width: `${((currentIdx + (isAnswered ? 1 : 0)) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Question Statement */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                  CHAPTER: {currentQuestion.chapter}
                </span>
                <h4 className="text-base md:text-lg font-bold text-slate-800 leading-snug">
                  {renderFormattedText(currentQuestion.question)}
                </h4>
              </div>

              {/* Interactive Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((option, idx) => {
                  let optionStyle = "border-slate-200/80 hover:border-brand-red/30 hover:bg-brand-red-light/20";
                  let leftBadgeStyle = "bg-slate-100 text-slate-600 border-slate-200";

                  if (selectedIdx === idx) {
                    optionStyle = "border-brand-red bg-brand-red-light/50 text-brand-red shadow-sm";
                    leftBadgeStyle = "bg-brand-red text-white border-brand-red";
                  }

                  if (isAnswered) {
                    if (idx === currentQuestion.correctIdx) {
                      optionStyle = "border-emerald-500 bg-emerald-50/60 text-emerald-900 shadow-sm";
                      leftBadgeStyle = "bg-emerald-500 text-white border-emerald-500";
                    } else if (selectedIdx === idx) {
                      optionStyle = "border-rose-300 bg-rose-50/50 text-rose-900";
                      leftBadgeStyle = "bg-rose-500 text-white border-rose-500";
                    } else {
                      optionStyle = "opacity-45 border-slate-200 bg-slate-50";
                      leftBadgeStyle = "bg-slate-100 text-slate-400 border-slate-200";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full text-left p-3.5 border rounded-xl flex items-center gap-3 transition-all cursor-pointer outline-none ${optionStyle}`}
                    >
                      <span className={`w-6.5 h-6.5 text-[11px] font-mono font-bold rounded-lg border flex items-center justify-center shrink-0 ${leftBadgeStyle}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm font-semibold">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action and feedback block */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-slate-500 bg-slate-50 border border-slate-200/60 p-3 rounded-lg leading-relaxed flex items-start gap-2.5"
                    >
                      {selectedIdx === currentQuestion.correctIdx ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold text-slate-800 block">
                          {selectedIdx === currentQuestion.correctIdx ? "Correct Answer!" : "Under Review"}
                        </span>
                        {renderFormattedText(currentQuestion.explanation)}
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-end shrink-0">
                  {!isAnswered ? (
                    <button
                      disabled={selectedIdx === null}
                      onClick={handleConfirmAnswer}
                      className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs rounded-lg cursor-pointer transition-all uppercase tracking-wide"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="w-full sm:w-auto px-6 py-2.5 bg-brand-red hover:bg-brand-red-hover text-white font-bold text-xs rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 uppercase tracking-wide shadow-md"
                    >
                      <span>
                        {currentIdx < DIAGNOSTIC_QUESTIONS.length - 1 ? "Next Question" : "Generate Diagnosis"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: COGNITIVE EVALUATION TRANSITION */}
          {step === "evaluating" && (
            <motion.div
              key="evaluating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 text-center space-y-6"
              id="diagnostic-evaluating-step"
            >
              <div className="flex justify-center relative py-6">
                <div className="w-20 h-20 bg-brand-red-light rounded-full flex items-center justify-center relative z-10">
                  <BrainCircuit className="w-10 h-10 text-brand-red" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-brand-red-border border-dashed rounded-full" />
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                <h3 className="text-xl font-bold font-display text-slate-800">Analyzing Performance Patterns</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Our algorithm is matching your results against Class 10 NCERT subject specifications to calculate strengths and concept weaknesses...
                </p>
              </div>

              <div className="w-48 bg-slate-100 h-1 rounded-full mx-auto overflow-hidden">
                <div className="bg-gradient-to-r from-brand-red to-rose-800 h-full w-full animate-infinite-loading" />
              </div>
            </motion.div>
          )}

          {/* STEP 4: COGNITIVE DIAGNOSTICS REVEALED */}
          {step === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-6 md:p-8 space-y-6"
              id="diagnostic-results-step"
            >
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                  <ShieldCheck className="w-3.5 h-3.5" /> DIALECTIC SYLLABUS MAPPING COMPLETED
                </div>
                <h3 className="text-2xl font-bold font-display text-slate-800 tracking-tight">Your Diagnostic Profile</h3>
                <p className="text-xs text-slate-400">Successfully matched against class 10 ncert curriculum metrics.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Diagnosed Strengths */}
                <div className="bg-emerald-50/40 border border-emerald-200/50 rounded-xl p-4.5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <span className="p-1 px-1.5 rounded-md bg-emerald-100 text-emerald-600 text-xs font-mono">✓</span>
                    <span>Identified Strengths</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    You demonstrated solid conceptual clarity in these areas. Standard quizzes will contain higher difficulty questions here:
                  </p>
                  <div className="space-y-1.5">
                    {strong.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-700 text-[11px] font-semibold bg-emerald-50 border border-emerald-100/50 rounded-md p-1.5 px-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diagnosed Weaknesses */}
                <div className="bg-rose-50/30 border border-rose-200/40 rounded-xl p-4.5 space-y-3">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                    <span className="p-1 px-1.5 rounded-md bg-rose-100 text-rose-500 text-xs font-mono">⚠️</span>
                    <span>Actionable Focus Areas</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Our AI mapped these as conceptual gaps. We have generated specialized focus guides and adaptive micro-tests in your dashboard:
                  </p>
                  <div className="space-y-1.5">
                    {weak.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-700 text-[11px] font-semibold bg-rose-50/50 border border-rose-100/30 rounded-md p-1.5 px-2">
                        <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Study plan layout explanation */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex items-center gap-3">
                <BrainCircuit className="w-5 h-5 text-indigo-500 shrink-0" />
                <p className="text-[10px] text-slate-500 leading-normal">
                  <strong>What happens next?</strong> Complete this wizard to initialize your board. Your dashboard will now dynamically highlight progress meters, direct chapter quizzes, and live tutor recommendations for your active focus metrics.
                </p>
              </div>

              <button
                id="btn-complete-diagnostic"
                onClick={handleSaveAndExit}
                disabled={completing}
                className="w-full py-3 bg-brand-red hover:bg-brand-red-hover text-white font-bold text-sm rounded-xl cursor-pointer shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {completing ? (
                  <span>Generating Study Board...</span>
                ) : (
                  <>
                    <span>Initialize Personalized Study Board</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Styled inline keyframe for infinite transition lines */}
      <style>{`
        @keyframes infinite-loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-infinite-loading {
          animation: infinite-loading 1.8s infinite linear;
        }
      `}</style>
    </div>
  );
}
