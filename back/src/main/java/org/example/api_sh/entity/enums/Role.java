package org.example.api_sh.entity.enums;

public enum Role {
    ADMIN(1),
    USER(2);

    private final int code;
    Role(int code) { this.code = code; }
    public int getCode() { return code; }

    public static Role fromCode(Integer code) {
        if (code == null) return USER; // fallback
        for (Role r : values()) {
            if (r.code == code) return r;
        }
        return USER;
    }
}
