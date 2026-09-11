import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export async function fetchLeaderboard() {
  const today = new Date().toISOString().slice(0, 10);
  console.log(today);
  const q = query(collection(db, "stats"), where("date", "==", today));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

export async function fetchToday(type, userId) {
  const today = new Date().toISOString().slice(0, 10);
  const puzzleId = `${today}_${type}`;
  const docId = `${userId}_${puzzleId}`;

  const docRef = doc(db, "stats", docId);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    return snap.data();
  }

  return null;
}

export async function fetchTodaysPuzzle(type) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const puzzleId = `${today}_${type}`;

  const puzzleRef = doc(db, "puzzles", puzzleId);
  const puzzleSnap = await getDoc(puzzleRef);

  if (puzzleSnap.exists()) {
    return puzzleSnap.data();
  } else {
    console.log("Puzzle not found for today");
    return null;
  }
}

export async function submitPuzzleStats(timeTaken, type, finalMap) {
  const today = new Date().toISOString().slice(0, 10);
  const puzzleId = `${today}_${type}`;
  const username = localStorage.getItem("username");

  if (!username) return;

  const statsRef = doc(db, "stats", `${username}_${puzzleId}`);
  await setDoc(statsRef, {
    userId: username || "guest",
    puzzleId,
    type,
    timeTaken,
    completedAt: serverTimestamp(),
    attempts: 1,
    finalMap,
    date: puzzleId.split("_")[0],
  });
}

export async function fetchPuzzleByDate(gameType, dateStr) {
  const docId = `${dateStr}_${gameType}`;
  const docRef = doc(db, "puzzles", docId);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    return snap.data();
  }
  return null;
}

export async function savePuzzleByDate(
  gameType,
  dateStr,
  dataObj,
  difficulty = "Medium"
) {
  try {
    const docId = `${dateStr}_${gameType}`;
    const docRef = doc(db, "puzzles", docId);

    await setDoc(
      docRef,
      {
        Data: JSON.stringify(dataObj),
        Type: gameType,
        Difficulty: difficulty,
        date: dateStr,
      },
      { merge: true }
    );
    return { success: true };
  } catch (error) {
    console.error("Error saving puzzle:", error);
    return { success: false, error };
  }
}

