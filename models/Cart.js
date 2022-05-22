const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {type: String, required: true},
    products: [
      {
        productId: {         // 这里的product id 就是pokemon id
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