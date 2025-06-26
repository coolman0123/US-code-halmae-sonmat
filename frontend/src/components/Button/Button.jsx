import React from 'react';
import './Button.css';

const Button = ({
  selected,
  disabled,
  withIcon = true,
  icon,
  activeIcon,
  text = '',
  onClick,
}) => {
  const isActive = selected && !disabled;
  const iconSrc = isActive ? activeIcon || icon : icon;

  const className = [
    'select-btn',
    isActive ? 'active' : '',
    disabled ? 'disabled' : '',
    !isActive && !disabled ? 'hoverable' : '',
    withIcon && iconSrc ? '' : 'no-icon',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={className} disabled={disabled} onClick={onClick}>
      {withIcon && iconSrc && (
        <img src={iconSrc} alt='아이콘' className='check-icon' />
      )}
      <span>{text}</span>
    </button>
  );
};

export default Button;
