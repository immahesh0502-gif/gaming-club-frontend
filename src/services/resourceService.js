import axios from "axios";

const API_URL = "http://localhost:8080/resources";

export const getAllResources = () => {
    return axios.get(API_URL);
};

export const getResourceById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

export const saveResource = (resource) => {
    return axios.post(API_URL, resource);
};

export const updateResource = (id, resource) => {
    return axios.put(`${API_URL}/${id}`, resource);
};

export const deleteResource = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};