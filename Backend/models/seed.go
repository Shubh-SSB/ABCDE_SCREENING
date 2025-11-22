package database

import "backend/models"

func Seed() {
    items := []models.Item{
        {Name: "Phone", Status: "in-stock", Price: 12000},
        {Name: "Laptop", Status: "out-of-stock", Price: 45000},
        {Name: "Mouse", Status: "in-stock", Price: 799},
        {Name: "Keyboard", Status: "in-stock", Price: 1499},
        {Name: "Monitor", Status: "in-stock", Price: 8500},
    }

    for _, item := range items {
        database.DB.FirstOrCreate(&item, models.Item{Name: item.Name})
    }
}
