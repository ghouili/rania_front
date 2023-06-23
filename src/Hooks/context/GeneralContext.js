import React, { createContext, useEffect, useState } from 'react'
import { socket } from '../../Socket';
// import Cookies from "universal-cookie";

const GeneralContext = createContext();

const ProviderContext = ({ children }) => {
    // const cookies = new Cookies();
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [fooEvents, setFooEvents] = useState([]);

    const [alert, setAlert] = useState(false);
    const [alertData, setAlertData] = useState("");
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


    // useEffect(() => {
    //     socket.on('me', (id) => {
    //         console.log(id);
    //     });
    //     socket.on("Alert", (notification) => {
    //         setAlert(true);
    //         setAlertData(notification);
    //     });

    //     return () => {
    //         // BAD: this will remove all listeners for the 'foo' event, which may
    //         // include the ones registered in another component
    //         socket.off("Alert");
    //     };
    // }, []);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
            console.log('connected');
            console.log(socket.connected);
        }
        socket.on("Alert", ({success, data}) => {
                    setAlert(true);
                    setAlertData(data);
                });

        function onDisconnect() {
            setIsConnected(false);
        }

        function onFooEvent(value) {
            setFooEvents(previous => [...previous, value]);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('foo', onFooEvent);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('foo', onFooEvent);
        };
    }, []);
    const HandleThemeSwitch = () => {
        setTheme(theme === "dark" ? "light" : "dark");
        // localStorage.setItem('preferredMode', theme === "dark" ? "light" : "dark");
    }




    const values = { sidebarOpen, theme, alert, alertData, setAlert, setAlertData, setSidebarOpen, ToggleSidebar, HandleThemeSwitch };
    return (
        <GeneralContext.Provider value={values} >
            {children}
        </GeneralContext.Provider>
    )
}

export { ProviderContext, GeneralContext }