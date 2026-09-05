
import React from "react";
import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaDatabase,
  FaWpforms,
  FaEdit,
  FaChartBar,
  FaRobot,
  FaServer,
} from "react-icons/fa";

import "./Home.css";

function Home() {
  return (
    <nav className="navbar">

      <div className="logo">
        MyApp
      </div>

      <div className="nav-links">

        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaHome />
          <span>Home</span>
        </NavLink>

        {/* Get Data */}
       

        {/* Form */}
        <NavLink
          to="/form"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaWpforms />
          <span>Form</span>
        </NavLink>

        {/* Update */}
        <NavLink
          to="/update"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaEdit />
          <span>Update</span>
        </NavLink>


         <NavLink
          to="/get"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaDatabase />
          <span>Get Data</span>
        </NavLink>

        {/* REST API Dashboard */}
        <NavLink
          to="/anayles"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaChartBar />
          <span>REST API Dashboard</span>
        </NavLink>

        {/* AI Agent */}
        <NavLink
          to="/agent"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaRobot />
          <span>Search AI Agent</span>
        </NavLink>

        {/* Redis Dashboard */}
        <NavLink
          to="/redis"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FaServer />
          <span>Redis Dashboard</span>
        </NavLink>

      </div>
    </nav>
  );
}

export default Home;
