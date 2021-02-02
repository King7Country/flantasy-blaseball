import React from 'react';
import { Link, WithRouter } from 'react-router-dom';
import fire from '../../config/fire';
import "./Login.scss";
import icon from "../../assets/images/baseball-icon.svg"

class Login extends React.Component {
   
    state = {
        userName: "",
        email: "",
        pasword: "",
    }

    login(event) {
        event.preventDefault();
        fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((res) => {
            // console.log("logged in: ", res.user)
            localStorage.setItem("isAuthenticated", "true")
            // localStorage.setItem("userId", res.user.id)
            this.props.history.push('/')
        }).catch((err) => {
            console.log(err)
        });
    }

    signup(event) {
        event.preventDefault();
        fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((res) => {
            const user = fire.auth().currentUser;
           
            user.updateProfile({
               displayName: this.state.userName
           })
            // fire.database().ref('users').push(userId, this.state.email);
            this.props.history.push('/');
        })
        .then((res) => console.log(res))
        .catch((err) => {
            console.log(err)
        });
    }

    handleChange(event) {
        this.setState({ 
            [event.target.name]: event.target.value, 
        })
    }

    render() {
        return (
            <div>
                <form className="login">
                    <div className="login__header-container">
                    <img className="login__logo" src={icon} alt="baseball"/>
                        <h1 className="login__header">Flantasy Blaseball</h1>
                    </div>

                    <input
                        className="login__input"
                        name="userName"
                        value={this.state.userName}
                        onChange={event => this.handleChange(event)}
                        type="text"
                        placeholder="Your User Name"
                        />
                    <input
                        className="login__input"
                        name="email"
                        value={this.state.email}
                        onChange={event => this.handleChange(event)}
                        type="text"
                        placeholder="Email Address"
                        />
                    <input
                        className="login__input--bottom"
                        name="password"
                        value={this.state.password}
                        onChange={event => this.handleChange(event)}
                        type="password"
                        placeholder="Password"
                        />
                    <button 
                        className="login__button"
                        type="submit"
                        onClick={event => this.login(event)}
                        >
                        Log In
                    </button>
                    <button 
                        className="login__button"
                        type="submit"
                        onClick={event => this.signup(event)}
                        >
                        Sign up
                    </button>
                </form>
            </div>
        )
    }
}

export default Login
