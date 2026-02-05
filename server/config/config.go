package config

import (
	"log"
	"strings"

	"github.com/spf13/viper"
)

// Config holds all configuration for the application.
type Config struct {
	Port           string `mapstructure:"PORT"`
	ListenAddress  string `mapstructure:"LISTEN_ADDRESS"`
	EncryptionKey  string `mapstructure:"ENCRYPTION_KEY"`
	JWTSecret      string `mapstructure:"JWT_SECRET"`
	GoogleClientID string `mapstructure:"GOOGLE_CLIENT_ID"`
	AppURL         string `mapstructure:"APP_URL"`
	TestMode       bool   `mapstructure:"TEST_MODE"`
	TestHousehold  string `mapstructure:"TEST_HOUSEHOLD_ID"`

	// Database
	DBHost     string `mapstructure:"DB_HOST"`
	DBUser     string `mapstructure:"DB_USER"`
	DBPassword string `mapstructure:"DB_PASSWORD"`
	DBName     string `mapstructure:"DB_NAME"`
	DBPort     string `mapstructure:"DB_PORT"`

	// SMTP
	SMTPHost string `mapstructure:"SMTP_HOST"`
	SMTPPort string `mapstructure:"SMTP_PORT"`
	SMTPUser string `mapstructure:"SMTP_USER"`
	SMTPPass string `mapstructure:"SMTP_PASS"`
	SMTPFrom string `mapstructure:"SMTP_FROM"`
}

// LoadConfig loads configuration from environment variables and/or a config file.
func LoadConfig(path string) (*Config, error) {
	viper.SetEnvPrefix("KEDA")
	viper.AutomaticEnv()

	// Replace dots with underscores in env vars
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	// Set defaults
	viper.SetDefault("PORT", "8080")
	viper.SetDefault("LISTEN_ADDRESS", "0.0.0.0")
	viper.SetDefault("DB_HOST", "localhost")
	viper.SetDefault("DB_PORT", "5432")
	viper.SetDefault("DB_USER", "postgres")
	viper.SetDefault("DB_NAME", "keda")
	viper.SetDefault("SMTP_PORT", "1025")
	viper.SetDefault("SMTP_FROM", "noreply@keda.local")

	if path != "" {
		viper.SetConfigFile(path)
		if err := viper.ReadInConfig(); err != nil {
			log.Printf("Warning: Config file not found at %s. Using environment variables.", path)
		} else {
			log.Printf("Using config file: %s", viper.ConfigFileUsed())
		}
	}

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, err
	}

	return &config, nil
}
