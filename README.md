# Aliexpress Product Scraper


# How to use?
import database from sql/product-scraper.sql folder to your database

Install dependency using  
```
npm install
```

# Change

Go to index.js and change your local configuration for DB_HOST,DB_USER,DB_PASS and DB_DATABASE


# Run

Run your code ``` node index.js ``` for a local server. it will be open 3000 port in localhost

```
http://localhost:3000/getProducts
```
You can call above give GET call in your postman or cron tab url in your server, it will automatcally take 1 category from table and find the hotproducts from aliexpress server and save that data on "ProductDetails" table.

# Sample JSON Response

```
{ 
 	parent_id: 1420, 
 	id: 1428, 
 	name: 'Abrasives', 
 	status: 0 
}
```