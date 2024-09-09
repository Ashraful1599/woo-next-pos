'use client'
import { useState, useEffect } from "react";

const variations = [
    {
        variation_id: 19,
        display_price: 10,
        attributes: {
            attribute_color: "Blue",
            attribute_size: "Large"
        }
    },
    {
        variation_id: 20,
        display_price: 20,
        attributes: {
            attribute_color: "Blue",
            attribute_size: "Small"
        }
    },
    {
        variation_id: 21,
        display_price: 30,
        attributes: {
            attribute_color: "Red",
            attribute_size: "Large"
        }
    },
    {
        variation_id: 22,
        display_price: 40,
        attributes: {
            attribute_color: "Red",
            attribute_size: "Small"
        }
    }
];

export default function ProductPage() {
    const initialVariation = variations.length > 0 ? variations[0] : null;

    const [attributes, setAttributes] = useState(initialVariation ? initialVariation.attributes : {});
    const [selectedVariation, setSelectedVariation] = useState(initialVariation);

    const handleChange = (attributeName, value) => {
        const updatedAttributes = {
            ...attributes,
            [attributeName]: value
        };
        setAttributes(updatedAttributes);

        const variation = variations.find(v =>
            Object.entries(updatedAttributes).every(([key, val]) => v.attributes[key] === val)
        );
        setSelectedVariation(variation);
    };

    const getAttributeOptions = (attributeName) => {
        return Array.from(new Set(variations.map(variation => variation.attributes[attributeName])));
    };

    const attributeNames = Array.from(new Set(variations.flatMap(variation => Object.keys(variation.attributes))));

    return (
        <div>
            <h1>Product Variations</h1>
            {attributeNames.map(attributeName => (
                <div key={attributeName}>
                    <label>
                        {attributeName.replace('attribute_', '').replace('_', ' ').toUpperCase()}:
                        <select 
                            onChange={(e) => handleChange(attributeName, e.target.value)} 
                            value={attributes[attributeName] || ''}
                        >
                            <option value="">Select {attributeName.replace('attribute_', '').replace('_', ' ')}</option>
                            {getAttributeOptions(attributeName).map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </label>
                </div>
            ))}

            {selectedVariation ? (
                <div>
                    <p>Price: ${selectedVariation.display_price.toFixed(2)}</p>
                    <p>Variation ID: {selectedVariation.variation_id}</p>
                </div>
            ) : (
                attributes && Object.keys(attributes).length === attributeNames.length && (
                <div>
                    <p>No variation found for the selected attributes.</p>
                </div>
                )
            )}
        </div>
    );
}
