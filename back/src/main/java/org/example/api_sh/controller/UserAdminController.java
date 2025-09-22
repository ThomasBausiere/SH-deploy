package org.example.api_sh.controller;


import org.example.api_sh.dto.UserDto;
import org.example.api_sh.exeception.NotFoundException;
import org.example.api_sh.service.UserAppService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RequestMapping("/api/admin/")
@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST})
public class UserAdminController {

    private final UserAppService userService;

    public UserAdminController(UserAppService userService) {
        this.userService = userService;
    }

    @GetMapping("user/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        try{
            UserDto userDto = userService.getAuth(id);
            return ResponseEntity.ok(userDto);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("user/{id}")
    public ResponseEntity<UserDto> updateRole(@PathVariable Long id) {
        try{
            return ResponseEntity.ok(userService.toAdmin(id));
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("users")
    public ResponseEntity<?> getAllUsers() {
        try {
            var users = userService.getAuth();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
