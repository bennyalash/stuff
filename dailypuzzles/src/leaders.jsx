import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLeaderboard } from "./components/FetchPuzzle.jsx";
import { ChevronLeft } from "lucide-react";
import "./styles/help.css";

export default function Leaders() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const username = localStorage.getItem("username");

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await fetchLeaderboard();
        const sorted = [...data].sort((a, b) => a.timeTaken - b.timeTaken);
        setLeaders(sorted);
      } catch (err) {
        console.error(err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="leader-empty">
          <h3>Loading leaderboard…</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  const leadersByType = (type) =>
    leaders.filter(entry => entry.type === type);

  const bridges = leadersByType("Bridges");
  const roots = leadersByType("Latter");
  const cipher = leadersByType("Cipher");

  const hasAnyCompletions =
    bridges.length > 0 || roots.length > 0 || cipher.length > 0;

  return (
    <div className="page">
      <div className="nav" style={{ height: "50px" }}>
        <div className="far-left far">
          <Link to="/" style={{ marginRight: "1rem" }}>
            <ChevronLeft />
          </Link>
        </div>
        <div className="far-right far">
          <h3>Leaderboard</h3>
        </div>
      </div>

      <br />

      {!hasAnyCompletions && (
        <div className="leader-empty">
          <h3>No puzzles have been completed today</h3>
        </div>
      )}

      {hasAnyCompletions && (
        <>
          <LeaderGroup title="Bridges" data={bridges} username={username} />
          <LeaderGroup title="Roots" data={roots} username={username} />
          <LeaderGroup title="Cipher" data={cipher} username={username} />
        </>
      )}
    </div>
  );
}

function LeaderGroup({ title, data, username }) {
  if (data.length === 0) return null;

  return (
    <div className="leader-group">
      <h2>{title}</h2>

      {data.slice(0, 5).map((entry, index) => (
        <div
          key={`${entry.userId}-${index}`}
          className={`leader-item ${username === entry.userId ? "me" : ""}`}
        >
          <div>{index + 1}</div>
          <div>
            <b>{entry.username || entry.userId}</b>
          </div>
          <div align="right">{entry.timeTaken} seconds</div>
        </div>
      ))}
    </div>
  );
}
