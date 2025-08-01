package com.cardservice.controller;

import com.cardservice.model.Card;
import com.cardservice.service.CardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService service;

    @PostMapping
    public Card issue(@RequestBody Card card) {
        return service.issueCard(card);
    }

    @GetMapping("/{accountNumber}")
    public List<Card> getCards(@PathVariable String accountNumber) {
        return service.getByAccount(accountNumber);
    }
}
