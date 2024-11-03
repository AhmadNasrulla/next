// CircularProgress.tsx
import React from 'react';

interface CircularProgressProps {
  progress: number;
  size?: number; // Optional size prop
  strokeColor?: string; // Optional stroke color prop
  backgroundColor?: string; // Optional background color prop
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 50,
  strokeColor = "#3b82f6", // Default to blue
  backgroundColor = "#e6e6e6", // Default to light gray
}) => {
  const radius = (size - 4) / 2; // Adjust for stroke width
  const strokeWidth = 4;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} aria-label={`Progress: ${progress}%`}>
      <circle
        stroke={backgroundColor}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={strokeColor}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: 'stroke-dashoffset 0.5s ease 0s' }}
      />
    </svg>
  );
};

export default CircularProgress;
