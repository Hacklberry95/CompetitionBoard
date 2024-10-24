import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import "../styles/SideBar.css";

const SidebarMenu = () => {
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
        <MenuItem component={<Link to="/rules">Rules</Link>}>Rules</MenuItem>
        <MenuItem> Calendar </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SidebarMenu;
