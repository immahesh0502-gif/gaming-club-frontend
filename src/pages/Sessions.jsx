import { useEffect, useState } from "react";
import "../styles/App.css";
import houseLogo from "../assets/houseofcue.png";
import Swal from "sweetalert2";
import {
    getAllCustomers,
    saveCustomer
} from "../services/customerService";

import {
    getAllResources

} from "../services/resourceService";

import {
    getAllSessions,
    getSessionDashboard,
    startSession as startSessionAPI,
    endSession as endSessionAPI,
    makePayment
} from "../services/sessionService";

function Sessions() {

    const [sessions, setSessions] = useState([]);

    const [sessionDashboard, setSessionDashboard] = useState({
        runningSessions: 0,
        paymentPendingSessions: 0,
        completedSessions: 0,
        todayCollection: 0
    });

    const [showModal, setShowModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");



    const [currentTime, setCurrentTime] = useState(new Date());

    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

    const [newCustomer, setNewCustomer] = useState({
        name: "",
        mobileNumber: ""
    });

    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const [selectedSession, setSelectedSession] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("CASH");

    const [cashAmount, setCashAmount] = useState("");
    const [upiAmount, setUpiAmount] = useState("");

    const [showReceipt, setShowReceipt] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [availableResources, setAvailableResources] = useState([]);

    const [customerSearch, setCustomerSearch] = useState("");

    const filteredCustomers = customers.filter((customer) =>
        (customer.name ?? "")
            .toLowerCase()
            .includes((customerSearch ?? "").toLowerCase()) ||

        String(customer.mobileNumber ?? "")
            .includes(customerSearch ?? "")
    );

    const [newSession, setNewSession] = useState({
        customerId: "",
        customerName: "",
        resource: "",
        playerCount: 1
    });
    useEffect(() => {

        const fetchData = async () => {

            try {

                // Load Customers
                const customerResponse = await getAllCustomers();
                console.log("Customers:", customerResponse.data);
                setCustomers(customerResponse.data);

                // Load Resources
                const resourceResponse = await getAllResources();
                console.log(JSON.stringify(resourceResponse.data, null, 2));

                const available = resourceResponse.data.filter(
                    (resource) => resource.status === "AVAILABLE"
                );

                // Load Session Dashboard
                const dashboardResponse = await getSessionDashboard();

                console.log("Session Dashboard:", dashboardResponse.data);

                setSessionDashboard({
                    runningSessions: dashboardResponse.data.runningSessions,
                    paymentPendingSessions: dashboardResponse.data.paymentPendingSessions,
                    completedSessions: dashboardResponse.data.completedSessions,
                    todayCollection: dashboardResponse.data.todayCollection
                });

                setSessions(dashboardResponse.data.sessions);

                console.log("Available Resources:", available);

                setAvailableResources(available);

            } catch (error) {

                console.error("Error loading data:", error);

            }

        };

        fetchData();

    }, []);

    useEffect(() => {

        const timer = setInterval(() => {

            setCurrentTime(new Date());

        }, 1000);

        return () => clearInterval(timer);

    }, []);

    const saveNewCustomer = async () => {

        if (
            newCustomer.name.trim() === "" ||
            newCustomer.mobileNumber.trim() === ""
        ) {
            alert("Please fill all fields");
            return;
        }

        try {

            const response = await saveCustomer(newCustomer);

            const savedCustomer = response.data;

            const updatedCustomers = await getAllCustomers();

            setCustomers(updatedCustomers.data);

            setNewSession({
                ...newSession,
                customerId: savedCustomer.id,
                customerName: savedCustomer.name
            });

            setCustomerSearch(savedCustomer.mobileNumber);

            setNewCustomer({
                name: "",
                mobileNumber: ""
            });

            setShowAddCustomerModal(false);

        } catch (error) {

            console.error(error);

            alert("Unable to save customer");

        }

    };

    const startSession = async () => {

        if (
            newSession.customerId === "" ||
            newSession.resource === ""
        ) {
            alert("Please fill all fields");
            return;
        }

        try {

            const selectedResource = availableResources.find(
                (resource) => resource.name === newSession.resource
            );

            await startSessionAPI({
                customerId: newSession.customerId,
                resourceId: selectedResource.id,
                playerCount: newSession.playerCount
            });

            const dashboardResponse = await getSessionDashboard();
            console.log("Dashboard Response", dashboardResponse.data);

            setSessionDashboard({
                runningSessions: dashboardResponse.data.runningSessions,
                paymentPendingSessions: dashboardResponse.data.paymentPendingSessions,
                completedSessions: dashboardResponse.data.completedSessions,
                todayCollection: dashboardResponse.data.todayCollection
            });

            setSessions(dashboardResponse.data.sessions);

            const resourceResponse = await getAllResources();

            setAvailableResources(
                resourceResponse.data.filter(
                    (resource) => resource.status === "AVAILABLE"
                )
            );

            setNewSession({
                customerId: "",
                customerName: "",
                resource: "",
                playerCount: 1
            });

            setShowModal(false);

        } catch (error) {

            console.error(error);
            alert("Unable to start session.");

        }

    };



    const collectPayment = async () => {

        try {

            const selected = sessions.find(
                s => s.id === selectedSession
            );

            if (!selected) {
                alert("Session not found.");
                return;
            }

            const totalAmount = Number(
                selected.totalAmount || 0
            );

            let cash = 0;
            let upi = 0;

            if (paymentMethod === "CASH") {

                cash = totalAmount;
                upi = 0;

            } else if (paymentMethod === "UPI") {

                cash = 0;
                upi = totalAmount;

            } else if (paymentMethod === "CARD") {

                cash = 0;
                upi = 0;

            } else if (paymentMethod === "SPLIT") {

                cash = Number(cashAmount || 0);
                upi = Number(upiAmount || 0);

                if (cash < 0 || upi < 0) {

                    alert(
                        "Payment amounts cannot be negative."
                    );

                    return;
                }

                if (Math.abs((cash + upi) - totalAmount) > 0.01) {

                    alert(
                        `Cash + UPI must equal ₹${totalAmount}.`
                    );

                    return;
                }
            }

            await makePayment({

                sessionId: selectedSession,

                paymentMethod: paymentMethod,

                cashAmount: cash,

                upiAmount: upi

            });

            const dashboardResponse =
                await getSessionDashboard();

            setSessionDashboard({

                runningSessions:
                dashboardResponse.data.runningSessions,

                paymentPendingSessions:
                dashboardResponse.data.paymentPendingSessions,

                completedSessions:
                dashboardResponse.data.completedSessions,

                todayCollection:
                dashboardResponse.data.todayCollection

            });

            setSessions(
                dashboardResponse.data.sessions
            );

            const resourceResponse =
                await getAllResources();

            setAvailableResources(
                resourceResponse.data.filter(
                    resource =>
                        resource.status === "AVAILABLE"
                )
            );

            setPaymentMethod("CASH");

            setCashAmount("");

            setUpiAmount("");

            setShowPaymentModal(false);

        } catch (error) {

            console.error(
                "Payment failed:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Payment failed."
            );
        }
    };

    const formatDateTime = (dateTime) => {

        if (!dateTime) return "-";

        const date = new Date(dateTime);

        return date.toLocaleString("en-IN", {

            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true

        });

    };

    const formatDuration = (startTime, endTime) => {

        if (!startTime || !endTime) return "-";

        const start = new Date(startTime);
        const end = new Date(endTime);

        const diff = end - start;

        const totalMinutes = Math.floor(diff / (1000 * 60));

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours === 0) {
            return `${minutes} min`;
        }

        return `${hours} hr ${minutes} min`;

    };

    const getRunningDuration = (startTime) => {

        const start = new Date(startTime);

        const diff = currentTime - start;

        const hours = Math.floor(diff / (1000 * 60 * 60));

        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${hours.toString().padStart(2, "0")} hr ${minutes
            .toString()
            .padStart(2, "0")} min ${seconds
            .toString()
            .padStart(2, "0")} sec`;
    };


    const filteredSessions = sessions.filter((session) => {

        const search = searchTerm.toLowerCase();

        return (

            session.customer?.name?.toLowerCase().includes(search) ||

            session.resource?.name?.toLowerCase().includes(search) ||

            String(session.id).includes(search)

        );

    });

    const runningSessions = filteredSessions.filter(
        session => session.status === "RUNNING"
    );

    const paymentPendingSessions = filteredSessions.filter(
        session => session.status === "PAYMENT_PENDING"
    );

    const completedSessions = filteredSessions.filter(
        session => session.status === "COMPLETED"
    );



    const renderSessionRow = (session) => (

        <tr key={session.id}>

            <td>{session.id}</td>

            <td>{session.customer?.name}</td>

            <td>{session.resource?.name}</td>

            <td>{formatDateTime(session.startTime)}</td>

            <td>{formatDateTime(session.endTime)}</td>

            <td>
                {session.status === "RUNNING"
                    ? getRunningDuration(session.startTime)
                    : formatDuration(session.startTime, session.endTime)}
            </td>

            <td>₹{session.totalAmount ?? "-"}</td>

            <td>

            <span
                className={
                    session.status === "RUNNING"
                        ? "badge bg-success px-3 py-2"
                        : session.status === "PAYMENT_PENDING"
                            ? "badge bg-warning text-dark px-3 py-2"
                            : "badge bg-secondary px-3 py-2"
                }
            >
                {session.status === "RUNNING"
                    ? "🟢 RUNNING"
                    : session.status === "PAYMENT_PENDING"
                        ? "💰 PAYMENT"
                        : "✅ COMPLETED"}
            </span>

            </td>

            <td>

                {session.status === "RUNNING" && (
                    <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={async () => {

                            const result = await Swal.fire({
                                title: "End Session?",
                                text: `Are you sure you want to end ${session.resource?.name || "this"} session?`,
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#0d6efd",
                                cancelButtonColor: "#6c757d",
                                confirmButtonText: "Yes, End Session",
                                cancelButtonText: "Cancel"
                            });

                            if (!result.isConfirmed) {
                                return;
                            }

                            try {

                                await endSessionAPI(session.id);

                                const dashboardResponse = await getSessionDashboard();

                                setSessionDashboard({
                                    runningSessions: dashboardResponse.data.runningSessions,
                                    paymentPendingSessions: dashboardResponse.data.paymentPendingSessions,
                                    completedSessions: dashboardResponse.data.completedSessions,
                                    todayCollection: dashboardResponse.data.todayCollection
                                });

                                setSessions(dashboardResponse.data.sessions);

                                const resourceResponse = await getAllResources();

                                setAvailableResources(
                                    resourceResponse.data.filter(
                                        resource => resource.status === "AVAILABLE"
                                    )
                                );

                                setSelectedSession(session.id);
                                setShowPaymentModal(true);

                            } catch (error) {
                                console.error(error);
                            }

                        }}
                    >
                        End
                    </button>
                )}

                {
                    session.status === "PAYMENT_PENDING" ? (

                        <button
                            className="btn btn-success btn-sm"
                            onClick={() => {
                                setSelectedSession(session.id);
                                setShowPaymentModal(true);
                            }}
                        >
                            Collect Payment
                        </button>

                    ) : session.status === "COMPLETED" ? (

                        <button
                            className="btn btn-dark btn-sm"
                            onClick={async () => {

                                const response = await getAllSessions();

                                const latestSession = response.data.find(
                                    s => s.id === session.id
                                );

                                setSelectedSession(latestSession);

                                setShowReceipt(true);

                            }}
                        >
                            🧾 Receipt
                        </button>

                    ) : null
                }

            </td>

        </tr>

    );

    return (
        <>

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>🎯 Session Management</h2>

                <button
                    className="btn btn-warning"
                    onClick={() => {
                        setNewSession({
                            customerId: "",
                            customerName: "",
                            resource: "",
                            playerCount: 1
                        });

                        setShowModal(true);
                    }}
                >
                    + Start Session
                </button>

            </div>

            {/* Search */}

            <div className="mb-3">

                <input
                    className="form-control"
                    placeholder="🔍 Search by Customer, Resource or Session ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

            </div>

            <div className="row g-3 mb-4">

                <div className="col-md-3">

                    <div className="card shadow-sm border-0 bg-success text-white">

                        <div className="card-body text-center">

                            <h6>🟢 Running Sessions</h6>

                            <h2>{runningSessions.length}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card shadow-sm border-0 bg-warning">

                        <div className="card-body text-center">

                            <h6>💰 Payment Pending</h6>

                            <h2>{sessionDashboard.paymentPendingSessions}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card shadow-sm border-0 bg-primary text-white">

                        <div className="card-body text-center">

                            <h6>📋 Completed</h6>

                            <h2>{sessionDashboard.completedSessions}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card shadow-sm border-0 bg-dark text-white">

                        <div className="card-body text-center">

                            <h6>💰 Current Collection</h6>

                            <h2>₹{sessionDashboard.todayCollection}</h2>

                        </div>

                    </div>

                </div>

            </div>

            {/* Table */}

            <div className="table-responsive">

            <table className="table table-bordered table-hover align-middle">

                <thead className="table-dark">

                <tr>

                    <th>ID</th>
                    <th>Customer</th>
                    <th>Resource</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Duration</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th width="180">Actions</th>

                </tr>

                </thead>

                <tbody>
                {/* RUNNING */}

                <tr className="table-success">

                    <td colSpan="9" className="fw-bold fs-6">
                        🟢 RUNNING SESSIONS ({runningSessions.length})
                    </td>

                </tr>

                {runningSessions.map(renderSessionRow)}

                {/* PAYMENT */}

                {paymentPendingSessions.length > 0 && (

                    <>
                        <tr className="table-warning">

                            <td colSpan="9" className="fw-bold fs-6">
                                💰 PAYMENT PENDING ({paymentPendingSessions.length})
                            </td>

                        </tr>

                        {paymentPendingSessions.map(renderSessionRow)}

                    </>

                )}

                {/* COMPLETED */}

                <tr className="table-secondary">

                    <td colSpan="9" className="fw-bold fs-6">
                        ✅ COMPLETED SESSIONS ({completedSessions.length})
                    </td>

                </tr>

                {completedSessions.map(renderSessionRow)}
                </tbody>

            </table>

            </div>

            {/* Session Modal */}

            {showModal && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >
                    <div
                        className="modal-dialog modal-dialog-centered modal-lg"
                        style={{ maxWidth: "700px" }}
                    >
                        <div className="modal-content">

                            {/* Header */}

                            <div className="modal-header">

                                <h4 className="modal-title fw-bold">
                                    🎯 Start Session
                                </h4>

                                <button
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>

                            </div>

                            {/* Body */}

                            <div className="modal-body px-4 py-3">

                                {/* Customer */}

                                <div className="mb-4">

                                    <label className="form-label fw-semibold mb-2">
                                        👤 Customer
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search Customer by Name or Mobile"
                                        value={customerSearch}
                                        onChange={(e) =>
                                            setCustomerSearch(e.target.value)
                                        }
                                    />

                                    <div className="customer-list mt-3">

                                        {filteredCustomers.length > 0 ? (

                                            filteredCustomers.map((customer) => (

                                                <div
                                                    key={customer.id}
                                                    className={`customer-card ${
                                                        newSession.customerId === customer.id
                                                            ? "selected"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        setNewSession({
                                                            ...newSession,
                                                            customerId: customer.id,
                                                            customerName: customer.name
                                                        })
                                                    }
                                                >

                                                    <div className="customer-name">
                                                        👤 {customer.name}
                                                    </div>

                                                    <div className="customer-mobile">
                                                        📞 {customer.mobileNumber}
                                                    </div>

                                                </div>

                                            ))

                                        ) : (

                                            <div className="text-center py-5">

                                                <div style={{ fontSize: "45px" }}>
                                                    😕
                                                </div>

                                                <h5 className="mt-3">
                                                    Customer not found
                                                </h5>

                                                <p className="text-muted">
                                                    No customer matches your search.
                                                </p>

                                                <button
                                                    className="btn btn-warning"
                                                    onClick={() => setShowAddCustomerModal(true)}
                                                >
                                                    + Add New Customer
                                                </button>

                                            </div>

                                        )}

                                    </div>

                                </div>

                                <hr className="my-4" />

                                {/* Resource */}

                                <div className="mb-3">

                                    <label className="form-label fw-semibold mb-2">
                                        🎱 Resource
                                    </label>

                                    <select
                                        className="form-select"
                                        value={newSession.resource}
                                        onChange={(e) =>
                                            setNewSession({
                                                ...newSession,
                                                resource: e.target.value
                                            })
                                        }
                                    >

                                        <option value="">
                                            Select Available Resource
                                        </option>

                                        {availableResources.map((resource) => (

                                            <option
                                                key={resource.id}
                                                value={resource.name}
                                            >
                                                {resource.name}
                                            </option>

                                        ))}

                                    </select>

                                </div>

                                {/* Player Count */}

                                {(
                                    newSession.resource.startsWith("PS5") ||
                                    newSession.resource.startsWith("PS4") ||
                                    newSession.resource.startsWith("Table")
                                ) && (

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold mb-2">
                                            👥 Number of Players
                                        </label>

                                        <div className="d-flex align-items-center gap-3">

                                            {/* Minus */}
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() =>
                                                    setNewSession({
                                                        ...newSession,
                                                        playerCount: Math.max(
                                                            1,
                                                            newSession.playerCount - 1
                                                        )
                                                    })
                                                }
                                            >
                                                −
                                            </button>

                                            {/* Player Count */}
                                            <span
                                                className="fw-bold fs-4"
                                                style={{
                                                    minWidth: "40px",
                                                    textAlign: "center"
                                                }}
                                            >
                                                {newSession.playerCount}
                                            </span>

                                            {/* Plus */}
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                disabled={
                                                    (
                                                        newSession.resource.startsWith("PS5") ||
                                                        newSession.resource.startsWith("PS4")
                                                    ) &&
                                                    newSession.playerCount >= 4
                                                }
                                                onClick={() =>
                                                    setNewSession({
                                                        ...newSession,
                                                        playerCount:
                                                            newSession.playerCount + 1
                                                    })
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                        {/* PS4 / PS5 information */}
                                        {(newSession.resource.startsWith("PS5") ||
                                            newSession.resource.startsWith("PS4")) && (

                                            <small className="text-muted d-block mt-2">
                                                Maximum 4 players
                                            </small>

                                        )}

                                        {/* Table information */}
                                        {newSession.resource.startsWith("Table") && (
                                            <small className="text-muted d-block mt-2">

                                                {newSession.playerCount <= 4 ? (
                                                    "4 players included"
                                                ) : (
                                                    <>
                                                        {newSession.playerCount - 4} extra player
                                                        {newSession.playerCount - 4 > 1 ? "s" : ""}
                                                        {" • Extra charge: ₹"}
                                                        {(newSession.playerCount - 4) * 50}
                                                        /hour
                                                    </>
                                                )}

                                            </small>
                                        )}

                                    </div>

                                )}

                            </div>

                            {/* Footer */}

                            <div className="modal-footer">

                                <button
                                    className="btn btn-secondary px-4"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-warning px-4"
                                    onClick={startSession}
                                >
                                    ▶ Start Session
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Add Customer Modal */}

            {showAddCustomerModal && (

                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >

                    <div className="modal-dialog modal-dialog-centered">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title">
                                    👤 Add Customer
                                </h5>

                                <button
                                    className="btn-close"
                                    onClick={() =>
                                        setShowAddCustomerModal(false)
                                    }
                                ></button>

                            </div>

                            <div className="modal-body">

                                <div className="mb-3">

                                    <label className="form-label">
                                        Customer Name
                                    </label>

                                    <input
                                        className="form-control"
                                        value={newCustomer.name}
                                        onChange={(e)=>
                                            setNewCustomer({
                                                ...newCustomer,
                                                name:e.target.value
                                            })
                                        }
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Mobile Number
                                    </label>

                                    <input
                                        className="form-control"
                                        value={newCustomer.mobileNumber}
                                        onChange={(e)=>
                                            setNewCustomer({
                                                ...newCustomer,
                                                mobileNumber:e.target.value
                                            })
                                        }
                                    />

                                </div>

                            </div>

                            <div className="modal-footer">

                                <button
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        setShowAddCustomerModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-warning"
                                    onClick={saveNewCustomer}
                                >
                                    Save Customer
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

            {/* Payment Modal */}

            {showPaymentModal && (

                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >

                    <div className="modal-dialog">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title">
                                    Collect Payment
                                </h5>

                                <button
                                    className="btn-close"
                                    onClick={() => setShowPaymentModal(false)}
                                ></button>

                            </div>

                            <div className="modal-body">

                                <label className="form-label">
                                    Payment Method
                                </label>


                                <select
                                    className="form-select"
                                    value={paymentMethod}
                                    onChange={(e) => {
                                        setPaymentMethod(e.target.value);

                                        // Reset split amounts when changing payment method
                                        setCashAmount("");
                                        setUpiAmount("");
                                    }}
                                >
                                    <option value="CASH">Cash</option>
                                    <option value="UPI">UPI</option>
                                    <option value="CARD">Card</option>
                                    <option value="SPLIT">Split Payment</option>
                                </select>

                                {/* Split Payment */}

                                {paymentMethod === "SPLIT" && selectedSession && (

                                    <div className="mt-4">

                                        <div className="alert alert-info">
                                            <strong>
                                                Total Amount: ₹{sessions.find(
                                                s => s.id === selectedSession
                                            )?.totalAmount ?? 0}
                                            </strong>
                                        </div>

                                        <div className="mb-3">

                                            <label className="form-label fw-semibold">
                                                Cash Amount
                                            </label>

                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control"
                                                placeholder="Enter cash amount"
                                                value={cashAmount}
                                                onChange={(e) =>
                                                    setCashAmount(e.target.value)
                                                }
                                            />

                                        </div>

                                        <div className="mb-3">

                                            <label className="form-label fw-semibold">
                                                 UPI Amount
                                            </label>

                                            <input
                                                type="number"
                                                min="0"
                                                className="form-control"
                                                placeholder="Enter UPI amount"
                                                value={upiAmount}
                                                onChange={(e) =>
                                                    setUpiAmount(e.target.value)
                                                }
                                            />

                                        </div>

                                    </div>

                                )}

                            </div>

                            <div className="modal-footer">

                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowPaymentModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-warning"
                                    onClick={collectPayment}
                                >
                                    Collect Payment
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

            {/* Receipt Modal */}

            {showReceipt && selectedSession && (

                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >

                    <div
                        className="modal-dialog modal-dialog-centered"
                        style={{ maxWidth: "420px" }}
                    >

                        <div className="modal-content">

                            <div className="modal-header">

                                <h4>Receipt</h4>

                                <button
                                    className="btn-close"
                                    onClick={() => setShowReceipt(false)}
                                ></button>

                            </div>

                            <div className="modal-body text-center px-4">

                                <div className="text-center">
                                    <img
                                        src={houseLogo}
                                        alt="House Of Cue"
                                        width="90"
                                        className="img-fluid mb-3"
                                    />
                                </div>

                                <h3 className="mt-3">
                                    HOUSE OF CUE
                                </h3>

                                <p>

                                    2nd Floor, 168,
                                    <br/>

                                    Medavakkam Main Road,
                                    <br/>

                                    Bharat Nagar,
                                    <br/>

                                    Madipakkam,
                                    <br/>

                                    Chennai - 600091

                                </p>

                                <strong>Receipt No :</strong>{" "}
                                HOC-{String(selectedSession.id).padStart(5, "0")}

                                <p className="mb-3">
                                    <strong>Date :</strong> {new Date().toLocaleDateString()}
                                </p>

                                <hr/>

                                <p><b>Customer :</b> {selectedSession.customer?.name}</p>

                                <p><b>Resource :</b> {selectedSession.resource?.name}</p>

                                <p><b>Start :</b> {new Date(selectedSession.startTime).toLocaleString()}</p>

                                <p>
                                    <b>End :</b>{" "}
                                    {selectedSession.endTime
                                        ? new Date(selectedSession.endTime).toLocaleString()
                                        : "-"}
                                </p>


                                <p>
                                    <b>Duration :</b>{" "}
                                    {formatDuration(
                                        selectedSession.startTime,
                                        selectedSession.endTime
                                    )}
                                </p>



                                <p><b>Payment :</b> {selectedSession.paymentMethod || "Not Paid"}</p>

                                <hr />

                                <div
                                    className="d-flex justify-content-center align-items-center gap-3 mt-3 mb-3"
                                >
                                    <h4 className="fw-bold mb-0">TOTAL</h4>

                                    <h4 className="fw-bold text-success mb-0">
                                        ₹{selectedSession.totalAmount}
                                    </h4>
                                </div>

                                <hr />


                                <p className="text-center text-muted mb-2">
                                    Thank You for Visiting!
                                </p>

                                <p className="text-center fw-bold mb-1">
                                    House Of Cue
                                </p>

                                <p className="text-center text-muted">
                                    Powered by CueFox
                                </p>

                            </div>

                            <div className="modal-footer">

                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowReceipt(false)}
                                >
                                    Close
                                </button>

                                <button
                                    className="btn btn-success"
                                    onClick={() => window.print()}
                                >
                                    🖨 Print
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}
        </>
    );
}

export default Sessions;