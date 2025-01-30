package com.TTT.Tniciu_API.Model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoucherDTO {
    private Long id;
    private String code;
    private double discount;
    private String type; // Thêm loại voucher
    private double pointsRequired; // Thêm điểm yêu cầu
    private boolean isActive;
    private boolean isApplied;

    public VoucherDTO(Long id, String code, double discount, String type, double pointsRequired ,boolean isActive, boolean isApplied) {
        this.id = id;
        this.code = code;
        this.discount = discount;
        this.type = type;
        this.pointsRequired = pointsRequired;
        this.isActive = isActive;
        this.isApplied = isApplied;
    }

}