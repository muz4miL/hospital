import { useState, useEffect, React } from 'react';
import SupplierTable from './SupplierTable';
import { Link } from 'react-router-dom';
import { MdDownload } from 'react-icons/md';
import NotificationBell from '../../components/NotificationBell';
import SideBar from '../../components/SideBar';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function SupplyManagement() {
  const [suppliersCount, setSuppliersCount] = useState(0);
  const [activeSuppliersCount, setActiveSuppliersCount] = useState(0);
  const [inactiveSuppliersCount, setInactiveSuppliersCount] = useState(0);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = () => {
    fetch('http://localhost:3000/api/supplier/read')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.error('Failed to fetch suppliers:', response.statusText);
          throw new Error('Failed to fetch suppliers');
        }
      })
      .then(data => {
        const suppliers = data.supplier;
        setSuppliersCount(suppliers.length);
  
        const activeSuppliers = suppliers.filter(supplier => supplier.status === 'Active');
        const inactiveSuppliers = suppliers.filter(supplier => supplier.status === 'Inactive');
  
        setActiveSuppliersCount(activeSuppliers.length);
        setInactiveSuppliersCount(inactiveSuppliers.length);
      })
      .catch(error => {
        console.error('Error fetching suppliers:', error);
      });
  };

  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return formattedDate;
};

  const generateReport = () => {
    fetch('http://localhost:3000/api/supplier/read')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.error('Failed to generate report:', response.statusText);
          throw new Error('Failed to generate report');
        }
      })
      .then(data => {
        const suppliers = data.supplier;

        const doc = new jsPDF();

        const tableHeader = [['Supplier ID', 'Supplier Name', 'Last Name', 'NIC', 'Address', 'Contact No', 'Email']];

        const tableData = suppliers.map(supplier => [
          supplier.supplierID,
          supplier.firstName,
          supplier.lastName,
          supplier.NIC,
          supplier.address,
          supplier.contactNo,
          supplier.email
        ]);

        doc.autoTable({
          head: tableHeader,
          body: tableData,
        });

        doc.save('Supplier Management Report.pdf');
      })
      .catch(error => {
        console.error('Error generating report:', error);
      });
  };
  

  return (
    <div className='flex'>
      <SideBar />
      <div className='flex-1 bg-gray-950 min-h-screen'>
        <div className='bg-gray-900 justify-between flex px-10 py-10'>
          <h1 className='text-4xl font-bold text-emerald-400'>Supplier Management Dashboard</h1>
          <div className='flex gap-6'>
          <NotificationBell />
            <button onClick={generateReport} className="bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-600 font-semibold transition-all py-2 px-4 rounded-lg inline-flex items-center">
              <MdDownload className='text-2xl mr-2' />
              <span>Download Report</span>
            </button>
            <div className='flex gap-2 cursor-pointer'>
            <div className='w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xl font-bold'>A</div>
            <div className="flex w-full flex-col gap-0.5">
              <div className="flex items-center justify-between font-bold">
                <h1 className='text-white'>Admin</h1>
              </div>
              <p className='text-xs text-gray-400'>Supplier Manager</p>
            </div>
            </div>
          </div>
        </div>
        <div className='flex items-center ml-10 justify-between mt-7'>

          <div className='flex gap-3'>
          <div className='flex  gap-2 mr-10 text-sm text-center'>
            <div className='text-2xl font-semibold pt-1 p-3 w-fit text-white'>Suppliers({suppliersCount})</div>
            <div><Link to="/create-supplier" className='bg-green-600 text-white hover:bg-green-700 font-semibold rounded-lg inline-block w-full p-3'>Create New Supplier</Link></div>
            <div><Link to="/orders" className='bg-emerald-600 text-white hover:bg-emerald-500 transition-all font-semibold rounded-lg inline-block w-full p-3'>View Orders</Link></div>
          </div>
        </div>
        </div>
        <SupplierTable />
      </div>
    </div>
  )
}
