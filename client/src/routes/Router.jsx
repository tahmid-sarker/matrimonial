import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import Error from "../pages/Error";
import AboutUs from "../pages/AboutUs";
import ContactUs from "../pages/ContactUs";
import BioDatas from "../pages/BioData/BioDatas";
import BioDetails from "../pages/BioData/BioDetails";
import PrivateRoutes from "./PrivateRoutes";
import DashboardLayout from "../layout/DashboardLayout";
import AdminRoutes from "./AdminRoutes";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import ApprovePremium from "../pages/Dashboard/Admin/ApprovePremium";
import FavouriteList from "../pages/Dashboard/User/FavouriteList";
import UserRoutes from "./UserRoutes";
import EditBioData from "../pages/Dashboard/User/EditBioData";
import GotMarried from "../pages/Dashboard/User/GotMarried";
import SuccessStories from "../pages/Dashboard/Admin/SuccessStories";
import MyProfile from "../pages/MyProfile";
import UpdateProfile from "../pages/Dashboard/User/UpdateProfile";
import BioData from "../pages/BioData";
import Payment from "../pages/Payment/Payment";
import PaymentList from "../pages/Dashboard/Admin/PaymentList";
import ContactMessages from "../pages/Dashboard/Admin/ContactMessages";
import ManageBiodatas from "../pages/Dashboard/Admin/ManageBiodatas";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "about-us", element: <AboutUs /> },
            { path: "contact-us", element: <ContactUs /> },
            { path: "biodatas", element: <BioDatas /> },
            { path: "biodata/:id", element: <PrivateRoutes><BioDetails /></PrivateRoutes> },
            { path: "checkout/:biodataId", element: <PrivateRoutes><Payment /></PrivateRoutes> },
            { path: "my-profile", element: <PrivateRoutes><MyProfile /></PrivateRoutes> },
            { path: "my-biodata", element: <PrivateRoutes><BioData /></PrivateRoutes> }
        ]
    },
    {
        path: "/dashboard",
        element: <PrivateRoutes><DashboardLayout /></PrivateRoutes>,
        children: [
            { path: "manage-users", element: <AdminRoutes><ManageUsers /></AdminRoutes> },
            { path: "manage-biodatas", element: <AdminRoutes><ManageBiodatas /></AdminRoutes> },
            { path: "approve-premium", element: <AdminRoutes><ApprovePremium /></AdminRoutes> },
            { path: "stories", element: <AdminRoutes><SuccessStories /></AdminRoutes> },
            { path: "payment-list", element: <AdminRoutes><PaymentList /></AdminRoutes> },
            { path: "contact-messages", element: <AdminRoutes><ContactMessages /></AdminRoutes> },
            { path: "update-profile", element: <UserRoutes><UpdateProfile /></UserRoutes> },
            { path: "edit", element: <UserRoutes><EditBioData /></UserRoutes> },
            { path: "favorites", element: <UserRoutes><FavouriteList /></UserRoutes> },
            { path: "married", element: <UserRoutes><GotMarried /></UserRoutes> }
        ]
    },
    { path: "*", element: <Error /> }
], { basename });
