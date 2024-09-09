import React, { useEffect, useState, useRef  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRefundItem } from "@/lib/slices/refundSlice";
import RefundModal from "@/components/RefundModal";
import { FaArrowLeft, FaBackward, FaUndo  } from "react-icons/fa";
import Cookies from "js-cookie";
import { getOutlet } from "@/lib/db";
import ReactToPrint from 'react-to-print';
import InvoiceContent from '@/components/InvoiceContent';


const OrderList = ({ orders }) => {
  const dispatch = useDispatch();
  const isFirstLoad = useRef(true);
  const item = useSelector((state) => state.refund.item);
  const [isModalVisible, setModalVisible] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [outletDetails, setOutletDetails] = useState(null);
  const componentRef = useRef();


  // console.log('reund item list page', item);

  useEffect(() => {
    const fetchData = async () => {
        const outlet_id = Cookies.get('outlet_id');
        const getoutletDetails = await getOutlet(outlet_id);
        setOutletDetails(getoutletDetails);
        setInvoiceData(item);
    };

    fetchData();
}, [item]);



  const handleRefundClick = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // console.log("refund item",item)


  useEffect(() => {
    if (isFirstLoad.current) {

      if (orders && orders.length > 0) {
        dispatch(setRefundItem(orders[0]));
        isFirstLoad.current = false;
      }
    }
  }, [dispatch, orders]);  

  const handleOrderDetails = (order) => {
    dispatch(setRefundItem(order));
  };

  return (
    <div className="products_list grid grid-cols-3 orderlist_ul_wrap">
      <div className="col-span-2">
        <h2 className="text-lg font-bold mb-2">Orders</h2>

        {orders && orders.length > 0 ? (
          <ul className="grid gap-2 overflow-auto orderlist_ul">
            {orders.map((order) => (
              <li
                key={order.id}
                className={`flex gap-4 justify-between p-6 rounded-lg cursor-pointer border-2  ${order.id == item.id? "border-indigo-500" : "" }`}
                onClick={() => handleOrderDetails(order)}
              >
                <div>
                  <p className="text-2xl font-bold">#{order.id}</p>
                  <p>{new Date(order.order_date).toLocaleString()}</p>
                  <p>{order.email}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ${Number(order.order_total).toFixed(2)}
                  </p>
                  <p>{order.products?.length} - Item(s)</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders available</p>
        )}
      </div>
      <div className="col-span-1">
        <div className="bg-white p-4 rounded shadow-lg col-span-2 flex flex-col side_cart_wrap_order">
          {item && item.products ? (
            <>
              <div className="cart_header flex items-center flex-none justify-between">
                <div>
                  <p className="text-3xl font-bold">#{item?.id}</p>
                  <p>
                    {item?.order_date
                      ? new Date(item.order_date).toLocaleString()
                      : ""}
                  </p>
                </div>
                <div>
                  <p className="">
                    {item?.fname} {item?.lname}
                  </p>
                  <p className="">{item?.email}</p>
                </div>
              </div>

              <ul className="mt-4 border-t pt-4 cart_items flex flex-col flex-1 flex-grow overflow-y-auto gap-2">
                {item?.products?.length > 0 ? (
                  item?.products?.map((item) => (
                    <li key={item.id} className="relative">
                      <div className="flex justify-between items-center cart_item_namer gap-3">
                        <div>
                          {item.name} 
                            <p className="flex items-center">${Number(item.uf).toFixed(2)} x{item.quantity} {item.returned_quantity?(<span className="text-teal-500 flex items-center"><FaUndo className="ms-3 mr-1 -rotate-45"  />{item.returned_quantity}</span>): ""} </p>
                        </div>
                        <div className="mr-0">
                          ${Number(item.uf_total).toFixed(2)}
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-center">There is no orders</li>
                )}
              </ul>

              <div className="border-t pt-4">
                <div className="taxes bg-gray-100 p-2 rounded-sm mb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Subtotal</span>
                    <span>${Number(item?.order_subtotal).toFixed(2)}</span>
                  </div>
                  {item?.tax_lines?.map((tax) => (
                    <div
                      key={tax.id}
                      className="flex justify-between items-center"
                    >
                      <span>{tax.label}</span>
                      <span>${Number(tax.total).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center ">
                    <span className="font-bold">Discount</span>
                    <span>-${Number(item?.discount).toFixed(2)}</span>
                  </div>
                </div>
                <div className="p-2 bg-gray-100  rounded-sm">
                  <div className="subtotal-totals ">
                    <div className="flex justify-between items-center font-bold">
                      <span>Total</span>
                      <span>${Number(item?.order_total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="subtotal-totals ">
                    <div className="flex justify-between items-center font-bold">
                      <span>Refunded</span>
                      <span>${Number(item?.order_refunded || 0).toFixed(2)}</span>
                    </div>
                  </div>
                  {item?.payment_methods?.map((payment_method, index) => (
                    <div key={index} className="subtotal-totals ">
                      <div className="flex justify-between items-center">
                        <span>{payment_method?.name}</span>
                        <span>
                          ${Number(payment_method?.amount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="subtotal-totals ">
                    <div className="flex justify-between items-center">
                      <span>Change</span>
                      <span>${Number(item?.change || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex gap-4">


        <div id="invoice" style={{ display: 'none' }}>
          <div ref={componentRef}>
            {/* {// console.log('invoiceData',invoiceData)}
            {// console.log('outletDetails',outletDetails)} */}
            {invoiceData != null && outletDetails != null && Object.keys(invoiceData).length> 0 && Object.keys(outletDetails).length> 0? <InvoiceContent invoiceData={invoiceData} outletDetails={outletDetails} /> : ""} 
          </div>
        </div>
        <ReactToPrint 
          trigger={() => (
            <button
              className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-md disabled:bg-teal-300 disabled:text-teal-100 disabled:cursor-not-allowed"
            >
              Print Invoice
            </button>
          )}
          content={() => componentRef.current}
        />


                    <button
                      disabled={item.order_refunded == item.order_total? "disabled": ""}
                      onClick={handleRefundClick}
                      className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md text-center disabled:bg-indigo-300 disabled:text-indigo-100 disabled:cursor-not-allowed"
                    >
                      Refund
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>No order selected</p>
          )}
        </div>
      </div>

      <RefundModal isVisible={isModalVisible} onClose={handleCloseModal} />

              
    </div>
  );
};

export default OrderList;
