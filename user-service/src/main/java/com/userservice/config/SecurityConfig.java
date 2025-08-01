package com.userservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
          .authorizeRequests(authz -> authz
            .requestMatchers("/api/users/me").hasRole("USER")
            .anyRequest().authenticated()
          )
          .oauth2ResourceServer().jwt();
        return http.build();
    }
}
