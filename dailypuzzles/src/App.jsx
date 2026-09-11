import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Layout from "./layout.jsx";
import Home from "./home.jsx";
import Latter from "./latterly/latterly.jsx";
import Bridges from "./bridges.jsx";
import Vines from "./vines.jsx";
import Cipher from "./cipher.jsx";
import Leaders from "./leaders.jsx";
import AdminRoots from "./admin/AdminRoots.jsx";
import { ChevronLeft, CircleQuestionMark } from 'lucide-react';
import './styles/help.css';

// Map pathnames to their title labels
const routeTitles = {
    "/": "Home",
    "/roots": "Roots",
    "/bridges": "Bridges",
    "/cipher": "Cipher",
    "/leaders": "Leaderboard",
    "/vines": "Vines"
};

const routeImages = {
    "/roots": "Roots_",
    "/bridges": "Bridges",
    "/cipher": "cipher",
    "/vines": "Vines"
};

export default function App() {
    const [modal, setModal] = useState(false);
    const location = useLocation();

    // Fallback to empty string if path isn't recognized
    const currentTitle = routeTitles[location.pathname] || "";
    const currentImage = routeImages[location.pathname] || "";

    return (
        <Layout>
            <nav style={{ height: "50px" }}>
                <div className="far-left far">
                    <Link to="/" style={{ marginRight: "1rem" }}>
                        <ChevronLeft />
                    </Link>
                </div>
                <div>
                    <h3 id="game-title">
                    <img height='25' src={"./logos/"+currentImage + ".svg"} alt={currentTitle} />
                        {currentTitle}
                        
                    </h3>
                </div>
                <div className="far-right far">
                    <CircleQuestionMark className="click" onClick={() => setModal(true)} color="black" />
                </div>
            </nav>


            
            {/* Routes */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/roots" element={<Latter modal={modal} setModal={setModal} />} />
                <Route path="/bridges" element={<Bridges modal={modal} setModal={setModal} />} />
                <Route path="/cipher" element={<Cipher modal={modal} setModal={setModal} />} />
                <Route path="/leaders" element={<Leaders />} />
                <Route path="/vines" element={<Vines />} />
                <Route path="/roots-admin" element={<AdminRoots />} />
            </Routes>
        </Layout>
    );
}