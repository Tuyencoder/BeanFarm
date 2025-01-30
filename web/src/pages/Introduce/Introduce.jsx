/* eslint-disable no-unused-vars */
import React from 'react';
import AppBarComponent from '../../Components/AppBar/AppBar';
import Footer from '../../Components/Footer/Footer';
import AboutStore from './About/AboutStore';
import AboutText from './About/AboutText';
import AboutLabel from './About/AboutLabel';
import ChatAI from '../../Components/ChatAI/ChatAI';

const Introduce = () => {
  return (
    <>
    <AppBarComponent/>
    <div style={styles.container}>
      <section style={styles.section}>
        <img src="https://bizweb.dktcdn.net/100/514/629/themes/951567/assets/about2_banner.jpg?1716945232631" alt="Chất lượng và tươi xanh" style={styles.image} />
        <div style={styles.textBlock}>
          <h2 style={styles.title}>BEAN FARM</h2>
          <h3 style={styles.subtitle}>Chất lượng và tươi xanh</h3>
          <p style={styles.paragraph}>
            Thực phẩm sạch, hay còn gọi là thực phẩm hữu cơ (organic) đang được ưa chuộng tại các nước phát triển. Các chuyên gia sức khỏe cộng đồng cho rằng tại Mỹ đã có những động thái mang tính cách mạng trong thói quen ăn uống. Trong vòng 10 năm qua các loại thực phẩm hữu cơ chỉ được bán tại một số cửa hàng nông sản ít ỏi, còn các nhà kinh doanh siêu thị cũng chẳng có khái niệm "thực phẩm hữu cơ". Nhưng hiện nay, loại thực phẩm này đã được bán đại trà khắp nơi. Tại châu Âu các loại thực phẩm hữu cơ được coi là biểu tượng của thực phẩm cho sức khỏe, có rất nhiều trang trại nông nghiệp thực hiện nuôi trồng các sản phẩm nông nghiệp theo những quy định thực phẩm hữu cơ.
          </p>
        </div>
      </section>
      <div style={styles.containerStyle}>
      <div style={styles.textSectionStyle}>
        <h2 style={styles.heading2Style}>TẦM NHÌN</h2>
        <h1 style={styles.heading1Style}>Tầm nhìn của chúng tôi</h1>
        <p style={styles.paragraphStyle}>
          Hiểu được vấn đề ấy, tôi và những người bạn đã tâm huyết thành lập công ty nông sản Bean Farm hữu cơ, với mong muốn nhập được nhiều sản phẩm tốt, chất lượng, có chứng nhận hữu cơ về cung cấp cho các nhà phân phối tại Việt Nam. Các thương hiệu lớn được chúng tôi đã tìm hiểu, phù hợp với tập quán sử dụng, mức thu nhập của người Việt Nam.
        </p>
      </div>
      <div style={styles.imageSectionStyle}>
        <img
          src="https://bizweb.dktcdn.net/100/514/629/themes/951567/assets/about4_banner.jpg?1716945232631"
          alt="Tầm nhìn"
          style={styles.imageStyle}
        />
      </div>
    </div>
    <section style={styles.section}>
        <img src="https://bizweb.dktcdn.net/100/514/629/themes/951567/assets/about5_banner.jpg?1716945232631" alt="Chất lượng và tươi xanh" style={styles.image} />
        <div style={styles.textBlock}>
          <h2 style={styles.heading2Style}>MỤC TIÊU</h2>
          <h3 style={styles.heading1Style}>Mục tiêu của chúng tôi</h3>
          <p style={styles.paragraph}>
          Thật may mắn, hiện tại chúng tôi đã kết nối và phân phối cho các đối tác lớn ở Tp. Hồ Chí Mình và Hà Nội. Trong tương lai gần, chúng sẽ tôi sẽ đẩy mạnh phân phối sản phẩm về các tỉnh thành khác.
          </p>
        </div>
      </section>
      <AboutStore/>
      <AboutText/>
      <AboutLabel/>
    </div>
    <ChatAI/>
    <Footer/>
    </>
  );
};
        
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'white',
    color: '#565656',
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '40px',
    width: '100%',
    backgroundColor: 'white',
  },
  image: {
    width: '40%',
    marginRight: '20px',
    marginLeft : '200px',
    borderRadius : '8px'
  },
  textBlock: {
    width: '50%',
  },
  title: {
    color: '#f39c12',
    fontSize: '24px',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#27ae60',
    fontSize: '20px',
    marginBottom: '20px',
  },
  paragraph: {
    color: '#565656',
  },
 // card 2 
    containerStyle : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px'
      },
    
       textSectionStyle : {
        flex: 1,
        paddingRight: '20px',
        marginLeft : '200px',
      },
    
      heading2Style : {
        fontSize: '24px',
        fontWeight: 'bold',
        margin: 0,
      
      },
    
       heading1Style : {
        fontSize: '30px',
        color: 'green',
        margin: '10px 0'
      },
    
       paragraphStyle : {
        fontSize: '16px',
        lineHeight: 1.5,
        marginRight : '50px'
      },
    
      imageSectionStyle : {
        width : '45%',
         borderRadius : '8px',
        paddingRight : '50px'
      },
    
       imageStyle : {
        width: '100%',
        borderRadius: '8px'
      },


}



export default Introduce;
