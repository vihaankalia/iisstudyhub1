import jsPDF from "jspdf";
import { GeneratedPaper, SourceQuestion } from "../types/examPaper";

/**
 * Normalizes text for clean, reliable PDF rendering in standard PDF fonts.
 * Converts unicode math superscripts, arrows, and quotes into clean readable representations.
 */
export interface PdfGenerateOptions {
  includeSolutions?: boolean;
  schoolName?: string;
  examTitle?: string;
}

/**
 * Normalizes text for clean, reliable PDF rendering in standard PDF fonts.
 * Converts unicode math superscripts, arrows, and quotes into clean readable representations.
 */
export function sanitizePdfText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/–|—/g, "-")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/⁴/g, "^4")
    .replace(/½/g, "1/2")
    .replace(/¼/g, "1/4")
    .replace(/¾/g, "3/4")
    .replace(/×/g, " x ")
    .replace(/÷/g, " / ")
    .replace(/±/g, "+/-")
    .replace(/≠/g, "!=")
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=")
    .replace(/°/g, " deg")
    .replace(/π/g, "pi")
    .replace(/θ/g, "theta")
    .replace(/√/g, "sqrt")
    .replace(/Δ|∆/g, "Delta ")
    .replace(/∠/g, "angle ")
    .replace(/Ω|Ω/g, " ohm")
    .replace(/µ/g, "u")
    .replace(/α/g, "alpha")
    .replace(/β/g, "beta")
    .replace(/γ/g, "gamma")
    .replace(/\r\n/g, "\n");
}

/**
 * Generates an authentic, professional Class 10 CBSE examination paper PDF.
 * Formatted with official board headers, candidate roll-number grid,
 * general instructions, clean section divisions, question marks,
 * page numbers, and a complete Sources of Questions provenance section.
 */
export function generatePaperPdf(paper: GeneratedPaper, options: PdfGenerateOptions = {}): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const leftMargin = 16;
  const rightMargin = 16;
  const contentWidth = pageWidth - leftMargin - rightMargin; // 178 mm
  const rightX = pageWidth - rightMargin; // 194 mm
  const bottomMargin = 20;

  let y = 16;

  // Helper to add a new page with running header
  const addNewPage = () => {
    doc.addPage();
    y = 16;

    // Running header on continuation pages
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);
    const headerTitle = sanitizePdfText(options.schoolName || "CBSE CLASS 10 BOARD EXAMINATION");
    const subTitleShort = sanitizePdfText(paper.title);
    doc.text(`${headerTitle} - ${subTitleShort}`.substring(0, 80), leftMargin, y);
    doc.text(`Q.P. Code: ${paper.subjectCode}/1`, rightX, y, { align: "right" });
    
    y += 2.5;
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.line(leftMargin, y, rightX, y);
    y += 8;
  };

  // Check if we need a page break before printing an element of height h
  const ensureSpace = (requiredHeight: number) => {
    if (y + requiredHeight > pageHeight - bottomMargin) {
      addNewPage();
    }
  };

  // ============================================================
  // PAGE 1: OFFICIAL CBSE EXAMINATION HEADER
  // ============================================================

  // Roll Number Box on Left & Subject Code on Right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text("Roll No.", leftMargin, y + 4);

  // Draw roll number individual boxes (10 digits)
  const boxStartX = leftMargin + 16;
  const boxW = 5.2;
  const boxH = 5.5;
  doc.setLineWidth(0.3);
  doc.setDrawColor(0, 0, 0);
  for (let b = 0; b < 10; b++) {
    doc.rect(boxStartX + (b * (boxW + 1)), y, boxW, boxH);
  }

  // Series and QP Code on Right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(`Series: CBSE/2025`, rightX, y + 2, { align: "right" });
  doc.text(`Q.P. Code: ${paper.subjectCode}/1`, rightX, y + 6, { align: "right" });

  y += 9.5;

  // Candidate Name line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);
  doc.text("Candidate's Name: .....................................................................................................", leftMargin, y);

  y += 7;

  // Board Header / School Title Centered
  const primaryTitle = sanitizePdfText(options.schoolName || "CENTRAL BOARD OF SECONDARY EDUCATION").toUpperCase();
  const secondaryTitle = sanitizePdfText(options.examTitle || "SECONDARY SCHOOL EXAMINATION (CLASS X)").toUpperCase();
  const subjectDisplay = sanitizePdfText(
    paper.subjectNames.length > 0 
      ? `${paper.subjectNames.join(" & ").toUpperCase()} (THEORY)`
      : paper.title.toUpperCase()
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text(primaryTitle, pageWidth / 2, y, { align: "center" });

  y += 5.5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(40, 40, 40);
  doc.text(secondaryTitle, pageWidth / 2, y, { align: "center" });

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(subjectDisplay, pageWidth / 2, y, { align: "center" });

  y += 4;
  // Double horizontal divider line framing the header
  doc.setLineWidth(0.6);
  doc.setDrawColor(0, 0, 0);
  doc.line(leftMargin, y, rightX, y);
  y += 1.2;
  doc.setLineWidth(0.2);
  doc.line(leftMargin, y, rightX, y);

  y += 5;

  // Time Allowed & Maximum Marks
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(0, 0, 0);
  doc.text(`Time Allowed: ${paper.timeAllowed}`, leftMargin, y);
  doc.text(`Maximum Marks: ${paper.totalMarks}`, rightX, y, { align: "right" });

  y += 2.5;
  doc.setLineWidth(0.6);
  doc.line(leftMargin, y, rightX, y);

  y += 6;

  // ============================================================
  // GENERAL INSTRUCTIONS
  // ============================================================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text("General Instructions:", leftMargin, y);
  y += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 30, 30);

  // Dynamic Instructions based on paper composition
  const secA = paper.allQuestions.filter(q => q.marks === 1);
  const secB = paper.allQuestions.filter(q => q.marks === 2 && q.questionType !== "map-based");
  const secC = paper.allQuestions.filter(q => q.marks === 3);
  const secD = paper.allQuestions.filter(q => q.marks === 5);
  const secE = paper.allQuestions.filter(q => q.marks === 4 || q.questionType === "case-based" || q.questionType === "source-based");

  const dynamicInstructions = [
    `1. This question paper contains ${paper.allQuestions.length} questions in ${paper.sections.length} sections. All questions are compulsory.`,
    secA.length > 0 ? `2. Section A comprises ${secA.length} Multiple Choice Questions (MCQs) carrying 1 mark each.` : "",
    secB.length > 0 ? `3. Section B comprises ${secB.length} Very Short Answer (VSA) type questions carrying 2 marks each.` : "",
    secC.length > 0 ? `4. Section C comprises ${secC.length} Short Answer (SA) type questions carrying 3 marks each.` : "",
    secD.length > 0 ? `5. Section D comprises ${secD.length} Long Answer (LA) type questions carrying 5 marks each.` : "",
    secE.length > 0 ? `6. Section E comprises ${secE.length} Case-based/source-based integrated assessment units carrying 4 marks each with sub-parts.` : "",
    "7. Internal choice has been preserved where specified in the original CBSE board questions.",
    "8. Use of calculators or electronic calculating gadgets is strictly prohibited.",
    "9. Wherever necessary, neat and labeled diagrams should be drawn."
  ].filter(Boolean);

  const instructions = paper.generalInstructions && paper.generalInstructions.length > 0 
    ? paper.generalInstructions
    : dynamicInstructions;

  instructions.forEach((inst) => {
    const cleanInst = sanitizePdfText(inst.replace(/^\d+\.\s*/, ""));
    const bullet = inst.match(/^\d+\./)?.[0] || "-";
    const textLines = doc.splitTextToSize(`${bullet} ${cleanInst}`, contentWidth - 4);
    
    ensureSpace(textLines.length * 3.8 + 1);
    doc.text(textLines, leftMargin + 2, y);
    y += textLines.length * 3.8 + 1;
  });

  y += 3;
  doc.setLineWidth(0.2);
  doc.setDrawColor(180, 180, 180);
  doc.line(leftMargin, y, rightX, y);
  y += 6;

  // ============================================================
  // SECTIONS & QUESTIONS
  // ============================================================
  let questionCounter = 1;

  paper.sections.forEach((section) => {
    // Section Header Box
    ensureSpace(16);
    
    doc.setFillColor(245, 245, 245);
    doc.rect(leftMargin, y, contentWidth, 7, "F");
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(leftMargin, y, contentWidth, 7, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(0, 0, 0);
    const cleanSectionTitle = sanitizePdfText(section.sectionTitle);
    doc.text(cleanSectionTitle, leftMargin + 3, y + 4.8);
    doc.text(`[${section.totalSectionMarks} Marks]`, rightX - 3, y + 4.8, { align: "right" });

    y += 10;

    // Section Instructions
    if (section.instructions) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(80, 80, 80);
      const sInst = sanitizePdfText(section.instructions);
      const instLines = doc.splitTextToSize(sInst, contentWidth);
      doc.text(instLines, leftMargin, y);
      y += instLines.length * 3.8 + 3;
    }

    // Questions in this section
    section.questions.forEach((question) => {
      const qNum = questionCounter++;
      const marksText = `[${question.marks}]`;
      const cleanQText = sanitizePdfText(question.questionText);

      // Estimate question height
      const qTextLines = doc.splitTextToSize(cleanQText, contentWidth - 22);
      let estimatedHeight = qTextLines.length * 4.2 + 8;
      
      if (question.casePassage) {
        estimatedHeight += 24;
      }
      if (question.options && question.options.length > 0) {
        estimatedHeight += (question.options.length > 2 ? 14 : 8);
      }

      ensureSpace(estimatedHeight);

      // Render Case Passage if present
      if (question.casePassage) {
        doc.setFillColor(250, 250, 250);
        const cleanPassage = sanitizePdfText(question.casePassage);
        const passageLines = doc.splitTextToSize(cleanPassage, contentWidth - 8);
        const passageBoxHeight = passageLines.length * 3.8 + 8;

        ensureSpace(passageBoxHeight + 6);
        doc.rect(leftMargin, y, contentWidth, passageBoxHeight, "F");
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.2);
        doc.rect(leftMargin, y, contentWidth, passageBoxHeight, "S");

        doc.setFont("helvetica", "bolditalic");
        doc.setFontSize(8);
        doc.setTextColor(40, 40, 40);
        doc.text("Read the following text and answer the questions that follow:", leftMargin + 3, y + 4.5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(30, 30, 30);
        doc.text(passageLines, leftMargin + 3, y + 8.5);

        y += passageBoxHeight + 4;
      }

      // Render Diagram / Figure Box if present
      if (question.diagramDescription) {
        const cleanDiag = sanitizePdfText(question.diagramDescription);
        const diagLines = doc.splitTextToSize(`[Figure / Diagram Specification]: ${cleanDiag}`, contentWidth - 28);
        const diagBoxH = diagLines.length * 3.8 + 6;
        ensureSpace(diagBoxH + 4);
        
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(leftMargin + 8, y, contentWidth - 22, diagBoxH, 1, 1, "F");
        doc.setDrawColor(200, 210, 220);
        doc.setLineWidth(0.2);
        doc.roundedRect(leftMargin + 8, y, contentWidth - 22, diagBoxH, 1, 1, "S");
        
        doc.setFont("helvetica", "bolditalic");
        doc.setFontSize(8);
        doc.setTextColor(50, 60, 70);
        doc.text(diagLines, leftMargin + 12, y + 4.5);
        
        y += diagBoxH + 3;
      }

      // Question Number
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(0, 0, 0);
      doc.text(`${qNum}.`, leftMargin, y);

      // Marks indicator aligned to right
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      doc.text(marksText, rightX, y, { align: "right" });

      // Question Text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      const textX = leftMargin + 8;
      const textMaxWidth = contentWidth - 22;
      const formattedQTextLines = doc.splitTextToSize(cleanQText, textMaxWidth);
      doc.text(formattedQTextLines, textX, y);

      y += formattedQTextLines.length * 4.2 + 2;

      // MCQ Options Formatting (Smart layout: vertical if long, 2 columns if short)
      if (question.options && question.options.length > 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(20, 20, 20);

        const hasLongOption = question.options.some(opt => opt.length > 35 || opt.includes("\n"));

        if (hasLongOption) {
          question.options.forEach((opt, idx) => {
            const optLetter = `(${String.fromCharCode(65 + idx)})`;
            const cleanOpt = sanitizePdfText(opt);
            const optLines = doc.splitTextToSize(`${optLetter}  ${cleanOpt}`, contentWidth - 26);
            ensureSpace(optLines.length * 4 + 1.5);
            doc.text(optLines, leftMargin + 10, y);
            y += optLines.length * 4 + 1.5;
          });
        } else {
          const col1X = leftMargin + 10;
          const col2X = leftMargin + 95;
          const colW = 80;

          for (let i = 0; i < question.options.length; i += 2) {
            const optLetter1 = `(${String.fromCharCode(65 + i)})`;
            const optText1 = sanitizePdfText(question.options[i]);
            const lines1 = doc.splitTextToSize(`${optLetter1} ${optText1}`, colW);

            let lines2: string[] = [];
            if (i + 1 < question.options.length) {
              const optLetter2 = `(${String.fromCharCode(65 + i + 1)})`;
              const optText2 = sanitizePdfText(question.options[i + 1]);
              lines2 = doc.splitTextToSize(`${optLetter2} ${optText2}`, colW);
            }

            const rowHeight = Math.max(lines1.length, lines2.length) * 4 + 1.5;
            ensureSpace(rowHeight);

            doc.text(lines1, col1X, y);
            if (lines2.length > 0) {
              doc.text(lines2, col2X, y);
            }

            y += rowHeight;
          }
        }
      }

      // Spacing between questions
      y += 4;
      doc.setDrawColor(235, 235, 235);
      doc.setLineWidth(0.2);
      doc.line(leftMargin + 8, y - 2, rightX, y - 2);
    });

    y += 4;
  });

  // ============================================================
  // SOURCES OF QUESTIONS SECTION (MANDATORY REQUIREMENT)
  // ============================================================
  ensureSpace(45);

  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 0, 0);
  doc.line(leftMargin, y, rightX, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(0, 0, 0);
  doc.text("SOURCES OF QUESTIONS", leftMargin, y);
  y += 4.5;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text(
    "Every question in this paper has been sourced verbatim from official CBSE Board Examination Papers and Sample Question Papers:",
    leftMargin,
    y
  );
  y += 5.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(40, 40, 40);

  let srcIdx = 1;
  paper.allQuestions.forEach((q) => {
    const num = srcIdx++;
    const setLabel = q.setCode ? `, ${q.setCode}` : "";
    const qNumLabel = q.originalQuestionNumber ? `, ${q.originalQuestionNumber}` : "";
    const sourceString = `Q${num}. [CBSE ${q.year}${setLabel}${qNumLabel}] ${q.sourceTitle} -- Chapter: ${q.chapterTitle} (${q.marks}M)`;
    const cleanSrc = sanitizePdfText(sourceString);
    const srcLines = doc.splitTextToSize(cleanSrc, contentWidth);

    ensureSpace(srcLines.length * 3.4 + 1.5);
    doc.text(srcLines, leftMargin, y);
    y += srcLines.length * 3.4 + 1.5;
  });

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("*** END OF QUESTION PAPER ***", pageWidth / 2, y, { align: "center" });

  // ============================================================
  // OPTIONAL MARKING SCHEME & OFFICIAL SOLUTIONS APPENDIX
  // ============================================================
  if (options.includeSolutions) {
    addNewPage();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("OFFICIAL MARKING SCHEME & STEP-BY-STEP SOLUTIONS", pageWidth / 2, y, { align: "center" });
    y += 5;

    doc.setLineWidth(0.4);
    doc.line(leftMargin, y, rightX, y);
    y += 6;

    let solCounter = 1;
    paper.allQuestions.forEach((q) => {
      const qNum = solCounter++;
      let solText = q.officialSolution || "Official solution not available in archive.";
      if (q.correctOptionIndex !== undefined) {
        const correctLetter = String.fromCharCode(65 + q.correctOptionIndex);
        solText = `Correct Answer: (${correctLetter})\n${solText}`;
      }

      const cleanSol = sanitizePdfText(solText);
      const solLines = doc.splitTextToSize(cleanSol, contentWidth - 10);
      const blockHeight = solLines.length * 3.8 + 10;

      ensureSpace(blockHeight);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(0, 0, 0);
      doc.text(`Q${qNum} Solution [${q.marks} Mark${q.marks > 1 ? "s" : ""}]:`, leftMargin, y);
      y += 4.5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(40, 40, 40);
      doc.text(solLines, leftMargin + 4, y);
      y += solLines.length * 3.8 + 4;

      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.2);
      doc.line(leftMargin, y - 2, rightX, y - 2);
    });
  }

  // ============================================================
  // PAGE NUMBERS & FOOTERS ON ALL PAGES
  // ============================================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    
    // Left: Exam tag
    doc.text("Class X Examination", leftMargin, pageHeight - 10);

    // Center: Page number
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });

    // Right: P.T.O. on all pages before the final page
    if (i < totalPages) {
      doc.setFont("helvetica", "bold");
      doc.text("P.T.O.", rightX, pageHeight - 10, { align: "right" });
    }
  }

  // Generate safe filename and trigger download in browser
  const rawSubject = (paper.subjectNames && paper.subjectNames[0]) || paper.title || "CBSE_Class_10";
  const cleanSubjectName = rawSubject.replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `${cleanSubjectName}_${paper.totalMarks}M_Sample_Paper.pdf`;

  if (typeof window !== "undefined") {
    doc.save(fileName);
  }

  return doc;
}
