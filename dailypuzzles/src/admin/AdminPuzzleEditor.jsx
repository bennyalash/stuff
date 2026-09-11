import React from "react";

export default function AdminPuzzleEditor({
  selectedDate,
  setSelectedDate,
  editorRows,
  setEditorRows,
  editorCols,
  setEditorCols,
  difficulty,
  setDifficulty,
  onResize,
  onSave,
  saving,
}) {
  return (
    <div className="admin-editor-bar">
      <div className="admin-section">
        <label>
          <strong>Puzzle Date:</strong>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
        <label>
          <strong>Difficulty:</strong>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>
      </div>

      <div className="admin-section">
        <label>
          Rows:
          <input
            type="number"
            min="1"
            max="20"
            value={editorRows}
            onChange={(e) => setEditorRows(e.target.value)}
          />
        </label>
        <label>
          Cols:
          <input
            type="number"
            min="1"
            max="20"
            value={editorCols}
            onChange={(e) => setEditorCols(e.target.value)}
          />
        </label>
        <button onClick={onResize}>Resize Grid</button>
      </div>

      <div className="admin-section">
        <button className="save-btn" onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save Puzzle to DB"}
        </button>
      </div>
    </div>
  );
}