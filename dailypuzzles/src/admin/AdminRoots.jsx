import { useState } from "react";
import { savePuzzleByDate } from "../components/FetchPuzzle.jsx";

export default function AdminRoots() {
  const [gameType, setGameType] = useState("Latter");
  const [dateStr, setDateStr] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [difficulty, setDifficulty] = useState("Medium");
  
  // Game-specific fields (e.g., Latter expects startWord and endWord)
  const [startWord, setStartWord] = useState("");
  const [endWord, setEndWord] = useState("");

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    // Build the data object based on the game requirements
    const dataObj = {
      startWord: startWord.trim().toUpperCase(),
      endWord: endWord.trim().toUpperCase(),
    };

    const res = await savePuzzleByDate(gameType, dateStr, dataObj, difficulty);

    if (res.success) {
      setStatus(`Puzzle saved successfully for ${dateStr}!`);
      setStartWord("");
      setEndWord("");
    } else {
      setStatus(`Failed to save puzzle: ${res.error?.message || "Unknown error"}`);
    }
    setLoading(false);
  }

  return (
    <div className="admin-puzzle-form" style={{ maxWidth: "400px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Add New Roots Puzzle</h2>
      <form onSubmit={handleSubmit}>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Date</label>
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Difficulty</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ width: "100%", padding: "8px" }}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {gameType === "Latter" && (
          <>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>Start Word</label>
              <input
                type="text"
                value={startWord}
                onChange={(e) => setStartWord(e.target.value)}
                placeholder="e.g., BEAN"
                required
                style={{ width: "100%", padding: "8px" }}
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>End Word</label>
              <input
                type="text"
                value={endWord}
                onChange={(e) => setEndWord(e.target.value)}
                placeholder="e.g., CART"
                required
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
          </>
        )}

        <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px", cursor: "pointer" }}>
          {loading ? "Saving..." : "Save Puzzle"}
        </button>
      </form>

      {status && <p style={{ marginTop: "12px", fontWeight: "bold" }}>{status}</p>}
    </div>
  );
}