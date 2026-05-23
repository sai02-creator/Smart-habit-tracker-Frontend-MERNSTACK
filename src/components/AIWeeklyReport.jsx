import { useState } from "react";
import { Sparkles, ChevronDown, RefreshCw } from "lucide-react";
import api from "../api/axios.js";
import Markdown from "./Markdown.jsx";

export default function AIWeeklyReport() {
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedAt, setGeneratedAt] = useState(null);

  const generate = async () => {
    setLoading(true);

    try {
      const res = await api.post("/ai/weekly-report");

      setContent(res.data.content);
      setGeneratedAt(new Date());
      setExpanded(true);
    } catch (e) {
      setContent("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-5 relative overflow-hidden">
      {/* PREMIUM SAAS GLOW */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(37,99,235,0.18), rgba(124,58,237,0.12), transparent 65%)",
        }}
      />

      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 text-left relative"
      >
        {/* ICON */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
          <Sparkles size={18} />
        </div>

        {/* TEXT */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">
            AI Weekly Report
          </div>

          <div className="text-xs text-muted">
            {content
              ? `Generated ${
                  generatedAt
                    ? generatedAt.toLocaleTimeString()
                    : "now"
                }`
              : "See patterns and personalised encouragement from the past 7 days"}
          </div>
        </div>

        {/* CHEVRON */}
        <ChevronDown
          size={18}
          className={`text-faint transition ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* CONTENT */}
      {expanded && (
        <div className="mt-4 animate-slide-up relative">
          {!content && (
            <button
              onClick={generate}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <RefreshCw
                    size={14}
                    className="animate-spin"
                  />

                  Analysing your week...
                </>
              ) : (
                <>
                  <Sparkles size={14} />

                  Generate weekly report
                </>
              )}
            </button>
          )}

          {content && (
            <>
              <Markdown className="mt-1 glass rounded-xl p-4 text-sm">
                {content}
              </Markdown>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={generate}
                  disabled={loading}
                  className="btn-ghost"
                >
                  <RefreshCw
                    size={14}
                    className={loading ? "animate-spin" : ""}
                  />

                  Regenerate
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}