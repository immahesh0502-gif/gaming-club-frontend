import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AdminLayout() {
    return (
        <div
            className="d-flex"
            style={{ height: "100vh", overflow: "hidden" }}
        >
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Right Side */}
            <div
                className="flex-grow-1 d-flex flex-column"
                style={{ overflow: "hidden" }}
            >
                {/* Fixed Navbar */}
                <Navbar />

                {/* Scrollable Content */}
                <div
                    className="container-fluid p-4"
                    style={{
                        flex: 1,
                        overflowY: "auto"
                    }}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;