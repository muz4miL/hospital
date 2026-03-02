import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import SideBar from '../../components/SideBar';

export default function DriverCreateForm() {

  const navigate = useNavigate();
    const [value, setValue] = useState({
        driverId:'',
        driverName: '',
        driverLicense: '',
        vehicleModel: 'Bike',
        availabilty: 'Available',
        contactNo: '',
        vehicleLicense: '',
        licenseValidity: 'Valid',
        password:''
        
    });

    const [errors, setErrors] = useState({
        driverId:'',
        driverLicense: '',
        contactNo: '',
        password: ''
      });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let error = '';

    if (name === 'contactNo' && value.charAt(0) === '0') {
      error = 'Enter the contact number without initial zero';
    } else if (name === 'driverLicense' && value.length !== 8) {
      error = 'Driver license should be 8 digits long';
    }else if (name === 'driverId' && !/^D\d{3}$/.test(value)) {
      error = 'Driver ID should be in the format D000';
    } else if (name === 'password' && !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value)) {
      error = 'Password should contain at least one digit, one lowercase letter, one uppercase letter, and be at least 8 characters long';
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));

    setValue(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? (checked ? 'Valid' : 'Expired') : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const fieldErrors = Object.entries(errors).filter(([, error]) => error !== '');
    const allErrors = [];
  
    if (fieldErrors.length > 0) {
      fieldErrors.forEach(([, error]) => {
        allErrors.push(error);
      });
  
      allErrors.forEach(error => {
        toast.error(error);
      });
  
      return;
    }
  
    try {
      const existingDriverId = await axios.get(`http://localhost:3000/api/driver/check?driverId=${value.driverId}`);
      if (existingDriverId.data.exists) {
        allErrors.push('Driver ID already exists');
      }
      const existingDriverLicense = await axios.get(`http://localhost:3000/api/driver/check?driverLicense=${value.driverLicense}`);
      if (existingDriverLicense.data.exists) {
        allErrors.push('Driver license already exists');
      }
      const existingVehicleLicense = await axios.get(`http://localhost:3000/api/driver/check?vehicleLicense=${value.vehicleLicense}`);
      if (existingVehicleLicense.data.exists) {
        allErrors.push('Vehicle license already exists');
      }
      const existingPassword = await axios.get(`http://localhost:3000/api/driver/check?password=${value.password}`);
      if (existingPassword.data.exists) {
        allErrors.push('Password already exists');
      }
  
      if (allErrors.length > 0) {
        allErrors.forEach(error => {
          toast.error(error);
        });
        return;
      }
  
      const addDriver = await axios.post('http://localhost:3000/api/driver/create', value);
      const response = addDriver.data;
      if (response.success) {
        toast.success(response.message, { duration: 2000 });
        setTimeout(() => {
          navigate('/driver-management');
        }, 2000);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    console.log(value);
  };
  return (
    <main>
      <div className='flex'>
      <SideBar />
      <div className='flex-1 bg-gray-950 min-h-screen'>
                <div className='bg-gray-900 justify-between flex px-10 py-8'>
                    <h1 className='text-4xl font-bold text-emerald-400'>Add New Driver</h1>
                    <div className='flex gap-2'>
                        <div className='w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xl'>A</div>
                        <div className="flex w-full flex-col gap-0.5">
                            <div className="flex items-center justify-between font-bold text-white">
                                <h1>Admin</h1>
                            </div>
                            <p className='text-xs text-gray-400'>Delivery Manager</p>
                        </div>
                    </div>
                </div>
                <div className='p-10 bg-gray-800 m-10 rounded-3xl max-w-4xl border-2 border-gray-700'>
                <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-10'>
                <div className='flex flex-col gap-1 flex-1'>
                            <label className='font-semibold text-gray-300'>Driver ID</label>
                            <input type="text" placeholder='Enter driver ID' id="driverId" name="driverId" value={value.driverId} onChange={handleChange} className='border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md p-2 mb-4' required/>   

                            <label className='font-semibold text-gray-300'>Full Name</label>
                            <input type="text" placeholder='Enter driver name' id="driverName" name="driverName" value={value.driverName} onChange={handleChange} className='border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md p-2 mb-4' maxLength='100' minLength='10' required/>

                            <label className='font-semibold text-gray-300'>Driver License</label>
                            <input type="text" placeholder='Enter driver license card number' id="driverLicense"  name="driverLicense" value={value.driverLicense} onChange={handleChange} className='border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md p-2 mb-4' required/>

                            <div className= 'flex gap-10'>
                            <div class="flex flex-col justify-between"> 
                            <label className='font-semibold text-gray-300'>Vehicle Model</label>
                            <select id="vehicleModel" name="vehicleModel" value={value.vehicleModel} onChange={handleChange} className='border-2 border-gray-700 bg-gray-800 text-white outline-none rounded-md p-2 mb-4' required>
                                <option value="Bike">Bike</option>
                                <option value="Threewheel">Threewheel</option>
                                <option value="Car">Car</option>
                                <option value="Van">Van</option>
                            </select>
                            </div>

                            <div class="flex flex-col justify-between">
                            <label className='font-semibold text-gray-300'>Availability</label>
                            <select id="availabilty" name="availabilty" value={value.availabilty} onChange={handleChange}className='border-2 border-gray-700 bg-gray-800 text-white outline-none rounded-md p-2 mb-4' required>
                                <option value="Available">Available</option>
                                <option value="Unavailable">Unavailable</option>
                            </select>
                            </div>
                            </div>

                            <label className='font-semibold text-gray-300'>License Validity</label> 
                            <div className='flex gap-6 flex-wrap'>
                                <div className='flex gap-2'>
                                    <input onChange={handleChange} checked={value.licenseValidity === 'Valid'} type="checkbox" name='licenseValidity' id="Valid" className='w-5'/>
                                    <span className='text-gray-300'>Valid</span>
                                </div>
                                <div className='flex gap-2'>
                                    <input onChange={handleChange} checked={value.licenseValidity === 'Expired'} type="checkbox" name='licenseValidity' id="Expired" className='w-5'/>
                                    <span className='text-gray-300'>Expired</span>
                                </div>
                              </div>
                              <p className="text-red-500 text-xs">If either driver license or vehicle license expired choose the validity as expired</p>

                           
                        </div>

                          <div className='flex flex-col gap-1 flex-1'>
                            <label className='font-semibold text-gray-300'>Contact Number</label>
                            <input type="text" placeholder='Enter the number without the initial zero' id="contactNo" name="contactNo" pattern='[0-9]{9}' value={value.contactNo} onChange={handleChange}className='border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md p-2 mb-4' maxLength='9' minLength='9' required/>

                            <label className='font-semibold text-gray-300'>Vehicle License</label>
                            <input type="text" placeholder='Enter vehicle license number' id="vehicleLicense" name="vehicleLicense" value={value.vehicleLicense} onChange={handleChange}className='border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md p-2 mb-4' required/>

                            <label className='font-semibold text-gray-300'>Password</label>
                            <input type="password" placeholder='Enter the login password' id="password" name="password" value={value.password} onChange={handleChange} className='border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md p-2 mb-4' required />
                            {errors.password && <p className="text-red-500">{errors.password}</p>}

                            <input type="submit" value="Submit" className='bg-emerald-600 hover:bg-emerald-500 font-semibold text-white p-3 rounded-lg w-full mt-3 cursor-pointer'/>
                          </div>
                </form>
              </div>
            </div>
        </div>
    </main>
    
  )
}
