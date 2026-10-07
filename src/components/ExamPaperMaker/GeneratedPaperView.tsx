import React, { useState } from "react";
import { GeneratedPaper } from "../../types/examPaper";
import { generatePaperPdf } from "../../utils/generatePaperPdf";
import { 
  Download, 
  ArrowLeft, 
  Bookmark, 
  CheckCircle, 
  FileText, 
  Layers, 
  Clock, 
  Award, 
  BookOpen,
  Check,
  Building,
  GraduationCap,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface GeneratedPaperViewProps {
  paper: GeneratedPaper;
  onBack: () => void;
  onSaveToCollection?: (paper: GeneratedPaper) => void;
  isSaved?: boolean;
}

export default function GeneratedPaperView({
  paper,
  onBack,
  onSaveToCollection,
  isSaved = false
}: GeneratedPaperViewProps) {
  const [includeSolutions, setIncludeSolutions] = useState<boolean>(false);
  const [schoolName, setSchoolName] = useState<string>("");
  const [examTitle, setExamTitle] = useState<string>("");
  const [showCustomizeHeader, setShowCustomizeHeader] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Trigger PDF Generation and immediate download
  const handleDownloadPdf = () => {
    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      generatePaperPdf(paper, { 
        includeSolutions,
        schoolName: schoolName.trim() || undefined,
        examTitle: examTitle.trim() || undefined
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Section summary counts
  const secA = paper.allQuestions.filter(q => q.marks === 1);
  const secB = paper.allQuestions.filter(q => q.marks === 2 && q.questionType !== "map-based");
  const secC = paper.allQuestions.filter(q => q.marks === 3);
  const secD = paper.allQuestions.filter(q => q.marks === 5);
  const secE = paper.allQuestions.filter(q => q.marks === 4 || q.questionType === "case-based" || q.questionType === "source-based");
  const secF = paper.allQuestions.filter(q => q.questionType === "map-based" && !secB.includes(q));

  // Unique years included
  const years = Array.from(new Set(paper.allQuestions.map(q => q.year).filter(Boolean)));

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-slate-900 pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Paper Creator
        </button>

        {onSaveToCollection && (
          <button
            onClick={() => onSaveToCollection(paper)}
            disabled={isSaved}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isSaved
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            {isSaved ? "Saved to Collection" : "Save Paper"}
          </button>
        )}
      </div>

      {/* Main Ready Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Card Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> Question Paper Generated
            </span>
            <span className="text-xs text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-md">
              Class 10 Board Exam
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {paper.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
            Your question paper has been successfully assembled according to official Class 10 board exam blueprint specifications. Click below to download the complete examination paper as a printable PDF.
          </p>
        </div>

        {/* Paper Blueprint Metrics */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Award className="w-3.5 h-3.5 text-rose-600" />
                <span>Maximum Marks</span>
              </div>
              <div className="text-lg font-bold text-slate-900">{paper.totalMarks} Marks</div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Clock className="w-3.5 h-3.5 text-rose-600" />
                <span>Time Allowed</span>
              </div>
              <div className="text-lg font-bold text-slate-900">{paper.timeAllowed}</div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <FileText className="w-3.5 h-3.5 text-rose-600" />
                <span>Questions</span>
              </div>
              <div className="text-lg font-bold text-slate-900">{paper.allQuestions.length} Questions</div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Layers className="w-3.5 h-3.5 text-rose-600" />
                <span>Sections</span>
              </div>
              <div className="text-lg font-bold text-slate-900">{paper.sections.length} Sections</div>
            </div>
          </div>

          {/* Section Distribution Summary */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Exam Paper Structure
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
              {secA.length > 0 && (
                <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                  <span className="font-medium text-slate-800">Section A: MCQs (1 Mark)</span>
                  <span className="font-semibold text-slate-900">{secA.length} Qs ({secA.length}M)</span>
                </div>
              )}
              {secB.length > 0 && (
                <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                  <span className="font-medium text-slate-800">Section B: Very Short (2 Marks)</span>
                  <span className="font-semibold text-slate-900">{secB.length} Qs ({secB.reduce((s,q)=>s+q.marks,0)}M)</span>
                </div>
              )}
              {secC.length > 0 && (
                <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                  <span className="font-medium text-slate-800">Section C: Short Answer (3 Marks)</span>
                  <span className="font-semibold text-slate-900">{secC.length} Qs ({secC.reduce((s,q)=>s+q.marks,0)}M)</span>
                </div>
              )}
              {secD.length > 0 && (
                <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                  <span className="font-medium text-slate-800">Section D: Long Answer (5 Marks)</span>
                  <span className="font-semibold text-slate-900">{secD.length} Qs ({secD.reduce((s,q)=>s+q.marks,0)}M)</span>
                </div>
              )}
              {secE.length > 0 && (
                <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                  <span className="font-medium text-slate-800">Section E: Case Units (4 Marks)</span>
                  <span className="font-semibold text-slate-900">{secE.length} Qs ({secE.reduce((s,q)=>s+q.marks,0)}M)</span>
                </div>
              )}
              {secF.length > 0 && (
                <div className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                  <span className="font-medium text-slate-800">Section F: Map Questions</span>
                  <span className="font-semibold text-slate-900">{secF.length} Qs ({secF.reduce((s,q)=>s+q.marks,0)}M)</span>
                </div>
              )}
            </div>
          </div>

          {/* Chapters Included */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Syllabus Chapters Covered ({paper.selectedChapterTitles.length})
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {paper.selectedChapterTitles.join(" • ")}
            </p>
          </div>

          {/* PDF Customization Options & Download Box */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            {/* Header Customization Accordion */}
            <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setShowCustomizeHeader(!showCustomizeHeader)}
                className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  <span>Customize School & Exam Title on PDF Header (Optional)</span>
                </div>
                {showCustomizeHeader ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showCustomizeHeader && (
                <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 block">
                      School / Institution Name
                    </label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g. Delhi Public School / Central Board of Secondary Education"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                    <span className="text-[10px] text-slate-400">
                      Leave empty to use official board title: "CENTRAL BOARD OF SECONDARY EDUCATION"
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 block">
                      Examination Name
                    </label>
                    <input
                      type="text"
                      value={examTitle}
                      onChange={(e) => setExamTitle(e.target.value)}
                      placeholder="e.g. Pre-Board Examination (2024-25) / Annual Examination"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                    <span className="text-[10px] text-slate-400">
                      Leave empty to use: "SECONDARY SCHOOL EXAMINATION (CLASS X)"
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Marking Scheme Toggle */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeSolutions}
                  onChange={(e) => setIncludeSolutions(e.target.checked)}
                  className="w-4 h-4 accent-slate-900 rounded cursor-pointer"
                />
                <span>Include Official Marking Scheme & Step-by-Step Solutions in PDF</span>
              </label>

              <span className="text-xs text-slate-500">
                Sources: Official Board Papers ({years.join(", ")})
              </span>
            </div>

            {/* Prominent Primary PDF Download Button */}
            <button
              id="download-paper-pdf-btn"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-sm shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Generating Examination Paper PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>PDF Downloaded Successfully!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Sample Paper as PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Board Examination Quality Specifications */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-2">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-700" />
              <span>Authentic Class 10 Board Paper Layout</span>
            </div>
            <p className="leading-relaxed">
              The generated PDF is formatted for direct printing on standard A4 paper. It features candidate roll-number box, official board titles, subject code, general instructions, section dividers, marks beside every question, diagrams/tables specifications, running page numbers, and a complete <strong>Sources of Questions</strong> provenance section at the end.
            </p>
          </div>

          {/* Quick secondary actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onBack}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 underline cursor-pointer"
            >
              Assemble another examination paper
            </button>

            <span className="text-xs text-slate-400">
              Format: Standard A4 • Ready for direct printing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
