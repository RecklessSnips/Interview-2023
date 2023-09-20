package com.example.interview2023.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class pageController {

    @GetMapping("/easy")
    public String easy(){
        return "easy";
    }

    @GetMapping("/medium")
    public String medium(){
        return "medium";
    }

    @GetMapping("/hard")
    public String hard(){
        return "hard";
    }

    @GetMapping("/congrats")
    public String congrats(){
        return "congrats";
    }

    @GetMapping("/start")
    public String start(){
        return "start";
    }
}
