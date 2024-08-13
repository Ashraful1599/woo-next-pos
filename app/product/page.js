"use client";
import Image from "next/image";
import getAllProducts from "@/lib/products";
import Link from "next/link";
import React, { useState, useEffect } from 'react';

export default function Product() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchaProduct = async () => {
      const allproduct = await getAllProducts();
      setProducts(allproduct);
    };

    fetchaProduct();
  }, []); // Add an empty dependency array to run the effect only once

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <ul>
        {
          products.length > 0 ? products.map((product) => (
            <li key={product.id}>
              <Link href={"product/" + product.id.toString()}>{product.name}</Link>
            </li>
          )) : <li>Loading...</li> // Optionally, provide a loading state
        }
      </ul>
    </main>
  );
}
