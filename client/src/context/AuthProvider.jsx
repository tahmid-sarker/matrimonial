import axios from "axios";
import { useEffect, useState } from 'react';
import { auth } from '../config/firebase.config'
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import Swal from 'sweetalert2';

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

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Create User
    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    // Update Profile
    const updateUser = (name, photo) => {
        const profile = {
            displayName: name,
            photoURL: photo,
        }
        return updateProfile(auth.currentUser, profile)
    }

    // Catch the user data
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setLoading(false);
            setUser(currentUser);
            if (currentUser?.email) {
                const userEmail = {email: currentUser.email}
                axios.post(`${import.meta.env.VITE_API_URL}/jwt`, userEmail, {
                    withCredentials: true
                })
                .then(response => {
                })
                .catch(error => {
                    Toast.fire({
                        icon: 'error',
                        text: error.message
                    });
                })
            }
        })
        return () => {
            unsubscribe();
        }
    }, [])

    // Login User
    const loginUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    // Login/Create with google
    const loginWithGoogle = () => {
        setLoading(true)
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider)
    }

    // Logout User
    const logoutUser = () => {
        setLoading(true)
        return signOut(auth)
    }

    // Reset Password
    const resetPassword = (email) => {
        setLoading(true)
        return sendPasswordResetEmail(auth, email)
    }

    const authInfo = {
        user,
        loading,
        createUser,
        updateUser,
        loginUser,
        logoutUser,
        loginWithGoogle,
        resetPassword
    }
    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;