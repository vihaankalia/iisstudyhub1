import React from "react";

interface SchoolLogoProps {
  className?: string;
  size?: number;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({ className = "", size = 40 }) => {
  return (
    <img
      src="https://pbs.twimg.com/profile_images/1219493155516579840/O6E6AtCk_400x400.jpg"
      alt="The Indian International School Logo"
      className={`inline-block object-contain select-none pointer-events-none rounded-lg ${className}`}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      referrerPolicy="no-referrer"
    />
  );
};
