package com.example.Snaplink;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import jakarta.servlet.http.HttpServletResponse;

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
public void redirect(
        @PathVariable String code,
        @RequestParam(required = false) String password,
        HttpServletResponse response) throws IOException {

    Url url = urlService.getUrl(code);

    // Check password if set
    if (url.getPassword() != null && !url.getPassword().isEmpty()) {
        if (password == null || !password.equals(url.getPassword())) {
            response.sendError(401, "Password required or incorrect");
            return;
        }
    }

    response.sendRedirect(url.getOriginalUrl());
}

    // Get stats for a URL
    @GetMapping("/stats/{code}")
    public ResponseEntity<Url> getStats(@PathVariable String code) {
        Url url = urlService.getUrl(code);
        return ResponseEntity.ok(url);
    }
    @GetMapping(value = "/qr/{code}", produces = MediaType.IMAGE_PNG_VALUE)
public byte[] generateQR(@PathVariable String code) throws Exception {
    Url url = urlService.getUrl(code);
    String shortUrl = "http://localhost:8080/" + code;

    QRCodeWriter qrCodeWriter = new QRCodeWriter();
    BitMatrix bitMatrix = qrCodeWriter.encode(shortUrl, BarcodeFormat.QR_CODE, 300, 300);

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

    return outputStream.toByteArray();
}
}