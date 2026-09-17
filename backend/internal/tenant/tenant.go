// Package tenant resolves which logical site ("tenant") a request belongs to,
// so a single backend process + single MongoDB server can serve multiple
// frontend deployments (different domains) while keeping their data,
// auth and uploads fully isolated.
//
// Tenants are declared entirely via environment variables:
//
//	TENANTS=mauro,davide
//
//	MAURO_ALLOW_ORIGIN=https://retrojourney.dev
//	MAURO_DB_NAME=retro_db_mauro
//	MAURO_JWT_SECRET=...
//	MAURO_ROOT_USERNAME=...
//	MAURO_ROOT_PASSWORD=...
//	MAURO_ROOT_EMAIL=...
//	MAURO_UPLOAD_DIR=./uploads/mauro
//	MAURO_CV_FILENAME=cv.pdf
//
//	DAVIDE_ALLOW_ORIGIN=https://davide-example.dev
//	DAVIDE_DB_NAME=retro_db_davide
//	... (same suffixes as above)
package tenant

import (
	"fmt"
	"os"
	"strings"
)

// Config holds everything that must be resolved per-tenant.
type Config struct {
	ID           string
	AllowOrigin  string
	DBName       string
	JWTSecret    string
	RootUsername string
	RootPassword string
	RootEmail    string
	UploadDir    string
	CVFilename   string
}

var (
	byID     map[string]*Config
	byOrigin map[string]*Config
)

// LoadFromEnv reads the TENANTS list and each tenant's <ID>_* variables.
// It fails fast (returns an error) if the configuration is incomplete,
// or if two tenants share the same AllowOrigin (which would make them
// indistinguishable at request time).
func LoadFromEnv() error {
	raw := os.Getenv("TENANTS")
	if raw == "" {
		return fmt.Errorf("TENANTS is not set in environment variables (expected a comma-separated list, e.g. TENANTS=mauro,davide)")
	}

	ids := strings.Split(raw, ",")
	byID = make(map[string]*Config, len(ids))
	byOrigin = make(map[string]*Config, len(ids))

	for _, rawID := range ids {
		id := strings.ToLower(strings.TrimSpace(rawID))
		if id == "" {
			continue
		}

		prefix := strings.ToUpper(id) + "_"
		cfg := &Config{
			ID:           id,
			AllowOrigin:  os.Getenv(prefix + "ALLOW_ORIGIN"),
			DBName:       os.Getenv(prefix + "DB_NAME"),
			JWTSecret:    os.Getenv(prefix + "JWT_SECRET"),
			RootUsername: os.Getenv(prefix + "ROOT_USERNAME"),
			RootPassword: os.Getenv(prefix + "ROOT_PASSWORD"),
			RootEmail:    os.Getenv(prefix + "ROOT_EMAIL"),
			UploadDir:    os.Getenv(prefix + "UPLOAD_DIR"),
			CVFilename:   os.Getenv(prefix + "CV_FILENAME"),
		}

		missing := []string{}
		if cfg.AllowOrigin == "" {
			missing = append(missing, prefix+"ALLOW_ORIGIN")
		}
		if cfg.DBName == "" {
			missing = append(missing, prefix+"DB_NAME")
		}
		if cfg.JWTSecret == "" {
			missing = append(missing, prefix+"JWT_SECRET")
		}
		if cfg.RootUsername == "" {
			missing = append(missing, prefix+"ROOT_USERNAME")
		}
		if cfg.RootPassword == "" {
			missing = append(missing, prefix+"ROOT_PASSWORD")
		}
		if cfg.RootEmail == "" {
			missing = append(missing, prefix+"ROOT_EMAIL")
		}
		if cfg.UploadDir == "" {
			missing = append(missing, prefix+"UPLOAD_DIR")
		}
		if cfg.CVFilename == "" {
			missing = append(missing, prefix+"CV_FILENAME")
		}
		if len(missing) > 0 {
			return fmt.Errorf("tenant %q is missing env variables: %s", id, strings.Join(missing, ", "))
		}

		if existing, ok := byOrigin[cfg.AllowOrigin]; ok {
			return fmt.Errorf("tenants %q and %q both declare AllowOrigin %q — origins must be unique", existing.ID, cfg.ID, cfg.AllowOrigin)
		}

		byID[id] = cfg
		byOrigin[cfg.AllowOrigin] = cfg
	}

	if len(byID) == 0 {
		return fmt.Errorf("TENANTS did not resolve to any valid tenant")
	}

	return nil
}

// All returns every configured tenant, used for startup tasks
// (index creation, root user seeding) that must run once per tenant.
func All() []*Config {
	configs := make([]*Config, 0, len(byID))
	for _, cfg := range byID {
		configs = append(configs, cfg)
	}
	return configs
}

// ByOrigin resolves a tenant from the request's Origin header.
func ByOrigin(origin string) (*Config, bool) {
	cfg, ok := byOrigin[origin]
	return cfg, ok
}

// ByID resolves a tenant by its configured id.
func ByID(id string) (*Config, bool) {
	cfg, ok := byID[id]
	return cfg, ok
}

// AllowedOrigins returns every configured AllowOrigin, for CORS setup.
func AllowedOrigins() []string {
	origins := make([]string, 0, len(byOrigin))
	for origin := range byOrigin {
		origins = append(origins, origin)
	}
	return origins
}
