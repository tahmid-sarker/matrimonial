import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

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

const UpdateProfile = () => {
    const { user, updateUser } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: updateInfo } = useMutation({
        mutationFn: async ({ email, name, photo }) => {
            await updateUser(name, photo);
            const response = await axiosSecure.patch('http://localhost:3000/dashboard/update-profile', { email, name, photo }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            return response.data;
        },
        onSuccess: () => {
            Toast.fire({
                icon: "success",
                title: "Profile Updated Successfully!",
            });
            queryClient.invalidateQueries(["user", user.email]); // Invalidate user query to refetch updated data
            navigate('/my-profile');
        },
        onError: (error) => {
            Toast.fire({
                icon: "error",
                title: error.message || "Failed to update profile",
            });
        },
    });

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const { name, photo } = Object.fromEntries(formData.entries());

        // Call the mutation to update profile
        updateInfo({ email: user.email, name, photo });
    };

    return (
        <div className="flex justify-center my-15">
            <form onSubmit={handleUpdateProfile} className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-11/12 mx-auto md:w-full space-y-4">
                <img src={user?.photoURL} alt={user?.displayName} className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-primary" />
                <h2 className="text-2xl font-bold text-center text-gray-800">Update Profile</h2>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Display Name</label>
                    <input type="text" name='name' placeholder="Enter your name" required
                        className="w-full text-xs md:text-lg px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Photo URL</label>
                    <input type="url" name="photo" placeholder="Enter photo URL" required
                        className="w-full text-xs md:text-lg px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary" />
                </div>
                <button type="submit"
                    className="w-full btn btn-ghost border border-none bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white">
                    Update
                </button>
            </form>
        </div>
    );
};

export default UpdateProfile;