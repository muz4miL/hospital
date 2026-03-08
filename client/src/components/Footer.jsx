import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <div>
      <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400">
        <div className="container max-w-7xl mx-auto py-10 px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-white font-bold">Pharmacy</span>
              </div>
              <p className="text-zinc-500 text-sm mb-4">
                Modern pharmacy management system for Peshawar.
              </p>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="#!" className="hover:text-emerald-400 transition">
                    Terms and Conditions
                  </a>
                </li>
                <li>
                  <a href="#!" className="hover:text-emerald-400 transition">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="mb-3 font-semibold text-white text-sm">
                Customer Service
              </h5>
              <ul className="space-y-1 text-sm mb-4">
                <li>
                  <a href="#!" className="hover:text-emerald-400 transition">
                    Contact Us
                  </a>
                </li>
              </ul>
              <h5 className="mb-1 font-semibold text-white text-sm">Hotline</h5>
              <p className="text-sm mb-3">0915-XXX-XXXX</p>
              <h5 className="mb-1 font-semibold text-white text-sm">Email</h5>
              <p className="text-sm">info@pharmacy.pk</p>
            </div>
            <div>
              <h5 className="mb-3 font-semibold text-white text-sm">
                Location
              </h5>
              <p className="text-sm mb-2">Near Hayatabad Medical Complex</p>
              <p className="text-sm">Phase 4, Hayatabad, Peshawar</p>
              <p className="text-sm mt-2">Khyber Pakhtunkhwa, Pakistan</p>
            </div>
            <div>
              <h5 className="mb-3 font-semibold text-white text-sm">
                Follow Us
              </h5>
              <div className="flex gap-3 mb-4">
                <a
                  href="#!"
                  className="w-9 h-9 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-400 transition"
                >
                  <FaFacebook />
                </a>
                <a
                  href="#!"
                  className="w-9 h-9 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-400 transition"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#!"
                  className="w-9 h-9 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-400 transition"
                >
                  <FaTwitter />
                </a>
              </div>
              <h5 className="mb-1 font-semibold text-white text-sm">
                Delivery
              </h5>
              <p className="text-sm">
                Peshawar city limits - delivery within 24hrs subject to stock
                availability.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full bg-zinc-950 border-t border-zinc-800 p-4 text-center text-xs text-zinc-600">
          © 2024 Pharmacy Management System. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
