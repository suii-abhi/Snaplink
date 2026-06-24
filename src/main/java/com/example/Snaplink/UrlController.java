package com.example.Snaplink;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
public class UrlController {

    @Autowired
    private UrlService urlService;

    // Shorten a URL
    @PostMapping("/shorten")
    public ResponseEntity<Url> shortenUrl(@RequestBody ShortenRequest request) {
        Url url = urlService.shortenUrl(
            request.getOriginalUrl(),
            request.getPassword(),
            request.getExpiryDays()
        );
        return ResponseEntity.ok(url);
    }

    // Redirect to original URL
    @GetMapping("/{code}")
    public void redirect(@PathVariable String code, HttpServletResponse response) throws IOException {
        Url url = urlService.getUrl(code);
        response.sendRedirect(url.getOriginalUrl());
    }

    // Get stats for a URL
    @GetMapping("/stats/{code}")
    public ResponseEntity<Url> getStats(@PathVariable String code) {
        Url url = urlService.getUrl(code);
        return ResponseEntity.ok(url);
    }
}