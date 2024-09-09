'use client'
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import logo from "@/public/logo.svg"
import Image from 'next/image';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Loading from '@/components/Loading';
import { setLoading, setProgress, setMessage } from '@/lib/slices/loadingSlice';
import { clearDatabase } from '@/lib/dbClearFunctions'
import { saveOutlet, clearOutlet } from '@/lib/db';

export default function LoginPage() {
  const [username, setUsername] = useState('admin2');
  const [password, setPassword] = useState('12345');
  const [error, setError] = useState('');
  const [userOutlet, setUserOutlet] = useState([]);
  const [user, setUser] = useState([]);
  const { loading, progress, message } = useSelector((state) => state.loading);


  const router = useRouter();
  const dispatch = useDispatch();



  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(setLoading(true)); // Begin loading state
    dispatch(setProgress(""));
    dispatch(setMessage("Login in progress..."));



    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        // Safeguard against potential empty responses
        if (res.ok) {
            const resJson = await res.json();

            if(resJson.success){
              // console.log(resJson.message); // Should log "Login successful"
              toast.dismiss();
              toast.success(resJson.message);
              dispatch(setLoading(false)); // Begin loading state
              // Optionally store user and outlet information
              const data = resJson.data;
            //  // console.log(data);
              if (data) {
                Cookies.set('user_id', data.user.ID);
                Cookies.set('user_name', data.user.display_name);
                Cookies.set('user_login', data.user.user_login);
                Cookies.set('user_email', data.user.user_email);

                  setUser(data.user);
                  setUserOutlet(data.outlet);
                  await clearDatabase();
                  


              }

            }else{
              // console.log(resJson.data); // Should log "Login successful"
              toast.error(resJson.message);
            }


        } 
    } catch (error) {
        console.error('An unexpected error occurred:', error.message);
        toast.error('An unexpected error occurred');
    }
};

const handleLoginOutlet = (outletId) =>{
  userOutlet.forEach( async (outlet)=>{
    if(outlet.id == outletId){
      Cookies.set('outlet_id',outlet.id);
      Cookies.set('outlet_name',outlet.name);
      //// console.log('outletArray',outlet);
       await clearOutlet();
       await saveOutlet(outlet);
       
      // Cookies.set('outlet_address1',outlet.address1);
      // Cookies.set('outlet_address2',outlet.address2);
      // Cookies.set('outlet_city',outlet.city);
      // Cookies.set('outlet_country',outlet.country);
      // Cookies.set('outlet_email',outlet.email);
      // Cookies.set('outlet_phone',outlet.phone);
      // Cookies.set('outlet_postcode',outlet.postcode);
      // Cookies.set('outlet_state',outlet.state);

      router.push('/');
    }
  })
}



 

  return (
    <div className="flex items-center justify-center min-h-screen">

      {/* {
        loading && <Loading />
      } */}
   
        

      {
        
        userOutlet.length == 0 ?(

      <div className="w-full max-w-sm space-y-8 bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-center">
          <Image width={logo.width} height={logo.height} src={logo.src} alt="Nutrizone Supplements" className="h-16 object-contain" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900">LOGIN TO YOUR ACCOUNT</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* <div>
            <label htmlFor="outlet" className="block text-sm font-medium text-gray-700">
              Select the outlet
            </label>
            <select
              id="outlet"
              name="outlet"
              className="block w-full px-3 py-2 mt-1 text-gray-900 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            >
              <option>Outlet 1</option>
              <option>Outlet 2</option>
              <option>Outlet 3</option>
            </select>
          </div> */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium ">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder='Enter username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full px-3 py-2 mt-1 rounded-md shadow-sm focus:outline-none sm:text-sm bg-white border border-gray-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium ">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-3 py-2 mt-1 rounded-md shadow-sm focus:outline-none sm:text-sm bg-white border border-gray-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {/* <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
                Lost Password?
              </a>
            </div>
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
                <label htmlFor="remember_me" className="ml-2 text-sm text-gray-900">
                  Remember Me
                </label>
              </div>
            </div> */}
            <div>
              <button 
                type="submit" disabled = {loading}
                className="w-full px-4 py-2 font-bold bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-50 disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:text-indigo-100"
              >
                LOG IN
              </button>
            </div>
          </form>
        </div>): (
          <div className='"w-full max-w-sm p-8 space-y-8 bg-white shadow-lg rounded-lg"'>

            <div className='login_outlet_wrap'>
            <h2 className='text-2xl font-bold text-center mb-6 text-gray-700'>Please select the outlet</h2>
             <ul className='login_outlet'>
                {
                  userOutlet.map((item, index)=>(
                    <li className='bg-teal-500 text-white hover:bg-teal-600 ' onClick={()=>handleLoginOutlet(item.id)} key={item.id}>{item.name}</li>
                  ))
                }
             </ul>
          </div>
          </div>
        )
}



         

      </div>
    );
  }
