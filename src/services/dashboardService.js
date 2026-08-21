import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export function getDashboard() {
    return axios.get(`${BASE_URL}/dashboard`);
}