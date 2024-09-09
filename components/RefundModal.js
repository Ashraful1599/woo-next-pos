import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import config from '@/lib/config';
import { fetchTaxes } from '@/lib/slices/taxSlice';
import Cookies from 'js-cookie';
import { updateOrderToindexDB } from '@/lib/db';
import { setOrders } from '@/lib/slices/ordersSlice';
import { setRefundItem } from '@/lib/slices/refundSlice';
import {setLoading, setMessage, setProgress} from "@/lib/slices/loadingSlice";
import { toast } from 'react-toastify';
import { setRefundRestock } from '@/lib/slices/refundSlice';
import { addTransactionToindexDB } from '@/lib/db';

const RefundModal = ({ isVisible, onClose }) => {
  const item = useSelector((state) => state.refund.item);
  const refundRestock = useSelector((state) => state.refund.refundRestock);
  const rates = useSelector((state) => state.taxes.rates);
  const orders = useSelector((state) => state.orders.items);
  const dispatch = useDispatch();
  const loading = useSelector((state)=>state.loading.loading)
  const initialRefundQuantities = item?.products?.reduce((acc, product) => {
    acc[product.item_id] = 0;
    return acc;
  }, {}) || {};



  const [refundQuantities, setRefundQuantities] = useState(initialRefundQuantities);
  const [refundReason, setRefundReason] = useState('');
  const [restockItems, setRestockItems] = useState(true);

  useEffect(() => {
    const initialRefundQuantities = item?.products?.reduce((acc, product) => {
      acc[product.item_id] = 0;
      return acc;
    }, {}) || {};
    setRefundQuantities(initialRefundQuantities);

    dispatch(setRefundRestock(true));
    item?.products?.find((product)=>{
      if(product.type == 'custom'){
        dispatch(setRefundRestock(false));
      }
   });

  }, [item, dispatch]);

useEffect(()=>{
    dispatch(fetchTaxes());
}, [dispatch])



  if (!isVisible) return null;

  const handleIncrement = (item_id, availableQuantity) => {
    setRefundQuantities((prev) => ({
      ...prev,
      [item_id]: Math.min((prev[item_id] || 0) + 1, availableQuantity),
    }));
  };

  const handleDecrement = (item_id) => {
    setRefundQuantities((prev) => ({
      ...prev,
      [item_id]: Math.max((prev[item_id] || 0) - 1, 0),
    }));
  };

  const handleQuantityChange = (item_id, value, availableQuantity) => {
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue)) {
        setRefundQuantities((prev) => ({
          ...prev,
          [item_id]: Math.min(parsedValue, availableQuantity),
        }));
    }
  };

  const calculateRefundAmount = () => {
    let subtotal = item?.products?.reduce((total, product) => {
      const quantity = refundQuantities[product.item_id] || 0;
      return total + (product.uf * quantity);
    }, 0) || 0;

    let totalTax = rates.reduce((total, rate) => {
      return total + (subtotal * (rate.rate / 100));
    }, 0);

    return (subtotal + totalTax).toFixed(2);
  };


  const handleRefund = async() =>{

    try {
        const cashier_id = Cookies.get("user_id");
        const outlet_id = Cookies.get("outlet_id");

       // // console.log(refundProducts);

        const refundData = {
            refundReason,
            refundProducts: refundQuantities,
            restockItems: refundRestock == false? refundRestock : restockItems,
            orderId: item.id,
          };

    // console.log('refundData',refundData);
 
        const refundJson =  JSON.stringify(refundData)

          dispatch(setLoading(true))
          dispatch(setMessage("Refund is processing..."))
          dispatch(setProgress(""))

        const response = await axios.post(
            `${config.apiBaseUrl}/create-refund`,
            {
              cashier_id: cashier_id,
              outlet_id: outlet_id,
              refund_data: refundJson,
            },
            {
              withCredentials: true,
            }
          );

          console.log(response);

          if(response.status == 200){
             await updateOrderToindexDB(response.data.id, response.data);

             response.data.transactions.map( async (tran)=>{
              await addTransactionToindexDB(tran);
            })
             const refundOrder = response.data;
             const updatedOrders = orders.map(order =>
                order.id === refundOrder.id ? refundOrder : order
              );

              dispatch(setLoading(false))
              toast.success("Order refunded successfully!")
              onClose();
          
             dispatch(setOrders(updatedOrders))
             dispatch(setRefundItem(refundOrder))

          }


 

        
    } catch (error) {
        // console.log("Someting wrong", error);
    }

  }



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-1/2 p-4">
        <h2 className="text-xl font-bold mb-4">Available Items for Refund</h2>
        <ul className='refund_product_list'>
          {item?.products?.map((product) => (
            <li key={product.id} className="flex justify-between items-center mb-4">
              <span>{product.name} - ${Number(product.uf).toFixed(2)} x <span className='font-bold'>{product.quantity-product.returned_quantity}</span></span>
              <div className="flex items-center">
                <button 
                  onClick={() => handleDecrement(product.item_id)} 
                  className="bg-gray-200 px-2 rounded p-2 w-8 text-center font-bold "
                  disabled={product.quantity-product.returned_quantity == 0? "disabled": ""}
                >-</button>
                <input
                  type="text"
                  value={refundQuantities[product.item_id] || 0}
                  onChange={(e) => handleQuantityChange(product.item_id, e.target.value, product.quantity)}
                  className="mx-2 text-center w-12 p-2 font-bold "
                  disabled={product.quantity-product.returned_quantity == 0? "disabled": ""}
                  min="0"
                  max={product.quantity-product.returned_quantity}
                />
                <button 
                disabled={product.quantity-product.returned_quantity == 0? "disabled": ""}
                  onClick={() => handleIncrement(product.item_id, product.quantity)} 
                  className="bg-gray-200 px-2 rounded p-2 w-8 font-bold "
                >+</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4">
          <div className='w-1/3'>
            <label className="flex items-center ">
         
              <input
                type="checkbox"
                title={refundRestock? "": "Restock item is not available for custom products"}
                checked={refundRestock ?restockItems: refundRestock }
                onChange={(e) => setRestockItems(e.target.checked)}
                className="mr-2 "
              />
              Restock Items
            </label>
            <input
              type="text"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Enter Reason (Optional)"
              className="border border-gray-300 p-2 rounded w-full mt-2 focus:outline-none  bg-white focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div className="text-right">
            <p className="text-teal-600 font-bold">Estimate Refund Amount: ${calculateRefundAmount()} (incl. tax)</p>
            <div className="mt-4 flex gap-4 justify-end">
              <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">
                Cancel
              </button>
              <button
              onClick={handleRefund}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded disabled:bg-indigo-300 disabled:cursor-not-allowed" disabled={calculateRefundAmount()==0 || loading == true? "disabled": ""}>
                Refund
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;
