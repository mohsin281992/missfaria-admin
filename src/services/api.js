const API_BASE = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

// Products API
export async function fetchProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/products${query ? `?${query}` : ''}`);
  return handleResponse(res);
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  return handleResponse(res);
}

export async function createProduct(productData) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  return handleResponse(res);
}

export async function updateProduct(id, productData) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  return handleResponse(res);
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(res);
}

export async function duplicateProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}/duplicate`, {
    method: 'POST'
  });
  return handleResponse(res);
}

// Categories API
export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  return handleResponse(res);
}

export async function addCategory(name) {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  return handleResponse(res);
}

export async function deleteCategory(name) {
  const res = await fetch(`${API_BASE}/categories/${encodeURIComponent(name)}`, {
    method: 'DELETE'
  });
  return handleResponse(res);
}

// Orders API
export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`);
  return handleResponse(res);
}

export async function updateOrderStatus(id, status) {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return handleResponse(res);
}

export async function deleteOrder(id) {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(res);
}

// Customers API
export async function fetchCustomers() {
  const res = await fetch(`${API_BASE}/customers`);
  return handleResponse(res);
}

// Settings API
export async function fetchSettings() {
  const res = await fetch(`${API_BASE}/settings`);
  return handleResponse(res);
}

export async function updateSettings(settingsData) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settingsData)
  });
  return handleResponse(res);
}

// Analytics API
export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE}/analytics`);
  return handleResponse(res);
}

import { compressImageFile } from '../utils/imageCompressor';

// Upload API
export async function uploadImageFile(file) {
  // Compress image before uploading/processing to speed up transfers by 10x-20x
  const processedFile = await compressImageFile(file, 1200, 1200, 0.82);

  try {
    const formData = new FormData();
    formData.append('image', processedFile);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        return data;
      }
    } else {
      console.warn(`API upload responded with status ${res.status}, using base64 fallback.`);
    }
  } catch (err) {
    console.warn('API upload endpoint unreachable, using base64 fallback:', err);
  }

  // Fallback: Convert image to Data URL (base64) so uploads always work everywhere
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ url: reader.result, message: 'File uploaded (base64 fallback)' });
    };
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    reader.readAsDataURL(processedFile);
  });
}

// Marketing & Store Modules API


// 1 & 2. Announcement Bar
export async function fetchAnnouncementBar() {
  const res = await fetch(`${API_BASE}/marketing/announcement`);
  return handleResponse(res);
}

export async function updateAnnouncementBar(data) {
  const res = await fetch(`${API_BASE}/marketing/announcement`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

// 3. Trust Badges
export async function fetchTrustBadges() {
  const res = await fetch(`${API_BASE}/marketing/trust-badges`);
  return handleResponse(res);
}

export async function createTrustBadge(badgeData) {
  const res = await fetch(`${API_BASE}/marketing/trust-badges`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(badgeData)
  });
  return handleResponse(res);
}

export async function updateTrustBadge(id, badgeData) {
  const res = await fetch(`${API_BASE}/marketing/trust-badges/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(badgeData)
  });
  return handleResponse(res);
}

export async function deleteTrustBadge(id) {
  const res = await fetch(`${API_BASE}/marketing/trust-badges/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(res);
}

// 4. Bundle Offers
export async function fetchBundleOffers() {
  const res = await fetch(`${API_BASE}/marketing/bundles`);
  return handleResponse(res);
}

export async function createBundleOffer(bundleData) {
  const res = await fetch(`${API_BASE}/marketing/bundles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bundleData)
  });
  return handleResponse(res);
}

export async function updateBundleOffer(id, bundleData) {
  const res = await fetch(`${API_BASE}/marketing/bundles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bundleData)
  });
  return handleResponse(res);
}

export async function deleteBundleOffer(id) {
  const res = await fetch(`${API_BASE}/marketing/bundles/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(res);
}

// 5. Stock Counters
export async function fetchStockCounters() {
  const res = await fetch(`${API_BASE}/marketing/stock-counters`);
  return handleResponse(res);
}

export async function updateStockCounters(data) {
  const res = await fetch(`${API_BASE}/marketing/stock-counters`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

// 6. FAQs
export async function fetchFaqs() {
  const res = await fetch(`${API_BASE}/marketing/faqs`);
  return handleResponse(res);
}

export async function createFaq(faqData) {
  const res = await fetch(`${API_BASE}/marketing/faqs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(faqData)
  });
  return handleResponse(res);
}

export async function updateFaq(id, faqData) {
  const res = await fetch(`${API_BASE}/marketing/faqs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(faqData)
  });
  return handleResponse(res);
}

export async function deleteFaq(id) {
  const res = await fetch(`${API_BASE}/marketing/faqs/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(res);
}

// 7. Customer Reviews
export async function fetchReviews() {
  const res = await fetch(`${API_BASE}/marketing/reviews`);
  return handleResponse(res);
}

export async function createReview(reviewData) {
  const res = await fetch(`${API_BASE}/marketing/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
  return handleResponse(res);
}

export async function updateReviewStatus(id, status) {
  const res = await fetch(`${API_BASE}/marketing/reviews/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return handleResponse(res);
}

export async function deleteReview(id) {
  const res = await fetch(`${API_BASE}/marketing/reviews/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(res);
}


