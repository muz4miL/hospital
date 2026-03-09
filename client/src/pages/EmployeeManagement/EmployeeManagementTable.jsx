import  { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function EmployeeTable() {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const fetchEmployee = await axios.get('/api/employee/read');
            const response = fetchEmployee.data;
            const updatedEmployees = response.employee.map(emp => {
                if (new Date(emp.expiredAt) < new Date()) {
                    emp.status = 'Inactive';
                    axios.put(`/api/employee/update/${emp._id}`, { status: 'Inactive' })
                    .then(response => {
                        console.log('Employee status updated:', response);
                    })
                    .catch(error => {
                        console.error('Error updating employee status:', error);
                    });
                }
                return emp;
            });
            setData(response);
            setSearchResults(updatedEmployees);
        } catch (error) {
            console.log(error);
        }
    };

    const formatDate = (datetimeString) => {
        const date = new Date(datetimeString);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        return formattedDate;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const filtered = data.employee?.filter(elem => {
            return (
                elem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                elem.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                elem.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setSearchResults(filtered || []);
    };
    

    const handleDeleteConfirmation = (id) => {
        setDeleteId(id);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await axios.delete(`/api/employee/delete/${deleteId}`);
            setData(prevState => ({
                ...prevState,
                employee: prevState.employee.filter(emp => emp._id !== deleteId)
            }));
            setDeleteId(null);
            toast.success('Employee deleted successfully!');
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
            <form className='flex justify-end gap-2 px-6 py-2 pb-5' onSubmit={handleSearch}>
                <div className='relative'>
                    <input type='text' placeholder='Search employees...' className='w-56 py-2 text-sm input-field pl-9' onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery}/>
                    <FaSearch className='absolute text-sm transform -translate-y-1/2 text-zinc-500 top-1/2 left-3' />
                </div>
                <button type='submit' className='text-sm btn-primary'>Search</button>
            </form>
        </div>
        <div className='px-6 pb-6'>
        <div className='overflow-hidden border shadow-lg rounded-xl border-zinc-800 shadow-black/20'>
        <table className="w-full">
            <thead>
                <tr className="border-b bg-zinc-900/80 border-zinc-800">
                    <th className="table-th">ID</th>
                    <th className="table-th">Name</th>
                    <th className="table-th">Email</th>
                    <th className="table-th">NIC</th>
                    <th className="table-th">Gender</th>
                    <th className="table-th">Contact No</th>
                    <th className="table-th">Job Role</th>
                    <th className="table-th">Date of Birth</th>
                    <th className="table-th">Actions</th>
                </tr>
            </thead>
            <tbody className='bg-zinc-950'>
                {searchResults?.map((elem, index) => {
                    return (
                    <tr key={index} className="table-row border-b border-zinc-800/60">
                        <td className="table-td font-mono text-zinc-500 text-xs max-w-[80px] truncate">{elem._id}</td>
                        <td className="font-medium table-td text-zinc-200">{elem.name}</td>
                        <td className="table-td text-zinc-400">{elem.email}</td>
                        <td className="table-td text-zinc-400">{elem.NIC}</td>
                        <td className="table-td">
                            <span className='px-2 py-0.5 rounded-full text-xs bg-zinc-800 text-zinc-300'>{elem.gender}</span>
                        </td>
                        <td className="table-td text-zinc-400">{elem.contactNo}</td>
                        <td className="table-td">
                            <span className='px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400'>{elem.empRole}</span>
                        </td>
                        <td className="table-td text-zinc-400">{formatDate(elem.DOB)}</td>
                        <td className="table-td">
                            <div className='flex gap-2'>
                                <Link to={`/update-employee/${elem._id}`}><button className='px-3 py-1 text-xs transition-colors border rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'>Edit</button></Link>
                                <button onClick={() => handleDeleteConfirmation(elem._id)} className='px-3 py-1 text-xs text-red-400 transition-colors border rounded-lg bg-red-500/10 hover:bg-red-500/20 border-red-500/20'>Delete</button>
                            </div>
                        </td>
                    </tr>
                    )})}
            </tbody>
        </table>
        </div>
        </div>
        {deleteId && (
                <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black/70 backdrop-blur-sm">
                    <div className="p-8 border shadow-2xl bg-zinc-900 border-zinc-800 text-zinc-100 rounded-xl">
                        <p className="mb-2 text-lg font-semibold">Delete Employee?</p>
                        <p className="mb-6 text-sm text-zinc-400">This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={handleCancelDelete} className="text-sm btn-secondary">Cancel</button>
                            <button onClick={handleDeleteConfirmed} className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-500">Delete</button>
                        </div>
                    </div>
                </div>
            )}
    </div>
  )
}

export default EmployeeTable