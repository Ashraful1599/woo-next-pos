'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import logo from "@/public/logo.svg"
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('test');
  const [password, setPassword] = useState('12345');
  const [error, setError] = useState('');
  const router = useRouter();

  // useEffect(() => {
  //   const token = document.cookie.split('; ').find(cookie => cookie.startsWith('authToken='));
  //   if (token) {
  //     router.push('/');
  //   }
  // }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('api/login')
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data);
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('user_name',data.user_name);
      localStorage.setItem('user_email',data.user_email);
      localStorage.setItem('outlet_id',data.outlet_id);
      localStorage.setItem('outlet_name',data.outlet_name);
      router.push('/');

    } else {
      const errorData = await res.json();
    //  console.log(errorData);
      setError(errorData.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white shadow-lg rounded-lg">
        <div className="flex justify-center">
          <Image width={logo.width} height={logo.height} src={logo.src} alt="Nutrizone Supplements" className="h-16 object-contain" />
        </div>
        <h2 className="text-2xl font-bold text-center">LOGIN TO YOUR ACCOUNT</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
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
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full px-3 py-2 mt-1 text-gray-900 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-3 py-2 mt-1 text-gray-900 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex items-center justify-between">
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
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-bold text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                LOG IN
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
