import axios from "axios";
import useAuth from "./useAuth";

const useAxiosSecure = () => {
    const { signOutUser} = useAuth();

    // Create an Axios instance with a base URL
    const axiosInstance = axios.create({
        baseURL: `${import.meta.env.VITE_API_URL}`,
        // baseURL: 'http://localhost:3000',
        withCredentials: true
    })

    // Add a response interceptor to handle unauthorized access
    axiosInstance.interceptors.response.use(response => {
        return response
    }), (error) => {
        if(error.response?.status(401) || error.response?.status(403)) {
            signOutUser()
            .then(() => {
                console.log("Unauthorized access, signing out user.");
            })
            .catch(error => {
                console.error("Error signing out user:", error);
            })
        }
        return Promise.reject(error);
    }
    return axiosInstance;
};

export default useAxiosSecure;