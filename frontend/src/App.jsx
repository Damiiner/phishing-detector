import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/predict";

export default function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function check() {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Server error");
      setResult(await res.json());
    } catch {
      setError("Could not reach the API. Is the backend running?");
    }
    setLoading(false);
  }

  const isPhishing = result && result.label === "phishing";

  return (
    <div className="app">
      <h1>Phishing Link Checker</h1>
      <p className="sub">Paste a link to see how suspicious it looks.</p>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && check()}
        placeholder="https://example.com/login"
      />
      <button onClick={check} disabled={loading}>
        {loading ? "Checking..." : "Check"}
      </button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className={"card " + (isPhishing ? "bad" : "good")}>
          <h2>{isPhishing ? "Likely phishing" : "Looks legitimate"}</h2>
          <p>Score: {(result.probability * 100).toFixed(0)}%</p>
          <p className="note">
            This is an estimate from a small model, not a guarantee. Never
            enter passwords on a link you don't trust.
          </p>
        </div>
      )}
    </div>
  );
}