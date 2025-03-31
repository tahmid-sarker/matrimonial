import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";

const MyProfile = () => {
    const { user } = useAuth();
    const { photoURL: photo, displayName: name, email, metadata: loggedData } = user;
    const navigate = useNavigate();

    return (
        <div className="flex justify-center my-9">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-11/12 mx-auto md:w-full text-center space-y-4">
                <img src={photo} alt={name} className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-primary" />
                <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
                <p className="text-gray-500">{email}</p>
                <div className="mt-4 text-left space-y-2">
                    <p className="text-gray-700">
                        <span className="font-semibold">Account Created:</span>{" "}
                        {new Date(loggedData?.creationTime).toLocaleString()}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold">Last Sign In:</span>{" "}
                        {new Date(loggedData?.lastSignInTime).toLocaleString()}
                    </p>
                </div>
                {/* Update Profile Button */}
                <button onClick={() => navigate("/dashboard/update-profile")} className="btn btn-primary hover:btn-secondary text-white rounded-full" >
                    Update Profile
                </button>
            </div>
        </div>
    );
};

export default MyProfile;