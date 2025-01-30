import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams hook
import AppBarComponent from '../../../Components/AppBar/AppBar';
import Footer from '../../../Components/Footer/Footer';
import ChatAI from '../../../Components/ChatAI/ChatAI';
import { fetchOneNewsAPI } from '../../../apis';

const NewDetail = () => {
  const { id } = useParams(); // Use useParams hook to get route params
  const [post, setPost] = useState(null);
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetchOneNewsAPI(id); // Use id from useParams
        setPost(response);
        setPosts(response || []); // Here you are setting posts to the fetched response
      } catch (error) {
        console.error('Failed to fetch news detail:', error);
        setPost(null);
        setPosts([]); // Setting posts to an empty array in case of error
      }
    };
  
    fetchPost();
  }, [id]);

  const formatDescription = (description) => {
    return description.split('\n').map((line, index) => (
      <p key={index}>
        {line.split(/(\d+)/).map((part, i) =>
          /\d/.test(part) ? <strong key={i}>{part}</strong> : part
        )}
      </p>
    ));
  };

  if (!post) {
    return <div>Loading...</div>; // Display a loading message or spinner while fetching data
  }

  return (
    <>
      <AppBarComponent />
      <div style={styles.container}>
        <div style={styles.content}>
          <h2 style={styles.title}>{post.title}</h2>
          <p style={styles.date}>{post.date}</p>
          <img src={post.image} alt={post.title} style={styles.postImage} />
          <div style={styles.description}>{formatDescription(post.description)}</div>
        </div>
        <div style={styles.sidebar}>
          <div style={styles.searchBox}>
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              style={styles.searchInput}
            />
            <button style={styles.searchButton}>🔍</button>
          </div>
          <div style={styles.widget}>
            <h3 style={styles.widgetTitle}>BÀI VIẾT MỚI</h3>
            <ul style={styles.widgetList}>
              <li style={styles.widgetItem}>
                <img
                  src={post.image}
                  alt={post.title}
                  style={styles.widgetImage}
                />
                <div style={styles.postInfo}>
                  <h4 style={styles.postTitle}>{post.title}</h4>
                  <p style={styles.postDate}>{post.date}</p>
                </div>
              </li>
              {/* Repeat for other recent posts if needed */}
            </ul>
          </div>
          <div style={styles.widget}>
            <h3 style={styles.widgetTitle}>TAGS</h3>
            <div style={styles.tags}>
              {tags.map((tag, index) => (
                <span key={index} style={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ChatAI />
      <Footer />
    </>
  );
};

const tags = [
  'Công dụng khoai tây',
  'Măng tây',
  'Salad dưa chuột',
  'Sức khỏe',
  'Tác dụng ớt chuông',
];

const styles = {
  container: {
    display: 'flex',
    maxWidth: '1200px',
    margin: 'auto',
    padding: '20px',
  },
  content: {
    flex: 3,
    marginRight: '20px',
  },
  sidebar: {
    flex: 1,
    marginLeft: '20px',
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  date: {
    color: '#888',
    marginBottom: '20px',
  },
  postImage: {
    width: '100%',
    height: 'auto',
    marginBottom: '20px',
    borderRadius: '8px',
  },
  description: {
    fontSize: '18px',
    lineHeight: '1.6',
  },
  widget: {
    marginBottom: '20px',
  },
  widgetTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#008b4b',
    color: '#fff',
  },
  widgetList: {
    listStyle: 'none',
    padding: '0',
  },
  widgetItem: {
    display: 'flex',
    marginBottom: '10px',
  },
  widgetImage: {
    width: '80px',
    height: '80px',
    marginRight: '10px',
    objectFit: 'cover',
    borderRadius: '5px',
  },
  postInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  postTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  postDate: {
    color: '#888',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  tag: {
    margin: '0 10px 10px 0',
    padding: '5px 10px',
    backgroundColor: '#fff',
    borderRadius: '20px',
    fontSize: '14px',
    cursor: 'pointer',
    border: '1px solid #008b4b',
    color: '#2f3640',
  },
  searchBox: {
    display: 'flex',
    marginBottom: '20px',
    width: '100%',
  },
  searchInput: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px 0 0 4px',
    outline: 'none',
    backgroundColor: '#f5f6fa',
    color: '#2f3640',
  },
  searchButton: {
    padding: '10px 20px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '0 4px 4px 0',
    backgroundColor: 'green',
    color: 'white',
    cursor: 'pointer',
    outline: 'none',
  },
};

export default NewDetail;
