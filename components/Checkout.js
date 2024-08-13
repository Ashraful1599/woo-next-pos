import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  setDiscount,
  setDiscountType,
  clearCart,
  updateCartItem,
  addItemToCart,
  calculateTotalPrice,
  fetchCartItems  
} from "@/lib/slices/cartSlice";
import { fetchTaxes } from "@/lib/slices/taxSlice";
import axios from "axios";
import config from "@/lib/config";
import Avatar from "./cart/Avatar";
import {
  FaCartPlus,
  FaPlus,
  FaPlusCircle,
  FaTrash,
  FaBarcode,
  FaTimesCircle,
} from "react-icons/fa";
import Link from "next/link";
import ToggleSwitch from "./elements/ToggleSwitch";


const Checkout = ({ placeOrder, customer }) => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const discountType = useSelector((state) => state.cart.discountType);
  const totalAmount  = useSelector((state) => state.cart.totalAmount );
  const discount = useSelector((state) => state.cart.discount);
  const taxRates = useSelector((state) => state.taxes?.rates);
  const { change, cashPayment, cardPayment, tendered } = useSelector((state)=>state.checkout) 
  const selectedCustomer = useSelector(
    (state) => state.customers?.selectedCustomer
  );

  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [taxAmounts, setTaxAmounts] = useState([]);

  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  useEffect(() => {
    dispatch(fetchCartItems());
    dispatch(fetchTaxes());
  }, [dispatch]);

  useEffect(() => {
    const calculateLoyaltyPoints = (items) => {
      let totalLoyaltyPoints = 0;
      items.forEach((item) => {
        const loyaltyCategory = item.categories?.find(
          (category) => category.slug === "loyalty3"
        );
        if (loyaltyCategory) {
          totalLoyaltyPoints += Number(item.price) * 0.03 * item.quantity;
        }
      });
      return totalLoyaltyPoints;
    };
    const points = calculateLoyaltyPoints(cartItems);
    setLoyaltyPoints(points);
  }, [cartItems]);

  const handleApplyDiscount = (discountType) => {
    setAppliedDiscount(discountAmount);
    dispatch(setDiscount(discountAmount));
    dispatch(setDiscountType(discountType));
  };

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  // const calculateSubTotalPrice = () => {
  //   return cartItems.reduce(
  //     (sum, item) => sum + Number(item.price) * item.quantity,
  //     0
  //   );
  // };

  const calculateSubTotalPrice = useCallback(() => {
    // Function logic here, for example:
    return cartItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );
  }, [cartItems]);


  // const calculateTaxAmounts = () => {
  //   const subTotalPrice = calculateSubTotalPrice();
  //   const calculatedTaxAmounts = taxRates.map((tax) => ({
  //     ...tax,
  //     amount: ((subTotalPrice * tax.rate) / 100).toFixed(2),
  //   }));
  //   setTaxAmounts(calculatedTaxAmounts);
  // };
  const calculateTaxAmounts = useCallback(() => {
    const subTotalPrice = calculateSubTotalPrice();
    const calculatedTaxAmounts = taxRates.map((tax) => ({
      ...tax,
      amount: ((subTotalPrice * tax.rate) / 100).toFixed(2),
    }));
    setTaxAmounts(calculatedTaxAmounts);
  }, [calculateSubTotalPrice, taxRates]);


  useEffect(() => {
    if (taxRates && taxRates.length > 0) {
      calculateTaxAmounts();
    }
  }, [taxRates, cartItems, calculateTaxAmounts]);




  useEffect(() => {
    const subTotalPrice = calculateSubTotalPrice();
    dispatch(calculateTotalPrice({ subTotalPrice, taxAmounts }));
  }, [cartItems, taxAmounts, dispatch, calculateSubTotalPrice]);



  const handleCheckout = async () => {
    const order = {
      customer_id: customer,
      line_items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      discount_total: discount,
      meta_data: [{ key: "loyalty_points", value: loyaltyPoints }],
    };

    try {
      const response = await axios.post(`${config.apiBaseUrl}/orders`, order, {
        auth: config.auth,
      });
      alert("Order placed successfully");
      handleClearCart();
      setDiscount(0);
      setLoyaltyPoints(0);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order, please try again");
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

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

  const handleAddNewProduct = () => {
    if (productName && productPrice) {
      dispatch(addItemToCart({ id: Date.now().toString(36), name: productName, price: Number(productPrice) }));
      togglePopup();
      setProductName('');
      setProductPrice('');
    }
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="bg-white p-4 rounded shadow-lg col-span-2 flex flex-col ">

      <ul className="mt-4 border-t pt-4 cart_items flex flex-col flex-1 overflow-y-auto gap-2">
        {cartItems.map((item) => (
          <li
            key={`${item.id}-${item.variantOptions || ""}`}
            className="relative"
          >
            <div
              className="flex justify-between items-center cart_item_name"
              onClick={() => handleToggleItem(item.id)}
              aria-expanded={toggledItemId === item.id}
            >
              <span>
                {item.name} - ${Number(item.price).toFixed(2)} (x{item.quantity})
                {item.variantOptions && (
                  <div className="text-sm text-gray-500">
                    {item.variantOptions}
                  </div>
                )}
              </span>
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
                  defaultValue={item.price}
                  onKeyDown={(e) => handleKeyDown(e, item, "price")}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex-none">
        <div className="mt-4 border-t pt-4">


          <div className="flex justify-between items-center pt-4">
            <span>Sub Total</span>
            <span>${calculateSubTotalPrice().toFixed(2)}</span>
          </div>
          {taxAmounts.map((tax) => (
            <div key={tax.id} className="flex justify-between items-center">
              <span>{tax.name}</span>
              <span>${tax.amount}</span>
            </div>
          ))}
          <div className="flex justify-between items-center">
            <span>Discount</span>
            <span>-${discountType == "fixed" ?  parseFloat(discount || 0).toFixed(2) : discount + "%"}</span>
          </div>
          <div className="flex justify-between items-center font-bold">
            <span>Total</span>
            <span>${parseFloat(totalAmount || 0).toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center font-boldr">
            <span>Pay by cash</span>
            <span>{parseFloat(cashPayment || 0).toFixed(2)}</span>
          </div>        
          <div className="flex justify-between items-center font-boldr">
            <span>Pay by card</span>
            <span> {parseFloat(cardPayment || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center font-boldr">
            <span>Tendered</span>
            <span> {parseFloat(tendered || 0).toFixed(2)}</span>
          </div>          
          <div className="flex justify-between items-center font-bold">
            <span>Change</span>
            <span> {parseFloat(change || 0).toFixed(2)}</span>
          </div>

        </div>

      </div>
   
    </div>
  );
};

export default Checkout;
