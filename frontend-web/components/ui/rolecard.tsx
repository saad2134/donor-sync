// components/ui/rolecard.tsx
import React from 'react';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export interface RoleCardProps {
  image: string;
  title: string;
  description: string;
  onClick?: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ image, title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center p-4 border rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200 cursor-pointer select-none"
    >
      {/* Fixed-size image */}
      <div className="relative w-16 h-16 flex-shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
          className="rounded-md object-cover select-none"
        />
      </div>

      {/* Title and description */}
      <div className="ml-4 flex-grow">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {/* Right arrow icon */}
      <ArrowRightIcon className="w-6 h-6 text-gray-400 flex-shrink-0" />
    </div>
  );
};

export default RoleCard;
