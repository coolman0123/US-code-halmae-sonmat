// API 기본 설정
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// API 요청을 위한 공통 헤더 생성
export const getHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// API 응답 처리를 위한 공통 함수
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return await response.json();
};

// API 요청을 위한 공통 함수
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getHeaders(),
    ...options
  };

  try {
    const response = await fetch(url, config);
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`API 요청 실패 [${options.method || 'GET'}] ${endpoint}:`, error);
    throw error;
  }
};

// GET 요청
export const apiGet = (endpoint) => apiRequest(endpoint, { method: 'GET' });

// POST 요청
export const apiPost = (endpoint, data) => apiRequest(endpoint, {
  method: 'POST',
  body: JSON.stringify(data)
});

// PUT 요청
export const apiPut = (endpoint, data) => apiRequest(endpoint, {
  method: 'PUT',
  body: JSON.stringify(data)
});

// DELETE 요청
export const apiDelete = (endpoint) => apiRequest(endpoint, { method: 'DELETE' }); 