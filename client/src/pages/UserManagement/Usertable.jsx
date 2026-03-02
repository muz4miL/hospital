import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

import axios from 'axios';
import toast from 'react-hot-toast';

export default function Usertable() {

    
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const fetchuser = await axios.get('http://localhost:3000/api/user/read');
            const response = fetchuser.data;
            const updatedusers = response.user;   
            console.log(response);
           
            setData(response);
            setSearchResults(updatedusers);
            
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const filtered = data.user?.filter(elem => {
            return elem.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                elem.email.toLowerCase().includes(searchQuery.toLowerCase()) ;
                
        });
        setSearchResults(filtered || []);
    };

    const handleDeleteConfirmation = (id) => {
        setDeleteId(id);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/user/deleteall/${deleteId}`);
            setData(prevState => ({
                ...prevState,
                user: prevState.user.filter(promo => promo._id !== deleteId)
            }));
            setDeleteId(null);
            toast.success('User deleted successfully!');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancelDelete = () => {
        setDeleteId(null);
    };


  return (
    <div>
        <div>
            <form  className='px-10 py-2 pb-7 flex justify-end' onSubmit={handleSearch}>
                <div className='relative'>
                    <input type='text' placeholder='Search User Accounts' className='bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none w-56 p-2 pl-10' onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery}/>
                    <FaSearch className='text-gray-400 absolute top-1/2 transform -translate-y-1/2 left-3' />
                </div>
                <button type='submit' className='bg-emerald-600 border border-emerald-600 text-white rounded-md w-32 ml-2 hover:bg-emerald-500 hover:border-emerald-500 transition-all'>Search</button>
            </form>
        </div>
        <div className='px-10'>
        <table className="w-full border border-gray-700">
            <thead>
                <tr className="bg-gray-800 text-white text-left">
                    <th className="border border-gray-700 px-4 py-2">User Name</th>
                    <th className="border border-gray-700 px-4 py-2">Email</th>
                    <th className="border border-gray-700 px-4 py-2">Phone Number</th>
                    <th className="border border-gray-700 px-4 py-2">Address</th>  
                    <th className="border border-gray-700 px-4 py-2">Delete</th>  
                    
                </tr>
                </thead>
                <tbody>
                {searchResults?.map((elem, index) => {
                    return(
            <tr key={index} className="bg-gray-900 text-gray-300">
                <td className="border-b border-gray-700 px-4 py-2">{elem.username}</td>
                <td className="border-b border-gray-700 px-4 py-2">{elem.email}</td>
                <td className="border-b border-gray-700 px-4 py-2">{elem.phonenumber}</td>
                <td className="border-b border-gray-700 px-4 py-2">{elem.address}</td>
                <td className="border-b border-gray-700 px-4 py-2">
                            <div className='flex text-sm px-full'>
                                <button onClick={() => handleDeleteConfirmation(elem._id)} className='bg-red-600 text-white hover:bg-red-700 transition-all rounded  px-4 py-1 ml-2'>Delete</button>
                            </div>
                        </td>
            </tr>
          )})}
        </tbody>
            
            </table>
            </div>
            {deleteId && (
                <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-80">
                    <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg">
                        <p className="text-lg font-semibold mb-4">Are you sure you want to delete this User?</p>
                        <div className="flex justify-center">
                            <button onClick={handleDeleteConfirmed} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 mr-2">Delete</button>
                            <button onClick={handleCancelDelete} className="bg-gray-700 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-600 ml-2">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            </div>
  )
}

