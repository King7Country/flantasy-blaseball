import React from 'react'
import fire from "../../config/fire"
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

    // logout() {
    //     fire.auth().signOut();
    //     this.props.history.push("/login");

    // }

    render() {

        return (
            <>
            <header className="header">
                <h2 className="header__title">Flantasy Blaseball</h2>
    

                {/* <button class="nav__toggle--open"
                        onClick={event => this.toggleHandler(event, this.state)}
                        >
                        Menu
                </button> */}

                {/* <nav className={`nav${toggleNav}`}> */}
                <nav className="nav">
                    {/* <button class="nav__toggle--closed"
                        onClick={event => this.toggleHandler(event, this.state)}
                        >
                        X
                    </button> */}
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
                            <Link to="/testdraft"
                                className="nav__links">
                                Draft
                            </Link>
                        </li>
                        {/* <li className="nav__items">
                            <Link 
                                className="nav__button"
                                onClick={() => this.logout()}
                                >
                                Logout
                            </Link>
                        </li> */}
                    </ul>
                </nav>
            </header>
          
            </>
        )
    }
}

export default Header
