package org.example.api_sh.controller;


import org.example.api_sh.dto.*;
import org.example.api_sh.entity.UserApp;
import org.example.api_sh.exeception.NotFoundException;
import org.example.api_sh.exeception.UserAlreadyExistException;
import org.example.api_sh.repository.UserAppRepository;
import org.example.api_sh.security.JWTGenerator;
import org.example.api_sh.service.UserAppService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequestMapping("/api/public/")
@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST})
public class UserAppController {

    private final UserAppService userAppService;
    private final PasswordEncoder passwordEncoder;


    public UserAppController( UserAppService userAppService, PasswordEncoder passwordEncoder) {
        this.userAppService = userAppService;
        this.passwordEncoder = passwordEncoder;

    }


    @PostMapping("login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDTO) {
        try {
            return ResponseEntity.ok(userAppService.login(loginRequestDTO));
        }catch (Exception ex) {
            throw new NotFoundException();
        }
    }

    @PostMapping("register")
    public ResponseEntity<RegisterResponseDto> register(@RequestBody RegisterRequestDto registerRequestDTO) throws UserAlreadyExistException {
        registerRequestDTO.setPassword(passwordEncoder.encode(registerRequestDTO.getPassword()));
        UserApp userApp = userAppService.register(registerRequestDTO);
        return ResponseEntity.ok(
                RegisterResponseDto.builder()
                        .id(userApp.getId_user())
                        .email(userApp.getEmail())
                        .pseudo(userApp.getPseudo())
                        .role(userApp.getRole().getCode())
                        .build()
        );
    }

    @GetMapping("user/{id}")
    public ResponseEntity<UserPublicDto> getUser(@PathVariable Long id) {
        try{
            UserPublicDto userDto = userAppService.get(id);
            return ResponseEntity.ok(userDto);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }



}
