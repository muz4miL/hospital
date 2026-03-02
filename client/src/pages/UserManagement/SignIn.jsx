import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../../redux/user/userSlice';
import OAuth from '../../components/OAuth';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import img01 from '../../assets/login-rafiki.png';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
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
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className='bg-gray-950 min-h-screen'>
      <NavigationBar />
      <div className='p-3 w-auto mx-auto'>
  <div className="flex flex-col lg:flex-row max-w-7xl mx-auto justify-between mt-10 mb-14 lg:gap-5">
    <img src={img01} alt="" className="object-cover w-full lg:w-2/3 xl:w-1/2" />
    <div className="flex flex-col justify-center lg:w-1/2">
      <h1 className='text-3xl text-center lg:text-center font-semibold my-7 text-emerald-400 '>Sign In</h1>
      <div className='p-10 bg-gray-800 m-10 rounded-3xl max-w-4xl border border-gray-700'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type='email'
            placeholder='email'
            className='border border-gray-700 bg-gray-800 text-white placeholder-gray-500 p-3 rounded-lg'
            id='email'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='password'
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
          <OAuth/>
        </form>
      </div>
      
      <div className='flex gap-2 ml-9 mb-8 justify-center lg:justify-start'>
    <p className='text-gray-300'>Dont have an account?</p>
    <Link to={'/sign-up'}>
      <span className='text-emerald-400'>Sign up</span>
     
    </Link>
    {error && <p className='text-red-500 ml-11 justify-center'>{error}</p>}
    </div>
    </div>
  </div>
  
  
</div>

    <Footer />
    </div>
  );
}
