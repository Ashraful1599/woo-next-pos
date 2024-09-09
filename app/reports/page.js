'use client';
import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TransactionList from "@/components/TransactionList";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { fetchTransactions } from '@/lib/slices/transactionsSlice';
import { setTransactions } from '@/lib/slices/transactionsSlice';
import ReportsSummary from "@/components/ReportsSummary"; // Import the new ReportsSummary component

function TransactionsComponent() {
  const dispatch = useDispatch();
  const { loading, progress, message } = useSelector((state) => state.loading);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;
  const { items } = useSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions(dispatch));
  }, [dispatch]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
 
  const offset = currentPage * itemsPerPage;
  const currentPageItems = items?.slice(offset, offset + itemsPerPage);

  const handleSearch = useCallback(() => {
    setCurrentPage(0);
  }, []);

  useEffect(() => {
    if (!loading) {
      toast.dismiss();
    }
  }, [loading]);

  return (
    <div>
      <Header 
        searchField={true}
        items={items}
        setItems={setTransactions}
        onSearch={handleSearch}
        searchType='transaction'
      />
      <main>
        <div className="flex">
          <Navbar />
          <div className="w-full mx-auto px-2">
            <div className="page_content">
              <div className="flex flex-col">
                <div className="border p-4 rounded-md">
                  <ReportsSummary reports={items} /> {/* Add ReportsSummary component here */}
                  <div>
                    <div className="grid grid-cols-7 gap-2">
                      <div className='bg-white p-4 rounded shadow-lg col-span-7 transactions_list_wrap'>
                        <TransactionList transactions={currentPageItems} />
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
export default function Transactions() {
  return (
    <Suspense fallback={<Loading />}>
      <TransactionsComponent />
    </Suspense>
  );
}
