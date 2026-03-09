import { useState, useEffect } from "react";
import PromotionTable from "./PromotionTable";
import { Link } from "react-router-dom";
import { MdDownload } from "react-icons/md";
import SideBar from "../../components/SideBar";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function PromotionManagement() {
  const [promotionsCount, setPromotionsCount] = useState(0);
  const [activePromotionsCount, setActivePromotionsCount] = useState(0);
  const [inactivePromotionsCount, setInactivePromotionsCount] = useState(0);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = () => {
    fetch("/api/promotion/read")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Failed to fetch promotions:", response.statusText);
          throw new Error("Failed to fetch promotions");
        }
      })
      .then((data) => {
        const promotions = data.promotion;
        setPromotionsCount(promotions.length);

        const activePromotions = promotions.filter(
          (promotion) => promotion.status === "Active",
        );
        const inactivePromotions = promotions.filter(
          (promotion) => promotion.status === "Inactive",
        );

        setActivePromotionsCount(activePromotions.length);
        setInactivePromotionsCount(inactivePromotions.length);
      })
      .catch((error) => {
        console.error("Error fetching promotions:", error);
      });
  };

  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return formattedDate;
  };

  const generateReport = () => {
    fetch("/api/promotion/read")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Failed to generate report:", response.statusText);
          throw new Error("Failed to generate report");
        }
      })
      .then((data) => {
        const promotions = data.promotion;

        const doc = new jsPDF();

        doc.addImage("./logo.png", "PNG", 14, 10, 43, 14);

        doc.setFontSize(10);
        doc.text("PharmaCare POS — Pharmacy Management System", 14, 30);
        doc.text("Plot 14, Hayatabad Phase 5, Peshawar, KPK.", 14, 35);
        doc.text("Email: info@pharmacare.pk  |  Phone: 091-5656994", 14, 40);

        doc.line(14, 45, 196, 45);

        doc.setFontSize(14);
        doc.text("Promotion Management Report", 14, 55);

        const tableHeader = [
          [
            "Promotion ID",
            "Coupon Code",
            "Coupon Price",
            "Total Amount",
            "Type",
            "Created At",
            "Expired At",
            "Status",
          ],
        ];

        const tableData = promotions.map((promotion) => [
          promotion.promotionID,
          promotion.couponCode,
          promotion.couponPrice,
          promotion.totalAmount,
          promotion.type,
          formatDate(promotion.createdAt),
          formatDate(promotion.expiredAt),
          promotion.status,
        ]);

        doc.autoTable({
          startY: 60,
          head: tableHeader,
          body: tableData,
          styles: {
            lineColor: [189, 189, 189],
            lineWidth: 0.1,
          },
          headStyles: {
            lineWidth: 0,
            fillColor: [0, 128, 102],
            textColor: [255, 255, 255],
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240],
          },
        });

        doc.save("Promotion Management Report.pdf");
      })
      .catch((error) => {
        console.error("Error generating report:", error);
      });
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 flex items-center justify-between border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">
              Promotion Management
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Manage offers, promotions and customer feedback
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={generateReport}
              className="btn-secondary text-sm inline-flex items-center"
            >
              <MdDownload className="text-base mr-2" />
              Download Report
            </button>
            <Link to="/feedback-management" className="btn-secondary text-sm">
              Feedbacks
            </Link>
            <Link
              to="/create-promotion"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg py-2 px-4 text-sm"
            >
              + New Promotion
            </Link>
          </div>
        </div>
        <div className="px-6 py-5 grid grid-cols-3 gap-4 border-b border-zinc-800">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg shadow-black/20">
            <p className="text-zinc-400 text-sm">Total Offers</p>
            <p className="text-3xl font-bold text-zinc-100 mt-1">
              {promotionsCount}
            </p>
          </div>
          <div className="bg-zinc-900 border border-emerald-900/40 rounded-xl p-5 shadow-lg shadow-black/20">
            <p className="text-zinc-400 text-sm">Active Offers</p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">
              {activePromotionsCount}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg shadow-black/20">
            <p className="text-zinc-400 text-sm">Inactive Offers</p>
            <p className="text-3xl font-bold text-zinc-100 mt-1">
              {inactivePromotionsCount}
            </p>
          </div>
        </div>
        <div className="px-6 py-3 border-b border-zinc-800">
          <span className="text-sm text-zinc-400">
            All Promotions ({promotionsCount})
          </span>
        </div>
        <PromotionTable />
      </div>
    </div>
  );
}
