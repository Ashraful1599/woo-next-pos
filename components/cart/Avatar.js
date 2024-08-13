import React from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Importing a user icon from Font Awesome
import Image from 'next/image';

const Avatar = ({ src, alt, size }) => {
  return (
    <div className="avatar" style={{ width: size, height: size }}>
      {src ? (
        <Image
          src={src}
          alt={alt || "Avatar"}
          style={{ width: '100%', height: '100%', borderRadius: '50%' }}
        />
      ) : (
        <FaUserCircle style={{ width: '100%', height: '100%', color: '#ccc' }} />
      )}
    </div>
  );
};

export default Avatar;
