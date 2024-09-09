import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import config from '@/lib/config';
import { addTransactionToindexDB } from '@/lib/db';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export default function CashDrawer() {
const open_cash = Cookies.get('open_cash');
const [openCashAmount, setOpenCashAmount] = useState(0);
const [drawerInputClose, setDrawerInputClose]  = useState(1);



useEffect(()=>{
    setDrawerInputClose(open_cash);
},[open_cash])

const handleOpenCash = async () =>{
        // console.log(openCashAmount);
        const cashier_id = Cookies.get('user_id');
        const outlet_id = Cookies.get('outlet_id');
        
        const response = await axios.post(
            `${config.apiBaseUrl}/create-transaction`,
            {
              cashier_id: cashier_id,
              outlet_id: outlet_id,
              method: "opencash",
              in: openCashAmount,
              reason: "Open Cash Drawer Amount"

            }, // The post data body, if any
            {
              withCredentials: true,
            }
          );
        
          if(response.data.length >0){
            Cookies.set('open_cash', 1);
            await addTransactionToindexDB(response.data[0]);
            setDrawerInputClose(1);
            toast.success("Cash drawer opened successfully");
          }


}
const openCashClose = () =>{
    Cookies.set('open_cash', 1);
    setDrawerInputClose(1);
}


  return (
    drawerInputClose != 1?(
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Open Cash Drawer Amount</h3>
      <input
              id="username"
              name="username"
              type="text"
              placeholder='Enter amount'
          //    value={username}
              onChange={(e) => setOpenCashAmount(e.target.value)}
              required
              className="block w-full px-3 py-3 mt-1 rounded-md shadow-sm focus:outline-none sm:text-sm bg-white border border-gray-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 mb-5"
        />

      <div className="flex justify-start gap-4">
              <button
            //  disabled={!selectedVariation}
                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:text-indigo-100"
                onClick={handleOpenCash}
              >
                Add
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
                onClick={ openCashClose}
              >
                Cancel
              </button>
            </div>
    </div>
  </div>
    ): ""
  )
}
