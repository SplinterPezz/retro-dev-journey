package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

const (
	CVDirectory = "./uploads"
	CVFilename  = "pezzati_mauro_developer.pdf"
	MaxFileSize = 5 * 1024 * 1024
)

func DownloadCV(c *gin.Context) {
	cvPath := filepath.Join(CVDirectory, CVFilename)

	if _, err := os.Stat(cvPath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"message": "CV file not found"})
		return
	}

	c.Header("Content-Type", "application/pdf")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", CVFilename))
	c.Header("Content-Transfer-Encoding", "binary")
	c.Header("Cache-Control", "no-cache")

	c.File(cvPath)
}

func UploadCV(c *gin.Context) {
	file, err := c.FormFile("cv")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "No file uploaded"})
		return
	}

	if file.Size > MaxFileSize {
		c.JSON(http.StatusBadRequest, gin.H{"message": "File size exceeds 5MB limit"})
		return
	}

	if filepath.Ext(file.Filename) != ".pdf" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Only PDF files are allowed"})
		return
	}

	if err := os.MkdirAll(CVDirectory, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create upload directory"})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to open uploaded file"})
		return
	}
	defer src.Close()

	// Validate MIME type by reading file header
	buffer := make([]byte, 512)
	_, err = src.Read(buffer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to read file"})
		return
	}

	src.Close()
	src, err = file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to reopen file"})
		return
	}
	defer src.Close()

	contentType := http.DetectContentType(buffer)
	if contentType != "application/pdf" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "File is not a valid PDF"})
		return
	}

	cvPath := filepath.Join(CVDirectory, CVFilename)

	dst, err := os.Create(cvPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create destination file"})
		return
	}
	defer dst.Close()

	_, err = io.Copy(dst, src)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to save file"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "CV uploaded successfully",
		"filename": CVFilename,
		"size":     file.Size,
	})
}

func copyFile(src, dst string) error {
	sourceFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	destFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer destFile.Close()

	_, err = io.Copy(destFile, sourceFile)
	return err
}
