import React, { createContext, useEffect, useState } from 'react'
// import Cookies from "universal-cookie";

const GeneralContext = createContext();

const ProviderContext = ({ children }) => {
    // const cookies = new Cookies();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [theme, setTheme] = useState('light');

    const ToggleSidebar = () => {
        var sidebar = document.getElementById("main__sidebar");
        setSidebarOpen(!sidebarOpen);
        if (!sidebarOpen) {
            sidebar.style.width = "255px";
        } else {
            sidebar.style.width = "85px";
        }
    }

    useEffect(() => {
        if (theme === "dark") {
            console.log(theme);
            document.documentElement.classList.add("dark");
        } else {
            console.log(theme);
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

   
   

    const HandleThemeSwitch = () => {
        setTheme(theme === "dark" ? "light" : "dark");
        // localStorage.setItem('preferredMode', theme === "dark" ? "light" : "dark");
    }

   

   
    const values = { sidebarOpen, theme, setSidebarOpen, ToggleSidebar, HandleThemeSwitch  };
    return (
        <GeneralContext.Provider value={values} >
            {children}
        </GeneralContext.Provider>
    )
}

export { ProviderContext, GeneralContext }