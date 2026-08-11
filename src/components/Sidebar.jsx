import { NavLink } from "react-router-dom";
import {
    FaTachometerAlt,
    FaGamepad,
    FaUsers,
    FaChartBar,
    FaClock,
    FaLock
} from "react-icons/fa";
import { useEffect, useState } from "react";

import {
    closeBusinessDay,
    openBusinessDay,
    getCurrentBusinessDay
} from "../services/businessDayService";
import cuefoxLogo from "../assets/cuefox.png";
import Swal from "sweetalert2";

function Sidebar() {

    const [businessDay, setBusinessDay] = useState(null);
    useEffect(() => {
        async function loadBusinessDay() {
            try {
                const response = await getCurrentBusinessDay();
                setBusinessDay(response.data);
            } catch {
                setBusinessDay(null);
            }
        }

        loadBusinessDay();
    }, []);

    const handleOpenBusinessDay = async () => {

        try {

            const response = await openBusinessDay();

            await Swal.fire({
                title: "✅ Business Day Opened",
                html: `
                <div style="text-align:left;font-size:16px;">
                    <p><strong>📅 Date:</strong> ${response.data.businessDate}</p>
                    <p><strong>🟢 Business Day #${response.data.id}</strong></p>
                    <hr/>
                    <p style="color:green;">
                        Business Day has been opened successfully.
                    </p>
                </div>
            `,
                icon: "success",
                confirmButtonColor: "#198754"
            });

            window.location.reload();

        } catch (error) {

            console.error(error);

            Swal.fire({
                title: "Error!",
                text: "Failed to open Business Day.",
                icon: "error",
                confirmButtonColor: "#dc3545"
            });

        }

    };

    const handleDayClose = async () => {

        const result = await Swal.fire({
            title: "Close Business Day?",
            text: "Are you sure you want to close today's business?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, Close",
            cancelButtonText: "Cancel"
        });

        if (!result.isConfirmed) return;

        try {

            const response = await closeBusinessDay();

            await Swal.fire({
                title: "✅ Business Day Closed",
                html: `
        <div style="text-align:left;font-size:16px;">
            <p><strong>📅 Date:</strong> ${response.data.businessDate}</p>
            <p><strong>💰 Revenue:</strong> ₹${response.data.totalRevenue}</p>
            <p><strong>🎱 Sessions:</strong> ${response.data.totalSessions}</p>
            <p><strong>👤 Customers:</strong> ${response.data.totalCustomers}</p>
            <hr/>
            <p style="color:green;">
                Business Day has been closed successfully.
            </p>
        </div>
    `,
                icon: "success",
                confirmButtonColor: "#198754"
            });

            window.location.reload();

        } catch (error) {

            console.error(error);

            Swal.fire({
                title: "Error!",
                text: "Failed to close Business Day.",
                icon: "error",
                confirmButtonColor: "#dc3545"
            });

        }

    };

    return (
        <div
            className="bg-dark text-white p-3 d-flex flex-column "
            style={{
                width: "195px",
                height: "100vh",
                position: "sticky",
                top: 0,
                flexShrink: 0
            }}
        >
            <div className="text-center mb-4">
                <img
                    src={cuefoxLogo}
                    alt="CueFox"
                    style={{
                        width: "130px",
                        height: "80px",
                        objectFit: "contain"
                    }}
                />
            </div>

            <ul className="nav flex-column flex-grow-1">

                <li className="nav-item mb-2">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                        }
                    >
                        <FaTachometerAlt className="me-2" />
                        Dashboard
                    </NavLink>
                </li>

                <li className="nav-item mb-2">
                    <NavLink
                        to="/resources"
                        className={({ isActive }) =>
                            `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                        }
                    >
                        <FaGamepad className="me-2" />
                        Resources
                    </NavLink>
                </li>

                <li className="nav-item mb-2">
                    <NavLink
                        to="/sessions"
                        className={({ isActive }) =>
                            `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                        }
                    >
                        <FaClock className="me-2" />
                        Sessions
                    </NavLink>
                </li>

                <li className="nav-item mb-2">
                    <NavLink
                        to="/customers"
                        className={({ isActive }) =>
                            `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                        }
                    >
                        <FaUsers className="me-2" />
                        Customers
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink
                        to="/reports"
                        className={({ isActive }) =>
                            `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                        }
                    >
                        <FaChartBar className="me-2" />
                        Reports
                    </NavLink>
                </li>

            </ul>
            <hr className="border-secondary" />

            {businessDay?.status === "OPEN" ? (
                <button
                    className="btn btn-danger w-100"
                    onClick={handleDayClose}
                >
                    <FaLock className="me-2" />
                    Day Close
                </button>
            ) : (
                <button
                    className="btn btn-success"
                    onClick={handleOpenBusinessDay}
                >
                    Open Business Day
                </button>
            )}
        </div>
    );
}

export default Sidebar;