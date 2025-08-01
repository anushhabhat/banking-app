package com.userservice.controller;

import com.userservice.dto.UserRegistrationRequest;
import com.userservice.service.KeyCloakAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserRegistrationController {

    @Autowired
    private KeyCloakAdminService keycloakAdminService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserRegistrationRequest request) {
        return keycloakAdminService.registerUser(request);
    }
}
