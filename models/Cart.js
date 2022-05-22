const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {type: String, required: true},
    products: [
      {
        productId: {         // 这里的product id 就是pokemon id, 根据这个id 在 store页面 展示出一串pokemon信息
          type: String
        },
        quantity: {
          type: Number,
          default: 1,
        }
      }
    ]
  },
  {timestamps: true}
);

module.exports = mongoose.model('Cart', CartSchema);