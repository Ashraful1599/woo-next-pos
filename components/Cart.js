import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCartItems,
  addItemToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  setDiscount,
  setDiscountType,
  calculateTotalPrice,
  setLoyaltyPoints,
} from "@/lib/slices/cartSlice";
import {holdCart} from '@/lib/slices/holdCartSlice'
import { fetchTaxes } from "@/lib/slices/taxSlice";
import Avatar from "./cart/Avatar";
import { FaPlus, FaTrash, FaBarcode, FaTimesCircle } from "react-icons/fa";
import Link from "next/link";

const Cart = ({ placeOrder, customer }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const discountType = useSelector((state) => state.cart.discountType);
  const discount = useSelector((state) => state.cart.discount);
  const taxRates = useSelector((state) => state.taxes?.rates);
  const selectedCustomer = useSelector((state) => state.customers?.selectedCustomer);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const { loyaltyPoints } = useSelector((state) => state.cart);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [taxAmounts, setTaxAmounts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [toggledItemId, setToggledItemId] = useState(null);
  const cart = useSelector((state) => state.cart);
  const [heldCartId, setHeldCartId] = useState(null);
  const { heldCart } = useSelector((state) => state.holdCart);


  useEffect(() => {
    dispatch(fetchCartItems());
    dispatch(fetchTaxes());
  }, [dispatch]);

  useEffect(() => {
    const calculateLoyaltyPoints = (items) => {
      let totalLoyaltyPoints = 0;
      items.forEach((item) => {
        const loyaltyCategory = item.categories?.find((category) => category.slug === "loyalty3");
        if (loyaltyCategory) {
          totalLoyaltyPoints += Number(item.price) * 0.03 * item.quantity;
        }
      });
      return totalLoyaltyPoints;
    };
    const points = calculateLoyaltyPoints(cartItems);
    dispatch(setLoyaltyPoints(points));
  }, [cartItems, dispatch]);
  const handleKeyDown = (e, item, field) => {
    if (e.key === 'Enter') {
      const value = field === 'quantity' ? Number(e.target.value) : parseFloat(e.target.value).toFixed(2);
      dispatch(updateCartItem({ id: item.id, updates: { [field]: value } }));
    }
  };

  const handleToggleItem = (id) => {
    setToggledItemId(toggledItemId === id ? null : id);
  };

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id ));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleAddNewProduct = () => {
    dispatch(addItemToCart({ name: productName, price: parseFloat(productPrice), quantity: 1 }));
    setProductName('');
    setProductPrice('');
    togglePopup();
  };

  const handleApplyDiscount = (type) => {
    dispatch(setDiscountType(type));
    dispatch(setDiscount(discountAmount));
    setAppliedDiscount(discountAmount);
  };

  const calculateSubTotalPrice = useMemo(() => {
    return cartItems?.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  }, [cartItems]);

  useEffect(() => {
    const subTotalPrice = calculateSubTotalPrice;
    const calculatedTaxAmounts = taxRates.map((tax) => ({
      ...tax,
      amount: ((subTotalPrice * tax.rate) / 100).toFixed(2),
    }));
    setTaxAmounts(calculatedTaxAmounts);
    dispatch(calculateTotalPrice({ subTotalPrice: subTotalPrice, taxAmounts: calculatedTaxAmounts }));
  }, [taxRates, cartItems, calculateSubTotalPrice, discountType, discountAmount, appliedDiscount, dispatch]);


  const handleRemoveFromHoldCart = (productId, variantOptions) => {
    dispatch(removeFromCart({ id: productId, variantOptions }));
  };

  const handleHoldCart = async () => {
    const result = await dispatch(holdCart(cart));
    if (result.meta.requestStatus === 'fulfilled') {
      setHeldCartId(result.payload);
    }
  };

  const handleRetrieveCart = async () => {
    if (heldCartId) {
      await dispatch(retrieveCart(heldCartId));
    }
  };


  return (
    <div className="bg-white p-4 rounded shadow-lg col-span-2 flex flex-col">
      <div className="cart_header flex items-center flex-none">
        <div className="selected_customer grow">
          <Link href="/customers" className="flex items-center gap-2">
            <Avatar size="50px" />
            <div>
              {selectedCustomer.length < 1 ? (
                <div>Select customer</div>
              ) : (
                <>
                  <div>{selectedCustomer.first_name} {selectedCustomer.last_name}</div>
                  <div className="text-ellipsis text-sm">{selectedCustomer.email}</div>
                </>
              )}
            </div>
          </Link>
        </div>
        <div className="add_new_product w-10 cursor-pointer" onClick={togglePopup}>
          <FaPlus />
        </div>
        <div className="clear_cart w-10 cursor-pointer">
          <FaTrash onClick={handleClearCart} />
        </div>
        <div className="enter_barcode w-10 cursor-pointer">
          <FaBarcode />
        </div>
      </div>

      {loyaltyPoints > 0 && (
        <div className="mt-4 text-center">
          <span>Loyalty Points Earned: {loyaltyPoints.toFixed(2)}</span>
        </div>
      )}

      <ul className="mt-4 border-t pt-4 cart_items flex flex-col flex-1 overflow-y-auto gap-2">
        {cartItems?.length > 0 ? cartItems.map((item) => (
          <li key={item.id} className="relative">
            <div
              className="flex justify-between items-center cart_item_name"
              onClick={() => handleToggleItem(item.id)}
              aria-expanded={togglePopup.toggledItemId === item.id}
            >
              <span>
                {item.name} - ${Number(item.price).toFixed(2)} (x{item.quantity})
              </span>

            </div>

            <button
                className="text-lg cart_item_remove"
                onClick={() => handleRemoveFromCart(item.id)}
                aria-label="Remove item"
              >
                <FaTimesCircle />
              </button>

            <div className={`overflow-hidden transition-all duration-300 ${toggledItemId === item.id ? "max-h-40" : "max-h-0"}`}>
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
        )) : (
          <li className="text-center">No items in the cart.</li>
        )}
      </ul>

      <div className="border-t pt-4">
        <div className="discount flex justify-between items-center mb-2">
          <label htmlFor="discount" className="font-bold">Discount</label>
          <select
            value={discountType}
            onChange={(e) => handleApplyDiscount(e.target.value)}
            className="ml-2"
          >
            <option value="percentage">%</option>
            <option value="fixed">Fixed</option>
          </select>
          <input
            type="number"
            id="discount"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(Number(e.target.value))}
            onBlur={() => handleApplyDiscount(discountType)}
            className="w-1/2 ml-2 p-1 border rounded"
            placeholder="Enter Discount"
          />
        </div>

        <div className="taxes bg-gray-100 p-2 rounded-sm mb-2">
          {taxAmounts.map((tax) => (
            <div key={tax.id} className="flex justify-between items-center">
              <span>{tax.name}</span>
              <span>${Number(tax.amount).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="subtotal-totals bg-gray-100 p-2 rounded-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold">Subtotal</span>
            <span>${calculateSubTotalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold">Discount</span>
            <span>${(discountType === "percentage" ? (calculateSubTotalPrice * discountAmount / 100) : discountAmount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center font-bold">
            <span>Total</span>
            <span>${parseFloat(totalAmount || 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex gap-4">
            <button onClick={handleHoldCart} className="w-full py-2 bg-orange-500 text-white rounded-md">
              Hold Cart
            </button>
            <Link href="/pay" className="w-full py-2 bg-green-500 text-white rounded-md text-center">
              Pay
            </Link>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Add New Product</h2>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                name="productName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <input
                type="number"
                name="productPrice"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter product price"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={handleAddNewProduct} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
                Add
              </button>
              <button onClick={togglePopup} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
