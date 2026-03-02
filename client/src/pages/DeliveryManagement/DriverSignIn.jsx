import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInDriverStart,
  signInDriverSuccess,
  signInDriverFailure,
} from '../../redux/driver/driverSlice';
import DriveNavigationBar from '../../components/DriveNavigationBar';
import Footer from '../../components/Footer';

export default function DriverSignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.driver);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInDriverStart());
      const res = await fetch('/api/driver/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInDriverFailure(data.message));
        return;
      }
      dispatch(signInDriverSuccess(data));
      navigate('/driver-profile');
    } catch (error) {
      dispatch(signInDriverFailure(error.message));
    }
  };
  return (
    <div className='bg-gray-950 min-h-screen'>
      <DriveNavigationBar />
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 text-white'>Sign In</h1>
      <div className='p-10 bg-gray-800 m-10 rounded-3xl max-w-4xl border-2 border-gray-700'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Driver ID'
          className='border border-gray-700 bg-gray-800 text-white placeholder-gray-500 p-3 rounded-lg'
          id='driverId'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          className='border border-gray-700 bg-gray-800 text-white placeholder-gray-500 p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className='bg-emerald-600 text-white p-3 rounded-lg uppercase hover:bg-emerald-500 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
      </div>
     
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
    <Footer />
    </div>
  );
}
