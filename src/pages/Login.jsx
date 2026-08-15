import { useState } from "react";
import "../styles/Login.css";
import { login } from "../services/loginService";
import {
    saveUser,
    saveBusinessDay
} from "../utils/auth";
import logo from "../assets/cuefox.png";
import background from "../assets/cuefoxloginbg.png";
import { useNavigate } from "react-router-dom";
import { getCurrentBusinessDay } from "../services/businessDayService";

function Login() {

    const [showPassword, setShowPassword] = useState(false);

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] =
        useState("");

    const [passwordError, setPasswordError] =
        useState("");
    const navigate = useNavigate();


    const handleLogin = async () => {

        setUsernameError("");
        setPasswordError("");

        if (!username.trim()) {
            setUsernameError(
                "Username is required"
            );
        }

        if (!password.trim()) {
            setPasswordError(
                "Password is required"
            );
        }

        if (
            !username.trim() ||
            !password.trim()
        ) {
            return;
        }

        try {

            const response = await login({
                username,
                password
            });

            saveUser(response.data);

            const businessDayResponse =
                await getCurrentBusinessDay();

            saveBusinessDay(
                businessDayResponse.data
            );

            navigate("/dashboard");

        } catch {
            alert(
                "Invalid Username or Password"
            );
        }
    };

    return (
        <div
            className="login-page"
            style={{ backgroundImage: `url(${background})` }}
        >
            <div className="login-overlay">

                <div className="login-card">

                    <img
                        src={logo}
                        alt="CueFox Logo"
                        className="login-logo"
                    />

                    <h1 className="login-title">
                        Welcome Back
                    </h1>

                    <p className="login-subtitle">
                        Sign in to manage your gaming club
                    </p>

                    {/* Username */}

                    <div className="mb-3">

                        <label className="form-label">
                            Username
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">
                                <i className="bi bi-person"></i>
                            </span>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                            />

                        </div>
                        {
                            usernameError && (
                                <small className="text-danger">
                                    {usernameError}
                                </small>
                            )
                        }

                    </div>

                    {/* Password */}

                    <div className="mb-4">

                        <label className="form-label">
                            Password
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">
                                <i className="bi bi-lock"></i>
                            </span>

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                <i
                                    className={
                                        showPassword
                                            ? "bi bi-eye-slash"
                                            : "bi bi-eye"
                                    }
                                ></i>
                            </button>

                        </div>
                        {
                            passwordError && (
                                <small className="text-danger">
                                    {passwordError}
                                </small>
                            )
                        }

                    </div>

                    <button
                        className="btn login-btn w-100"
                        onClick={handleLogin}
                    >
                        LOGIN
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Login;