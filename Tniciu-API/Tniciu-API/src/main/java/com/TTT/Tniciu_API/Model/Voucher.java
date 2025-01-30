package com.TTT.Tniciu_API.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "vouchers")
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Mã giảm giá là bắt buộc")
    @Column(unique = true)
    private String code;

    @NotNull(message = "Giá trị giảm giá là bắt buộc")
    private double discount;

    private LocalDateTime expirationDate;

    @Column(length = 255)
    private String description;

    private boolean isActive = true;  // Để quản lý trạng thái kích hoạt của mã

    // Thêm thuộc tính loại voucher
    private String type; // "FREE" or "POINTS"

    private double pointsRequired; // Số điểm cần có nếu là voucher tích điểm

    // Tính xem mã có còn hiệu lực hay không
    public boolean isValid() {
        // Kiểm tra trạng thái kích hoạt và ngày hết hạn
        return isActive && (expirationDate == null || LocalDateTime.now().isBefore(expirationDate));
    }

    public void updateStatus() {
        if (expirationDate != null && LocalDateTime.now().isAfter(expirationDate)) {
            this.isActive = false;  // Vô hiệu hóa voucher nếu ngày hết hạn đã qua
        } else {
            this.isActive = true;   // Kích hoạt voucher nếu ngày hiện tại trước ngày hết hạn
        }
    }

    // Thêm phương thức để xác định voucher có thể áp dụng cho người dùng dựa trên điểm tích lũy
    public boolean canBeApplied(Account account) {
        if ("POINTS".equals(type)) {
            return account.getPoints() >= pointsRequired;
        }
        // Nếu là voucher miễn phí, luôn có thể áp dụng
        return "FREE".equals(type);
    }
}
