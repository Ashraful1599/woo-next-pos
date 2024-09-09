
import { useEffect, useState, useRef } from 'react';
import { FaEquals, FaWifi, FaSync, FaPlane, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { goOnline, goOffline } from "@/lib/slices/onlineSlice";
import { toast } from 'react-toastify';
import Link from 'next/link';
import Cookies from 'js-cookie';

const Header = ({ searchField, items, setItems, onSearch, searchType }) => {

  const cookieOutletName = Cookies.get('outlet_name');

  const [outletName, setOutletName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const originalItems = useRef([]);
  const dispatch = useDispatch();
  const {isOnline} = useSelector((state)=> state.online);
  const {loading} = useSelector((state)=> state.loading);
  // Fetch outlet name from localStorage when the component mounts
  useEffect(() => {
   // const outletName = Cookies.get('outlet_name');
    setOutletName(cookieOutletName);
  }, [cookieOutletName]);

  // Store the original products only once when the component mounts
  useEffect(() => {
    if (originalItems.current.length === 0 && items?.length > 0) {
      originalItems.current = items;
    }
  }, [items]);

  // Update filtered products based on the search query
  useEffect(() => {
    if (typeof setItems === 'function') {

    if (searchQuery === '') {
      dispatch(setItems(originalItems.current));
      onSearch(); // Call the onSearch function passed from parent
    } else {

  
        const results = originalItems.current.filter(item =>{
          if (searchType == 'customer') {
            const fullName = `${item.billing?.first_name || ''} ${item.billing?.last_name || ''}`.toLowerCase();
            
            return (
              item.email?.toLowerCase().includes(searchQuery.toLowerCase()) || item.phone?.toLowerCase().includes(searchQuery.toLowerCase()) || item.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) || fullName?.includes(searchQuery.toLowerCase())
            );
          }else if( searchType == 'product'){
           return item.title.toLowerCase().includes(searchQuery.toLowerCase())
          }
          else if( searchType == 'order'){
          //  // console.log(searchQuery);
         //   // console.log(item);
            return (
                item.order_id.includes(searchQuery) || item.offline_id.includes(searchQuery) || item.email.toLowerCase().includes(searchQuery.toLowerCase())
              )
           }          
           else if( searchType == 'transaction'){
          //  // console.log(searchQuery);
          //  // console.log(item);
            return (
                item.order_id?.includes(searchQuery) || item.id.includes(searchQuery)
              )
           }
        }
          
        );
      
     

        dispatch(setItems(results));
      onSearch(); // Call the onSearch function passed from parent
    }
  }
  }, [searchQuery, setItems, dispatch, onSearch, searchType]);



  

  // Handle search input changes
  const handleOnSearch = (event) => {
    setSearchQuery(event.target.value);
  };



  useEffect(() => {
    // Handler to call when the device goes offline
    const handleOffline = () => {
      dispatch(goOffline());
      // console.log("You are now offline");
      toast.warning('You are now offline');
    };

    // Handler to call when the device goes online
    const handleOnline = () => {
      dispatch(goOnline());
      // console.log("You are now online");
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
      <div className="w-full mx-auto py-2 px-4 flex gap-4 items-center">
        <h3 className="text-xl font-bold text-gray-900 col-span-1 w-1/5 outlet_name_header">
          {outletName ? outletName : "NUTRIZONE"}
        </h3>
        {searchField && (
          <div className="relative w-full col-span-3 searchbar">
            <input
              onChange={handleOnSearch}
              className="w-full px-10 py-2 rounded-md shadow-sm focus:outline-none bg-white border border-gray-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300"
              type="text"
              placeholder={
                searchType === 'customer'
                  ? "Customer search by name, email and phone..."
                  : searchType === 'product'
                  ? "Product search..."
                  : searchType === 'order'
                  ? "Order search by order id and customer email..."
                  : searchType === 'transaction'
                  ? "Transaction search by order id or transaction id..."
                  : ""
              }
              name="search"
              value={searchQuery}
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch />
            </span>
          </div>
        )}
        <div className="header_icons w-4/5 flex justify-end items-center gap-7 text-xl pr-2">
          <Link href={'orders?tab=hold-sale'} className="hold_cart" title="Hold Cart">
            <FaEquals />
          </Link>
          <div className="online_mode">
            {isOnline ? <FaWifi title="Online" /> : <FaPlane title="Offline" />}
          </div>
          <Link href={'orders?tab=offline-sale-orders'} className="offline_orders" title="Offline orders">
            <FaSync className={loading == true?"spinner": ""} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
