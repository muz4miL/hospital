import React from "react";
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";

export default function OrderHistory() {
  return (
    <div className="bg-zinc-950 min-h-screen">
      <NavigationBar />
      <h1 className="text-2xl text-center font-semibold my-7 text-zinc-100">
        My Orders
      </h1>
      <div className="px-10 flex-1">
        <table className="w-full mb-7">
          <thead>
            <tr className="bg-zinc-900/50">
              <th className="table-th">Order ID</th>
              <th className="table-th">Date Ordered</th>
              <th className="table-th">Payment Status</th>
              <th className="table-th">Transaction ID</th>
              <th className="table-th">Order Status</th>
            </tr>
          </thead>
        </table>
      </div>
      <Footer />
    </div>
  );
}
