const express = require("express");
const { createProduct, getProducts, updateProduct, deleteProduct } = require("../controllers/productController"); 
const getuser = require("../middleware/getuserMiddile"); // JWT Middleware

const router = express.Router();

// CRUD Routes
router.post("/", getuser, createProduct);  // Create Product (Protected)
router.get("/", getProducts);  // View All Products
router.put("/:id", getuser, updateProduct);  // Update Product (Protected)
router.delete("/:id", getuser, deleteProduct);  // Delete Product (Protected)

module.exports = router;
