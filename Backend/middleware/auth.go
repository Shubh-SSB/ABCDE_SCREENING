package middleware

import (
	"backend/database"
	"backend/models"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")

		if token == "" {
			c.JSON(401, gin.H{"error": "Missing token"})
			c.Abort()
			return
		}

		var user models.User
		database.DB.Where("token = ?", token).First(&user)

		if user.ID == 0 {
			c.JSON(401, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		c.Set("user", user)
		c.Next()
	}
}
