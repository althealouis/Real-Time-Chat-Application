import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { eyeImage } from '../assets/images/imagesIndex';
import axiosInstance from '../axiosInstance';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    try {
      e.preventDefault();
      const response = await axiosInstance.post('/api/v1/register', {username, password});
      // console.log('User registered from client side', response.data);
      navigate('/')
      setUsername('');
      setPassword('');
      alert("Successfully registered");
    } catch (error) {
      alert ('Username already taken, try a different one!')
      console.log("Registration ERROR :: ",error)
    }
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  }

  return (
    <>
      <div className=' bg-slate-900 h-screen flex items-center justify-center shadow-xl shadow-slate-100 mx-auto p-6'>
        <form className=' w-80 mt-4 block text-black font-bold border border-sky-200 shadow-xl p-5 rounded-lg bg-slate-700' onSubmit={handleRegister} >
          <h1 className=' text-3xl text-white font-bold p-5 text-center shadow-md bg-neutral-600 rounded-lg border mb-3'>Register</h1>
          <input 
          type="text" 
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className=' w-full block p-2 mb-3 rounded-lg shadow-md font-semibold '
          required  />
          <div className='relative'> {/* Added a relative container around the password input and toggle button */}
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 mb-3 rounded-lg font-semibold shadow-md pr-10' // Added pr-10 for right padding to accommodate the toggle button
              required
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute top-1/2 right-2 transform -translate-y-1/2"
            >
              {/* {showPassword ? 'Hide' : 'Show'} Password */}
              <img src={eyeImage} alt='' className="w-6 mb-2"/>
            </button>
            {/* {'Frontend\src\assets\images\eye.png'} */}
          </div>
          <button 
          type="submit"
          className=' block w-full p-2 text-slate-900 shadow-md  bg-gray-400  rounded-lg font-bold'
          >
            Register
          </button>
          <div className="font-medium flex justify-center p-3 text-white -mb-2">
            <span className="mx-2">Already a member? </span>
            <Link to="/" className="text-sky-300">Sign in!</Link>
          </div>
        </form>
      </div>
    </>
  )
}

export default Register