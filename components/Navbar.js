import React, { useState, useEffect } from 'react';
import ResetButton from './ResetButton';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { clearDatabase } from '@/lib/dbClearFunctions'; 
import { toast } from 'react-toastify'; 
import { setLoading } from '@/lib/slices/loadingSlice';
import { useDispatch } from 'react-redux'; 
import { FaUserCircle, FaSignOutAlt, FaHome, FaUser, FaFile, FaTachometerAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

// const handleLogout = (event)=>{
//     event.preventDefault();
//     localStorage.removeItem('authToken');
//     router.push('/login');
// }

const user_name = Cookies.get('user_name');
const [loggedIn, setLoggedIn] = useState(false);
const [userName, setUserName] = useState("");

useEffect(()=>{
  setUserName(user_name);
},[user_name])
const handleLogout = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      //  // console.log('/login');
        localStorage.clear();
        await clearDatabase();
        dispatch(setLoading(false));
        toast.dismiss();
        router.push('/login');
    } else {
      const errorData = await res.json();
      setError(errorData.error);
    }

};








  return (
    <nav className="w-36 bg-white border-r">
    <div className="p-4 flex flex-col justify-between nav_logout_wrap">
      <ul className='navbar_menu'>
        <li className={pathname === '/' ? 'active' : ''}>
          <Link href={"/"}>
          <FaHome />
          Home</Link>
        </li>
        <li className={pathname === '/customers' ? 'active' : ''}>
          <Link href={"/customers"}>
          <FaUser />
          Customers</Link>
        </li>

        {/* <li className="py-3">
          <Link href={"/login"}>Login</Link>
        </li> */}
        {/* <li className="py-3">
        <Link href={"#"}>Cashier</Link>
        </li>   */}
        <li className={pathname === '/orders' ? 'active' : ''}>
        <Link href={"/orders"}>
        <FaFile />
        Orders</Link>
        </li>
        <li className={pathname === '/reports' ? 'active' : ''}>
          <Link href="/reports">
          <FaTachometerAlt />
          Reports</Link>
        </li>
        {/* <li className="">
          <Link href="#">Settings</Link>
        </li> */}
      
        
        {/* <li className="">
        <Link href={"/pay"}>Pay</Link>
        </li>         */}
        {/* <li className="">
          <Link href={"/logout"} onClick={handleLogout}>Logout</Link>
        </li> */}
        <ResetButton />
      </ul>

      <div className="flex flex-col items-center justify-center bg-white rounded-lg">
      <div className="w-16 h-16 text-gray-500">
        <FaUserCircle className="w-full h-full" />
      </div>
      <h2 className=" text-gray-700 text-center">{userName}</h2>
      <Link className='logout_button_wrap mt-4' href={"/logout"} passHref onClick={handleLogout}>
      <button className="flex flex-col items-center  logout_buttonr">
        <FaSignOutAlt className="mr-2" />
        <span>Logout</span>
      </button>
      </Link>
    </div>

    </div>
  </nav>
  )
}
