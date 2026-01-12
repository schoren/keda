package app

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Handlers struct {
	db *gorm.DB
}

func NewHandlers(db *gorm.DB) *Handlers {
	return &Handlers{db: db}
}

// ============================================================================
// HOUSEHOLDS
// ============================================================================

func (h *Handlers) CreateHousehold(c *gin.Context) {
	var household Household
	if err := c.ShouldBindJSON(&household); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Create(&household).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create household"})
		return
	}

	c.JSON(http.StatusCreated, household)
}

// ============================================================================
// CATEGORIES
// ============================================================================

func (h *Handlers) GetCategories(c *gin.Context) {
	householdID := c.Param("household_id")
	var categories []Category
	if err := h.db.Where("household_id = ?", householdID).Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}
	c.JSON(http.StatusOK, categories)
}

func (h *Handlers) CreateCategory(c *gin.Context) {
	householdID := c.Param("household_id")
	var category Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	category.HouseholdID = householdID
	if err := h.db.Create(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create category"})
		return
	}

	c.JSON(http.StatusCreated, category)
}

func (h *Handlers) UpdateCategory(c *gin.Context) {
	householdID := c.Param("household_id")
	id := c.Param("id")

	var category Category
	if err := h.db.Where("household_id = ?", householdID).First(&category, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	var updates Category
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update fields
	category.Name = updates.Name
	category.MonthlyBudget = updates.MonthlyBudget
	category.IsActive = updates.IsActive

	if err := h.db.Save(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update category"})
		return
	}

	c.JSON(http.StatusOK, category)
}

func (h *Handlers) DeleteCategory(c *gin.Context) {
	householdID := c.Param("household_id")
	id := c.Param("id")

	if err := h.db.Where("household_id = ?", householdID).Delete(&Category{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete category"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Category deleted"})
}

// ============================================================================
// ACCOUNTS
// ============================================================================

func (h *Handlers) GetAccounts(c *gin.Context) {
	householdID := c.Param("household_id")
	var accounts []Account
	if err := h.db.Where("household_id = ?", householdID).Find(&accounts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch accounts"})
		return
	}
	c.JSON(http.StatusOK, accounts)
}

func (h *Handlers) CreateAccount(c *gin.Context) {
	householdID := c.Param("household_id")
	var account Account
	if err := c.ShouldBindJSON(&account); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	account.HouseholdID = householdID
	if err := h.db.Create(&account).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create account"})
		return
	}

	c.JSON(http.StatusCreated, account)
}

func (h *Handlers) UpdateAccount(c *gin.Context) {
	householdID := c.Param("household_id")
	id := c.Param("id")

	var account Account
	if err := h.db.Where("household_id = ?", householdID).First(&account, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Account not found"})
		return
	}

	var updates Account
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update fields
	account.Type = updates.Type
	account.Name = updates.Name
	account.Brand = updates.Brand
	account.Bank = updates.Bank

	if err := h.db.Save(&account).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update account"})
		return
	}

	c.JSON(http.StatusOK, account)
}

func (h *Handlers) DeleteAccount(c *gin.Context) {
	householdID := c.Param("household_id")
	id := c.Param("id")

	if err := h.db.Where("household_id = ?", householdID).Delete(&Account{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete account"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Account deleted"})
}

// ============================================================================
// TRANSACTIONS
// ============================================================================

func (h *Handlers) GetTransactions(c *gin.Context) {
	householdID := c.Param("household_id")
	monthStr := c.Query("month")
	var transactions []Transaction

	query := h.db.Where("household_id = ?", householdID)
	if monthStr != "" {
		parsed, err := time.Parse("2006-01", monthStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month format. Use YYYY-MM"})
			return
		}
		startOfMonth := parsed
		endOfMonth := startOfMonth.AddDate(0, 1, 0)
		query = query.Where("date >= ? AND date < ?", startOfMonth, endOfMonth)
	}

	if err := query.Find(&transactions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch transactions"})
		return
	}

	c.JSON(http.StatusOK, transactions)
}

func (h *Handlers) CreateTransaction(c *gin.Context) {
	householdID := c.Param("household_id")
	var transaction Transaction
	if err := c.ShouldBindJSON(&transaction); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	transaction.HouseholdID = householdID
	if err := h.db.Create(&transaction).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create transaction"})
		return
	}

	c.JSON(http.StatusCreated, transaction)
}

func (h *Handlers) UpdateTransaction(c *gin.Context) {
	householdID := c.Param("household_id")
	id := c.Param("id")

	var transaction Transaction
	if err := h.db.Where("household_id = ?", householdID).First(&transaction, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found"})
		return
	}

	var updates Transaction
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update fields
	transaction.AccountID = updates.AccountID
	transaction.CategoryID = updates.CategoryID
	transaction.Amount = updates.Amount
	transaction.Date = updates.Date
	transaction.Description = updates.Description

	if err := h.db.Save(&transaction).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update transaction"})
		return
	}

	c.JSON(http.StatusOK, transaction)
}

func (h *Handlers) DeleteTransaction(c *gin.Context) {
	householdID := c.Param("household_id")
	id := c.Param("id")

	if err := h.db.Where("household_id = ?", householdID).Delete(&Transaction{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Transaction deleted"})
}

// ============================================================================
// MONTHLY SUMMARY
// ============================================================================

type CategorySummary struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	Budget    float64 `json:"budget"`
	Spent     float64 `json:"spent"`
	Remaining float64 `json:"remaining"`
}

type MonthlySummary struct {
	Month       string            `json:"month"`
	TotalBudget float64           `json:"total_budget"`
	TotalSpent  float64           `json:"total_spent"`
	Categories  []CategorySummary `json:"categories"`
}

func (h *Handlers) GetMonthlySummary(c *gin.Context) {
	householdID := c.Param("household_id")
	monthStr := c.Param("month")
	if monthStr == "" {
		now := time.Now()
		monthStr = now.Format("2006-01")
	}

	parsed, err := time.Parse("2006-01", monthStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month format. Use YYYY-MM"})
		return
	}

	startOfMonth := parsed
	endOfMonth := startOfMonth.AddDate(0, 1, 0)

	// Get all categories for this household
	var categories []Category
	if err := h.db.Where("household_id = ?", householdID).Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	// Calculate summary for each category
	var categorySummaries []CategorySummary
	var totalBudget, totalSpent float64

	for _, cat := range categories {
		var spent float64
		h.db.Model(&Transaction{}).
			Where("category_id = ? AND date >= ? AND date < ?", cat.ID, startOfMonth, endOfMonth).
			Select("COALESCE(SUM(amount), 0)").
			Scan(&spent)

		categorySummaries = append(categorySummaries, CategorySummary{
			ID:        cat.ID,
			Name:      cat.Name,
			Budget:    cat.MonthlyBudget,
			Spent:     spent,
			Remaining: cat.MonthlyBudget - spent,
		})

		totalBudget += cat.MonthlyBudget
		totalSpent += spent
	}

	summary := MonthlySummary{
		Month:       monthStr,
		TotalBudget: totalBudget,
		TotalSpent:  totalSpent,
		Categories:  categorySummaries,
	}

	c.JSON(http.StatusOK, summary)
}

// ============================================================================
// SYNC (Legacy endpoint - keep for backwards compatibility)
// ============================================================================

func (h *Handlers) HandleSync(c *gin.Context) {
	householdID := c.Param("household_id")
	monthStr := c.Query("month")
	var startOfMonth, endOfMonth time.Time
	now := time.Now()

	if monthStr == "" {
		startOfMonth = time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, time.UTC)
	} else {
		parsed, err := time.Parse("2006-01", monthStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month format. Use YYYY-MM"})
			return
		}
		startOfMonth = parsed
	}
	endOfMonth = startOfMonth.AddDate(0, 1, 0)

	var accounts []Account
	if err := h.db.Where("household_id = ?", householdID).Find(&accounts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch accounts"})
		return
	}

	var categories []Category
	if err := h.db.Where("household_id = ?", householdID).Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	var transactions []Transaction
	if err := h.db.Where("household_id = ? AND date >= ? AND date < ?", householdID, startOfMonth, endOfMonth).Find(&transactions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch transactions"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"accounts":     accounts,
		"categories":   categories,
		"transactions": transactions,
	})
}
