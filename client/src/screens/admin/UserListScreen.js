import React, { useEffect, useState } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

const { userInfo } = useSelector((state) => state.userLogin);
  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, [userInfo]);

  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa user này?')) {
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    }
  };

  return (
    <div>
      <h2>Quản lý người dùng</h2>
      {loading ? <p>Đang tải...</p> : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Quyền</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Badge bg={user.isAdmin ? 'danger' : 'secondary'}>
                    {user.isAdmin ? 'Admin' : 'User'}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant='danger'
                    size='sm'
                    onClick={() => deleteHandler(user._id)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserListScreen;