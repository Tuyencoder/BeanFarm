import React from "react";
import InfoCards from "../Footer/infoCards";
import PartnerLogos from "./Partner/PartnerLogos";

const Footer = () => {
  return (
    <>
      <InfoCards />
      <div style={styles.footerContainer}>
        <div style={styles.footerSection}>
          <img
            src="https://bizweb.dktcdn.net/100/514/629/themes/951567/assets/logo.png?1716945232631"
            alt="Bean Farm"
            style={styles.logo}
          />
          <p style={styles.description}>
            Bean Farm- Siêu thị trực tuyến mua sắm nông sản, chất lượng, tươi
            xanh.
            <br />
            <span style={styles.highlight}>Giá siêu tốt - Giao siêu tốc.</span>
          </p>
          <p style={styles.contact}>
            <strong>Địa chỉ:</strong> số 5 ,78/562 Trần Cung,Bắc Từ Liêm,Hà Nội
            <br />
            <strong>Điện thoại:</strong> 0917054048
            <br />
            <strong>Email:</strong> xuantuyenq@gmail.com
          </p>
        </div>
        <div style={styles.footerSection}>
          <h4 style={styles.sectionTitle}>CHÍNH SÁCH</h4>
          <ul style={styles.list}>
            {[
              "Chính sách thành viên",
              "Chính sách thanh toán",
              "Chính sách đổi sản phẩm",
              "Chính sách bảo mật",
              "Chính sách cộng tác viên",
              "Chính sách bảo hành",
            ].map((item, index) => (
              <li
                key={index}
                style={styles.link}
                onMouseEnter={(e) => (e.target.style.color = "#28a745")}
                onMouseLeave={(e) => (e.target.style.color = "#333")}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div style={styles.footerSection}>
          <h4 style={styles.sectionTitle}>HƯỚNG DẪN</h4>
          <ul style={styles.list}>
            {[
              "Hướng dẫn mua hàng",
              "Hướng dẫn đổi trả",
              "Hướng dẫn thanh toán",
              "Chương trình cộng tác viên",
              "Tìm kiếm",
              "Liên hệ",
            ].map((item, index) => (
              <li
                key={index}
                style={styles.link}
                onMouseEnter={(e) => (e.target.style.color = "#28a745")}
                onMouseLeave={(e) => (e.target.style.color = "#333")}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div style={styles.footerSection}>
          <h4 style={styles.sectionTitle}>KẾT NỐI VỚI CHÚNG TÔI</h4>
          <div style={styles.socialIcons}>
            <a href="#">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/800px-Facebook_Logo_%282019%29.png"
                alt="Facebook"
                style={{ width: "45px", height: "45px" }}
              />
            </a>
            <a href="#">
              <img
                src="https://cdn.icon-icons.com/icons2/2201/PNG/512/twitter_logo_circle_icon_134015.png"
                alt="Twitter"
                style={styles.icon}
              />
            </a>
            <a href="#">
              <img
                src="https://w7.pngwing.com/pngs/523/896/png-transparent-youtube-logo-youtube-red-logo-sunny-leone-angle-rectangle-brand-thumbnail.png"
                alt="YouTube"
                style={styles.icon}
              />
            </a>
            <a href="#">
              <img
                src="https://png.pngtree.com/png-clipart/20190613/original/pngtree-instagram-logo-icon-png-image_3588821.jpg"
                alt="Instagram"
                style={styles.icon}
              />
            </a>
          </div>
          <h4 style={styles.sectionTitle}>HÌNH THỨC THANH TOÁN</h4>
          <div style={styles.paymentIcons}>
            <img
              src="https://bizweb.dktcdn.net/100/514/629/themes/951567/assets/payment_1.png?1716945232631"
              alt="Cash"
              style={styles.paymentIcon}
            />
            <img
              src="https://bizweb.dktcdn.net/100/514/629/themes/951567/assets/payment_2.png?1716945232631"
              alt="Bank Transfer"
              style={styles.paymentIcon}
            />
            <img
              src="https://bizweb.dktcdn.net/100/514/629/themes/951567/assets/payment_3.png?1716945232631"
              alt="Visa/MasterCard"
              style={styles.paymentIcon}
            />
            <img
              src="https://bizweb.dktcdn.net/100/514/629/themes/951567/assets/payment_4.png?1716945232631"
              alt="MoMo"
              style={styles.paymentIcon}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  footerContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 50px",
    backgroundColor: "#f5f5f5",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  },
  footerSection: {
    flex: 1,
    margin: "0 10px",
  },
  logo: {
    height: "50px",
  },
  description: {
    fontSize: "14px",
    color: "#333",
  },
  highlight: {
    color: "#28a745",
    fontWeight: "bold",
  },
  contact: {
    fontSize: "14px",
    color: "#333",
  },
  sectionTitle: {
    fontSize: "16px",
    color: "#28a745",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  link: {
    textDecoration: "none",
    color: "#333",
    display: "block",
    margin: "5px 0",
    cursor: "pointer",
  },
  socialIcons: {
    display: "flex",
    justifyContent: "space-between",
    width: "150px",
  },
  icon: {
    width: "50px",
    height: "50px",
    margin: "0 5px",
  },
  paymentIcons: {
    display: "flex",
    justifyContent: "flex-start",
  },
  paymentIcon: {
    width: "108px",
    height: "66px",
    margin: "0 5px",
  },
};

export default Footer;
