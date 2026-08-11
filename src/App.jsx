import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Resources from "./pages/Resources";
import Sessions from "./pages/Sessions";
import Reports from "./pages/Reports";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Login */}
                <Route
                    path="/"
                    element={<Login />}
                />

                {/* Protected Admin Layout */}
                <Route
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/customers"
                        element={<Customers />}
                    />

                    <Route
                        path="/resources"
                        element={<Resources />}
                    />

                    <Route
                        path="/sessions"
                        element={<Sessions />}
                    />

                    <Route
                        path="/reports"
                        element={<Reports />}
                    />

                </Route>

                {/* Unknown Routes */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;