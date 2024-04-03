const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
}));

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzEyMTUzNTUyLCJpYXQiOjE3MTIxNTMyNTIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjgyMmJjZGZjLTk5OWQtNGU1Ni1iY2NjLTYwNjU5YWViZGI4YyIsInN1YiI6ImNyNjQ3M0Bzcm1pc3QuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoibG9jYWwtdHJlYXN1cmVzIiwiY2xpZW50SUQiOiI4MjJiY2RmYy05OTlkLTRlNTYtYmNjYy02MDY1OWFlYmRiOGMiLCJjbGllbnRTZWNyZXQiOiJDSEVleWh0dm51c0VKbU9rIiwib3duZXJOYW1lIjoiY2hva2FtZWxhIGthbGkgcHJhc2FkYSBtYW5pIG0iLCJvd25lckVtYWlsIjoiY3I2NDczQHNybWlzdC5lZHUuaW4iLCJyb2xsTm8iOiJSQTIxMTEwMDMwMTA3NTEifQ.pb_AC7AO_TvVvbQ3XPvaj22wJPm6lAmUh1npzkPuLkg";

const fetchProductsFromECommerceAPI = async (company, category, top, minPrice, maxPrice) => {
  const url = `http://20.244.56.144/test/companies/${company}/categories/${category}/products?top=${top}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching from eCommerce API:", error);
    throw error;
  }
};

app.get('/categories/:categoryname/products', async (req, res) => {
  const { categoryname } = req.params;
  let { n, minPrice, maxPrice, company = 'AMZ' } = req.query;

  minPrice = minPrice || '0';
  maxPrice = maxPrice || '999999';

  try {
    const products = await fetchProductsFromECommerceAPI(company, categoryname, n, minPrice, maxPrice);
    res.json(products);
  } catch (error) {
    console.error("Error fetching from eCommerce API:", error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
