'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '@/lib/slices/productsSlice';
import ProductList from "@/components/ProductList";
import Cart from "@/components/Cart";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import ReactPaginate from 'react-paginate';
import db from '@/lib/db';
import { handleReset } from '@/lib/resetData'; // Adjust to the correct path
import { setProducts } from '@/lib/slices/productsSlice';
import CashDrawer from '@/components/CashDrawer';

const HomeClient = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.products);
 // const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12; // Define the number of items per page
  const fetchedRef = useRef(false);  // Use a ref to track if the fetch happened




  useEffect(() => {
    if (!fetchedRef.current) {
    const checkAndReset = async () => {
      const storedProducts = await db.products.toArray();
      if (storedProducts.length === 0) {
        await handleReset(dispatch); // Pass dispatch as a parameter
      }
    };

    checkAndReset();
    fetchedRef.current = true;
    }
  }, [dispatch]);




  useEffect(() => {
      dispatch(fetchProducts())
  }, [dispatch]);

  // useEffect(() => {
  //   // console.log('Setting products from items');
  //   setProducts(items);
  // }, [items]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentPageItems = items.slice(offset, offset + itemsPerPage);

  const handleSearch = useCallback(() => {
    setCurrentPage(0);
  }, []);

 

  return (
    <div className="bg-gray-50">
      <Header
        searchField={true}
        items={items}
        setItems={setProducts}
        onSearch={handleSearch} // Pass the function to handle search
        searchType='product'
      />
      <main>
        <div className="flex">
          <Navbar />
          <div className="w-full mx-auto px-2">
            <div className="page_content">
              <div className="grid grid-cols-7 gap-2">
            
                <div className="bg-white p-4 rounded shadow-sm col-span-5 products_list_wrap">
                  <ProductList products={currentPageItems} />
                  <ReactPaginate
                    key={items.length} // Reset pagination on products change
                    previousLabel={"<"}
                    nextLabel={">"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(items.length / itemsPerPage)}
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

                <CashDrawer />

                <Cart />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomeClient;
