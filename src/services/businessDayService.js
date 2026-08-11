import api from "./api";

export const closeBusinessDay = () => {
    return api.post("/business-day/close");
};
export const openBusinessDay = () => {
    return api.post("/business-day/open");
};

export const getCurrentBusinessDay = () => {
    return api.get("/business-day/current");
};