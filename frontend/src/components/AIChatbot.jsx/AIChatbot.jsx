import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MessageSquare, Send, X } from "lucide-react";

const API_URL = "http://localhost:8000/api/ai-chat";

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { role: "ai", text: "Hi 👋 I’m your AI Study Mentor. Ask me anything about your studies!" }
  ]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // 🔽 Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "🔐 Please login first to use the AI Study Mentor." },
      ]);
      return;
    }

    const userMsg = { role: "user", text: message };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        API_URL,
        {
          message: userMsg.text,
          context: {
            hours: 3,
            sleep: 6,
            previous: 45,
            predicted: 42,
            category: "Average",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const aiMsg = { role: "ai", text: res.data.reply };
      setChat((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI error:", error.response?.data || error.message);
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ AI server error. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:scale-105 transition z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-[360px] h-[500px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden z-50">

          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-primary text-white">
            <h3 className="font-semibold">AI Study Mentor</h3>
            <button onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3 bg-slate-50">
            {chat.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] px-4 py-2 rounded-xl text-sm leading-relaxed break-words whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-white ml-auto"
                    : "bg-white text-slate-800 border"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="bg-white text-slate-800 px-4 py-2 rounded-xl text-sm w-fit border">
                Thinking...
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t bg-white">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about your study plan..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button
              onClick={sendMessage}
              className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};

export default AIChatbot;
