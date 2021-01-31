import React from 'react'
import "../Header/Header.scss"
import { Link } from "react-router-dom";


let toggleNav = "--close"

class Navigation extends React.Component {

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
            <AuthUserContext.Consumer>

                {authUser => authUser ? 

                    <nav className={`nav${toggleNav}`}>
                        <button class="nav__toggle--closed"
                            onClick={event => this.toggleHandler(event, this.state)}
                            >
                            X
                        </button>
                        <ul className="nav__list">
                            <li className="nav__items">
                                <Link className="nav__links">
                                    My Team
                                </Link>
                            </li>
                            <li className="nav__items">
                            <Link className="nav__links">
                                Standings
                            </Link>
                            </li>
                            <li className="nav__items">
                                <Link className="nav__links">
                                    Draft
                                </Link>
                            </li>
                        </ul>
                        <SignOutButton />
                    </nav>

                :

                    <nav className={`nav${toggleNav}`}>
                        <button class="nav__toggle--closed"
                                onClick={event => this.toggleHandler(event, this.state)}
                            >
                            X
                        </button>
                        <ul className="nav__list">
                            <li className="nav__items">
                                <Link className="nav__links">
                                    Sign Up
                                </Link>
                            </li>
                        </ul>
                    </nav>
                 
                 }


            </AuthUserContext.Consumer>
            </>
        )
    }

}
    


  

export default Navigation