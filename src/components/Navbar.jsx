import { useState } from "react";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/auth";
import cfLogo from "../assets/CF.png";

function Navbar() {

    const navigate = useNavigate();
    const user = getUser();

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        logout();
        setShowLogoutModal(false);
        navigate("/", { replace: true });
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4 py-3">

                <div className="container-fluid">

                    <img
                        src={cfLogo}
                        alt="CueFox"
                        style={{
                            height: "56px",
                            width: "auto",
                            objectFit: "contain",
                            marginTop: "2px"
                        }}
                    />

                    <div className="d-flex align-items-center gap-4">

                        <FaBell size={22} />

                        <div className="d-flex align-items-center">

                            <FaUserCircle
                                size={34}
                                className="me-2 text-primary"
                            />

                            <div>

                                <div className="fw-bold">
                                    {user?.username || "Admin"}
                                </div>

                                <small className="text-muted">
                                    CueFox Administrator
                                </small>

                            </div>

                        </div>

                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => setShowLogoutModal(true)}
                        >
                            <FaSignOutAlt className="me-1" />
                            Logout
                        </button>

                    </div>

                </div>

            </nav>

            {/* Logout Modal */}
            {showLogoutModal && (
                <>
                    {/* Backdrop */}
                    <div
                        className="modal-backdrop fade show"
                        onClick={() => setShowLogoutModal(false)}
                    ></div>

                    {/* Modal */}
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                    >
                        <div className="modal-dialog modal-dialog-centered">

                            <div className="modal-content border-0 shadow-lg rounded-4">

                                <div className="modal-header border-0">

                                    <h5 className="modal-title fw-bold">
                                        Confirm Logout
                                    </h5>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowLogoutModal(false)}
                                    ></button>

                                </div>

                                <div className="modal-body text-center py-4">

                                    <FaSignOutAlt
                                        size={55}
                                        className="text-danger mb-3"
                                    />

                                    <h5 className="fw-bold">
                                        Are you sure?
                                    </h5>

                                    <p className="text-muted mb-0">
                                        You are about to logout from CueFox.
                                    </p>

                                </div>

                                <div className="modal-footer border-0 justify-content-center pb-4">

                                    <button
                                        className="btn btn-secondary px-4"
                                        onClick={() => setShowLogoutModal(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="btn btn-danger px-4"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>

                                </div>

                            </div>

                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default Navbar;