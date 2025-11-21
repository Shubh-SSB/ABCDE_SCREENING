import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api";

export default function Items() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/items`)
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  const addToCart = async (itemId, itemName) => {
    try {
      const res = await fetch(`${API}/carts`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      });

      if (res.ok) {
        alert(`${itemName} added to cart!`);
      } else {
        alert("Failed to add item to cart");
      }
    } catch (error) {
      alert("Error adding item to cart");
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

  const showCart = () => {
    navigate("/cart");
  };

  const showOrders = () => {
    navigate("/orders");
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="items-container">
      <div className="items-header">
        <h2>Shopping Items</h2>
        <div className="header-actions">
          <button className="btn-checkout" onClick={checkout}>
            Checkout
          </button>
          <button className="btn-secondary" onClick={showCart}>
            View Cart
          </button>
          <button className="btn-secondary" onClick={showOrders}>
            Order History
          </button>
          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="items-grid">
        {items.map((item) => {
          const itemId = item.ID;
          const itemName = item.Name || "Product";
          const itemPrice = item.Price;
          const itemStatus = item.Status;
          const isOutOfStock =
            itemStatus?.toLowerCase().includes("out") ||
            itemStatus?.toLowerCase() === "outstock" ||
            itemStatus?.toLowerCase() === "unavailable";

          return (
            <div
              key={itemId}
              className="item-card"
              onClick={() => !isOutOfStock && addToCart(itemId, itemName)}
              style={{
                opacity: isOutOfStock ? 0.7 : 1,
                cursor: isOutOfStock ? "not-allowed" : "pointer",
              }}
            >
              <div className="add-to-cart-badge">🛒 Add to Cart</div>
              <div className="item-image">🛍️</div>
              <div className="item-content">
                <h3>{itemName}</h3>
                <p className="item-description">
                  Premium quality product available for purchase. Add to your
                  cart and checkout when ready.
                </p>
                <div className="item-footer">
                  <span className="item-price">Rs. {itemPrice}</span>
                  <span
                    className={`item-stock ${
                      isOutOfStock ? "out-of-stock" : ""
                    }`}
                  >
                    {itemStatus}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
