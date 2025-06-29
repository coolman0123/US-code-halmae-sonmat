import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import MainPage from "./pages/MainPage/MainPage";
import Stories from "./pages/Stories/Stories";
import Experience from "./pages/Experience/Experience";
import Booking from "./pages/Booking/Booking";
import LiveReservation from "./pages/LiveReservation/LiveBooking/LiveBooking";

import MyPage from "./pages/MyPage/MyPage/MyPage";
import MyPayment from "./pages/MyPage/MyPayment/MyPayment";
import MyReview from "./pages/MyPage/MyReview/MyReview/MyReview";
import WriteReview from "./pages/MyPage/MyReview/WriteReview/WriteReview";
import ListReview from "./pages/MyPage/MyReview/ListReview/ListReview";
import ReviewForm from "./pages/MyPage/MyReview/ReviewForm/ReviewForm";
import Notification from "./pages/MyPage/Notification/Notification";

// Auth Pages
import Login from './pages/Auth/Login/Login';
import AdminLogin from './pages/Auth/AdminLogin/AdminLogin';
import SignUp from './pages/Auth/SignUp/SignUp';
import Logout from './pages/Auth/Logout/Logout';


// Host Pages
import HostHeader from "./components/HostHeader/HostHeader";
import HostLogin from "./pages/Host/Login/Login";
import HostBooking from "./pages/Host/Booking/Booking";
import AddReservation from "./pages/Host/Booking/AddReservation";
import HostPayment from "./pages/Host/Payment/Payment";
import PaymentDetail from "./pages/Host/Payment/PaymentDetail";
import HostRegister from "./pages/Host/Register/Register";
import RegisterForm from "./pages/Host/Register/RegisterForm";
import RegisterDetail from "./pages/Host/Register/RegisterDetail";

//실시간 예약 페이지
import BookNow from "./pages/LiveReservation/BookNow/BookNow";
import DetailBooking from "./pages/LiveReservation/DetailBooking/DetailBooking";
import MyReservation from "./pages/LiveReservation/MyReservation/MyReservation";
import Payment from "./pages/LiveReservation/Payment/Payment";
import Review from "./pages/LiveReservation/Review/Review";
import ReviewPhotos from "./pages/LiveReservation/ReviewPhotos/ReviewPhotos";

import "./App.css";

// Header와 Footer를 조건부로 표시하는 컴포넌트
const Layout = ({ children }) => {
  const location = useLocation();

  // 인증 페이지에서는 Header, Footer 숨기기
  const hideHeaderFooter = [

    '/auth/login',
    '/auth/admin-login',
    '/auth/signup',
    '/host/login',

  ].includes(location.pathname);

  // 마이페이지 경로에서는 Footer 숨기기
  const isMyPage = location.pathname.startsWith("/mypage");

  // 관리자 페이지 확인
  const isHostPage =
    location.pathname.startsWith("/host") &&
    !location.pathname.includes("/login");

  return (
    <div className="App">
      {!hideHeaderFooter && (isHostPage ? <HostHeader /> : <Header />)}
      <main>{children}</main>
      {!hideHeaderFooter && !isMyPage && <Footer />}
    </div>
  );
};

function App() {
  useEffect(() => {
    // 테스트용 사용자 계정 초기화
    const initializeTestUsers = () => {
      const existingUsers = localStorage.getItem("users");
      if (!existingUsers) {
        const testUsers = [
          {
            id: "1",
            name: "user",
            email: "user",
            password: "0000",
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "admin",
            email: "admin",
            password: "0000",
            createdAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem("users", JSON.stringify(testUsers));
      }
    };

    initializeTestUsers();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/experiences" element={<Experience />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/live-reservation" element={<LiveReservation />}>
              <Route index element={<Navigate to="my" replace />} />
              <Route path="my" element={<MyReservation />} />
              <Route path="book" element={<BookNow />} />
            </Route>
            <Route
              path="/live-reservation/detail/:roomId"
              element={<DetailBooking />}
            />
            <Route
              path="/live-reservation/review/:roomId"
              element={<Review />}
            />
            <Route
              path="/live-reservation/review-photos/:roomId"
              element={<ReviewPhotos />}
            />
            <Route path="/live-reservation/payment" element={<Payment />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypage/payment" element={<MyPayment />} />
            <Route path="/mypage/review/*" element={<MyReview />}>
              <Route index element={<Navigate to="write" replace />} />
              <Route path="write" element={<WriteReview />} />
              <Route path="list" element={<ListReview />} />
            </Route>
            <Route path="/mypage/review/form/:id" element={<ReviewForm />} />
            <Route path="/mypage/notification" element={<Notification />} />

            {/* Auth Routes */}
            <Route path='/auth/login' element={<Login />} />
            <Route path='/auth/admin-login' element={<AdminLogin />} />
            <Route path='/auth/signup' element={<SignUp />} />
            <Route path='/auth/logout' element={<Logout />} />


            {/* Host Routes */}
            <Route path="/host/login" element={<HostLogin />} />
            <Route path="/host" element={<HostRegister />} />
            <Route path="/host/booking" element={<HostBooking />} />
            <Route path="/host/booking/add" element={<AddReservation />} />
            <Route path="/host/payment" element={<HostPayment />} />
            <Route path="/host/payment/:date" element={<PaymentDetail />} />
            <Route path="/host/register" element={<HostRegister />} />
            <Route path="/host/register/new" element={<RegisterForm />} />
            <Route path="/host/register/detail" element={<RegisterDetail />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
