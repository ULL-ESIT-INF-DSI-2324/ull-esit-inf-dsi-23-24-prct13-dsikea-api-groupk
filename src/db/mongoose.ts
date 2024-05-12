import { connect } from "mongoose";
/**
 * Connect to MongoDB server
 * @param {string} process.env.MONGODB_URL - MongoDB URL
 * @returns {Promise<void>}
 * @throws {Error} Unable to connect to MongoDB server
 * @throws {Error} Connection to MongoDB server established
 * 
 */
connect(process.env.MONGODB_URL!)
  .then(() => {
    console.log("Connection to MongoDB server established");
  })
  .catch(() => {
    console.log("Unable to connect to MongoDB server");
  });
