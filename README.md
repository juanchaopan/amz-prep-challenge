# AMZ Challenge

## Steps

1. Replace `NVIDIA_API_KEY` with your NVIDIA API key in `docker-compose.yml`
2. From the project root, run:
   ```powershell
   docker-compose up
   ```
3. In a new terminal, run:
   ```powershell
   docker exec backend bash -c "npm install && npm start"
   ```
4. In a new terminal, run:
   ```powershell
   $id = (Invoke-RestMethod -Method Post http://localhost:3000/biddings `
     -ContentType "application/json" `
     -Body '{"message": "Ship 500kg of electronics from Toronto to New York in 3 days", "sender": "buyer@acme.com"}').id

   Invoke-RestMethod -Method Post http://localhost:3000/biddings/vendor-prices -ContentType "application/json" -Body "{`"biddingId`":`"$id`",`"vendorId`":`"vendor-a`",`"price`":1200}"
   Invoke-RestMethod -Method Post http://localhost:3000/biddings/vendor-prices -ContentType "application/json" -Body "{`"biddingId`":`"$id`",`"vendorId`":`"vendor-b`",`"price`":1100}"
   Invoke-RestMethod -Method Post http://localhost:3000/biddings/vendor-prices -ContentType "application/json" -Body "{`"biddingId`":`"$id`",`"vendorId`":`"vendor-c`",`"price`":1350}"
   Invoke-RestMethod -Method Post http://localhost:3000/biddings/vendor-prices -ContentType "application/json" -Body "{`"biddingId`":`"$id`",`"vendorId`":`"vendor-d`",`"price`":980}"
   Invoke-RestMethod -Method Post http://localhost:3000/biddings/vendor-prices -ContentType "application/json" -Body "{`"biddingId`":`"$id`",`"vendorId`":`"vendor-e`",`"price`":1050}"
   ```

5. Check the final price:
   ```powershell
   docker exec mongo mongosh "mongodb://amz_mongo_user:mongo_dev_password_123@localhost:27017/amz_mongo_db" --eval "db.bidding.findOne({_id: ObjectId('$id')}, {finalPrice:1, status:1})" --quiet
   ```
