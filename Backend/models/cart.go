package models

import "time"

type Cart struct {
	ID        uint `gorm:"primaryKey"`
	UserID    uint
	Name      string
	Status    string
	Items     []CartItem
	CreatedAt time.Time
}
