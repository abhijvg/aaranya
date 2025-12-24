'use client';

import { useState } from 'react';
import { Enquiry, EnquiryStatus, UpdateEnquiryInput } from '@/types/enquiry';

interface EnquiryUpdateModalProps {
  enquiry: Enquiry;
  onUpdate: (enquiry: Enquiry) => void;
  onClose: () => void;
}

const STATUS_OPTIONS: { value: EnquiryStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'sale_done', label: 'Sale Done' },
  { value: 'sale_failed', label: 'Sale Failed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function EnquiryUpdateModal({
  enquiry,
  onUpdate,
  onClose,
}: EnquiryUpdateModalProps) {
  const [formData, setFormData] = useState<UpdateEnquiryInput>({
    status: enquiry.status,
    description: enquiry.description || '',
    notes: enquiry.notes || '',
    customer_name: enquiry.customer_name || '',
    customer_phone: enquiry.customer_phone || '',
    customer_email: enquiry.customer_email || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/enquiries/${enquiry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update enquiry');
      }

      const updatedEnquiry = await response.json();
      onUpdate(updatedEnquiry);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update enquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Update Enquiry</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-200">
              <div className="text-sm font-medium text-red-800">{error}</div>
            </div>
          )}

          {/* Product Info */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Product</label>
            <div className="input-base bg-gray-50">
              {enquiry.product?.name || 'Unknown Product'}
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-gray-900 mb-2">
              Status *
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as EnquiryStatus })
              }
              className="input-base"
              required
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Name */}
          <div>
            <label htmlFor="customer_name" className="block text-sm font-semibold text-gray-900 mb-2">
              Customer Name
            </label>
            <input
              id="customer_name"
              type="text"
              value={formData.customer_name || ''}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              className="input-base"
              placeholder="Enter customer name"
            />
          </div>

          {/* Customer Phone */}
          <div>
            <label htmlFor="customer_phone" className="block text-sm font-semibold text-gray-900 mb-2">
              Customer Phone
            </label>
            <input
              id="customer_phone"
              type="tel"
              value={formData.customer_phone || ''}
              onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
              className="input-base"
              placeholder="Enter phone number"
            />
          </div>

          {/* Customer Email */}
          <div>
            <label htmlFor="customer_email" className="block text-sm font-semibold text-gray-900 mb-2">
              Customer Email
            </label>
            <input
              id="customer_email"
              type="email"
              value={formData.customer_email || ''}
              onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              className="input-base"
              placeholder="Enter email address"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-base"
              rows={3}
              placeholder="Enter description"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-900 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-base"
              rows={4}
              placeholder="Add internal notes about this enquiry"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Enquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

