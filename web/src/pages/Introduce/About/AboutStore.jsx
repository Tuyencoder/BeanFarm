/* eslint-disable no-unused-vars */
import React from 'react';

function AboutStore() {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#3e8e41',
     paddingTop : '30px',
    paddingBottom : '30px',
    width: '100%',
    boxSizing: 'border-box',
    borderRadius : '8px',
  };

  const itemStyle = {
    textAlign: 'center',
    color: '#f1c40f'
  };

  const numberStyle = {
    fontSize: '40px',
    fontWeight: 'bold',
    margin: 0
  };

  const textStyle = {
    fontSize: '16px',
    color: 'white',
    margin: 0
  };

  const sectionStyle = {
    textAlign: 'center',
    padding: '50px 0',
    width: '100vw',
    boxSizing: 'border-box'
  }; 

  const headingStyle = {
    fontSize: '40px',
    color: '#f1c40f',
    margin: 0
  };

  const paragraphStyle = {
    fontSize: '18px',
    color: 'grey',
    marginTop: '20px',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  return (
    <div style={containerStyle}>
      <div style={itemStyle}>
        <p style={numberStyle}>2</p>
        <p style={textStyle}>Năm Kinh Nghiệm</p>
      </div>
      <div style={itemStyle}>
        <p style={numberStyle}>200</p>
        <p style={textStyle}>Nhân Viên</p>
      </div>
      <div style={itemStyle}>
        <p style={numberStyle}>3000+</p>
        <p style={textStyle}>Khách Hàng</p>
      </div>
      <div style={itemStyle}>
        <p style={numberStyle}>8</p>
        <p style={textStyle}>Cửa Hàng</p>
      </div>
    </div>



    
  );
}

export default AboutStore;