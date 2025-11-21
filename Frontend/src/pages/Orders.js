import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/orders`, {
        headers: { Authorization: localStorage.getItem("token") },
      });

      if (!res.ok) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setOrders(data);
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return "status-success";
      case "pending":
      case "processing":
        return "status-warning";
      case "cancelled":
        return "status-error";
      default:
        return "status-default";
    }
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
        <h2>📦 Order History</h2>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => navigate("/items")}>
            Continue Shopping
          </button>
          <button className="btn-secondary" onClick={() => navigate("/cart")}>
            View Cart
          </button>
          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Start shopping to see your order history!</p>
          <button className="btn-primary" onClick={() => navigate("/items")}>
            Browse Items
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const orderId = order.ID;
            const orderDate = order.CreatedAt;
            const orderStatus = order.Status;
            const orderItems = order.Items || [];
            const orderTotal = order.Total;

            return (
              <div key={orderId} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{orderId}</h3>
                    <p className="order-date">
                      {orderDate
                        ? new Date(orderDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Recent"}
                    </p>
                  </div>
                  <span
                    className={`order-status ${getStatusColor(orderStatus)}`}
                  >
                    {orderStatus}
                  </span>
                </div>

                <div className="order-items">
                  {orderItems.length > 0
                    ? orderItems.map((item, idx) => {
                        const itemName = item.Item?.Name || "Product";
                        const itemQuantity = item.Quantity;
                        const itemPrice = item.Item?.Price || 0;

                        return (
                          <div key={idx} className="order-item">
                            <div className="order-item-icon">🛍️</div>
                            <div className="order-item-info">
                              <h4>{itemName}</h4>
                              <p>Quantity: {itemQuantity}</p>
                            </div>
                            <div className="order-item-price">
                              Rs.{(itemPrice * itemQuantity).toFixed(2)}
                            </div>
                          </div>
                        );
                      })
                    : null}
                </div>

                <div className="order-footer">
                  <span className="order-total">
                    Total: Rs.{orderTotal?.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
