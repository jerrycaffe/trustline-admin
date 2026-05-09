import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import Sidebar from "./Sidebar";
import Searchbar from "./Searchbar";
import "../css/Dashboard.css";
import { api } from "../services/api";

import { FaArrowRightLong } from "react-icons/fa6";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { BsPersonFill } from "react-icons/bs";

import graph1 from "../assets/graph1.png";
import graph2 from "../assets/graph2.png";
import profilepic from "../assets/profilepic.png";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    type: "success",
    message: "",
  });
  const [filters, setFilters] = useState({
    incidentType: "",
    status: "",
    date: "",
  });

  const topTableHead = ["Name", "Email"];
  const reportTypeLegend = [
    { label: "Gender-based Violence", value: "40%", color: "#FF7C33" },
    { label: "Sexual Harrassment", value: "45%", color: "#FF3389" },
    { label: "Rape Issues", value: "15%", color: "#A537FB" },
  ];
  const reportStatusLegend = [
    { label: "Pending", value: "17%", color: "#FED634" },
    { label: "In Progress", value: "25%", color: "#3DACF5" },
    { label: "Resolved", value: "43%", color: "#4ECBB2" },
    { label: "Closed", value: "15%", color: "#999999" },
  ];

  const incidentTypeOptions = reportTypeLegend.map((item) => item.label);
  const reportStatusOptions = reportStatusLegend.map((item) => item.label);

  const showToast = (type, message) => {
    setToast({
      visible: true,
      type,
      message,
    });
  };

  const closeToast = () => {
    setToast((prevToast) => ({
      ...prevToast,
      visible: false,
    }));
  };

  const closeFilterModal = () => {
    if (!isFetchingData) {
      setIsFilterModalOpen(false);
    }
  };

  useEffect(() => {
    if (!toast.visible) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      closeToast();
    }, 3500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toast.visible]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !isFetchingData) {
        setIsFilterModalOpen(false);
      }
    };

    if (isFilterModalOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isFilterModalOpen, isFetchingData]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      incidentType: "",
      status: "",
      date: "",
    });
  };

  const handleApplyFilters = async (event) => {
    event.preventDefault();

    const query = new URLSearchParams();

    if (filters.incidentType) {
      query.append("incidentType", filters.incidentType);
    }

    if (filters.status) {
      query.append("status", filters.status);
    }

    if (filters.date) {
      query.append("date", filters.date);
    }

    const endpoint = query.toString()
      ? `api/v1/dashboard?${query.toString()}`
      : "api/v1/dashboard";

    try {
      setIsFetchingData(true);
      await api.get(endpoint);
      showToast("success", "Dashboard data fetched successfully.");
      closeFilterModal();
    } catch (error) {
      showToast(
        "error",
        error.message || "Unable to fetch dashboard data right now."
      );
    } finally {
      setIsFetchingData(false);
    }
  };
  const overviewChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: '62%',
    maintainAspectRatio: false,
  };
  const topTableContents = [
    {
      gender: "female",
      name: "Modupe Aina",
      email: "modupe.aina@example.com",
    },
    {
      gender: "female",
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
    {
      gender: "male",
      name: "Wade Warren",
      email: "wade.warren@example.com",
    },
    {
      gender: "not mentioned",
      name: "Jenny Wilson",
      email: "jenny.wilson@example.com",
    },
  ];

  const secondTableHead = ["Case No", "Type", "Status", "Tracking", "Reported Date"];
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

const dashboardCards = [
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

  function handleOpenUserDetails(user) {
    const sourcePath = `${location.pathname}${location.search}${location.hash}`;

    navigate("/users/details", {
      state: {
        from: sourcePath,
        user: {
          image: profilepic,
          name: user.name,
          type: user.gender || "Not Mentioned",
          email: user.email,
          phoneNumber: user.phoneNumber || "Not available",
          dateRegistered: user.dateRegistered || "Not available",
          lastLogin: user.lastLogin || "Not available",
          ongoingCases: user.ongoingCases || "0",
          closedCases: user.closedCases || "0",
        },
      },
    });
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <Searchbar />

      <div className="dashboard">
        <div className="first-section">
          <div className="heading">
            <p>Dashboard</p>
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              disabled={isFetchingData}
              aria-haspopup="dialog"
              aria-expanded={isFilterModalOpen}
            >
              <HiOutlineAdjustmentsVertical size={24} />
              Filter
            </button>
          </div>
          <div className="cards">
        {dashboardCards.map((value, index) => (
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

        <div className="content-row">
          <div className="left-column">
          <div className="users-zen-row">
          <div className="users-section">
          <div className="users-head">
            <div className="left">
              <p>Users</p>
              <p>Recently joined users</p>
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
                    user={value}
                    gender={value.gender}
                    name={value.name}
                    email={value.email}
                    onOpenDetails={handleOpenUserDetails}
                  />
                ))}
              </tbody>
            </table>
          </div>
          </div>

          <div className="zen-section">
            <div className="zen-head">
              <p>Healing Activities</p>
              <p>Most popular activity</p>
            </div>
            <div className="exercises">
              <ZenExercise text="Sleep" width="185px" color="#FF3389" />
              <ZenExercise text="Meditation" width="73px" color="#E0E0E0" />
              <ZenExercise text="Anxiety" width="139px" color="#E0E0E0" />
              <ZenExercise text="Journaling" width="110px" color="#E0E0E0" />
              <ZenExercise text="Others" width="92px" color="#E0E0E0" />
            </div>
            <button>Add New Exercise +</button>
          </div>
          </div>{/* end users-zen-row */}

          <div className="bottom-section">
          <div className="reports-section">
            <div className="reports-head">
              <div className="left">
                <p>Reports</p>
                <p>Recently Reported cases</p>
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
                      report={value}
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
          </div>{/* end bottom-section */}
          </div>{/* end left-column */}

          <div className="right-section">
          <div className="reports-overview">
            <p className="reports-overview-title">Reports Overview</p>
            <div className="overview-chart-block">
              <div className="overview-chart-canvas">
                <Doughnut
                  options={overviewChartOptions}
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
              </div>
              <div className="overview-legend">
                {reportTypeLegend.map((item) => (
                  <div className="overview-legend-item" key={item.label}>
                    <div className="overview-legend-label">
                      <span className="overview-legend-swatch" style={{ backgroundColor: item.color }}></span>
                      <span>{item.label}</span>
                    </div>
                    <span className="overview-legend-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="divider"></div>
            <div className="overview-chart-block">
              <div className="overview-chart-canvas">
                <Doughnut
                  options={overviewChartOptions}
                  data={{
                    labels: ["Pending", "In Progress", "Resolved", "Closed"],
                    datasets: [
                      {
                        labels: "Report",
                        data: [17, 25, 43, 15],
                        backgroundColor: [
                          "#FED634",
                          "#3DACF5",
                          "#4ECBB2",
                          "#999999",
                        ],
                        borderRadius: 4,
                      },
                    ],
                  }}
                />
              </div>
              <div className="overview-legend">
                {reportStatusLegend.map((item) => (
                  <div className="overview-legend-item" key={item.label}>
                    <div className="overview-legend-label">
                      <span className="overview-legend-swatch" style={{ backgroundColor: item.color }}></span>
                      <span>{item.label}</span>
                    </div>
                    <span className="overview-legend-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>{/* end right-section */}
        </div>{/* end content-row */}

      </div>

      {isFilterModalOpen && (
        <div
          className="filter-modal-overlay"
          onClick={closeFilterModal}
        >
          <div
            className="filter-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="filter-modal-head">
              <p id="filter-modal-title">Apply Filter</p>
              <button
                type="button"
                className="close-modal-btn"
                onClick={closeFilterModal}
                disabled={isFetchingData}
                aria-label="Close filter modal"
              >
                x
              </button>
            </div>

            <form className="filter-modal-form" onSubmit={handleApplyFilters}>
              <label htmlFor="incidentType">Incident Type</label>
              <select
                id="incidentType"
                name="incidentType"
                value={filters.incidentType}
                onChange={handleFilterChange}
              >
                <option value="">All incident types</option>
                {incidentTypeOptions.map((incidentType) => (
                  <option key={incidentType} value={incidentType}>
                    {incidentType}
                  </option>
                ))}
              </select>

              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All statuses</option>
                {reportStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <label htmlFor="date">Date</label>
              <input
                id="date"
                name="date"
                type="date"
                value={filters.date}
                onChange={handleFilterChange}
              />

              <div className="filter-modal-actions">
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={handleResetFilters}
                  disabled={isFetchingData}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={closeFilterModal}
                  disabled={isFetchingData}
                >
                  Cancel
                </button>
                <button type="submit" className="apply-btn" disabled={isFetchingData}>
                  {isFetchingData ? "Applying..." : "Apply Filter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isFetchingData && (
        <div className="dashboard-loading-overlay" aria-live="polite" role="status">
          <div className="dashboard-loading-chip">
            <span className="loading-spinner" aria-hidden="true"></span>
            <span>Fetching dashboard data...</span>
          </div>
        </div>
      )}

      {toast.visible && (
        <div
          className={`dashboard-toast dashboard-toast-${toast.type}`}
          role={toast.type === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          <p>{toast.message}</p>
          <button type="button" onClick={closeToast} aria-label="Close notification">
            x
          </button>
        </div>
      )}
    </div>
  );
};

function Dashboardcard({ text, number, percent, image, color, bgcolor }) {
  return (
    <>
      <div className="card">
        <div className="card-content">
          <p className="font-22px">{text.toUpperCase()}</p>
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

function GenderAvatar({ gender }) {
  const config = {
    male: { color: "#3DACF5", bg: "#3DACF51A" },
    female: { color: "#FF3389", bg: "#FF33891A" },
    "not mentioned": { color: "#999999", bg: "#9999991A" },
  };
  const key = (gender || "not mentioned").toLowerCase();
  const { color, bg } = config[key] || config["not mentioned"];
  return (
    <span className="gender-avatar" style={{ backgroundColor: bg, color }}>
      <BsPersonFill size={15} />
    </span>
  );
}

function UsersList({ user, gender, name, email, onOpenDetails }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenDetails(user);
    }
  };

  return (
    <>
      <tr
        className="user-row-clickable"
        onClick={() => onOpenDetails(user)}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        <td className="user-name">
          <GenderAvatar gender={gender} />
          <p>{name}</p>
        </td>
        <td>{email}</td>
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

function ReportList({ report, id, type, status, color, bgcolor, width }) {
  const navigate = useNavigate();
  const location = useLocation();

  const progressWidth =
    status === "Resolved" || status === "Closed" ? "100%" : width;

function formatDate(date) {
  const d = new Date(date);
  const day = d.getDate();
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const year = d.getFullYear();

  const getOrdinalSuffix = (number) => {
    if (number >= 11 && number <= 13) {
      return "th";
    }

    switch (number % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${weekday}, ${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

  const handleOpenReportDetails = () => {
    const sourcePath = `${location.pathname}${location.search}${location.hash}`;

    navigate("/reports/details", {
      state: {
        from: sourcePath,
        report: {
          ...report,
          id,
          type,
          status,
        },
      },
    });
  };

  const handleReportRowKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenReportDetails();
    }
  };

  return (
    <>
    <tr
      className="report-row-clickable"
      onClick={handleOpenReportDetails}
      onKeyDown={handleReportRowKeyDown}
      role="button"
      tabIndex={0}
    >
      <td>{id}</td>
      <td>{type}</td>
      <td className="status-cell">
        <span
          className="status-badge"
          style={{
            "--status-text": color,
            "--status-bg": bgcolor,
          }}
        >
          {status}
        </span>
      </td>
      <td>
        <div className="progress-bar">
          <div className="progress" style={{ width: progressWidth }}></div>
        </div>
      </td>
      <td>{formatDate(new Date())}</td>
    </tr>
  </>);
}

export default Dashboard;
