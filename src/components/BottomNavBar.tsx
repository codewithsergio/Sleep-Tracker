import { NavLink } from "react-router-dom";
import "../styles/BottomNavBar.css";

function BottomNavBar() {
  return (
    <div className="bottom-nav-bar">
      <NavLink className="navlink" to="/">
        Home
      </NavLink>
      <NavLink className="navlink" to="/exercises">
        Exercises
      </NavLink>
      {/* <NavLink className="navlink" to="/tasks">
        Tasks
      </NavLink> */}
    </div>
  );
}

export default BottomNavBar;
