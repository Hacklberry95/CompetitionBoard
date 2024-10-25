// src/components/RulesModal.js
import React from "react";
import Modal from "react-modal";
import "../../styles/RulesModal.css"; // Create this CSS file for specific styles if needed

// Set app element for accessibility
Modal.setAppElement("#root");

const RulesModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Rules"
      className="rules-modal"
      overlayClassName="rules-overlay"
    >
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
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default RulesModal;
