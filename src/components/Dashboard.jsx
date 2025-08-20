import React from "react";
import { Link } from "react-router-dom";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import Sidebar from "./Sidebar";
import Searchbar from "./Searchbar";
import "../css/Dashboard.css";

import { FaArrowRightLong } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";

import graph1 from "../assets/graph1.png";
import graph2 from "../assets/graph2.png";
import aina from '../assets/aina.png'
import wade from '../assets/wade.png'
import jenny from '../assets/jenny.png'
import jane from '../assets/jane.png'

const Dashboard = () => {
  const topTableHead = ["Name", "Type", "Last Login", "Cases"];
  const topTableContents = [
    {
      image: aina,
      name: "Modupe Aina",
      type: "Victim",
      lastlogin: "Today",
      cases: 2,
    },
    {
      image: jane,
      name: "Jane Doe",
      type: "Witness",
      lastlogin: "Today",
      cases: 1,
    },
    {
      image: wade,
      name: "Wade Warren",
      type: "Witness",
      lastlogin: "Yesterday",
      cases: 4,
    },
    {
      image: jenny,
      name: "Jenny Wilson",
      type: "Victim",
      lastlogin: "Yesterday",
      cases: 1,
    },
  ];

  const secondTableHead = ["CaseNo","Type", "Status", "Tracking", "Date",""];
  const secondTableContent=[
    {
      id:"A1208",
      type:"Sexual Harrassment",
      status:"Pending",
      color:"#EAC400",
      bgcolor:"#EAC4001A",
      width:"35.88px",
    },
    {
      id:"A2051",
      type:"Gender-based Violence",
      status:"In progress",
      color:"#3DACF5",
      bgcolor:"#3DACF51A",
      width:"90.27px",
    },
    {
      id:"A2351",
      type:"Rape Issues",
      status:"Resolved",
      color:"#48C9B0",
      bgcolor:"#48C9B01A",
      width:"100%",
    },
    {
      id:"A2051",
      type:"Gender-based Violence",
      status:"Pending",
      color:"#EAC400",
      bgcolor:"#EAC4001A",
      width:"62.27px",
    },
  ]

const Dashboard = [
  {
    text:"new users",
    number:"20",
    percent:"+15",
    image:graph1,
    color:"#48C9B0",
    bgcolor:"#48C9B01A"
  },
  {
    text:"new reports",
    number:"17",
    percent:"-0.15",
    image:graph2,
    color:"#FF0909",
    bgcolor:"#FF09091A",
  },
  {
    text:"total users",
    number:"205",
    percent:"+15",
    image:graph1,
    color:"#48C9B0",
    bgcolor:"#48C9B01A",
  },
  {
    text:"total reports",
    number:"317",
    percent:"+15",
    image:graph1,
    color:"#48C9B0",
    bgcolor:"#48C9B01A",
  }
]

  return (
    <div className="dashboard-container">
      <Sidebar />
      <Searchbar />

      <div className="dashboard">
        <div className="first-section">
          <div className="heading">
            <p>Dashboard</p>
            <button>
              {" "}
              <HiOutlineAdjustmentsVertical size={24} />
              Filter
            </button>
          </div>
          <div className="cards">
        {Dashboard.map((value, index) => (
          <Dashboardcard
            key={index} 
            text={value.text}
            number={value.number}
            percent={value.percent}
            image={value.image}
            color={value.color}
            bgcolor={value.bgcolor}
          />
        ))}
          </div>
        </div>

        <div className="middle-section">
          <div className="users-section">
            <div className="users-head">
              <div className="left">
                <p>Users</p>
                <p>See recent user activities</p>
              </div>
              <Link to="/users" className="link">
                <button className="see-all">
                  See All <FaArrowRightLong />
                </button>
              </Link>
            </div>

            <div className="users-body">
              <table>
                <thead className="thead">
                  <tr>
                    {topTableHead.map((value, index) => (
                      <th key={index}>{value}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topTableContents.map((value, index) => (
                    <UsersList
                      key={index}
                      image={value.image}
                      type={value.type}
                      name={value.name}
                      lastlogin={value.lastlogin}
                      cases={value.cases}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="zen-section">
            <div className="zen-head">
              <p>Zen Exercises</p>
              <p>Most popular exercise per week</p>
            </div>
            <div className="exercises">
              <ZenExercise text="Sleep" width="185px" color="#FF3389" />
              <ZenExercise text="Meditation" width="73px" color="#E0E0E0" />
              <ZenExercise text="Anxiety" width="139px" color="#E0E0E0" />
              <ZenExercise text="Journaling" width="110px" color="#E0E0E0" />
            </div>
            <button>Add New Exercise +</button>
          </div>
        </div>

        <div className="right-section">
          <div className="reports-overview">
            <p>Reports Overview</p>
            <Doughnut
              data={{
                labels: [
                  "Gender-based Violence",
                  "Sexual Harrassment",
                  "Rape Issues",
                ],
                datasets: [
                  {
                    labels: "Report",
                    data: [40, 45, 15],
                    backgroundColor: ["#FF7C33", "#FF3389", "#A537FB"],
                    borderRadius: 4,
                  },
                ],
              }}
            />
            <div className="divider"></div>
            <Doughnut
              data={{
                labels: ["Pending", "In Progress", "Resolved", "Closed"],
                datasets: [
                  {
                    labels: "Report",
                    data: [17, 25, 43, 15],
                    backgroundColor: [
                      "#4ECBB2",
                      "#3DACF5",
                      "#FED634",
                      "#999999",
                    ],
                    borderRadius: 4,
                  },
                ],
              }}
            />
          </div>
        </div>

        <div className="bottom-section">
          <div className="reports-section">
            <div className="reports-head">
              <div className="left">
                <p>Reports</p>
                <p>See all your reports here</p>
              </div>
              <Link to="/Reports" className="link">
                <button className="see-all">
                  See All <FaArrowRightLong />
                </button>
              </Link>
            </div>
            <div className="reports-body">
              <table>
                <thead>
                  <tr>
                    {secondTableHead.map((value, index) => (
                      <th key={index}>{value}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {secondTableContent.map((value, index) => (
                    <ReportList
                      key={index}
                      id={value.id}
                      type={value.type}
                      status={value.status}
                      color={value.color}
                      bgcolor={value.bgcolor}
                      width={value.width}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Dashboardcard({ text, number, percent, image, color, bgcolor }) {
  return (
    <>
      <div className="card">
        <div className="card-content">
          <p>{text.toUpperCase()}</p>
          <p>
            {number}{" "}
            <span style={{ color: color, background: bgcolor }}>
              {percent}%
            </span>
          </p>
        </div>
        <img src={image} alt="graph" />
      </div>
    </>
  );
}

function UsersList({ image, name, type, lastlogin, cases }) {
  return (
    <>
      <tr>
        <td className="user-name">
          <img src={image} alt="image" />
          <p>{name}</p>
        </td>
        <td>{type}</td>
        <td>{lastlogin}</td>
        <td>{cases}</td>
      </tr>
    </>
  );
}

function ZenExercise({ text, width, color }) {
  return (
    <>
      <div className="exercise">
        <p>{text}</p>
        <div
          className="progress-bar"
          style={{ width: width, background: color }}
        ></div>
      </div>
    </>
  );
}

function ReportList({ id, type, status, color, bgcolor, width }) {
  const today = new Date();
  const formattedDate = today.toDateString();

  const progressWidth =
    status === "Resolved" || status === "Closed" ? "100%" : width;

  return (
    <tr>
      <td>{id}</td>
      <td>{type}</td>
      <td style={{ color: color, background: bgcolor }} className="status">
        {status}
      </td>
      <td>
        <div className="progress-bar">
          <div className="progress" style={{ width: progressWidth }}></div>
        </div>
      </td>
      <td>{formattedDate}</td>
      <td>
        <button className="icon">
          <HiDotsHorizontal />
        </button>
      </td>
    </tr>
  );
}

export default Dashboard;
