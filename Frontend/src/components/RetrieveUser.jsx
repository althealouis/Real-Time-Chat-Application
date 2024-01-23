import React, { useEffect, useState } from 'react'
import axios from 'axios'
// import Cookies from 'js-cookies'

function RetrieveUser() {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);

  const getUserData = async () => {

    //Retrieve token from the lcoal storage
    let token = localStorage.getItem("token") || null;
    // console.log(token);

    // Check if the token is available
    if (!token) {
      console.log("No token provided")
    }
    // Set the Authorization header in the Axios request
    const config = {
      headers: {
        'Authorization': token // Set the token in the Authorization header
      }
    };
    // Make an API call to retrieve user data using the provided configuration
    const response = await axios.get('http://localhost:5000/api/v1/current-user', config);

    if (!response) {
      console.log("Invalid token", error)
    }

    setUsername(response.data.data.username);
    setId(response.data.data._id);
    // console.log(response.data.username);
    // console.log(username);
    console.log("User Data Retrieved Successfully", response.data.data);
    return response.data;
  }


useEffect(() => {
    getUserData()
}, [])

    return (
    <div className=' bg-neutral-700 h-screen'>
    <h1 className=' font-bold text-3xl flex justify-center text-white p-5 mb-5'>Current user data</h1>
        <div className=' p-5 mb-3 rounded-lg w-auto h-auto max-w-fit mx-auto  bg-slate-800 flex justify-center text-white font-semibold'>
        <h2 className=''>Welcome, {username} !</h2> {' '}
        </div>
        <div className=' p-5  rounded-lg w-auto h-auto max-w-fit mx-auto  bg-slate-800 flex justify-center text-white font-semibold'>
        <h2 className=''>ID: {id || 'could not retrieve'}</h2>
        </div>
    </div>
)
}

export default RetrieveUser;