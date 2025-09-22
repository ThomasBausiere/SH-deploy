package org.example.api_sh.controller;


import org.example.api_sh.dto.RegisterRequestDto;
import org.example.api_sh.dto.UserDto;
import org.example.api_sh.exeception.NotFoundException;
import org.example.api_sh.service.UserAppService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.example.api_sh.dto.ChangePasswordSimpleRequestDto;

@RequestMapping("/api/private/user")
@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS })
public class UserAuthController {

    private final UserAppService userService;

    public UserAuthController(UserAppService userService) {
        this.userService = userService;

    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        try{
            UserDto userDto = userService.getAuth(id);
            return ResponseEntity.ok(userDto);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        try{
            UserDto user = userService.update(id, userDto);
            return ResponseEntity.ok(user);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}/updatepass")
    public ResponseEntity<String> updatePass(@PathVariable Long id, @RequestBody RegisterRequestDto registerRequestDTO) {
        try{
            userService.updatePass(id, registerRequestDTO);
            return ResponseEntity.ok("Password updated successfully");
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (AuthenticationException e){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (Exception ex){
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PatchMapping("/{id}/password")
    public ResponseEntity<?> changePasswordSimple(@PathVariable Long id,
                                                  @RequestBody ChangePasswordSimpleRequestDto body) {
        try {
            userService.changePasswordSimple(id, body.getNewPassword());
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception ex){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE /api/private/user/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOwn(@PathVariable Long id) {
        try {
            userService.deleteOwnAccount(id);
            return ResponseEntity.noContent().build();
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception ex){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
