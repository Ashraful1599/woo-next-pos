'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '@/lib/slices/productsSlice';
import ProductList from "@/components/ProductList";
import Cart from "@/components/Cart";
import { fetchAndSaveProducts, fetchAndSaveCategories } from "@/lib/dataService";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';

export default function Home() {
  const dispatch = useDispatch();
  const { loading, progress, message } = useSelector((state) => state.loading);
  const { items } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart.items);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Define the number of items per page


  useEffect(() => {
    setProducts(items);
  }, [items]);

  useEffect(() => {
    dispatch(fetchProducts(dispatch));
  }, [dispatch]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const offset = currentPage * itemsPerPage;
  const currentPageItems = products.slice(offset, offset + itemsPerPage);

  const handleSearch = () => {
    setCurrentPage(0); // Reset to first page
  };

  useEffect(()=>{
    console.log(loading)
    if(!loading){
      toast.dismiss();
    }
  }, [loading])

  
  return (
    <div>
      <Header 
        searchField={true}
        products={products}
        setProducts={setProducts}
        onSearch={handleSearch} // Pass the function to handle search
      />
      <main>
        <div className="flex">
          <Navbar />
          <div className="w-full mx-auto px-2">
            <div className="page_content">
              <div className="grid grid-cols-7 gap-2">
                {loading && (
                  <Loading
                  />
                )}
                <div className='bg-white p-4 rounded shadow-lg col-span-5 products_list_wrap'>
                <ProductList products={currentPageItems} />
                <ReactPaginate
                key={products.length} // Add this key prop
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                pageCount={Math.ceil(products.length / itemsPerPage)}
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
  );
}
