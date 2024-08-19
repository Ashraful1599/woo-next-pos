"use client";
import InvoicePopup from '@/components/InvoicePopup'; // Import the popup component
import ProductList from "@/components/ProductList";
import CustomerSelection from "@/components/CustomerSelection";
import Cart from "@/components/Cart";
import Checkout from "@/components/Checkout";
import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import ResetButton from "@/components/ResetButton";
import { useSelector, useDispatch } from "react-redux";
import db from "@/lib/db";
import Link from "next/link";

import {
  fetchAndSaveProducts,
  fetchAndSaveCustomers,
  fetchAndSaveCategories,
  fetchAndSaveTaxes,
  fetchAndSaveData,
} from "@/lib/dataService";
import Loading from "@/components/Loading";
import config from "@/lib/config";
import POSInput from "@/components/POSInput";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Avatar from "@/components/cart/Avatar";
import {
  fetchCartItems,
  addItemToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  setDiscount,
  setDiscountType,
  calculateTotalPrice,
  setLoyaltyPoints,
} from "@/lib/slices/cartSlice";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { addOrderToDB } from '@/lib/slices/ordersSlice';

export default function Home() {
  const cartItems = useSelector((state) => state.cart.items);
  const cdiscount = useSelector((state) => state.cart.discount);
  const [discount, setDiscountState] = useState(0);
  const { loyaltyPoints, totalAmount } = useSelector((state) => state.cart);
  const [products, setProducts] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const selectedCustomer = useSelector(
    (state) => state.customers?.selectedCustomer
  );
  const taxRates = useSelector((state) => state.taxes?.rates);
  const discountType = useSelector((state) => state.cart.discountType);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [taxAmounts, setTaxAmounts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const dispatch = useDispatch();

  const fetchProductsInBatches = async () => {
    const totalProducts = 70; // Total number of products to fetch
    const batchSize = 20; // Number of products to fetch per batch

    let allProducts = [];
    let page = 1;

    while (allProducts.length < totalProducts) {
      try {
        const response = await axios.get(`${config.apiBaseUrlV1}/products`, {
          params: {
            per_page: batchSize,
            page: page,
          },
          auth: config.auth,
        });

        allProducts = [...allProducts, ...response.data];
        setProducts(allProducts);

        setProgress(Math.min((allProducts.length / totalProducts) * 100, 100));
        page++;
        setLoading(true);
        // Break the loop if there are no more products to fetch
        if (response.data.length === 0) {
          break;
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        break; // Stop the loop on error to avoid infinite calls
      }
    }

    setLoading(false);
  };

  const loadInitialDataFromDB = async () => {
    const storedProducts = await db.products.toArray();
    if (storedProducts.length > 0) {
      setProducts(storedProducts);
    } else {
      // Fetch from WooCommerce as a fallback if not in IndexedDB
      setLoading(true);
      await fetchAndSaveProducts(setProducts, setProgress, setLoading);
      const newProducts = await db.products.toArray();
      setLoading(false);
      setProducts(newProducts);
    }

    const storedCustomers = await db.customers.toArray();
    const storedCategories = await db.categories.toArray();
    // Store loaded data to component's states if necessary
    // similar to ProductList component's strategy
  };

  useEffect(() => {
    loadInitialDataFromDB(); // Load data initially from IndexedDB
  }, []);
  const calculateSubTotalPrice = useMemo(() => {
    return cartItems?.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  }, [cartItems]);

  useEffect(() => {
    const subTotalPrice = calculateSubTotalPrice;
    const calculatedTaxAmounts = taxRates.map((tax) => ({
      ...tax,
      amount: ((subTotalPrice * tax.rate) / 100).toFixed(2),
    }));
    setTaxAmounts(calculatedTaxAmounts);
    dispatch(calculateTotalPrice({ subTotalPrice: subTotalPrice, taxAmounts: calculatedTaxAmounts }));
  }, [taxRates, cartItems, calculateSubTotalPrice, discountType, discountAmount, appliedDiscount, dispatch]);



  const handleCheckout = async () => {
    // const order = {
    //   customer_id: customer,
    //   line_items: cartItems.map((item) => ({
    //     product_id: item.id,
    //     quantity: item.quantity,
    //   })),
    //   discount_total: discount,
    //   meta_data: [{ key: "loyalty_points", value: loyaltyPoints }],
    // };

    
    try {


      const order = {
        customer_id: selectedCustomer.id,
        billing: {
            first_name: selectedCustomer.first_name,
            last_name: selectedCustomer.last_name,
        },
        line_items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
       //   subtotal: item.quantity*item.price,
      //    total: item.quantity*item.price-10,
        })),
        discount_total: 10,
        meta_data: [{ key: "loyalty_points", value: loyaltyPoints }],
      };

      const response = await axios.post(`${config.apiBaseUrl}/orders`, order, {
        auth: config.auth,
      });

   // Assuming 'response' contains order details
   const { id, date, tax_lines,line_items, total, billing } = response.data;

    dispatch(addOrderToDB(response.data));


   console.log(response);

   // Generate invoice data
   const generatedInvoiceData = {
     orderId: id || 'DefaultOrderId',
     billing: billing,
     date: date || new Date().toLocaleDateString(),
     items: line_items,
     subTotal: '0.00',
     tax: tax_lines,
     total: total || '0.00',
   };

      setInvoiceData(generatedInvoiceData);
      setIsPopupOpen(true); // Open the popup when the order is successful


      handleClearCart();
      setDiscountState(0);
      dispatch(setLoyaltyPoints(0));


    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order, please try again");
    }
  };






  const handleDiscountTypeChange = (e) => {
    dispatch(setDiscountType(e.target.value));
  };

  const handleDiscountChange = (e) => {
    dispatch(setDiscount(e.target.value));
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
                onClose={() => setIsPopupOpen(false)}
                invoiceData={invoiceData}
              />


          <div className="w-full mx-auto px-2">
            <div className="page_content">
              <div className="grid grid-cols-7 gap-2">
                <div className="col-span-4">
                  <Checkout />
                  <button
                    className="w-full py-2 mt-2 bg-blue-500 text-white rounded-md"
                    onClick={handleCheckout}
                  >
                    Place Order
                  </button>
                </div>

                <div className="col-span-3">
                  <div className="cart_header flex items-center flex-none">
                    <div className="selected_customer grow">
                      <Link href={"/customers"} className=" flex items-center gap-2">
                        <Avatar size="50px" /> {/* You can adjust the size as needed */}
                        <div>
                          {selectedCustomer.length < 1 ? (
                            <div>Select customer</div>
                          ) : (
                            <>
                              <div>
                                {selectedCustomer.first_name} {selectedCustomer.last_name}
                              </div>
                              <div className="text-ellipsis text-sm">
                                {selectedCustomer.email}
                              </div>
                            </>
                          )}
                        </div>
                      </Link>
                    </div>

                    <div className="payable_amount">
                      <h2 className="text-2xl">Payable amount</h2>
                      <p className="text-2xl font-bold">${parseFloat(totalAmount || 0.00).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-4 mb-4 text-center">
                    <span className="">Customer will get {loyaltyPoints.toFixed(2)} loyalty points on this purchase.</span>
                  </div>

                  {/* <div>
                    <label>
                      Discount Type:
                      <select value={cart.discountType} onChange={handleDiscountTypeChange}>
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </label>
                    <label>
                      Discount:
                      <input
                        type="number"
                        value={cart.discount}
                        onChange={handleDiscountChange}
                      />
                    </label>
                  </div> */}

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
