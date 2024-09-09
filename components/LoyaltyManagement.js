import Link from "next/link";
import Avatar from "./cart/Avatar";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from 'react-icons/fa';
import { setLoyaltyPayment, tenderedHandle } from "@/lib/slices/checkoutSlice";
import { calculateTotalPrice } from "@/lib/slices/cartSlice";

export default function LoyaltyManagement() {
    const selectedCustomer = useSelector((state) => state.customers?.selectedCustomer);
    const { subTotal, loyaltyPoints, totalAmount, totalAmountWithLoyalty } = useSelector((state) => state.cart);
    const [useLoyalty, setUseLoyalty] = useState("");
    const [inputBorder, setInputBorder] = useState("");
    const dispatch = useDispatch();


    // useEffect(()=>{
    //     dispatch(calculateTotalPrice(useLoyalty))
    // },[useLoyalty, dispatch])


    // Allowing manual input change directly
    const handleLoyaltyInput = (event) => {
        setUseLoyalty(event.target.value);
        setInputBorder("");
    }

    // Validate the input when it loses focus
    const handleLoyaltyBlur = () => {
        const value = parseFloat(useLoyalty);
        const maxLoyalty = selectedCustomer.customer_total_loyalty || 0;

        if (isNaN(value) || value < 1) {
            setUseLoyalty("");
            setInputBorder("border-red-500");
        } else if (value > maxLoyalty) {
            setInputBorder("border-red-500");
        } else {
            setUseLoyalty(value.toString());
            setInputBorder("");
        }
    }

    const handleRedeem = () => {
     //   console.log(useLoyalty);
        
        if(useLoyalty > totalAmountWithLoyalty){
            dispatch(setLoyaltyPayment(totalAmountWithLoyalty));
            dispatch(calculateTotalPrice(totalAmountWithLoyalty))
            dispatch(tenderedHandle())
        }else{
            dispatch(setLoyaltyPayment(useLoyalty));
            dispatch(calculateTotalPrice(useLoyalty))
            dispatch(tenderedHandle())
        }
       
        // Redeem logic here
    }

    const handleRedeemClear = () => {
        setUseLoyalty("");
        setInputBorder("");
        dispatch(setLoyaltyPayment(0));
        dispatch(calculateTotalPrice(0))
        dispatch(tenderedHandle())
    }

    const handleBalanceClick = () => {
        setUseLoyalty(Number(selectedCustomer.customer_total_loyalty).toFixed(2));
        setInputBorder("");
    }

   //     console.log(parseFloat(useLoyalty).toFixed(2))
    //    console.log(Number(selectedCustomer.customer_total_loyalty).toFixed(2))

    const isRedeemDisabled = parseFloat(useLoyalty).toFixed(2) > parseFloat(selectedCustomer.customer_total_loyalty).toFixed(2) || useLoyalty === "";

    const inputClassName = `w-full px-2 py-2 rounded-md shadow-sm focus:outline-none bg-white border ${inputBorder} border-gray-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300`;

    return (
        <div>
            <div className="p-3 bg-white">
                <div className="cart_header flex items-center flex-none">
                    <div className="selected_customer grow">
                        <Link href={"/customers"} className=" flex items-center gap-2">
                            <Avatar size="50px" />
                            <div>
                                {!selectedCustomer?.first_name ? (
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
                        <p className="text-2xl font-bold">
                            ${parseFloat(totalAmount || 0.0).toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="mt-4 mb-4 text-center">
                    <span className="font-semibold">
                        Customer will get{" "}
                        <strong className="text-teal-500">
                            {loyaltyPoints.toFixed(2)}
                        </strong>{" "}
                        loyalty point(s) on this purchase.
                    </span>
                </div>

                {Object.keys(selectedCustomer).length > 0 && (
                    <div className="flex flex-col border rounded p-4 gap-4">
                        <div className="flex justify-between gap-4">
                            <div
                                className="bg-gray-100 p-4 w-4/6 rounded font-bold text-xl loyalty_balance cursor-pointer"
                                onClick={handleBalanceClick}
                            >
                                Loyalty Balance:{" "}
                                <span className="text-indigo-600">
                                    {Number(selectedCustomer.customer_total_loyalty).toFixed(2)}
                                </span>
                            </div>
                            <div className="bg-gray-100 p-4 w-2/6 rounded font-bold loyalty_weight">
    
                                Weight: <span className="text-indigo-600">$1.00</span>
                            </div>
                        </div>
                        <div className="flex justify-between gap-4">
                            <div className="w-4/6">
                                <input
                                    type="number"
                                    value={useLoyalty}
                                    placeholder="Enter Loyalty Points"
                                    onChange={handleLoyaltyInput}
                                    onBlur={handleLoyaltyBlur}
                                    className={inputClassName}
                                />
                            </div>
                            <button
                                onClick={handleRedeem}
                                className="w-1/6 text-white rounded flex items-center justify-center font-bold bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                                disabled={isRedeemDisabled}
                            >
                                Redeem
                            </button>
                            <button
                                onClick={handleRedeemClear}
                                disabled={useLoyalty === ""? "disabled": ""}
                                className="w-1/6 bg-teal-500 text-white hover:bg-teal-600 rounded flex items-center justify-center disabled:bg-teal-300 disabled:cursor-not-allowed"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
