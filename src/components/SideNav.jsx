import React from "react";
import { useNavigate } from "react-router-dom";
import './sideNav.css'; 

function SideNav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <>
      {}
      <div className="side-nav-tab">
        R
      </div>

      {}
      <div className="side-nav-container">
        <div className="side-nav">
          <h3 className="text-white">Menu</h3>
          <button onClick={handleLogout} className="logout-btn mt-3">
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default SideNav;