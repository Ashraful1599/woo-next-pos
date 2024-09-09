import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '@/lib/slices/cartSlice';

const ProductList = ({ products }) => {
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariation, setSelectedVariation] = useState(null);

  const handleAddToCart = (product) => {
    if (product.type === 'variable') {
      setSelectedProduct(product);
      setSelectedOptions({});
      setSelectedVariation(null);
    } else {
      dispatch(addItemToCart({ ...product, quantity: 1 }));
    }
  };

  const handleOptionChange = (attributeName, optionValue) => {
    const updatedOptions = {
      ...selectedOptions,
      [attributeName]: optionValue,
    };
    setSelectedOptions(updatedOptions);

    const variation = selectedProduct.variations.find(v =>
      v.attributes.every(attr => updatedOptions[attr.name] === attr.option)
    );
    setSelectedVariation(variation);
  };

  const handleAddVariantToCart = () => {
    if (selectedVariation) {
      const variantOptionNames = selectedVariation.attributes
        ? selectedVariation.attributes.map(attr => `${attr.name}: ${attr.option}`).join(', ')
        : '';

      const variantProduct = {
        ...selectedProduct,
        id: selectedVariation.id,
        price: selectedVariation.price,
        variantOptions: variantOptionNames,
      };

      dispatch(addItemToCart({ ...variantProduct, quantity: 1 }));
      setSelectedProduct(null);
      setSelectedOptions({});
      setSelectedVariation(null);
    }
  };

  return (
    <div className="products_list overflow-auto">
      <h2 className="text-lg font-bold text-gray-700 mb-2">Products</h2>
      <ul className="space-y-2 grid grid-cols-4 gap-2 overflow-auto">
        {products.map((product) => {
          if(product.parent == 0){
            return(
                        <li key={product.id} className="flex gap-4 flex-col bg-white p-6 rounded-lg shadow-lg">
            <span className="text-gray-900">{product.title} - ${product.sale_price
            }</span>
            <button 
              className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
          </li>
            )
          }
        })}
      </ul>

      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Select Options for {selectedProduct.name}</h3>
            {selectedProduct.attributes.map((attr) => (
              <div key={attr.id} className="mb-4">
                <label className="block text-md font-medium text-gray-900 mb-1 capitalize">
                  {attr.name}
                </label>
                <select
                  className="form-select mt-1 block w-full bg-white border border-gray-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 p-1 rounded"
                  onChange={(e) => handleOptionChange(attr.name, e.target.value)}
                  value={selectedOptions[attr.name] || ''}
                >
                  <option value="">Select an option</option>
                  {attr.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {selectedVariation?.attributes?.length === Object.keys(selectedOptions)?.length && (
              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Price: ${selectedVariation.price}</h3>
              </div>
            )}

            <div className="flex justify-start gap-4">
              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
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
