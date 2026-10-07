import React, { useState, useRef, useEffect } from "react";
import { 
  Camera, 
  UploadCloud, 
  X, 
  Sparkles, 
  Send, 
  RefreshCw, 
  AlertCircle, 
  Maximize2, 
  Minimize2, 
  BookOpen, 
  HelpCircle,
  ArrowRight,
  User,
  Bot
} from "lucide-react";
import { StudentProfile } from "../types";

interface AIDoubtSolverTabProps {
  profile: StudentProfile | null;
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function AIDoubtSolverTab({ profile }: AIDoubtSolverTabProps) {
  // Input states
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // base64 data URL
  const [userQuestion, setUserQuestion] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Camera states
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Active chat session states
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);

  // Basic formatting helper for simple markdown tags
  const renderFormattedText = (raw: string) => {
    if (!raw) return null;
    return raw.split("\n").map((line, lIdx) => {
      const trimmed = line.trim();
      const isListItem = trimmed.startsWith("-") || (trimmed.startsWith("*") && !trimmed.startsWith("**"));
      const cleanLine = isListItem ? line.replace(/^([-*])\s*/, "") : line;
      
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts: (string | React.ReactNode)[] = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(cleanLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(cleanLine.substring(lastIndex, match.index));
        }
        parts.push(
          <strong key={match.index} className="font-extrabold text-purple-950">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < cleanLine.length) {
        parts.push(cleanLine.substring(lastIndex));
      }

      const content = parts.length > 0 ? parts : cleanLine;

      if (isListItem) {
        return (
          <li key={lIdx} className="ml-4 list-disc text-slate-700 my-1 font-sans text-xs sm:text-sm leading-relaxed">
            {content}
          </li>
        );
      }

      return (
        <p key={lIdx} className="my-1.5 text-slate-700 font-sans text-xs sm:text-sm leading-relaxed min-h-[1.25rem]">
          {content}
        </p>
      );
    });
  };

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Clean up camera stream when leaving tab or closing camera
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setShowCamera(true);
    setSelectedImage(null); // Clear any uploaded image

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setCameraError("Unable to access camera. Please verify camera permissions in your browser or use the manual file upload option.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && cameraStream) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      // Match dimensions
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setSelectedImage(dataUrl);
        stopCamera();
      }
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (PNG, JPG, JPEG).");
      return;
    }

    setError(null);
    stopCamera();

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setError(null);
  };

  // Submit initial doubt
  const handleSubmitDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      setError("Please upload a screenshot or take a photo with the camera first.");
      return;
    }

    setLoading(true);
    setError(null);

    // Save image to active session
    const imageToSolve = selectedImage;
    const base64Data = imageToSolve.split(",")[1];
    const mimeType = imageToSolve.split(",")[0].match(/:(.*?);/)?.[1] || "image/jpeg";

    try {
      const response = await fetch("/api/doubt-solver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Data,
          mimeType: mimeType,
          userQuestion: userQuestion.trim(),
          profile,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Initialize chat session
      setActiveImage(imageToSolve);
      setMessages([
        {
          role: "user",
          text: userQuestion.trim() || "Analyzed this problem screenshot."
        },
        {
          role: "assistant",
          text: data.text
        }
      ]);
      
      // Clear inputs
      setSelectedImage(null);
      setUserQuestion("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while connecting to the AI Socratic Tutor.");
    } finally {
      setLoading(false);
    }
  };

  // Submit subsequent follow-up chats
  const handleSendFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading || !activeImage) return;

    const userMsgText = inputText.trim();
    setInputText("");
    setError(null);

    // Append user message
    const updatedMessages = [...messages, { role: "user" as const, text: userMsgText }];
    setMessages(updatedMessages);
    setLoading(true);

    // Form history for the API
    // Format: [{ role: 'user' | 'assistant', content: '...' }]
    const history = updatedMessages.map(msg => ({
      role: msg.role,
      content: msg.text
    }));

    // Extract image data
    const base64Data = activeImage.split(",")[1];
    const mimeType = activeImage.split(",")[0].match(/:(.*?);/)?.[1] || "image/jpeg";

    try {
      const response = await fetch("/api/doubt-solver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Data,
          mimeType: mimeType,
          userQuestion: userMsgText,
          history: history.slice(0, -1), // send historical conversation up to this point
          profile,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: "assistant", text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setError("Failed to get follow-up Socratic guidance. Please try resending your question.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewDoubt = () => {
    if (confirm("Are you sure you want to start a new doubt? This will clear the current Socratic conversation history.")) {
      setActiveImage(null);
      setMessages([]);
      setSelectedImage(null);
      setUserQuestion("");
      setError(null);
    }
  };

  // Socratic Intro view
  if (!activeImage) {
    return (
      <div 
        id="doubt-solver-setup-container" 
        className={isMaximized 
          ? "fixed inset-0 z-50 bg-slate-50 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 h-screen w-screen overflow-hidden" 
          : "grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-170px)] min-h-[580px]"}
      >
        {/* Socratic philosophy explanation */}
        <div className={`lg:col-span-4 flex flex-col justify-between h-full space-y-4 ${isMaximized ? "hidden lg:flex" : "flex"}`}>
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 font-display">Socratic AI Doubt Solver</h3>
                <p className="text-[11px] text-slate-400 font-medium">Empathetic Class 10 Academic Support</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-4">
              <div className="bg-slate-50 border-l-4 border-purple-500 rounded-r-lg p-3.5">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" /> Socratic Learning Method
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Instead of simply giving you a quick answer or copying the final answer key, our AI tutor helps you **UNDERSTAND** the logical concepts. 
                </p>
                <p className="text-[11px] leading-relaxed text-slate-600 mt-2 font-medium">
                  We'll help identify core formulas, explain fundamental principles, and guide you step-by-step through solving it yourself!
                </p>
              </div>

              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">How it works:</span>
                <ul className="space-y-2 text-[11px] text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-[9px] font-extrabold shrink-0 mt-0.5">1</span>
                    <span>Upload a screenshot or capture a photo of a textbook problem, diagram, or homework sheet.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-[9px] font-extrabold shrink-0 mt-0.5">2</span>
                    <span>Optionally type which specific step is causing confusion (e.g., "I'm stuck on finding the discriminant").</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-[9px] font-extrabold shrink-0 mt-0.5">3</span>
                    <span>Chat step-by-step to arrive at the solution together, solidifying Class 10 concepts for exam readiness.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4 flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-indigo-500 shrink-0" />
            <div className="space-y-0.5">
              <h5 className="text-xs font-bold text-indigo-900">Need standard study chat?</h5>
              <p className="text-[10px] text-indigo-700 leading-normal">
                If you have conceptual doubts without screenshots, switch to the **AI Study Companion** tab.
              </p>
            </div>
          </div>
        </div>

        {/* Input workspace: Camera / Upload */}
        <div className={`flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm ${
          isMaximized ? "col-span-1 lg:col-span-8" : "lg:col-span-8"
        }`}>
          <div className="bg-slate-50/55 border-b border-slate-100 py-3 px-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-slate-800 font-display">New Doubt Workspace</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase hidden sm:inline">Class 10 Coach</span>
              <button
                id="doubt-solver-setup-maximize-btn"
                type="button"
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-200"
                title={isMaximized ? "Minimize Workspace" : "Maximize Workspace"}
              >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmitDoubt} className="p-6 flex-1 flex flex-col justify-between overflow-y-auto space-y-6">
            <div className="space-y-5">
              {/* Selector buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  id="choose-camera-btn"
                  onClick={startCamera}
                  className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                    showCamera
                      ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-700 hover:border-purple-200 hover:bg-slate-50"
                  }`}
                >
                  <Camera className="w-4 h-4" /> Use Camera
                </button>
                <button
                  type="button"
                  id="choose-upload-btn"
                  onClick={() => {
                    stopCamera();
                    fileInputRef.current?.click();
                  }}
                  className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                    !showCamera && selectedImage
                      ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-700 hover:border-purple-200 hover:bg-slate-50"
                  }`}
                >
                  <UploadCloud className="w-4 h-4" /> Upload Screenshot
                </button>
              </div>

              {/* Error messages */}
              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-lg flex items-center gap-2.5 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Dynamic Action Area */}
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />

                {/* 1. Live Camera Stream */}
                {showCamera && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative aspect-video flex flex-col items-center justify-center group shadow-inner">
                    {cameraError ? (
                      <div className="p-6 text-center space-y-3 max-w-sm">
                        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                        <p className="text-xs font-semibold text-slate-300">{cameraError}</p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[11px] font-bold text-purple-400 underline hover:text-purple-300"
                        >
                          Try manual file upload instead
                        </button>
                      </div>
                    ) : (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          id="doubt-solver-camera-preview"
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay Controls */}
                        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={capturePhoto}
                            id="capture-screenshot-btn"
                            className="bg-white hover:bg-purple-50 text-slate-900 font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs cursor-pointer transition-all hover:scale-105 active:scale-95"
                          >
                            <Camera className="w-4 h-4 text-purple-600" /> Capture Screenshot
                          </button>
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="bg-slate-800/80 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* 2. Drag & Drop manual uploader */}
                {!showCamera && !selectedImage && (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    id="doubt-solver-dropzone"
                    className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[220px] ${
                      isDragActive
                        ? "border-purple-500 bg-purple-50/40"
                        : "border-slate-200 hover:border-purple-200 hover:bg-slate-50/50"
                    }`}
                  >
                    <UploadCloud className="w-10 h-10 text-slate-300 mb-3 group-hover:text-purple-400" />
                    <h5 className="text-xs font-bold text-slate-700 mb-1">
                      Drag & Drop your screenshot here
                    </h5>
                    <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                      Supports PNG, JPG, JPEG. Take a screen grab from your textbook or practice worksheet.
                    </p>
                    <span className="text-[10px] text-purple-600 font-bold mt-3 hover:underline">
                      Or click to browse files
                    </span>
                  </div>
                )}

                {/* 3. Loaded Preview */}
                {!showCamera && selectedImage && (
                  <div className="relative border border-slate-200 rounded-xl overflow-hidden max-h-[300px] flex items-center justify-center bg-slate-50 group">
                    <img
                      src={selectedImage}
                      alt="Doubt Preview"
                      id="loaded-doubt-image-preview"
                      className="max-h-[300px] object-contain w-full"
                    />
                    <button
                      type="button"
                      onClick={clearSelectedImage}
                      className="absolute top-3 right-3 bg-slate-900/85 hover:bg-slate-900 text-white p-1.5 rounded-full shadow transition-all cursor-pointer"
                      title="Clear image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Optional supplementary text instructions */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 font-semibold uppercase block">
                  Add Context or Question (Optional)
                </label>
                <textarea
                  id="doubt-context-textarea"
                  rows={2}
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="e.g., 'I solved step 1 using standard substitution, but why is my sign wrong in step 2?' or 'Help me understand this physics diagram.'"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/25 outline-none resize-none bg-slate-50/50"
                />
              </div>
            </div>

            {/* Launch CTA */}
            <div className="border-t border-slate-100 pt-4 flex justify-end">
              <button
                type="submit"
                id="submit-doubt-solver-btn"
                disabled={loading || !selectedImage}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-xl shadow text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Analysing screenshot...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Help Me Understand <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Active Socratic conversation / Interactive Socratic Chat
  return (
    <div 
      id="doubt-solver-active-container" 
      className={isMaximized 
        ? "fixed inset-0 z-50 bg-slate-50 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 h-screen w-screen overflow-hidden" 
        : "grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-170px)] min-h-[580px]"}
    >
      {/* Left panel: Fixed screenshot context reference */}
      <div className={`lg:col-span-4 flex flex-col justify-between h-full space-y-4 ${isMaximized ? "hidden lg:flex" : "flex"}`}>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex-1 flex flex-col justify-between overflow-hidden">
          <div className="space-y-3 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-mono">Doubt Reference</h3>
              <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Socratic AI active</span>
            </div>
            
            <div className="border border-slate-100 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center p-2 flex-1 relative group">
              <img
                src={activeImage}
                alt="Active Screenshot Doubt"
                id="active-doubt-ref-image"
                className="max-h-[350px] lg:max-h-full object-contain rounded"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between">
            <button
              onClick={handleStartNewDoubt}
              id="doubt-solver-new-btn"
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" /> Solve Another Doubt
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Active chat flow */}
      <div className={`flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm ${
        isMaximized ? "col-span-1 lg:col-span-8" : "lg:col-span-8"
      }`}>
        {/* Status header */}
        <div className="bg-slate-50/55 border-b border-slate-100 py-3 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-1 shrink-0" />
            <span className="text-xs font-bold text-slate-800 font-display">Socratic AI Tutor</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase hidden sm:inline">Active Problem Guidance</span>
            <button
              id="doubt-solver-maximize-btn"
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-200"
              title={isMaximized ? "Minimize View" : "Maximize View"}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Conversation messages scroll area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/20">
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={index}
                className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  isUser ? "bg-slate-100 text-slate-600" : "bg-purple-50 text-purple-600 border border-purple-100"
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className={`text-[10px] font-mono text-slate-400 font-bold ${isUser ? "text-right" : ""}`}>
                    {isUser ? "You" : "NCERT Socratic Tutor"}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                    isUser
                      ? "bg-purple-600 text-white rounded-tr-none"
                      : "bg-white border border-slate-150 text-slate-800 rounded-tl-none"
                  }`}>
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div className="space-y-1">
                        {renderFormattedText(msg.text)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-slate-400 font-bold">NCERT Socratic Tutor</div>
                <div className="bg-white border border-slate-150 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Thinking Socratic step...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input prompt bar */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <form onSubmit={handleSendFollowUp} className="flex gap-2.5 items-center">
            <input
              id="doubt-solver-chat-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question or type your attempt at the next step..."
              disabled={loading}
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/25 outline-none bg-slate-50/50 disabled:opacity-50"
            />
            <button
              id="doubt-solver-send-btn"
              type="submit"
              disabled={loading || !inputText.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white p-2.5 rounded-xl shadow transition-all cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2.5 px-1">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" /> Focus area: conceptual understanding & Class 10 board goals
            </span>
            {isMaximized && (
              <button
                onClick={handleStartNewDoubt}
                className="text-[10px] text-purple-600 hover:underline font-bold"
              >
                Solve another doubt
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
