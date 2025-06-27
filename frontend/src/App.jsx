import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import MainPage from './pages/MainPage/MainPage';
import Stories from './pages/Stories/Stories';
import Experience from './pages/Experience/Experience';
import Booking from './pages/Booking/Booking';
import LiveReservation from './pages/LiveReservation/LiveBooking/LiveBooking';

import MyPage from './pages/MyPage/MyPage/MyPage';
import MyPayment from './pages/MyPage/MyPayment/MyPayment';
import MyReview from './pages/MyPage/MyReview/MyReview/MyReview';
import WriteReview from './pages/MyPage/MyReview/WriteReview/WriteReview';
import ListReview from './pages/MyPage/MyReview/ListReview/ListReview';
import ReviewForm from './pages/MyPage/MyReview/ReviewForm/ReviewForm';
import Notification from './pages/MyPage/Notification/Notification';

// Auth Pages
import Login from './pages/Auth/Login/Login';
import SignUp from './pages/Auth/SignUp/SignUp';
import Logout from './pages/Auth/Logout/Logout';

// Host Pages
import HostHeader from './components/HostHeader/HostHeader';
import HostLogin from './pages/Host/Login/Login';
import HostBooking from './pages/Host/Booking/Booking';
import HostPayment from './pages/Host/Payment/Payment';
import PaymentDetail from './pages/Host/Payment/PaymentDetail';
import HostRegister from './pages/Host/Register/Register';
import RegisterForm from './pages/Host/Register/RegisterForm';
import RegisterDetail from './pages/Host/Register/RegisterDetail';

import './App.css';

// Header와 Footer를 조건부로 표시하는 컴포넌트
const Layout = ({ children }) => {
  const location = useLocation();
  
  // 인증 페이지에서는 Header, Footer 숨기기
  const hideHeaderFooter = ['/auth/login', '/auth/signup', '/host/login'].includes(location.pathname);
  
  // 관리자 페이지 확인
  const isHostPage = location.pathname.startsWith('/host') && !location.pathname.includes('/login');

  return (
    <div className="App">
      {!hideHeaderFooter && (isHostPage ? <HostHeader /> : <Header />)}
      <main>
        {children}
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

function App() {
  useEffect(() => {
    // 테스트용 사용자 계정 초기화
    const initializeTestUsers = () => {
      const existingUsers = localStorage.getItem('users');
      if (!existingUsers) {
        const testUsers = [
          {
            id: '1',
            name: 'user',
            email: 'user',
            password: '0000',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'admin',
            email: 'admin',
            password: '0000',
            createdAt: new Date().toISOString()
          }
        ];
        localStorage.setItem('users', JSON.stringify(testUsers));
      }
    };

    initializeTestUsers();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/experiences" element={<Experience />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/live-reservation" element={<LiveReservation />} />
          
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/payment" element={<MyPayment />} />
          <Route path="/mypage/review" element={<MyReview />}>
            <Route index element={<Navigate to="write" replace />} />
            <Route path="write" element={<WriteReview />} />
            <Route path="list" element={<ListReview />} />
          </Route>
          <Route path="/mypage/review/form/:id" element={<ReviewForm />} />
          <Route path="/mypage/notification" element={<Notification />} />
          
          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/logout" element={<Logout />} />
          
          {/* Host Routes */}
          <Route path="/host/login" element={<HostLogin />} />
          <Route path="/host" element={<HostRegister />} />
          <Route path="/host/booking" element={<HostBooking />} />
          <Route path="/host/payment" element={<HostPayment />} />
          <Route path="/host/payment/:date" element={<PaymentDetail />} />
          <Route path="/host/register" element={<HostRegister />} />
          <Route path="/host/register/new" element={<RegisterForm />} />
          <Route path="/host/register/detail" element={<RegisterDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
