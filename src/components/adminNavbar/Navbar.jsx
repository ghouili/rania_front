// import "./navbar.css";
import React, { useContext, useEffect, useRef, useState } from "react";
// import { Link } from 'react-router-dom';

import { BsSun, BsBell } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdExpand } from "react-icons/io";
import {
    TbSquareRoundedArrowLeft,
    TbSquareRoundedArrowRight,
  } from "react-icons/tb";
  import { BiMoon, BiBell } from "react-icons/bi";

import Cookies from "universal-cookie";

import { Link, useNavigate } from "react-router-dom";
import { GeneralContext } from "../../Hooks/context/GeneralContext";

const Navbar = () => {

  const { sidebarOpen, ToggleSidebar, HandleThemeSwitch, theme } = useContext(GeneralContext);
  const cookies = new Cookies();
  const navigate = useNavigate();
  let user = cookies.get("user");
  const menuRef = useRef(null);

  const [toggleMenu, setToggleMenu] = useState(false);

  const handleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setToggleMenu(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Unbind the event listener on cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const Logout = async () => {
    cookies.remove("user");
    window.location.reload();
  };

  return (
    <>
      <div className="h-14 border-b rounded-sm flex flex-row items-center justify-between bg-white shadow-sm">
        {/* left side */}

        <div className="flex flex-row items-center pl-3 gap-3">
          <div
            className="w-1/4 flex items-center justify-center cursor-pointer text-gray-700"
            onClick={ToggleSidebar}
          >
            {sidebarOpen ? (
              <TbSquareRoundedArrowLeft size={24} />
            ) : (
              <TbSquareRoundedArrowRight size={24} />
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search.."
              className=" text-sm py-2 pl-10 pr-2 rounded-md border-none outli
             focus:outline-none"
            />
            <div className="absolute top-2 left-1.5  ">
              <AiOutlineSearch size={20} color="#898694" />
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="flex flex-row items-center gap-3 pr-7">
          <div
            className=" p-2.5 rounded-full cursor-pointer hover:bg-blue-50 text-gray-600 hover:text-blue-400"
            onClick={handleFullScreen}
          >
            <IoMdExpand size={22} />
          </div>
          <div
            className=" p-2.5 rounded-full cursor-pointer hover:bg-blue-50 text-gray-600 hover:text-blue-400"
            onClick={HandleThemeSwitch}
          >
            {theme === 'light' ? 
            <BiMoon size={22} />
            :
            <BsSun size={22} />
          }
          </div>
          <div
            className=" p-2.5 rounded-full cursor-pointer hover:bg-blue-50 text-gray-600 hover:text-blue-400"
            // onClick={}
          >
            <BsBell size={22} />
            
          </div>
          {!user ? null : (
            <div className="relative p-2.5 rounded-full cursor-pointer hover:bg-blue-50 text-gray-600 hover:text-blue-400">
              <BiBell size={22} />
              <div className="absolute flex items-center justify-center rounded-full w-4 h-4 bg-red-600 right-0 top-0 ">
                <p className="text-xs font-medium text-white ">5</p>
              </div>
            </div>
          )}
          {user ? (
            <div className="relative h-full w-full" ref={menuRef}>
              <div
                // ref={menuRef}
                onClick={() => setToggleMenu(!toggleMenu)}
                className="  p-2.5 h-full flex flex-row items-center gap-2 cursor-pointer 
        border-x font-semibold border-gray-200 bg-gray-100 text-gray-600 hover:text-white hover:bg-blue-900 "
              >
                <img
                  src={`${
                    user.avatar
                      ? `http://localhost:5000/uploads/images/${user.avatar}`
                      : `http://localhost:5000/uploads/images/avatar.png`
                  }`}
                  // src={`http://localhost:5000/uploads/images/${user.avatar}`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    {user.prenom} {user.nom}
                  </span>
                  <span className="text-xs -mt-1">{user.email}</span>
                </div>
              </div>
              {!toggleMenu ? null : (
                <div
                  className="scale-up-ver-top shadow-md flex flex-col items-center gap-2 px-4 py-2 font-medium 
              rounded-md z-30 absolute top-12 right-7 bg-white border "
                >
                  <Link
                    to={`/user/${user._id}`}
                    className="w-full px-3 py-1 text-center hover:bg-blue-700 hover:text-white rounded-md"
                  >
                    My Profile
                  </Link>
                  <div className="w-full border-b " />
                  <button
                    onClick={Logout}
                    className="w-full px-3 py-1 text-center hover:bg-blue-700 hover:text-white rounded-md"
                  >
                    LOGOUT
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              ref={menuRef}
              className=" relative  p-2.5 h-full flex flex-row items-center "
            >
              <button
                onClick={() => {
                  navigate("/login");
                }}
                className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium
           text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 
           group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white  focus:ring-4
            focus:outline-none "
              >
                <span
                  className="relative px-3 py-1.5 transition-all ease-in duration-75 bg-white  rounded-md 
            group-hover:bg-opacity-0"
                >
                  Authenticate
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
