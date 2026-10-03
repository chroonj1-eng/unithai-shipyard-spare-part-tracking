import React from 'react';

interface Props {
  className?: string;
  showText?: boolean;
  lightBackground?: boolean;
}

export const UnithaiLogo: React.FC<Props> = ({
  className = 'h-8',
  showText = true,
  lightBackground = false,
}) => {
  if (lightBackground) {
    // Official UNITHAI logo for light / white background
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src="/unithai-logo.jpg"
          alt="UNITHAI Logo"
          className="h-full w-auto object-contain shrink-0"
          style={{ maxHeight: '100%' }}
        />
      </div>
    );
  }

  // Official UNITHAI logo for dark background or header
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/unithai-logo-white.png"
        alt="UNITHAI Logo"
        className="h-full w-auto object-contain shrink-0"
        style={{ maxHeight: '100%' }}
      />
    </div>
  );
};
