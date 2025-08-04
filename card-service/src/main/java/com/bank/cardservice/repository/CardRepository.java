package com.bank.cardservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bank.cardservice.model.Card;

public interface CardRepository extends JpaRepository<Card, Long> {
	List<Card>findByAccount(Long id);
	Optional<Card> findByCardNumber(String cardNumber);
}
