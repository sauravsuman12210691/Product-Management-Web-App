const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    image: {
      type: String, // Store the image filename or URL
      
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

module.exports = mongoose.model("Product", ProductSchema);
