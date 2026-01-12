package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/schoren/family-finance/server/app"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	db *gorm.DB
)

func main() {
	r := gin.Default()

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	initDB()

	// Initialize handlers
	handlers := app.NewHandlers(db)

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// Legacy sync endpoint (for backwards compatibility)
	r.GET("/sync", handlers.HandleSync)

	// Categories
	r.GET("/categories", handlers.GetCategories)
	r.POST("/categories", handlers.CreateCategory)
	r.PUT("/categories/:id", handlers.UpdateCategory)
	r.DELETE("/categories/:id", handlers.DeleteCategory)

	// Accounts
	r.GET("/accounts", handlers.GetAccounts)
	r.POST("/accounts", handlers.CreateAccount)
	r.PUT("/accounts/:id", handlers.UpdateAccount)
	r.DELETE("/accounts/:id", handlers.DeleteAccount)

	// Transactions
	r.GET("/transactions", handlers.GetTransactions)
	r.POST("/transactions", handlers.CreateTransaction)
	r.PUT("/transactions/:id", handlers.UpdateTransaction)
	r.DELETE("/transactions/:id", handlers.DeleteTransaction)

	// Monthly summary
	r.GET("/summary/:month", handlers.GetMonthlySummary)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8090"
	}
	log.Printf("Server running on port %s", port)
	r.Run(":" + port)
}

func initDB() {
	var err error
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Could not connect to database: %v", err)
	}

	log.Println("Successfully connected to database")

	// Run GORM Migrations
	if err := db.AutoMigrate(app.Entities...); err != nil {
		log.Fatalf("Could not run migrations: %v", err)
	}
}

