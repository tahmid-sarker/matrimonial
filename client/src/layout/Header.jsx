import { RiMenu2Fill } from "react-icons/ri";
import { Link, NavLink, useNavigate } from "react-router";
import { useState } from "react";
import DarkModeToggler from "../components/shared/DarkModeToggler";
import { asset } from "../utils/asset";
import useAuth from "../hooks/useAuth";
import Swal from 'sweetalert2';
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import ForgetPassword from "../components/auth/ForgetPassword";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    showCloseButton: true,
    timer: 2200,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    },
});

const Header = () => {
    const [activeModal, setActiveModal] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    // Fetch users
    const {data: users = []} = useQuery({
        queryKey: ["users"],
        queryFn: async() =>{
            const response = await axiosSecure("/users")
            return response.data;
        },
        enabled: !!user?.email
    })

    const roledUser = users.find(u => u?.email === user?.email);

    // Handle user logout
    const handleLogOut = () => {
        logoutUser()
            .then(() => {
                Toast.fire({
                    icon: "success",
                    title: "Logged out successfully!",
                });
                navigate("/");
                setDropdownOpen(false);
            })
            .catch((error) => {
                Toast.fire({
                    icon: "error",
                    title: error.message,
                });
            });
    };

    // Navigation link styles
    const navLinkClass = ({ isActive }) =>
        isActive
            ? "text-primary underline underline-offset-4"
            : "hover:text-primary hover:underline hover:underline-offset-4";

    // Navigation links
    const navLinks = <>
        <NavLink to="/" className={navLinkClass}>Home</NavLink>
        <NavLink to="/biodatas" className={navLinkClass}>Biodatas</NavLink>
        <NavLink to="/about-us" className={navLinkClass}>About Us</NavLink>
        <NavLink to="/contact-us" className={navLinkClass}>Contact Us</NavLink>
        {user && <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>}
    </>;

    return (
        <header className="shadow-sm">
            <div className="navbar bg-base-100 w-11/12 mx-auto">
                {/* Navbar Start */}
                <div className="navbar-start">
                    {/* Mobile Menu */}
                    <div className="dropdown lg:hidden">
                        <div tabIndex={0} className="flex justify-center items-center gap-2">
                            <RiMenu2Fill className="h-7 w-7 text-primary cursor-pointer" />
                        </div>
                        <div tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box gap-1.5 z-1 mt-3 w-52 p-2 text-base shadow">
                            {navLinks}
                            {user ? (
                                <button onClick={handleLogOut} className="btn bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white rounded px-2 md:px-4 py-1 md:py-2 text-base">Logout</button>
                            ) : (
                                <>
                                    <button onClick={() => setActiveModal("login")} className="btn btn-ghost bg-linear-to-l hover:from-secondary hover:to-primary hover:text-white border border-primary rounded px-2 md:px-4 py-1 md:py-2 text-base">Login</button>
                                    <button onClick={() => setActiveModal("register")} className="btn bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white rounded px-2 md:px-4 py-1 md:py-2 text-base">Register</button>
                                </>)}
                        </div>
                    </div>
                    <Link to="/" className="flex justify-center items-center text-xl md:text-2xl font-bold">
                        <img src={asset("icons/logo.png")} alt="Bengal Matrimony" className="h-7 md:h-12 w-7 md:w-12" />
                            <h2 className="text-primary">Bengal <span className="text-secondary">Matrimony</span></h2>
                    </Link>
                </div>

                {/* Navbar Center */}
                <div className="navbar-center hidden lg:flex">
                    <div className="menu menu-horizontal px-1 gap-4 text-base">
                        {navLinks}
                    </div>
                </div>

                {/* Navbar End */}
                <div className="navbar-end gap-2 md:gap-4">
                    {/* Dark Mode Toggler */}
                    <DarkModeToggler />
                    {/* User Login and Logout */}
                    {user ? (
                        <div className="relative">
                            <button onClick={() => setDropdownOpen(!dropdownOpen)} className='cursor-pointer'>
                                <img alt={user?.displayName} src={user?.photoURL} className="w-14 h-14 rounded-full object-cover border-2 border-primary" />
                            </button>
                            {dropdownOpen && (
                                <ul className="menu menu-sm bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow absolute right-0">
                                    <h1 className='text-lg text-center font-semibold'>{user?.displayName}</h1>
                                    <li><Link to="/my-profile" className='text-lg' onClick={() => setDropdownOpen(false)}>My Profile</Link></li>
                                    {roledUser?.role === 'user' && <li><Link to="/my-biodata" className='text-lg' onClick={() => setDropdownOpen(false)}>My Biodata</Link></li>}
                                    <li><button onClick={handleLogOut} className="btn bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-base text-white">Logout</button></li>
                                </ul>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {/* Login Modal */}
                            <div>
                                <button onClick={() => setActiveModal("login")} className="btn btn-ghost bg-linear-to-l hover:from-secondary hover:to-primary hover:text-white border border-primary rounded px-2 md:px-4 py-1 md:py-2 text-base hidden md:block">Login</button>
                                <Login isOpen={activeModal === 'login'} onSwitch={(modal) => setActiveModal(modal)} />
                            </div>
                            {/* Register Modal */}
                            <div>
                                <button onClick={() => setActiveModal("register")} className="btn bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white rounded px-2 md:px-4 py-1 md:py-2 text-base hidden md:block">Register</button>
                                <Register isOpen={activeModal === 'register'} onSwitch={(modal) => setActiveModal(modal)} />
                            </div>
                            {/* Forget Password Modal */}
                            <div>
                                <ForgetPassword isOpen={activeModal === 'forgot'} onSwitch={(modal) => setActiveModal(modal)} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;