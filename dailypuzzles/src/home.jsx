import { Routes, Route, Link } from "react-router-dom"

export default function Home() {
    return (
        <div className="page">
            <h3>December 1, 2025</h3>
            <div className="game-card-list">
            <Link to="/bridges" className="game-card bridges">
                <div className="game-card-cover">
                    <div className="game-card-info">
                        <div className="game-card-name">
                            Bridges
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
                            Roots
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
                            Cipher
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
