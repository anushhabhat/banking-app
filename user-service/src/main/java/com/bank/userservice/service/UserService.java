package com.bank.userservice.service;


import java.util.List;

import com.bank.common.dto.AuthRequest;
import com.bank.common.dto.AuthResponse;
import com.bank.common.dto.SignUpRequest;
import com.bank.common.dto.UserDTO;


public interface UserService {
	public UserDTO createUser(SignUpRequest userDTO) ;

	public UserDTO getUser(Long id) ;

	public AuthResponse authenticate(AuthRequest authRequest);
	public void deleteUser(Long id);

	public List<UserDTO> getAllUsers();
}