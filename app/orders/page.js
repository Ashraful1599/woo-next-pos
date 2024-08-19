// pages/orders.js
'use client';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHoldCartItems } from '@/lib/slices/cartSlice';
import OrderList from "@/components/OrderList";
import Cart from "@/components/Cart";
import { fetchAndSaveProducts, fetchAndSaveCategories } from "@/lib/dataService";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { getCarts } from '@/lib/db';
import { fetchHoldCartItems, retrieveCart, deleteCart } from '@/lib/slices/holdCartSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import { deleteHeldCart } from '@/lib/db';
import { fetchOrders } from '@/lib/slices/ordersSlice';

// Split Orders component
function OrdersComponent() {
  const dispatch = useDispatch();
  const { loading, progress, message } = useSelector((state) => state.loading);
  const { holdCartItems } = useSelector((state) => state.holdCart);
  const { heldCart } = useSelector((state) => state.holdCart);
  const cartItems = useSelector((state) => state.cart.items);
  const [products, setProducts] = useState([]);
  const [holdCarts, setHoldCarts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items } = useSelector((state) => state.orders);


  useEffect(() => {
    setProducts(items);
  }, [items]);

  useEffect(() => {
    dispatch(fetchHoldCartItems());
  }, [dispatch]);

  useEffect(() => {
    if (heldCart && Object.keys(heldCart).length > 0) {
        console.log('heldCart', heldCart);
        dispatch(setHoldCartItems(heldCart));
    }
}, [heldCart, dispatch]);

  useEffect(() => {
    setHoldCarts(holdCartItems);
  }, [holdCartItems]);

  useEffect(() => {
    dispatch(fetchOrders(dispatch));
  }, [dispatch]);



  const handlePageClick = (event) => {
    //console.log(event.selected)
    setCurrentPage(event.selected);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };
  console.log('currentPage',currentPage);
  const offset = currentPage * itemsPerPage;
  const currentPageItems = products?.slice(offset, offset + itemsPerPage);

  console.log('products',products);
  console.log('currentPageItems', currentPageItems);

  const handleSearch = useCallback(() => {
    setCurrentPage(0); // Reset to first page
  }, []);

  useEffect(() => {
    if (!loading) {
      toast.dismiss();
    }
  }, [loading]);

  const handleRetrieveCart = async (heldCartId) => {
    if (heldCartId) {
      const result = await dispatch(retrieveCart(heldCartId));
      if (result.meta.requestStatus === 'fulfilled') {
        router.push('/');
      }
    }
  };

  const handleDeleteCart = async (cartId) => {
    await deleteHeldCart(cartId);
    setHoldCarts((prevCarts) => prevCarts.filter(cart => cart.id !== cartId));
  };

  const [activeTab, setActiveTab] = useState('sales-history');
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabs = [
    { name: 'Sales History', value: 'sales-history' },
    { name: 'Hold Sale', value: 'hold-sale' },
    { name: 'Offline Sale/Orders', value: 'offline-sale-orders' },
  ];

  const handleTabClick = (tabValue) => {
    setActiveTab(tabValue);
    const url = new URL(window.location);
    url.searchParams.set('tab', tabValue);
    router.push(url.toString(), { shallow: true });
  };

  return (
    <div>
      <Header 
        searchField={false}
        products={products}
        setProducts={setProducts}
        onSearch={handleSearch}
      />
         <main>
        <div className="flex">
          <Navbar />
          <div className="w-full mx-auto px-2">
            <div className="page_content">
              <div className="flex flex-col">
                <div className="flex space-x-4 mb-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => handleTabClick(tab.value)}
                      className={`py-2 px-4 rounded-md focus:outline-none transition ${
                        activeTab === tab.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>

                <div className="border p-4 rounded-md">
                  {activeTab === 'sales-history' && (
                    <div>
                      <div className="grid grid-cols-7 gap-2">
                        {loading && <Loading />}
                        <div className='bg-white p-4 rounded shadow-lg col-span-7 products_list_wrap orders_list_wrap'>
                          <OrderList products={currentPageItems} />
                          <ReactPaginate
                            key={products?.length}
                            previousLabel={"<"}
                            nextLabel={">"}
                            breakLabel={"..."}
                            pageCount={Math.ceil(products?.length / itemsPerPage)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakClassName={"page-item"}
                            breakLinkClassName={"page-link"}
                            activeClassName={"active"}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'hold-sale' && (
                    <div className='space-y-2 grid grid-cols-3 gap-2 overflow-auto'>
                      {holdCarts.length > 0 ? (
                        holdCarts.map((cart, index) => (
                          <div key={index} className="cart-item bg-gray-50 p-4">
                            {cart.items?.map((item, index) => (
                              <p key={index}>{item.name}</p>
                            ))}
                            <div className='flex justify-between'>
                              <button onClick={() => handleRetrieveCart(cart.id)} className='bg-blue-500 text-white px-2 py-1 rounded'>
                                Add to cart
                              </button>
                              <button onClick={() => handleDeleteCart(cart.id)} className='bg-blue-500 text-white px-2 py-1 rounded'>
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No carts available.</p>
                      )}
                    </div>
                  )}
                  {activeTab === 'offline-sale-orders' && <div>Your Offline Sale/Orders Content</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Suspense Wrapper Component and Export
export default function Orders() {
  return (
    <Suspense fallback={<Loading />}>
      <OrdersComponent />
    </Suspense>
  );
}

