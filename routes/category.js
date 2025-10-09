var express = require("express");
var router = express.Router();
let categorySchema = require("../schemas/category");
let { Response } = require("../utils/responseHandler");
let { Authentication, Authorization } = require("../utils/authHandler");

// Get all categories
router.get(
  "/",
  Authentication,
  Authorization("USER", "MOD", "ADMIN"),
  async function (req, res, next) {
    try {
      let categories = await categorySchema.find({ isDeleted: false });
      Response(res, 200, true, categories);
    } catch (error) {
      Response(res, 500, false, error);
    }
  }
);

// Get category by ID
router.get(
  "/:id",
  Authentication,
  Authorization("USER", "MOD", "ADMIN"),
  async function (req, res, next) {
    try {
      let category = await categorySchema.findById(req.params.id);
      if (!category || category.isDeleted) {
        return Response(res, 404, false, "Category not found");
      }
      Response(res, 200, true, category);
    } catch (error) {
      Response(res, 500, false, error);
    }
  }
);

// Create a new category
router.post(
  "/",
  Authentication,
  Authorization("MOD", "ADMIN"),
  async function (req, res, next) {
    try {
      let newCategory = new categorySchema({
        name: req.body.name,
      });
      await newCategory.save();
      Response(res, 201, true, newCategory);
    } catch (error) {
      Response(res, 500, false, error);
    }
  }
);

// Update a category
router.put(
  "/:id",
  Authentication,
  Authorization("MOD", "ADMIN"),
  async function (req, res, next) {
    try {
      let category = await categorySchema.findById(req.params.id);
      if (!category || category.isDeleted) {
        return Response(res, 404, false, "Category not found");
      }
      category.name = req.body.name || category.name;
      await category.save();
      Response(res, 200, true, category);
    } catch (error) {
      Response(res, 500, false, error);
    }
  }
);

// Delete a category (soft delete)
router.delete(
  "/:id",
  Authentication,
  Authorization("ADMIN"),
  async function (req, res, next) {
    try {
      let category = await categorySchema.findById(req.params.id);
      if (!category) {
        return Response(res, 404, false, "Category not found");
      }
      category.isDeleted = true;
      await category.save();
      Response(res, 200, true, "Category deleted successfully");
    } catch (error) {
      Response(res, 500, false, error);
    }
  }
);

module.exports = router;
