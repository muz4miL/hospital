import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import SideBar from '../../components/SideBar';

export default function PrescriptionViewDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

    const [prescriptionData, setPrescriptionData] = useState({
        PrescriptionID: '',
        firstName: '',
        lastName: '',
        age: '',
        contactNo: '',
        MedicationNames: '',
        units: '',
        notes: ''
    });

    useEffect(() => {
      axios.get(`http://localhost:3000/api/prescription/get/${id}`)
      .then(result => {
          const prescription = result.data.prescription;

          //prescription.createdAt = prescription.createdAt.split('T')[0];
          //prescription.expiredAt = prescription.expiredAt.split('T')[0];
          setPrescriptionData(prescription);

          console.log(prescription);
      })
      .catch(err => console.log(err));
  }, [id]);


    return (
        <div className='flex'>
            <SideBar />
            <div className='flex-1 bg-gray-950 min-h-screen'>
                <div className='bg-gray-900 justify-between flex px-10 py-8'>
                    <h1 className='text-4xl font-bold text-emerald-400'>View Prescription Details</h1>
                    <div className='flex gap-2'>
                        <div className='w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xl'>A</div>
                        <div className="flex w-full flex-col gap-0.5">
                            <div className="flex items-center justify-between font-bold text-white">
                                <h1>Admin</h1>
                            </div>
                            <p className='text-xs text-gray-400'>Prescription Manager</p>
                        </div>
                    </div>
                </div>
                
                <div className='p-10 bg-gray-800 m-10 rounded-3xl max-w-4xl border-2 border-gray-700'>
                    <form className='flex flex-col sm:flex-row gap-10'>
                        <div className='flex flex-col gap-1 flex-1'>
                            <label className='font-semibold text-gray-300'>Prescription ID</label>
                            <input type="text" placeholder='Enter Prescription ID' id="PrescriptionID" name="PrescriptionID" value={prescriptionData.PrescriptionID} className='border-2 border-gray-700 bg-gray-700 text-gray-400 outline-none rounded-md p-2 mb-4' readOnly/>

                            <label className='font-semibold text-gray-300'>First Name</label>
                            <input type="text" placeholder='Enter First Name' id="firstName" name="firstName" value={prescriptionData.firstName} className='border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md p-2 mb-4' />

                            <label className='font-semibold text-gray-300'>Last Name</label>
                            <input type="text" placeholder='Enter Last Name' id="lastName" name="lastName" value={prescriptionData.lastName} className='border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md p-2 mb-4' />

                            <label className='font-semibold text-gray-300'>Age</label>
                            <input type="text" placeholder='Enter Age' id="age" name="age" value={prescriptionData.age} className='border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md p-2 mb-4 ' />

                            <label className='font-semibold text-gray-300'>Contact Number</label>
                            <input type="text" placeholder='Enter Contact Number' id="contactNo" name="contactNo" value={prescriptionData.contactNo} className='border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md p-2 mb-4' />

                        </div>

                        <div className='flex flex-col gap-1 flex-1'>
                        <label className='font-semibold text-gray-300'>Medication Name</label>
                            <textarea type="textarea" placeholder='Enter Medication Name' id="MedicationNames" name="MedicationNames" value={prescriptionData.MedicationNames} className='border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md p-2 mb-4 ' />


                            <label className='font-semibold text-gray-300'>Unites</label>
                            <input type="text" placeholder='Enter unites' id="units" name="units" value={prescriptionData.units} className='border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md p-2 mb-4' />
                            
                            <label className='font-semibold text-gray-300'>Notes</label>
                            <textarea type="textarea" placeholder='Enter notes' id="notes" name="notes" value={prescriptionData.notes} className='border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none rounded-md p-2 mb-4 ' />

                        </div>
                    </form>
                </div>
            </div>
            
        </div>
    );
}
