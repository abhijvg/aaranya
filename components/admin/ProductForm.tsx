'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { uploadImage, uploadVideo } from '@/utils/upload';
import { PRODUCT_CONSTRAINTS } from '@/lib/constants';
import Image from 'next/image';
/* eslint-disable @next/next/no-img-element */

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
}

interface FormData {
  name: string;
  price: string;
  offer_price: string;
  description: string;
  images: string[];
  video_url: string;
  slug: string;
  category_id: string;
}

export default function ProductForm({ product, onSubmit, isSubmitting }: ProductFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: product?.name || '',
    price: product?.price.toString() || '',
    offer_price: product?.offer_price?.toString() || '',
    description: product?.description || '',
    images: product?.images || [],
    video_url: product?.video_url || '',
    slug: product?.slug || '',
    category_id: product?.category_id || '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price.toString() || '',
        offer_price: product.offer_price?.toString() || '',
        description: product.description || '',
        images: product.images || [],
        video_url: product.video_url || '',
        slug: product.slug || '',
        category_id: product.category_id || '',
      });
    }
  }, [product]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.offer_price && parseFloat(formData.offer_price) >= parseFloat(formData.price)) {
      newErrors.offer_price = 'Offer price must be less than regular price';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.images.length === 0 && imageFiles.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    if (formData.images.length + imageFiles.length > PRODUCT_CONSTRAINTS.MAX_IMAGES) {
      newErrors.images = `Maximum ${PRODUCT_CONSTRAINTS.MAX_IMAGES} images allowed`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length + imageFiles.length > 5) {
      setErrors({ ...errors, images: 'Maximum 5 images allowed' });
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
    setErrors({ ...errors, images: '' });
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const removeImageFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setUploadingImages(true);

    try {
      // Upload new images
      const uploadedImageUrls: string[] = [];
      for (const file of imageFiles) {
        const url = await uploadImage(file);
        uploadedImageUrls.push(url);
      }

      // Upload video if provided
      let videoUrl = formData.video_url;
      if (videoFile) {
        videoUrl = await uploadVideo(videoFile);
      }

      // Combine existing images with new ones
      const allImages = [...formData.images, ...uploadedImageUrls];

      const submitData: FormData = {
        ...formData,
        images: allImages,
        video_url: videoUrl,
      };

      await onSubmit(submitData);
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to upload files' });
    } finally {
      setUploadingImages(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">{errors.submit}</div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`input-base ${errors.name ? 'border-red-300' : ''}`}
          placeholder="e.g., Beaded Anklet"
        />
        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-semibold text-gray-900 mb-2">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="price"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className={`input-base ${errors.price ? 'border-red-300' : ''}`}
            placeholder="0.00"
          />
          {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
        </div>

        <div>
          <label htmlFor="offer_price" className="block text-sm font-semibold text-gray-900 mb-2">
            Offer Price (Optional)
          </label>
          <input
            type="number"
            id="offer_price"
            step="0.01"
            min="0"
            value={formData.offer_price}
            onChange={(e) => setFormData({ ...formData, offer_price: e.target.value })}
            className={`input-base ${errors.offer_price ? 'border-red-300' : ''}`}
            placeholder="0.00"
          />
          {errors.offer_price && <p className="mt-2 text-sm text-red-600">{errors.offer_price}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={`input-base ${errors.description ? 'border-red-300' : ''}`}
          placeholder="Describe your product in detail..."
        />
        {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="category_id" className="block text-sm font-semibold text-gray-900 mb-2">
          Category
        </label>
        <select
          id="category_id"
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          className="input-base"
          disabled={loadingCategories}
        >
          <option value="">No Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {loadingCategories && (
          <p className="mt-2 text-sm text-gray-500">Loading categories...</p>
        )}
      </div>

      <div>
        <label htmlFor="images" className="block text-sm font-semibold text-gray-900 mb-2">
          Images <span className="text-red-500">*</span> (up to {PRODUCT_CONSTRAINTS.MAX_IMAGES})
        </label>
        <p className="text-sm text-gray-600 mb-4">
          {formData.images.length + imageFiles.length} / {PRODUCT_CONSTRAINTS.MAX_IMAGES} images uploaded
        </p>

        {/* Existing images */}
        {formData.images.length > 0 && (
          <div className="grid grid-cols-5 gap-4 mb-4">
            {formData.images.map((url, index) => (
              <div key={index} className="relative">
                <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={url}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 20vw, 20vw"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New image files */}
        {imageFiles.length > 0 && (
          <div className="grid grid-cols-5 gap-4 mb-4">
            {imageFiles.map((file, index) => (
              <div key={index} className="relative">
                <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImageFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {formData.images.length + imageFiles.length < PRODUCT_CONSTRAINTS.MAX_IMAGES && (
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
          />
        )}
        {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
      </div>

      <div>
        <label htmlFor="video" className="block text-sm font-semibold text-gray-900 mb-2">
          Video (Optional)
        </label>
        {formData.video_url && !videoFile && (
          <div className="mt-2 mb-2">
            <video src={formData.video_url} controls className="max-w-md rounded-lg" />
            <button
              type="button"
              onClick={() => setFormData({ ...formData, video_url: '' })}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Remove video
            </button>
          </div>
        )}
        {videoFile && (
          <div className="mt-2 mb-2">
            <video
              src={URL.createObjectURL(videoFile)}
              controls
              className="max-w-md rounded-lg"
            />
            <button
              type="button"
              onClick={() => setVideoFile(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Remove new video
            </button>
          </div>
        )}
        <input
          type="file"
          id="video"
          accept="video/*"
          onChange={handleVideoChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || uploadingImages}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || uploadingImages ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
