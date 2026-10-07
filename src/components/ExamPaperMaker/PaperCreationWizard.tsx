import React, { useState, useMemo } from "react";
import { 
  PaperFilterConfig, 
  QuestionType, 
  DifficultyLevel, 
  GeneratedPaper 
} from "../../types/examPaper";
import { CBSE_SUBJECTS } from "../../data/cbseData";
import { 
  assembleBoardExamPaper, 
  getAllSourceQuestions, 
  AssemblyResult 
} from "../../data/sourceQuestionBank";
import { 
  AlertCircle, 
  Check, 
  Search, 
  Settings,
  Database
} from "lucide-react";

interface PaperCreationWizardProps {
  key?: React.Key;
  onPaperGenerated: (paper: GeneratedPaper) => void;
  onOpenAdmin: () => void;
}

const AVAILABLE_SUBJECTS = [
  { id: "mathematics", name: "Mathematics", code: "041" },
  { id: "science", name: "Science", code: "086" },
  { id: "social-science", name: "Social Science", code: "087" },
  { id: "english", name: "English", code: "184" },
  { id: "hindi", name: "Hindi", code: "002/085" },
  { id: "ai", name: "Artificial Intelligence", code: "417" }
];

const QUESTION_TYPES_CONFIG: { type: QuestionType; label: string; marks: number }[] = [
  { type: "mcq", label: "Multiple Choice Questions", marks: 1 },
  { type: "assertion-reason", label: "Assertion-Reason", marks: 1 },
  { type: "vsa", label: "Very Short Answer", marks: 2 },
  { type: "sa", label: "Short Answer", marks: 3 },
  { type: "la", label: "Long Answer", marks: 5 },
  { type: "case-based", label: "Case-based / Competency", marks: 4 },
  { type: "source-based", label: "Source-based", marks: 4 },
  { type: "map-based", label: "Map-based Skill", marks: 2 }
];

const PRESET_MARKS = [20, 40, 50, 80, 100];

export default function PaperCreationWizard({
  onPaperGenerated,
  onOpenAdmin
}: PaperCreationWizardProps) {
  // Config states
  const [isMultiSubject, setIsMultiSubject] = useState<boolean>(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["mathematics"]);
  const [totalMarks, setTotalMarks] = useState<number>(80);
  const [customMarksInput, setCustomMarksInput] = useState<string>("80");
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<QuestionType[]>([
    "mcq",
    "assertion-reason",
    "vsa",
    "sa",
    "la",
    "case-based",
    "source-based"
  ]);
  const [difficulty, setDifficulty] = useState<DifficultyLevel | "mixed">("mixed");
  const [allowPartial, setAllowPartial] = useState<boolean>(false);
  const [onlyBoardExams, setOnlyBoardExams] = useState<boolean>(false);

  // Status and error reporting
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStatus, setGenerationStatus] = useState<string>("Building your paper...");

  // Load question bank for real-time inventory count
  const allSourceQuestions = useMemo(() => getAllSourceQuestions(), []);

  // Helper for subject matching (e.g. ai <-> class-10-ai)
  const isSubjectMatch = (qSub: string, targetSub: string) => {
    if (qSub === targetSub) return true;
    if ((targetSub === "ai" || targetSub === "class-10-ai") && (qSub === "ai" || qSub === "class-10-ai")) return true;
    return false;
  };

  // Compute available chapters for current subjects
  const availableChapters = useMemo(() => {
    const chapters: { id: string; title: string; subjectId: string; subjectName: string; count: number; marks: number }[] = [];
    
    selectedSubjects.forEach(subId => {
      const subjectDef = CBSE_SUBJECTS.find(s => isSubjectMatch(s.id, subId));
      if (subjectDef) {
        subjectDef.chapters.forEach(ch => {
          const matching = allSourceQuestions.filter(
            q => isSubjectMatch(q.subjectId, subId) && q.chapterId === ch.id && q.isApprovedSource
          );
          const chMarks = matching.reduce((sum, q) => sum + q.marks, 0);

          chapters.push({
            id: ch.id,
            title: ch.title,
            subjectId: subId,
            subjectName: subjectDef.name,
            count: matching.length,
            marks: chMarks
          });
        });
      }
    });

    return chapters;
  }, [selectedSubjects, allSourceQuestions]);

  // Select all chapters by default on subject change
  React.useEffect(() => {
    if (availableChapters.length > 0) {
      setSelectedChapterIds(availableChapters.map(c => c.id));
    } else {
      setSelectedChapterIds([]);
    }
  }, [selectedSubjects]);

  // Live pool summary
  const poolSummary = useMemo(() => {
    let pool = allSourceQuestions.filter(q => q.isApprovedSource);
    if (selectedSubjects.length > 0) {
      pool = pool.filter(q => selectedSubjects.some(subId => isSubjectMatch(q.subjectId, subId)));
    }
    if (selectedChapterIds.length > 0) {
      pool = pool.filter(q => selectedChapterIds.includes(q.chapterId));
    } else {
      return { count: 0, totalMarks: 0 };
    }
    if (selectedQuestionTypes.length > 0) {
      pool = pool.filter(q => selectedQuestionTypes.includes(q.questionType));
    }
    if (difficulty !== "mixed") {
      pool = pool.filter(q => q.difficulty === difficulty);
    }
    if (onlyBoardExams) {
      pool = pool.filter(q => q.paperType === "CBSE Board Examination");
    }

    const tMarks = pool.reduce((sum, q) => sum + q.marks, 0);
    return { count: pool.length, totalMarks: tMarks };
  }, [allSourceQuestions, selectedSubjects, selectedChapterIds, selectedQuestionTypes, difficulty, onlyBoardExams]);

  // Subject toggling
  const handleSelectSubject = (subId: string) => {
    setGenerationError(null);
    if (!isMultiSubject) {
      setSelectedSubjects([subId]);
    } else {
      if (selectedSubjects.includes(subId)) {
        if (selectedSubjects.length > 1) {
          setSelectedSubjects(selectedSubjects.filter(s => s !== subId));
        }
      } else {
        setSelectedSubjects([...selectedSubjects, subId]);
      }
    }
  };

  const handleToggleChapter = (chId: string) => {
    setGenerationError(null);
    if (selectedChapterIds.includes(chId)) {
      setSelectedChapterIds(selectedChapterIds.filter(id => id !== chId));
    } else {
      setSelectedChapterIds([...selectedChapterIds, chId]);
    }
  };

  const handleSelectAllChapters = () => {
    setSelectedChapterIds(availableChapters.map(c => c.id));
    setGenerationError(null);
  };

  const handleDeselectAllChapters = () => {
    setSelectedChapterIds([]);
    setGenerationError(null);
  };

  const handleToggleQuestionType = (qt: QuestionType) => {
    setGenerationError(null);
    if (selectedQuestionTypes.includes(qt)) {
      if (selectedQuestionTypes.length > 1) {
        setSelectedQuestionTypes(selectedQuestionTypes.filter(t => t !== qt));
      }
    } else {
      setSelectedQuestionTypes([...selectedQuestionTypes, qt]);
    }
  };

  const handleSetPresetMarks = (marks: number) => {
    setTotalMarks(marks);
    setCustomMarksInput(marks.toString());
    setGenerationError(null);
  };

  const handleCustomMarksChange = (val: string) => {
    setCustomMarksInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setTotalMarks(parsed);
      setGenerationError(null);
    }
  };

  // Trigger Gemini paper assembly
  const handleGeneratePaper = async () => {
    setGenerationError(null);
    setIsGenerating(true);
    setGenerationStatus("Searching past-year board questions...");

    const normalizedSubjectIds = selectedSubjects.map(s => s === "ai" ? "class-10-ai" : s);

    const config: PaperFilterConfig = {
      subjectIds: normalizedSubjectIds,
      totalMarks,
      allowPartial,
      chapterIds: selectedChapterIds,
      questionTypes: selectedQuestionTypes,
      difficulty,
      distributionMode: "standard_cbse",
      onlyBoardExams
    };

    try {
      const result: AssemblyResult = await assembleBoardExamPaper(config, (status) => {
        setGenerationStatus(status);
      });

      setIsGenerating(false);

      if (result.success && result.paper) {
        onPaperGenerated(result.paper);
      } else {
        setGenerationError(
          result.message ||
          `The selected criteria currently offer ${poolSummary.totalMarks} marks in the question bank. Please add more chapters or adjust the target marks to match.`
        );
      }
    } catch (err: any) {
      setIsGenerating(false);
      setGenerationError(
        "An unexpected error occurred during paper assembly. Please try adjusting your parameters."
      );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-slate-900">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Create Examination Paper
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Assemble official past-year board examination questions matching your exact mark and chapter criteria.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAdmin}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>Manage Question Bank</span>
          </button>
        </div>
      </div>

      {/* Main Assembly Configuration Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
        {/* Subject Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">
              Subject
            </h2>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isMultiSubject}
                onChange={(e) => {
                  setIsMultiSubject(e.target.checked);
                  if (!e.target.checked && selectedSubjects.length > 1) {
                    setSelectedSubjects([selectedSubjects[0]]);
                  }
                }}
                className="w-4 h-4 accent-slate-900 rounded"
              />
              <span>Combined Multi-Subject Paper</span>
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {AVAILABLE_SUBJECTS.map((sub) => {
              const isSelected = selectedSubjects.includes(sub.id);
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSelectSubject(sub.id)}
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white font-medium"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <div className="text-sm font-semibold">{sub.name}</div>
                  <div className={`text-xs mt-0.5 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                    Code {sub.code}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Total Marks */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            Total Marks
          </h2>
          <div className="flex flex-wrap items-center gap-2.5">
            {PRESET_MARKS.map((m) => (
              <button
                key={m}
                onClick={() => handleSetPresetMarks(m)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  totalMarks === m && customMarksInput === m.toString()
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {m} Marks {m === 80 ? "(Full Board)" : m === 40 ? "(Periodic Test)" : m === 20 ? "(Unit Test)" : ""}
              </button>
            ))}

            <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-xs">
              <span className="text-slate-500 font-medium">Custom:</span>
              <input
                type="number"
                min="5"
                max="100"
                value={customMarksInput}
                onChange={(e) => handleCustomMarksChange(e.target.value)}
                className="w-14 font-mono font-semibold text-slate-900 text-center focus:outline-none"
              />
              <span className="text-slate-500">marks</span>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">
              Chapters ({selectedChapterIds.length} of {availableChapters.length} Selected)
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={handleSelectAllChapters}
                className="text-slate-700 hover:text-slate-950 font-medium underline cursor-pointer"
              >
                Select All
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={handleDeselectAllChapters}
                className="text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
              >
                Deselect All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto border border-slate-200 rounded-lg p-3">
            {availableChapters.map((ch) => {
              const isSelected = selectedChapterIds.includes(ch.id);
              return (
                <label
                  key={ch.id}
                  className={`flex items-start gap-2.5 p-2 rounded text-xs cursor-pointer select-none transition-colors ${
                    isSelected ? "bg-slate-100/80 text-slate-900 font-medium" : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleChapter(ch.id)}
                    className="w-4 h-4 mt-0.5 accent-slate-900 rounded shrink-0 cursor-pointer"
                  />
                  <div className="truncate flex-1">
                    <div className="truncate">{ch.title}</div>
                    <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                      {ch.count} questions • {ch.marks} marks pool
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Question Types */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            Question Types
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {QUESTION_TYPES_CONFIG.map((qt) => {
              const isSelected = selectedQuestionTypes.includes(qt.type);
              return (
                <label
                  key={qt.type}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer select-none transition-colors ${
                    isSelected
                      ? "border-slate-800 bg-slate-900 text-white font-medium"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <div>{qt.label}</div>
                    <div className={`text-[11px] font-mono ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                      {qt.marks} Mark{qt.marks > 1 ? "s" : ""}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleQuestionType(qt.type)}
                    className="w-3.5 h-3.5 accent-brand-red rounded cursor-pointer"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Difficulty & Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-slate-900">
              Difficulty
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {(["mixed", "easy", "moderate", "hard"] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium uppercase tracking-wide transition-colors cursor-pointer ${
                    difficulty === diff
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <label className="flex items-center gap-2 text-slate-800 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={allowPartial}
                onChange={(e) => setAllowPartial(e.target.checked)}
                className="w-4 h-4 accent-slate-900 rounded cursor-pointer"
              />
              <span>Allow partial paper if exact marks cannot be filled</span>
            </label>

            <label className="flex items-center gap-2 text-slate-800 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={onlyBoardExams}
                onChange={(e) => setOnlyBoardExams(e.target.checked)}
                className="w-4 h-4 accent-slate-900 rounded cursor-pointer"
              />
              <span>Only official CBSE Board exams (exclude sample papers)</span>
            </label>
          </div>
        </div>

        {/* Error Display */}
        {generationError && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-950 flex flex-col sm:flex-row items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold text-amber-950">Notice</div>
                <p className="leading-relaxed text-amber-900">{generationError}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 self-end sm:self-auto">
              {selectedChapterIds.length < availableChapters.length && (
                <button
                  type="button"
                  onClick={handleSelectAllChapters}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-medium cursor-pointer transition-colors"
                >
                  Select All Chapters
                </button>
              )}
              {poolSummary.totalMarks > 0 && poolSummary.totalMarks < totalMarks && (
                <button
                  type="button"
                  onClick={() => handleSetPresetMarks(poolSummary.totalMarks)}
                  className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 rounded text-xs font-medium cursor-pointer transition-colors"
                >
                  Set to {poolSummary.totalMarks} Marks
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action Button & Inventory Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-600 font-medium">
            Available Corpus: <span className="font-semibold text-slate-900">{poolSummary.count} verified questions</span> ({poolSummary.totalMarks} marks pool)
          </div>

          <button
            id="generate-paper-btn"
            onClick={handleGeneratePaper}
            disabled={isGenerating || selectedChapterIds.length === 0}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>{generationStatus}</span>
              </span>
            ) : (
              "Generate Paper"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
