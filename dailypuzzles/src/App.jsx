import { Routes, Route, Link } from "react-router-dom"
import Layout from "./layout.jsx"
import Home from "./home.jsx"
import Latter from "./latterly/latterly.jsx"
import Bridges from "./bridges.jsx"
import Vines from "./vines.jsx"
import Cipher from "./cipher.jsx"
import { ChevronLeft, MoveLeft, Target, CircleQuestionMark, Settings } from 'lucide-react';

export default function App() {
    return (
        <>
        <Layout>
            
            <nav style={{ height: "50px" }}>
                <div className="far-left far">
                <Link to="/" style={{ marginRight: "1rem" }}><ChevronLeft /></Link>

                </div>
                <div className="far-right far">
                <CircleQuestionMark color="black" />
                <Settings color="black" />
                </div>
            </nav>
            {/* Routes */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/latter" element={<Latter />} />
                <Route path="/bridges" element={<Bridges />} />
                {/*<Route path="/vines" element={<Vines />} />*/}
                <Route path="/cipher" element={<Cipher />} />
            </Routes>
            </Layout>
        </>
    )
}
