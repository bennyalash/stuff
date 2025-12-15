import { Routes, Route, Link } from "react-router-dom"

export function BridgesWin({puzztime}) {
  return (
    <>
      <h4>You completed the puzzle in {puzztime} seconds.</h4>


      <Link to="/"><button>Play Another Puzzle</button></Link>
            <br />
       <Link to="/leaders"><button className="alt">View Leaderboard</button></Link>
    </>
  );
}

export function RootsWin({ puzztime }) {
    return (
        <>
            <h4>You completed the puzzle in {puzztime} seconds.</h4>


            <Link to="/"><button>Play Another Puzzle</button></Link>
            <br />
            <Link to="/leaders"><button className="alt">View Leaderboard</button></Link>
        </>
    );
}

export function CipherWin({ puzztime }) {
    return (
        <>
            <h4>You completed the puzzle in {puzztime} seconds.</h4>
            <Link to="/"><button>Play Another Puzzle</button></Link>
            <br />
            <Link to="/leaders"><button className="alt">View Leaderboard</button></Link>
        </>
    );
}