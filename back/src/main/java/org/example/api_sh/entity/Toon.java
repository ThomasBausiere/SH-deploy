package org.example.api_sh.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.api_sh.entity.Skill;
import org.example.api_sh.entity.UserApp;
import org.example.api_sh.entity.enums.Profession;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
        name = "toon",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_toon_owner_name", columnNames = {"owner_id", "name"})
        }
)
public class Toon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Profession profession;


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "toon_skills",
            joinColumns = @JoinColumn(name = "toon_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private Set<Skill> skills = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnore
    private UserApp owner;
}