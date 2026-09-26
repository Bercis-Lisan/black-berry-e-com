const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

const router = express.Router();

// GET /api/admin/stats — public analytics for the client-side admin dashboard
router.get("/stats", async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalOrders,
      totalUsers,
      newUsersLast7Days,
      newUsersLast30Days,
      salesAgg,
      recentOrders,
      productCount,
      salesByDay,
      topProducts,
    ] = await Promise.all([
      Order.countDocuments({ status: "paid" }),
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Order.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Order.find({ status: "paid" })
        .select("amount createdAt")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Product.countDocuments(),
      Order.aggregate([
        { $match: { status: "paid", createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "UTC",
              },
            },
            sales: { $sum: "$amount" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $match: { status: "paid" } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.name",
            unitsSold: { $sum: { $ifNull: ["$items.quantity", 1] } },
            revenue: {
              $sum: {
                $multiply: [
                  { $ifNull: ["$items.price", 0] },
                  { $ifNull: ["$items.quantity", 1] },
                ],
              },
            },
          },
        },
        { $sort: { unitsSold: -1, revenue: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const totalSales = salesAgg[0]?.total || 0;
    const salesByDate = new Map(salesByDay.map((day) => [day._id, day]));
    const salesTrend = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setUTCHours(0, 0, 0, 0);
      date.setUTCDate(date.getUTCDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      const day = salesByDate.get(key);

      return {
        date: key,
        sales: day?.sales || 0,
        orders: day?.orders || 0,
      };
    });

    res.status(200).json({
      success: true,
      stats: {
        totalSales,
        totalOrders,
        averageOrderValue: totalOrders ? totalSales / totalOrders : 0,
        totalUsers,
        newUsersLast7Days,
        newUsersLast30Days,
        productCount,
      },
      recentOrders,
      salesTrend,
      topProducts,
    });
  } catch (err) {
    console.error("admin stats error:", err);
    res.status(500).json({ success: false, message: "Could not fetch stats" });
  }
});

module.exports = router;
