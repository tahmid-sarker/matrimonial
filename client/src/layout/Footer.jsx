import { Link, NavLink } from 'react-router';
import { FaFacebook, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import { asset } from '../utils/asset';

const Footer = () => {

  const navLinks = <>
    <li><NavLink to="/" className="hover:text-primary hover:underline hover:underline-offset-4">Home</NavLink></li>
    <li><NavLink to="/terms" className="hover:text-primary hover:underline hover:underline-offset-4">Terms of Service</NavLink></li>
    <li><NavLink to="/privacy" className="hover:text-primary hover:underline hover:underline-offset-4">Privacy Policy</NavLink></li>
  </>;

  return (
    <footer className="bg-base-200 text-neutral">
      <div className="w-11/12 mx-auto flex flex-col md:flex-row justify-around p-4 gap-6">

        {/* Brand Info */}
        <div className="flex flex-col justify-center items-start gap-2">
          {/* Logo */}
          <Link to="/" className="text-lg md:text-2xl font-bold flex items-center gap-1.5 whitespace-nowrap">
            <img src={asset("icons/logo.png")} alt="Bengal Matrimony Logo" className="w-8 h-8" />
            <span className="text-primary">Bengal</span>
            <span className="text-secondary">Matrimony</span>
          </Link>
          <div>
            <p className="font-medium">Find your perfect match with Bengal Matrimony</p>
            <p className="font-medium">Email Us</p>
            <a href="mailto:contact.tahmid.sarker@gmail.com" target="_blank" className="font-medium text-primary hover:text-secondary transition">
              contact.tahmid.sarker@gmail.com
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-xl font-semibold mb-2 text-neutral">Explore</h3>
          <ul className="space-y-1">
            {navLinks}
          </ul>
        </div>

        {/* Contact / Social */}
        <div className="flex flex-col items-start gap-3">
          <h3 className="text-xl font-bold text-neutral">Connect with Us</h3>
          <div className="flex gap-3">
            {/* Social Media Icons */}
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full text-white shadow-md transition">
              <FaFacebook size={20} />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"
              className="bg-blue-800 hover:bg-blue-900 p-2 rounded-full text-white shadow-md transition">
              <FaLinkedin size={20} />
            </a>
            <a href="https://www.github.com" target="_blank" rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-black p-2 rounded-full text-white shadow-md transition">
              <FaGithub size={20} />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"
              className="bg-blue-400 hover:bg-blue-500 p-2 rounded-full text-white shadow-md transition">
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-sm text-neutral mt-4">
        &copy; {new Date().getFullYear()} Bengal Matrimony. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;