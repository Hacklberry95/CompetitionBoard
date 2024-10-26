import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Header.css";

const Header = () => {
  return (
    <div className="header">
      <img
        src={`${process.env.PUBLIC_URL}/armwrestling-pic.jpg`}
        className="header-logo"
      />
      <h1 className="header-title">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Tournament Organizer
        </Link>
      </h1>
    </div>
  );
};

export default Header;
