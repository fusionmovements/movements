import logo from './logo.svg';
import './App.css';
import React from 'react'
import { BrowserRouter, Switch, Route, Link} from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"

//import AddReview from "./components/add-review"
import ExercisesList from './components/exercises-list'
import Exercise from './components/exercise';
//import Login from './components/login';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function App() {

  // const [user,setUser] = React.useState(null)

  // async function login(user=null){//default user set to null
  //   setUser(user)
  // }

  // async function logout(){
  //   setUser(null)
  // }

  return (
    // <BrowserRouter>
    <div>
      

<Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link>
              <Link to={"/exercises"}> Exercises </Link>
              </Nav.Link>

            {/* <Nav.Link>
              {user?(
                <a onClick={logout}>Logout User</a>
              ):(
                // <Link to={"/login"}>Login</Link>
              )}
            </Nav.Link> */}
            </Nav>
        </Navbar.Collapse>
    </Navbar>
{/* <a>user is {console.log(setUser)}</a> */}
<Switch>
    <Route exact path={["/", "/exercises"]} component = {ExercisesList} />
    {/* <Route exact path="/exercises" element = {ExercisesList} /> */}
    {/* <Route path="/exercises/:id/review" render={(props)=><AddReview {...props} user={user}/>}></Route> */}
    {/* <Route path="/exercises/:id/" render={(props)=><Exercise {...props} user={user}/>}></Route> */}
    {/* <Route path="/login" render={(props)=><Login {...props} user={user}/>}></Route> */}
</Switch>

      {/* <Switch>
        <Route path="/exercises" element={<ExercisesList />} />
        {/* Other routes go here */}
      {/* </Switch> */}
      </div>  );
}

export default App;
