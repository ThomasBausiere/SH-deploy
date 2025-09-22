package org.example.api_sh.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.api_sh.entity.UserApp;
import org.example.api_sh.entity.enums.Role;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String email;
    private String pseudo;
    private Role role;

    public UserApp dtoToEntity(){
        return UserApp.builder()
                .id_user(getId())
                .email(getEmail())
                .pseudo(getPseudo())
                .role(getRole())
                .build();
    }
}
