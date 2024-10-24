import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  return (
    <div className="header">
      <h1 className="header-title">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Tournament Bracket
        </Link>
      </h1>
    </div>
  );
};

export default Header;
