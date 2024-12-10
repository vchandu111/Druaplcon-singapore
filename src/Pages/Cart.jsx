import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Common/Loader.jsx";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState({ subtotal: 0, tax: 0, grandTotal: 0 });
  const [promoCode, setPromoCode] = useState("");
  const [availablePromoCodes, setAvailablePromoCodes] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState(null);
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

  // Fetch Available Promo Codes
  useEffect(() => {
    const fetchAvailablePromoCodes = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/vnd.api+json");
      myHeaders.append("Content-Type", "application/vnd.api+json");
      myHeaders.append("Authorization", "Basic dGVzdDp0ZXN0");

      try {
        const response = await fetch(
          "https://main-bvxea6i-dzghxlrwlqmsu.us-2.platformsh.site/jsonapi/commerce_promotion_coupon/commerce_promotion_coupon",
          {
            method: "GET",
            headers: myHeaders,
          }
        );
        const data = await response.json();

        const promoCodes = data.data.map((promo) => ({
          id: promo.id,
          code: promo.attributes.code,
          status: promo.attributes.status,
          startDate: promo.attributes.start_date,
          endDate: promo.attributes.end_date || "No Expiration",
        }));

        setAvailablePromoCodes(promoCodes);
      } catch (error) {
        console.error("Error fetching promo codes:", error);
      }
    };

    fetchAvailablePromoCodes();
  }, []);

  // Apply Promo Code
  const applyPromoCode = () => {
    const selectedPromo = availablePromoCodes.find(
      (promo) => promo.code === promoCode
    );

    if (selectedPromo) {
      const discountAmount = total.subtotal * 0.1; // Assuming a 10% discount
      setDiscount(discountAmount);
      setAppliedPromo(selectedPromo.code);
      setTotal((prevTotal) => ({
        ...prevTotal,
        grandTotal: prevTotal.grandTotal - discountAmount,
      }));
      alert(`Promo code "${promoCode}" applied successfully!`);
    } else {
      alert("Invalid promo code. Please try again.");
    }
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

  // Recalculate Totals
  const recalculateTotals = (updatedCartItems) => {
    const newSubtotal = updatedCartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const taxRate = 0.12; // Assuming 12% tax rate
    const newTax = newSubtotal * taxRate;
    const newGrandTotal = newSubtotal + newTax - discount;

    setTotal({
      subtotal: newSubtotal,
      tax: newTax,
      grandTotal: newGrandTotal,
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
    const token = localStorage.getItem("csrf_token");
    if (!token) {
      alert("Please login to checkout your products");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  if (!cartItems.length) {
    return <Loader />;
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
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
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
            <div className="flex justify-between mb-2">
              <p>Discount</p>
              <p>-${discount.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <p>Total</p>
              <p>${total.grandTotal.toFixed(2)}</p>
            </div>

            {/* Promo Code Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Apply Promo Code</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={applyPromoCode}
                >
                  Apply
                </button>
              </div>
              {appliedPromo && (
                <p className="mt-2 text-green-600">
                  Promo code <strong>{appliedPromo}</strong> applied!
                </p>
              )}
            </div>

            {/* Available Promo Codes */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Available Promo Codes</h3>
              {availablePromoCodes.length > 0 ? (
                <ul className="space-y-2">
                  {availablePromoCodes.map((promo) => (
                    <li
                      key={promo.id}
                      className="flex justify-between items-center border p-2 rounded-md bg-gray-100"
                    >
                      <div>
                        <p className="font-medium">{promo.code}</p>
                        <p className="text-sm text-gray-600">
                          Shop Swift coupon
                        </p>
                      </div>
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => setPromoCode(promo.code)}
                      >
                        Use
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No promo codes available at the moment.</p>
              )}
            </div>

            <button
              className="mt-6 w-full py-3 bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-md text-lg font-medium hover:scale-105 transform transition"
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
