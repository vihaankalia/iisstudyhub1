import React from "react";
import { SourceQuestion } from "../../types/examPaper";
import { ExternalLink, X } from "lucide-react";

interface SourceTransparencyModalProps {
  question: SourceQuestion | null;
  onClose: () => void;
}

export default function SourceTransparencyModal({ question, onClose }: SourceTransparencyModalProps) {
  if (!question) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-lg max-w-2xl w-full border border-slate-300 shadow-xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Question Source Citation
            </h2>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              ID: {question.id}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-sm text-slate-800">
          {/* Question Preview */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Question Text
            </div>
            <div className="border border-slate-200 rounded p-3 bg-slate-50 text-slate-900">
              {question.casePassage && (
                <div className="mb-2 p-2 bg-white border border-slate-200 rounded text-xs text-slate-700">
                  <div className="font-semibold text-slate-900 mb-0.5">Passage:</div>
                  {question.casePassage}
                </div>
              )}
              <p>{question.questionText}</p>
              {question.options && question.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200 text-xs">
                  {question.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="font-semibold">({String.fromCharCode(65 + i)})</span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Metadata Table */}
          <div className="border border-slate-200 rounded overflow-hidden text-xs">
            <div className="grid grid-cols-3 p-2.5 border-b border-slate-100 bg-slate-50">
              <span className="font-medium text-slate-500">Document Title</span>
              <span className="col-span-2 font-semibold text-slate-900">{question.sourceTitle}</span>
            </div>
            <div className="grid grid-cols-3 p-2.5 border-b border-slate-100">
              <span className="font-medium text-slate-500">Year & Session</span>
              <span className="col-span-2 text-slate-900">CBSE {question.year} — {question.session}</span>
            </div>
            <div className="grid grid-cols-3 p-2.5 border-b border-slate-100 bg-slate-50">
              <span className="font-medium text-slate-500">Set Code & Original Q#</span>
              <span className="col-span-2 font-mono text-slate-900">{question.setCode || "Set 1"}, {question.originalQuestionNumber} {question.pageNumber ? `(${question.pageNumber})` : ""}</span>
            </div>
            <div className="grid grid-cols-3 p-2.5 border-b border-slate-100">
              <span className="font-medium text-slate-500">Subject & Chapter</span>
              <span className="col-span-2 text-slate-900">{question.subjectName} — {question.chapterTitle}</span>
            </div>
            <div className="grid grid-cols-3 p-2.5 bg-slate-50">
              <span className="font-medium text-slate-500">Marks & Type</span>
              <span className="col-span-2 font-mono text-slate-900">{question.marks} Mark{question.marks > 1 ? "s" : ""} ({question.questionType.toUpperCase()})</span>
            </div>
          </div>

          {/* Solution */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Official Marking Scheme
            </div>
            <div className="p-3 bg-slate-900 text-slate-100 rounded text-xs font-mono whitespace-pre-wrap leading-relaxed">
              {question.officialSolution || "Official solution not available in archive."}
            </div>
          </div>

          {/* Source Link */}
          {question.sourceUrl && (
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">Official document link:</span>
              <a
                href={question.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-800 hover:text-black font-semibold underline flex items-center gap-1"
              >
                Open Source Archive <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 px-6 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
