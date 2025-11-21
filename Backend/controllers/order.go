package controllers

import (
	"backend/database"
	"backend/models"
	"time"

	"github.com/gin-gonic/gin"
)

func Checkout(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	if user.CartID == nil {
		c.JSON(400, gin.H{"error": "Cart is empty"})
		return
	}

	order := models.Order{
		CartID: *user.CartID,
		UserID: user.ID,
	}

	database.DB.Create(&order)

	user.CartID = nil
	database.DB.Save(&user)

	c.JSON(200, gin.H{
		"message": "Order successful!",
		"orderId": order.ID,
	})
}

func ListOrders(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var orders []models.Order
	database.DB.
		Where("user_id = ?", user.ID).
		Find(&orders)

	type OrderWithTotal struct {
		ID        uint      `json:"id"`
		CartID    uint      `json:"cartId"`
		UserID    uint      `json:"userId"`
		CreatedAt time.Time `json:"createdAt"`
		Total     float64   `json:"total"`
	}

	var resp []OrderWithTotal

	for _, o := range orders {
		var total float64
		database.DB.
			Table("cart_items").
			Select("COALESCE(SUM(items.price), 0)").
			Joins("JOIN items ON items.id = cart_items.item_id").
			Where("cart_items.cart_id = ?", o.CartID).
			Scan(&total)

		resp = append(resp, OrderWithTotal{
			ID:        o.ID,
			CartID:    o.CartID,
			UserID:    o.UserID,
			CreatedAt: o.CreatedAt,
			Total:     total,
		})
	}

	c.JSON(200, resp)
}
