import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // your Firebase config
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export async function fetchLeaderboard() {
  const today = new Date().toISOString().slice(0, 10);
  console.log(today);
  const q = query(
    collection(db, "stats"),
    where("date", "==", today)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}

export async function fetchToday(type, userId) {
    const today = new Date().toISOString().slice(0, 10);
    const puzzleId = `${today}_${type}`;

    const docId = `${userId}_${puzzleId}`;

    const docRef = doc(db, "stats", docId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
        const data = snap.data();
        return data;
    } 

    return null;
}


export async function fetchTodaysPuzzle(type) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const puzzleId = `${today}_${type}`;

  const puzzleRef = doc(db, "puzzles", puzzleId);
  const puzzleSnap = await getDoc(puzzleRef);

  if (puzzleSnap.exists()) {
    return puzzleSnap.data(); // your level.data, etc.
  } else {
    console.log("Puzzle not found for today");
    return null;
  }
}

export async function submitPuzzleStats(timeTaken, type, finalMap) {
  const today = new Date().toISOString().slice(0, 10);
  const puzzleId = `${today}_${type}`;

  const username = localStorage.getItem('username');

  if(!username) return;

  const statsRef = doc(db, "stats", `${username}_${puzzleId}`);
  await setDoc(statsRef, {
      userId: username || "guest",
    puzzleId,
    type,
    timeTaken,
    completedAt: serverTimestamp(),
    attempts: 1,
    finalMap, // store only the final map
    date: puzzleId.split("_")[0]
  });
}
