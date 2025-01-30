import React, { useState } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { signupAPI } from '../../../apis';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AppBar from '../../AppBar/AppBar';
import Footer from '../../Footer/Footer';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }
  
    try {
      const response = await signupAPI(formData);
      
      if (response?.message) {
        toast.success('Đăng ký thành công. Vui lòng kiểm tra email của bạn để xác nhận.');
        navigate('/account/Login')
      } else {
        toast.error('Đăng ký thất bại. Vui lòng thử lại.');
      }
      
    } catch (error) {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
      toast.error('Đăng ký thất bại. Vui lòng thử lại.');
    }
  }
  

  const handleFacebookLogin = () => {
    // Handle Facebook login
  };

  const handleGoogleLogin = () => {
    // Handle Google login
  };

  const linkStyle = {
    color: '#f9ca24',
    cursor: 'pointer',
  };

  return (
    <>
    <AppBar />

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px' }} onSubmit={handleSubmit}>
        <button style={{ background: 'none', border: 'none', padding: '10px 20px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', borderBottom: '2px solid #7bed9f' }}>
          Đăng Ký
        </button>
        <input
          type="text"
          name="username"
          placeholder="Nhập Tên Đăng Nhập"
          value={formData.username}
          onChange={handleInputChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Nhập Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Nhập Mật Khẩu"
          value={formData.password}
          onChange={handleInputChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Xác nhận Mật Khẩu"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor: '#78e08f', color: 'white', cursor: 'pointer', fontSize: '16px', width: '100%', boxSizing: 'border-box' }}>Đăng Ký</button>
      </form>
      <p style={{ textAlign: 'center' }}>Hoặc đăng nhập bằng</p>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer', justifyContent: 'space-between', width: '100px' }}>
        <FaFacebook onClick={handleFacebookLogin} size={30} style={{ marginRight: '10px', color: '#3b5998' }} />
        <FaGoogle onClick={handleGoogleLogin} size={30} style={{ color: '#db4a39' }} />
      </div>
      <p>Đã có tài khoản? <span style={linkStyle} onClick={() => navigate('/account/Login')}>Đăng nhập ngay</span></p>
    </div>
    <Footer/>
    </>
  );
};

export default SignUp;
