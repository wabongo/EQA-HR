package com.eqa.auth_service.user;

import jakarta.persistence.*;
import lombok.Data;

@Data
@MappedSuperclass
public abstract class Profile {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "id_number", length = 14)
    private String idNumber;

    @Column(name = "gender")
    private Gender gender;
}
