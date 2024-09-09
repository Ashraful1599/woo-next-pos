import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCartItems,
  addItemToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  setSubTotal,
  setTaxAmounts,
  setDiscount,
  setDiscountType,
  calculateTotalPrice,
  calculateLoyaltyPoints,
  setDiscountAmount,
  setHoldCartNote,
  setCustomerId, 
  setCustomerEmail
} from "@/lib/slices/cartSlice";
import { getProductFromDB } from "@/lib/db";
import {holdCart} from '@/lib/slices/holdCartSlice'
import { fetchTaxes } from "@/lib/slices/taxSlice";
import Avatar from "./cart/Avatar";
import { FaPlus, FaTrash, FaBarcode, FaTimesCircle, FaCross } from "react-icons/fa";
import Link from "next/link";
import { setSelectedCustomer } from "@/lib/slices/customersSlice";

const Cart = ({ placeOrder, customer }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const discountType = useSelector((state) => state.cart.discountType);
  const discountAmount = useSelector((state) => state.cart.discountAmount);
  const discount = useSelector((state) => state.cart.discount);
  const subTotal = useSelector((state) => state.cart.subTotal);
  const taxRates = useSelector((state) => state.taxes?.rates);
  const taxAmounts = useSelector((state) => state.cart.taxAmounts);
  const products = useSelector((state) => state.products?.items);
  const selectedCustomer = useSelector((state) => state.customers?.selectedCustomer);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const { loyaltyPoints } = useSelector((state) => state.cart);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isBarcodeInput, setIsBarcodeInput] = useState(false);
  const [toggledItemId, setToggledItemId] = useState(null);
  const cart = useSelector((state) => state.cart);
  const [editingItems, setEditingItems] = useState({});
  const [barcode, setBarcode] = useState("");
  const initialSubTotal = useRef(subTotal);
  const [addToHoldCart, setAddToHoldCart] = useState(false);
  const [holdCartOrderNote,setHoldCartOrderNote] = useState('');


  const handleOrderNote = async () =>{
      const cartForHold = {
        ...cart, 
        customerId: selectedCustomer.id,
        customerEmail: selectedCustomer.email, 
        holdCartNote: holdCartOrderNote,
        loyaltyPoints: loyaltyPoints,
        date: new Date().toISOString(),
      }
     // console.log(cartForHold);
  
       const result = await dispatch(holdCart(cartForHold));
       if (result.meta.requestStatus === "fulfilled") {
            setAddToHoldCart(false);
        }
       

  }

  const orderNoteClose = () =>{
    setAddToHoldCart(false);
  }


  useEffect(()=>{
    if (initialSubTotal.current != subTotal){
      dispatch(setDiscountType(discountType));
      dispatch(setDiscount(discountAmount));
    }
  },[subTotal, discountType, discountAmount, dispatch])


  const handleInputChange = (e, item, field) => {
    const updatedItems = {
      ...editingItems,
      [item.id]: {
        ...editingItems[item.id],
        [field]: e.target.value,
      }
    };
    setEditingItems(updatedItems);
  };


  useEffect(() => {
    dispatch(fetchCartItems());
    dispatch(fetchTaxes());
  }, [dispatch]);



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
    dispatch(setDiscount(0));
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleAddNewProduct = () => {
    dispatch(addItemToCart({ title: productName, sale_price: parseFloat(productPrice), quantity: 1 }));
    setProductName('');
    setProductPrice('');
    togglePopup();
  };

  const handleApplyDiscount = (type) => {
    dispatch(setDiscountType(type));
    dispatch(setDiscount(discountAmount));
    setAppliedDiscount(discountAmount);
  };

  useEffect(() => {
    dispatch(setSubTotal());
    dispatch(calculateLoyaltyPoints());
    dispatch(setTaxAmounts(taxRates));
    dispatch(calculateTotalPrice());
  }, [taxRates, cartItems, discountType, discountAmount, appliedDiscount, dispatch]);

  

  const handleHoldCart = async () => {
 //   console.log('cart for hold', cart);
    setAddToHoldCart(true);

   // const result = await dispatch(holdCart(cart));
    // if (result.meta.requestStatus === 'fulfilled') {
    //   setHeldCartId(result.payload);
    // }
  };

const handleBarcode = () => {
  setIsBarcodeInput(true);

}
const barcodeWindowClose = () => {
  setIsBarcodeInput(false);
}
const barcodeNumberChange = (barcodeNumber)=>{
  setBarcode(barcodeNumber);
}




const handleKeyDown2 = (e) => {
  if (e.key === "Enter") {
    // Trigger the given action with the barcode number
    barcodeNumberGiven(barcode);
    // Clear the input field after processing
    setBarcode("");
  }
};



const barcodeNumberGiven = async (barcode) => {

  const findProductWithVariation = (products, barcode) => {
    for (const item of products) {
      if (item.product_id == barcode) {
        return { parentProduct: item, matchedVariation: null };
      }
  
      const matchedVariation = item.available_variations.find(vitem => vitem.product_id == barcode);
      if (matchedVariation) {
        return { parentProduct: item, matchedVariation: matchedVariation };
      }
    }
  
    return null; // If no product or variation is found
  };
  
  const result = findProductWithVariation(products, barcode);
  
  if (result) {
   // // console.log('Parent Product ID:', result.parentProduct.id);
    
  if (result.parentProduct.type === 'variable') {

    const variantOptionNames = result.matchedVariation.attributes
      ? Object.entries(result.matchedVariation.attributes).map(([name, option]) => `${name.replace('attribute_', '')}: ${option}`).join(', ')
      : '';

    const variantProduct = {

      ...result.matchedVariation,
      id: result.matchedVariation.variation_id,
      title: result.parentProduct.title,
      sale_price: result.matchedVariation.display_price,
      variantOptions: variantOptionNames,
    };

    dispatch(addItemToCart({ ...variantProduct, quantity: 1 }));
    setSelectedProduct(null);
    setSelectedOptions({});
    setSelectedVariation(null);
  

 // // console.log('variantProduct', variantProduct);

  dispatch(addItemToCart({...variantProduct , quantity: 1}));

  } else {

    dispatch(addItemToCart({...result.parentProduct , quantity: 1}));
  }

  } else {
    // console.log('Product not found');
  }


};

const removeCustomer = () =>{
  dispatch(setSelectedCustomer([]));
}


  return (
    <div className="bg-white p-4 rounded shadow-lg col-span-2 flex flex-col side_cart_wrap">
      <div className="cart_header grid grid-cols-10 items-center flex-none gap-2">
        <div className="selected_customer  col-span-6">
          <Link href="/customers" className="flex items-center gap-2">
            <Avatar size="50px" />
            <div>
              {selectedCustomer.length < 1 ? (
                <div>Select customer</div>
              ) : (
                <>
                  <div>{selectedCustomer.first_name} {selectedCustomer.last_name}</div>
                  <div className="text-ellipsis text-sm email">{selectedCustomer.email} </div>
                </>
              )}
            </div>
          </Link>
        </div>
        <div className="cursor-pointer text-xl flex items-center justify-center bg-gray-100 p-3 rounded col-span-1" onClick={removeCustomer}>
            <FaTimesCircle />
        </div>
        <div className="add_new_product w-10 cursor-pointer text-xl flex items-center justify-center bg-gray-100 p-3 rounded col-span-1" onClick={togglePopup}>
          <FaPlus />
        </div>
        <div className="clear_cart w-10 cursor-pointer text-xl flex items-center justify-center bg-gray-100 p-3 rounded col-span-1">
          <FaTrash onClick={handleClearCart} />
        </div>
        <div className="enter_barcode w-10 cursor-pointer text-xl flex items-center justify-center bg-gray-100 p-3 rounded col-span-1">
          <FaBarcode onClick={handleBarcode} />
        </div>
      </div>

      <ul className="mt-4 border-t pt-4 cart_items flex flex-col flex-1 flex-grow overflow-y-auto gap-2">
        {cartItems?.length > 0 ? cartItems.map((item) => (
          <li key={item.id} className="relative">
            <div
              className="flex justify-between items-center cart_item_name gap-3"
              onClick={() => handleToggleItem(item.id)}
              aria-expanded={togglePopup.toggledItemId === item.id}
            >
                <p className="">
                    {item.title}
                <span className="text-sm text-gray-500 block">${Number(item.sale_price).toFixed(2)} (x{item.quantity})</span>
                {/* {item.variantOptions && (
                  <div className="text-sm text-gray-500 variantoptions">
                    {item.variantOptions}
                  </div>
                )} */}
              </p>
              <span className="mr-6">${Number(item.sale_price*item.quantity).toFixed(2)}</span>
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
                value={editingItems[item.id]?.quantity || item.quantity}
                onChange={(e) => handleInputChange(e, item, 'quantity')}
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
            className="ml-2 p-2"
          >
            <option value="percentage">%</option>
            <option value="fixed">Fixed</option>
          </select>
          <input
            type="number"
            id="discount"
            value={discountAmount}
            onChange={(e) => dispatch(setDiscountAmount(Number(e.target.value)))}
            onBlur={() => handleApplyDiscount(discountType)}
            className="w-1/2 ml-2 p-1 border rounded"
            placeholder="Enter Discount"
          />
        </div>

        <div className="taxes bg-gray-100 p-2 rounded-sm mb-2">
        <div className="flex justify-between items-center mb-1">
            <span className="font-bold">Subtotal</span>
            <span>${subTotal.toFixed(2)}</span>
          </div>
          {taxAmounts.map((tax) => (
            <div key={tax.id} className="flex justify-between items-center">
              <span>{tax.label}</span>
              <span>${Number(tax.amount).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold">Discount</span>
            <span>-${discount}</span>
          </div>
        </div>

        <div className="subtotal-totals bg-gray-100 p-2 rounded-sm">
          <div className="flex justify-between items-center font-bold">
            <span>Total</span>
            <span>${parseFloat(totalAmount || 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex gap-4">
            <button onClick={handleHoldCart} className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-md disabled:bg-teal-300 disabled:text-teal-100 disabled:cursor-not-allowed" disabled={cartItems.length == 0? 'disabled': ''}>
              Hold Cart
            </button>
            <Link href="/pay" passHref className="contents">
              <button  className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md text-center disabled:bg-indigo-300 disabled:text-indigo-100 disabled:cursor-not-allowed" disabled={cartItems.length == 0? 'disabled': ''}>
                Pay
              </button>
            </Link>
          </div>
        </div>
      </div>



{isPopupOpen && (
    <div className="popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-xl mb-4 text-gray-900">Add New Product</h2>
        <div className="flex flex-col gap-2">
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product Name"
          className="mb-4 p-2 border rounded text-gray-800"
        />
        <input
          type="number"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          placeholder="Product Price"
          className="mb-4 p-2 border rounded text-gray-800"
        />
        </div>
        <div className="flex justify-between mt-4">
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
          onClick={handleAddNewProduct}
        >
          Add Product
        </button>
        <button
          className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
          onClick={togglePopup}
        >
          Cancel
        </button>
        </div>
      </div>
    </div>
  )}

{isBarcodeInput && (
        <div className="popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4 text-gray-900">Enter product barcode</h2>
            <div className="flex flex-col gap-2">
              <input
                type="number"
                name="productbarcode"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                placeholder="Enter/Scan product barcode"
                onChange={(e)=> barcodeNumberChange(e.target.value)}
                value={barcode}
                onKeyDown={handleKeyDown2}
                autoFocus // Ensures the input is focused automatically
              />

            </div>
            <br></br>
            <button onClick={barcodeWindowClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700">
                Close
              </button>
          </div>
        </div>
      )}


      {
        addToHoldCart && (
          <div className="popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 ">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-2xl mb-4 text-gray-900">Add order note</h2>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                name="orderNote"
                className="focus:outline-none border border-gray-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 p-3 rounded"
                placeholder="Enter order note"
                onChange={(e)=> setHoldCartOrderNote(e.target.value)}
                value={holdCartOrderNote}
               // onKeyDown={handleKeyDown2}
                autoFocus // Ensures the input is focused automatically
              />

            </div>
            <div className="flex gap-4 w-96 mt-4">
            <button onClick={handleOrderNote} className="px-4 py-4 rounded bg-indigo-500 hover:bg-indigo-600 text-white w-1/2">
                Add Order Note
            </button>
            <button onClick={orderNoteClose} className="px-4 py-4 rounded bg-teal-500 hover:bg-teal-600 text-white w-1/2">
                Later
            </button>

            </div>

          </div>
        </div>
        )
      }

    </div>
  );
};

export default Cart;
