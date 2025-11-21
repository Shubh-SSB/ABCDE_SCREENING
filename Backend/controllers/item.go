package controllers

import (
	"backend/database"
	"backend/models"

	"github.com/gin-gonic/gin"
)

func CreateItem(c *gin.Context) {
	var body models.Item
	if err := c.BindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": "Invalid payload"})
		return
	}

	item := models.Item{
		Name:   body.Name,
		Status: body.Status,
		Price:  body.Price,
	}

	database.DB.Create(&item)
	c.JSON(200, item)
}

func ListItems(c *gin.Context) {
	var items []models.Item
	database.DB.Find(&items)
	c.JSON(200, items)
}
