package com.bank.cardservice.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bank.cardservice.service.CardService;
import com.bank.common.dto.CardRequestDTO;
import com.bank.common.dto.CardResponseDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/cards")
public class CardController {

    @Autowired
    private CardService cardService;

    @PostMapping
    public ResponseEntity<CardResponseDTO> createCard(@Valid @RequestBody CardRequestDTO cardRequestDTO) {
        CardResponseDTO response = cardService.createCard(cardRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response); // or status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CardResponseDTO>> getAllCards() {
        List<CardResponseDTO> cards = cardService.getAllCards();
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardResponseDTO> getCardById(@PathVariable(name="id") Long id) {
        Optional<CardResponseDTO> optionalCard = cardService.getCardById(id);
        return optionalCard
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<List<CardResponseDTO>> getCardsByAccountId(@PathVariable(name="accountNumber") String accountNumber) {
    	 	if (!accountNumber.matches("\\d{12}")) {
    	        throw new IllegalArgumentException("Account number must be of 12 digits.");
    	    }
        List<CardResponseDTO> cards = cardService.getCardsByAccountNumber(accountNumber);
        return ResponseEntity.ok(cards);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CardResponseDTO> updateCard(
            @PathVariable(name="id") Long id,
            @RequestBody CardRequestDTO cardRequestDTO) {
        CardResponseDTO updatedCard = cardService.updateCard(id, cardRequestDTO);
        return ResponseEntity.ok(updatedCard);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCard(@PathVariable(name="id") Long id) {
        cardService.deleteCard(id);
        return ResponseEntity.noContent().build();
    }
    @DeleteMapping("/account/{accountId}")
    public ResponseEntity<Void> deleteCardsByAccountNumber(@PathVariable(name="accountId") Long accountId) {
        cardService.deleteCardsByAccountId(accountId);
        return ResponseEntity.noContent().build();
    }

}
