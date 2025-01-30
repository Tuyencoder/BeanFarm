package com.TTT.Tniciu_API.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Account {

    @Id
    private String id;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Column(length = 500)
    private String password;

    private boolean enabled = false;

    private String verificationToken;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role role;

    private String image;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore  // Để tránh vấn đề vòng lặp vô hạn và tăng hiệu suất
    private List<AccountVoucher> accountVouchers;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;
    private int points = 0; // Điểm tích lũy
    private double totalSpent = 0.0; // Tổng tiền đã chi tiêu
    @Column(name = "`rank`")
    private String rank = "Đồng";

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Cập nhật xếp hạng dựa trên tổng số tiền đã chi tiêu
    public void updateRank() {
        if (totalSpent >= 5000000) {
            rank = "Kim cương";
        } else if (totalSpent >= 2500000) {
            rank = "Bạch kim";
        } else if (totalSpent >= 1000000) {
            rank = "Vàng";
        } else if (totalSpent >= 300000) {
            rank = "Bạc";
        } else {
            rank = "Đồng";
        }
    }

}
