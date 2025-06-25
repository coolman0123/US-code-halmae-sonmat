import React from 'react';
import filledStar from '../../../../assets/icons/MyReview_채워진별.png';
import emptyStar from '../../../../assets/icons/MyReview_빈별.png';
import './ListReview.css';

const mockWritten = [
  {
    id: 1,
    place: '야야',
    date: '2024.11.13',
    quote: '"말보단 손이 빠른" 박봉순 할머니',
    rating: 2,
    content:
      '바퀴벌레 나와서 저희가 잡아드렸습니다\n넘 더러워서 씻기도 싫었어요 곰팡이도 있고 바닥도 밟기 싫은 바닥이에요 이불에도 핏자국이 묻어있었어요\n무던한 성격이라 조금 더러운 건 아무렇지 않게 사용하는데 여긴 재방문은 절대 안할 것 같아요',
  },
  {
    id: 2,
    place: '모모',
    date: '2025.05.24',
    quote: '"입은 좀 험하지만 속은 꿀" 김옥순 할머니',
    rating: 5,
    content: '너무 좋았습니다!!',
  },
];

const ListReview = () => {
  return (
    <div className='written-review'>
      {mockWritten.map((review) => (
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
            </div>
            <p className='date'>{review.date}</p>
          </div>
          <p className='content'>{review.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ListReview;
