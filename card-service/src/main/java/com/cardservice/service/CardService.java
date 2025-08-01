package com.cardservice.service;

import com.cardservice.model.Card;
import com.cardservice.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository repo;
    private final KafkaTemplate<String, String> kafka;

    public Card issueCard(Card card) {
        card.setIssuedDate(LocalDate.now());
        card.setStatus("ACTIVE");
        Card saved = repo.save(card);
        kafka.send("cards-topic", "Card issued: " + saved.getCardNumber() + " for account " + card.getAccountNumber());
        return saved;
    }

    public List<Card> getByAccount(String accountNumber) {
        return repo.findByAccountNumber(accountNumber);
    }
}
