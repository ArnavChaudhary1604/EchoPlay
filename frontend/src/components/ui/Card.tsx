import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'video' | 'glass';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  hover = true,
}) => {
  const variants = {
    default: 'card',
    video: 'video-card',
    glass: 'glass-strong rounded-xl p-6',
  };

  return (
    <div
      className={cn(
        variants[variant],
        hover && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};