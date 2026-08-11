import axios from "axios";

const API = "http://localhost:8080/api/auth";

export const login = (loginRequest) => {
    return axios.post(
        `${API}/login`,
        loginRequest,
        {
            withCredentials: true
        }
    );
};