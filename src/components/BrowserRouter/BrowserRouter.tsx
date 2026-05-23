import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './BrowserRouter.css';
import { NewNavBar } from '../NewNavBar/NewNavBar';
import { arrForNav } from '../../types/NavBarInfo';
import Home from '../../pages/Home/Home';
import Analyze from '../../pages/Analyze/Analyze';
import About from '../../pages/About/About';

export const BrowseRouter = () => {
    return (
        <div className="app-wrapper">
            <BrowserRouter basename="/deep-analysis/">
                {/* ה-Navbar מקבל כעת אך ורק את מערך הלינקים הסטטיים */}
                <NewNavBar theArr={arrForNav} />
                
                <main className="main-content">                     
                    <Routes>
                        {/* דף הבית */}
                        <Route path="/" element={<Home />} />
                        
                        {/* דף הניתוח הפיננסי - פתוח ישירות לכולם */}
                        <Route path="/analyze" element={<Analyze />} />
                        
                        {/* דף אודות */}
                        <Route path="/about" element={<About />} />
                    </Routes>
                </main>

                <footer className="main-footer">
                    © 2026 DEEP ANALYSIS - FINANCIAL INSIGHTS
                </footer>
            </BrowserRouter>
        </div>
    );
};