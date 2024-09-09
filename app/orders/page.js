// pages/orders.js
"use client";

import React, { useEffect, useState, Suspense, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import OrderList from "@/components/OrderList";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import ReactPaginate from "react-paginate";
import { fetchOrders } from "@/lib/slices/ordersSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { setOrders } from "@/lib/slices/ordersSlice";
import HoldCartItems from "@/components/HoldCartItems";
import OfflineOrders from "@/components/OfflineOrders";
import { toast } from "react-toastify";

// Split Orders component
function OrdersComponent() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items } = useSelector((state) => state.orders);
  const {loading} = useSelector((state)=>state.loading)

  // useEffect(() => {
  //   if (!loading) {
  //     toast.dismiss();
  //   }
  // }, [loading]);

  useEffect(() => {
    dispatch(fetchOrders(dispatch));
  }, [dispatch]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // console.log('currentPage',currentPage);
  const offset = currentPage * itemsPerPage;
  const currentPageItems = items?.slice(offset, offset + itemsPerPage);

  const handleSearch = useCallback(() => {
    setCurrentPage(0); // Reset to first page
  }, []);



  const [activeTab, setActiveTab] = useState("sales-history");
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabs = [
    { name: "Sales History", value: "sales-history" },
    { name: "Hold Sale", value: "hold-sale" },
    { name: "Offline Sale/Orders", value: "offline-sale-orders" },
  ];

  const handleTabClick = (tabValue) => {
    setActiveTab(tabValue);
    const url = new URL(window.location);
    url.searchParams.set("tab", tabValue);
    router.push(url.toString(), { shallow: true });
  };

  return (
    <div>
      <Header
        searchField={true}
        items={items}
        setItems={setOrders}
        onSearch={handleSearch} // Pass the function to handle search
        searchType="order"
      />
      <main>
        <div className="flex">
          <Navbar />
          <div className="w-full mx-auto px-2">
            <div className="page_content">
              <div className="flex flex-col">
                <div className="flex space-x-4 mb-4 pt-1 ps-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => handleTabClick(tab.value)}
                      className={`py-2 px-4 rounded-md focus:outline-none transition ${
                        activeTab === tab.value
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>

                <div className="border p-4r rounded-md">
                  {activeTab === "sales-history" && (
                    <div>
                      <div className="grid grid-cols-7 gap-2 order_tab_sales_history">
                        {/* {loading && <Loading />} */}
                        <div className="bg-white p-4 rounded shadow-lg col-span-7 products_list_wrap orders_list_wrap">
                          {currentPageItems.length > 0 ? (
                            <OrderList orders={currentPageItems} />
                          ) : (
                            ""
                          )}
                          <ReactPaginate
                            key={items?.length}
                            previousLabel={"<"}
                            nextLabel={">"}
                            breakLabel={"..."}
                            pageCount={Math.ceil(items?.length / itemsPerPage)}
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
                  {activeTab === "hold-sale" && <HoldCartItems />}
                  {activeTab === "offline-sale-orders" &&  <OfflineOrders/>}
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
