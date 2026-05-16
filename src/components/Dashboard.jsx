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

const INCIDENT_TYPE_COLORS = [
  "#FF7C33",
  "#FF3389",
  "#A537FB",
  "#3DACF5",
  "#4ECBB2",
  "#FED634",
  "#FF6B6B",
  "#7C4DFF",
];

const STATUS_COLORS = {
  PENDING: "#FED634",
  "IN_PROGRESS": "#3DACF5",
  "IN PROGRESS": "#3DACF5",
  INPROGRESS: "#3DACF5",
  RESOLVED: "#4ECBB2",
  CLOSED: "#999999",
};

const STATUS_BADGE_COLORS = {
  PENDING: { color: "#EAC400", bg: "#EAC4001A" },
  "IN_PROGRESS": { color: "#3DACF5", bg: "#3DACF51A" },
  "IN PROGRESS": { color: "#3DACF5", bg: "#3DACF51A" },
  INPROGRESS: { color: "#3DACF5", bg: "#3DACF51A" },
  RESOLVED: { color: "#48C9B0", bg: "#48C9B01A" },
  CLOSED: { color: "#999999", bg: "#9999991A" },
};

const ACTIVITY_BAR_COLORS = ["#FF3389", "#A537FB", "#3DACF5", "#4ECBB2", "#FED634"];

const titleCase = (value) => {
  if (!value) return "";
  return String(value)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatPercent = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "0";
  const num = Number(value);
  const rounded = Math.round(num * 100) / 100;
  return (num > 0 ? "+" : "") + rounded;
};

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [overview, setOverview] = useState(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
  const [overviewError, setOverviewError] = useState("");
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

  const fetchOverview = async (params = {}) => {
    const query = new URLSearchParams();
    if (params.incidentType) query.append("incidentType", params.incidentType);
    if (params.status) query.append("status", params.status);
    if (params.date) query.append("date", params.date);
    const endpoint = query.toString()
      ? `api/v1/admin/dashboard/overview?${query.toString()}`
      : "api/v1/admin/dashboard/overview";
    const result = await api.get(endpoint);
    return result?.data ?? result ?? {};
  };

  useEffect(() => {
    let cancelled = false;
    const loadOverview = async () => {
      try {
        setIsLoadingOverview(true);
        const payload = await fetchOverview();
        if (cancelled) return;
        setOverview(payload);
        setOverviewError("");
      } catch (error) {
        if (cancelled) return;
        setOverviewError(error.message || "Unable to load dashboard overview.");
      } finally {
        if (!cancelled) setIsLoadingOverview(false);
      }
    };
    loadOverview();
    return () => {
      cancelled = true;
    };
  }, []);

  const topTableHead = ["Name", "Email"];

  const casesByIncidentType = Array.isArray(overview?.casesByIncidentType)
    ? overview.casesByIncidentType
    : [];
  const casesByStatus = Array.isArray(overview?.casesByStatus)
    ? overview.casesByStatus
    : [];

  const incidentTotal = casesByIncidentType.reduce(
    (sum, item) => sum + Number(item?.count ?? item?.value ?? 0),
    0
  );
  const statusTotal = casesByStatus.reduce(
    (sum, item) => sum + Number(item?.count ?? item?.value ?? 0),
    0
  );

  const reportTypeLegend = casesByIncidentType.length
    ? casesByIncidentType.map((item, idx) => {
        const label = titleCase(item?.incidentType ?? item?.type ?? item?.label ?? "Unknown");
        const count = Number(item?.count ?? item?.value ?? 0);
        const pct = item?.percentage != null
          ? Number(item.percentage)
          : incidentTotal
          ? (count / incidentTotal) * 100
          : 0;
        return {
          label,
          count,
          value: `${Math.round(pct)}%`,
          color: INCIDENT_TYPE_COLORS[idx % INCIDENT_TYPE_COLORS.length],
        };
      })
    : [
        { label: "Gender-based Violence", count: 0, value: "0%", color: "#FF7C33" },
        { label: "Sexual Harrassment", count: 0, value: "0%", color: "#FF3389" },
        { label: "Rape Issues", count: 0, value: "0%", color: "#A537FB" },
      ];

  const reportStatusLegend = casesByStatus.length
    ? casesByStatus.map((item, idx) => {
        const rawStatus = item?.status ?? item?.label ?? "Unknown";
        const label = titleCase(rawStatus);
        const count = Number(item?.count ?? item?.value ?? 0);
        const pct = item?.percentage != null
          ? Number(item.percentage)
          : statusTotal
          ? (count / statusTotal) * 100
          : 0;
        const key = String(rawStatus).toUpperCase();
        return {
          label,
          count,
          value: `${Math.round(pct)}%`,
          color:
            STATUS_COLORS[key] ||
            INCIDENT_TYPE_COLORS[idx % INCIDENT_TYPE_COLORS.length],
        };
      })
    : [
        { label: "Pending", count: 0, value: "0%", color: "#FED634" },
        { label: "In Progress", count: 0, value: "0%", color: "#3DACF5" },
        { label: "Resolved", count: 0, value: "0%", color: "#4ECBB2" },
        { label: "Closed", count: 0, value: "0%", color: "#999999" },
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
    try {
      setIsFetchingData(true);
      const payload = await fetchOverview(filters);
      setOverview(payload);
      setOverviewError("");
      showToast("success", "Dashboard filtered successfully.");
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
  const topTableContents = Array.isArray(overview?.newUsers) && overview.newUsers.length
    ? overview.newUsers.map((user) => {
        const firstName = user?.firstName || "";
        const lastName = user?.lastName || "";
        const composed = `${firstName} ${lastName}`.trim();
        return {
          gender: (user?.gender || "not mentioned").toLowerCase(),
          name: composed || user?.name || user?.fullName || user?.username || "Unknown",
          email: user?.email || user?.emailAddress || "—",
          phoneNumber: user?.phoneNumber || user?.phone,
          dateRegistered: user?.createdAt || user?.dateRegistered,
          lastLogin: user?.lastLogin,
        };
      })
    : [];

  const secondTableHead = ["Case No", "Type", "Status", "Tracking", "Reported Date"];
  const secondTableContent = Array.isArray(overview?.recentCases) && overview.recentCases.length
    ? overview.recentCases.map((c) => {
        const status = titleCase(c?.status ?? "Pending");
        const key = String(c?.status ?? "PENDING").toUpperCase();
        const badge = STATUS_BADGE_COLORS[key] || STATUS_BADGE_COLORS.PENDING;
        return {
          id: c?.caseNumber || c?.caseNo || c?.id || "—",
          type: titleCase(c?.incidentType ?? c?.type ?? "—"),
          status,
          color: badge.color,
          bgcolor: badge.bg,
          width: key === "RESOLVED" || key === "CLOSED" ? "100%" : "50%",
          reportedAt: c?.reportedAt || c?.createdAt,
          raw: c,
        };
      })
    : [];

const buildTrend = (trend) => {
  if (!trend) {
    return { percent: "0", color: "#999999", bgcolor: "#9999991A" };
  }
  const direction = String(trend.direction || "").toUpperCase();
  const pct = trend.percentageChange ?? trend.change ?? 0;
  const isIncrease = direction === "INCREASE" || Number(pct) > 0;
  return {
    percent: formatPercent(pct),
    color: isIncrease ? "#48C9B0" : "#FF0909",
    bgcolor: isIncrease ? "#48C9B01A" : "#FF09091A",
  };
};

const dashboardCards = [
  {
    text: "new users",
    number: String(overview?.newUsersCount ?? 0),
    image: graph1,
    ...buildTrend(overview?.newUsersTrend),
  },
  {
    text: "new reports",
    number: String(overview?.newReports ?? overview?.newReportsCount ?? 0),
    image: graph2,
    ...buildTrend(overview?.newReportsTrend),
  },
  {
    text: "total users",
    number: String(overview?.totalUsers ?? 0),
    percent: "0",
    image: graph1,
    color: "#48C9B0",
    bgcolor: "#48C9B01A",
  },
  {
    text: "total reports",
    number: String(overview?.totalReports ?? 0),
    percent: "0",
    image: graph1,
    color: "#48C9B0",
    bgcolor: "#48C9B01A",
  },
];

const activitiesList = Array.isArray(overview?.activities) ? overview.activities : [];
const activitiesMaxCount = activitiesList.reduce(
  (max, a) => Math.max(max, Number(a?.count ?? a?.usageCount ?? a?.value ?? 0)),
  0
);
const dashboardActivities = activitiesList.slice(0, 5).map((a, idx) => {
  const count = Number(a?.count ?? a?.usageCount ?? a?.value ?? 0);
  const ratio = activitiesMaxCount ? count / activitiesMaxCount : 0;
  return {
    label: a?.name || a?.label || a?.title || `Activity ${idx + 1}`,
    width: `${Math.max(8, Math.round(ratio * 185))}px`,
    color: idx === 0 ? ACTIVITY_BAR_COLORS[0] : "#E0E0E0",
    count,
  };
});

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
          {overviewError && (
            <div
              role="alert"
              style={{
                background: "#FF09091A",
                color: "#FF0909",
                padding: "8px 12px",
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              {overviewError}
            </div>
          )}
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
                {topTableContents.length === 0 ? (
                  <tr>
                    <td colSpan={topTableHead.length} style={{ textAlign: "center", color: "#999", padding: "16px 0" }}>
                      {isLoadingOverview ? "Loading users..." : "No new users"}
                    </td>
                  </tr>
                ) : (
                  topTableContents.map((value, index) => (
                    <UsersList
                      key={index}
                      user={value}
                      gender={value.gender}
                      name={value.name}
                      email={value.email}
                      onOpenDetails={handleOpenUserDetails}
                    />
                  ))
                )}
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
              {dashboardActivities.length ? (
                dashboardActivities.map((activity) => (
                  <ZenExercise
                    key={activity.label}
                    text={activity.label}
                    width={activity.width}
                    color={activity.color}
                  />
                ))
              ) : (
                <p style={{ fontSize: 12, color: "#999" }}>
                  {isLoadingOverview ? "Loading..." : "No activities yet"}
                </p>
              )}
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
                  {secondTableContent.length === 0 ? (
                    <tr>
                      <td colSpan={secondTableHead.length} style={{ textAlign: "center", color: "#999", padding: "16px 0" }}>
                        {isLoadingOverview ? "Loading reports..." : "No recent reports"}
                      </td>
                    </tr>
                  ) : (
                    secondTableContent.map((value, index) => (
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
                    ))
                  )}
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
                    labels: reportTypeLegend.map((i) => i.label),
                    datasets: [
                      {
                        labels: "Report",
                        data: reportTypeLegend.map((i) => i.count || 0),
                        backgroundColor: reportTypeLegend.map((i) => i.color),
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
                    labels: reportStatusLegend.map((i) => i.label),
                    datasets: [
                      {
                        labels: "Report",
                        data: reportStatusLegend.map((i) => i.count || 0),
                        backgroundColor: reportStatusLegend.map((i) => i.color),
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
      <td>{formatDate(report?.reportedAt || new Date())}</td>
    </tr>
  </>);
}

export default Dashboard;
