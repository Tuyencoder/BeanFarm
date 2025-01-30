/* eslint-disable no-unused-vars */
import React from 'react';

function AboutText() {

  const sectionStyle = {
    textAlign: 'center',
    padding: '50px 0',
    width: '100%',
    boxSizing: 'border-box'
  };

  const headingStyle = {
    fontSize: '40px',
    color: '#f1c40f',
    margin: 0
  };

  const paragraphStyle_Text = {
    fontSize: '16px',
    color: 'grey',
    marginTop: '20px',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  return (
    <div>
      <div style={sectionStyle}>
        <h1 style={headingStyle}>Tại sao chọn chúng tôi</h1>
        <p style={paragraphStyle_Text}>
          Với nhiều năm kinh nghiệm trong lĩnh vực nông sản. Chúng tôi tự hào đang là đơn vị cung cấp nông sản chất lượng - tươi sạch. Cam kết về phân phối, sản phẩm, chất lượng đảm bảo và uy tín.
        </p>
      </div>
    </div>
  );
}

export default AboutText;