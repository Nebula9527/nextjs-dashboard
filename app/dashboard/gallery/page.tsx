import React from "react";
import Image from "next/image";

// 使用更可靠的图片源
const images = [
  {
    id: 1,
    src: "https://img3.huamaocdn.com/upload/bizhi/images-wallpaper/1000w680h/202502182248209132.jpg",
    alt: "Gallery Image 1",
  },
  // {
  //   id: 2,
  //   src: "https://w.wallhaven.cc/full/p9/wallhaven-p9qr89.png",
  //   alt: "Gallery Image 2",
  // },
  // {
  //   id: 3,
  //   src: "https://w.wallhaven.cc/full/p9/wallhaven-p9qr89.png",
  //   alt: "Gallery Image 3",
  // },
  // 可以继续添加更多图片...
];

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square overflow-hidden rounded-lg hover:opacity-90 transition-opacity group"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
