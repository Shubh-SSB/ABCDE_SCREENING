package models

import "time"

type User struct {
	ID        uint   `gorm:"primaryKey"`
	Username  string `gorm:"unique"`
	Password  string
	Token     string
	CartID    *uint
	CreatedAt time.Time
}
