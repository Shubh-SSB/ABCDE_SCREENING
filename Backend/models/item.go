package models

import "time"

type Item struct {
	ID        uint `gorm:"primaryKey"`
	Name      string
	Status    string
	Price     float64
	CreatedAt time.Time
}
