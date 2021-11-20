import './App.css';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom"
import Login from "./components/Login"
// import Signup from "./components/Signup"
import Tweets from './components/Tweets';
//import NewTweet from './components/NewTweet';
// import EditTweet from './components/EditTweet';
import MyProfile from './components/MyProfile';
import UserProfile from './components/UserProfile';
//import EditDetails from './components/EditDetails';
import UserSearch from './components/UserSearch';
// import Comments from './components/Comments';
//import EditComment from './components/EditComment';

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route path="/tweets">
            <Tweets />
          </Route>
          <Route path="/myprofile">
            <MyProfile />
          </Route>
          <Route path="/userprofile">
            <UserProfile />
          </Route>
          <Route path="/usersearch">
            <UserSearch />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
