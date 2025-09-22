package org.example.api_sh.entity;

import lombok.Builder;
import org.example.api_sh.dto.UserDto;
import org.example.api_sh.dto.UserPublicDto;
import org.example.api_sh.entity.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserApp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_user;

    @Column(unique = true)
    private String email;
    private String pseudo;
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;


    public UserApp(String email, String pseudo, String password, int roleIgnored) {
        this.email = email;
        this.pseudo = pseudo;
        this.password = password;
        this.role = Role.USER;
    }

    @PrePersist
    void ensureDefaultRole() {
        if (this.role == null) this.role = Role.USER; // sécurité côté JPA
    }

    public UserDto entityToDto (){
        return UserDto.builder()
                .id(getId_user())
                .email(getEmail())
                .pseudo(getPseudo())
                .role(getRole())
                .build();
    }

    public UserPublicDto entityToPublicDto (){
        return UserPublicDto.builder()
                .id(getId_user())
                .pseudo(getPseudo())
                .build();
    }
}
