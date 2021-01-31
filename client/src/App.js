import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import fire from './config/fire';
import './App.css';
import Login from "./components/Login/Login"
import Home from "./components/Home/Home"
import Standings from "./components/Standings/Standings"
import TestDraft from "./components/TestDraft"
import TestDraftBatters from "./components/TestDraftBatters"
// import Header from "./components/Header/Header"


class App extends React.Component {

  state = {
    user: "",
    isAuthenticated: false
  }

  componentDidMount() {
     this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      console.log(user.uid)
      if (user) {
        this.setState({ user: user })
        this.setState({ isAuthenticated: true })
        // localStorage.setItem('isAuthenticated', user.uid)
      } else {
        this.setState({ user: null })
        this.setState({ isAuthenticated: false })
      }
    })
  }

  render() {

    const user = this.state.user;
    function PrivateRoute({ component: Component, ...rest }) {
      return <Route {...rest} render={(props) => (localStorage.isAuthenticated === "true" ? <Component {...props} /> : <Redirect to="login" />)} />
    }
    
    return (

      <Router>

        <Switch>
          <PrivateRoute path="/" exact component={(routerProps) => <Home {...routerProps} user={user} />} />
          <Route path="/login" render={(routerProps) => <Login {...routerProps} user={user} />} />

          <PrivateRoute path="/standings" exact component={(routerProps) => <Standings {...routerProps} user={user} />} />
          {/* <Route path="/login" component={Login} /> */}
          {/* <Route path="/playerlist" component={PlayerList} /> */}
          <PrivateRoute path="/testdraft" exact component={TestDraft} />
          <PrivateRoute path="/testdraftbatters" component={TestDraftBatters} />

          <Route path="/home" component={Home} />
        </Switch>

      </Router>

    );
  }
}

export default App;
