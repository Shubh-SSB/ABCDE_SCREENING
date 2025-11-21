package models

type CartItem struct {
	ID     uint `gorm:"primaryKey"`
	CartID uint
	ItemID uint
	Item   Item `gorm:"foreignKey:ItemID"`
}
