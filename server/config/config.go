package config

import (
	"log"
	"strings"

	"github.com/spf13/viper"
)

// Config holds all configuration for the application.
type Config struct {
	Port           string `mapstructure:"port"`
	ListenAddress  string `mapstructure:"listen_address"`
	EncryptionKey  string `mapstructure:"encryption_key"`
	JWTSecret      string `mapstructure:"jwt_secret"`
	GoogleClientID string `mapstructure:"google_client_id"`
	AppURL         string `mapstructure:"app_url"`
	TestMode       bool   `mapstructure:"test_mode"`
	TestHousehold  string `mapstructure:"test_household_id"`

	// Database
	DBHost     string `mapstructure:"db_host"`
	DBUser     string `mapstructure:"db_user"`
	DBPassword string `mapstructure:"db_password"`
	DBName     string `mapstructure:"db_name"`
	DBPort     string `mapstructure:"db_port"`

	// SMTP
	SMTPHost string `mapstructure:"smtp_host"`
	SMTPPort string `mapstructure:"smtp_port"`
	SMTPUser string `mapstructure:"smtp_user"`
	SMTPPass string `mapstructure:"smtp_pass"`
	SMTPFrom string `mapstructure:"smtp_from"`
}

// LoadConfig loads configuration from environment variables and/or a config file.
func LoadConfig(path string) (*Config, error) {
	viper.SetEnvPrefix("KEDA")
	viper.AutomaticEnv()

	// Replace dots with underscores in env vars
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	// Set defaults
	viper.SetDefault("port", "8080")
	viper.SetDefault("listen_address", "0.0.0.0")
	viper.SetDefault("encryption_key", "")
	viper.SetDefault("jwt_secret", "")
	viper.SetDefault("google_client_id", "")
	viper.SetDefault("app_url", "")
	viper.SetDefault("test_mode", false)
	viper.SetDefault("test_household_id", "")
	viper.SetDefault("db_host", "localhost")
	viper.SetDefault("db_user", "postgres")
	viper.SetDefault("db_password", "")
	viper.SetDefault("db_name", "keda")
	viper.SetDefault("db_port", "5432")
	viper.SetDefault("smtp_host", "")
	viper.SetDefault("smtp_port", "1025")
	viper.SetDefault("smtp_user", "")
	viper.SetDefault("smtp_pass", "")
	viper.SetDefault("smtp_from", "noreply@keda.local")

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
