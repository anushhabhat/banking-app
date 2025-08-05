package com.bank.userservice.controller;



import java.util.List;
import java.util.logging.Logger;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bank.common.dto.AuthRequest;
import com.bank.common.dto.AuthResponse;
import com.bank.common.dto.SignUpRequest;
import com.bank.common.dto.UserDTO;
import com.bank.userservice.service.UserService;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<UserDTO> signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(signUpRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable(name="id") Long id) {
        return ResponseEntity.ok(userService.getUser(id));
    }
    
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signIn(@Valid @RequestBody AuthRequest authRequest) {
        System.out.println("Authentication request: " + authRequest);
        return ResponseEntity.ok(userService.authenticate(authRequest));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable(name="id") Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

}