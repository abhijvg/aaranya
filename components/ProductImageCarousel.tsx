'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
  videoUrl?: string | null;
}

export default function ProductImageCarousel({ images, productName, videoUrl }: ProductImageCarouselProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const allImages = images.length > 0 ? images : [];

  // If no images, don't render anything
  if (allImages.length === 0) {
    return null;
  }

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-5">
      {/* Main Image */}
      <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
        <Image
          src={allImages[selectedImageIndex]}
          alt={`${productName} - Image ${selectedImageIndex + 1}`}
          fill
          className="object-cover"
          priority={selectedImageIndex === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        
        {/* Navigation Arrows - Only show if more than 1 image */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 z-10"
              aria-label="Previous image"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 z-10"
              aria-label="Next image"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Image Indicator Dots - Only show if more than 1 image */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === selectedImageIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {allImages.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedImageIndex
                  ? 'border-primary-600 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className={`object-cover transition-transform ${
                  index === selectedImageIndex ? 'scale-100' : 'hover:scale-105'
                }`}
                sizes="25vw"
              />
            </button>
          ))}
        </div>
      )}

      {/* Video Section */}
      {videoUrl && (
        <div className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}

