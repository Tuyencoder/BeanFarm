import React from 'react';

const infoCards = [
  {
    icon: 'https://bizweb.dktcdn.net/100/514/629/themes/951567/assets/ser_1.png?1716945232631',
    title: 'Vận chuyển miễn phí',
    description: 'Hóa đơn trên 5 triệu'
  },
  {
    icon: "//bizweb.dktcdn.net/100/514/629/themes/951567/assets/ser_2.png?1716945232631", 
    title: 'Đổi trả miễn phí',
    description: 'Trong vòng 7 ngày'
  },
  {
    icon: "https://bizweb.dktcdn.net/100/514/629/themes/951567/assets/ser_3.png?1716945232631",
    title: '100% Hoàn tiền',
    description: 'Nếu sản phẩm lỗi'
  },
  {
    icon: "https://bizweb.dktcdn.net/100/514/629/themes/951567/assets/ser_4.png?1716945232631",
    title: 'Hotline: 1900 6750',
    description: 'Hỗ trợ 24/7'
  }
];

const InfoCards = () => {
  return (
    <div style={styles.container}>
      {infoCards.map((card, index) => (
        <div key={index} style={styles.card}>
          <img src={card.icon} alt={card.title} style={{...styles.icon, width: '60px', height: '60px'}} />
          <div style={styles.textContainer}>
            <h4 style={styles.title}>{card.title}</h4>
            <p style={styles.description}>{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#fff',
    margin: '0 auto',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f1f2f6',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    margin: '10px',
    minWidth: '250px',
    textAlign: 'center'
  },
  icon: {
    marginBottom: '10px',
    objectFit: 'cover',
    borderRadius: '50%',
    border: '2px solid #2ecc71'
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  title: {
    fontWeight: 'bold',
    marginBottom: '5px',
    color : '#2ecc71',
    fontSize: '16px'
  },
  description: {
    color: '#666666',
    fontSize: '14px'
  }
};

export default InfoCards;
