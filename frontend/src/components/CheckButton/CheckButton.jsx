import React from 'react';
import grayCheckIcon from '../../assets/icons/회색체크.png';
import whiteCheckIcon from '../../assets/icons/흰체크.png';
import './CheckButton.css';

const SelectButton = ({
  selected,
  disabled,
  withCheck = true,
  text = '선택',
  onClick,
}) => {
  const isActive = selected && !disabled;

  const className = [
    'select-btn',
    isActive ? 'active' : '',
    disabled ? 'disabled' : '',
    !isActive && !disabled ? 'hoverable' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={className} disabled={disabled} onClick={onClick}>
      {withCheck && (
        <img
          src={isActive ? whiteCheckIcon : grayCheckIcon}
          alt='체크'
          className='check-icon'
        />
      )}
      <span>{text}</span>
    </button>
  );
};

export default SelectButton;
