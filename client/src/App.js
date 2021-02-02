import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import fire from './config/fire';
import './App.css';
import Login from "./components/Login/Login"
import Home from "./components/Home/Home"
import Standings from "./components/Standings/Standings"
import TestDraft from "./components/TestDraft"
import TestDraftBatters from "./components/TestDraftBatters"
import Header from "./components/Header/Header"


class App extends React.Component {

  state = {
    user: "",
    isAuthenticated: false,
    authListenerAdded: false,
  }

  componentDidMount() {
    const authListenerAdded = this.state.authListenerAdded;
    if (!authListenerAdded) {
      this.authListener();
    }
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user })
        this.setState({ isAuthenticated: true })
        localStorage.setItem('isAuthenticated', "true")
      } else {
        this.setState({ user: null })
        localStorage.removeItem("isAuthenticated")
      }
    })
    this.setState({authListenerAdded: true})
  }

  render() {

    const user = this.state.user;
    function PrivateRoute({ component: Component, ...rest }) {
      return <Route {...rest} render={(props) => (localStorage.isAuthenticated === "true" ? <Component {...props} /> : <Redirect to="login" />)} />
    }
    
    return (

      <Router>
  
        <Header user={user} />
        <Switch>
          <Route path="/login" render={(routerProps) => <Login {...routerProps} user={user} />} />

          <PrivateRoute path="/" exact component={(routerProps) => <Home {...routerProps} user={user} />} />

          <PrivateRoute path="/standings" exact component={(routerProps) => <Standings {...routerProps} user={user} />} />
          {/* <Route path="/login" component={Login} /> */}
          {/* <Route path="/playerlist" component={PlayerList} /> */}
          <PrivateRoute path="/testdraft" exact component={TestDraft} />

        </Switch>

      </Router>

    );
  }
}

export default App;
