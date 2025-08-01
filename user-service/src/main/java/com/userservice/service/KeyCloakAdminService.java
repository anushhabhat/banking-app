package com.userservice.service;

import com.userservice.dto.UserRegistrationRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class KeyCloakAdminService {

    @Value("${keycloak.auth-server-url}")
    private String keycloakUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.admin-client-id}")
    private String clientId;

    @Value("${keycloak.admin-client-secret}")
    private String clientSecret;

    @Value("${keycloak.admin-username}")
    private String adminUsername;

    @Value("${keycloak.admin-password}")
    private String adminPassword;

    private final RestTemplate restTemplate = new RestTemplate();

    public ResponseEntity<String> registerUser(UserRegistrationRequest request) {
        String token = getAdminToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> user = new HashMap<>();
        user.put("username", request.getUsername());
        user.put("enabled", true);
        user.put("email", request.getEmail());

        Map<String, String> credentials = new HashMap<>();
        credentials.put("type", "password");
        credentials.put("value", request.getPassword());
        credentials.put("temporary", "false");

        user.put("credentials", Collections.singletonList(credentials));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(user, headers);

        return restTemplate.postForEntity(
                keycloakUrl + "/admin/realms/" + realm + "/users",
                entity,
                String.class
        );
    }

    private String getAdminToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        Map<String, String> params = new LinkedHashMap<>();
        params.put("grant_type", "password");
        params.put("client_id", clientId);
        params.put("client_secret", clientSecret);
        params.put("username", adminUsername);
        params.put("password", adminPassword);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                keycloakUrl + "/realms/master/protocol/openid-connect/token",
                entity,
                Map.class
        );

        return (String) response.getBody().get("access_token");
    }
}
