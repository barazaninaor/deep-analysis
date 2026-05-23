import React from 'react';
import { SectionHeader } from '../../components/SectionHeader/SectionHeader';
import { Paragraph } from '../../components/Paragraph/Paragraph';
import './About.css';

const About: React.FC = () => {
    return (
        <div className="about-page">
            <div className="about-container">
                <SectionHeader 
                    title="About" 
                    description="Naor Barazani" 
                />

                <div className="about-content-box">
                    <Paragraph text="I am a financial process improvement specialist and an avid dividend growth investor. My journey focuses on merging financial efficiency with modern technology to create robust investment strategies." />
                    
                    <Paragraph text="Currently, I am developing tools to simplify market analysisץ My goal is to bridge the gap between complex financial data and actionable insights." />
                    
                    <Paragraph text="Beyond coding and finance, I am passionate about building automated systems and sharing knowledge through my dividend investing courses. I believe that precision and data-driven decisions are the keys to long-term wealth." />
                </div>
            </div>
        </div>
    );
};

export default About;