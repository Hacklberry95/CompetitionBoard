import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import "../styles/SideBar.css";
import CalendarModal from "./CalendarModal";
import RulesModal from "./RulesModal";

const SidebarMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openRulesModal = () => {
    setIsRulesModalOpen(true);
  };

  const closeRulesModal = () => {
    setIsRulesModalOpen(false);
  };
  return (
    <Sidebar className="sidebar-container">
      <Menu>
        <SubMenu label="Beginner">
          <SubMenu label="Mens">
            <SubMenu label="Right">
              <MenuItem>-86Kg</MenuItem>
              <MenuItem>+86Kg</MenuItem>
            </SubMenu>
            <SubMenu label="Left">
              <MenuItem>-86Kg</MenuItem>
              <MenuItem>+86Kg</MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu label="Womens">
            <SubMenu label="Right">
              <MenuItem>-70Kg</MenuItem>
              <MenuItem>+70Kg</MenuItem>
            </SubMenu>
            <SubMenu label="Left">
              <MenuItem>-70Kg</MenuItem>
              <MenuItem>+70Kg</MenuItem>
            </SubMenu>
          </SubMenu>
        </SubMenu>
        <SubMenu label="Official">
          <SubMenu label="Mens">
            <SubMenu label="Right">
              <MenuItem>-70Kg</MenuItem>
              <MenuItem>-78Kg</MenuItem>
              <MenuItem>-86Kg</MenuItem>
              <MenuItem>-95Kg</MenuItem>
              <MenuItem>+95Kg</MenuItem>
              <MenuItem>Overall</MenuItem>
            </SubMenu>
            <SubMenu label="Left">
              <MenuItem>-70Kg</MenuItem>
              <MenuItem>-78Kg</MenuItem>
              <MenuItem>-86Kg</MenuItem>
              <MenuItem>-95Kg</MenuItem>
              <MenuItem>+95Kg</MenuItem>
              <MenuItem>Overall</MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu label="Womens">
            <SubMenu label="Right">
              <MenuItem>-70Kg</MenuItem>
              <MenuItem>+70Kg</MenuItem>
            </SubMenu>
            <SubMenu label="Left">
              <MenuItem>-70Kg</MenuItem>
              <MenuItem>+70Kg</MenuItem>
            </SubMenu>
          </SubMenu>
        </SubMenu>
        <MenuItem onClick={openRulesModal}>Rules</MenuItem>
        <MenuItem onClick={openModal}>Calendar</MenuItem>
      </Menu>
      <CalendarModal isOpen={isModalOpen} onRequestClose={closeModal} />
      <RulesModal isOpen={isRulesModalOpen} onRequestClose={closeRulesModal} />
    </Sidebar>
  );
};

export default SidebarMenu;
