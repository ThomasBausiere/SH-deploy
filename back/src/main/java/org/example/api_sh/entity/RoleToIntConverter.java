package org.example.api_sh.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.example.api_sh.entity.enums.Role;

@Converter(autoApply = false)
public class RoleToIntConverter implements AttributeConverter<Role, Integer> {
    @Override
    public Integer convertToDatabaseColumn(Role role) {
        return role == null ? 2 : role.getCode(); // 2 = USER par défaut
    }

    @Override
    public Role convertToEntityAttribute(Integer dbValue) {
        return Role.fromCode(dbValue);
    }
}
