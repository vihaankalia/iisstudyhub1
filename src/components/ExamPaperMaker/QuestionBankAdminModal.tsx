import React, { useState, useMemo } from "react";
import { 
  SourceQuestion, 
  QuestionType, 
  DifficultyLevel, 
  PaperType 
} from "../../types/examPaper";
import { 
  getAllSourceQuestions, 
  saveCustomQuestion, 
  deleteCustomQuestion, 
  toggleQuestionApproval 
} from "../../data/sourceQuestionBank";
import { CBSE_SUBJECTS } from "../../data/cbseData";
import { 
  Database, 
  Plus, 
  Search, 
  Check, 
  X, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  AlertCircle,
  Download,
  Filter
} from "lucide-react";

interface QuestionBankAdminModalProps {
  onClose: () => void;
  onRefreshBank: () => void;
}

export default function QuestionBankAdminModal({
  onClose,
  onRefreshBank
}: QuestionBankAdminModalProps) {
  const [questions, setQuestions] = useState<SourceQuestion[]>(() => getAllSourceQuestions());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [approvalFilter, setApprovalFilter] = useState<"all" | "approved" | "unapproved">("all");
  
  // Editor / New Question state
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<SourceQuestion | null>(null);

  // Form states for adding / editing
  const [formData, setFormData] = useState<Partial<SourceQuestion>>({
    subjectId: "mathematics",
    subjectName: "Mathematics",
    classLevel: "Class 10",
    chapterId: "real-numbers",
    chapterTitle: "Real Numbers",
    topic: "",
    marks: 1,
    questionType: "mcq",
    difficulty: "easy",
    paperType: "CBSE Board Examination",
    year: "2024",
    session: "Annual Board Examination 2024",
    setCode: "Set 1 (30/1/1)",
    sourceTitle: "CBSE Class 10 Mathematics Standard Board Examination 2024",
    sourceUrl: "https://cbseacademic.nic.in/archive.html",
    originalQuestionNumber: "Q1",
    pageNumber: "Page 2",
    questionText: "",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctOptionIndex: 0,
    officialSolution: "",
    solutionAvailable: true,
    isApprovedSource: true
  });

  // Filtered list
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (subjectFilter !== "all" && q.subjectId !== subjectFilter) return false;
      if (typeFilter !== "all" && q.questionType !== typeFilter) return false;
      if (approvalFilter === "approved" && !q.isApprovedSource) return false;
      if (approvalFilter === "unapproved" && q.isApprovedSource) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText = q.questionText.toLowerCase().includes(query);
        const matchesSource = q.sourceTitle.toLowerCase().includes(query);
        const matchesChapter = q.chapterTitle.toLowerCase().includes(query);
        const matchesId = q.id.toLowerCase().includes(query);
        if (!matchesText && !matchesSource && !matchesChapter && !matchesId) return false;
      }
      return true;
    });
  }, [questions, subjectFilter, typeFilter, approvalFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = questions.length;
    const approved = questions.filter(q => q.isApprovedSource).length;
    const bySubject: Record<string, number> = {};
    questions.forEach(q => {
      bySubject[q.subjectName] = (bySubject[q.subjectName] || 0) + 1;
    });
    return { total, approved, bySubject };
  }, [questions]);

  // Toggle approval
  const handleToggleApproval = (q: SourceQuestion) => {
    const newStatus = !q.isApprovedSource;
    toggleQuestionApproval(q.id, newStatus);
    const updated = getAllSourceQuestions();
    setQuestions(updated);
    onRefreshBank();
  };

  // Delete
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this question record?")) {
      deleteCustomQuestion(id);
      const updated = getAllSourceQuestions();
      setQuestions(updated);
      onRefreshBank();
    }
  };

  // Open Edit Form
  const handleOpenEdit = (q: SourceQuestion) => {
    setEditingQuestion(q);
    setFormData({ ...q });
    setIsAddingNew(true);
  };

  // Save Add/Edit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.questionText?.trim()) {
      alert("Question text is required.");
      return;
    }

    const sub = CBSE_SUBJECTS.find(s => s.id === formData.subjectId);
    const ch = sub?.chapters.find(c => c.id === formData.chapterId);

    const questionToSave: SourceQuestion = {
      id: editingQuestion?.id || `cbse-admin-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      questionText: formData.questionText || "",
      subjectId: formData.subjectId || "mathematics",
      subjectName: sub?.name || formData.subjectName || "Mathematics",
      classLevel: "Class 10",
      chapterId: formData.chapterId || (ch ? ch.id : "general"),
      chapterTitle: ch ? ch.title : formData.chapterTitle || "General",
      topic: formData.topic || (ch ? ch.title : "General"),
      marks: Number(formData.marks) || 1,
      questionType: (formData.questionType as QuestionType) || "mcq",
      difficulty: (formData.difficulty as DifficultyLevel) || "moderate",
      paperType: (formData.paperType as PaperType) || "CBSE Board Examination",
      year: formData.year || "2024",
      session: formData.session || "Annual Board Examination 2024",
      setCode: formData.setCode || "Set 1",
      sourceTitle: formData.sourceTitle || "CBSE Class 10 Board Examination",
      sourceUrl: formData.sourceUrl || "https://cbseacademic.nic.in/archive.html",
      originalQuestionNumber: formData.originalQuestionNumber || "Q1",
      pageNumber: formData.pageNumber || "Page 1",
      options: formData.questionType === "mcq" || formData.questionType === "assertion-reason" ? formData.options : undefined,
      correctOptionIndex: formData.correctOptionIndex,
      officialSolution: formData.officialSolution || undefined,
      solutionAvailable: Boolean(formData.officialSolution?.trim()),
      casePassage: formData.casePassage || undefined,
      isApprovedSource: formData.isApprovedSource ?? true,
      sourceDateAdded: new Date().toISOString()
    };

    saveCustomQuestion(questionToSave);
    const updated = getAllSourceQuestions();
    setQuestions(updated);
    setIsAddingNew(false);
    setEditingQuestion(null);
    onRefreshBank();
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cbse_class10_source_question_bank_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in no-print">
      <div className="bg-white rounded-3xl max-w-5xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/10 text-white">
                <Database className="w-4 h-4 text-emerald-400" />
              </span>
              <h2 className="text-xl font-bold font-display tracking-tight text-white">
                Source Question Bank & Admin Manager
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              Only questions with <span className="text-emerald-400 font-bold">Approved Source Question</span> status may appear in student-generated board papers.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 px-6 flex flex-wrap items-center justify-between gap-4 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <span>Total Questions in Bank:</span>
              <span className="font-mono bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md">
                {stats.total}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <span>Approved for Papers:</span>
              <span className="font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                {stats.approved}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              <Download className="w-3.5 h-3.5" /> Export Bank JSON
            </button>
            <button
              onClick={() => {
                setEditingQuestion(null);
                setFormData({
                  subjectId: "mathematics",
                  subjectName: "Mathematics",
                  classLevel: "Class 10",
                  chapterId: "real-numbers",
                  chapterTitle: "Real Numbers",
                  marks: 1,
                  questionType: "mcq",
                  difficulty: "moderate",
                  paperType: "CBSE Board Examination",
                  year: "2024",
                  session: "Annual Board Examination 2024",
                  setCode: "Set 1 (30/1/1)",
                  sourceTitle: "CBSE Class 10 Mathematics Standard Board Examination 2024",
                  sourceUrl: "https://cbseacademic.nic.in/archive.html",
                  originalQuestionNumber: "Q1",
                  questionText: "",
                  options: ["A", "B", "C", "D"],
                  correctOptionIndex: 0,
                  officialSolution: "",
                  solutionAvailable: true,
                  isApprovedSource: true
                });
                setIsAddingNew(true);
              }}
              className="px-3.5 py-1.5 bg-brand-red hover:bg-brand-red-hover text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Verified Past Question
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add / Edit Form Modal inside */}
          {isAddingNew ? (
            <form onSubmit={handleSaveForm} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-900 text-base">
                  {editingQuestion ? "Edit Verified Question Metadata" : "Import / Add New Verified Past-Paper Question"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              {/* Subject & Chapter */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => {
                      const subId = e.target.value;
                      const sub = CBSE_SUBJECTS.find(s => s.id === subId);
                      setFormData({
                        ...formData,
                        subjectId: subId,
                        subjectName: sub?.name || subId,
                        chapterId: sub?.chapters[0]?.id || "",
                        chapterTitle: sub?.chapters[0]?.title || ""
                      });
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    {CBSE_SUBJECTS.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Chapter</label>
                  <select
                    value={formData.chapterId}
                    onChange={(e) => {
                      const chId = e.target.value;
                      const sub = CBSE_SUBJECTS.find(s => s.id === formData.subjectId);
                      const ch = sub?.chapters.find(c => c.id === chId);
                      setFormData({
                        ...formData,
                        chapterId: chId,
                        chapterTitle: ch?.title || chId
                      });
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    {CBSE_SUBJECTS.find(s => s.id === formData.subjectId)?.chapters.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Topic</label>
                  <input
                    type="text"
                    value={formData.topic || ""}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g. Fundamental Theorem of Arithmetic"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  />
                </div>
              </div>

              {/* Marks, Type, Difficulty, Paper Type */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Marks</label>
                  <select
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value={1}>1 Mark (MCQ / AR)</option>
                    <option value={2}>2 Marks (VSA)</option>
                    <option value={3}>3 Marks (SA)</option>
                    <option value={4}>4 Marks (Case-based)</option>
                    <option value={5}>5 Marks (LA)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Question Type</label>
                  <select
                    value={formData.questionType}
                    onChange={(e) => setFormData({ ...formData, questionType: e.target.value as QuestionType })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="mcq">MCQ</option>
                    <option value="assertion-reason">Assertion-Reason</option>
                    <option value="vsa">Very Short Answer</option>
                    <option value="sa">Short Answer</option>
                    <option value="la">Long Answer</option>
                    <option value="case-based">Case-based</option>
                    <option value="source-based">Source-based</option>
                    <option value="map-based">Map-based</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Difficulty Metadata</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as DifficultyLevel })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Paper Type</label>
                  <select
                    value={formData.paperType}
                    onChange={(e) => setFormData({ ...formData, paperType: e.target.value as PaperType })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="CBSE Board Examination">CBSE Board Examination</option>
                    <option value="CBSE Official Sample Paper">CBSE Official Sample Paper</option>
                    <option value="Approved Administrator Past Paper">Approved Admin Past Paper</option>
                  </select>
                </div>
              </div>

              {/* Source Provenance Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Year</label>
                  <input
                    type="text"
                    value={formData.year || ""}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g. 2024"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Set / Series Code</label>
                  <input
                    type="text"
                    value={formData.setCode || ""}
                    onChange={(e) => setFormData({ ...formData, setCode: e.target.value })}
                    placeholder="e.g. Set 1 (30/1/1)"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Original Q# & Page</label>
                  <input
                    type="text"
                    value={formData.originalQuestionNumber || ""}
                    onChange={(e) => setFormData({ ...formData, originalQuestionNumber: e.target.value })}
                    placeholder="e.g. Q14 (Page 4)"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Approved Status</label>
                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isApprovedSource}
                        onChange={(e) => setFormData({ ...formData, isApprovedSource: e.target.checked })}
                        className="w-4 h-4 accent-brand-red rounded"
                      />
                      <span>Approved Source Question</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Source Title & Document Link</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.sourceTitle || ""}
                    onChange={(e) => setFormData({ ...formData, sourceTitle: e.target.value })}
                    placeholder="Source Paper Title (e.g. CBSE Class 10 Science Board Exam 2024)"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  />
                  <input
                    type="text"
                    value={formData.sourceUrl || ""}
                    onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                    placeholder="Official Document Link (URL)"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  />
                </div>
              </div>

              {/* Case Passage if Case-Based */}
              {(formData.questionType === "case-based" || formData.questionType === "source-based") && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Case Study Passage (Verbatim Context)</label>
                  <textarea
                    rows={3}
                    value={formData.casePassage || ""}
                    onChange={(e) => setFormData({ ...formData, casePassage: e.target.value })}
                    placeholder="Insert the exact case passage / background context..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white font-mono"
                  />
                </div>
              )}

              {/* Exact Question Text */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Question Text (Verbatim from Source — Do Not Alter)
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.questionText || ""}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  placeholder="Enter the verbatim question text..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white font-medium"
                />
              </div>

              {/* Options if MCQ */}
              {(formData.questionType === "mcq" || formData.questionType === "assertion-reason") && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">MCQ Options</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[0, 1, 2, 3].map((optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctOption"
                          checked={formData.correctOptionIndex === optIdx}
                          onChange={() => setFormData({ ...formData, correctOptionIndex: optIdx })}
                          className="w-4 h-4 accent-brand-red cursor-pointer"
                        />
                        <span className="font-bold text-xs text-slate-500 w-4">
                          {String.fromCharCode(65 + optIdx)}:
                        </span>
                        <input
                          type="text"
                          value={formData.options?.[optIdx] || ""}
                          onChange={(e) => {
                            const newOpts = [...(formData.options || ["", "", "", ""])];
                            newOpts[optIdx] = e.target.value;
                            setFormData({ ...formData, options: newOpts });
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)} text`}
                          className="flex-1 text-xs p-2 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Official Solution */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Official Marking Scheme / Solution (Leave empty if not available in archive)
                </label>
                <textarea
                  rows={3}
                  value={formData.officialSolution || ""}
                  onChange={(e) => setFormData({ ...formData, officialSolution: e.target.value })}
                  placeholder="Enter verbatim official steps and answer..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Save Question to Database
                </button>
              </div>
            </form>
          ) : null}

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search question text, source, chapter, or ID..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-medium"
              >
                <option value="all">All Subjects</option>
                {CBSE_SUBJECTS.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-medium"
              >
                <option value="all">All Types</option>
                <option value="mcq">MCQ</option>
                <option value="assertion-reason">Assertion-Reason</option>
                <option value="vsa">VSA (2m)</option>
                <option value="sa">SA (3m)</option>
                <option value="la">LA (5m)</option>
                <option value="case-based">Case-based (4m)</option>
              </select>

              <select
                value={approvalFilter}
                onChange={(e) => setApprovalFilter(e.target.value as any)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-medium"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved Only</option>
                <option value="unapproved">Pending / Unapproved</option>
              </select>
            </div>
          </div>

          {/* Questions Table / List */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-500">
              Showing {filteredQuestions.length} questions matching filter:
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                No past questions match your filter criteria.
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col md:flex-row items-start justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {q.id}
                        </span>
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {q.subjectName} • {q.chapterTitle}
                        </span>
                        <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {q.marks} Mark{q.marks > 1 ? "s" : ""} ({q.questionType.toUpperCase()})
                        </span>
                        <span className="font-mono text-slate-500 text-[11px]">
                          CBSE {q.year} • {q.setCode || "Set 1"}
                        </span>
                      </div>

                      <div className="text-slate-900 font-medium leading-relaxed">
                        {q.questionText}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span>Source: <strong className="text-slate-700">{q.sourceTitle}</strong> ({q.originalQuestionNumber})</span>
                        {q.sourceUrl && (
                          <a
                            href={q.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline flex items-center gap-0.5"
                          >
                            Source Ref <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {/* Approval Toggle */}
                      <button
                        onClick={() => handleToggleApproval(q)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                          q.isApprovedSource
                            ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-900"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                        }`}
                        title="Toggle whether question is approved for student paper generation"
                      >
                        <ShieldCheck className={`w-3.5 h-3.5 ${q.isApprovedSource ? "text-emerald-600" : "text-slate-400"}`} />
                        <span>{q.isApprovedSource ? "Approved" : "Excluded"}</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEdit(q)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit metadata"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete Custom Question */}
                      {q.id.startsWith("cbse-admin-") && (
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete custom question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 flex items-center justify-between border-t border-slate-200 shrink-0">
          <span className="text-xs text-slate-500">
            CBSE Examination Board Source Integrity Protected.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close Admin View
          </button>
        </div>
      </div>
    </div>
  );
}
