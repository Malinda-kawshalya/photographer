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
    const { userId } = req.query;
    let query = {};
    
    // If userId is provided, filter products by userId
    if (userId) {
      query.userId = userId;
    }

    const products = await Product.find(query).populate('userId', 'username companyName');
    
    if (!products || products.length === 0) {
      return res.json({ success: true, products: [], message: 'No products found' });
    }
    
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, priceLKR, discount } = req.body;
    const productId = req.params.id;

    // Find existing product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user is authorized (shop owner)
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    // Handle image update
    if (req.file) {
      // Delete old image
      try {
        await fs.unlink(path.join(__dirname, '..', product.image.url));
      } catch (unlinkError) {
        console.error('Error deleting old image:', unlinkError);
      }

      // Update with new image
      product.image = {
        url: `/Uploads/${req.file.filename}`,
        filename: req.file.filename
      };
    }

    // Update other fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.priceLKR = priceLKR ? parseFloat(priceLKR) : product.priceLKR;
    product.discount = discount ? parseFloat(discount) : product.discount;

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    if (req.file) {
      try {
        await fs.unlink(path.join(__dirname, '../Uploads', req.file.filename));
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Convert both IDs to strings for comparison
    const productUserId = product.userId.toString();
    const requestUserId = req.user._id.toString();

    // Debug log to check IDs
    console.log('Product User ID:', productUserId);
    console.log('Request User ID:', requestUserId);

    if (productUserId !== requestUserId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    // Delete product image if it exists
    if (product.image && product.image.url) {
      try {
        const imagePath = path.join(__dirname, '..', product.image.url);
        await fs.unlink(imagePath);
      } catch (unlinkError) {
        console.error('Error deleting product image:', unlinkError);
      }
    }

    // Delete product from database
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete product',
      error: error.message 
    });
  }
};

module.exports = {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct
};