import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '@/lib/slices/cartSlice';
import { setLoading, setProgress, setMessage } from '@/lib/slices/loadingSlice';
import { setProducts } from '@/lib/slices/productsSlice';


const ProductList = ({products}) => {
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariation, setSelectedVariation] = useState(null);
//console.log(products)

  const handleAddToCart = (product) => {
    if (product.type === 'variable') {
      setSelectedProduct(product);
      setSelectedOptions({});
      setSelectedVariation(null);
    } else {

      dispatch(addItemToCart({...product , quantity: 1}));
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
    //  console.log('selectedVariation',selectedVariation);
      const variantOptionNames = selectedVariation.attributes
        ? selectedVariation.attributes.map(attr => `${attr.name}: ${attr.option}`).join(', ')
        : '';
  
      const variantProduct = {
        ...selectedProduct,
        id: selectedVariation.id,
        price: selectedVariation.price,  // Use the price from selected variation
        variantOptions: variantOptionNames,
      };
      console.log('variantProduct', variantProduct);

      dispatch(addItemToCart({...variantProduct , quantity: 1}));
      setSelectedProduct(null);
      setSelectedOptions({});
      setSelectedVariation(null);
    }
  };

  return (
    <div className="products_list overflow-auto">
      <h2 className="text-lg font-bold mb-2">Products</h2>
      <ul className="space-y-2 grid grid-cols-3 gap-2 overflow-auto">
        {products.map((product) => (
          <li key={product.id} className="flex gap-4 flex-col">
            <span>{product.name} - ${product.price}</span>
            <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleAddToCart(product)}>Add to Cart</button>
          </li>
        ))}
      </ul>
       
       {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Select Options for {selectedProduct.name}</h3>
            {selectedProduct.attributes.map((attr) => (
              <div key={attr.id} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {attr.name}
                </label>
                <select
                  className="form-select mt-1 block w-full"
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
                <h3 className="text-lg font-bold mb-2">Price: ${selectedVariation.price}</h3>
              </div>
            )}


            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedOptions({});
                  setSelectedVariation(null);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddVariantToCart}
              >
                Add Variant to Cart
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default ProductList;
