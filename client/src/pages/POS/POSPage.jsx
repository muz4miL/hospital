import { useState, useEffect, useRef, useCallback } from "react";
import SideBar from "../../components/SideBar";
import {
  FiSearch,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiPrinter,
  FiShoppingCart,
  FiX,
} from "react-icons/fi";
import { BsCashCoin, BsCreditCard2Back } from "react-icons/bs";
import { MdPhoneAndroid } from "react-icons/md";
import { HiOutlineReceiptPercent } from "react-icons/hi2";
import toast, { Toaster } from "react-hot-toast";

export default function POSPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("fixed");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const [showSearch, setShowSearch] = useState(true);
  const searchRef = useRef(null);
  const barcodeBufferRef = useRef("");
  const barcodeTimeoutRef = useRef(null);

  // Focus search on mount
  useEffect(() => {
    if (searchRef.current) searchRef.current.focus();
  }, []);

  // Barcode scanner listener (detects rapid keyboard input)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if typing in input fields (except search)
      const activeEl = document.activeElement;
      const isSearchInput = activeEl === searchRef.current;
      const isOtherInput =
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA") &&
        !isSearchInput;
      if (isOtherInput) return;

      // F-key shortcuts
      if (e.key === "F1") {
        e.preventDefault();
        handleNewSale();
        return;
      }
      if (e.key === "F2") {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (e.key === "F12") {
        e.preventDefault();
        handleCheckout();
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setSearchResults([]);
        setSearchTerm("");
        setShowReceipt(false);
        return;
      }

      // Barcode scanning detection
      if (e.key === "Enter" && barcodeBufferRef.current.length > 5) {
        e.preventDefault();
        searchByBarcode(barcodeBufferRef.current);
        barcodeBufferRef.current = "";
        return;
      }

      // Build barcode buffer for rapid input
      if (
        e.key.length === 1 &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.metaKey &&
        !isSearchInput
      ) {
        barcodeBufferRef.current += e.key;
        clearTimeout(barcodeTimeoutRef.current);
        barcodeTimeoutRef.current = setTimeout(() => {
          barcodeBufferRef.current = "";
        }, 150);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart]);

  // Search medicines as user types
  useEffect(() => {
    if (searchTerm.length < 1) {
      setSearchResults([]);
      setSelectedIndex(-1);
      return;
    }
    const debounce = setTimeout(() => {
      fetchSearch(searchTerm);
    }, 200);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const fetchSearch = async (q) => {
    try {
      const res = await fetch(`/api/pos/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.results);
        setSelectedIndex(data.results.length > 0 ? 0 : -1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const searchByBarcode = async (barcode) => {
    try {
      const res = await fetch(
        `/api/pos/search?q=${encodeURIComponent(barcode)}`,
      );
      const data = await res.json();
      if (data.success && data.results.length > 0) {
        addToCart(data.results[0]);
        toast.success(`${data.results[0].Mname} added!`, { duration: 1000 });
        // Play beep sound
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.value = 1200;
          osc.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.1);
        } catch (e) {}
      } else {
        toast.error("Barcode not found in inventory");
        setSearchTerm("");
        setSearchResults([]);
        searchRef.current?.focus();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = useCallback((medicine) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.medicineId === medicine._id);
      if (existing) {
        if (existing.quantity >= medicine.Mquantity) {
          toast.error(`Only ${medicine.Mquantity} in stock`);
          return prev;
        }
        return prev.map((item) =>
          item.medicineId === medicine._id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.unitPrice,
              }
            : item,
        );
      }
      return [
        ...prev,
        {
          medicineId: medicine._id,
          medicineName: medicine.Mname,
          unitPrice: medicine.Mprice,
          costPrice: medicine.McostPrice || 0,
          quantity: 1,
          total: medicine.Mprice,
          maxStock: medicine.Mquantity,
          unit: medicine.unit || "Strip",
        },
      ];
    });
    setSearchTerm("");
    setSearchResults([]);
    searchRef.current?.focus();
  }, []);

  const removeFromCart = (medicineId) => {
    setCart((prev) => prev.filter((item) => item.medicineId !== medicineId));
  };

  const updateQuantity = (medicineId, newQty) => {
    if (newQty < 1) return;
    setCart((prev) =>
      prev.map((item) => {
        if (item.medicineId !== medicineId) return item;
        if (newQty > item.maxStock) {
          toast.error(`Only ${item.maxStock} in stock`);
          return item;
        }
        return { ...item, quantity: newQty, total: newQty * item.unitPrice };
      }),
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discountAmount =
    discountType === "percentage" ? (subtotal * discount) / 100 : discount;
  const grandTotal = Math.max(0, subtotal - discountAmount);
  const change = amountPaid ? parseFloat(amountPaid) - grandTotal : 0;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    if (amountPaid && parseFloat(amountPaid) < grandTotal) {
      toast.error("Insufficient payment amount");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/pos/sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(({ medicineId, medicineName, quantity }) => ({
            medicineId,
            medicineName,
            quantity,
          })),
          discount,
          discountType,
          amountPaid: amountPaid ? parseFloat(amountPaid) : grandTotal,
          paymentMethod,
          customerName: customerName || "Walk-in Customer",
          customerPhone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Sale completed!");
        setLastSale(data.sale);
        setShowReceipt(true);
        // Play success sound
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.value = 800;
          osc.connect(ctx.destination);
          osc.start();
          setTimeout(() => {
            osc.frequency.value = 1200;
            setTimeout(() => osc.stop(), 150);
          }, 150);
        } catch (e) {}
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to process sale");
    }
    setLoading(false);
  };

  const handleNewSale = () => {
    setCart([]);
    setDiscount(0);
    setAmountPaid("");
    setCustomerName("");
    setCustomerPhone("");
    setShowReceipt(false);
    setLastSale(null);
    setSearchTerm("");
    searchRef.current?.focus();
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        // Dropdown is open and item highlighted — add that item
        addToCart(searchResults[selectedIndex]);
      } else if (searchTerm.trim().length > 0) {
        // No dropdown selection (e.g. barcode scanner fires Enter before debounce resolves)
        // — do an immediate barcode / name lookup
        searchByBarcode(searchTerm.trim());
      }
    }
  };

  const printReceipt = () => {
    if (!lastSale) return;
    const receiptWindow = window.open("", "_blank", "width=350,height=600");
    receiptWindow.document.write(`
      <html>
      <head>
        <title>Receipt - ${lastSale.invoiceNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; font-size: 12px; width: 280px; margin: 0 auto; padding: 10px; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .line { border-top: 1px dashed #000; margin: 5px 0; }
          .row { display: flex; justify-content: space-between; }
          .items { margin: 5px 0; }
          .item { margin: 3px 0; }
          h2 { font-size: 16px; margin: 5px 0; }
          p { margin: 2px 0; }
        </style>
      </head>
      <body>
        <div class="center">
          <h2 class="bold">PHARMACY</h2>
          <p>Hayatabad, Peshawar</p>
          <p>Phone: 0300-1234567</p>
        </div>
        <div class="line"></div>
        <div class="row"><span>Invoice:</span><span>${lastSale.invoiceNumber}</span></div>
        <div class="row"><span>Date:</span><span>${new Date(lastSale.createdAt).toLocaleDateString("en-PK")}</span></div>
        <div class="row"><span>Time:</span><span>${new Date(lastSale.createdAt).toLocaleTimeString("en-PK")}</span></div>
        <div class="row"><span>Customer:</span><span>${lastSale.customerName}</span></div>
        <div class="line"></div>
        <div class="items">
          ${lastSale.items
            .map(
              (item) => `
            <div class="item">
              <div>${item.medicineName}</div>
              <div class="row"><span>${item.quantity} x Rs.${item.unitPrice.toLocaleString()}</span><span>Rs.${item.total.toLocaleString()}</span></div>
            </div>
          `,
            )
            .join("")}
        </div>
        <div class="line"></div>
        <div class="row"><span>Subtotal:</span><span>Rs.${lastSale.subtotal.toLocaleString()}</span></div>
        ${lastSale.discount > 0 ? `<div class="row"><span>Discount:</span><span>-Rs.${lastSale.discount.toLocaleString()}</span></div>` : ""}
        <div class="row bold"><span>TOTAL:</span><span>Rs.${lastSale.grandTotal.toLocaleString()}</span></div>
        <div class="line"></div>
        <div class="row"><span>Paid:</span><span>Rs.${lastSale.amountPaid.toLocaleString()}</span></div>
        <div class="row"><span>Change:</span><span>Rs.${lastSale.change.toLocaleString()}</span></div>
        <div class="row"><span>Payment:</span><span>${lastSale.paymentMethod}</span></div>
        <div class="line"></div>
        <div class="center" style="margin-top:10px">
          <p class="bold">Thank you!</p>
          <p>Get well soon</p>
        </div>
      </body>
      </html>
    `);
    receiptWindow.document.close();
    setTimeout(() => {
      receiptWindow.print();
    }, 500);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Toaster position="top-right" />
      <SideBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Product Search & Cart */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          {/* Header with shortcuts */}
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <FiShoppingCart className="text-emerald-400" />
              Point of Sale
            </h1>
            <div className="flex gap-2 text-xs">
              <kbd className="px-2 py-1 bg-gray-700 text-gray-300 rounded border border-gray-600">
                F1
              </kbd>
              <span className="text-gray-400">New</span>
              <kbd className="px-2 py-1 bg-gray-700 text-gray-300 rounded border border-gray-600">
                F2
              </kbd>
              <span className="text-gray-400">Search</span>
              <kbd className="px-2 py-1 bg-gray-700 text-gray-300 rounded border border-gray-600">
                F12
              </kbd>
              <span className="text-gray-400">Checkout</span>
              <kbd className="px-2 py-1 bg-gray-700 text-gray-300 rounded border border-gray-600">
                Esc
              </kbd>
              <span className="text-gray-400">Clear</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative mb-3">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              ref={searchRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Type medicine name or scan barcode..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-lg placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSearchResults([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <FiX />
              </button>
            )}

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                {searchResults.map((medicine, i) => (
                  <div
                    key={medicine._id}
                    onClick={() => addToCart(medicine)}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                      i === selectedIndex
                        ? "bg-emerald-600"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <div>
                      <p
                        className={`font-medium ${i === selectedIndex ? "text-white" : "text-gray-200"}`}
                      >
                        {medicine.Mname}
                      </p>
                      <p className="text-xs text-gray-400">
                        {medicine.type} • {medicine.Msupplier} • Stock:{" "}
                        {medicine.Mquantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${i === selectedIndex ? "text-white" : "text-emerald-400"}`}
                      >
                        Rs. {medicine.Mprice.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {medicine.unit || "Strip"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Table */}
          <div className="flex-1 overflow-y-auto bg-gray-800 rounded-lg border border-gray-700">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FiShoppingCart size={48} className="mb-3 opacity-30" />
                <p className="text-lg">Cart is empty</p>
                <p className="text-sm mt-1">
                  Type medicine name or scan barcode to add
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-750 sticky top-0">
                  <tr className="text-gray-400 text-sm border-b border-gray-700">
                    <th className="text-left px-4 py-2 bg-gray-800">#</th>
                    <th className="text-left px-4 py-2 bg-gray-800">
                      Medicine
                    </th>
                    <th className="text-center px-4 py-2 bg-gray-800">Price</th>
                    <th className="text-center px-4 py-2 bg-gray-800">Qty</th>
                    <th className="text-right px-4 py-2 bg-gray-800">Total</th>
                    <th className="text-center px-4 py-2 bg-gray-800"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, i) => (
                    <tr
                      key={item.medicineId}
                      className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white font-medium">
                          {item.medicineName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Stock: {item.maxStock} {item.unit}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        Rs. {item.unitPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.medicineId, item.quantity - 1)
                            }
                            className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
                          >
                            <FiMinus size={14} />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.medicineId,
                                parseInt(e.target.value) || 1,
                              )
                            }
                            className="w-12 text-center bg-gray-700 border border-gray-600 rounded text-white py-1 text-sm"
                            min="1"
                            max={item.maxStock}
                          />
                          <button
                            onClick={() =>
                              updateQuantity(item.medicineId, item.quantity + 1)
                            }
                            className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-400 font-bold">
                        Rs. {item.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => removeFromCart(item.medicineId)}
                          className="p-1.5 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: Checkout Panel */}
        <div className="w-80 bg-gray-800 p-4 flex flex-col border-l border-gray-700 overflow-y-auto">
          {!showReceipt ? (
            <>
              {/* Customer Info */}
              <div className="mb-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Customer (Optional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Walk-in Customer"
                  className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Phone (optional)"
                  className="w-full mt-2 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { value: "Cash", icon: <BsCashCoin />, label: "Cash" },
                    {
                      value: "Card",
                      icon: <BsCreditCard2Back />,
                      label: "Card",
                    },
                    {
                      value: "Mobile",
                      icon: <MdPhoneAndroid />,
                      label: "JazzCash",
                    },
                    {
                      value: "Credit",
                      icon: <HiOutlineReceiptPercent />,
                      label: "Udhar",
                    },
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() => setPaymentMethod(method.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                        paymentMethod === method.value
                          ? "bg-emerald-600 border-emerald-500 text-white"
                          : "bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {method.icon} {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discount */}
              <div className="mb-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Discount
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="number"
                    value={discount || ""}
                    onChange={(e) =>
                      setDiscount(parseFloat(e.target.value) || 0)
                    }
                    placeholder="0"
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-emerald-500"
                    min="0"
                  />
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="fixed">Rs.</option>
                    <option value="percentage">%</option>
                  </select>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-4 pt-3 border-t border-gray-700">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Items: {cart.length}</span>
                  <span>Qty: {cart.reduce((s, i) => s + i.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-orange-400">
                    <span>Discount</span>
                    <span>-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-gray-600">
                  <span>TOTAL</span>
                  <span className="text-emerald-400">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Amount Paid */}
              <div className="mb-4">
                <label className="text-xs text-gray-400 uppercase tracking-wider">
                  Amount Paid
                </label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  placeholder={grandTotal.toLocaleString()}
                  className="w-full mt-1 px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-lg font-bold focus:outline-none focus:border-emerald-500"
                  min="0"
                />
                {amountPaid && change >= 0 && (
                  <div className="flex justify-between mt-2 text-lg font-bold text-yellow-400">
                    <span>Change</span>
                    <span>Rs. {change.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-1 mb-4">
                {[50, 100, 500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmountPaid(String(amt))}
                    className="px-2 py-1.5 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded text-gray-300 text-xs transition-colors"
                  >
                    Rs.{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-auto space-y-2">
                <button
                  onClick={handleCheckout}
                  disabled={loading || cart.length === 0}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 disabled:text-gray-400 text-white font-bold rounded-lg text-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <FiPrinter /> CHECKOUT (F12)
                    </>
                  )}
                </button>
                <button
                  onClick={handleNewSale}
                  className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
                >
                  New Sale (F1)
                </button>
              </div>
            </>
          ) : (
            /* Receipt View */
            <div className="flex flex-col h-full">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-3 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Sale Complete!</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {lastSale?.invoiceNumber}
                </p>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 mb-4 space-y-2">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Items</span>
                  <span>{lastSale?.items.length}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span>Rs. {lastSale?.subtotal.toLocaleString()}</span>
                </div>
                {lastSale?.discount > 0 && (
                  <div className="flex justify-between text-orange-400 text-sm">
                    <span>Discount</span>
                    <span>-Rs. {lastSale?.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-700">
                  <span>Total</span>
                  <span className="text-emerald-400">
                    Rs. {lastSale?.grandTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Paid ({lastSale?.paymentMethod})</span>
                  <span>Rs. {lastSale?.amountPaid.toLocaleString()}</span>
                </div>
                {lastSale?.change > 0 && (
                  <div className="flex justify-between text-yellow-400 font-bold">
                    <span>Change</span>
                    <span>Rs. {lastSale?.change.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="mt-auto space-y-2">
                <button
                  onClick={printReceipt}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <FiPrinter /> Print Receipt
                </button>
                <button
                  onClick={handleNewSale}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors"
                >
                  New Sale (F1)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
