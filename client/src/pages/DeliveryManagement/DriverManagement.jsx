import { useState, useEffect } from 'react';
import DriverTable from './DriverTable';
import { Link } from 'react-router-dom';
import { MdDownload } from 'react-icons/md';
import SideBar from '../../components/SideBar';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import toast from 'react-hot-toast';

export default function DriverManagement() {
  const [driverCount, setDriverCount] = useState(0);
  const [availableDriverCount, setAvailableDriverCount] = useState(0);
  const [unavailableDriverCount, setUnavailableDriverCount]= useState(0);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = () => {
    fetch('http://localhost:3000/api/driver/read')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.error('Failed to fetch drivers:', response.statusText);
          throw new Error('Failed to fetch drivers');
        }
      })
      .then(data => {
        const drivers = data.driver;
        setDriverCount(drivers.length);
  
        const availableDriverCount = drivers.filter(driver => driver.availabilty === 'Available' && driver.licenseValidity === 'Valid');
        const unavailableDriverCount = drivers.filter(driver => driver.availabilty === 'Unavailable'|| driver.licenseValidity === 'Expired');
  
        setAvailableDriverCount(availableDriverCount.length);
        setUnavailableDriverCount(unavailableDriverCount.length);
      })
      .catch(error => {
        console.error('Error fetching drivers:', error);
      });
  };


  return (
    <div className='flex'>
      <SideBar />
      <div className='flex-1 bg-gray-950 min-h-screen'>
        <div className='bg-gray-900 justify-between flex px-10 py-10'>
          <h1 className='text-4xl font-bold text-emerald-400'>Driver Management Dashboard</h1>
          <div className='flex gap-6'>

            <div className='flex gap-2 cursor-pointer'>
            <div className='w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xl'>A</div>
            <div className="flex w-full flex-col gap-0.5">
              <div className="flex items-center justify-between font-bold text-white">
                <h1>Admin</h1>
              </div>
              <p className='text-xs text-gray-400'>Delivery Manager</p>
            </div>
            </div>
          </div>
        </div>
        <div className='px-10 text-2xl font-semibold pt-5 text-white'>
          <span className=''>Driver Count({driverCount})</span>
        </div>
        <div className='flex items-center ml-10 justify-between mt-7'>
          <div className='flex gap-4'>
            <div className='bg-gray-800 border border-gray-700 text-white font-medium rounded-2xl w-fit px-14 p-8'>
              <p className='text-center text-lg'>Driver Count</p>
              <p className='text-center text-3xl font-bold'>{driverCount}</p>
            </div>
            <div className='bg-gray-800 border border-gray-700 text-white font-medium rounded-2xl w-fit px-14 p-8'>
              <p className='text-center text-lg'>Available Driver Count</p>
              <p className='text-center text-3xl font-bold'>{availableDriverCount}</p>
            </div>
            <div className='bg-gray-800 border border-gray-700 text-white font-medium rounded-2xl w-fit px-14 p-8'>
              <p className='text-center text-lg'>Unavailable Driver Count</p>
              <p className='text-center text-3xl font-bold'>{unavailableDriverCount}</p>
            </div>
          </div>
          <div className='flex flex-col gap-2 mr-10 text-sm text-center'>
            <div><Link to="/driver-create" className='bg-green-600 text-white hover:bg-green-700 font-semibold rounded-lg inline-block w-full p-3'>Add New Driver</Link></div>
            
          </div>
        </div>
        <DriverTable />
      </div>
    </div>
  )
}
