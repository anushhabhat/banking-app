package com.cardservice.repository;

import com.cardservice.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByAccountNumber(String accountNumber);
}
