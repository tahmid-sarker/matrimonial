import { useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';

const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(localStorage.getItem("theme") == 'dark');

    useEffect(() => {
        const root = document.documentElement;
        const theme = isDark ? "dark" : "light";
        root.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme)
    }, [isDark])

    const toggleTheme = () => setIsDark(prev => !prev)

    return (
        <ThemeContext value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext>
    );
};

export default ThemeProvider;