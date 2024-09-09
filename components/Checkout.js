import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  setSubTotal,
  setTaxAmounts,
  updateCartItem,
  calculateTotalPrice,
  fetchCartItems,
  calculateLoyaltyPoints  
} from "@/lib/slices/cartSlice";
import { fetchTaxes } from "@/lib/slices/taxSlice";
import { tenderedHandle } from "@/lib/slices/checkoutSlice";
import {
  FaTimesCircle,
  FaAngleLeft,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

const Checkout = ({ placeOrder, customer, handleCheckout }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);
  const discountType = useSelector((state) => state.cart.discountType);
  const totalAmount  = useSelector((state) => state.cart.totalAmount );
  const totalAmountWithLoyalty  = useSelector((state) => state.cart.totalAmountWithLoyalty );
  const taxAmounts = useSelector((state) => state.cart.taxAmounts);
  const discount = useSelector((state) => state.cart.discount);
  const taxRates = useSelector((state) => state.taxes?.rates);
  const { change, cashPayment, cardPayment, loyaltyPayment, tendered } = useSelector((state)=>state.checkout) 
  const loading = useSelector((state)=>state.loading.loading)

 // const [taxAmounts, setTaxAmounts] = useState([]);
  const subTotal = useSelector((state) => state.cart.subTotal);


  useEffect(()=>{
    dispatch(tenderedHandle());
  },[cashPayment, cardPayment, dispatch])

  useEffect(() => {
    dispatch(fetchCartItems());
    dispatch(fetchTaxes());
  }, [dispatch]);


  // useEffect(() => {
  //   dispatch(calculateLoyaltyPoints(cartItems));
  // }, [cartItems]);



  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  useEffect(() => {
      dispatch(setSubTotal());
      dispatch(calculateLoyaltyPoints());
      dispatch(setTaxAmounts(taxRates));
      dispatch(calculateTotalPrice());
   }, [taxRates, cartItems, discountType, dispatch]);


  const [toggledItemId, setToggledItemId] = useState(null);

  const handleToggleItem = (itemId) => {
    setToggledItemId(toggledItemId === itemId ? null : itemId);
  };

  const handleKeyDown = (e, item, field) => {
    if (e.key === 'Enter') {
      const value = field === 'quantity' ? Number(e.target.value) : parseFloat(e.target.value).toFixed(2);
      dispatch(updateCartItem({id: item.id, updates: { [field]: value }}));
    }
  };

  const handleBack = () => {
    router.back();
  };
 

  return (
    <div className="bg-white p-4 rounded shadow-lg col-span-2 flex flex-col checkout_item_wrap">

    <button
      className="flex items-center text-md bg-teal-500 hover:bg-teal-600 text-white p-1 rounded-md w-24 justify-center"
      onClick={handleBack}
    >
      <FaAngleLeft /> Back
    </button>

      <ul className="mt-4 border-t pt-4 cart_items flex flex-col flex-1 overflow-y-auto gap-2 flex-grow">
        {cartItems.map((item) => (
          <li
            key={`${item.id}-${item.variantOptions || ""}`}
            className="relative"
          >
            <div
              className="flex justify-between items-center cart_item_name gap-3"
              onClick={() => handleToggleItem(item.id)}
              aria-expanded={toggledItemId === item.id}
            >
              <span>
                {item.title} - ${Number(item.sale_price).toFixed(2)} (x{item.quantity})
                {item.variantOptions && (
                  <div className="text-sm text-gray-500 variantoptions">
                    {item.variantOptions}
                  </div>
                )}
              </span>
              <span className="mr-6">${Number(item.sale_price*item.quantity).toFixed(2)}</span>
              <button
                className="text-lg cart_item_remove"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent li onClick from firing
                  handleRemoveFromCart(item.id);
                }}
                aria-label="Remove item"
              >
                <FaTimesCircle />
              </button>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                toggledItemId === item.id ? "max-h-40" : "max-h-0"
              }`}
            >
              <div className="py-2 grid grid-cols-2 gap-2 price_quantity_update">
                <input
                  name="item_quantity"
                  className="col-span-1"
                  placeholder="Enter quantity"
                  defaultValue={item.quantity}
                  onKeyDown={(e) => handleKeyDown(e, item, "quantity")}
                />
                <input
                  name="item_price"
                  className="col-span-1"
                  placeholder="Enter price"
                  defaultValue={item.sale_price}
                  onKeyDown={(e) => handleKeyDown(e, item, "sale_price")}
                />
              </div>
            </div>
          </li>
        ))} 
      </ul>
      <div className="mt-4 flex-none fixedr bottom-0r w-fullr">
        <div className="mt-4 border-t pt-4">


          <div className="flex justify-between items-center pt-4">
            <span>Sub Total</span>
            <span>${subTotal.toFixed(2)}</span>
          </div>
          {taxAmounts.map((tax) => (
            <div key={tax.id} className="flex justify-between items-center">
              <span>{tax.label}</span>
              <span>${tax.amount}</span>
            </div>
          ))}
          <div className="flex justify-between items-center">
            <span>Discount</span>
            <span>-${discountType == "fixed" ?  parseFloat(discount || 0).toFixed(2) : discount}</span>
          </div>
          <div className="flex justify-between items-center font-bold">
            <span>Total</span>
            <span>${parseFloat(totalAmountWithLoyalty || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center font-boldr bg-gray-100r">
            <span>Pay by Loyalty</span>
            <span>${parseFloat(loyaltyPayment || 0).toFixed(2)}</span>
          </div>            
          <div className="flex justify-between items-center font-boldr">
            <span>Pay by cash</span>
            <span>${parseFloat(cashPayment || 0).toFixed(2)}</span>
          </div>        
          <div className="flex justify-between items-center font-boldr">
            <span>Pay by card</span>
            <span> ${parseFloat(cardPayment || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center font-boldr">
            <span>Tendered</span>
            <span> ${parseFloat(tendered || 0).toFixed(2)}</span>
          </div>          
          <div className="flex justify-between items-center font-bold">
            <span>Change</span>
            <span> ${parseFloat(change || 0).toFixed(2)}</span>
          </div>

        </div>

        <button
                    className="w-full py-4 mt-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:text-indigo-100 text-white rounded-md "
                    onClick={handleCheckout} disabled={cartItems.length == 0 || tendered < totalAmount || loading == true ? 'disabled': ''}
                  >
                    Place Order
        </button>


      </div>
   
    </div>
  );
};

export default Checkout;
