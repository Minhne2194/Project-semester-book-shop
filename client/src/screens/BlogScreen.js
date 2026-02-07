import React from 'react';
import { Card, Container } from 'react-bootstrap';

const posts = [
  {
    id: 1,
    title: 'Lợi ích của việc đọc sách giấy trong kỷ nguyên số',
    excerpt: 'Tại sao sách giấy vẫn giữ được vị thế quan trọng dù E-book đang ngày càng phổ biến?',
    date: '15/05/2024',
    readTime: '5 phút',
    author: 'Bùi Minh Anh',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Gợi ý 7 đầu sách khai mở tư duy cho người trẻ',
    excerpt: 'Danh sách ngắn giúp bạn khởi động hành trình đọc hiệu quả hơn.',
    date: '02/06/2024',
    readTime: '4 phút',
    author: 'Team FamilyBook',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
  },
];

const BlogScreen = () => {
  return (
    <Container className="section">
      <div className="text-center mb-4">
        <h2>Blog FamilyBook</h2>
        <p className="mini-meta">Chia sẻ kiến thức, cảm nhận về sách và văn hóa đọc.</p>
      </div>

      {posts.map((post) => (
        <Card key={post.id} className="card-elevated mb-4">
          <Card.Body className="d-flex flex-column flex-md-row">
            <div style={{ flex: '0 0 280px' }}>
              <Card.Img
                src={post.image}
                alt={post.title}
                style={{ borderRadius: 12, height: 180, objectFit: 'cover' }}
              />
            </div>
            <div className="ms-md-4 mt-3 mt-md-0 flex-grow-1">
              <div className="mini-meta mb-2">
                {post.date} • {post.readTime}
              </div>
              <Card.Title style={{ fontWeight: 700 }}>{post.title}</Card.Title>
              <Card.Text style={{ color: '#4a4a4a' }}>{post.excerpt}</Card.Text>
              <div className="mini-meta d-flex justify-content-between align-items-center">
                <span>Bởi {post.author}</span>
                <a href="#" style={{ color: '#b48366', fontWeight: 600, textDecoration: 'none' }}>Đọc tiếp →</a>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default BlogScreen;
