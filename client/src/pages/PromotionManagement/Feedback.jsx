import React, { useState, useEffect } from "react";
import SwiperCore from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

SwiperCore.use([Navigation, Pagination, Autoplay]);

export default function Feedback() {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    fetchFeedback()
      .then((data) => {
        console.log("Fetched feedback:", data);
        if (data && data.success) {
          setFeedback(data.feedback);
        } else {
          console.error("Failed to fetch feedback:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching feedback:", error.message);
      });
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/feedback/read");
      if (!response.ok) {
        throw new Error("Failed to fetch feedback: " + response.statusText);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching feedback:", error.message);
      throw new Error("Failed to fetch feedback");
    }
  };

  const approvedFeedback = feedback.filter(
    (item) => item.status === "Approved",
  );

  const topRatedFeedback = [...approvedFeedback]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const newestFeedback = [...approvedFeedback]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="bg-zinc-950 min-h-screen">
      <NavigationBar />

      <div className="max-w-7xl mx-auto p-3 mt-10">
        <h1 className="text-center text-4xl text-emerald-400 font-bold">
          Feedback from our customers
        </h1>
        <div>
          <Link
            to="/feedback-submit"
            className="bg-emerald-600 text-white hover:bg-emerald-500 font-semibold rounded-lg inline-block w-auto p-3 px-7 my-10"
          >
            Submit Feedback
          </Link>
        </div>

        <div className="mb-20">
          <h2 className="text-lg font-semibold text-white">
            Top Rated Feedbacks:
          </h2>
          <Swiper slidesPerView={2} navigation pagination className="mt-5">
            {topRatedFeedback.map((item, index) => (
              <SwiperSlide
                key={index}
                className="flex justify-center items-center"
              >
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col p-6 px-10 mx-20 w-max">
                  <h1 className="text-lg font-bold text-white">{item.name}</h1>
                  <h2 className="font-semibold text-emerald-400">
                    Rate out of 10: {item.rating}
                  </h2>
                  <p className="mt-3 text-zinc-300">{item.feedback}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mb-20">
          <h2 className="text-lg font-semibold text-white">
            Newest Feedbacks:
          </h2>
          <Swiper slidesPerView={2} navigation pagination className="mt-5">
            {newestFeedback.map((item, index) => (
              <SwiperSlide
                key={index}
                className="flex justify-center items-center"
              >
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col p-6 px-10 mx-20 w-max">
                  <h1 className="text-lg font-bold text-white">{item.name}</h1>
                  <h2 className="font-semibold text-emerald-400">
                    Rate out of 10: {item.rating}
                  </h2>
                  <p className="mt-3 text-zinc-300">{item.feedback}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mb-20">
          <h2 className="text-lg font-semibold text-white">All Feedbacks:</h2>
          <Swiper slidesPerView={2} navigation pagination className="mt-5">
            {approvedFeedback.map((item, index) => (
              <SwiperSlide
                key={index}
                className="flex justify-center items-center"
              >
                <div className="bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col p-6 px-10 mx-20 w-max">
                  <h1 className="text-lg font-bold text-white">{item.name}</h1>
                  <h2 className="font-semibold text-emerald-400">
                    Rate out of 10: {item.rating}
                  </h2>
                  <p className="mt-3 text-zinc-300">{item.feedback}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <Footer />
    </div>
  );
}
