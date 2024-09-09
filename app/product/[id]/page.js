"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductDetails = ({params}) => {
  //  // console.log(params);
    var productId = params.id;
  const [product, setProduct] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});

 // // console.log(product);


  useEffect(() => {
    const fetchProduct = async () => {
      const productData = await fetchProductWithVariations(productId);
      setProduct(productData);
    };

    fetchProduct();
  }, [productId]);

  const handleOptionChange = (attributeName, optionValue) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [attributeName]: optionValue
    };
    setSelectedOptions(newSelectedOptions);

    const selectedVar = product.variations.find(variation =>
      Object.keys(newSelectedOptions).every(opt =>
        variation.attributes.some(attr =>
          attr.name === opt && attr.option === newSelectedOptions[opt]
        )
      )
    );

    setSelectedVariation(selectedVar || null);

   // // console.log(selectedVariation);
    // console.log(selectedVariation?.attributes?.length);
   // // console.log(Object.keys(selectedVariation).attributes.length);
    // console.log(Object.keys(selectedOptions)?.length);



  };

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h2><strong>{product.name}</strong></h2>
      <div>
        {product.attributes.map(attr => (
          <div key={attr.id}>
            <label><strong>{attr.name}:</strong></label>
            <select onChange={(e) => handleOptionChange(attr.name, e.target.value)}>
              <option value="">Select {attr.name}</option>
              {attr.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      {selectedVariation?.attributes?.length == Object.keys(selectedOptions)?.length && (
        <div>
          <h3>{selectedVariation.price}</h3>
          <p>{selectedVariation.description}</p>
        </div>
      )}
    </div>
  );
}

const fetchProductWithVariations = async (productId) => {
  try {
    const productResponse = await axios.get(`http://localhost/pos/wp-json/wc/v3/products/${productId}`, {
      auth: {
            username: 'ck_5e371a1274c6e40c395bf5418489e6afdc5f447f',
            password: 'cs_48f7627d826cd209f345f05c3d40f96d4a2d76fa'
      }
    });

    const variationResponse = await axios.get(`http://localhost/pos/wp-json/wc/v3/products/${productId}/variations`, {
      auth: {
            username: 'ck_5e371a1274c6e40c395bf5418489e6afdc5f447f',
            password: 'cs_48f7627d826cd209f345f05c3d40f96d4a2d76fa'
      }
    });

    return {
      ...productResponse.data,
      variations: variationResponse.data
    };
  } catch (error) {
    console.error('Error fetching product or variations:', error);
  }
}

export default ProductDetails;