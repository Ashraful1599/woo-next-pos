import React, { useEffect, useState, Suspense, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import OrderList from "@/components/OrderList";
import OfflineOrdersList from "@/components/OfflineOrdersList";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import ReactPaginate from "react-paginate";
import { fetchOfflineOrders } from "@/lib/slices/offlineOrdersSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { setOrders } from "@/lib/slices/ordersSlice";
import HoldCartItems from "@/components/HoldCartItems";




export default function OfflineOrders() {


  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageItems, setCurrentPageItems] = useState([]);
  const itemsPerPage = 12;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items } = useSelector((state) => state.offlineOrders);

  useEffect(() => {
    dispatch(fetchOfflineOrders(dispatch));
  }, [dispatch]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
 
  useEffect(()=>{
  // console.log('currentPage items',items);
  const offset = currentPage * itemsPerPage;
  setCurrentPageItems((items?.slice(offset, offset + itemsPerPage)));
  },[items, currentPage])


//console.log('currentPageItems',items);
//console.log('currentPageItems',currentPageItems);


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
    <div className="grid grid-cols-7 gap-2 order_tab_sales_history">
      <div className="bg-white p-4 rounded shadow-lg col-span-7 products_list_wrap orders_list_wrap">
        {currentPageItems.length > 0 ? (
          <OfflineOrdersList orders={currentPageItems} />
        ) : (
          "There are no offline orders"
        )}
        {
          currentPageItems.length > 0 ?(
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
          ): ""
        }

      </div>
    </div>
  </div>
  )
}
