package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	r.POST("/users", controllers.CreateUser)
	r.POST("/users/login", controllers.Login)
	r.GET("/users", controllers.ListUsers)

	r.GET("/items", controllers.ListItems)
	r.POST("/items", controllers.CreateItem)

	auth := r.Group("/")
	auth.Use(middleware.AuthMiddleware())

	auth.POST("/carts", controllers.AddToCart)
	auth.GET("/carts", controllers.ListCarts)
	auth.DELETE("/carts", controllers.RemoveFromCart)

	auth.POST("/orders", controllers.Checkout)
	auth.GET("/orders", controllers.ListOrders)
}
