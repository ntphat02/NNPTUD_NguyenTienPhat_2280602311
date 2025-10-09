var express = require("express");
var router = express.Router();
let productSchema = require("../schemas/product");
let categorySchema = require("../schemas/category");
let { Response } = require("../utils/responseHandler");
let { Authentication, Authorization } = require("../utils/authHandler");

// Get all products
router.get(
  "/",
  Authentication,
  Authorization("USER", "MOD", "ADMIN"),
  async function (req, res, next) {
    try {
      let products = await productSchema.find({ isDeleted: false }).populate({
        path: "category",
        select: "name",
      });
      Response(res, 200, true, products);
    } catch (error) {
      Response(res, 500, false, error);
    }
  }
);

// Get product by ID
router.get(
  "/:id",
  Authentication,
  Authorization("USER", "MOD", "ADMIN"),
  async function (req, res, next) {
    try {
      let product = await productSchema.findById(req.params.id).populate({
        path: "category",
        select: "name",
      });
      if (!product || product.isDeleted) {
        return Response(res, 404, false, "Product not found");
      }
      Response(res, 200, true, product);
    } catch (error) {
      Response(res, 500, false, error);
    }
  }
);

// Create a new product
router.post(
  "/",
  Authentication,
  Authorization("MOD", "ADMIN"),
  async function (req, res, next) {
    try {
      let category = await categorySchema.findById(req.body.category);
      if (!category || category.isDeleted) {
        return Response(res, 404, false, "Category not found");
      }
      let newProduct = new productSchema({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
      });
      await newProduct.save();
      Response(res, 201, true, newProduct);
    } catch (error) {
      Response(res, 500, false, error);
    }
  }
);

// Update a product
router.put(
  "/:id",
  Authentication,
  Authorization("MOD", "ADMIN"),
  async function (req, res, next) {
    try {
      let product = await productSchema.findById(req.params.id);
      if (!product || product.isDeleted) {
        return Response(res, 404, false, "Product not found");
      }
      if (req.body.category) {
        let category = await categorySchema.findById(req.body.category);
        if (!category || category.isDeleted) {
          return Response(res, 404, false, "Category not found");
        }
        product.category = req.body.category;
      }
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      await product.save();
      Response(res, 200, true, product);
    } catch (error) {
      Response(res, 500, false, error);
    }
  }
);

// Delete a product (soft delete)
router.delete(
  "/:id",
  Authentication,
  Authorization("ADMIN"),
  async function (req, res, next) {
    try {
      let product = await productSchema.findById(req.params.id);
      if (!product) {
        return Response(res, 404, false, "Product not found");
      }
      product.isDeleted = true;
      await product.save();
      Response(res, 200, true, "Product deleted successfully");
    } catch (error) {
      Response(res, 500, false, error);
    }
  }
);

module.exports = router;
