import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/items`)
      .then((res) => res.json())
      .then((data) => setItems(data));
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API}/carts`, {
        headers: { Authorization: localStorage.getItem("token") },
      });

      if (!res.ok) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setCartItems(data[0]?.Items || []);
    } catch (error) {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await fetch(`${API}/carts`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      });

      if (res.ok) {
        fetchCart();
      } else {
        alert("Failed to remove item");
      }
    } catch (error) {
      alert("Failed to remove item");
    }
  };

  const checkout = async () => {
    const res = await fetch(`${API}/orders`, {
      method: "POST",
      headers: { Authorization: localStorage.getItem("token") },
    });

    if (!res.ok) {
      alert("Checkout failed");
      return;
    }

    alert("Order successful!");
    navigate("/orders");
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((sum, cartItem) => {
        const itemId = cartItem?.ItemID;
        const matchedItem = items.find((item) => item.ID === itemId);
        const price = matchedItem?.Price || 0;
        const quantity = cartItem?.Quantity || 1;
        return sum + price * quantity;
      }, 0)
      .toFixed(2);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="items-container">
        <div className="items-header">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="items-container">
      <div className="items-header">
        <h2>🛒 Shopping Cart</h2>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => navigate("/items")}>
            Continue Shopping
          </button>
          <button className="btn-secondary" onClick={() => navigate("/orders")}>
            Order History
          </button>
          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some items to get started!</p>
          <button className="btn-primary" onClick={() => navigate("/items")}>
            Browse Items
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((cartItem, index) => {
              const itemId = cartItem?.ItemID;
              // Find the matching item from items array using ItemID
              const matchedItem = items.find((item) => item.ID === itemId);
              const itemName = matchedItem?.Name || "Product";
              const itemPrice = matchedItem?.Price || 0;
              const itemQuantity = cartItem?.Quantity || 1;
              const itemStatus = matchedItem?.Status || "Available";

              return (
                <div key={itemId || index} className="cart-item">
                  <div className="cart-item-image">🛍️</div>
                  <div className="cart-item-details">
                    <h3>{itemName}</h3>
                    <p className="cart-item-description">
                      Quantity: {itemQuantity} • {itemStatus}
                    </p>
                  </div>
                  <div className="cart-item-price">
                    Rs.{(itemPrice * itemQuantity).toFixed(2)}
                  </div>
                  <button
                    className="btn-remove"
                    onClick={() => removeFromCart(itemId)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs.{calculateTotal()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Rs.0.00</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>Rs.{calculateTotal()}</span>
            </div>
            <button className="btn-checkout full-width" onClick={checkout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
