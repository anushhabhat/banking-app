package com.bank.cardservice.service;



import com.bank.cardservice.config.AccountClient;

import com.bank.cardservice.exceptionHandler.ResourceNotFoundException;
import com.bank.cardservice.mapper.CardMapper;
import com.bank.cardservice.model.Card;
import com.bank.cardservice.model.Card.CardIssuer;
import com.bank.cardservice.model.Card.CardType;
import com.bank.cardservice.repository.CardRepository;
import com.bank.common.dto.AccountDTO;
import com.bank.common.dto.CardRequestDTO;
import com.bank.common.dto.CardResponseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class CardService {

    @Autowired
    private CardRepository cardRepository;
    
    @Autowired
    private AccountClient accountClient;

    private final Random random = new Random();

    public CardResponseDTO createCard(CardRequestDTO cardRequestDTO) {
        // Fetch account using Feign client
        AccountDTO account = accountClient.getAccountByAccountNumber(cardRequestDTO.getAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with account number: " + cardRequestDTO.getAccountNumber()));

        // Auto-generate 3-digit CVV
        String cvv = String.format("%03d", random.nextInt(1000));


        // Set expiry date to 3 years from now
        LocalDate issueDate = LocalDate.now();
        LocalDate expiryDate = issueDate.plusYears(3);

        // Create card entity (cardNumber needs to be generated)
        String cardNumber = generateCardNumber(); 
        Card card = Card.builder()
        		.account(account.getId())
        		.cardName(cardRequestDTO.getCardName())
        		.cardNumber(cardNumber)
        		.cardExpiry(expiryDate)
        		.cvvNumber(cvv)
        		.cardType(parseCardType(cardRequestDTO.getCardType()))
        		.cardIssuer(parseCardIssuer(cardRequestDTO.getCardIssuerCompany()))
        		.build();
        		
        card=cardRepository.save(card);
        return CardMapper.toDTO(card);
    }
    public CardType parseCardType(String input) {
        try {
            return CardType.valueOf(input.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid card type: " + input);
        }
    }
    public CardIssuer parseCardIssuer(String input) {
        try {
            return CardIssuer.valueOf(input.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid Issuer : " + input);
        }
    }
    public List<CardResponseDTO> getAllCards() {
        return cardRepository.findAll().stream()
        			.map(CardMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<CardResponseDTO> getCardById(Long id) {
        return cardRepository.findById(id)
                .map(CardMapper::toDTO);
    }

    public Optional<CardResponseDTO> getCardByCardNumber(String cardNumber) {
    		
        return cardRepository.findByCardNumber(cardNumber)
                .map(CardMapper::toDTO);
    }

    public List<CardResponseDTO> getCardsByAccountNumber(String accountNumber) {
        AccountDTO account = accountClient.getAccountByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with account number: " + accountNumber));

        return cardRepository.findByAccount(account.getId()).stream()
                .map(CardMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CardResponseDTO updateCard(Long id, CardRequestDTO cardRequestDTO) {
        return cardRepository.findById(id).map(card -> {
            // Update card details
            card.setCardName(cardRequestDTO.getCardName());

            return CardMapper.toDTO(cardRepository.save(card)); // Use your mapper here
        }).orElseThrow(() -> new ResourceNotFoundException("Card not found"));
    }
    
    public void deleteCardsByAccountId(Long accountId) {
        List<Card> cards = cardRepository.findByAccount(accountId); // If account is a String
        cardRepository.deleteAll(cards);
    }


    public void deleteCard(Long id) {
        cardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found"));
        cardRepository.deleteById(id);
    }

    // Placeholder method to generate card number (customize as needed)
    private String generateCardNumber() {
    		StringBuilder sb=new StringBuilder();
    		for(int i=0;i<16;i++) {
    			sb.append(random.nextInt(10));
    		}
        return  sb.toString();
    }
}
