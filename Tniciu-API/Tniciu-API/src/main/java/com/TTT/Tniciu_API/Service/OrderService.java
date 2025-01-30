package com.TTT.Tniciu_API.Service;

import com.TTT.Tniciu_API.Model.Account;
import com.TTT.Tniciu_API.Model.AccountVoucher;
import com.TTT.Tniciu_API.Model.Order;
import com.TTT.Tniciu_API.Model.OrderDetail;
import com.TTT.Tniciu_API.Repository.AccountRepository;
import com.TTT.Tniciu_API.Repository.AccountVoucherRepository;
import com.TTT.Tniciu_API.Repository.OrderRepository;
import com.TTT.Tniciu_API.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    private Map<String, Order> temporaryOrders = new HashMap<>();

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private AccountVoucherRepository accountVoucherRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByAccountId(String accountId) {
        return orderRepository.findByAccountId(accountId);
    }


    public Order createOrder(Order order) {
        Optional<Account> accountOptional = accountRepository.findById(order.getAccount().getId());

        if (accountOptional.isPresent()) {
            Account account = accountOptional.get();
            order.setAccount(account);
            order.setDate(LocalDateTime.now());
            double totalOrderValue = order.getTotal();

            for (OrderDetail orderDetail : order.getOrderDetails()) {
                productRepository.findById(orderDetail.getProduct().getId())
                        .ifPresentOrElse(product -> {
                            // Kiểm tra số lượng sản phẩm
                            if (product.getQuantity() >= orderDetail.getQuantity()) {
                                product.setQuantity(product.getQuantity() - orderDetail.getQuantity());
                                productRepository.save(product);
                                orderDetail.setOrder(order);
                                orderDetail.setProduct(product);
                            } else {
                                throw new RuntimeException("Không đủ số lượng sản phẩm: " + product.getName());
                            }
                        }, () -> {
                            throw new RuntimeException("Sản phẩm không tồn tại với ID: " + orderDetail.getProduct().getId());
                        });
            }

            // Cập nhật tổng giá trị hóa đơn
            order.setTotal(totalOrderValue);

            // Tích điểm (1% trên tổng giá trị hóa đơn)
            int pointsEarned = (int) (totalOrderValue * 0.01);
            account.setPoints(account.getPoints() + pointsEarned);

            // Cập nhật tổng số tiền đã chi tiêu
            account.setTotalSpent(account.getTotalSpent() + totalOrderValue);

            // Cập nhật xếp hạng của tài khoản
            account.updateRank();

            // Kiểm tra và cập nhật trạng thái voucher nếu có
            Optional<AccountVoucher> accountVoucherOpt = account.getAccountVouchers().stream()
                    .filter(av -> !av.isApplied())
                    .findFirst();

            accountVoucherOpt.ifPresent(accountVoucher -> {
                accountVoucher.setApplied(true); // Cập nhật trạng thái voucher thành đã áp dụng
                accountVoucherRepository.save(accountVoucher);
            });

            accountRepository.save(account); // Lưu tài khoản với điểm, tổng chi tiêu và xếp hạng mới

            return orderRepository.save(order);
        } else {
            throw new RuntimeException("Account not found with id: " + order.getAccount().getId());
        }
    }


    public void saveTemporaryOrder(Order order) {
        temporaryOrders.put(order.getVnpTxnRef(), order);
    }

    public Order getOrderByTxnRef(String vnpTxnRef) {
        return temporaryOrders.get(vnpTxnRef);
    }
    public Order updateOrder(Long id, Order orderDetails) {
        Optional<Order> order = orderRepository.findById(id);
        if (order.isPresent()) {
            Order existingOrder = order.get();
            existingOrder.setCustomerName(orderDetails.getCustomerName());
            existingOrder.setDate(orderDetails.getDate());
            existingOrder.setAddress(orderDetails.getAddress());
            existingOrder.setTotal(orderDetails.getTotal());
            existingOrder.setPayment(orderDetails.getPayment());
            existingOrder.setPaymentStatus(orderDetails.getPaymentStatus());
            existingOrder.setShippingStatus(orderDetails.getShippingStatus());
            existingOrder.setAccount(orderDetails.getAccount());
            return orderRepository.save(existingOrder);
        }
        return null;
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    public double calculateTotalRevenue() {
        List<Order> orders = orderRepository.findAll();
        double totalRevenue = 0;

        for (Order order : orders) {
            // Chỉ tính doanh thu cho các đơn hàng đã thanh toán
            if (order.getPaymentStatus().equals("Đã thanh toán")) {
                totalRevenue += order.getTotal();
            }
        }

        return totalRevenue;
    }
    public long countTotalOrders() {
        return orderRepository.count();
    }

    public Map<String, Double> getMonthlyRevenue() {
        // Lấy tất cả các đơn hàng đã thanh toán
        List<Order> orders = orderRepository.findAll();
        Map<String, Double> monthlyRevenue = new HashMap<>();

        for (Order order : orders) {
            // Kiểm tra trạng thái thanh toán và chỉ tính các đơn hàng đã thanh toán
            if (order.getPaymentStatus().equals("Đã thanh toán")) {
                String monthYear = order.getDate().getMonthValue() + "-" + order.getDate().getYear();
                monthlyRevenue.put(monthYear, monthlyRevenue.getOrDefault(monthYear, 0.0) + order.getTotal());
            }
        }

        return monthlyRevenue;
    }

}

