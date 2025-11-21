package controllers

import (
	"backend/database"
	"backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func CreateUser(c *gin.Context) {
	var body models.User
	if err := c.BindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": "Invalid payload"})
		return
	}

	user := models.User{
		Username: body.Username,
		Password: body.Password,
	}
	database.DB.Create(&user)

	token := uuid.New().String()
	user.Token = token
	database.DB.Save(&user)

	c.JSON(200, gin.H{
		"message": "Signup successful",
		"userId":  user.ID,
		"token":   token,
	})
}

func ListUsers(c *gin.Context) {
	var users []models.User
	database.DB.Find(&users)
	c.JSON(200, users)
}

func Login(c *gin.Context) {
	var body models.User
	c.BindJSON(&body)

	var user models.User
	database.DB.Where("username = ?", body.Username).First(&user)

	if user.ID == 0 || user.Password != body.Password {
		c.JSON(401, gin.H{"error": "Invalid username/password"})
		return
	}

	token := uuid.New().String()
	user.Token = token
	database.DB.Save(&user)

	c.JSON(200, gin.H{
		"message": "Login successful",
		"token":   token,
		"userId":  user.ID,
	})
}
