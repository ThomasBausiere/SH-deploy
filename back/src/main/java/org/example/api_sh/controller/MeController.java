package org.example.api_sh.controller;

import org.example.api_sh.dto.UserDto;
import org.example.api_sh.entity.UserApp;
import org.example.api_sh.exeception.NotFoundException;
import org.example.api_sh.repository.UserAppRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/private")
public class MeController {

    private final UserAppRepository users;

    public MeController(UserAppRepository users) {
        this.users = users;
    }

    @GetMapping("/me")
    public UserDto me(Authentication auth) {
        String email = auth.getName(); // arrive d du token
        UserApp u = users.findByEmail(email).orElseThrow(NotFoundException::new);
        return u.entityToDto();
    }
}