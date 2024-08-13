
import { useEffect, useState, useRef } from 'react';
import { FaEquals, FaWifi, FaSync, FaPlane } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { goOnline, goOffline } from "@/lib/slices/onlineSlice";
import { toast } from 'react-toastify';
import Link from 'next/link';

const Header = ({ products, setProducts, searchField, onSearch, searchCustomers }) => {
  const [outletName, setOutletName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const originalProducts = useRef([]);
  const dispatch = useDispatch();
  const {isOnline} = useSelector((state)=> state.online);
  // Fetch outlet name from localStorage when the component mounts
  useEffect(() => {
    setOutletName(localStorage.getItem('outlet_name') || "Nutrizone");
  }, []);

  // Store the original products only once when the component mounts
  useEffect(() => {
    if (originalProducts.current.length === 0 && products?.length > 0) {
      originalProducts.current = products;
    }
  }, [products]);

  // Update filtered products based on the search query
  useEffect(() => {
    if (typeof setProducts === 'function') {

    if (searchQuery === '') {
      setProducts(originalProducts.current);
      onSearch(); // Call the onSearch function passed from parent
    } else {

  
        const results = originalProducts.current.filter(product =>{
          if(searchCustomers){
            return product.email.toLowerCase().includes(searchQuery.toLowerCase())
          }else{
           return product.name.toLowerCase().includes(searchQuery.toLowerCase())
          }
        }
          
        );
      
     

      setProducts(results);
      onSearch(); // Call the onSearch function passed from parent
    }
  }
  }, [searchQuery, setProducts, onSearch, searchCustomers]);

  // Handle search input changes
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };



  useEffect(() => {
    // Handler to call when the device goes offline
    const handleOffline = () => {
      dispatch(goOffline());
      console.log("You are now offline");
      toast.warning('You are now offline');
    };

    // Handler to call when the device goes online
    const handleOnline = () => {
      dispatch(goOnline());
      console.log("You are now online");
      toast.success('You are now online');
    };

    // Listen for the online event
    window.addEventListener("online", handleOnline);
    // Listen for the offline event
    window.addEventListener("offline", handleOffline);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [dispatch]);







  return (
    <header>
      <div className="w-full mx-auto py-2 px-4 flex gap-4">
        <h3 className="text-xl font-bold text-gray-900 col-span-1 w-1/5">
          {outletName?outletName : "Nutrizone"}
        </h3>
        {
          searchField &&  <input
          onChange={handleSearch}
          className="col-span-3 px-4 py-2 w-full"
          type="text"
          placeholder={searchCustomers? "Customer serarch...": "Product search..."}
          name="search"
          value={searchQuery}
        />
        }
        <div className='header_icons w-4/5 flex justify-end items-center gap-5'>
                <Link href={'orders?tab=hold-sale'} className='hold_cart' title='Hold Cart'>
                  <FaEquals />
                </Link>
          <div className='online_mode'>  
            {isOnline? <FaWifi title='Online' />: <FaPlane title='Offline' /> }
            
          </div>
          <div className='offline_orders' title='Offline orders'>  
            <FaSync />
          </div>
        </div>
 
      </div>
    </header>
  );
};

export default Header;
