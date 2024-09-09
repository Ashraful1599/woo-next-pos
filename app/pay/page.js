"use client";
import InvoicePopup from '@/components/InvoicePopup'; // Import the popup component
import Checkout from "@/components/Checkout";
import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Cookies from 'js-cookie';
import config from "@/lib/config";
import POSInput from "@/components/POSInput";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Avatar from "@/components/cart/Avatar";
import {
  clearCart,
  setDiscount,
  setDiscountType,
  setDiscountAmount,
  calculateTotalPrice,
  setLoyaltyPoints
} from "@/lib/slices/cartSlice";
import { setSelectedCustomer } from '@/lib/slices/customersSlice';
import { addOrderToDB } from '@/lib/slices/ordersSlice';
import { toast } from 'react-toastify';
import { setLoading, setProgress, setMessage } from '@/lib/slices/loadingSlice';
import { useRouter } from 'next/navigation';
import { addOfflineOrderToindexDB, getOutlet } from '@/lib/db';
import { fetchOrders } from '@/lib/slices/ordersSlice';
import { addOfflineOrderToDB, fetchOfflineOrders, setSelectedItem } from '@/lib/slices/offlineOrdersSlice';

import LoyaltyManagement from '@/components/LoyaltyManagement';
import { setLoyaltyPayment } from '@/lib/slices/checkoutSlice';


export default function Home() {
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);
  const { subTotal, loyaltyPoints, totalAmount, totalAmountWithLoyalty } = useSelector((state) => state.cart);
  const isOnline = useSelector((state)=>state.online.isOnline);
  const selectedCustomer = useSelector(
    (state) => state.customers?.selectedCustomer
  );
  const taxRates = useSelector((state) => state.taxes?.rates);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [outletDetails, setOutletDetails] = useState(null);
  const dispatch = useDispatch();
  const {discount, discountType, discountAmount} = useSelector((state) => state.cart);
  const { change, cashPayment, cardPayment, loyaltyPayment, tendered } = useSelector((state)=>state.checkout) 
  const item = useSelector((state) => state.refund.item);


  useEffect(()=>{
    dispatch(setDiscountType(discountType));
    dispatch(setDiscount(discountAmount));
  },[subTotal, discountType, discountAmount, dispatch])




  const handleOnClose = () =>{
    setIsPopupOpen(false);
    router.push('/')
    dispatch(fetchOrders(dispatch));
    dispatch(fetchOfflineOrders(dispatch));
  }

  useEffect(()=>{
     console.log("use effect item",item)
  },[item])



  // Fetch outlet details and invoice data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const outlet_id = Cookies.get('outlet_id');
        const getoutletDetails = await getOutlet(outlet_id);
        setOutletDetails(getoutletDetails);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    dispatch(calculateTotalPrice());
  }, [taxRates, cartItems, discountType, dispatch]);

  const handleCheckout = async () => {
    
    try {
      const orderProducts = cartItems.map(item => ({
        key: item.id,
        id: item.product_id || item.id, // Use `product_id` if available, otherwise `id`
        sku: item.sku || "", 
      //  slug: item.slug || "", 
        categories: item.categories || [], 
      //  image: item.image || "", 
        product_id: item.product_id || item.id, 
        parent: item.parent || 0, 
        name: item.title, 
        quantity: item.quantity,
        price: item.sale_price || item.regular_price || 0, // Use `sale_price` if available, otherwise `regular_price`
      //  onsale: item.onsale || false,
      //  originalTax: item.originalTax || 0, 
      //  tax: item.tax || 0, 
        total: (item.sale_price || item.regular_price || 0) * item.quantity, // Calculate total
        uf: item.sale_price || item.regular_price || 0,
     //   weight: item.weight || 0, 
     //   length: item.length || 0, 
     //   width: item.width || 0, 
    //    height: item.height || 0, 
     //   boughtWeight: 0, 
        uf_total: (item.sale_price || item.regular_price || 0) * item.quantity,
        custom: item.product_id ? false : true, // If `product_id` is not available, mark as custom
        type: item.type || "custom", 
        attributes: item.attributes || {},
        variant: item.variantOptions
      }));
      
      const uniqueId = Date.now();
      const getCurrentDate = () => {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US', {
          weekday: 'short', // "Tue"
          year: 'numeric',  // "2024"
          month: 'short',   // "Aug"
          day: 'numeric',   // "27"
        });
        return formattedDate;
      };
      
      // Example usage
      const orderDate = getCurrentDate();


      let payment_methods = [];

      if (cashPayment != 0 || change != 0) {
          payment_methods.push({
              amount: cashPayment,
              name: "Cash",
              slug: 'cash',
              active: 1
          });
      }
      
      if (cardPayment != 0) {
          payment_methods.push({
              amount: cardPayment,
              name: "Card",
              slug: 'card',
              active: 1
          });
      }      
      
    if (loyaltyPayment != 0) {
          payment_methods.push({
              amount: loyaltyPayment,
              name: "Loyalty",
              slug: 'loyalty',
              active: 1
          });
      }


      const orderDetails = {
        id: uniqueId,
        offline_id: uniqueId,
        order_id: uniqueId,
        order_subtotal: subTotal,
        coupons: [],
        order_date: orderDate,
        discount: {
          amount: discountAmount,
          type: discountType,  //fixed
       //   tax: 1.0909090909090917
        },
        discountedAmount: discount? discount: 0,
        earnedLoyalty: loyaltyPoints? loyaltyPoints: 0,
        order_status_label: "Completed",
        order_currency: "CAD",
        order_currency_symbol: "$",
      //  order_total: totalAmount,
        order_total: totalAmountWithLoyalty,
        order_refunded: 0,
        order_note: "",
        products: orderProducts,
      //  payment_method: "cash",
     //   payment_title: "Cash",
        payment_method: "split",
        payment_title: "Split",
        payment_methods: payment_methods,
        tendered: tendered,
     //   order_type: "offline",
        customer_id: selectedCustomer.id,
        email: selectedCustomer.email,
        change: change,
        // billing: {
        //   first_name: "Customer",
        //   last_name: "",
        //   company: "",
        //   address_1: "3944 Camel Back Road",
        //   address_2: "",
        //   city: "Tulsa",
        //   state: "OK",
        //   postcode: "74145",
        //   country: "",
        //   email: "customer@email.com",
        //   phone: "9876543210"
        // },
        // shipping: {
        //   first_name: "Customer",
        //   last_name: "",
        //   company: "",
        //   address_1: "3944 Camel Back Road",
        //   address_2: "",
        //   city: "Tulsa",
        //   state: "OK",
        //   postcode: "74145",
        //   country: ""
        // },
        // tax_lines: [
        //   {
        //     id: 1,
        //     rate: 10,
        //     shipping: "yes",
        //     label: "Tax",
        //     compound: "no"
        //   }
        // ],
        // table: {}
      };
      

       console.log('orderDetails',orderDetails);


      

      dispatch(setLoading(true))
      dispatch(setMessage("Order is processing..."))
      dispatch(setProgress(''))

      const cashier_id = Cookies.get('user_id');
      const outlet_id = Cookies.get('outlet_id');


      if(isOnline){

        const offlineOrdersString = JSON.stringify([orderDetails]);
        const response = await axios.post(
          `${config.apiBaseUrl}/create-order`,
          {
            cashier_id: cashier_id,
            offline_orders: offlineOrdersString,
            outlet_id: outlet_id,
          }, // The post data body, if any
          {
            withCredentials: true,
          }
        );
  
      const orderDetailsFromDb = response.data[0];
      dispatch(addOrderToDB(orderDetailsFromDb));
      setInvoiceData(orderDetailsFromDb);
    }else{

      const orderDetailsWithLoyalty = {
        ...orderDetails, 
        earned_loyalty: loyaltyPoints
      }

      dispatch(addOfflineOrderToDB(orderDetailsWithLoyalty));
      const result = await dispatch(setSelectedItem(orderDetailsWithLoyalty));
      if (result.meta.requestStatus === "fulfilled") {
        setInvoiceData(result.payload);
       }

      
    }

    dispatch(setLoading(false))
    toast.success('Order has been created successfully');
    // console.log('online order details', orderDetailsFromDb);

      
      setIsPopupOpen(true); // Open the popup when the order is successful
      handleClearCart();
      dispatch(setLoyaltyPoints(0));
    //  dispatch(setDiscountType('fixed'));
      dispatch(setDiscountAmount(0));
      dispatch(setSelectedCustomer([]));
      dispatch(setLoyaltyPayment(0))

    } catch (error) {
      console.error("Error placing order:", error);
      dispatch(setLoading(false))
      toast.error('Failed to place order, please try again')
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };


  return (
    <div>
      <Header
        searchField={false}
        // Pass the function to handle search
      />
      <main>
        <div className="flex">
          <Navbar />
 
              <InvoicePopup
                isOpen={isPopupOpen}
                onClose={handleOnClose}
                invoiceData={invoiceData}
                outletDetails={outletDetails}
              />


          <div className="w-full mx-auto px-2">
            <div className="page_content">
              <div className="grid grid-cols-7 gap-2">
                <div className="col-span-4">
                  <Checkout handleCheckout={handleCheckout} />
                </div>
                <div className="col-span-3">
                  <LoyaltyManagement />
                  <POSInput totalAmount={parseFloat(totalAmount || 0.00).toFixed(2)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
