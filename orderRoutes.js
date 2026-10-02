
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");

// Verify user token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Login required"
        });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

// Place order
router.post("/", verifyToken, async (req, res) => {
    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product || !Number.isInteger(item.quantity) || item.quantity < 1) {
                return res.status(400).json({
                    message: "Invalid product or quantity"
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}`
                });
            }

            totalAmount += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                quantity: item.quantity
            });
        }

        const order = new Order({
            user: req.user.id,
            items: orderItems,
            totalAmount
        });

        await order.save();

        res.status(201).json({
            message: "Order placed successfully",
            order
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Get logged-in user's orders
router.get("/my-orders", verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.id
        }).populate("items.product");

        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;