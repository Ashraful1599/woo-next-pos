import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '@/lib/config';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCustomer } from '@/lib/slices/customersSlice';

const CustomerSelection = ({customers}) => {
  const [customer, setCustomer] = useState(null);
  const dispatch = useDispatch();

  const handleSelectCustomer = (cust) =>{
    dispatch(setSelectedCustomer(cust));
  }

  return (
    <div className="customer_lists overflow-auto">
      <h2 className="text-lg font-bold mb-2">Customers</h2>
      <ul className="space-y-2 grid grid-cols-1 gap-2 overflow-auto ">
        {customers.map((cust) => (
          <li onClick={()=>handleSelectCustomer(cust)} key={cust.id} className="flex gap-0 flex-col cursor-pointer">
            <span>{cust.first_name} {cust.last_name}</span>
            <span className='text-sm'>{cust.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerSelection;

