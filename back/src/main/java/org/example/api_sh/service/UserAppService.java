package org.example.api_sh.service;

import org.example.api_sh.dto.*;
import org.example.api_sh.entity.UserApp;
import org.example.api_sh.entity.enums.Role;
import org.example.api_sh.exeception.InvalidCredentials;
import org.example.api_sh.exeception.NotFoundException;
import org.example.api_sh.exeception.UserAlreadyExistException;
import org.example.api_sh.repository.UserAppRepository;
import org.example.api_sh.security.JWTGenerator;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.BadCredentialsException;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;


@Service
public class UserAppService {

    private final UserAppRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JWTGenerator generator;
    private final PasswordEncoder passwordEncoder;


    public UserAppService(UserAppRepository userRepository, AuthenticationManager authenticationManager, JWTGenerator generator, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.authenticationManager= authenticationManager;
        this.generator=generator;
        this.passwordEncoder =passwordEncoder;
    }


//CREATE
    protected UserApp create(UserApp userPlayer){ return userRepository.save(userPlayer); }
//READ 1
    public UserPublicDto get(Long id){ return userRepository.findById(id).orElseThrow(NotFoundException::new).entityToPublicDto(); }

    public UserDto getAuth(Long id){
        return userRepository.findById(id).orElseThrow(NotFoundException::new).entityToDto();
    }
    //READ ALL
    public List<UserPublicDto> get(){
        List<UserPublicDto> userList = new ArrayList<>();
        userRepository.findAll().forEach(user -> {
            userList.add(user.entityToPublicDto());
        });
        return userList;
    }

    public List<UserDto> getAuth(){
        List<UserDto> userList = new ArrayList<>();
        userRepository.findAll().forEach(user -> {
            userList.add(user.entityToDto());
        });
        return userList;
    }


//UPDATE
    public UserDto update(Long id, UserDto userDto){
        UserApp UserToUpdate = userRepository.findById(id).orElseThrow(NotFoundException::new);
        UserToUpdate.setPseudo(userDto.getPseudo());
        return userRepository.save(UserToUpdate).entityToDto();
    }
    public boolean updatePass(Long id, RegisterRequestDto registerRequestDto){
        UserApp user=  userRepository.findById(id).orElseThrow(NotFoundException::new);
        user.setPassword(passwordEncoder.encode(registerRequestDto.getPassword()));
        try{
            userRepository.save(user);
        } catch (Exception e){
            return false;
        }
        return true;
    }



//DELETE
    public void delete(Long id){
        UserApp user = userRepository.findById(id).orElseThrow(NotFoundException::new);
        userRepository.delete(user);
    }



    public UserApp register(RegisterRequestDto dto) throws UserAlreadyExistException {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new UserAlreadyExistException();
        }
        UserApp user = new UserApp(
                dto.getEmail(),
                dto.getPseudo(),
                dto.getPassword(),
                0
        );
        user.setRole(Role.USER); 
        return userRepository.save(user);
    }




    public LoginResponseDto login (LoginRequestDto loginRequestDto) throws InvalidCredentials {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return LoginResponseDto.builder().token(generator.generateToken(authentication)).userId(userRepository.findByEmail(loginRequestDto.getEmail()).orElseThrow(NotFoundException::new).getId_user()).build();
        } catch (AuthenticationException ex) {
            throw new InvalidCredentials("Invalid Email or Password");
        }
    }

    public UserDto toAdmin(Long id){
        UserApp user = userRepository.findById(id).orElseThrow(NotFoundException::new);
        user.setRole(Role.ADMIN);
        return userRepository.save(user).entityToDto();
    }

    // Vérifie que l'utilisateur authntifié modifie son propre compte
    private void ensureOwnerOnly(UserApp targetUser) {
        String authEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        UserApp current = userRepository.findByEmail(authEmail).orElseThrow(NotFoundException::new);
        boolean isOwner = Objects.equals(current.getId_user(), targetUser.getId_user());
        if (!isOwner) {
            throw new BadCredentialsException("Not allowed");
        }
    }

    // Changer le mot de passe (sans ancien mot de passe)
    public void changePasswordSimple(Long id, String newPassword) {
        if (newPassword == null || newPassword.isBlank()) {
            throw new IllegalArgumentException("New password is required");
        }
        UserApp user = userRepository.findById(id).orElseThrow(NotFoundException::new);
        ensureOwnerOnly(user);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // Supprimer SON compte
    public void deleteOwnAccount(Long id) {
        UserApp user = userRepository.findById(id).orElseThrow(NotFoundException::new);
        ensureOwnerOnly(user);
        userRepository.delete(user);
    }
}
