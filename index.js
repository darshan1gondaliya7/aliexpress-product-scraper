const aliexpressProductScraper = require('./src/aliexpressProductScraper');
const fs = require('fs');
const mysql = require('mysql');
var https = require('follow-redirects').https;
// Get the Host from Environment or use default
const host = process.env.DB_HOST || 'localhost'; 
// Get the User for DB from Environment or use default
const user = process.env.DB_USER || 'root1';
// Get the Password for DB from Environment or use default
const password = process.env.DB_PASS || 'tec@123';
// Get the Database from Environment or use default
const database = process.env.DB_DATABASE || 'product-scraper';
// Create the connection with required details
const con = mysql.createConnection({
	host,
	user,
	password,
	database,
});


const express = require('express')
const app = express()
const port = 3000

app.get("/getProducts", async (req, res) => {
	try {
		const query = "SELECT * FROM Subcategories where status = 0 limit 1";
		// make to connection to the database.
		con.connect(function (err) {
			if (err) throw err;
			// if connection is successful
			con.query(query, (err, result, fields) => {
				// if any error while executing above query, throw error
				if (err) throw err;
				// if there is no error, you have the result
				//console.log(result);
				result.forEach(async function (value) {
					if(value){
						let hotsellingList = gethotsellingProductList(value.id);
						let hotsellingres = await hotsellingList;
						let temp = JSON.parse(hotsellingres);
						if (temp.result.totalResults > 0) {
							let hotselleing = temp.result.hotSellingProducts;
							for (var i = hotselleing.length - 1; i >= 0; i--) {
								console.log(hotselleing[i].productId);
								let finalProductId = hotselleing[i].productId;
								try {
									const product = getData(finalProductId);
									let productResult = await product;
									if(productResult){										
										productResult = JSON.stringify(productResult);
										productResult = productResult.replace(/'/g, 'A');
										const query2 = "insert into ProductDetails (catageroryId,productId,json_data) values ('"+value.id+"','"+finalProductId+"','"+productResult+"')";			
										// if connection is successful
										con.query(query2, (err2, result2, fields2) => {
										// if any error while executing above query, throw error
										if (err2) throw err2;
											console.log(result);
										})
									}
									const query3="UPDATE `Subcategories` SET `status`=1 WHERE `id`="+value.id;
									// make to connection to the database.
									con.query(query3);

								} catch (e) {
									// Output unexpected Errors.
									console.log(e);
								}
							}
						}
					}
				});
			});
		});
	} catch (e) {
			console.log(e);
	}
});

async function gethotsellingProductList(categoryId) {	
	return new Promise((resolve, reject) => {
		var options = {
			'method': 'GET',
			'hostname': 'gw.api.alibaba.com',
			'path': '/openapi/param2/1/portals.open/api.gethotsellingProductList/53607?categoryId=' + categoryId + '&locale=global&pageNo=1&pageSize=10',
			'headers': {},
			'maxRedirects': 10
		};

		var req = https.request(options, function (res) {
			var chunks = [];
			res.on("data", function (chunk) {
				chunks.push(chunk);
			});

			res.on("end", async function () {
				var body = Buffer.concat(chunks);
				resolve(body.toString());
			});
		});
		req.end();
	});
}

async function getData(productId) {
	const product = aliexpressProductScraper(productId);
  	let res  	 = await product;
	return res;
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))