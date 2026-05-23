import React from 'react';
import './NewNavBar.css';
import type { NavItem } from '../../types/NavBarInfo';

type NewNavBarProps = {
    theArr: NavItem[];
}

export const NewNavBar: React.FC<NewNavBarProps> = ({ theArr }) => {
    return (
        <nav className='NewNavBar'>
            <div className="nav-placeholder-left"></div>

            {/* הקישורים הראשיים בלבד: HOME, ANALYZE, ABOUT */}
            <div className='nav-links-left'>
                {theArr.map((curr) => (
                    <div className='navItem' key={curr.displayStr}>
                        <a href={curr.hrefStr}>{curr.displayStr.toUpperCase()}</a>
                    </div>
                ))}
            </div>

            {/* החלק הימני נשאר ריק ונקי, שומר על הסימטריה של העיצוב */}
            <div className='nav-links-right'></div>
        </nav>
    );
};