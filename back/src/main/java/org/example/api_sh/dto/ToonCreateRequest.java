package org.example.api_sh.dto;


import lombok.Data;
import org.example.api_sh.entity.enums.Profession;

@Data
public class ToonCreateRequest {
    private String name;
    private Profession profession;
}