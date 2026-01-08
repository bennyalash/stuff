import { useState } from "react";

import { Routes, Route, Link } from "react-router-dom"
import Layout from "./layout.jsx"
import Home from "./home.jsx"
import Latter from "./latterly/latterly.jsx"
import Bridges from "./bridges.jsx"
import Vines from "./vines.jsx"
import Cipher from "./cipher.jsx"
import Leaders from "./leaders.jsx"
import { ChevronLeft, MoveLeft, Target, CircleQuestionMark, Settings, X } from 'lucide-react';
import './styles/help.css'

export default function App() {
    const [modal, setModal] = useState(false)

    return (
        <>
        <Layout>
            
            <nav style={{ height: "50px" }}>
                <div className="far-left far">
                <Link to="/" style={{ marginRight: "1rem" }}><ChevronLeft /></Link>

                </div>
                <div className="far-right far">
                <CircleQuestionMark className="click" onClick={() => setModal(true)} color="black" />
                </div>
            </nav>
            
            

            <div className="settings" />
            {/* Routes */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/latter" element={<Latter  modal={modal} setModal={setModal} />} />
                <Route path="/bridges" element={<Bridges modal={modal} setModal={setModal} />} />
                <Route path="/cipher" element={<Cipher  modal={modal} setModal={setModal} />} />
                <Route path="/leaders" element={<Leaders />} />
                {/*<Route path="/vines" element={<Vines />} />*/}
            </Routes>
            </Layout>
        </>
    )
}
