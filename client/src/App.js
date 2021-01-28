import React from "react";
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { withFirebase } from './components/Firebase';
import { AuthUserContext } from './components/Session';
import Header from "./components/Header/Header"
import TestDraft from "./pages/Testing/TestDraft";
import PlayerList from "./components/PlayerList/PlayerList";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import MyTeam from "./components/MyTeam/MyTeam"
import TestAdmin from "./pages/Testing/TestAdmin";


import * as ROUTES from "./constants/routes";


class App extends React.Component {

  constructor(props) {
    super(props);
 
    this.state = {
      authUser: null,
    };
  }

  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      }
    );
  }

  // componentWillUnmount() {
  //   this.listener();
  // }

  render() {
console.log("authUser: ", this.state.authUser)
    return (
      <AuthUserContext.Provider value={this.state.authUser}>
        <Router>
          <Header />
          <Switch>
    
            <Route path={ROUTES.SIGNUP} exact component={Signup} />
            <Route path={ROUTES.LOGIN} exact component={Login} />
            {/* <Route path="/landing" exact component={Landing} /> */}
    
    
            <Route path="/myteam" component={MyTeam} />

            {/* test routes */}
            <Route path="/draft" exact component={TestDraft} />
            <Route path="/" exact component={PlayerList} />
            <Route path="/testadmin" component={TestAdmin} />

          </Switch>
        </Router>
        </AuthUserContext.Provider>
    );
  }
}

export default withFirebase(App);
