import { useEffect, useState } from "react";

import DashboardCard from "../components/DashboardCard";

import ResourceCard from "../components/ResourceCard";

import snookerImage from "../assets/snookertable.png";
import playstationImage from "../assets/playstation.png";
import carromImage from "../assets/carrom.png";
import {
    FaMoneyBillWave,
    FaUsers,
    FaGamepad,
    FaClock,

} from "react-icons/fa";

import { getDashboard } from "../services/dashboardService";
import { getAllSessions } from "../services/sessionService";

import {
    getCurrentBusinessDay
} from "../services/businessDayService";

import {
    FaCalendarAlt,
    FaCheckCircle,

} from "react-icons/fa";

function Dashboard() {

    const [sessions, setSessions] = useState([]);

    const [dashboard, setDashboard] = useState({
        totalRevenue: 0,
        totalSessions: 0,
        totalCustomers: 0,
        activeSessions: 0,
        availableResources: 0,
        occupiedResources: 0,
        totalResources: 0
    });
    const [businessDay, setBusinessDay] = useState(null);

    async function loadData() {

        try {

            const sessionResponse = await getAllSessions();
            setSessions(sessionResponse.data);

            const dashboardResponse = await getDashboard();
            setDashboard(dashboardResponse.data);

            try {
                const businessDayResponse = await getCurrentBusinessDay();
                setBusinessDay(businessDayResponse.data);
            } catch {
                setBusinessDay(null);
            }

        } catch (error) {

            console.error(error);

        }

    }
    useEffect(() => {
        const fetchData = async () => {
            await loadData();
        };

        fetchData();
    }, []);



    const isRunning = (resourceName) => {
        return sessions?.some(
            (session) =>
                session.resource?.name === resourceName &&
                session.status === "RUNNING"
        );
    };

    const snookerResources = [
        {
            name: "Table 1",
            running: isRunning("Table 1")
        },
        {
            name: "Table 2",
            running: isRunning("Table 2")
        },
        {
            name: "Table 3",
            running: isRunning("Table 3")
        },
        {
            name: "Table 4",
            running: isRunning("Table 4")
        }
    ];

    const playstationResources = [
        {
            name: "PS5-1",
            running: isRunning("PS5-1")
        },
        {
            name: "PS5-2",
            running: isRunning("PS5-2")
        }
    ];

    const carromResources = [
        {
            name: "Carrom",
            running: isRunning("Carrom")
        }
    ];






    return (
        <div>
            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <div>

                            <h5 className="fw-bold mb-1">
                                Business Day Information
                            </h5>

                            <small className="text-muted">
                                Business Day #{businessDay?.id || "--"}
                            </small>

                        </div>

                        <span
                            className={`badge fs-6 ${
                                businessDay?.status === "OPEN"
                                    ? "bg-success"
                                    : "bg-danger"
                            }`}
                        >
                {businessDay?.status || "CLOSED"}
            </span>

                    </div>

                    <hr />

                    <div className="row">

                        <div className="col-lg-3 col-md-6 mb-3">

                            <div className="d-flex align-items-center">

                                <FaCalendarAlt
                                    className="text-primary me-2"
                                    size={20}
                                />

                                <div>

                                    <small className="text-muted">
                                        {businessDay?.id
                                            ? `Business Day #${businessDay.id}`
                                            : "No Business Day Open"}
                                    </small>

                                    <div className="fw-bold">
                                        {businessDay?.businessDate
                                            ? new Date(businessDay.businessDate).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })
                                            : "--"}
                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="col-lg-3 col-md-6 mb-3">

                            <div className="d-flex align-items-center">

                                <FaCheckCircle
                                    className={
                                        businessDay?.status === "OPEN"
                                            ? "text-success me-2"
                                            : "text-danger me-2"
                                    }
                                    size={20}
                                />

                                <div>

                                    <small className="text-muted">
                                        Status
                                    </small>

                                    <div className="fw-bold">
                                        {businessDay?.status || "CLOSED"}
                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="col-lg-3 col-md-6 mb-3">

                            <div className="d-flex align-items-center">

                                <FaClock
                                    className="text-warning me-2"
                                    size={20}
                                />

                                <div>

                                    <small className="text-muted">
                                        Open Time
                                    </small>

                                    <div className="fw-bold">
                                        {businessDay?.openTime
                                            ? new Date(businessDay.openTime).toLocaleTimeString("en-US", {
                                                hour: "numeric",
                                                minute: "2-digit",
                                            })
                                            : "--"}
                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="col-lg-3 col-md-6 mb-3">

                            <div className="d-flex align-items-center">

                                <FaClock
                                    className="text-danger me-2"
                                    size={20}
                                />

                                <div>

                                    <small className="text-muted">
                                        Expected Close
                                    </small>

                                    <div className="fw-bold">
                                        {businessDay?.expectedCloseTime
                                            ? new Date(businessDay.expectedCloseTime).toLocaleTimeString("en-US", {
                                                hour: "numeric",
                                                minute: "2-digit",
                                            })
                                            : "--"}
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <div className="row g-4">

                <div className="col-lg-3 col-md-6">
                    <DashboardCard
                        title="Today's Revenue"
                        value={`₹${dashboard.totalRevenue}`}
                        color="green"
                        icon={<FaMoneyBillWave color="green" />}
                    />
                </div>

                <div className="col-lg-3 col-md-6">
                    <DashboardCard
                        title="Active Sessions"
                        value={dashboard.activeSessions}
                        color="#0d6efd"
                        icon={<FaClock color="#0d6efd" />}
                    />
                </div>

                <div className="col-lg-3 col-md-6">
                    <DashboardCard
                        title="Resources"
                        value={dashboard.totalResources}
                        color="#ffc107"
                        icon={<FaGamepad color="#ffc107" />}
                    />
                </div>

                <div className="col-lg-3 col-md-6">
                    <DashboardCard
                        title="Customers"
                        value={dashboard.totalCustomers}
                        color="#dc3545"
                        icon={<FaUsers color="#dc3545" />}
                    />
                </div>

            </div>

            <hr className="my-5" />

            <div className="row g-4">

                <div className="col-lg-4">

                    <ResourceCard
                        title="Snooker Tables"
                        image={snookerImage}
                        resources={snookerResources}
                    />

                </div>

                <div className="col-lg-4">

                    <ResourceCard
                        title="PlayStation"
                        image={playstationImage}
                        resources={playstationResources}
                    />

                </div>

                <div className="col-lg-4">

                    <ResourceCard
                        title="Carrom Board"
                        image={carromImage}
                        resources={carromResources}
                    />

                </div>

            </div>

        </div>



    );
}

export default Dashboard;