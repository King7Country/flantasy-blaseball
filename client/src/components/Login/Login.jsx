import React from 'react';
import fire from '../../config/fire';
import "./Login.scss";
import icon from "../../assets/images/baseball-icon.svg"

class Login extends React.Component {
   
    state = {
        userName: "",
        email: "",
        pasword: "",
        active: true,
        errorMessage: {error: false, message: "",},
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
            this.setState({errorMessage: {error: true, message: err.message,}})
        });
    }

    signup(event) {
        event.preventDefault();
        const email = this.state.email;
        const password = this.state.password;
        fire.auth().createUserWithEmailAndPassword(email, password).then((res) => {
            const user = fire.auth().currentUser;
           
            user.updateProfile({
               displayName: this.state.userName
           })

           return event
        })
        .then((res) => {
          console.log(res)
          this.login(res);
        })
        .catch((err) => {
            console.log(err)
            this.setState({errorMessage: {error: true, message: err.message,}})
        });
    }

    handleChange(event) {
        this.setState({ 
            [event.target.name]: event.target.value, 
        })
    }

    render() {
        const active = this.state.active;
        const userName = this.state.userName;
        const email = this.state.email;
        const password = this.state.password;

        return (
            <section className="login">
            <div className="login__header-container">
              <img className="login__logo" src={icon} alt="baseball" />
              <h1 className="login__header">Flantasy Blaseball</h1>
            </div>
      
            <div className="login__tab-container">
              <button
                className={`login__tab-buttons--${active}`}
                value="login-tab"
                onClick={() => this.setState({active: true})}
              >
                Login
              </button>
              <button
                className={`login__tab-buttons--${!active}`}
                value="signup-tab"
                onClick={() => this.setState({active: false})}
              >
                Sign Up
              </button>
            </div>
      
            <div className="login__form-container">
              { active ? 
                  <form className="login-form">
                      <input
                      className="login-form__input"
                      name="email"
                      value={this.state.email}
                      onChange={(event) => this.handleChange(event)}
                      type="text"
                      placeholder="Email Address"
                      />
                      <input
                      className="login-form__input--bottom"
                      name="password"
                      value={password}
                      onChange={(event) => this.handleChange(event)}
                      type="password"
                      placeholder="Password"
                      />
                      <button
                      className="login-form__button"
                      type="submit"
                      onClick={(event) => this.login(event)}
                      >
                        Log In
                      </button>
                  </form> 
                  : 
                  <form className="login-form">
                      <input
                      className="login-form__input"
                      name="userName"
                      value={userName}
                      onChange={event => this.handleChange(event)}
                      type="text"
                      placeholder="Your User Name"
                      />
                      <input
                      className="login-form__input"
                      name="email"
                      value={email}
                      onChange={event => this.handleChange(event)}
                      type="text"
                      placeholder="Email Address"
                      />
                      <input
                      className="login-form__input--bottom"
                      name="password"
                      value={password}
                      onChange={(event) => this.handleChange(event)}
                      type="password"
                      placeholder="Password"
                      />
                      <button
                      className="login-form__button"
                      type="submit"
                      onClick={(event) => this.signup(event)}
                      >
                        Sign up
                      </button>
                  </form> }
                  <p className={`login-form__error--${this.state.errorMessage.error}`}>{this.state.errorMessage.message}</p>
            </div>
          </section>
        )
    }
}

export default Login
