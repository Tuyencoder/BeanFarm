/* eslint-disable no-unused-vars */
import React from 'react';
import AppBarComponent from '../../Components/AppBar/AppBar';
import Footer from '../../Components/Footer/Footer';
import ChatAI from '../../Components/ChatAI/ChatAI';

const ContactPage = () => {
  return (
    <>
    <AppBarComponent/>
    <div style={styles.container}>
      <div style={styles.contactInfo}>
        <h2 style= {{fontSize :'16px ' ,textTransform : 'uppercase'}} >NƠI GIẢI ĐÁP TOÀN BỘ MỌI THẮC MẮC CỦA BẠN? </h2>
        <p style={{ marginBottom : '-15px'}}>Bean Farm - Siêu thị trực tuyến mua sắm nông sản, chất lượng, tươi xanh.</p>
        <p style={styles.highlight}>Giá siêu tốt - Giao siêu tốc.</p>
        
        <div style={styles.infoItem}>
          <div style={styles.icon}>&#x1F4CD;</div>
          <div>
            <strong>Địa chỉ</strong>
            <p style={ {marginTop : '-2px'}}>Lê Văn Chí, Phường Linh Trung, Quận Thủ Đức, TP.HCM</p>
          </div>
        </div>

        <div style={styles.infoItem}>
          <div style={styles.icon}>&#x1F551;</div>
          <div>
            <strong>Thời gian làm việc</strong>
            <p style={ {marginTop : '-2px'}}>8h - 22h từ thứ 2 đến chủ nhật</p>
          </div>
        </div>

        <div style={styles.infoItem}>
          <div style={styles.icon}>&#x260E;</div>
          <div>
            <strong>Hotline</strong>
            <p style={ {marginTop : '-2px'}}>0855005506</p>
          </div>
        </div>

        <div style={styles.infoItem}>
          <div style={styles.icon}>&#x2709;</div>
          <div>
            <strong>Email</strong>
            <p style={ {marginTop : '-2px'}}>tincui012@gmail</p>
          </div>
        </div>
        
        <div style={styles.contactForm}>
          <h3>LIÊN HỆ VỚI CHÚNG TÔI</h3>
          <p style={{fontSize : '14px'}}>Nếu bạn có thắc mắc gì, có thể gửi yêu cầu cho chúng tôi, và chúng tôi sẽ liên lạc lại với bạn sớm nhất có thể.</p>
          <form>
            <input type="text" placeholder="Họ và tên" style={styles.input} />
            <input type="email" placeholder="Email" style={styles.input} />
            <input type="tel" placeholder="Điện thoại*" style={styles.input} />
            <textarea placeholder="Nội dung" style={styles.textarea}></textarea>
            <button type="submit" style={styles.button}>Gửi thông tin</button>
          </form>
        </div>
      </div>
      <div style={styles.mapContainer}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.8459471071556!2d106.6270888760891!3d10.823098889328566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529dcd1439041%3A0xcc6cce1821da6844!2zUXXhuq1uIG5o4bqldA!5e0!3m2!1svi!2s!4v1734259441610!5m2!1svi!2s"
          maxWidth= '100%'
          height="450"
          style={styles.map}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
        
    </div>
    <ChatAI/>
    <Footer/>
    </>

  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
  },
  contactInfo: {
    flex: 1,
    marginRight: '20px',
    color : '#222f3e'
  },
  highlight: {
    color: '#badc58',
  
  },

  //
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    margin: '10px 0',
  },
  icon: {
    fontSize: '24px',
    // marginRight: '10px',
    width: '40px',
    minWidth: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: ' 1px ,solid ,#008b4b',
    borderRadius: '50%',
    marginRight: '10px',
    color : '#badc58'
  },
  contactForm: {
    marginTop: '20px',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '10px 0',
  backgroundColor : '#fff',
  border: '1px solid #e6e6e6',
  color : '#130f40',
  },
  textarea: {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    height: '100px',
    backgroundColor : '#fff',
    color : '#130f40',
     border: '1px solid #e6e6e6',
    
  },
  button: {
    padding: '10px 20px',
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  mapContainer: {
    flex: 1,
    maxWidth: '800px',
    marginLeft : 'auto',
    borderRadius : '8px'
  },
  map: {
    marginTop : '50px',
    width: '100%',
    height: '90%',
    border: 'none',
  },
};

export default ContactPage;
