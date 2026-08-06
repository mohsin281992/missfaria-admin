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

// Upload API
export async function uploadImageFile(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);

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
    reader.readAsDataURL(file);
  });
}
