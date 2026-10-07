import React, { useState, useEffect } from "react";
import { GeneratedPaper } from "../../types/examPaper";
import PaperCreationWizard from "./PaperCreationWizard";
import GeneratedPaperView from "./GeneratedPaperView";
import QuestionBankAdminModal from "./QuestionBankAdminModal";
import { StudentProfile } from "../../types";
import { db } from "../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { 
  FileText, 
  Database, 
  Bookmark, 
  Trash2, 
  Printer, 
  ArrowRight,
  Download
} from "lucide-react";

interface ExamPaperMakerTabProps {
  profile: StudentProfile | null;
}

const LOCAL_STORAGE_SAVED_PAPERS = "cbse_saved_exam_papers_v1";

export default function ExamPaperMakerTab({ profile }: ExamPaperMakerTabProps) {
  const [currentView, setCurrentView] = useState<"wizard" | "paper" | "saved">("wizard");
  const [activePaper, setActivePaper] = useState<GeneratedPaper | null>(null);
  const [savedPapers, setSavedPapers] = useState<GeneratedPaper[]>([]);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [bankRefreshTrigger, setBankRefreshTrigger] = useState<number>(0);

  // Load saved papers from localStorage & Firestore
  useEffect(() => {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_SAVED_PAPERS);
      if (local) {
        setSavedPapers(JSON.parse(local));
      }
    } catch (e) {
      console.error("Failed to load saved papers", e);
    }

    if (profile?.uid) {
      const userRef = doc(db, "users", profile.uid);
      getDoc(userRef).then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.savedExamPapers && Array.isArray(data.savedExamPapers)) {
            setSavedPapers(prev => {
              const combined = [...data.savedExamPapers];
              prev.forEach(p => {
                if (!combined.some(c => c.id === p.id)) {
                  combined.push(p);
                }
              });
              return combined;
            });
          }
        }
      }).catch(err => {
        console.warn("Firestore papers fetch note:", err);
      });
    }
  }, [profile?.uid]);

  // Save paper to collection
  const handleSaveToCollection = async (paper: GeneratedPaper) => {
    const existing = savedPapers.filter(p => p.id !== paper.id);
    const updated = [paper, ...existing];
    setSavedPapers(updated);
    localStorage.setItem(LOCAL_STORAGE_SAVED_PAPERS, JSON.stringify(updated));

    if (profile?.uid) {
      try {
        const userRef = doc(db, "users", profile.uid);
        await setDoc(userRef, { savedExamPapers: updated }, { merge: true });
      } catch (err) {
        console.warn("Failed to sync paper to firestore:", err);
      }
    }
  };

  // Delete paper from collection
  const handleDeleteSavedPaper = async (paperId: string) => {
    const updated = savedPapers.filter(p => p.id !== paperId);
    setSavedPapers(updated);
    localStorage.setItem(LOCAL_STORAGE_SAVED_PAPERS, JSON.stringify(updated));

    if (profile?.uid) {
      try {
        const userRef = doc(db, "users", profile.uid);
        await setDoc(userRef, { savedExamPapers: updated }, { merge: true });
      } catch (err) {
        console.warn("Failed to sync deletion to firestore:", err);
      }
    }
  };

  // When wizard finishes paper generation
  const handlePaperGenerated = (paper: GeneratedPaper) => {
    setActivePaper(paper);
    setCurrentView("paper");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6 pb-12 text-slate-900">
      {/* Sub-navigation Controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setCurrentView("wizard")}
            className={`px-3.5 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentView === "wizard"
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Create Paper
          </button>

          {activePaper && (
            <button
              onClick={() => setCurrentView("paper")}
              className={`px-3.5 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentView === "paper"
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Printer className="w-3.5 h-3.5" /> View Current Paper ({activePaper.totalMarks}M)
            </button>
          )}

          <button
            onClick={() => setCurrentView("saved")}
            className={`px-3.5 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentView === "saved"
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" /> Saved Papers ({savedPapers.length})
          </button>
        </div>

        <button
          onClick={() => setShowAdminModal(true)}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Database className="w-3.5 h-3.5 text-slate-500" /> Question Bank Admin
        </button>
      </div>

      {/* VIEW: 1. Wizard */}
      {currentView === "wizard" && (
        <PaperCreationWizard
          key={bankRefreshTrigger}
          onPaperGenerated={handlePaperGenerated}
          onOpenAdmin={() => setShowAdminModal(true)}
        />
      )}

      {/* VIEW: 2. Printable Generated Paper */}
      {currentView === "paper" && activePaper && (
        <GeneratedPaperView
          paper={activePaper}
          onBack={() => setCurrentView("wizard")}
          onSaveToCollection={handleSaveToCollection}
          isSaved={savedPapers.some(p => p.id === activePaper.id)}
        />
      )}

      {/* VIEW: 3. Saved Papers Collection */}
      {currentView === "saved" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Saved Examination Papers
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Previously generated official board examination papers available for re-examination or printing.
              </p>
            </div>
            <button
              onClick={() => setCurrentView("wizard")}
              className="px-3.5 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Create New Paper
            </button>
          </div>

          {savedPapers.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No saved papers. Assembled papers can be saved here for future practice and printouts.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 bg-white transition-colors flex flex-col justify-between gap-3 text-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                      <span>{paper.subjectCode} • {paper.totalMarks} Marks</span>
                      <span>{new Date(paper.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="font-semibold text-slate-900 text-sm">
                      {paper.title}
                    </h3>

                    <div className="text-slate-600">
                      {paper.allQuestions.length} Questions • {paper.sections.length} Sections • {paper.timeAllowed}
                    </div>

                    <div className="text-slate-500 truncate text-[11px]">
                      Chapters: {paper.selectedChapterTitles.join(", ")}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleDeleteSavedPaper(paper.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete paper"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setActivePaper(paper);
                        setCurrentView("paper");
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Admin Question Bank Modal */}
      {showAdminModal && (
        <QuestionBankAdminModal
          onClose={() => setShowAdminModal(false)}
          onRefreshBank={() => setBankRefreshTrigger(prev => prev + 1)}
        />
      )}
    </div>
  );
}
