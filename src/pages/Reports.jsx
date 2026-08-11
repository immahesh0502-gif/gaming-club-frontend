import { useEffect, useState } from "react";

import DashboardCard from "../components/DashboardCard";

import {
    getReport,
    getMonthlyReport,
    getDailyReport,
    exportPdf,
    exportExcel
} from "../services/reportService";


function Reports() {


    const [report, setReport] = useState({});
    const [monthlyReport, setMonthlyReport] = useState({});
    const [selectedYear, setSelectedYear] = useState(2026);

    const [selectedMonth, setSelectedMonth] = useState(7);
    const [selectedDate, setSelectedDate] = useState("");


    useEffect(() => {

        const loadSessions = async () => {

            try {

                let reportResponse;

                if (selectedDate) {

                    reportResponse = await getDailyReport(selectedDate);

                } else {

                    reportResponse = await getReport();

                }

                const monthlyResponse = await getMonthlyReport(
                    selectedYear,
                    selectedMonth
                );

                setReport(reportResponse.data);
                setMonthlyReport(monthlyResponse.data);

            } catch (error) {

                console.error(error);

            }

        };

        loadSessions();

    }, [selectedYear, selectedMonth, selectedDate]);

    const handleExportPdf = async () => {

        try {

            const date =
                selectedDate ||
                new Date().toISOString().split("T")[0];

            const response = await exportPdf(date);

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");

            link.href = url;

            link.download = `CueFox_Report_${date}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

        } catch (error) {

            console.error(error);

            alert("Unable to download PDF.");

        }

    };

    const handleExportExcel = async () => {

        try {

            const date =
                selectedDate ||
                new Date().toISOString().split("T")[0];

            const response = await exportExcel(date);

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");

            link.href = url;

            link.download = `CueFox_Report_${date}.xlsx`;

            document.body.appendChild(link);

            link.click();

            link.remove();

        } catch (error) {

            console.error(error);

            alert("Unable to download Excel.");

        }

    };

    return (

        <div>

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Reports
                    </h2>

                    <p className="text-muted mb-0">
                        View daily and monthly business performance.
                    </p>

                </div>

            </div>

            {/* ================= Daily Report Filter ================= */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <div className="row align-items-end">

                        <div className="col-md-3">

                            <label className="form-label fw-semibold">
                                Report Date
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />

                        </div>

                        <div className="col-md-auto">

                            <button
                                className="btn btn-outline-primary"
                                onClick={() => {

                                    const today = new Date().toISOString().split("T")[0];
                                    setSelectedDate(today);

                                }}
                            >
                                Today
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            <div className="row g-4">

                <div className="col-lg-3 col-md-6">

                    <DashboardCard
                        title="Revenue"
                        value={`₹${report.todayRevenue || 0}`}
                        color="#198754"

                    />

                </div>

                <div className="col-lg-3 col-md-6">

                    <DashboardCard
                        title="Sessions"
                        value={report.todaySessions || 0}
                        color="#0d6efd"
                    />

                </div>
                <div className="col-lg-3 col-md-6">

                    <DashboardCard
                        title="Customers"
                        value={report.todayCustomers || 0}
                        color="#6f42c1"
                    />

                </div>


                <div className="col-lg-3 col-md-6">

                    <DashboardCard
                        title="Running Sessions"
                        value={report.runningSessions || 0}
                        color="#fd7e14"

                    />

                </div>

            </div>


            <hr className="my-5" />

            <div className="row mb-4">

                <div className="col-lg-6">

                    <h4 className="fw-bold mb-4 ">
                        Payment Summary
                    </h4>

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <table className="table table-borderless align-middle mb-0">

                                <tbody>

                                <tr>
                                    <td className="fw-semibold text-secondary">
                                        Cash
                                    </td>

                                    <td className="text-end fw-bold text-success">
                                        ₹{report.todayCashRevenue || 0}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="fw-semibold text-secondary">
                                        UPI
                                    </td>

                                    <td className="text-end fw-bold text-primary">
                                        ₹{report.todayUpiRevenue || 0}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="fw-semibold text-secondary">
                                        Card
                                    </td>

                                    <td className="text-end fw-bold text-warning">
                                        ₹{report.todayCardRevenue || 0}
                                    </td>
                                </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>
            <hr className="my-5" />
            <div className="row mt-4">

                <div className="col-lg-6">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h4 className="fw-bold mb-4">
                                Monthly Report
                            </h4>

                            <div className="row mb-4">

                                <div className="col-md-6">

                                    <label className="form-label fw-semibold">
                                        Month
                                    </label>

                                    <select
                                        className="form-select"
                                        value={selectedMonth}
                                        onChange={(e) =>
                                            setSelectedMonth(Number(e.target.value))
                                        }
                                    >
                                        <option value={1}>January</option>
                                        <option value={2}>February</option>
                                        <option value={3}>March</option>
                                        <option value={4}>April</option>
                                        <option value={5}>May</option>
                                        <option value={6}>June</option>
                                        <option value={7}>July</option>
                                        <option value={8}>August</option>
                                        <option value={9}>September</option>
                                        <option value={10}>October</option>
                                        <option value={11}>November</option>
                                        <option value={12}>December</option>
                                    </select>

                                </div>

                                <div className="col-md-4">

                                    <label className="form-label fw-semibold">
                                        Year
                                    </label>

                                    <select
                                        className="form-select"
                                        value={selectedYear}
                                        onChange={(e) =>
                                            setSelectedYear(Number(e.target.value))
                                        }
                                    >
                                        <option value={2025}>2025</option>
                                        <option value={2026}>2026</option>
                                        <option value={2027}>2027</option>
                                    </select>

                                </div>

                            </div>

                            <table className="table table-borderless mb-0">

                                <tbody>

                                <tr>

                                    <td className="fw-semibold">
                                        Revenue
                                    </td>

                                    <td className="text-end fw-bold text-success">
                                        ₹{monthlyReport.revenue || 0}
                                    </td>

                                </tr>

                                <tr>

                                    <td className="fw-semibold">
                                        Sessions
                                    </td>

                                    <td className="text-end fw-bold">
                                        {monthlyReport.totalSessions || 0}
                                    </td>

                                </tr>

                                <tr>

                                    <td className="fw-semibold">
                                        Customers
                                    </td>

                                    <td className="text-end fw-bold">
                                        {monthlyReport.totalCustomers || 0}
                                    </td>

                                </tr>

                                <tr>

                                    <td className="fw-semibold">
                                        Average Bill
                                    </td>

                                    <td className="text-end fw-bold text-primary">
                                        ₹{monthlyReport.averageBill?.toFixed(2) || "0.00"}
                                    </td>

                                </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

            <hr className="my-5" />

            <div className="row g-4">

                {/* Export Reports */}

                <div className="col-lg-6">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <h4 className="fw-bold mb-4">
                                Export Reports
                            </h4>

                            <p className="text-muted">
                                Download the selected report as a PDF or Excel file.
                            </p>

                            <div className="d-flex gap-3">

                                <button
                                    className="btn btn-danger"
                                    onClick={handleExportPdf}
                                >
                                    📄 Export PDF
                                </button>

                                <button
                                    className="btn btn-success"
                                    onClick={handleExportExcel}
                                >
                                    📊 Export Excel
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Analytics */}

                <div className="col-lg-6">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <h4 className="fw-bold mb-4">
                                Analytics
                            </h4>

                            <div className="mb-3">

                                <div className="mb-2">
                                    📈 Revenue Trend
                                </div>

                                <div className="mb-2">
                                    📊 Payment Distribution
                                </div>

                                <div>
                                    🎮 Top Resources
                                </div>

                            </div>

                            <div className="alert alert-info mb-0">

                                Analytics charts will be available in the next update.

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Reports;