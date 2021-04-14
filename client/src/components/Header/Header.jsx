import React, { useState } from 'react'
import "../Header/Header.scss"
import { Link, useLocation } from "react-router-dom";

// let toggleNav = "--close"

const Header = () => {

    // const [displayHeader, setDisplayHeader] = useState("--hidden");
   
    // const [displayNav, setDisplayNav] = useState(false);

    // toggleHandler(event) {
    //     event.preventDefault();
    //     if (this.state.displayNav === false) {
    //         toggleNav = "--open";
    //         setDisplayNav(true);
    //     } else {
    //         toggleNav = "--close";
    //         setDisplayNav(false);
    //     }
    //     console.log(displayNav, toggleNav)
    // }

    let location = useLocation();

    if (location.pathname === "/login") {
        return null
    } 
    
    return (
        <>
            <header className="header">
                <h2 className="header__title">Flantasy Blaseball</h2>
                <nav className="nav">
                    <ul className="nav__list">
                        <li className="nav__items">
                            <Link to="/"
                                className="nav__links">
                                My Team
                            </Link>
                        </li>
                        <li className="nav__items">
                        <Link 
                            to="/standings"
                            className="nav__links">
                            Standings
                        </Link>
                        </li>
                        <li className="nav__items">
                            <Link to="/draft"
                                className="nav__links">
                                Draft
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    )
  
}

export default Header
