import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../../components/SideBar";

export default function PromotionUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [promotionData, setPromotionData] = useState({
    promotionID: "",
    couponCode: "",
    couponPrice: "",
    totalAmount: "",
    type: "",
    createdAt: "",
    expiredAt: "",
    status: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get(`/api/promotion/get/${id}`)
      .then((result) => {
        const promotion = result.data.promotion;
        promotion.createdAt = promotion.createdAt.split("T")[0];
        promotion.expiredAt = promotion.expiredAt.split("T")[0];
        setPromotionData(promotion);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const validateInputs = () => {
    const validationErrors = {};

    if (!promotionData.couponPrice.trim()) {
      validationErrors.couponPrice = "Coupon Price is required";
    } else if (parseFloat(promotionData.couponPrice) <= 0) {
      validationErrors.couponPrice = "Coupon Price must be a positive value";
    }

    if (!promotionData.totalAmount.trim()) {
      validationErrors.totalAmount = "Total Amount is required";
    } else if (parseFloat(promotionData.totalAmount) <= 0) {
      validationErrors.totalAmount = "Total Amount must be a positive value";
    }

    if (!promotionData.createdAt.trim()) {
      validationErrors.createdAt = "Created Date is required";
    }

    if (!promotionData.expiredAt.trim()) {
      validationErrors.expiredAt = "Expiry Date is required";
    } else if (
      new Date(promotionData.expiredAt) <= new Date(promotionData.createdAt)
    ) {
      validationErrors.expiredAt = "Expiry Date must be after Created Date";
    }

    if (!promotionData.description.trim()) {
      validationErrors.description = "Description is required";
    }

    return validationErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotionData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.id === "Active" ? "Active" : "Inactive";
    setPromotionData((prevState) => ({
      ...prevState,
      status: newStatus,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Object.values(validationErrors).forEach((error) =>
        toast.error(error, { duration: 6000, position: "bottom-right" }),
      );
      return;
    }

    try {
      await axios.put(
        `/api/promotion/update/${id}`,
        promotionData,
      );
      toast.success("Promotion updated successfully!");
      setTimeout(() => {
        navigate("/promotion-management");
      }, 1000);
    } catch (error) {
      toast.error("Promotion update failed!");
      console.error("Error updating promotion:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 flex items-center justify-between border-b border-zinc-800">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">
              Update Promotion
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Edit coupon or promotion details
            </p>
          </div>
        </div>
        <div className="mx-6 my-6 bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg shadow-black/20 p-8 max-w-4xl">
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-10"
          >
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Promotion ID
              </label>
              <input
                type="text"
                id="promotionID"
                name="promotionID"
                value={promotionData.promotionID}
                onChange={handleChange}
                className="input-field text-sm mb-4 opacity-60 cursor-not-allowed"
                readOnly
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Coupon Code
              </label>
              <input
                type="text"
                id="couponCode"
                name="couponCode"
                value={promotionData.couponCode}
                onChange={handleChange}
                className="input-field text-sm mb-4 opacity-60 cursor-not-allowed"
                readOnly
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Coupon Price
              </label>
              {errors.couponPrice && (
                <span className="text-red-400 text-xs mb-1">
                  {errors.couponPrice}
                </span>
              )}
              <input
                type="number"
                id="couponPrice"
                name="couponPrice"
                value={promotionData.couponPrice}
                onChange={handleChange}
                className={`input-field text-sm mb-4 ${errors.couponPrice ? "border-red-500 focus:ring-red-500" : ""}`}
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Total Amount
              </label>
              {errors.totalAmount && (
                <span className="text-red-400 text-xs mb-1">
                  {errors.totalAmount}
                </span>
              )}
              <input
                type="number"
                id="totalAmount"
                name="totalAmount"
                value={promotionData.totalAmount}
                onChange={handleChange}
                className={`input-field text-sm mb-4 ${errors.totalAmount ? "border-red-500 focus:ring-red-500" : ""}`}
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Description
              </label>
              {errors.description && (
                <span className="text-red-400 text-xs mb-1">
                  {errors.description}
                </span>
              )}
              <textarea
                id="description"
                name="description"
                value={promotionData.description}
                onChange={handleChange}
                className={`input-field text-sm mb-4 max-h-40 min-h-40 ${errors.description ? "border-red-500 focus:ring-red-500" : ""}`}
              />

              <button
                type="submit"
                className="btn-primary font-semibold w-full py-2.5 mt-2"
              >
                Update Promotion
              </button>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={promotionData.type}
                onChange={handleChange}
                className={`input-field text-sm mb-4 ${errors.type ? "border-red-500" : ""}`}
              >
                <option value="Seasonal">Seasonal</option>
                <option value="Special">Special</option>
              </select>

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Created Date
              </label>
              {errors.createdAt && (
                <span className="text-red-400 text-xs mb-1">
                  {errors.createdAt}
                </span>
              )}
              <input
                type="date"
                id="createdAt"
                name="createdAt"
                value={promotionData.createdAt}
                onChange={handleChange}
                className={`input-field text-sm mb-4 ${errors.createdAt ? "border-red-500 focus:ring-red-500" : ""}`}
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Expiry Date
              </label>
              {errors.expiredAt && (
                <span className="text-red-400 text-xs mb-1">
                  {errors.expiredAt}
                </span>
              )}
              <input
                type="date"
                id="expiredAt"
                name="expiredAt"
                value={promotionData.expiredAt}
                onChange={handleChange}
                className={`input-field text-sm mb-4 ${errors.expiredAt ? "border-red-500 focus:ring-red-500" : ""}`}
              />

              <label className="text-zinc-400 text-xs font-medium mb-1.5 block">
                Status
              </label>
              <div className="flex gap-6 flex-wrap mb-4">
                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    name="status"
                    id="Active"
                    checked={promotionData.status === "Active"}
                    onChange={handleStatusChange}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="text-zinc-300 text-sm">Active</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    name="status"
                    id="Inactive"
                    checked={promotionData.status === "Inactive"}
                    onChange={handleStatusChange}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="text-zinc-300 text-sm">Inactive</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
