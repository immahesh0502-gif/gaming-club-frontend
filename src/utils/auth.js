export const saveUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

export const saveBusinessDay = (businessDay) => {
    localStorage.setItem(
        "businessDay",
        JSON.stringify(businessDay)
    );
};

export const getBusinessDay = () => {
    return JSON.parse(
        localStorage.getItem("businessDay")
    );
};

export const isLoggedIn = () => {
    return localStorage.getItem("user") !== null;
};

export const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("businessDay");
};