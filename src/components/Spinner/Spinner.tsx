import React from 'react';
import './Spinner.css';

interface SpinnerProps {
    message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message = "Loading..." }) => {
    return (
        <div className="spinner-container">
            <div className="loading-spinner"></div>
            {message && <p className="loading-text">{message}</p>}
        </div>
    );
};

export default Spinner;