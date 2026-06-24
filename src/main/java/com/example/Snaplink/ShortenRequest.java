package com.example.Snaplink;

public class ShortenRequest {
    private String originalUrl;
    private String password;
    private int expiryDays;

    public String getOriginalUrl() { return originalUrl; }
    public void setOriginalUrl(String originalUrl) { this.originalUrl = originalUrl; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public int getExpiryDays() { return expiryDays; }
    public void setExpiryDays(int expiryDays) { this.expiryDays = expiryDays; }
}