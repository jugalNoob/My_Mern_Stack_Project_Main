
import { useState } from "react";
import axios from "axios";
import "./AiAgent.css";

function AiAgent() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askAI = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnswer("");
      setSource("");

      const res = await axios.get(
        "http://localhost:9000/ai",
        {
          params: {
            question: question.trim(),
          },
        }
      );

      setAnswer(res.data.answer);
      setSource(res.data.source);

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-container">
      <div className="ai-card">

        <h1>🤖 AI Agent</h1>

        <p className="subtitle">
          Ask the AI Agent about users
        </p>

        <form onSubmit={askAI} className="ai-form">

          <textarea
            className="question-input"
            placeholder="Ask something like: Get information about Isobel"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows="6"
          />

          <button
            type="submit"
            className="ask-button"
            disabled={loading}
          >
            {loading ? "Thinking..." : "Ask AI →"}
          </button>

        </form>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading">
            🤖 AI Agent is searching MongoDB...
          </div>
        )}

        {answer && (
          <div className="answer-box">

            <div className="answer-header">
              <h2>AI Response</h2>

              <span className={`source ${source}`}>
                {source}
              </span>
            </div>

            <div className="answer">
              {answer}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default AiAgent;
