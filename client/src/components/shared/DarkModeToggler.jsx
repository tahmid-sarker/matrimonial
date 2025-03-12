import { use } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const DarkModeToggler = () => {
    const { isDark, toggleTheme } = use(ThemeContext);

    return (
        <button onClick={toggleTheme} className={`swap swap-rotate ${isDark && "swap-active"}`}>
            <FaSun className="swap-on h-7 w-7 fill-current text-yellow-300" />
            <FaMoon className="swap-off h-7 w-7 fill-current" />
        </button>
    );
};

export default DarkModeToggler;