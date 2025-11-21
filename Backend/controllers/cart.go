package controllers

import (
	"backend/database"
	"backend/models"

	"github.com/gin-gonic/gin"
)

func AddToCart(c *gin.Context) {

	user := c.MustGet("user").(models.User)

	var req struct {
		ItemID uint `json:"itemId"`
	}
	c.BindJSON(&req)

	var cart models.Cart
	if user.CartID == nil {
		cart = models.Cart{UserID: user.ID, Status: "active", Name: "My Cart"}
		database.DB.Create(&cart)

		user.CartID = &cart.ID
		database.DB.Save(&user)
	} else {
		database.DB.First(&cart, *user.CartID)
	}

	cartItem := models.CartItem{CartID: cart.ID, ItemID: req.ItemID}
	database.DB.Create(&cartItem)

	c.JSON(200, gin.H{"message": "Item added to cart"})
}

func ListCarts(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	if user.CartID == nil {
		c.JSON(200, []models.Cart{})
		return
	}

	var cart models.Cart
	res := database.DB.
		Where("id = ? AND user_id = ?", *user.CartID, user.ID).
		Preload("Items.Item").
		First(&cart)

	if res.RowsAffected == 0 {
		c.JSON(200, []models.Cart{})
		return
	}
	c.JSON(200, []models.Cart{cart})
}

func RemoveFromCart(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var req struct {
		ItemID uint `json:"itemId"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	if user.CartID == nil {
		c.JSON(400, gin.H{"error": "No active cart"})
		return
	}

	var cart models.Cart
	database.DB.First(&cart, *user.CartID)
	if cart.ID == 0 || cart.UserID != user.ID {
		c.JSON(404, gin.H{"error": "Cart not found"})
		return
	}

	res := database.DB.Where("cart_id = ? AND item_id = ?", cart.ID, req.ItemID).Delete(&models.CartItem{})
	if res.RowsAffected == 0 {
		c.JSON(404, gin.H{"error": "Item not found in cart"})
		return
	}

	c.JSON(200, gin.H{"message": "Item removed from cart"})
}
