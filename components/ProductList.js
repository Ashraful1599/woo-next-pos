import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '@/lib/slices/cartSlice';
import { toast } from 'react-toastify';
import Image from 'next/image';


const ProductList = ({ products }) => {
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariation, setSelectedVariation] = useState(null);

  //console.log(products);

  const handleAddToCart = (product) => {
    if (product.type === 'variable') {
      setSelectedProduct(product);
      setSelectedOptions({});
      setSelectedVariation(null);
    } else {
      if(product.stock < 1){
        toast.warning('No stock quantity');
      }
      dispatch(addItemToCart({ ...product, quantity: 1 }));
    }
  };

  const handleOptionChange = (attributeName, optionValue) => {
    const updatedOptions = {
      ...selectedOptions,
      [attributeName]: optionValue,
    };
    setSelectedOptions(updatedOptions);

    if (Object.keys(updatedOptions).length === attributeNames.length) {
      const variation = selectedProduct.available_variations.find(v =>
        Object.entries(updatedOptions).every(
          ([key, value]) => v.attributes[key] === value
        )
      );
      setSelectedVariation(variation);
    } else {
      setSelectedVariation(null);
    }
  };

  const handleAddVariantToCart = () => {
    // console.log(selectedVariation);
    if(!selectedVariation.is_in_stock){
      toast.warning('No stock quantity');
    }

    if (selectedVariation) {
      const variantOptionNames = selectedVariation.attributes
        ? Object.entries(selectedVariation.attributes).map(([name, option]) => `${name.replace('attribute_', '')}: ${option}`).join(', ')
        : '';
        const variantOptions = selectedVariation.attributes
        ? Object.entries(selectedVariation.attributes).map(([name, option]) => `${option}`).join(', ')
        : '';

      const variantProduct = {

        ...selectedVariation,
        id: selectedVariation.variation_id,
        title: selectedVariation.title? selectedVariation.title: selectedProduct.title+" - "+ variantOptions,
        sale_price: selectedVariation.display_price,
        variantOptions: variantOptionNames,
        type: 'variation',
        parent: selectedProduct.product_id,
        product_id: selectedVariation.variation_id
      };

      dispatch(addItemToCart({ ...variantProduct, quantity: 1 }));
      setSelectedProduct(null);
      setSelectedOptions({});
      setSelectedVariation(null);
    }
  };

  const getAttributeOptions = (attributeName) => {
    return Array.from(
      new Set(selectedProduct.available_variations.map(variation => variation.attributes[attributeName]))
    );
  };

  const attributeNames = selectedProduct
    ? Array.from(
        new Set(selectedProduct.available_variations.flatMap(variation => Object.keys(variation.attributes)))
      )
    : [];

  return (
    <div className="products_list overflow-auto">
      <h2 className="text-lg font-bold text-gray-700 mb-2">Products</h2>
      {
        products.length != 0? (
          <ul className="grid grid-cols-6 gap-2 overflow-auto">
          {products.map((product) => {
         //   if (product.parent === 0) {
              //// console.log(product);
              return (
                <li data-id = {product.product_id} key={product.product_id} className="flex gap-4 flex-col bg-white p-6 rounded-lg cursor-pointer text-center"
                  onClick={() => handleAddToCart(product)}
                >
                  <Image width={"300"} height={"200"} alt="product name" className="rounded-lg" src='/300x200.svg' />
                  <p className="text-gray-900">{product.title}</p>
                  <p>${product.sale_price}</p>
                  {/* <button 
                    className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button> */}
                </li>
              );
          //  }
            return null;
          })}
        </ul>
        ) : "" 
      }


      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{selectedProduct.title}</h3>

            {attributeNames.map(attributeName => (
              <div key={attributeName} className="mb-4">
                <label className="block text-md font-medium text-gray-900 mb-1 capitalize">
                  {attributeName.replace('attribute_', '').replace('_', ' ').toLowerCase()}
                </label>
                <select 
                  onChange={(e) => handleOptionChange(attributeName, e.target.value)} 
                  value={selectedOptions[attributeName] || ''} 
                  className="form-select mt-1 block w-full bg-white border border-gray-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 p-2 rounded"
                >
                  <option value="">Select {attributeName.replace('attribute_', '').replace('_', ' ')}</option>
                  {getAttributeOptions(attributeName).map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}

            {selectedVariation && (
              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Price: ${selectedVariation.display_price}</h3>
              </div>
            )}

            <div className="flex justify-start gap-4">
              <button
              disabled={!selectedVariation}
                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:text-indigo-100"
                onClick={handleAddVariantToCart}
              >
                Add Variant to Cart
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedOptions({});
                  setSelectedVariation(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
