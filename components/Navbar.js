import React, {useState, useEffect} from 'react'
import ResetButton from './ResetButton'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
// const router = useRouter();

// const handleLogout = (event)=>{
//     event.preventDefault();
//     localStorage.removeItem('authToken');
//     router.push('/login');
// }

const [loggedIn, setLoggedIn] = useState(false);
const router = useRouter();


const handleLogout = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      //  console.log('/login');
        localStorage.clear();
        router.push('/login');
    } else {
      const errorData = await res.json();
      setError(errorData.error);
    }

};








  return (
    <nav className="w-32 h-screenr bg-white border-r">
    <div className="p-4">
      <ul>
        <li className="py-2">
          <Link href={"/"}>Home</Link>
        </li>
        <li className="py-2">
          <Link href={"/customers"}>Customers</Link>
        </li>

        {/* <li className="py-2">
          <Link href={"/login"}>Login</Link>
        </li> */}
        <li className="py-2">
        <Link href={"#"}>Cashier</Link>
        </li>  
        <li className="py-2">
        <Link href={"/orders"}>Orders</Link>
        </li>
        <li className="py-2">
          <Link href="#">Reports</Link>
        </li>
        <li className="py-2">
          <Link href="#">Settings</Link>
        </li>
      
        
        <li className="py-2">
        <Link href={"/pay"}>Pay</Link>
        </li>        
        <li className="py-2">
          <Link href={"/logout"} onClick={handleLogout}>Logout</Link>
        </li>
        <ResetButton />
      </ul>
    </div>
  </nav>
  )
}
