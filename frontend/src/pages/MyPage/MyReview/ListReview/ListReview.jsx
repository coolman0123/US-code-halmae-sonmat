import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import filledStar from '../../../../assets/icons/MyReview_채워진별.png';
import emptyStar from '../../../../assets/icons/MyReview_빈별.png';
import './ListReview.css';

const ListReview = () => {
  const [userReviews, setUserReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인한 사용자 정보 가져오기
    const userData = localStorage.getItem("currentUser");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (isLoggedIn === "true" && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        loadUserReviews(user);
      } catch (error) {
        console.error("사용자 데이터 파싱 오류:", error);
        navigate("/auth/login");
      }
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const loadUserReviews = (user) => {
    // localStorage에서 사용자별 리뷰 가져오기
    const allReviews = JSON.parse(localStorage.getItem('userReviews') || '{}');
    const reviews = allReviews[user.email] || [];
    
    // 최신 순으로 정렬
    const sortedReviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setUserReviews(sortedReviews);
  };
  if (!currentUser) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className='written-review'>
      {userReviews.length > 0 ? (
        userReviews.map((review) => (
          <div key={review.id} className='written-item'>
            <div className='header'>
              <div className='left'>
                <p className='place'>
                  {review.place} <span className='arrow'>›</span>
                </p>
                <p className='quote'>{review.quote}</p>
                <div className='stars'>
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={i < review.rating ? filledStar : emptyStar}
                      alt='별'
                    />
                  ))}
                </div>
                {review.hasRuralExperience && (
                  <p className='experience-badge'>일손 돕기 체험 완료</p>
                )}
              </div>
              <p className='date'>{review.date}</p>
            </div>
            <p className='content'>{review.content}</p>
            {review.photos && review.photos.length > 0 && (
              <div className='review-photos'>
                {review.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`리뷰 사진 ${index + 1}`}
                    className='review-photo'
                  />
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className='no-reviews'>
          <p>작성한 리뷰가 없습니다.</p>
          <p>숙박 후 리뷰를 작성해보세요!</p>
        </div>
      )}
    </div>
  );
};

export default ListReview;
