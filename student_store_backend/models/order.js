const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Order {
  static async listOrdersForUser() {}

  static async createOrder(user, orderObject) {
    // const requiredFields = ["customer_id"];
    // requiredFields.forEach((field) => {
    //   if (!orderObject.hasOwnProperty(field)) {
    //     throw new BadRequestError(
    //       `Required field - ${field} - missing from request body`
    //     );
    //   }
    // });

    const results = await db.query(
      `INSERT INTO orders (customer_id)
       VALUES ((SELECT id FROM users WHERE email = $1))
       RETURNING id, customer_id;
      `,
      [user.email]
    );
    // const results = await db.query(
    //   `SELECT users.id FROM users WHERE email = $1;`,
    //   [user.email]
    // );
    const order = results.rows[0];
    console.log("order made", order);
    const orderId = order.id;

    await orderObject.map((orderElement, i) => {
      let orderDetailsResult = db.query(
        `INSERT INTO order_details (order_id, product_id, quantity)
            VALUES ($1, $2, $3)
            RETURNING order_id, product_id, quantity, discount;
            `,
        [orderId, orderElement.id, orderElement.quantity]
      );
      return orderDetailsResult;
    });

    const finalResults = await db.query(
      `SELECT * FROM order_details WHERE order_id = $1;
        `,
      [orderId]
    );
    return finalResults.rows[0];
  }
}

module.exports = Order;
