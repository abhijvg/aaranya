'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Enquiry } from '@/types/enquiry';
import { Product } from '@/types/product';
import EnquiryUpdateModal from './EnquiryUpdateModal';

interface EnquiriesListProps {
  products: Product[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  contacted: 'bg-blue-100 text-blue-800 border-blue-200',
  sale_done: 'bg-green-100 text-green-800 border-green-200',
  sale_failed: 'bg-red-100 text-red-800 border-red-200',
  cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  contacted: 'Contacted',
  sale_done: 'Sale Done',
  sale_failed: 'Sale Failed',
  cancelled: 'Cancelled',
};

export default function EnquiriesList({ products }: EnquiriesListProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    filterEnquiries();
  }, [enquiries, selectedProductId, selectedStatus]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/enquiries');
      if (response.ok) {
        const data = await response.json();
        setEnquiries(data);
      } else {
        console.error('Failed to fetch enquiries');
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEnquiries = () => {
    let filtered = [...enquiries];

    if (selectedProductId !== 'all') {
      filtered = filtered.filter((e) => e.product_id === selectedProductId);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((e) => e.status === selectedStatus);
    }

    setFilteredEnquiries(filtered);
  };

  const handleUpdate = (updatedEnquiry: Enquiry) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === updatedEnquiry.id ? updatedEnquiry : e))
    );
    setIsModalOpen(false);
    setSelectedEnquiry(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) {
      return;
    }

    try {
      const response = await fetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      } else {
        alert('Failed to delete enquiry');
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      alert('Failed to delete enquiry');
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <div className="text-gray-600">Loading enquiries...</div>
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Filter by Product
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="input-base w-full"
            >
              <option value="all">All Products</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Filter by Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-base w-full"
            >
              <option value="all">All Statuses</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Enquiries Table */}
      {filteredEnquiries.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-lg font-medium text-gray-900 mb-2">No enquiries found</p>
          <p className="text-gray-600">
            {enquiries.length === 0
              ? 'No enquiries have been created yet'
              : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Product</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Customer</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Description</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Created</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {enquiry.product?.name || 'Unknown Product'}
                        </p>
                        {enquiry.product && (
                          <p className="text-xs text-gray-500">
                            ₹{enquiry.product.offer_price?.toFixed(2) || enquiry.product.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${STATUS_COLORS[enquiry.status] || STATUS_COLORS.pending}`}
                      >
                        {STATUS_LABELS[enquiry.status] || enquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {enquiry.customer_name && (
                          <p className="text-gray-900 font-medium">{enquiry.customer_name}</p>
                        )}
                        {enquiry.customer_phone && (
                          <p className="text-xs text-gray-500">{enquiry.customer_phone}</p>
                        )}
                        {enquiry.customer_email && (
                          <p className="text-xs text-gray-500">{enquiry.customer_email}</p>
                        )}
                        {!enquiry.customer_name && !enquiry.customer_phone && !enquiry.customer_email && (
                          <span className="text-gray-500">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700 max-w-xs truncate">
                        {enquiry.description || '—'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {format(new Date(enquiry.created_at), 'MMM d, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => {
                            setSelectedEnquiry(enquiry);
                            setIsModalOpen(true);
                          }}
                          className="text-primary-600 hover:text-primary-900 font-medium text-sm transition-colors"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(enquiry.id)}
                          className="text-red-600 hover:text-red-900 font-medium text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {isModalOpen && selectedEnquiry && (
        <EnquiryUpdateModal
          enquiry={selectedEnquiry}
          onUpdate={handleUpdate}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEnquiry(null);
          }}
        />
      )}
    </>
  );
}

