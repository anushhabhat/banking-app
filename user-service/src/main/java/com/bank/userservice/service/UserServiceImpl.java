package com.bank.userservice.service;

import com.bank.common.dto.AuthRequest;
import com.bank.common.dto.AuthResponse;
import com.bank.common.dto.SignUpRequest;
import com.bank.common.dto.UserDTO;
import com.bank.userservice.mapper.UserMapper;
import com.bank.userservice.model.User;
import com.bank.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    
    @Transactional
    public UserDTO createUser(SignUpRequest signUpRequest) {
        if (userRepository.findByUsername(signUpRequest.getUsername()) != null) {
            throw new IllegalArgumentException("Username already exists");
        }
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setEmail(signUpRequest.getEmail());
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        user.setRoles("ROLE_USER"); // Default role
        user = userRepository.save(user);

        UserDTO userDTO = userMapper.toDTO(user);
        return userDTO;
    }

    public UserDTO getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + id + " not found"));
        UserDTO userDTO = userMapper.toDTO(user);
        return userDTO;
    }

    public AuthResponse authenticate(AuthRequest authRequest) {
        User user = userRepository.findByUsername(authRequest.getUsername());
        if (user == null || !passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
            throw new SecurityException("Invalid username or password");
        }

        UserDTO userDTO = userMapper.toDTO(user);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setUser(userDTO);
        authResponse.setToken("jwt-token-" + user.getId()); // Placeholder for JWT
        return authResponse;
    }
    
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + id + " not found"));
        userRepository.delete(user);
        // Database ON DELETE CASCADE handles account deletion
    }
}