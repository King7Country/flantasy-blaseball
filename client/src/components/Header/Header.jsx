import React from 'react'
import "../Header/Header.scss"
import { Link } from "react-router-dom";

let toggleNav = "--close"

class Header extends React.Component {

    state = {
        displayNav: false,
    }

    toggleHandler(event) {
        event.preventDefault();
        if (this.state.displayNav === false) {
            toggleNav = "--open";
            this.setState({displayNav: true});
        } else {
            toggleNav = "--close";
            this.setState({displayNav: false});
        }
        console.log(this.state.displayNav, toggleNav)
    }

    render() {

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
}

export default Header
