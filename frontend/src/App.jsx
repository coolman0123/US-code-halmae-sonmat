import { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/users')
      .then(res => {
        if (!res.ok) throw new Error('API 요청 실패');
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div>
      <h1>유저 목록</h1>
      {error && <p style={{color: 'red'}}>에러: {error}</p>}
      <ul>
        {users.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
      <a href="http://localhost:5001/api-docs" target="_blank" rel="noopener noreferrer">
        Swagger API 문서 보기
      </a>
    </div>
  );
}

export default App;
