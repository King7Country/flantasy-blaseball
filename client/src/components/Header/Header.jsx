import React from 'react'
import "../Header/Header.scss"
import { Link } from "react-router-dom";

let toggleNav = "--close"

// const Navigation = ({ authUser }) => (
//     <div>
//         {authUser =>
//             authUser ? <NavigationAuth /> : <NavigationNonAuth />
//         }
//     </div>
//   );

//   const NavigationAuth = () => (
    // <nav className={`nav${toggleNav}`}>
    // <button class="nav__toggle--closed"
    //     onClick={this.props.function}
    //     >
    //     X
    // </button>
    // <ul className="nav__list">
    //     <li className="nav__items">
    //         <Link className="nav__links">
    //             My Team
    //         </Link>
    //     </li>
    //     <li className="nav__items">
    //     <Link className="nav__links">
    //         Standings
    //     </Link>
    //     </li>
    //     <li className="nav__items">
    //         <Link className="nav__links">
    //             Draft
    //         </Link>
    //     </li>
    // </ul>
    // </nav>
//   );

//   const NavigationNonAuth = () => (
    // <nav className={`nav${toggleNav}`}>
    // <button class="nav__toggle--closed"
    //     onClick={this.props.function}
    //     >
    //     X
    // </button>
    // <ul className="nav__list">
    //     <li className="nav__items">
    //         <Link className="nav__links">
    //             Sign Up
    //         </Link>
    //     </li>
    // </ul>
    // </nav>
//     <p>You're signed out</p>
//   );

class Header extends React.Component {

    // state = {
    //     displayNav: false,
    // }


    // toggleHandler(event) {
    //     event.preventDefault();
    //     if (this.state.displayNav === false) {
    //         toggleNav = "--open";
    //         this.setState({displayNav: true});
    //     } else {
    //         toggleNav = "--close";
    //         this.setState({displayNav: false});
    //     }
    //     console.log(this.state.displayNav, toggleNav)
    // }

    render() {

        return (
            <>
            <header className="header">
                <h2 className="header_title">Flantasy Blaseball</h2>
    

                {/* <button class="nav__toggle--open"
                        onClick={event => this.toggleHandler(event, this.state)}
                        >
                        Menu
                </button> */}
                {/* <Navigation /> */}
            </header>
          
            </>
        )
    }
}

export default Header
