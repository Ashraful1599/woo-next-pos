import axios from "axios";
import config from '@/lib/config';


export default async function getAllProducts(){

    // const myHeaders = new Headers();
    // myHeaders.append("authkey", "22239753ccfee1eb04acfe2171623a42");
    // myHeaders.append("Cookie", "selected_outlet=3");
    
    // const requestOptions = {
    //   method: "POST",
    //   headers: myHeaders,
    //   redirect: "follow"
    // };
    
    // const allprod = await  fetch("http://localhost/pos/wp-json/pos/v1/get-products?logged_in_user_id=9884&raw_data=[{\"product_id\":\"22\"},{\"product_id\":\"21\"},{\"product_id\":\"10986\"},{\"product_id\":\"10985\"},{\"product_id\":\"10986\"},{\"product_id\":\"10987\"},{\"product_id\":\"10988\"},{\"product_id\":\"10989\"},{\"product_id\":\"10991\"},{\"product_id\":\"10990\"},{\"product_id\":\"10991\"},{\"product_id\":\"10992\"},{\"product_id\":\"10993\"},{\"product_id\":\"10995\"},{\"product_id\":\"10994\"},{\"product_id\":\"10995\"},{\"product_id\":\"10996\"},{\"product_id\":\"10997\"},{\"product_id\":\"10998\"},{\"product_id\":\"10999\"},{\"product_id\":\"11001\"},{\"product_id\":\"11000\"},{\"product_id\":\"11001\"},{\"product_id\":\"11002\"},{\"product_id\":\"11003\"},{\"product_id\":\"11004\"},{\"product_id\":\"11005\"},{\"product_id\":\"11007\"},{\"product_id\":\"11006\"},{\"product_id\":\"11007\"},{\"product_id\":\"11008\"},{\"product_id\":\"11009\"},{\"product_id\":\"11010\"},{\"product_id\":\"11011\"},{\"product_id\":\"11012\"},{\"product_id\":\"11013\"},{\"product_id\":\"11015\"},{\"product_id\":\"11017\"},{\"product_id\":\"11019\"},{\"product_id\":\"11021\"},{\"product_id\":\"11023\"},{\"product_id\":\"11025\"},{\"product_id\":\"11027\"},{\"product_id\":\"11029\"},{\"product_id\":\"11031\"},{\"product_id\":\"11033\"},{\"product_id\":\"11035\"},{\"product_id\":\"11037\"},{\"product_id\":\"11039\"},{\"product_id\":\"11042\"}]", requestOptions);

    // return allprod.json();

    const productIds = [11006, 14593, 14597, 14561, 14573];  // Array of product IDs you want to retrieve
    const productResponse = await axios.get(`${config.apiBaseUrl}/products/?include=${productIds.join(',')}`, {
      auth: config.auth
    });
    // console.log(productResponse.data);
    return productResponse.data;
}

