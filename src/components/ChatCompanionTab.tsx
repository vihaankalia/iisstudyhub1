import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, StudentProfile } from "../types";
import { 
  Sparkles, 
  Send, 
  Bookmark, 
  Bot, 
  HelpCircle, 
  Lightbulb, 
  ChevronRight, 
  User,
  Maximize2,
  Minimize2
} from "lucide-react";

interface ChatCompanionTabProps {
  profile: StudentProfile;
}

export default function ChatCompanionTab({ profile }: ChatCompanionTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      text: `Hello, **${profile.name}**! I am your AI NCERT Coach. 
      
I've personalized my tutoring based on your **${profile.learningPace.toUpperCase()}** learning pace. 

${profile.weakAreas.length > 0 
  ? `I noticed you're currently working to improve in: **${profile.weakAreas.join(", ")}**. How can I help clarify these concepts today?` 
  : "What Class 10 board topic shall we tackle first? Science, Math, History, or Literature?"}`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Suggested shortcut prompt chips
  const suggestedPrompts = [
    { label: "Give Math Quiz", prompt: "Can you give me a Class 10 trigonometry concept check question and wait for my answer?" },
    { label: "Analogy for pH Scale", prompt: "Explain the pH scale and strong vs weak acids using a simple real-life analogy." },
    { label: "Satyagraha Summary", prompt: "Explain the main Satyagraha movements led by Mahatma Gandhi in India between 1915 and 1918." },
    { label: "What are my Weak Areas?", prompt: `How can I improve on my weak topics: ${profile.weakAreas.join(", ") || "none yet, help me test"}` }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Hook to consume prefilled AI prompt from dashboard click-through
  useEffect(() => {
    const prefilled = localStorage.getItem("iis_prefilled_chat_prompt");
    if (prefilled) {
      localStorage.removeItem("iis_prefilled_chat_prompt");
      const timer = setTimeout(() => {
        handleSendMessage(prefilled);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-10), // Pass recent conversation context
          profile: {
            name: profile.name,
            learningPace: profile.learningPace,
            weakAreas: profile.weakAreas,
            strengthAreas: profile.strengthAreas
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Chat service encountered a server error.");
      }

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: "assistant",
        text: data.text || "I was unable to formulate a response. Please let me try again.",
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: "assistant",
        text: error.message && error.message.includes("GEMINI_API_KEY") 
          ? error.message 
          : `I'm experiencing connectivity issues with the Board Knowledge Base right now (${error.message || "Unknown error"}). Please verify your internet connection or retry in a few moments.`,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Basic formatting helper for simple markdown tags
  const renderFormattedText = (raw: string) => {
    return raw.split("\n").map((line, lIdx) => {
      const trimmed = line.trim();
      const isListItem = trimmed.startsWith("-") || (trimmed.startsWith("*") && !trimmed.startsWith("**"));
      const cleanLine = isListItem ? line.replace(/^([-*])\s*/, "") : line;
      
      // Basic bold formatting regex
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts: (string | React.ReactNode)[] = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(cleanLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(cleanLine.substring(lastIndex, match.index));
        }
        parts.push(
          <strong key={match.index} className="font-extrabold text-blue-950">
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
          <li key={lIdx} className="ml-4 list-disc text-slate-700 my-1 font-sans text-sm leading-relaxed">
            {content}
          </li>
        );
      }

      return (
        <p key={lIdx} className="my-1.5 text-slate-700 font-sans text-sm leading-relaxed min-h-[1.25rem]">
          {content}
        </p>
      );
    });
  };

  return (
    <div 
      id="companion-chat-tab-container" 
      className={isMaximized 
        ? "fixed inset-0 z-50 bg-slate-50 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 h-screen w-screen overflow-hidden" 
        : "grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-170px)] min-h-[580px]"}
    >
      {/* Left sidebar: Student contextual info */}
      <div className={`lg:col-span-4 space-y-4 flex flex-col justify-between h-full ${isMaximized ? "hidden lg:flex" : "flex"}`}>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-mono block uppercase">Active Profile Coach</span>
              <span className="text-sm font-bold text-slate-800 font-display block">NCERT Smart Tutor</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Cognitive Pace</span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 py-1 px-3 rounded-full mt-1.5 inline-block uppercase font-mono">
                {profile.learningPace} Pace
              </span>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                {profile.learningPace === "slow" && "Explanations focus on step-by-step simple textbook analogies."}
                {profile.learningPace === "medium" && "Balanced notes review combined with key board solutions."}
                {profile.learningPace === "fast" && "Hyper-concise formulae summaries, equation shortcuts & complex questions."}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Weak Topics Tracker</span>
              {profile.weakAreas.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-2">
                  {profile.weakAreas.map((topic, idx) => (
                    <span key={idx} className="text-[10px] bg-rose-50 text-rose-700 font-bold py-1 px-2.5 rounded-lg border border-rose-100">
                      {topic}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs italic text-slate-400 block mt-1.5 font-medium">No weakness registered yet.</span>
              )}
            </div>
          </div>
        </div>

        {/* Prompt shortcuts desktop */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner space-y-2 lg:block hidden">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
            Study shortcuts:
          </span>
          {suggestedPrompts.map((chip, idx) => (
            <button
              key={idx}
              id={`shortcut-prompt-${idx}`}
              onClick={() => handleSendMessage(chip.prompt)}
              className="w-full text-left bg-white hover:bg-blue-50/50 p-2.5 rounded-lg border border-slate-200/60 hover:border-blue-300 transition-all cursor-pointer text-xs font-semibold text-slate-700 flex items-center justify-between"
            >
              <span>{chip.label}</span>
              <ChevronRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Active chat flow */}
      <div className={`flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm ${
        isMaximized ? "col-span-1 lg:col-span-8" : "lg:col-span-8"
      }`}>
        {/* Tutor status header */}
        <div className="bg-slate-50/55 border-b border-slate-100 py-3 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1 shrink-0" />
            <span className="text-xs font-bold text-slate-800 font-display">Tutor Online</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase hidden sm:inline">Class 10 Coach</span>
            <button
              id="chat-toggle-maximize-btn"
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-200"
              title={isMaximized ? "Minimize Chat" : "Maximize Chat"}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Message body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, idx) => {
            const isBot = msg.role === "assistant";
            return (
              <div
                key={msg.id || idx}
                id={`chat-message-${idx}`}
                className={`flex gap-3.5 ${isBot ? "justify-start" : "justify-end"}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm shadow-blue-600/5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-xl p-4 shadow-sm relative ${
                  isBot 
                    ? "bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none" 
                    : "bg-blue-600 text-white rounded-tr-none"
                }`}>
                  <div className="space-y-1">
                    {isBot ? renderFormattedText(msg.text) : (
                      <p className="text-sm font-sans leading-relaxed">{msg.text}</p>
                    )}
                  </div>
                  <span className={`text-[9px] block mt-1.5 text-right font-mono ${
                    isBot ? "text-slate-400" : "text-white/60"
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm shadow-blue-600/5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3.5 justify-start" id="chat-loading-indicator">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 animate-bounce">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 text-slate-500 rounded-xl p-4 rounded-tl-none border border-slate-100 flex items-center gap-1.5 shadow-sm">
                <span className="text-xs font-semibold font-sans">Formulating board analogies</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300" />
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts mobile */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex gap-2 overflow-x-auto lg:hidden">
          {suggestedPrompts.slice(0, 3).map((chip, idx) => (
            <button
              key={idx}
              id={`shortcut-prompt-mobile-${idx}`}
              onClick={() => handleSendMessage(chip.prompt)}
              className="bg-white hover:bg-slate-100 py-1.5 px-3 rounded-full border border-slate-200 shadow-sm font-semibold shrink-0 cursor-pointer text-[10px] text-slate-600"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="border-t border-slate-100 p-4 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex items-center gap-3 bg-slate-50 border border-slate-200 focus-within:border-blue-500 focus-within:bg-white rounded-xl py-1.5 pl-4 pr-1.5 shadow-inner transition-all duration-150"
          >
            <input
              id="chat-input-field"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask anything about Class 10 Board exam... (${profile.learningPace} speed)`}
              className="flex-1 bg-transparent border-none text-slate-950 font-sans text-sm focus:outline-none placeholder-slate-400"
            />
            <button
              id="chat-submit-btn"
              type="submit"
              disabled={!inputText.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all shrink-0"
            >
              <Send className="w-4 h-4 fill-white shrink-0" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
