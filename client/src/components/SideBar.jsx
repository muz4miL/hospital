import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { FaRegUser, FaBoxesStacked } from "react-icons/fa6";
import { FiTruck, FiShoppingCart, FiBarChart2 } from "react-icons/fi";
import { MdOutlineInventory, MdExitToApp, MdSettings } from "react-icons/md";
import { FiSun, FiMoon } from "react-icons/fi";
import { TbDiscount2 } from "react-icons/tb";
import { LiaFilePrescriptionSolid } from "react-icons/lia";
import { GrUserWorker } from "react-icons/gr";
import { BiDollarCircle } from "react-icons/bi";
import { BsChevronDown } from "react-icons/bs";
import { RiDashboardFill } from "react-icons/ri";
import { FiAlertTriangle } from "react-icons/fi";
import { useDispatch } from "react-redux";
import {
  signOutUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice";

export default function SideBar() {
  const [subMenuOpen, setSubMenuOpen] = useState({});
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("pharmacy-theme") || "dark";
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Apply theme on mount and changes
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("pharmacy-theme", newTheme);
    if (newTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("./api/auth/signoutEmp");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const Menus = [
    { title: "Dashboard", icon: <RiDashboardFill />, path: "/admin-dashboard" },
    {
      title: "Point of Sale",
      icon: <FiShoppingCart />,
      path: "/pos",
      highlight: true,
    },
    {
      title: "Inventory",
      icon: <MdOutlineInventory />,
      path: "/inventory-management",
      submenu: true,
      submenuItems: [
        { title: "All Medicines", path: "/inventory-management" },
        { title: "Add Medicine", path: "/create-inventory" },
        { title: "Supply Orders", path: "/supply-request" },
      ],
    },
    {
      title: "Sales & Reports",
      icon: <FiBarChart2 />,
      path: "/sales-history",
      submenu: true,
      submenuItems: [
        { title: "Sales History", path: "/sales-history" },
        { title: "Expiry Alerts", path: "/expiry-alerts" },
      ],
    },
    {
      title: "Suppliers",
      icon: <FaBoxesStacked />,
      path: "/supplier-management",
      submenu: true,
      submenuItems: [
        { title: "All Suppliers", path: "/supplier-management" },
        { title: "Add Supplier", path: "/create-supplier" },
        { title: "Orders", path: "/orders" },
      ],
    },
    // {
    //   title: "Prescriptions",
    //   icon: <LiaFilePrescriptionSolid />,
    //   path: "/prescription-management",
    //   submenu: true,
    //   submenuItems: [
    //     { title: "All Prescriptions", path: "/prescription-management" },
    //     { title: "New Prescription", path: "/create-prescription" },
    //   ],
    // },
    {
      title: "Employees",
      icon: <GrUserWorker />,
      path: "/employee-management",
      submenu: true,
      submenuItems: [
        { title: "All Employees", path: "/employee-management" },
        { title: "Leave Records", path: "/employee-leave-management" },
        { title: "Salary Records", path: "/employee-salary-management" },
      ],
    },
    { title: "Users", icon: <FaRegUser />, path: "/user-management" },
    { title: "Settings", icon: <MdSettings />, path: "/settings" },
  ];

  const toggleSubMenu = (index) => {
    setSubMenuOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex">
      <Toaster />
      <div className="bg-zinc-950 min-h-screen p-4 pt-6 w-56 border-r border-zinc-800 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 mb-6">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">Pharmacy</h1>
            <p className="text-zinc-500 text-xs">Management</p>
          </div>
        </div>

        {/* Menu */}
        <ul className="flex-1 space-y-0.5 overflow-y-auto">
          {Menus.map((menu, index) => (
            <React.Fragment key={index}>
              <li
                className={`text-sm flex items-center gap-x-3 cursor-pointer px-3 py-2 rounded-lg transition-all ${
                  menu.highlight
                    ? "bg-emerald-600 text-white hover:bg-emerald-500 font-medium"
                    : isActive(menu.path)
                      ? "bg-zinc-800 text-emerald-400"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                <span className="text-lg">{menu.icon}</span>
                <Link to={menu.path} className="text-sm flex-1">
                  {menu.title}
                </Link>
                {menu.submenu && (
                  <BsChevronDown
                    className={`text-xs transition-transform ${subMenuOpen[index] ? "rotate-180" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSubMenu(index);
                    }}
                  />
                )}
              </li>
              {menu.submenu && subMenuOpen[index] && (
                <ul className="ml-8 space-y-0.5 mt-0.5">
                  {menu.submenuItems.map((submenuItem, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        to={submenuItem.path}
                        className={`block text-xs px-3 py-1.5 rounded transition-colors ${
                          isActive(submenuItem.path)
                            ? "text-emerald-400"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {submenuItem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </React.Fragment>
          ))}
        </ul>

        {/* Theme Toggle & Sign Out */}
        <div className="pt-4 border-t border-zinc-800 space-y-1">
          <button
            onClick={toggleTheme}
            className="flex items-center text-zinc-400 text-sm gap-x-2 px-3 py-2 hover:bg-zinc-800 hover:text-zinc-200 rounded-lg w-full transition-colors"
          >
            {theme === "dark" ? (
              <><FiSun className="text-lg text-amber-400" /> Light Mode</>
            ) : (
              <><FiMoon className="text-lg text-blue-400" /> Dark Mode</>
            )}
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center text-zinc-400 text-sm gap-x-2 px-3 py-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg w-full transition-colors"
          >
            <MdExitToApp className="text-lg" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
