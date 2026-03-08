import { useNavigate, Link } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import { FiShoppingCart, FiPackage, FiClock, FiShield } from "react-icons/fi";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-zinc-950 min-h-screen">
      <NavigationBar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-zinc-950 to-zinc-950"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 text-sm font-medium">
                Serving Peshawar Since 2024
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
              Your Trusted
              <br />
              <span className="text-emerald-400">Pharmacy Partner</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-lg">
              Quality medicines, expert care, and fast delivery. Serving
              pharmacies near Hayatabad Medical Complex, Peshawar.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/prescriptionform")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl px-8 py-3.5 transition-all shadow-lg shadow-emerald-500/20"
              >
                Upload Prescription
              </button>
              <button
                onClick={() => navigate("/inventory-user")}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-xl px-8 py-3.5 transition-all border border-zinc-700"
              >
                Browse Medicines
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: <FiShoppingCart />,
              title: "Easy Ordering",
              desc: "Quick POS system and online ordering for any pharmacy",
            },
            {
              icon: <FiPackage />,
              title: "Complete Stock",
              desc: "Wide range of Pakistani & international medicines",
            },
            {
              icon: <FiClock />,
              title: "Expiry Tracking",
              desc: "Never sell expired medicine with smart alerts",
            },
            {
              icon: <FiShield />,
              title: "Secure & Reliable",
              desc: "DRAP compliant with full audit trail",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all group"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 text-xl mb-4 group-hover:bg-emerald-500/20 transition">
                {f.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-emerald-900/30 to-zinc-900 rounded-2xl border border-emerald-500/20 p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to modernize your pharmacy?
          </h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            Join pharmacies in Peshawar already using our system. Start managing
            inventory, sales, and prescriptions smarter.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/sign-up"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl px-8 py-3 transition-all"
            >
              Get Started Free
            </Link>
            <Link
              to="/employee-sign-in"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-xl px-8 py-3 transition-all border border-zinc-700"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
