import { FaChevronDown, FaList, FaSearch } from "react-icons/fa";
import { LuPhoneCall } from "react-icons/lu";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function NavigationBar() {
  const { currentUser } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const togglePopup = () => setShowPopup(!showPopup);

  return (
    <div>
      <div className="bg-zinc-950 border-b border-zinc-800">
        <div className="flex justify-between items-center max-w-7xl mx-auto p-3">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-white font-bold">Pharmacy</span>
            </div>
            <form className="flex text-sm ml-10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for medication"
                  className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg placeholder-zinc-500 focus:outline-none focus:border-emerald-500 w-56 p-2 pl-10"
                />
                <FaSearch className="text-gray-500 absolute top-1/2 transform -translate-y-1/2 left-3" />
              </div>
              <button
                type="submit"
                className="bg-emerald-600 text-white rounded-lg px-6 ml-2 hover:bg-emerald-500 transition-all text-sm"
              >
                Search
              </button>
            </form>
          </div>
          <button
            onClick={togglePopup}
            className="bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg p-2 px-4 flex items-center text-sm hover:bg-zinc-700 transition-all"
          >
            <LuPhoneCall className="mr-2 text-emerald-400" />
            Contact
          </button>
          {showPopup && (
            <div className="absolute z-10 mt-2 top-16 right-16 bg-zinc-800 border border-zinc-700 shadow-lg rounded-lg p-3 px-4 text-sm transition-all">
              <p className="text-emerald-400 font-medium">0915-XXX-XXXX</p>
            </div>
          )}
        </div>
      </div>
      <div className="bg-zinc-950">
        <div className="flex justify-between items-center max-w-7xl mx-auto p-2 px-3">
          <div className="relative inline-block text-left">
            <button
              onClick={toggleMenu}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition"
            >
              <FaList className="text-lg" />
              <span className="text-sm font-medium">Menu</span>
              <FaChevronDown
                className={`text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div
                className="absolute z-10 mt-2 w-56 rounded-lg shadow-lg bg-zinc-800 border border-zinc-700 overflow-hidden"
                role="menu"
              >
                <Link
                  to="/"
                  className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white border-b border-zinc-700"
                  role="menuitem"
                >
                  Home
                </Link>
                <Link
                  to="/prescriptionform"
                  className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white border-b border-zinc-700"
                  role="menuitem"
                >
                  Upload Prescription
                </Link>
                <Link
                  to="/feedback"
                  className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white border-b border-zinc-700"
                  role="menuitem"
                >
                  Feedback
                </Link>
                <Link
                  to="/promotions"
                  className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white border-b border-zinc-700"
                  role="menuitem"
                >
                  Promotions
                </Link>
                <Link
                  to="/inventory-user"
                  className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white border-b border-zinc-700"
                  role="menuitem"
                >
                  Drug Catalog
                </Link>
                <Link
                  to="/driver-signin"
                  className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white border-b border-zinc-700"
                  role="menuitem"
                >
                  Driver Login
                </Link>
                <Link
                  to="/employee-sign-in"
                  className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  role="menuitem"
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link to={"/profile"}>
              {currentUser ? (
                <img
                  className="rounded-full h-8 w-8 object-cover ring-2 ring-emerald-500"
                  src={currentUser.avatar}
                  alt="profile"
                />
              ) : (
                <Link to="/sign-in">
                  <button className="bg-zinc-800 text-zinc-300 rounded-lg p-2 px-5 text-sm hover:bg-zinc-700 transition-all">
                    Login
                  </button>
                </Link>
              )}
            </Link>
            {!currentUser && (
              <Link to={"/sign-up"}>
                <button className="bg-emerald-600 text-white rounded-lg p-2 px-5 text-sm hover:bg-emerald-500 transition-all">
                  Register
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
