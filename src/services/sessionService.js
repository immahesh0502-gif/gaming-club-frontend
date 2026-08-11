import axios from "axios";

const API_URL = "http://localhost:8080/sessions";

export const getAllSessions = () => {
    return axios.get(API_URL);
};

export const getSessionDashboard = () => {
    return axios.get(`${API_URL}/dashboard`);
};

export const startSession = (session) => {
    return axios.post(`${API_URL}/start`, session);
};

export const endSession = (sessionId) => {
    return axios.post(`${API_URL}/end`, {
        sessionId: sessionId
    });
};

export const makePayment = (payment) => {
    return axios.post(`${API_URL}/payment`, payment);
};

export const deleteSession = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};