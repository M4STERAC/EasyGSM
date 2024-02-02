import React from "react";
import Card from "../components/Card";
import Footer from "../components/Footer";
import "../css/General.css";
import "../css/Main.css";

const Main = () => (
  <div className="content">
    <Card>
      <h2>SERVER LIST</h2>
      <ul className="clickable-list">
        <li>
          <a href="#">PalServer - Public World </a>{" "}
          <span id="running">Running </span>
        </li>
        <li>
          <a href="#">PalServer - YouTube World </a>{" "}
          <span id="running">Running </span>
        </li>
        <li>
          <a href="#">PalServer - Friend Group </a>{" "}
          <span id="down"> Down </span>
        </li>
        <li>
          <a href="#">PalServer - Solo </a> <span id="running">Running </span>
        </li>
        <li>
          <a href="#">Gary's Mod - Prop Hunt </a> <span id="down"> Down </span>
        </li>
        <li>
          <a href="#">Gary's Mod - Open Public </a>{" "}
          <span id="running">Running </span>
        </li>
        <li>
          <a href="#">Gary's Mod - Private </a>{" "}
          <span id="running">Running </span>
        </li>
        <li>
          <a href="#">Minecraft - Underground City</a>{" "}
          <span id="running">Running </span>
        </li>
        <li>
          <a href="#">Minecraft - Sky Blocks </a>{" "}
          <span id="ready"> Ready </span>
        </li>
      </ul>
      <button id="add-server">+</button>
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
    <Footer>
      <div>
        <div id="footer-logo">
          <img src="../images/EasyGSM Logo.png" alt="EasyGSM Logo" />
        </div>
        <div id="footer-text">
          EasyGSM is an open source software. Please credit
          https://github.com/M4STERAC/EasyGSM as the first author of the program
          in all areas where credit is due.
        </div>
      </div>
    </Footer>
  </div>
);



export default Main;