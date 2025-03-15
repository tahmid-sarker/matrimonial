import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { FaTachometerAlt, FaUsers, FaCheckCircle, FaClipboardList, FaEnvelopeOpenText, FaFileInvoiceDollar, FaIdCard, FaUserCog, FaHeart, FaHome, FaSignOutAlt, FaUserEdit, FaBars } from "react-icons/fa";
import { TbMessageHeart } from "react-icons/tb";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import DynamicTitle from "../components/shared/DynamicTitle";
import Swal from "sweetalert2";

// Tost
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch all users
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const roledUser = users?.find((u) => u.email === user?.email);
  const isAdmin = roledUser?.role === "admin";

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
      Toast.fire({
        icon: "success",
        title: "Logged out successfully",
      });
    } catch (error) {
      console.error(error);
      Toast.fire({
        icon: "error",
        title: "Logout failed. Please try again.",
      });
    }
  };

  const navItems = isAdmin
    ? [
        { to: "/dashboard", icon: <FaTachometerAlt />, label: "Admin Dashboard" },
        { to: "/dashboard/manage-users", icon: <FaUsers />, label: "Manage Users" },
        { to: "/dashboard/manage-biodatas", icon: <FaIdCard />, label: "Manage Biodatas" },
        { to: "/dashboard/approve-premium", icon: <FaCheckCircle />, label: "Approve Premium" },
        { to: "/dashboard/payment-list", icon: <FaFileInvoiceDollar />, label: "Payment List" },
        { to: "/dashboard/stories", icon: <FaEnvelopeOpenText />, label: "Success Stories" },
        { to: "/dashboard/contact-messages", icon: <FaClipboardList />, label: "Contact Messages" },
      ]
    : [
        { to: "/dashboard", icon: <FaTachometerAlt />, label: "User Dashboard" },
        { to: "/dashboard/update-profile", icon: <FaUserCog />, label: "Update Profile" },
        { to: "/dashboard/edit", icon: <FaUserEdit />, label: "Edit Biodata" },
        { to: "/dashboard/favorites", icon: <FaHeart />, label: "Favorites List" },
        { to: "/dashboard/married", icon: <TbMessageHeart />, label: "Got Married" },
      ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <DynamicTitle />

      {/* Top Bar */}
      <header className="bg-white shadow-md flex items-center justify-between p-4 md:px-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">{isAdmin ? "Admin Dashboard" : `${roledUser?.name}'s Dashboard`}</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {roledUser?.name}</p>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-3 flex-wrap">
          {navItems.map(({ to, icon, label }) => (
            <Link key={to} to={to} className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-200 transition 
              ${location.pathname === to ? "bg-gray-200 font-semibold" : ""}`}>
              {icon} <span className="whitespace-nowrap">{label}</span>
            </Link>
          ))}

          <Link to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition">
            <FaHome /> Home
          </Link>

          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition">
            <FaSignOutAlt /> Logout
          </button>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-2xl p-2 rounded hover:bg-gray-100">
            <FaBars />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow border-b">
          <nav className="flex flex-col px-4 py-2 gap-2">
            {navItems.map(({ to, icon, label }) => (
              <Link key={to} to={to} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 
                ${location.pathname === to ? "bg-gray-100 font-semibold" : ""}`}>
                {icon} <span>{label}</span>
              </Link>
            ))}
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded bg-green-50 text-green-700 hover:bg-green-100">
              <FaHome /> Home
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded bg-red-50 text-red-700 hover:bg-red-100">
              <FaSignOutAlt /> Logout
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        {location.pathname === "/dashboard" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {navItems.map(({ to, icon, label }) => (
              <Link key={to} to={to}
                className="flex items-center gap-4 p-4 rounded-xl shadow-md bg-white hover:bg-gray-50 border border-gray-200 transition">
                <div className="text-primary text-3xl">{icon}</div>
                <div className="font-semibold text-gray-800">{label}</div>
              </Link>
            ))}

            <Link to="/"
              className="cursor-pointer flex items-center gap-4 p-4 rounded-xl shadow-md bg-green-100 hover:bg-green-200 border border-green-200 transition">
              <FaHome size={24} className="text-green-600" />
              <span className="font-semibold text-green-800">Home</span>
            </Link>

            <button onClick={handleLogout}
              className="cursor-pointer flex items-center gap-4 p-4 rounded-xl shadow-md bg-red-100 hover:bg-red-200 border border-red-200 transition">
              <FaSignOutAlt size={24} className="text-red-600" />
              <span className="font-semibold text-red-800">Logout</span>
            </button>
          </div>
        ) : (
          <div className="bg-white p-4 md:p-6 rounded-xl shadow">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;