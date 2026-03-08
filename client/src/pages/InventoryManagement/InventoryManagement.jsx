import { useState, useEffect } from "react";
import InventoryTable from "./InventoryTable";
import { Link } from "react-router-dom";
import { MdDownload, MdAdd as MdPlus } from "react-icons/md";
import SideBar from "../../components/SideBar";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function Inventorymanager() {
  const [inventorycount, setInventoryCount] = useState(0);
  const [expiredinventoryCount, setExpiredInventoryCount] = useState(0);
  const [tabletcount, setTabletInventoryCount] = useState(0);
  const [capsulecount, setCapsuleInventoryCount] = useState(0);
  const [liquidcount, setLiquidInventoryCount] = useState(0);
  const [othercount, setOtherInventoryCount] = useState(0);
  const [pendinginventoryCount, setpendinginventoryCount] = useState(0);
  pendinginventoryCount;

  const [fullPrice, setfullPrice] = useState(0);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    fetch("http://localhost:3000/api/inventory/read")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Failed to fetch Inventory:", response.statusText);
          throw new Error("Failed to fetch Inventory");
        }
      })
      .then((data) => {
        const inventory = data.inventory;
        setInventoryCount(inventory.length);

        //Implement function to get all value  //Total price is and callback function(A function that is passed as a argument to a another function)
        const totalPrice = inventory.reduce((acc, item) => {
          return acc + item.Mprice * item.Mquantity;
        }, 0);

        const roundValue = Number(totalPrice).toFixed(2);
        setfullPrice(roundValue);

        const expiredInventory = inventory.filter(
          (inventory) => inventory.status === "Expired",
        );
        setExpiredInventoryCount(expiredInventory.length);
        const pendinginventoryCount = inventory.filter(
          (inventory) => inventory.status === "Pending to expire",
        );
        setpendinginventoryCount(pendinginventoryCount.length);

        const numoftablets = inventory.filter(
          (inventory) => inventory.type === "Tablet",
        );
        setTabletInventoryCount(numoftablets.length);
        const numofcapsules = inventory.filter(
          (inventory) => inventory.type === "Capsule",
        );
        setCapsuleInventoryCount(numofcapsules.length);
        const numofliquid = inventory.filter(
          (inventory) => inventory.type === "Liquid",
        );
        setLiquidInventoryCount(numofliquid.length);
        const numofother = inventory.filter(
          (inventory) => inventory.type === "Other",
        );
        setOtherInventoryCount(numofother.length);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  };

  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return formattedDate;
  };

  const generateReport = () => {
    let yPos = 150; // Define yPos here
    let xPos = 500; // Define xPos here

    fetch("http://localhost:3000/api/inventory/read")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error("Failed to generate report:", response.statusText);
          throw new Error("Failed to generate report");
        }
      })
      .then((data) => {
        const items = data.inventory;
        const numoftablets = items.filter(
          (inventory) => inventory.type === "Tablet",
        );
        setTabletInventoryCount(numoftablets.length);
        const numofcapsules = items.filter(
          (inventory) => inventory.type === "Capsule",
        );
        setCapsuleInventoryCount(numofcapsules.length);
        const numofliquid = items.filter(
          (inventory) => inventory.type === "Liquid",
        );
        setLiquidInventoryCount(numofliquid.length);
        const numofother = items.filter(
          (inventory) => inventory.type === "Other",
        );
        setOtherInventoryCount(numofother.length);

        const doc = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "letter",
        });

        const inventorySize = data.inventory.length.toString();

        const totalPrice = items.reduce((acc, item) => {
          return acc + item.Mprice * item.Mquantity;
        }, 0);

        const totalPrice1 = totalPrice.toFixed(2);

        const margin = 40;

        doc.setLineWidth(1);
        doc.setDrawColor(0, 90, 139);
        doc.line(30, 30, 580, 30); // Top line
        doc.line(30, 100, 580, 100); // second Top line
        doc.line(580, 780, 580, 30); // Right line
        doc.line(30, 680, 580, 680); // Bottom up line
        doc.line(30, 780, 580, 780); // Bottom line
        doc.line(30, 780, 30, 30); //leftlines

        // Title
        doc.setFontSize(30);
        doc.text("Inventory Report", margin, 80);
        doc.setFontSize(15);

        doc.setTextColor(0, 0, 255);
        doc.text("Total Value(Rs.):", 375, 80);
        doc.setTextColor(0, 100, 0);
        doc.text(totalPrice1, 490, 80);

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 255);
        doc.text(`Inventory Items(${inventorySize})`, margin, 130);
        doc.setTextColor(0, 0, 0);

        // Inventory items section as a table
        const tableColumns = [
          "Name",
          "UnitPrice(Rs)",
          "Quantity",
          "Supplier",
          "Status",
        ];
        const tableData = items.map((item) => [
          item.Mname,
          item.Mprice,
          item.Mquantity,
          item.Msupplier,
          item.status,
        ]);

        doc.autoTable({
          startY: yPos,
          head: [tableColumns],
          body: tableData,
          theme: "grid",
          margin: { top: 10 },
          styles: { textColor: [0, 0, 0], fontStyle: "bold", FontSize: "12" },
          columnStyles: {
            0: { fontStyle: "normal" },
            1: { fontStyle: "normal" },
            2: { fontStyle: "normal" },
            3: { fontStyle: "normal" },
            4: { fontStyle: "normal" },
          },
        });

        // Counts section
        yPos += 300;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 255);
        doc.text("Counts", margin, yPos);
        doc.setTextColor(255, 0, 0);
        doc.setFontSize(12);
        yPos += 20;
        doc.text(`- Expired Items: ${expiredinventoryCount}`, margin, yPos);
        doc.setTextColor(0, 128, 0);
        yPos += 20;
        doc.text(
          `- Active Items: ${inventorySize - expiredinventoryCount}`,
          margin,
          yPos,
        );
        yPos += 20;
        doc.setTextColor(255, 150, 0);
        doc.text(
          `- Pending expire Items: ${pendinginventoryCount}`,
          margin,
          yPos,
        );

        // Types section
        yPos += 40;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 255);
        doc.text("Types", margin, yPos);
        doc.setTextColor(0);
        doc.setFontSize(12);
        yPos += 20;
        doc.text(`- Tablets: ${tabletcount}`, margin, yPos);
        yPos += 20;
        doc.text(`- Capsules: ${capsulecount}`, margin, yPos);
        yPos += 20;
        doc.text(`- Liquid: ${liquidcount}`, margin, yPos);
        yPos += 20;
        doc.text(`- Other: ${othercount}`, margin, yPos);

        yPos += 120;
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 255);
        doc.text("PharmaCare POS", margin, yPos);
        doc.setTextColor(0);

        yPos += 20;
        doc.setTextColor(100, 150, 255);
        doc.setFontSize(10);
        doc.text(`The live status of the inventory on `, margin, yPos);
        doc.setTextColor(0, 255, 0);
        doc.setFontSize(13);
        doc.text(` ${formatDate(new Date())}`, 190, yPos + 1);

        // Add the image to the PDF
        doc.addImage("./logo.png", "PNG", 430, 708, 110, 40); //x y w h
        doc.setTextColor(0, 100, 0);

        doc.save("InventoryReport.pdf");
      })
      .catch((error) => {
        console.error("Error generating report:", error);
      });
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <SideBar />
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">
              Inventory Management
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Manage your medicine stock
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={generateReport}
              className="btn-secondary text-sm inline-flex items-center"
            >
              <MdDownload className="text-lg mr-2" />
              <span>Download Report</span>
            </button>
            <Link to="/create-inventory">
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg inline-flex items-center py-2 px-4 transition text-sm">
                <MdPlus className="text-lg mr-1" />
                <span>Add Medicine</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 px-6 mb-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg shadow-black/20">
            <p className="text-zinc-500 text-xs uppercase tracking-wide">
              Total Items
            </p>
            <p className="text-2xl font-bold text-zinc-100 mt-1">
              {inventorycount}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg shadow-black/20">
            <p className="text-zinc-500 text-xs uppercase tracking-wide">
              Total Value
            </p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              Rs. {Number(fullPrice).toLocaleString()}
            </p>
          </div>
          <div className="bg-zinc-900 border border-red-900/40 rounded-xl p-4 shadow-lg shadow-black/20">
            <p className="text-red-400 text-xs uppercase tracking-wide font-medium">
              Expired
            </p>
            <p className="text-2xl font-bold text-red-400 mt-1">
              {expiredinventoryCount}
            </p>
          </div>
          <div className="bg-zinc-900 border border-orange-900/40 rounded-xl p-4 shadow-lg shadow-black/20">
            <p className="text-orange-400 text-xs uppercase tracking-wide font-medium">
              Pending Expiry
            </p>
            <p className="text-2xl font-bold text-orange-400 mt-1">
              {pendinginventoryCount}
            </p>
          </div>
        </div>

        <div className="px-6 pb-6">
          <InventoryTable />
        </div>
      </div>
    </div>
  );
}
