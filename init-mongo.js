try {
  print("Creating app db user for db: amz_mongo_db...");
  db.getSiblingDB("amz_mongo_db").createUser({
    user: "amz_mongo_user",
    pwd: "mongo_dev_password_123",
    roles: [{ role: "readWrite", db: "amz_mongo_db" }],
  });
  print("App db user created");
} catch (e) {
  printjson(e);
}
