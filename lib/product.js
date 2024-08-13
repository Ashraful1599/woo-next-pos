// Example using Axios
import axios from 'axios';

const fetchProduct = async (productId) => {
  try {
    const response = await axios.get(`http://localhost/pos/wp-json/wc/v3/products/${productId}`, {
      auth: {
        username: 'ck_5e371a1274c6e40c395bf5418489e6afdc5f447f',
        password: 'cs_48f7627d826cd209f345f05c3d40f96d4a2d76fa'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
  }
}
