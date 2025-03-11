import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { FcGoogle } from "react-icons/fc";
import { useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  showCloseButton: true,
  closeButtonAriaLabel: "Close",
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const Login = ({ isOpen, onSwitch }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { user, loginUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state || "/";

  const axiosSecure = useAxiosSecure();

  // Mutation for PATCH login info
  const loginMutation = useMutation({
    mutationFn: async ({ token, signInInfo }) => {
      const res = await axiosSecure.patch("/users/login", signInInfo, {
        headers: { authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.modifiedCount) {
        Toast.fire({ icon: "success", title: "Login Successfully!" });
      }
    },
    onError: (error) => {
      Toast.fire({ icon: "error", title: error.message });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const { email, password } = Object.fromEntries(formData.entries());

    loginUser(email, password)
      .then((result) => {
        navigate(from);

        const signInInfo = {
          email,
          lastSignInTime: result.user?.metadata?.lastSignInTime,
        };

        result.user.getIdToken().then((token) => {
          loginMutation.mutate({ token, signInInfo });
        });
      })
      .catch((error) => {
        Toast.fire({ icon: "error", title: error.message });
      });
  };

  const handleGoogleSignIn = () => {
    loginWithGoogle()
      .then(() => {
        navigate(location.state || "/");
        Toast.fire({ icon: "success", title: "Create Account Successfully!" });
      })
      .catch((error) => {
        Toast.fire({ icon: "error", title: error.message });
      });
  };

  if (user) {
    navigate(from);
    return null;
  }

  return (
    <dialog open={isOpen} className="modal">
      <div className="modal-box">
        <h2 className="text-2xl font-bold mb-4">Sign in to your account!</h2>

        {/* Close Modal */}
        <form method="dialog">
          <button onClick={() => onSwitch(null)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <RxCross1 className="h-5 w-5" />
          </button>
        </form>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <fieldset className="space-y-1.5">
            {/* Email */}
            <div>
              <label className="label text-lg md:text-xl text-neutral">Email Address</label>
              <input type="email" name="email" placeholder="example@email.com" required
                className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="label text-lg md:text-xl text-neutral">Password</label>
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter your Password" required
                className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-secondary" />
              <div onClick={() => setShowPassword(!showPassword)} className="absolute cursor-pointer right-4 top-10">
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <p onClick={() => onSwitch("forgot")} className="text-secondary text-base md:text-lg cursor-pointer hover:no-underline">
                Forgot Password?
              </p>
            </div>

            {/* Submit */}
            <div>
              <button type="submit" className="btn bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white text-base w-full">
                Login your Account
              </button>
            </div>

            {/* OR */}
            <div className="text-neutral text-center my-2">OR</div>

            {/* Google Sign-In */}
            <div className="flex justify-center">
              <button onClick={handleGoogleSignIn} className="w-full cursor-pointer flex items-center justify-center gap-2 font-semibold px-4 py-2 rounded-lg border border-secondary text-primary bg-white hover:shadow-xl transition-shadow">
                <FcGoogle size={24} /> Login with Google
              </button>
            </div>
          </fieldset>
        </form>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <p className="text-base md:text-lg">
            Don't have an account?{" "}
            <span onClick={() => onSwitch("register")} className="text-secondary cursor-pointer hover:no-underline">
              Register
            </span>
          </p>
        </div>
      </div>
    </dialog>
  );
};

export default Login;