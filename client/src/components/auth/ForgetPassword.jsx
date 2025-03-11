import { RxCross1 } from "react-icons/rx";
import useAuth from "../../hooks/useAuth";
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
    }
});

const ForgetPassword = ({ isOpen, onSwitch }) => {
    const { resetPassword } = useAuth();
    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        resetPassword(email)
            .then(() => {
                Toast.fire({
                    icon: 'success',
                    title: 'Password reset email sent! Please check your inbox.'
                });
                onSwitch(null);
            })
            .catch((error) => {
                Toast.fire({
                    icon: 'error',
                    title: error.message
                });
            });
    }
    return (
        <dialog open={isOpen} className="modal">
            <div className='modal-box'>
                <h2 className="text-2xl font-bold mb-4">Reset your password!</h2>
                {/* Close Modal */}
                <form method="dialog">
                    <button onClick={() => onSwitch(null)}  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><RxCross1 className="h-5 w-5" /></button>
                </form>
                {/* Register From */}
                <form onSubmit={handleSubmit}>
                    <fieldset className="space-y-1.5">
                        {/* Email Address */}
                        <div>
                            <label className="label text-lg md:text-xl text-neutral">Email Address</label><br />
                            <input type="email" name="email" placeholder="example@email.com"
                            className="input w-full text-base md:text-lg focus:border-none focus:outline-hidden focus:ring-1 focus:ring-primary" required />
                        </div>
                        {/* Submit Button */}
                        <div>
                            <button type="submit" className="btn bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white w-full">Reset password</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </dialog>
    );
};

export default ForgetPassword;