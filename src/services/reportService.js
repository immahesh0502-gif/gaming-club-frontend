import axios from "axios";

const API_URL = "http://localhost:8080/api/reports";

export const getReport = () => {
    return axios.get(API_URL);
};
export function getMonthlyReport(year, month) {

    return axios.get(
        `${API_URL}/monthly?year=${year}&month=${month}`
    );

}

export const getDailyReport = (date) => {
    return axios.get(`${API_URL}/daily?date=${date}`);
};
export const exportPdf = (date) => {
    return axios.get(
        `${API_URL}/export/pdf?date=${date}`,
        {
            responseType: "blob"
        }
    );
};
export const exportExcel = (date) => {
    return axios.get(
        `${API_URL}/export/excel?date=${date}`,
        {
            responseType: "blob"
        }
    );
};