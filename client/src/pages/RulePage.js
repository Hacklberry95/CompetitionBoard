import React from "react";
import "../styles/RulesPage.css";

const RulesPage = () => {
  return (
    <div className="rules-page">
      <h2>Rules</h2>
      <ul className="rules-list">
        <li>
          <a
            href="public/2022-WAF-Rules.pdf"
            download="2022-WAF-Rules.pdf"
            className="rules-link"
          >
            Download WAF Rules
          </a>
        </li>
        <li>
          <a
            href="public/IFA-rules.pdf"
            download="IFA-rules.pdf"
            className="rules-link"
          >
            Download IFA Rules
          </a>
        </li>
      </ul>
    </div>
  );
};

export default RulesPage;
