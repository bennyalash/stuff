import { useEffect, useState } from "react";

import { Routes, Route, Link } from "react-router-dom"
import { CircleUserRound, Trophy, CircleCheck, BadgeCheck } from 'lucide-react';
import { GoogleSignIn } from './components/GoogleSignIn.jsx';
import { fetchToday } from './components/FetchPuzzle.jsx';

export default function Home() {

    const [games, setGames] = useState({});

    useEffect(() => {
        async function loadBridges() {
            const bridges = await fetchToday("Bridges", "bennyalash");
            const roots = await fetchToday("Latter", "bennyalash");
            const cipher = await fetchToday("Cipher", "bennyalash");

            setGames(prev => ({
                ...prev,
                bridges,
                roots,
                cipher
            }));
        }

        loadBridges();
    }, []);

    return (
        <div className="page">
        <div className="nav" style={{ height: "50px" }}>
                <div className="far-left far">
                <h3>December 1, 2025</h3>

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
                                {games.bridges && <BadgeCheck size={30} />} Bridges
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
                            {games.roots && <BadgeCheck size={30} />} Roots
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
                            {games.cipher && <BadgeCheck size={30} />} Cipher
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
                            Vines
                        </div>
                        <div className="game-card-description">
                           Coming Soon.
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
