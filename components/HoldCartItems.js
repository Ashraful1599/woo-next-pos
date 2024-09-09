import React, { useEffect, useState, Suspense, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHoldCartItems,
  retrieveCart,
  deleteCart,
} from "@/lib/slices/holdCartSlice";
import { setHoldCartItems } from "@/lib/slices/cartSlice";
import { deleteHeldCart } from "@/lib/db";
import { useRouter, useSearchParams } from "next/navigation";

export default function HoldCartItems() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { holdCartItems } = useSelector((state) => state.holdCart);
  const { heldCart } = useSelector((state) => state.holdCart);
  const [holdCarts, setHoldCarts] = useState([]);

  useEffect(() => {
    dispatch(fetchHoldCartItems());
  }, [dispatch]);

  useEffect(() => {
    if (heldCart && Object.keys(heldCart).length > 0) {
      // console.log('heldCart', heldCart);
      dispatch(setHoldCartItems(heldCart));
    }
  }, [heldCart, dispatch]);

  useEffect(() => {
    setHoldCarts(holdCartItems);
  }, [holdCartItems]);

  const handleRetrieveCart = async (heldCartId) => {
    if (heldCartId) {
      const result = await dispatch(retrieveCart(heldCartId));
      if (result.meta.requestStatus === "fulfilled") {
        router.push("/");
      }
    }
  };

  const handleDeleteCart = async (cartId) => {
    await deleteHeldCart(cartId);
    setHoldCarts((prevCarts) => prevCarts.filter((cart) => cart.id !== cartId));
  };

  return (
    <div className="grid grid-cols-3 gap-2 overflow-auto p-4 holdcartscreen">
      <style>
        {`
          .searchbar {
            opacity:0;
            visibility: invisible;
          }
        `}
      </style>
      {holdCarts.length > 0 ? (
        holdCarts.map((cart, index) => (
          <div key={index} className="cart-item bg-white shadow-md rounded p-4">
            <h3 className="text-2xl">Cart #{cart.id}</h3>
            <p>{new Date(cart.date).toLocaleString()}</p>
            <p>{cart.customerEmail? cart.customerEmail : ""}</p>
            <div className="bg-gray-100 p-4 rounded mt-4 mb-4">
                <p>Note:</p>
                <p>{cart.holdCartNote}</p>
            </div>
            {cart.items?.map((item, index) => (
                        <p key={index} className="flex justify-between items-center">
                            <span>{item.title}</span>
                          <span className="text-sm text-gray-500 block">${Number(item.sale_price).toFixed(2)} (x{item.quantity})</span>          
                        </p>
            ))}
            <div className="flex gap-4 justify-between mt-4">
              <button
                onClick={() => handleRetrieveCart(cart.id)}
                className="bg-indigo-500 text-white p-4 rounded hover:bg-indigo-600 w-1/2"
              >
                Add to cart
              </button>
              <button
                onClick={() => handleDeleteCart(cart.id)}
                className="bg-teal-500 hover:bg-teal-600 text-white p-4 rounded w-1/2"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="p-4">No hold carts available.</p>
      )}
    </div>
  );
}
