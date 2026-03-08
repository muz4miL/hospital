import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../../components/OAuth";
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";
import img01 from "../../assets/Sign-up-2.png";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className="bg-zinc-950 min-h-screen">
      <NavigationBar />
      <div className="p-3 w-auto mx-auto">
        <div className="flex flex-col lg:flex-row max-w-7xl mx-auto justify-between mt-14 mb-14 lg:gap-5">
          <img
            src={img01}
            alt=""
            className="object-cover w-full lg:w-2/3 xl:w-1/2"
          />
          <div className="flex flex-col justify-center lg:w-1/2">
            <h1 className="text-3xl text-center lg:text-center font-semibold my-7 text-emerald-400 ">
              Sign Up
            </h1>
            <div className="p-8 bg-zinc-900 mx-8 rounded-xl border border-zinc-800 shadow-lg shadow-black/20">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="username"
                  className="input-field"
                  id="username"
                  onChange={handleChange}
                />
                <input
                  type="email"
                  placeholder="email"
                  className="input-field"
                  id="email"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  placeholder="phone number"
                  pattern="[0-9]{10}"
                  className="input-field"
                  id="phonenumber"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  placeholder="address"
                  className="input-field"
                  id="address"
                  onChange={handleChange}
                />
                <input
                  type="password"
                  placeholder="password"
                  className="input-field"
                  id="password"
                  onChange={handleChange}
                />

                <button
                  disabled={loading}
                  className="btn-primary py-3 disabled:opacity-80"
                >
                  {loading ? "Loading..." : "Sign Up"}
                </button>
                <OAuth />
              </form>
            </div>
            <div className="flex gap-2 ml-9 mt-5 mb-8">
              <p className="text-zinc-400">Have an account?</p>
              <Link to={"/sign-in"}>
                <span className="text-emerald-400">Sign in</span>
              </Link>
            </div>
          </div>
        </div>
        {error && <p className="text-red-400 mt-5">{error}</p>}
      </div>
      <Footer />
    </div>
  );
}
