'use client'
import CustomerSelection from '@/components/CustomerSelection'
import React from 'react'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import { useDispatch, useSelector } from 'react-redux';
import Cart from "@/components/Cart";
import Loading from "@/components/Loading";
import { fetchCustomers } from '@/lib/slices/customersSlice';
import ReactPaginate from 'react-paginate';


export default function CustomerPage() {
  const { loading, progress, message } = useSelector((state) => state.loading);
  const [customers, setCustomers] = useState([]);
  const { customers: items } = useSelector((state) => state.customers);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Define the number of items per page

  useEffect(() => {
    setCustomers(items);
  }, [items]);


  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchCustomers(dispatch));
  }, [dispatch]);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
 
  const offset = currentPage * itemsPerPage;
  const currentPageItems = customers.slice(offset, offset + itemsPerPage);

  const handleSearch = () => {
    setCurrentPage(0); // Reset to first page
  };

  return (
<>

<div>
      <Header 
               searchField={true}
               products={customers}
               setProducts={setCustomers}
               onSearch={handleSearch} // Pass the function to handle search
               searchCustomers={true}
      />
      <main>
        <div className="flex">
          <Navbar />
          <div className="w-full mx-auto px-2">
            <div className="page_content">
              <div className="grid grid-cols-7 gap-2">
                {loading && (
                  <Loading
                    message={message}
                    progress={progress}
                  />
                )}
                <div className='bg-white p-4 rounded shadow-lg col-span-5 products_list_wrap'>

                <CustomerSelection customers={currentPageItems} />
                <ReactPaginate
                key={customers.length} // Add this key prop
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                pageCount={Math.ceil(customers.length / itemsPerPage)}
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
                
                <Cart />
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>




</>


  )
}

