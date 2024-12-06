import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState({ subtotal: 0, tax: 0, grandTotal: 0 });
  const navigate = useNavigate();

  // Fetch Cart Items
  useEffect(() => {
    const fetchCartItems = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/vnd.api+json");
      myHeaders.append("Commerce-Cart-Token", "9908");
      myHeaders.append("Content-Type", "application/vnd.api+json");
      myHeaders.append(
        "Cookie",
        "SSESS15acf8f5cfaefbd58695f3198ece0ffc=v2Ub0%2Cp9PzZJ9Co1Gl9u-4eOZLQUWSpE8jqfCmCxBMkKl%2Caj"
      );

      try {
        const response = await fetch(
          "https://main-bvxea6i-dzghxlrwlqmsu.us-2.platformsh.site/jsonapi/carts",
          {
            method: "GET",
            headers: myHeaders,
          }
        );
        const data = await response.json();
        console.log(data);

        // Extract order items and pricing details
        const order = data.data[0];
        const items = data.included.filter(
          (item) => item.type === "commerce_order_item--default"
        );

        const parsedItems = items.map((item) => ({
          id: item.id,
          title: item.attributes.title,
          quantity: parseInt(item.attributes.quantity, 10),
          unitPrice: parseFloat(item.attributes.unit_price.number),
          totalPrice: parseFloat(item.attributes.total_price.number),
        }));

        setCartItems(parsedItems);

        setTotal({
          subtotal: parseFloat(order.attributes.order_total.subtotal.number),
          tax: parseFloat(
            order.attributes.order_total.adjustments[0]?.amount.number || 0
          ),
          grandTotal: parseFloat(order.attributes.order_total.total.number),
        });
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  // Recalculate Totals
  const recalculateTotals = (updatedCartItems) => {
    const newSubtotal = updatedCartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const taxRate = 0.12; // Assuming 12% tax rate
    const newTax = newSubtotal * taxRate;
    const newGrandTotal = newSubtotal + newTax;

    setTotal({
      subtotal: newSubtotal,
      tax: newTax,
      grandTotal: newGrandTotal,
    });
  };

  // Adjust Quantity Handler
  const adjustQuantity = (id, type) => {
    setCartItems((prevItems) => {
      const updatedCartItems = prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                type === "increment"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1),
              totalPrice:
                item.unitPrice *
                (type === "increment"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1)),
            }
          : item
      );
      recalculateTotals(updatedCartItems);
      return updatedCartItems;
    });
  };

  // Remove Item Handler
  const removeItem = (id) => {
    setCartItems((prevItems) => {
      const updatedCartItems = prevItems.filter((item) => item.id !== id);
      recalculateTotals(updatedCartItems);
      return updatedCartItems;
    });
  };

  // Checkout Handler
  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (!cartItems.length) {
    return (
      <p className="text-center mt-10 text-gray-700">Your cart is empty!</p>
    );
  }

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4 mb-4"
              >
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => adjustQuantity(item.id, "decrement")}
                  >
                    -
                  </button>
                  <span className="text-lg">{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => adjustQuantity(item.id, "increment")}
                  >
                    +
                  </button>
                  <p className="font-semibold">${item.totalPrice.toFixed(2)}</p>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="border p-6 rounded-md bg-gray-50">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="flex justify-between mb-2">
              <p>Subtotal</p>
              <p>${total.subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p>Tax</p>
              <p>${total.tax.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <p>Total</p>
              <p>${total.grandTotal.toFixed(2)}</p>
            </div>
            <button
              className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md text-lg font-medium hover:scale-105 transform transition"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
