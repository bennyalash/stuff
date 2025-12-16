import { useEffect, useState } from "react";

import { Routes, Route, Link } from "react-router-dom"
import { CircleUserRound, Trophy, CircleCheck, BadgeCheck } from 'lucide-react';
import { GoogleSignIn } from './components/GoogleSignIn.jsx';
import { fetchToday } from './components/FetchPuzzle.jsx';

export default function Home() {

    const [games, setGames] = useState({});

    useEffect(() => {
        async function loadCompleted() {
            const username = localStorage.getItem('username');

            const bridges = await fetchToday("Bridges", username);
            const roots = await fetchToday("Latter", username);
            const cipher = await fetchToday("Cipher", username);

            setGames(prev => ({
                ...prev,
                bridges,
                roots,
                cipher
            }));
        }

        loadCompleted();
    }, []);

    return (
        <div className="page">
        <div className="nav" style={{ height: "50px" }}>
                <div className="far-left far">
                <h3>
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h3>

                </div>
                <div className="far-right far">
                        <GoogleSignIn><CircleUserRound /></GoogleSignIn>

                </div>
            </div>
            <div className="game-card-list">
            <Link to="/bridges" className="game-card bridges">
                <div className="game-card-cover">
                    <div className="game-card-info">
                            <div className="game-card-name">
                                Bridges {games.bridges && <BadgeCheck size={30} />} 
                        </div>
                        <div className="game-card-description">
                            Place blocks to form a path from the start to the finish.
                        </div>
                    </div>
                    <div className="game-card-illustration">
                    </div>
                    
                </div>
            </Link>
            <Link to="/latter" className="game-card letter-ladder">
                <div className="game-card-cover">
                    <div className="game-card-info">
                        <div className="game-card-name">
                             Roots {games.roots && <BadgeCheck size={30} />}
                        </div>
                        <div className="game-card-description">
                            Swap out one letter at a time to form a target word.
                        </div>
                    </div>
                    <div className="game-card-illustration">
                    </div>
                    
                </div>
            </Link>
            <Link to="/cipher" className="game-card cipher">
                <div className="game-card-cover">
                    <div className="game-card-info">
                        <div className="game-card-name">
                             Cipher {games.cipher && <BadgeCheck size={30} />}
                        </div>
                        <div className="game-card-description">
                            Slide rows and columns to complete the word grid.
                        </div>
                    </div>
                    <div className="game-card-illustration">
                    </div>
                    
                </div>
            </Link>
            <Link to="/" className="game-card vines">
                <div className="game-card-cover">
                    <div className="game-card-info">
                        <div className="game-card-name">
                            Coming Soon
                        </div>
                        <div className="game-card-description">
                           Vines.
                        </div>
                    </div>
                    <div className="game-card-illustration">
                    </div>
                    
                </div>
            </Link>
            
            </div>
        </div>
    )
}
