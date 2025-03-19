import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "motion/react";
import { asset } from "../utils/asset";

// Toast
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

const ContactUs = () => {
  // Mutation for sending contact message
  const { mutate } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/contact-message`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.insertedId) {
        Toast.fire({ icon: "success", title: "Message sent successfully!" });
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
    const data = Object.fromEntries(formData.entries());

    mutate(data);
    form.reset();
  };

  return (
    <motion.div className="bg-base-100 py-16"
      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <div className="w-11/12 mx-auto flex flex-col lg:flex-row items-center gap-10">
        {/* Left - Form */}
        <motion.div className="flex-1 space-y-6"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-2xl md:text-4xl font-bold text-neutral">
            Contact <span className="text-primary">Us</span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Your Name" required
              className="w-full text-neutral p-3 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary" />
            <input type="email" name="email" placeholder="Your Email" required
              className="w-full text-neutral p-3 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary" />
            <textarea name="message" placeholder="Your Message" rows={5} required
              className="w-full text-neutral p-3 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary" />
            <button type="submit"
              className="bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white cursor-pointer px-6 py-3 rounded-md font-medium hover:opacity-90 transition">
              Send Message
            </button>
          </form>
        </motion.div>

        {/* Right - Illustration */}
        <motion.div className="flex-1"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <img src={asset("images/ContactUs.svg")} alt="Contact Us" className="w-full max-h-[70vh] object-contain" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactUs;