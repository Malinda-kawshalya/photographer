const Product = require('../models/Product');
const path = require('path');
const fs = require('fs').promises;

const createProduct = async (req, res) => {
  try {
    const { userId, name, description, priceLKR, discount } = req.body;
    const image = req.file;

    // Validate required fields
    if (!userId || !name || !description || !priceLKR || !image) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const product = new Product({
      userId,
      image: {
        url: `/Uploads/${image.filename}`,
        filename: image.filename
      },
      name,
      description,
      priceLKR: parseFloat(priceLKR),
      discount: discount ? parseFloat(discount) : 0
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product saved successfully',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    if (req.file) {
      try {
        await fs.unlink(path.join(__dirname, '../Uploads', req.file.filename));
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('userId', 'username companyName');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('userId', 'username companyName');
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

module.exports = { createProduct, getProductById, getProducts };