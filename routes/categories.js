var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category')

// GET - Lấy tất cả danh mục (chỉ những danh mục chưa bị xóa)
router.get('/', async function(req, res, next) {
  try {
    let categories = await categoryModel.find({ isDelete: false })
    res.send({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Lỗi khi lấy danh sách danh mục",
      data: error
    })
  }
});

// GET - Lấy danh mục theo ID
router.get('/:id', async function(req, res, next) {
  try {
    let item = await categoryModel.findOne({ _id: req.params.id, isDelete: false });
    if (!item) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy danh mục"
      })
    }
    res.send({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Lỗi khi lấy danh mục",
      data: error
    })
  }
});

// POST - Tạo danh mục mới
router.post('/', async function(req, res, next) {
  try {
    let newItem = new categoryModel({
      name: req.body.name
    })
    await newItem.save()
    res.send({
      success: true,
      message: "Tạo danh mục thành công",
      data: newItem
    })
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Lỗi khi tạo danh mục",
      data: error
    })
  }
})

// PUT - Cập nhật danh mục
router.put('/:id', async function(req, res, next) {
  try {
    let updatedItem = await categoryModel.findOneAndUpdate(
      { _id: req.params.id, isDelete: false },
      {
        name: req.body.name
      },
      {
        new: true
      }
    )
    if (!updatedItem) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy danh mục"
      })
    }
    res.send({
      success: true,
      message: "Cập nhật danh mục thành công",
      data: updatedItem
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Lỗi khi cập nhật danh mục",
      data: error
    })
  }
})

// DELETE - Soft delete danh mục
router.delete('/:id', async function(req, res, next) {
  try {
    let deletedItem = await categoryModel.findOneAndUpdate(
      { _id: req.params.id, isDelete: false },
      {
        isDelete: true
      },
      {
        new: true
      }
    )
    if (!deletedItem) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy danh mục"
      })
    }
    res.send({
      success: true,
      message: "Xóa danh mục thành công",
      data: deletedItem
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Lỗi khi xóa danh mục",
      data: error
    })
  }
})

module.exports = router;
