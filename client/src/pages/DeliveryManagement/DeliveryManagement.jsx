import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SideBar from '../../components/SideBar';


export default function DeliveryManagement() {
  const [taskCount, setTaskCount] = useState(0);
  const [deliveredTaskCount, setDeliveredTaskCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [availableDriverCount, setAvailableDriverCount] = useState(0);
 

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch('http://localhost:3000/api/task/read')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.error('Failed to fetch tasks:', response.statusText);
          throw new Error('Failed to fetch tasks');
        }
      })
      .then(data => {
        const tasks = data.task;
        setTaskCount(tasks.length);
  
        const deliveredTaskCount = tasks.filter(task => task.deliStatus=== 'Delivered');
        setDeliveredTaskCount(deliveredTaskCount.length);
      })
      .catch(error => {
        console.error('Error fetching drivers:', error);
      });
  };

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
        setAvailableDriverCount(availableDriverCount.length);
       
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
          <h1 className='text-4xl font-bold text-emerald-400'>Delivery Management Dashboard</h1>
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
            <div className='flex items-center ml-10 justify-between mt-7'>
            <div className='flex gap-4'>
            <div className='bg-gray-800 border border-gray-700 text-white font-medium rounded-2xl w-fit px-10 p-8'>
              <p className='text-center text-lg'>Task Count</p>
              <p className='text-center text-3xl font-bold'>{taskCount}</p>
            </div>
            <div className='bg-gray-800 border border-gray-700 text-white font-medium rounded-2xl w-fit px-10 p-8'>
              <p className='text-center text-lg'>Delivery Tasks Completed</p>
              <p className='text-center text-3xl font-bold'>{deliveredTaskCount}</p>
            </div>
            <div className='bg-gray-800 border border-gray-700 text-white font-medium rounded-2xl w-fit px-14 p-8'>
              <p className='text-center text-lg'>Driver Count</p>
              <p className='text-center text-3xl font-bold'>{driverCount}</p>
            </div>
            <div className='bg-gray-800 border border-gray-700 text-white font-medium rounded-2xl w-fit px-14 p-8'>
              <p className='text-center text-lg'>Available Driver Count</p>
              <p className='text-center text-3xl font-bold'>{availableDriverCount}</p>
            </div>
          </div>
    </div>
    <div className='flex-01 flex'>
    

    <div className='w-2xl flex justify-center items-center'>
        <div className="flex flex-col gap-4 ml-10  mt-10 w-80">
            <Link to="/create-task" className="bg-emerald-600 text-white px-1 py-3 rounded-lg text-center hover:bg-emerald-500 transition-all">
                Create Task
            </Link>
            <Link to="/driver-create" className="bg-emerald-600 text-white px-1 py-3 rounded-lg text-center hover:bg-emerald-500 transition-all">
                Add Driver
            </Link>
            <Link to="/taskpage" className="bg-emerald-600 text-white px-1 py-3 rounded-lg text-center hover:bg-emerald-500 transition-all">
                Manage Tasks
            </Link>
            <Link to="/driver-management" className="bg-emerald-600 text-white px-1 py-3 rounded-lg text-center hover:bg-emerald-500 transition-all">
                Manage Drivers
            </Link>
        </div>
    </div>
</div>
    </div>
    </div>

  )}