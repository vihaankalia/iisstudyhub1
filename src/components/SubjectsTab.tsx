import React, { useState, useEffect, useMemo } from "react";
import { CBSE_SUBJECTS, Subject, Chapter, WorksheetQuestion } from "../data/cbseData";
import { getAllSourceQuestions } from "../data/sourceQuestionBank";
import { ChapterProgress, StudentProfile } from "../types";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { BookOpen, CheckCircle, Circle, Play, Award, HelpCircle, ArrowLeft, FileText, Check } from "lucide-react";
import { motion } from "motion/react";

interface SubjectsTabProps {
  profile: StudentProfile;
  chapterProgress: ChapterProgress[];
  onUpdateProgress: (newProgress: ChapterProgress) => void;
  onLaunchChapterQuiz: (subjectId: string, chapterId: string) => void;
  initialSubjectId?: string;
}

export default function SubjectsTab({
  profile,
  chapterProgress,
  onUpdateProgress,
  onLaunchChapterQuiz,
  initialSubjectId,
}: SubjectsTabProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [savingProgress, setSavingProgress] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"notes" | "worksheet">("notes");
  const [worksheetAnswers, setWorksheetAnswers] = useState<Record<string, number>>({});
  const [worksheetFilter, setWorksheetFilter] = useState<"all" | "exemplar" | "board" | "mcq" | "satq" | "formula" | "3marks" | "5marks">("all");

  useEffect(() => {
    if (initialSubjectId) {
      const found = CBSE_SUBJECTS.find(sub => sub.id === initialSubjectId);
      if (found) {
        setSelectedSubject(found);
        setSelectedChapter(null);
      }
    }
  }, [initialSubjectId]);

  useEffect(() => {
    setWorksheetFilter("all");
  }, [selectedChapter]);

  // Return completion state and scores for a specific chapter
  const getProgressForChapter = (chapterId: string) => {
    return (
      chapterProgress.find((p) => p.chapterId === chapterId) || {
        completed: false,
        highScore: 0,
        quizAttempts: 0,
      }
    );
  };

  const handleToggleComplete = async (chapter: Chapter) => {
    if (!selectedSubject) return;
    setSavingProgress(true);
    const mockProgressId = `${selectedSubject.id}_${chapter.id}`;
    const currentProg = getProgressForChapter(chapter.id);

    const updated: ChapterProgress = {
      id: mockProgressId,
      subjectId: selectedSubject.id,
      chapterId: chapter.id,
      completed: !currentProg.completed,
      quizAttempts: currentProg.quizAttempts,
      highScore: currentProg.highScore,
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, "users", profile.uid, "progress", mockProgressId), updated);
      onUpdateProgress(updated);
    } catch (error) {
      console.error("Error saving progress:", error);
    } finally {
      setSavingProgress(false);
    }
  };

  // Color mapper for headers
  const getSubjectColorStyles = (color: string) => {
    switch (color) {
      case "emerald":
        return {
          bg: "bg-emerald-50 text-emerald-900 border-emerald-200/60",
          accent: "indigo-600",
          badge: "bg-emerald-50 text-emerald-700",
          label: "emerald"
        };
      case "blue":
        return {
          bg: "bg-brand-red-light/50 text-brand-red border-brand-red-border/30",
          accent: "brand-red",
          badge: "bg-brand-red-light text-brand-red border border-brand-red-border/20",
          label: "blue"
        };
      case "amber":
        return {
          bg: "bg-amber-50 text-amber-900 border-amber-200/60",
          accent: "indigo-600",
          badge: "bg-amber-50 text-amber-700",
          label: "amber"
        };
      case "rose":
        return {
          bg: "bg-rose-50 text-rose-900 border-rose-200/60",
          accent: "rose-600",
          badge: "bg-rose-50 text-rose-700",
          label: "rose"
        };
      default:
        return {
          bg: "bg-slate-50 text-slate-900 border-slate-200",
          accent: "indigo-600",
          badge: "bg-slate-50 text-slate-700",
          label: "slate"
        };
    }
  };

  // If no subject selected, show subjects grid
  if (!selectedSubject) {
    return (
      <div id="subjects-grid-container" className="space-y-6">
        <div className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="font-display font-bold text-lg text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-red" /> Class 10 Syllabus & Chapterwise Practice
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Select a subject to review chapter study notes and practice NCERT Exemplar & official past board examination questions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CBSE_SUBJECTS.map((sub) => {
            const styles = getSubjectColorStyles(sub.color);
            // Calculate learning stats for progress overview
            const totalChapters = sub.chapters.length;
            const completedInSub = sub.chapters.filter(ch => getProgressForChapter(ch.id).completed).length;
            const percent = totalChapters > 0 ? Math.round((completedInSub / totalChapters) * 100) : 0;

            return (
              <button
                key={sub.id}
                id={`subject-select-${sub.id}`}
                onClick={() => {
                  setSelectedSubject(sub);
                  setSelectedChapter(null);
                }}
                className="bg-white border border-slate-200 hover:border-brand-red-border p-6 rounded-xl text-left cursor-pointer transition-all duration-200 shadow-sm relative overflow-hidden group hover:shadow-md flex flex-col justify-between"
              >
                <div className="relative z-10 w-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold py-1 px-2.5 rounded-full ${styles.badge}`}>
                      {sub.name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{percent}% Prepared</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-brand-red transition-colors">
                    {sub.name} Syllabus
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {totalChapters} Core study units with NCERT Exemplar & Board Exam Questions
                  </p>
                </div>

                <div className="w-full mt-6 relative z-10">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        styles.label === 'blue' ? 'bg-brand-red' : 
                        styles.label === 'rose' ? 'bg-rose-600' :
                        styles.label === 'emerald' ? 'bg-emerald-600' :
                        'bg-amber-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2.5">
                    <span className="text-xs font-semibold text-slate-500">
                      {completedInSub} / {totalChapters} Prepared
                    </span>
                    <span className={`text-xs font-bold flex items-center gap-1 ${
                      styles.label === 'blue' ? 'text-brand-red' :
                      styles.label === 'rose' ? 'text-rose-600' :
                      styles.label === 'emerald' ? 'text-emerald-600' :
                      'text-amber-600'
                    }`}>
                      Study Notes &rsaquo;
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Double layout: Chapters list on left, Chapter content on right
  const subStyles = getSubjectColorStyles(selectedSubject.color);

  const colorTheme = {
    text: selectedSubject.color === "blue" ? "text-brand-red" :
          selectedSubject.color === "rose" ? "text-rose-600" :
          selectedSubject.color === "emerald" ? "text-emerald-600" :
          "text-rose-600",
    hoverText: selectedSubject.color === "blue" ? "hover:text-brand-red" :
               selectedSubject.color === "rose" ? "hover:text-rose-600" :
               selectedSubject.color === "emerald" ? "hover:text-emerald-600" :
               "hover:text-rose-600",
    border: selectedSubject.color === "blue" ? "border-brand-red" :
            selectedSubject.color === "rose" ? "border-rose-600" :
            selectedSubject.color === "emerald" ? "border-emerald-600" :
            "border-rose-600",
    bg: selectedSubject.color === "blue" ? "bg-brand-red-light" :
        selectedSubject.color === "rose" ? "bg-rose-50" :
        selectedSubject.color === "emerald" ? "bg-emerald-50" :
        "bg-rose-50",
    btn: selectedSubject.color === "blue" ? "bg-brand-red hover:bg-brand-red-hover shadow-brand-red/10" :
         selectedSubject.color === "rose" ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/10" :
         selectedSubject.color === "emerald" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10" :
         "bg-rose-600 hover:bg-rose-700 shadow-rose-600/10"
  };

  return (
    <div id="subject-detailed-view" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <button
          id="back-to-subjects-list"
          onClick={() => {
            setSelectedSubject(null);
            setSelectedChapter(null);
          }}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Subject List
        </button>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold py-0.5 px-2.5 rounded-full ${subStyles.badge}`}>
            {selectedSubject.name}
          </span>
          <span className="text-xs text-slate-400 font-medium">Class 10 Syllabus</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left Column: Chapters selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-3 font-semibold">
              Chapters Index
            </span>
            <div className="space-y-2">
              {selectedSubject.chapters.map((ch, idx) => {
                const prog = getProgressForChapter(ch.id);
                const isSelected = selectedChapter?.id === ch.id;

                return (
                  <button
                    key={ch.id}
                    id={`chapter-select-${ch.id}`}
                    onClick={() => {
                      setSelectedChapter(ch);
                      setActiveSubTab("notes");
                    }}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? `${colorTheme.border} ${colorTheme.bg}/50 shadow-sm`
                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!savingProgress) {
                          handleToggleComplete(ch);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!savingProgress) {
                            handleToggleComplete(ch);
                          }
                        }
                      }}
                      className={`mt-0.5 text-slate-400 ${colorTheme.hoverText} transition-colors cursor-pointer focus:outline-none ${savingProgress ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      {prog.completed ? (
                        <CheckCircle className="w-4.5 h-4.5 text-emerald-600 fill-emerald-50" />
                      ) : (
                        <Circle className="w-4.5 h-4.5 text-slate-300" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono text-slate-400 block">Unit {idx + 1}</span>
                        {prog.highScore > 0 && (
                          <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-0.5">
                            <Award className="w-3 h-3" /> {prog.highScore}%
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-bold truncate block mt-0.5 ${isSelected ? `${colorTheme.text} font-bold` : "text-slate-800"}`}>
                        {ch.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Chapter revisions & tools */}
        <div className="lg:col-span-8">
          {selectedChapter ? (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full" id={`chapter-view-${selectedChapter.id}`}>
              {/* Header block with actions */}
              <div className="border-b border-slate-100 p-6 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-xl text-slate-900 leading-tight">
                    {selectedChapter.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete Revision guide for Board preparations
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="trigger-chapter-quiz-btn"
                    onClick={() => onLaunchChapterQuiz(selectedSubject.id, selectedChapter.id)}
                    className={`flex items-center gap-1.5 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md cursor-pointer transition-all duration-150 ${colorTheme.btn}`}
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Take Practice Test
                  </button>

                  <button
                    id="mark-completed-btn"
                    onClick={() => handleToggleComplete(selectedChapter)}
                    disabled={savingProgress}
                    className={`flex items-center gap-1.5 border font-semibold px-4 py-2 rounded-lg text-xs cursor-pointer transition-all duration-150 ${
                      getProgressForChapter(selectedChapter.id).completed
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {getProgressForChapter(selectedChapter.id).completed ? "Prepared" : "Mark Prepared"}
                  </button>
                </div>
              </div>

              {/* Segmented control for Notes vs Worksheets */}
              <div className="flex border-b border-slate-100 bg-slate-50/20 px-6 py-2 gap-4">
                <button
                  onClick={() => setActiveSubTab("notes")}
                  className={`pb-2 pt-1 text-xs font-bold transition-all border-b-2 px-1 cursor-pointer flex items-center gap-1.5 ${
                    activeSubTab === "notes"
                      ? `${colorTheme.border} ${colorTheme.text}`
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Study Notes
                </button>
                <button
                  onClick={() => setActiveSubTab("worksheet")}
                  className={`pb-2 pt-1 text-xs font-bold transition-all border-b-2 px-1 cursor-pointer flex items-center gap-1.5 ${
                    activeSubTab === "worksheet"
                      ? `${colorTheme.border} ${colorTheme.text}`
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Practice Worksheet
                  <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-full font-bold ${colorTheme.bg} ${colorTheme.text}`}>
                    {selectedChapter.worksheet?.length || 0}
                  </span>
                </button>
              </div>

              {activeSubTab === "notes" ? (
                /* Revision content */
                <div className="p-6 md:p-8 flex-1 overflow-auto max-h-[500px] prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm format-math-notes">
                  {selectedChapter.notes.split("\n\n").map((para, i) => {
                    if (para.startsWith("### ")) {
                      return (
                        <h4 key={i} className="font-display font-semibold text-slate-900 border-b border-slate-100 pb-1.5 mt-6 first:mt-0 text-base">
                          {para.replace("### ", "")}
                        </h4>
                      );
                    }
                    return (
                      <p key={i} className="my-3 text-slate-650 leading-relaxed">
                        {para}
                      </p>
                    );
                  })}
                </div>
              ) : (
                /* Interactive Worksheet content */
                <div className="p-6 md:p-8 flex-1 overflow-auto max-h-[500px] space-y-6">
                  <div className={`border rounded-lg p-4 flex gap-3 ${colorTheme.bg}/45 ${colorTheme.border}/35`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colorTheme.bg} ${colorTheme.text}`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <h4 className="font-bold text-slate-900">Chapter Question Bank & Practice</h4>
                      <p className="text-slate-500 mt-0.5 leading-relaxed">
                        Comprehensive chapterwise questions featuring verified <strong>NCERT Exemplar Questions</strong> and <strong>Actual Past-Year Board Examination Questions</strong> with official evaluation schemes.
                      </p>
                    </div>
                  </div>

                  {/* Filter selector tabs */}
                  {(() => {
                    // Load and combine NCERT Exemplar & official board questions for this chapter
                    const allSourceQs = getAllSourceQuestions();
                    const normSubId = selectedSubject?.id === "ai" ? "class-10-ai" : selectedSubject?.id;
                    
                    const boardQsForChapter: WorksheetQuestion[] = allSourceQs.filter(q => {
                      const matchSub = q.subjectId === selectedSubject?.id || (normSubId && q.subjectId === normSubId);
                      return matchSub && q.chapterId === selectedChapter.id && q.isApprovedSource;
                    }).map((bq, i) => ({
                      id: `board-${bq.id || i}`,
                      question: bq.questionText,
                      options: bq.options,
                      correctAnswerIndex: bq.correctOptionIndex,
                      explanation: bq.officialSolution || "Official Board Marking Scheme: Step-by-step points evaluated according to standard Class 10 criteria.",
                      category: bq.questionType === "mcq" ? "mcq" : bq.marks === 3 ? "3marks" : bq.marks === 5 ? "5marks" : "satq",
                      sourceType: "Actual Board Exam (PYQ)",
                      year: `Board Exam ${bq.year}${bq.setCode ? ` (${bq.setCode})` : ""}`,
                      marks: bq.marks
                    }));

                    const builtInQs: WorksheetQuestion[] = (selectedChapter.worksheet || []).map((wq, i) => ({
                      ...wq,
                      sourceType: wq.sourceType || (i % 2 === 0 ? "NCERT Exemplar" : "Actual Board Exam (PYQ)"),
                      year: wq.year || "NCERT Exemplar Problem",
                      marks: wq.marks || (wq.category === "mcq" ? 1 : wq.category === "3marks" ? 3 : wq.category === "5marks" ? 5 : 2)
                    }));

                    // Deduplicate questions by question text prefix
                    const seenTexts = new Set<string>();
                    const combinedQuestions: WorksheetQuestion[] = [];
                    [...builtInQs, ...boardQsForChapter].forEach(q => {
                      const key = q.question.trim().substring(0, 45).toLowerCase();
                      if (!seenTexts.has(key)) {
                        seenTexts.add(key);
                        combinedQuestions.push(q);
                      }
                    });

                    const exemplarCount = combinedQuestions.filter(q => q.sourceType === "NCERT Exemplar").length;
                    const boardCount = combinedQuestions.filter(q => q.sourceType === "Actual Board Exam (PYQ)").length;
                    const mcqCount = combinedQuestions.filter(q => q.options && q.options.length > 0).length;
                    const satqCount = combinedQuestions.filter(q => !q.options || q.options.length === 0).length;
                    const marks3Count = combinedQuestions.filter(q => q.category === "3marks" || q.marks === 3).length;
                    const marks5Count = combinedQuestions.filter(q => q.category === "5marks" || q.marks === 5).length;

                    const filteredQuestions = combinedQuestions.filter((q) => {
                      const isMcq = q.options && q.options.length > 0;
                      if (worksheetFilter === "all") return true;
                      if (worksheetFilter === "exemplar") return q.sourceType === "NCERT Exemplar";
                      if (worksheetFilter === "board") return q.sourceType === "Actual Board Exam (PYQ)";
                      if (worksheetFilter === "mcq") return isMcq;
                      if (worksheetFilter === "satq") return !isMcq;
                      if (worksheetFilter === "formula") return q.category === "formula";
                      if (worksheetFilter === "3marks") return q.category === "3marks" || q.marks === 3;
                      if (worksheetFilter === "5marks") return q.category === "5marks" || q.marks === 5;
                      return true;
                    });

                    return (
                      <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
                          <span className="text-xs font-bold text-slate-500 mr-2">Filter:</span>
                          <button
                            onClick={() => setWorksheetFilter("all")}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                              worksheetFilter === "all"
                                ? `${colorTheme.bg} ${colorTheme.text} border border-slate-200 shadow-sm`
                                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            }`}
                          >
                            All ({combinedQuestions.length})
                          </button>

                          {exemplarCount > 0 && (
                            <button
                              onClick={() => setWorksheetFilter("exemplar")}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                                worksheetFilter === "exemplar"
                                  ? "bg-blue-600 text-white border border-blue-700 shadow-sm"
                                  : "bg-blue-50 hover:bg-blue-100 text-blue-700"
                              }`}
                            >
                              NCERT Exemplar ({exemplarCount})
                            </button>
                          )}

                          {boardCount > 0 && (
                            <button
                              onClick={() => setWorksheetFilter("board")}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                                worksheetFilter === "board"
                                  ? "bg-emerald-600 text-white border border-emerald-700 shadow-sm"
                                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              Board Exam PYQs ({boardCount})
                            </button>
                          )}

                          {mcqCount > 0 && (
                            <button
                              onClick={() => setWorksheetFilter("mcq")}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                                worksheetFilter === "mcq"
                                  ? "bg-purple-600 text-white border border-purple-700 shadow-sm"
                                  : "bg-purple-50 hover:bg-purple-100 text-purple-700"
                              }`}
                            >
                              MCQs 1M ({mcqCount})
                            </button>
                          )}

                          {marks3Count > 0 && (
                            <button
                              onClick={() => setWorksheetFilter("3marks")}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                                worksheetFilter === "3marks"
                                  ? "bg-amber-600 text-white border border-amber-700 shadow-sm"
                                  : "bg-amber-50 hover:bg-amber-100 text-amber-700"
                              }`}
                            >
                              3 Marks ({marks3Count})
                            </button>
                          )}

                          {marks5Count > 0 && (
                            <button
                              onClick={() => setWorksheetFilter("5marks")}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                                worksheetFilter === "5marks"
                                  ? "bg-rose-600 text-white border border-rose-700 shadow-sm"
                                  : "bg-rose-50 hover:bg-rose-100 text-rose-700"
                              }`}
                            >
                              5 Marks ({marks5Count})
                            </button>
                          )}
                        </div>

                        <div className="space-y-6">
                          {filteredQuestions.length > 0 ? (
                            filteredQuestions.map((q, idx) => {
                              const isMcq = q.options && q.options.length > 0;

                              if (isMcq) {
                                const selectedOpt = worksheetAnswers[q.id];
                                const isAnswered = selectedOpt !== undefined;

                                return (
                                  <div key={q.id} className="border border-slate-200/60 rounded-xl p-5 bg-white space-y-3.5 shadow-xs">
                                    <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-slate-100">
                                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                        q.sourceType === "NCERT Exemplar" 
                                          ? "bg-blue-50 text-blue-700 border border-blue-200" 
                                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                      }`}>
                                        {q.sourceType === "NCERT Exemplar" ? "NCERT Exemplar Problem" : q.year || "Actual Board Exam (PYQ)"}
                                      </span>
                                      <span className="text-[10px] font-mono text-slate-500 font-bold">
                                        [{q.marks || 1} Mark{(q.marks || 1) > 1 ? "s" : ""}]
                                      </span>
                                    </div>

                                    <div className="flex items-start gap-2.5">
                                      <span className={`font-mono text-[10px] uppercase font-bold py-0.5 px-2 rounded shrink-0 mt-0.5 ${
                                        q.category === "formula" ? "bg-blue-100 text-blue-700" :
                                        q.category === "mcq" ? "bg-emerald-100 text-emerald-700" :
                                        q.category === "3marks" ? "bg-amber-100 text-amber-700" :
                                        q.category === "5marks" ? "bg-rose-100 text-rose-700" :
                                        "bg-slate-200 text-slate-700"
                                      }`}>
                                        {q.category === "formula" ? "Formula" :
                                         q.category === "mcq" ? "MCQ" :
                                         q.category === "3marks" ? "3 Marks" :
                                         q.category === "5marks" ? "5 Marks" :
                                         "MCQ"}
                                      </span>
                                      <p className="text-sm font-semibold text-slate-900 leading-snug">
                                        {q.question}
                                      </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 mt-2">
                                      {q.options && q.options.map((opt, optIdx) => {
                                        const isSelected = selectedOpt === optIdx;
                                        const isCorrectOpt = optIdx === q.correctAnswerIndex;

                                        let optionStyle = "border-slate-200 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50/40";
                                        if (isAnswered) {
                                          if (isCorrectOpt) {
                                            optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold shadow-sm";
                                          } else if (isSelected) {
                                            optionStyle = "border-rose-500 bg-rose-50 text-rose-900 font-semibold shadow-sm";
                                          } else {
                                            optionStyle = "border-slate-100 bg-slate-50/30 text-slate-400 opacity-60";
                                          }
                                        }

                                        return (
                                          <button
                                            key={optIdx}
                                            disabled={isAnswered}
                                            onClick={() => {
                                              setWorksheetAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                                            }}
                                            className={`w-full text-left p-3.5 rounded-lg border text-xs transition-all duration-150 flex items-center justify-between ${optionStyle} ${
                                              !isAnswered ? "cursor-pointer" : "cursor-default"
                                            }`}
                                          >
                                            <span>{opt}</span>
                                            {isAnswered && isCorrectOpt && (
                                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {isAnswered && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-lg border text-xs leading-relaxed space-y-1.5 ${
                                          selectedOpt === q.correctAnswerIndex
                                            ? "bg-emerald-50/30 border-emerald-100 text-emerald-800"
                                            : "bg-rose-50/30 border-rose-100 text-rose-800"
                                        }`}
                                      >
                                        <div className="flex items-center gap-1.5 font-bold">
                                          {selectedOpt === q.correctAnswerIndex ? (
                                            <span className="text-emerald-700">✔ Correct Answer! Excellent job.</span>
                                          ) : (
                                            <span className="text-rose-700">✘ Incorrect Selection</span>
                                          )}
                                        </div>
                                        <p className="text-slate-600">
                                          <strong className="text-slate-800">Explanation:</strong> {q.explanation}
                                        </p>
                                      </motion.div>
                                    )}
                                  </div>
                                );
                              } else {
                                // SATQ short answer question rendering
                                const showAnswer = worksheetAnswers[q.id] === 1;

                                return (
                                  <div key={q.id} className="border border-slate-200/60 rounded-xl p-5 bg-white space-y-3.5 shadow-xs">
                                    <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-slate-100">
                                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                        q.sourceType === "NCERT Exemplar" 
                                          ? "bg-blue-50 text-blue-700 border border-blue-200" 
                                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                      }`}>
                                        {q.sourceType === "NCERT Exemplar" ? "NCERT Exemplar Problem" : q.year || "Actual Board Exam (PYQ)"}
                                      </span>
                                      <span className="text-[10px] font-mono text-slate-500 font-bold">
                                        [{q.marks || (q.category === "5marks" ? 5 : q.category === "3marks" ? 3 : 2)} Marks]
                                      </span>
                                    </div>

                                    <div className="flex items-start gap-2.5">
                                      <span className={`font-mono text-[10px] uppercase font-bold py-0.5 px-2 rounded shrink-0 mt-0.5 ${
                                        q.category === "formula" ? "bg-blue-100 text-blue-700" :
                                        q.category === "3marks" ? "bg-amber-100 text-amber-700" :
                                        q.category === "5marks" ? "bg-rose-100 text-rose-700" :
                                        "bg-purple-100 text-purple-700"
                                      }`}>
                                        {q.category === "formula" ? "Formula & Concept" :
                                         q.category === "3marks" ? "3 Marks (Short)" :
                                         q.category === "5marks" ? "5 Marks (Long)" :
                                         "Short Answer"}
                                      </span>
                                      <p className="text-sm font-semibold text-slate-900 leading-snug">
                                        {q.question}
                                      </p>
                                    </div>

                                    {!showAnswer ? (
                                      <div className="pt-1">
                                        <button
                                          onClick={() => {
                                            setWorksheetAnswers((prev) => ({ ...prev, [q.id]: 1 }));
                                          }}
                                          className={`flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm`}
                                        >
                                          Show Model Answer / Solution
                                        </button>
                                      </div>
                                    ) : (
                                      <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-lg border bg-purple-50/10 border-purple-100 text-xs leading-relaxed space-y-2"
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="font-bold text-purple-800">💡 Verified Model Answer:</span>
                                          <button
                                            onClick={() => {
                                              setWorksheetAnswers((prev) => {
                                                const copy = { ...prev };
                                                delete copy[q.id];
                                                return copy;
                                              });
                                            }}
                                            className="text-[10px] text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                                          >
                                            Hide Answer
                                          </button>
                                        </div>
                                        <p className="text-slate-600 font-medium whitespace-pre-line leading-relaxed">
                                          {q.explanation}
                                        </p>
                                      </motion.div>
                                    )}
                                  </div>
                                );
                              }
                            })
                          ) : (
                            <div className="text-center py-8 text-xs text-slate-400">
                              No questions configured for this filter yet.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Helpful note footer */}
              <div className="border-t border-slate-100 p-4 bg-brand-red-light/20 text-[11px] text-slate-500 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-red shrink-0" />
                Done studying this core topic? Mark it as <strong>Prepared</strong> to see your personal ready-score trends rise in the diagnostics panel!
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm flex flex-col items-center justify-center h-full min-h-[350px]">
              <div className="w-14 h-14 bg-brand-red-light rounded-xl flex items-center justify-center text-brand-red mb-4 animate-bounce">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="font-display font-semibold text-lg text-slate-900">Select a Chapter</h3>
              <p className="text-sm text-slate-400 mt-1.5 max-w-sm mx-auto">
                Explore the menu of lessons on the left, mark your mastery completions, or review specific study summaries.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
