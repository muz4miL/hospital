import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";
import {
  FiShield,
  FiShoppingCart,
  FiUser,
  FiLock,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";
import { BiPulse } from "react-icons/bi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

export default function Portal() {
  const [activeTab, setActiveTab] = useState("admin");
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (currentUser) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const resetMode = (mode) => {
    setActiveTab(mode);
    setFormData({});
    setShowPassword(false);
    dispatch(signInFailure(null));
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/admin-dashboard");
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  const handleEmployeeLogin = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signupEmp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, NIC: formData.password }),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/admin-dashboard");
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ══════════════════════════════════════════
          LEFT PANEL  — hero / branding
      ══════════════════════════════════════════ */}
      <div className="relative hidden w-[50%] flex-col lg:flex bg-[#04111f] border-r border-white/[0.06]">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_30%_40%,rgba(16,185,129,0.13),transparent)]" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#020c17] to-transparent" />
        </div>

        {/* Content */}
        <div className="relative flex flex-col items-center justify-center flex-1 text-center px-10 xl:px-16">
          {/* Logo mark */}
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-[18px] border border-emerald-400/20 bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-[0_0_50px_rgba(16,185,129,0.35)] mb-5">
            <BiPulse className="text-[28px] text-white" />
          </div>

          {/* Brand name */}
          <p className="text-[13px] font-semibold uppercase tracking-[0.3em] text-emerald-400/90 mb-3">
            PharmaCare
          </p>

          {/* Main headline */}
          <h1 className="text-[38px] xl:text-[44px] font-bold leading-[1.1] tracking-[-0.03em] text-white mb-4">
            Welcome to the
            <span className="block mt-1 text-transparent bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text">
              pharmacy portal
            </span>
          </h1>

          <p className="max-w-[360px] text-[14.5px] leading-[1.7] text-slate-400 mb-8">
            Complete pharmacy operations suite — billing, inventory, expiry
            tracking, and team management in one place.
          </p>

          {/* Feature list */}
          <div className="w-full max-w-[320px] space-y-2.5">
            {[
              {
                icon: <FiZap />,
                text: "Lightning-fast POS with barcode support",
              },
              {
                icon: <FiCheckCircle />,
                text: "Expiry alerts at 30 / 60 / 90 days",
              },
              {
                icon: <FiShoppingCart />,
                text: "Live sales analytics & reporting",
              },
              {
                icon: <FiTrendingUp />,
                text: "Role-based access for staff & owners",
              },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.04] px-3.5 py-3 text-left"
              >
                <span className="flex items-center justify-center w-7 h-7 text-xs shrink-0 rounded-lg bg-emerald-400/10 text-emerald-300">
                  {icon}
                </span>
                <span className="text-[13px] text-slate-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative pb-6 text-center px-10 xl:px-16">
          <p className="text-[12px] text-slate-600">
            Pharmacy Operations Suite &nbsp;·&nbsp; Peshawar, Pakistan
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL  — login form
      ══════════════════════════════════════════ */}
      <div className="relative flex flex-1 flex-col items-center justify-center bg-[#07111e] px-6 py-8 sm:px-10 overflow-y-auto">
        {/* Very faint top glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-[80px]" />
        {/* Mobile-only logo */}
        <div className="flex flex-col items-center gap-3 mb-10 lg:hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-[0_0_32px_rgba(16,185,129,0.3)]">
            <BiPulse className="text-2xl text-white" />
          </div>
          <p className="text-[15px] font-semibold tracking-wide text-white">
            PharmaCare
          </p>
        </div>
        <div className="relative w-full max-w-[420px]">
          {/* Title */}
          <div className="mb-7">
            <h2 className="text-[40px] font-bold tracking-[-0.02em] text-white leading-tight">
              Log in to your Account
            </h2>
            <p className="mt-2 text-[14px] text-slate-500">
              Please enter your details to continue
            </p>
          </div>

          {/* Tab switcher */}
          <div className="mb-5 flex rounded-xl border border-white/[0.08] bg-white/[0.04] p-1">
            {[
              {
                id: "admin",
                label: "Admin / Owner",
                icon: <FiShield className="text-sm" />,
              },
              {
                id: "customer",
                label: "Employee",
                icon: <HiOutlineOfficeBuilding className="text-sm" />,
              },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => resetMode(id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-[10px] py-2.5 text-[13px] font-medium transition-all duration-200 ${
                  activeTab === id
                    ? "bg-emerald-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.40)]"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={
              activeTab === "admin" ? handleAdminLogin : handleEmployeeLogin
            }
            className="space-y-3.5"
          >
            {/* Email */}
            <div className="relative">
              <FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-slate-500" />
              <input
                type="email"
                id="email"
                autoComplete="email"
                placeholder="Email address"
                value={formData.email || ""}
                onChange={handleChange}
                className="portal-input h-[52px] w-full rounded-2xl border border-white/[0.09] bg-white/[0.05] pl-12 pr-4 text-[14px] text-white placeholder:text-slate-600 transition focus:border-emerald-400/50 focus:bg-white/[0.07] focus:outline-none focus:ring-[3px] focus:ring-emerald-400/10"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete={
                  activeTab === "admin" ? "current-password" : "off"
                }
                placeholder={
                  activeTab === "admin" ? "Password" : "NIC / Employee ID"
                }
                value={formData.password || ""}
                onChange={handleChange}
                className="portal-input h-[52px] w-full rounded-2xl border border-white/[0.09] bg-white/[0.05] pl-12 pr-14 text-[14px] text-white placeholder:text-slate-600 transition focus:border-emerald-400/50 focus:bg-white/[0.07] focus:outline-none focus:ring-[3px] focus:ring-emerald-400/10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute transition -translate-y-1/2 right-4 top-1/2 text-slate-500 hover:text-slate-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FiEyeOff className="text-[15px]" />
                ) : (
                  <FiEye className="text-[15px]" />
                )}
              </button>
            </div>

            {/* Remember + demo hint row */}
            <div className="flex items-center justify-between px-0.5 text-[13px]">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/5 accent-emerald-500"
                />
                Remember me
              </label>

            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.07] px-4 py-3 text-[13px] text-rose-300">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-1 flex h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl bg-emerald-500 text-[14px] font-semibold text-white shadow-[0_8px_28px_rgba(16,185,129,0.30)] transition hover:bg-emerald-400 hover:shadow-[0_12px_36px_rgba(16,185,129,0.40)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <FiArrowRight className="text-base transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Help text */}
          <p className="mt-6 text-center text-[13px] text-slate-500">
            Need help?{" "}
            <Link
              to="/sign-up"
              className="font-semibold transition text-emerald-400 hover:text-emerald-300"
            >
              Contact IT Support
            </Link>
          </p>
          <p className="mt-1 text-center text-[12.5px] text-slate-600">
            support@pharmacare.pk
          </p>

          {/* Guest access */}
          <div className="flex items-center gap-3 mt-5">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[12px] text-slate-600">or</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>
          <Link
            to="/home"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] py-3 text-[13px] font-medium text-slate-400 transition hover:border-white/15 hover:text-slate-200"
          >
            Browse as guest
            <FiArrowRight className="text-xs" />
          </Link>
        </div>{" "}
      </div>
    </div>
  );
}
