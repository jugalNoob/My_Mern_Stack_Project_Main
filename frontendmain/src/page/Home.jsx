
import React from "react";
import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaDatabase,
  FaWpforms,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import "./Home.css";

function Home() {
  return (
    <nav className="navbar">
      <div className="logo">
        MyApp
      </div>

      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          <FaHome />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/get"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          <FaDatabase />
          <span>Get Data</span>
        </NavLink>

        <NavLink
          to="/form"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          <FaWpforms />
          <span>Form</span>
        </NavLink>

        <NavLink
          to="/update"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          <FaEdit />
          <span>Update</span>
        </NavLink>


  <NavLink
          to="/anayles"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          <FaEdit />
          <span>Update</span>
        </NavLink>


        
  <NavLink
          to="/agent"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          <FaEdit />
          <span>agent</span>
        </NavLink>
       
       
      </div>
    </nav>
  );
}

export default Home;
