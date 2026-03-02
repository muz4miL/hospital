import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import SideBar from '../../components/SideBar';


export default function DriverUpdateForm() {
    
    const { id } = useParams();
    const navigate = useNavigate();

    const [driverData, setDriverData] = useState({
        driverId:'',
        driverName: '',
        driverLicense: '',
        vehicleModel: '',
        availabilty: '',
        contactNo: '',
        vehicleLicense: '',
        licenseValidity: '',
        password:''
        
    });

    useEffect(() => {
      getdriverByID();
  }, [id]);

  const getdriverByID = async () =>{

    try{
      const result = await axios.get(`http://localhost:3000/api/driver/get/${id}`)
      const driver = result.data.driver;
        setDriverData(driver);

        console.log(driver);
     
    }catch(error) {
      console.log(error);
    }

  }
  
  const [errors, setErrors] = useState({
    driverId:'',
    driverLicense: '',
    contactNo: '',
    password:''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    let error = '';

    if (name === 'contactNo' && value.charAt(0) === '0') {
        error = 'Enter the contact number without initial zero';
      } else if (name === 'driverLicense' && value.length !== 8) {
        error = 'Driver license should be 8 digits long';
      }else if (name === 'password' && !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value)) {
        error = 'Password should contain at least one digit, one lowercase letter, one uppercase letter, and be at least 8 characters long';
      }
  

    setErrors(prevErrors => ({
        ...prevErrors,
        [name]: error
    })); 

    setDriverData(prevState => ({
        ...prevState,
        [name]: value
    }));
    
};

  const handleValidityChange = (e) => {
    const { id } = e.target;
    const newValidity = id === 'Valid' ? 'Valid' : 'Expired';
    setDriverData(prevState => ({
        ...prevState,
        licenseValidity: newValidity
    }));
};


const handleSubmit = (e) => {
  e.preventDefault();

  const fieldErrors = Object.entries(errors).filter(([, error]) => error !== '');

    if (fieldErrors.length > 0) {

    fieldErrors.forEach(([, error]) => {
      toast.error(error);
    });
    return;
   
}

  axios.put(`http://localhost:3000/api/driver/update/${id}`, driverData)
  .then(() => {
      toast.success('Driver updated successfully!');
      setTimeout(() => {
          navigate('/driver-management');
      },2000);
  })
  .catch(error => {
      toast.error('Driver update failed!');
      console.error('Error updating driver:', error);
  });
};

  return (
    <main>
      <div className='flex'>
      <SideBar />
      <div className='flex-1 bg-gray-950 min-h-screen'>
                <div className='bg-gray-900 justify-between flex px-10 py-8'>
                    <h1 className='text-4xl font-bold text-emerald-400'>Update Driver</h1>
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
                            <label   label className='font-semibold text-gray-300'>Driver ID</label>
                            <input type="text" placeholder='Enter driver ID' id="driverId" name="driverId" value={driverData.driverId} onChange={handleChange} className='border-2 border-gray-700 bg-gray-700 text-gray-400 placeholder-gray-500 outline-none rounded-md p-2 mb-4' readOnly/>                       

                            <label className='font-semibold text-gray-300'>Full Name</label>
                            <input type="text" placeholder='Enter driver name' id="driverName" name="driverName" value={driverData.driverName} onChange={handleChange} className='border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md p-2 mb-4' maxLength='100' minLength='10' required/>

                            <label className='font-semibold text-gray-300'>Driver License</label>
                            <input type="text" placeholder='Enter driver license card number' id="driverLicense"  name="driverLicense" value={driverData.driverLicense} onChange={handleChange} className='border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md p-2 mb-4' required/>

                            <div className= 'flex gap-10'>
                            <div class="flex flex-col justify-between"> 
                            <label className='font-semibold text-gray-300'>Vehicle Model</label>
                            <select id="vehicleModel" name="vehicleModel" value={driverData.vehicleModel} onChange={handleChange} className='border-2 border-gray-700 bg-gray-800 text-white outline-none rounded-md p-2 mb-4' required>
                                <option value="Bike">Bike</option>
                                <option value="Threewheel">Threewheel</option>
                                <option value="Car">Car</option>
                                <option value="Van">Van</option>
                            </select>
                            </div>

                            <div class="flex flex-col justify-between">
                            <label className='font-semibold text-gray-300'>Availability</label>
                            <select id="availabilty" name="availabilty" value={driverData.availabilty} onChange={handleChange}className='border-2 border-gray-700 bg-gray-800 text-white outline-none rounded-md p-2 mb-4' required>
                                <option value="Available">Available</option>
                                <option value="Unavailable">Unavailable</option>
                            </select>
                            </div>
                            </div>

                            <label className='font-semibold text-gray-300'>License Validity</label> 
                            <div className='flex gap-6 flex-wrap'>
                                <div className='flex gap-2'>
                                    <input onChange={handleValidityChange} checked={driverData.licenseValidity === 'Valid'} type="checkbox" name='licenseValidity' id="Valid" className='w-5'/>
                                    <span className='text-gray-300'>Valid</span>
                                </div>
                                <div className='flex gap-2'>
                                    <input onChange={handleValidityChange} checked={driverData.licenseValidity === 'Expired'} type="checkbox" name='licenseValidity' id="Expired" className='w-5'/>
                                    <span className='text-gray-300'>Expired</span>
                                </div>
                              </div>
                              <p className="text-red-500 text-xs">If either driver license or vehicle license expired choose the validity as expired</p>

                           
                        </div>

                          <div className='flex flex-col gap-1 flex-1'>
                            <label className='font-semibold text-gray-300'>Contact Number</label>
                            <input type="text" placeholder='Enter the number without the initial zero' id="contactNo" name="contactNo" pattern='[0-9]{9}'value={driverData.contactNo} onChange={handleChange}className='border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md p-2 mb-4' maxLength='9' minLength='9' required/>

                            <label className='font-semibold text-gray-300'>Vehicle License</label>
                            <input type="text" placeholder='Enter vehicle license number' id="vehicleLicense" name="vehicleLicense" value={driverData.vehicleLicense} onChange={handleChange}className='border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md p-2 mb-4' required/>

                            <label className='font-semibold text-gray-300'>Password</label>
                            <input type="password" placeholder='Enter the login password' id="password" name="password" value={driverData.password} onChange={handleChange} className='border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md p-2 mb-4' required />
                            {errors.password && <p className="text-red-500">{errors.password}</p>}
                            
                            <input type="submit" value="Update" className='bg-emerald-600 hover:bg-emerald-500 font-semibold text-white p-3 rounded-lg w-full cursor-pointer mt-3'/>
                          </div>
                </form>
              </div>
            </div>
        </div>
    </main>
    
  )
}
