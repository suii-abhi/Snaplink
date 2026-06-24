package com.example.Snaplink;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UrlService {

    @Autowired
    private UrlRepository urlRepository;

    public Url shortenUrl(String originalUrl, String password, int expiryDays) {
        
        // Validate URL
        if (originalUrl == null || originalUrl.isEmpty()) {
            throw new RuntimeException("URL cannot be empty");
        }
        if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
            throw new RuntimeException("URL must start with http:// or https://");
        }

        Url url = new Url();
        url.setOriginalUrl(originalUrl);
        url.setShortCode(generateCode());
        
        if (password != null && !password.isEmpty()) {
            url.setPassword(password);
        }
        
        if (expiryDays > 0) {
            url.setExpiresAt(LocalDateTime.now().plusDays(expiryDays));
        }
        
        return urlRepository.save(url);
    }

public Url getUrl(String shortCode) {
    Url url = urlRepository.findByShortCode(shortCode)
        .orElseThrow(() -> new RuntimeException("URL not found"));
    
    // Increment click count every time URL is visited
    url.setClickCount(url.getClickCount() + 1);
    urlRepository.save(url);
    
    return url;
}

    private String generateCode() {
        return UUID.randomUUID().toString().substring(0, 6);
    }
}