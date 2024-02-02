import React from "react";
import Card from "../components/Card";
import Footer from "../components/Footer";
import "../css/General.css";
import "../css/MainPage.css";

console.log("loaded MainPage.js");
const MainPage = () => (
  <div className="general-style">
    <div className="content">
      <Card>
        <h2>SERVER LIST</h2>
        <ul className="clickable-list">
          <li>
            <a href="#">PalServer - Public World </a>{" "}
            <span className="running">Running </span>
          </li>
          <li>
            <a href="#">PalServer - YouTube World </a>{" "}
            <span className="running">Running </span>
          </li>
          <li>
            <a href="#">PalServer - Friend Group </a>{" "}
            <span className="down"> Down </span>
          </li>
          <li>
            <a href="#">PalServer - Solo </a> <span className="running">Running </span>
          </li>
          <li>
            <a href="#">Gary's Mod - Prop Hunt </a>{" "}
            <span className="down"> Down </span>
          </li>
          <li>
            <a href="#">Gary's Mod - Open Public </a>{" "}
            <span className="running">Running </span>
          </li>
          <li>
            <a href="#">Gary's Mod - Private </a>{" "}
            <span className="running">Running </span>
          </li>
          <li>
            <a href="#">Minecraft - Underground City</a>{" "}
            <span className="running">Running </span>
          </li>
          <li>
            <a href="#">Minecraft - Sky Blocks </a>{" "}
            <span className="ready"> Ready </span>
          </li>
        </ul>
        <button className="add-server">+</button>
      </Card>
      <Card>
        <h2>SERVER INFO</h2>
        <ul className="clickable-list">
          <li>
            <a href="#">Uptime: 15 Days</a>
          </li>
          <li>
            <a href="#">Edit Ban List</a>
          </li>
          <li>
            <a href="#">Edit Configuration</a>
          </li>
        </ul>
      </Card>
    </div>
    <Footer>
      <div>
        <div className="footer-logo">
          <img src="../images/EasyGSM Logo.png" alt="EasyGSM Logo" />
        </div>
        <div className="footer-text">
          EasyGSM is an open source software. Please credit
          https://github.com/M4STERAC/EasyGSM as the first author of the program
          in all areas where credit is due.
        </div>
      </div>
    </Footer>
  </div>
);

export default MainPage;
