import React from 'react';
import { Link, WithRouter } from 'react-router-dom';
import fire from '../../config/fire';
import "./Login.scss";

class Login extends React.Component {
   
    state = {
        email: "",
        pasword: "",
    }

    login(event) {
        event.preventDefault();
        fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((res) => {
            console.log("logged in: ", res.user.uid)
            localStorage.setItem("isAuthenticated", "true")
            localStorage.setItem("userId", res.user.id)
            this.props.history.push('/')
        }).catch((err) => {
            console.log(err)
        });
    }

    signup(event) {
        event.preventDefault();
        fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((res) => {
           
            const userId = fire.auth().currentUser.uid;
            fire.database().ref('users').push(userId, this.state.email);
        }).catch((err) => {
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
                <form action="">
                <input
                    name="email"
                    value={this.state.email}
                    onChange={event => this.handleChange(event)}
                    type="text"
                    placeholder="Email Address"
                    />
                <input
                    name="password"
                    value={this.state.password}
                    onChange={event => this.handleChange(event)}
                    type="password"
                    placeholder="Password"
                    />
                <button 
                    type="submit"
                    onClick={event => this.login(event)}
                    >
                    Log In
                </button>
                <button 
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
