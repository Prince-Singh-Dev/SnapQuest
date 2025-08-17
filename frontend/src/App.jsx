import { BrowserRouter as Router , Routes , Route , Link } from "react-router-dom";
import Home from "./pages/Home";
import Lessons from "./pages/Lessons";
import Challenges from "./pages/Challenges";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";

function App(){
  return (
    <Router>
      <div>
        {/* Navbar */}
        <nav className="navbar">
          <h1 className="logo">SnapQuest</h1>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/lessons">Lessons</Link></li>
            <li><Link to="/challenges">Challenges</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </ul>
        </nav>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/lessons" element={<Lessons/>}/>
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;