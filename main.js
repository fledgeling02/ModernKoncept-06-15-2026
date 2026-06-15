// PAGE TRANSITION EFFECT FOR SMOOTH NAVIGATION
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Add smooth page transitions to internal page navigation links
  document.querySelectorAll('a.nav-btn').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) {
      return;
    }

    // Allow same-page anchor scrolling normally
    if (href.startsWith('#')) {
      return;
    }

    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.add('page-transition-out');
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });
});

//  BACKEND INTEGRATION 
// =============================================================================

const API_URL = 'http://localhost:3000';
// TOAST NOTIFICATION SYSTEM
// =============================================================================

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Type of toast: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (default: 4000)
 */
function showToast(message, type = 'info', duration = 4000) {
  // Create toast container if it doesn't exist
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Icon mapping
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <div class="toast-message">${message}</div>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;

  // Add to container
  container.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 300);
  }, duration);
}
// API OBJECT - ALL BACKEND CALLS
// Global chart instances
let revenueBarChartInstance = null;
let salesLineChartInstance = null;
const API = {
  // Authentication
  signup: async (name, email, password) => {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return await response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await response.json();
  },

  // Furniture
  getFurniture: async () => {
    const response = await fetch(`${API_URL}/products`);
    return await response.json();
  },

  createFurniture: async (data) => {
    const response = await fetch(`${API_URL}/add-product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  updateFurniture: async (id, data) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  deleteFurniture: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  },

  // Inventory
  getInventory: async () => {
    const response = await fetch(`${API_URL}/inventory`);
    return await response.json();
  },

  createInventory: async (data) => {
    const response = await fetch(`${API_URL}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  updateInventory: async (id, data) => {
    const response = await fetch(`${API_URL}/inventory/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  deleteInventory: async (id) => {
    const response = await fetch(`${API_URL}/inventory/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  },

  // Deliveries
  getDeliveries: async () => {
    const response = await fetch(`${API_URL}/deliveries`);
    return await response.json();
  },

  trackDelivery: async (refCode) => {
    const response = await fetch(`${API_URL}/deliveries/track/${refCode}`);
    return await response.json();
  },

  createDelivery: async (data) => {
    const response = await fetch(`${API_URL}/deliveries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  updateDelivery: async (id, data) => {
    const response = await fetch(`${API_URL}/deliveries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  // Update delivery status only (for staff)
  updateDeliveryStatus: async (id, status) => {
    const response = await fetch(`${API_URL}/deliveries/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await response.json();
  },

  deleteDelivery: async (id) => {
    const response = await fetch(`${API_URL}/deliveries/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  },

  // Sales
  getSales: async () => {
    const response = await fetch(`${API_URL}/sales`);
    return await response.json();
  },

  createSales: async (data) => {
    const response = await fetch(`${API_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

    updateSales: async (id, data) => {
    const response = await fetch(`${API_URL}/sales/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  deleteSales: async (id) => {
    const response = await fetch(`${API_URL}/sales/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  },
  // Get monthly sales data
getMonthlySales: async () => {
    const response = await fetch(`${API.baseURL}/sales/monthly`);
    if (!response.ok) throw new Error('Failed to fetch monthly sales');
    return response.json();
},



  // Reviews
  getReviews: async () => {
    const response = await fetch(`${API_URL}/reviews`);
    return await response.json();
  },

  createReview: async (data) => {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  deleteReview: async (id) => {
    const response = await fetch(`${API_URL}/reviews/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  },

  // Staff Accounts
  getStaff: async () => {
    const response = await fetch(`${API_URL}/staff`);
    return await response.json();
  },

  createStaff: async (data) => {
    const response = await fetch(`${API_URL}/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  deleteStaff: async (id) => {
    const response = await fetch(`${API_URL}/staff/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  },

  // Business Information - NEW
  getBusinessInfo: async () => {
    const response = await fetch(`${API_URL}/business-info`);
    return await response.json();
  },

  saveBusinessInfo: async (data) => {
    const response = await fetch(`${API_URL}/business-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  // Contact Information - NEW
  getContactInfo: async () => {
    const response = await fetch(`${API_URL}/contact-info`);
    return await response.json();
  },

  saveContactInfo: async (data) => {
    const response = await fetch(`${API_URL}/contact-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function formatCurrency(amount) {
  const num = parseFloat(amount);
  if (isNaN(num)) return '₱0.00';
  return '₱' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', { 
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Store current image uploads
let currentFurnitureImage = null;

// File to Base64 converter
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Public Delivery Tracking Handler - FIXED COLUMN NAMES
async function handlePublicTrackDelivery(event) {
  event.preventDefault();
  
  const refCodeInput = document.getElementById('publicTrackCode');
  const resultDiv = document.getElementById('publicTrackResult');
  
  if (!refCodeInput || !resultDiv) {
    console.error('Required elements not found');
    return;
  }
  
  const refCode = refCodeInput.value.trim();
  
  if (!refCode) {
    alert('❌ Please enter a reference code');
    return;
  }
  
  try {
    const result = await API.trackDelivery(refCode);
    
    if (result.success && result.data) {
      const delivery = result.data;
      
      // Format the delivery date
      const deliveryDate = new Date(delivery.delivery_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Display the result
      resultDiv.innerHTML = `
        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1rem;">
          <h3 style="color: #166534; font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">
            ✅ Delivery Found
          </h3>
          
          <div style="display: grid; gap: 0.75rem;">
            <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem;">
              <span style="font-weight: 600; color: #374151;">Reference Code:</span>
              <span style="color: #6b7280;">${delivery.ref_code}</span>
            </div>
            
            <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem;">
              <span style="font-weight: 600; color: #374151;">Customer Name:</span>
              <span style="color: #6b7280;">${delivery.customer_name}</span>
            </div>
            
            <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem;">
              <span style="font-weight: 600; color: #374151;">Delivery Address:</span>
              <span style="color: #6b7280;">${delivery.address}</span>
            </div>
            
            <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem;">
              <span style="font-weight: 600; color: #374151;">Delivery Date:</span>
              <span style="color: #6b7280;">${deliveryDate}</span>
            </div>
            
            <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem;">
              <span style="font-weight: 600; color: #374151;">Status:</span>
              <span style="padding: 0.25rem 0.75rem; background: #DC143C; color: white; border-radius: 9999px; display: inline-block; font-size: 0.875rem; width: fit-content;">
                ${delivery.status || 'Scheduled'}
              </span>
            </div>
          </div>
        </div>
      `;
      
      resultDiv.classList.remove('hidden');
    } else {
      // Not found
      resultDiv.innerHTML = `
        <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 0.5rem; padding: 1.5rem;">
          <h3 style="color: #991b1b; font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">
            ❌ Delivery Not Found
          </h3>
          <p style="color: #6b7280;">
            No delivery found with reference code: <strong>${refCode}</strong>
          </p>
          <p style="color: #6b7280; font-size: 0.875rem; margin-top: 0.5rem;">
            Please check the reference code and try again.
          </p>
        </div>
      `;
      resultDiv.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Track delivery error:', error);
    resultDiv.innerHTML = `
      <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 0.5rem; padding: 1.5rem;">
        <h3 style="color: #991b1b; font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">
          ❌ Error
        </h3>
        <p style="color: #6b7280;">
          Failed to track delivery. Please try again later.
        </p>
      </div>
    `;
    resultDiv.classList.remove('hidden');
  }
}

// =============================================================================
// AUTHENTICATION
// =============================================================================

// Handle Signup
async function handleSignup(event) {
  event.preventDefault();
  
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const result = await API.signup(name, email, password);
    
    if (result.success) {
      showToast('Account created successfully! Please login.', 'success');
      document.getElementById('signupForm').reset();
    } else {
      showToast('❌ ' + result.message);
    }
  } catch (error) {
    console.error('Signup error:', error);
    showToast('❌ Failed to create account. Please check your connection.', 'error');
  }
}

// Handle Login
async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const result = await API.login(email, password);
    
    if (result.success) {
      sessionStorage.setItem('currentUser', JSON.stringify(result.user));
      
      showToast('Login successful!', 'success');
      
      // Delay redirect to show toast notification
      setTimeout(() => {
        if (email === 'admin@admin.com') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'staff.html';
        }
      }, 1500); // 1.5 second delay
    } else {
      showToast(result.message, 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showToast('Failed to login. Please check your connection.', 'error');
  }
}


// Handle Logout
function handleLogout() {
  sessionStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}



// =============================================================================
// ADMIN MODULE - FURNITURE MANAGEMENT
// =============================================================================

let editingFurnitureId = null;

// Load Furniture List
async function loadFurnitureList() {
  try {
    const result = await API.getFurniture();
    
    if (result.success) {
      adminFurnitureItems = result.data;
      renderAdminFurnitureTable(adminFurnitureItems);
    }
  } catch (error) {
    console.error('Load furniture error:', error);
    showToast('❌ Failed to load furniture list');
  }
}

function renderAdminFurnitureTable(items) {
  const tbody = document.getElementById('furnitureList');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!items || items.length === 0) {
    tbody.innerHTML = '<tr class="no-data-row"><td colspan="7">No furniture items found. Try a different search or category.</td></tr>';
    return;
  }

  items.forEach(item => {
    const row = `
      <tr>
        <td>
          ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 0.375rem;">` : '<span style="color: #9ca3af;">No image</span>'}
        </td>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.material || 'N/A'}</td>
        <td>${item.dimensions || 'N/A'}</td>
        <td>${formatCurrency(item.price)}</td>
        <td>
          <button class="action-btn edit" onclick="editFurniture(${item.id})" title="Edit"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
          <button class="action-btn delete" onclick="deleteFurniture(${item.id})" title="Delete"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

function filterAdminFurnitureList() {
  if (!adminFurnitureItems.length) {
    renderAdminFurnitureTable([]);
    return;
  }

  const searchInput = document.getElementById('adminFurnitureSearch');
  const categoryFilter = document.getElementById('adminCategoryFilter');
  let filtered = [...adminFurnitureItems];

  if (searchInput && searchInput.value.trim()) {
    const searchTerm = searchInput.value.trim().toLowerCase();
    filtered = filtered.filter(item => {
      return item.name.toLowerCase().includes(searchTerm)
        || (item.category && item.category.toLowerCase().includes(searchTerm))
        || (item.material && item.material.toLowerCase().includes(searchTerm))
        || (item.description && item.description.toLowerCase().includes(searchTerm));
    });
  }

  if (categoryFilter && categoryFilter.value !== 'all') {
    filtered = filtered.filter(item => item.category === categoryFilter.value);
  }

  renderAdminFurnitureTable(filtered);
}

function initAdminFurnitureSearch() {
  const searchInput = document.getElementById('adminFurnitureSearch');
  const categoryFilter = document.getElementById('adminCategoryFilter');

  if (searchInput) {
    searchInput.addEventListener('input', filterAdminFurnitureList);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterAdminFurnitureList);
  }
}
// =============================================================================
// PUBLIC FURNITURE LIST PAGE - DISPLAY PRODUCTS AS CARDS
// =============================================================================

let allFurnitureProducts = []; // Store all public products for filtering
let adminFurnitureItems = []; // Store admin furniture items for search and filtering

// Load Furniture for Public Page (furniture-list.html)
async function loadPublicFurnitureList() {
  try {
    const result = await API.getFurniture();
    
    if (result.success) {
      allFurnitureProducts = result.data;
      displayFurnitureProducts(allFurnitureProducts);
    } else {
      console.error('Failed to load furniture:', result.message);
      displayNoProducts();
    }
  } catch (error) {
    console.error('Load furniture error:', error);
    displayNoProducts();
  }
}

// Display Furniture Products as Cards
// Display Furniture Products as Cards - WITH CLICKABLE NAVIGATION
function displayFurnitureProducts(products) {
  const container = document.getElementById('productsContainer');
  const productCount = document.getElementById('productCount');
  
  if (!container) return;
  
  container.innerHTML = '';
  
  if (products.length === 0) {
    displayNoProducts();
    return;
  }
  
  // Update product count
  if (productCount) {
    productCount.textContent = `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`;
  }
  
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.cursor = 'pointer'; // Add pointer cursor
    card.style.transition = 'transform 0.2s, box-shadow 0.2s'; // Add smooth transition
    
    card.innerHTML = `
      <img 
        src="${product.image || 'placeholder-furniture.jpg'}" 
        alt="${product.name}" 
        class="product-image"
        onerror="this.src='placeholder-furniture.jpg'"
      >
      <div style="padding: 1.5rem;">
        <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; color: #1f2937;">
          ${product.name}
        </h3>
        <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">
          ${product.category}
        </p>
        ${product.material ? `
          <p style="color: #9ca3af; font-size: 0.75rem; margin-bottom: 0.75rem;">
            Material: ${product.material}
          </p>
        ` : ''}
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
          <span style="font-size: 1.25rem; font-weight: 700; color: #DC143C;">
            ${formatCurrency(product.price)}
          </span>
        </div>
        ${product.description ? `
          <p style="color: #6b7280; font-size: 0.875rem; margin-top: 0.75rem; line-height: 1.5;">
            ${product.description.substring(0, 80)}${product.description.length > 80 ? '...' : ''}
          </p>
        ` : ''}
      </div>
    `;
    
    // Add click event to navigate to detail page
    card.addEventListener('click', () => {
      window.location.href = `furniture-detail.html?id=${product.id}`;
    });
    
    // Add hover effect
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px)';
      card.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    });
    
    container.appendChild(card);
  });
}
// =============================================================================
// FURNITURE DETAIL PAGE FUNCTIONS
// =============================================================================

// Get Product ID from URL
function getProductIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Load and Display Furniture Detail
async function loadFurnitureDetail() {
  const productId = getProductIdFromURL();
  
  if (!productId) {
    showToast('No product ID provided', 'error');
    window.location.href = 'furniture-list.html';
    return;
  }
  
  try {
    // Fetch furniture by ID
    const response = await fetch(`${API_URL}/products/${productId}`);
    const result = await response.json();
    
    if (result.success && result.data) {
      displayFurnitureDetail(result.data);
    } else {
      showToast('Product not found', 'error');
      window.location.href = 'furniture-list.html';
    }
  } catch (error) {
    console.error('Load furniture detail error:', error);
    showToast('Failed to load product details', 'error');
    window.location.href = 'furniture-list.html';
  }
}

// Display Furniture Detail on Page
function displayFurnitureDetail(product) {
  // Update product image
  const productImage = document.getElementById('productImage');
  if (productImage) {
    productImage.src = product.image || 'placeholder-furniture.jpg';
    productImage.alt = product.name;
    productImage.onerror = function() {
      this.src = 'placeholder-furniture.jpg';
    };
  }
  
  // Update product name
  const productName = document.getElementById('productName');
  if (productName) {
    productName.textContent = product.name;
  }
  
  // Update product price
  const productPrice = document.getElementById('productPrice');
  if (productPrice) {
    productPrice.textContent = formatCurrency(product.price);
  }
  
  // Update category
  const productCategory = document.getElementById('productCategory');
  if (productCategory) {
    productCategory.textContent = product.category || 'N/A';
  }
  
  // Update material
  const productMaterial = document.getElementById('productMaterial');
  if (productMaterial) {
    productMaterial.textContent = product.material || 'N/A';
  }
  
  // Update dimensions
  const productDimensions = document.getElementById('productDimensions');
  if (productDimensions) {
    productDimensions.textContent = product.dimensions || 'N/A';
  }
  
  // Update description
  const productDescription = document.getElementById('productDescription');
  if (productDescription) {
    productDescription.textContent = product.description || 'No description available.';
  }
  
  // Update page title
  document.title = `${product.name} - ECL FURNITURE MART`;
}


// Display "No Products" Message
function displayNoProducts() {
  const container = document.getElementById('productsContainer');
  const productCount = document.getElementById('productCount');
  
  if (container) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #9ca3af;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 1rem;">
          <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        </svg>
        <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: #4b5563;">No Furniture Found</h3>
        <p style="color: #9ca3af;">Try adjusting your filters or check back later.</p>
      </div>
    `;
  }
  
  if (productCount) {
    productCount.textContent = 'Showing 0 products';
  }
}

// Filter and Sort Products
function filterAndSortProducts() {
  let filteredProducts = [...allFurnitureProducts];
  
  // Search filter
  const searchInput = document.getElementById('searchInput');
  if (searchInput && searchInput.value.trim()) {
    const searchTerm = searchInput.value.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      (p.description && p.description.toLowerCase().includes(searchTerm))
    );
  }
  
  // Category filter
  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter && categoryFilter.value !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === categoryFilter.value);
  }
  
  // Price filter
  const priceFilter = document.getElementById('priceFilter');
  if (priceFilter && priceFilter.value !== 'all') {
    const priceRange = priceFilter.value;
    if (priceRange === '0-10000') {
      filteredProducts = filteredProducts.filter(p => p.price < 10000);
    } else if (priceRange === '10000-20000') {
      filteredProducts = filteredProducts.filter(p => p.price >= 10000 && p.price <= 20000);
    } else if (priceRange === '20000-50000') {
      filteredProducts = filteredProducts.filter(p => p.price >= 20000 && p.price <= 50000);
    } else if (priceRange === '50000+') {
      filteredProducts = filteredProducts.filter(p => p.price > 50000);
    }
  }
  
  // Sort
  const sortFilter = document.getElementById('sortFilter');
  if (sortFilter) {
    const sortValue = sortFilter.value;
    if (sortValue === 'name-asc') {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === 'name-desc') {
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortValue === 'price-asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    }
  }
  
  displayFurnitureProducts(filteredProducts);
}

// Initialize Filters for Furniture List Page
function initFurnitureListFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');
  const sortFilter = document.getElementById('sortFilter');
  
  if (searchInput) {
    searchInput.addEventListener('input', filterAndSortProducts);
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterAndSortProducts);
  }
  
  if (priceFilter) {
    priceFilter.addEventListener('change', filterAndSortProducts);
  }
  
  if (sortFilter) {
    sortFilter.addEventListener('change', filterAndSortProducts);
  }
}
// Handle Add Furniture Button
function openAddFurnitureModal() {
  editingFurnitureId = null;
  document.getElementById('furnitureModalTitle').textContent = 'Add New Furniture';
  document.getElementById('furnitureForm').reset();
  currentFurnitureImage = null;
  
  // Clear dimension fields
  document.getElementById('furnitureLength').value = '';
  document.getElementById('furnitureWidth').value = '';
  document.getElementById('furnitureHeight').value = '';
  
  const preview = document.getElementById('furnitureImagePreview');
  if (preview) preview.style.display = 'none';
  showModal('furnitureModal');
}

// Handle Furniture Image Upload
function handleFurnitureImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    showToast('Please select an image file', 'warning');
    event.target.value = '';
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    showToast('Please select an image file', 'warning');
    event.target.value = '';
    return;
  }
  
  fileToBase64(file).then(base64String => {
    currentFurnitureImage = base64String;
    const preview = document.getElementById('furnitureImagePreview');
    const previewImg = document.getElementById('furnitureImagePreviewImg');
    if (preview && previewImg) {
      previewImg.src = base64String;
      preview.style.display = 'block';
    }
  }).catch(error => {
    console.error('Error reading file:', error);
    showToast('Error reading file', 'error');
  });
}

// Handle Furniture Form Submit
async function handleFurnitureSubmit(event) {
  event.preventDefault();
  
  // Combine 3 dimension fields into the original format
  const length = document.getElementById('furnitureLength').value;
  const width = document.getElementById('furnitureWidth').value;
  const height = document.getElementById('furnitureHeight').value;
  
  // Validate dimension values
  if (!length || !width || !height || length <= 0 || width <= 0 || height <= 0) {
    showToast('Please enter valid dimensions (all values must be greater than 0)', 'warning');
    return;
  }
  
  // Format: "200cm x 90cm x 80cm"
  const dimensions = `${length}cm x ${width}cm x ${height}cm`;
  
  const data = {
    name: document.getElementById('furnitureName').value,
    category: document.getElementById('furnitureCategory').value,
    price: parseFloat(document.getElementById('furniturePrice').value),
    material: document.getElementById('furnitureMaterial').value,
    dimensions: dimensions,
    description: document.getElementById('furnitureDescription').value,
    image: currentFurnitureImage || ''
  };

  try {
    let result;
    if (editingFurnitureId) {
      result = await API.updateFurniture(editingFurnitureId, data);
    } else {
      result = await API.createFurniture(data);
    }
    
    if (result.success) {
      showToast(result.message, 'success');
      hideModal('furnitureModal');
      loadFurnitureList();
    } else {
      showToast('❌ ' + result.message, 'error');
    }
  } catch (error) {
    console.error('Save furniture error:', error);
    showToast('❌ Failed to save furniture', 'error');
  }
}

// Edit Furniture
async function editFurniture(id) {
  try {
    const result = await API.getFurniture();
    if (result.success) {
      const item = result.data.find(f => f.id === id);
      if (!item) {
        showToast('Furniture not found', 'error');
        return;
      }
      
     editingFurnitureId = id;
document.getElementById('furnitureModalTitle').textContent = 'Edit Furniture';
document.getElementById('furnitureName').value = item.name;
document.getElementById('furnitureCategory').value = item.category;
document.getElementById('furniturePrice').value = item.price;
document.getElementById('furnitureMaterial').value = item.material || '';

// Split dimensions string into 3 separate fields
if (item.dimensions) {
  const dimensionParts = item.dimensions.split(' x ');
  if (dimensionParts.length === 3) {
    document.getElementById('furnitureLength').value = parseFloat(dimensionParts[0]) || '';
    document.getElementById('furnitureWidth').value = parseFloat(dimensionParts[1]) || '';
    document.getElementById('furnitureHeight').value = parseFloat(dimensionParts[2]) || '';
  } else {
    // Fallback if format is different
    document.getElementById('furnitureLength').value = '';
    document.getElementById('furnitureWidth').value = '';
    document.getElementById('furnitureHeight').value = '';
  }
} else {
  document.getElementById('furnitureLength').value = '';
  document.getElementById('furnitureWidth').value = '';
  document.getElementById('furnitureHeight').value = '';
}

document.getElementById('furnitureDescription').value = item.description || '';
      currentFurnitureImage = item.image;
      if (item.image) {
        const preview = document.getElementById('furnitureImagePreview');
        const previewImg = document.getElementById('furnitureImagePreviewImg');
        if (preview && previewImg) {
          previewImg.src = item.image;
          preview.style.display = 'block';
        }
      }
      
      showModal('furnitureModal');
    }
  } catch (error) {
    console.error('Edit furniture error:', error);
    showToast('❌ Failed to load furniture details', 'error');
  }
}

// Delete Furniture
async function deleteFurniture(id) {
  if (!confirm('Are you sure you want to delete this furniture item?')) return;
  
  try {
    const result = await API.deleteFurniture(id);
    if (result.success) {
      showToast(result.message, 'success');
      loadFurnitureList();
    } else {
      showToast(result.message, 'error');
    }
  } catch (error) {
    console.error('Delete furniture error:', error);
    showToast('❌ Failed to delete furniture', 'error');
  }
}

// =============================================================================
// ADMIN MODULE - BUSINESS INFORMATION (UPDATED - USES DATABASE)
// =============================================================================

// Handle About Form Submit - SAVE TO DATABASE
async function handleAboutFormSubmit(event) {
  event.preventDefault();

  const heroDesc = document.getElementById('aboutHeroDesc').value;
  const story = document.getElementById('aboutStory').value;
  const mission = document.getElementById('aboutMission').value;

  try {
    const result = await API.saveBusinessInfo({
      hero_title: 'About ECL FURNITURE MART',
      hero_description: heroDesc,
      story: story,
      mission: mission,
      return_policy: '',
      warranty_policy: '',
      delivery_policy: '',
      payment_policy: ''
    });

    if (result.success) {
      showToast('✅ About page information saved to database!');
      console.log('About page saved:', result.message);
    } else {
      showToast('❌ Failed to save: ' + result.message, 'error');
    }
  } catch (error) {
    console.error('Save error:', error);
    showToast('❌ Failed to save business information', 'error');
  }
}

// Handle Contact Form Submit - SAVE TO DATABASE
async function handleContactFormSubmit(event) {
  event.preventDefault();

  const phone = document.getElementById('contactPhone').value;
  const email = document.getElementById('contactEmail').value;
  const weekday = document.getElementById('contactWeekday').value;
  const sunday = document.getElementById('contactSunday').value;
  const address = document.getElementById('contactAddress').value;

  try {
    const result = await API.saveContactInfo({
      phone: phone,
      email: email,
      business_hours: `Mon-Sat: ${weekday}\nSunday: ${sunday}`,
      address: address
    });

    if (result.success) {
      showToast('Contact information saved to database!', 'success');
      console.log('Contact info saved:', result.message);
    } else {
      showToast('❌ Failed to save: ' + result.message, 'error');
    }
  } catch (error) {
    console.error('Save error:', error);
    showToast('❌ Failed to save contact information', 'error');
  }
}

// Load business information into admin forms - FETCH FROM DATABASE
async function loadBusinessInfo() {
  try {
    // Load business info
    const businessResult = await API.getBusinessInfo();
    if (businessResult.success && businessResult.data) {
      const data = businessResult.data;
      const heroDescField = document.getElementById('aboutHeroDesc');
      const storyField = document.getElementById('aboutStory');
      const missionField = document.getElementById('aboutMission');
      const policiesField = document.getElementById('aboutPolicies');

      if (heroDescField) heroDescField.value = data.hero_description || '';
      if (storyField) storyField.value = data.story || '';
      if (missionField) missionField.value = data.mission || '';
      if (policiesField) policiesField.value = data.policies || '';
    }

    // Load contact info
    const contactResult = await API.getContactInfo();
    if (contactResult.success && contactResult.data) {
      const data = contactResult.data;
      const phoneField = document.getElementById('contactPhone');
      const emailField = document.getElementById('contactEmail');
      const weekdayField = document.getElementById('contactWeekday');
      const sundayField = document.getElementById('contactSunday');
      const addressField = document.getElementById('contactAddress');

      if (phoneField) phoneField.value = data.phone || '';
      if (emailField) emailField.value = data.email || '';
      if (addressField) addressField.value = data.address || '';
      
      // Parse business hours if it contains both weekday and sunday
      if (data.business_hours) {
        const hours = data.business_hours.split('\n');
        if (weekdayField && hours[0]) {
          weekdayField.value = hours[0].replace('Mon-Sat: ', '');
        }
        if (sundayField && hours[1]) {
          sundayField.value = hours[1].replace('Sunday: ', '');
        }
      }
    }
  } catch (error) {
    console.error('Load business info error:', error);
  }
}

// Load business info into about.html - FETCH FROM DATABASE
async function loadAboutPageContent() {
  try {
    const result = await API.getBusinessInfo();
    if (result.success && result.data) {
      const data = result.data;
      
      // Update hero description
      const heroDesc = document.getElementById('heroDescription');
      if (heroDesc && data.hero_description) {
        heroDesc.textContent = data.hero_description;
      }
      
      // Update story section
      const storyContent = document.getElementById('storyContent');
      if (storyContent && data.story) {
        storyContent.innerHTML = `<p style="color: #4b5563; line-height: 1.8;">${data.story}</p>`;
      }
      
      // Update mission section
      const missionText = document.getElementById('missionText');
      if (missionText && data.mission) {
        missionText.textContent = data.mission;
      }

      // Update policies if they exist
      const policiesGrid = document.getElementById('policiesGrid');
      if (policiesGrid && data.policies) {
        let policiesHTML = '';
        
        if (data.return_policy) {
          policiesHTML += `
            <div class="info-box">
              <h3>Return Policy</h3>
              <p>${data.return_policy}</p>
            </div>
          `;
        }
        
        if (data.warranty_policy) {
          policiesHTML += `
            <div class="info-box">
              <h3>Warranty Policy</h3>
              <p>${data.warranty_policy}</p>
            </div>
          `;
        }
        
        if (data.delivery_policy) {
          policiesHTML += `
            <div class="info-box">
              <h3>Delivery Policy</h3>
              <p>${data.delivery_policy}</p>
            </div>
          `;
        }
        
        if (data.payment_policy) {
          policiesHTML += `
            <div class="info-box">
              <h3>Payment Policy</h3>
              <p>${data.payment_policy}</p>
            </div>
          `;
        }
        
        if (policiesHTML) {
          policiesGrid.innerHTML = policiesHTML;
        }
      }
    }
  } catch (error) {
    console.error('Load about page error:', error);
  }
}

// Load contact info into contact.html - FETCH FROM DATABASE
async function loadContactPageContent() {
  try {
    const result = await API.getContactInfo();
    if (result.success && result.data) {
      const data = result.data;
      
      // Update phone
      const phoneElement = document.getElementById('customerServicePhone');
      if (phoneElement && data.phone) {
        phoneElement.textContent = data.phone;
      }
      
      // Update email
      const emailElement = document.getElementById('generalEmail');
      if (emailElement && data.email) {
        emailElement.textContent = data.email;
      }
      
      // Update business hours
      if (data.business_hours) {
        const hours = data.business_hours.split('\n');
        
        const weekdayElement = document.getElementById('weekdayHours');
        if (weekdayElement && hours[0]) {
          weekdayElement.textContent = hours[0].replace('Mon-Sat: ', '');
        }
        
        const sundayElement = document.getElementById('sundayHours');
        if (sundayElement && hours[1]) {
          sundayElement.textContent = hours[1].replace('Sunday: ', '');
        }
      }
      
      // Update location/address
      const locationsContainer = document.getElementById('locationsContainer');
      if (locationsContainer && data.address) {
        locationsContainer.innerHTML = `
          <div class="info-box" style="padding: 2rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
            <div style="display: flex; gap: 1rem; align-items: start;">
              <div style="background: #DC143C; color: white; padding: 0.75rem; border-radius: 0.5rem;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div style="flex: 1;">
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">Main Store</h3>
                <p style="color: #4b5563; line-height: 1.6;">${data.address}</p>
              </div>
            </div>
          </div>
        `;
      }
    }
  } catch (error) {
    console.error('Load contact page error:', error);
  }
}


// =============================================================================
// ADMIN MODULE - INVENTORY MANAGEMENT
// =============================================================================

let editingInventoryId = null;

// Load Inventory List
async function loadInventoryList() {
  try {
    const result = await API.getInventory();
    
    if (result.success) {
      const tbody = document.getElementById('adminInventoryList');
      if (!tbody) return;
      
      tbody.innerHTML = '';
      
      if (result.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #9ca3af;">No inventory items found</td></tr>';
        return;
      }
      
      result.data.forEach(item => {
        const status = item.quantity > 10 ? 'in-stock' : 'low-stock';
        const statusText = item.quantity > 10 ? 'In Stock' : 'Low Stock';
        
        const row = `
          <tr>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td><span class="stock-status ${status}">${statusText}</span></td>
            <td>${formatDateTime(item.last_updated)}</td>
            <td>
              <button class="action-btn edit" onclick="editInventory(${item.id})" title="Edit"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
              <button class="action-btn delete" onclick="deleteInventory(${item.id})" title="Delete"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    }
  } catch (error) {
    console.error('Load inventory error:', error);
    showToast('❌ Failed to load inventory');
  }
}

// Open Add Inventory Modal
function openAddInventoryModal() {
  editingInventoryId = null;
  document.getElementById('stockModalTitle').textContent = 'Add New Stock Item';
  document.getElementById('stockForm').reset();
  showModal('stockModal');
}

// Handle Inventory Form Submit
async function handleInventorySubmit(event) {
  event.preventDefault();
  
  const data = {
    name: document.getElementById('stockName').value,
    category: document.getElementById('stockCategory').value,
    quantity: parseInt(document.getElementById('stockQuantity').value)
  };

  try {
    let result;
    if (editingInventoryId) {
      result = await API.updateInventory(editingInventoryId, data);
    } else {
      result = await API.createInventory(data);
    }
    
    if (result.success) {
      showToast(result.message, 'success');
      hideModal('stockModal');
      loadInventoryList();
      if (window.location.pathname.includes('staff.html')) {
        loadStaffInventoryList();
      }
    } else {
      showToast('❌ ' + result.message, 'error');
    }
  } catch (error) {
    console.error('Save inventory error:', error);
    showToast('❌ Failed to save inventory', 'error');
  }
}

// Edit Inventory
async function editInventory(id) {
  try {
    const result = await API.getInventory();
    if (result.success) {
      const item = result.data.find(inv => inv.id === id);
      if (!item) {
        showToast('Inventory item not found', 'error');
        return;
      }
      
      editingInventoryId = id;
      document.getElementById('stockModalTitle').textContent = 'Edit Stock Item';
      document.getElementById('stockName').value = item.name;
      document.getElementById('stockCategory').value = item.category;
      document.getElementById('stockQuantity').value = item.quantity;
      
      showModal('stockModal');
    }
  } catch (error) {
    console.error('Edit inventory error:', error);
    showToast('❌ Failed to load inventory details', 'error');
  }
}

// Delete Inventory
async function deleteInventory(id) {
  if (!confirm('Are you sure you want to delete this inventory item?')) return;
  
  try {
    const result = await API.deleteInventory(id);
    if (result.success) {
      showToast('✅ ' + result.message, 'success');
      loadInventoryList();
      if (window.location.pathname.includes('staff.html')) {
        loadStaffInventoryList();
      }
    } else {
      showToast('❌ ' + result.message, 'error');
    }
  } catch (error) {
    console.error('Delete inventory error:', error);
    showToast('❌ Failed to delete inventory', 'error');
  }
}

// =============================================================================
// ADMIN & STAFF MODULE - DELIVERY MANAGEMENT (FIXED)
// =============================================================================

let editingDeliveryId = null;

// Load Delivery Statistics (for metric panel)
async function loadDeliveryStats() {
  try {
    const response = await fetch(`${API_URL}/deliveries/stats`);
    const result = await response.json();
    
    if (result.success) {
      const stats = result.data;
      
      // Update Admin Metrics
      const pendingEl = document.getElementById('deliveryPendingCount');
      const processingEl = document.getElementById('deliveryProcessingCount');
      const inTransitEl = document.getElementById('deliveryInTransitCount');
      const deliveredEl = document.getElementById('deliveryDeliveredCount');
      
      if (pendingEl) pendingEl.textContent = stats.pending || 0;
      if (processingEl) processingEl.textContent = stats.processing || 0;
      if (inTransitEl) inTransitEl.textContent = stats.in_transit || 0;
      if (deliveredEl) deliveredEl.textContent = stats.delivered || 0;
      
      // Update Staff Metrics
      const staffPendingEl = document.getElementById('staffDeliveryPendingCount');
      const staffProcessingEl = document.getElementById('staffDeliveryProcessingCount');
      const staffInTransitEl = document.getElementById('staffDeliveryInTransitCount');
      const staffDeliveredEl = document.getElementById('staffDeliveryDeliveredCount');
      
      if (staffPendingEl) staffPendingEl.textContent = stats.pending || 0;
      if (staffProcessingEl) staffProcessingEl.textContent = stats.processing || 0;
      if (staffInTransitEl) staffInTransitEl.textContent = stats.in_transit || 0;
      if (staffDeliveredEl) staffDeliveredEl.textContent = stats.delivered || 0;
    }
  } catch (error) {
    console.error('Load delivery stats error:', error);
  }
}

// Load Delivery List (Admin)
async function loadDeliveryList() {
  try {
    const result = await API.getDeliveries();
    
    if (result.success) {
      const tbody = document.getElementById('adminDeliveryList');
      if (!tbody) return;
      
      tbody.innerHTML = '';
      
      if (result.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: #9ca3af;">No deliveries found</td></tr>';
        return;
      }
      
      result.data.forEach(item => {
        const statusBadge = getStatusBadge(item.status);
        const typeBadge = getTypeBadge(item.delivery_type);
        
        const row = `
          <tr>
            <td><strong>${item.ref_code}</strong></td>
            <td>${item.customer_name}</td>
            <td>${item.contact_number || 'N/A'}</td>
            <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.address}</td>
            <td>${item.product || 'N/A'}</td>
            <td>${statusBadge}</td>
            <td>${typeBadge}</td>
            <td>${formatDate(item.delivery_date)}</td>
            <td>
              <button class="action-btn edit" onclick="editDelivery(${item.id})" title="Edit"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
              <button class="action-btn delete" onclick="deleteDelivery(${item.id})" title="Delete"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
      
      // Load stats
      loadDeliveryStats();
    }
  } catch (error) {
    console.error('Load deliveries error:', error);
    showToast('❌ Failed to load deliveries', 'error');
  }
}

// Load Delivery List (Staff - Read Only)
async function loadStaffDeliveryList() {
  try {
    const result = await API.getDeliveries();
    
    if (result.success) {
      const deliveries = result.data;
      const tbody = document.getElementById('staffDeliveryList');
      
      if (!tbody) return;
      
      tbody.innerHTML = '';
      
      if (deliveries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #9ca3af;">No deliveries found</td></tr>';
        updateStaffDeliveryMetrics(deliveries);
        return;
      }
      
      deliveries.forEach(delivery => {
        const row = document.createElement('tr');
        
        // Status badge color
        let statusColor = '#DC143C';
        if (delivery.status === 'Delivered') statusColor = '#10b981';
        else if (delivery.status === 'In Transit') statusColor = '#8b5cf6';
        else if (delivery.status === 'Processing') statusColor = '#3b82f6';
        else if (delivery.status === 'Pending') statusColor = '#f59e0b';
        
        row.innerHTML = `
          <td><strong>${delivery.ref_code}</strong></td>
          <td>${delivery.customer_name}</td>
          <td>${delivery.contact_number || 'N/A'}</td>
          <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${delivery.address}</td>
          <td>${delivery.product || 'N/A'}</td>
          <td>
            <span style="padding: 0.25rem 0.75rem; background: ${statusColor}; color: white; border-radius: 9999px; display: inline-block; font-size: 0.875rem;">
              ${delivery.status || 'Pending'}
            </span>
          </td>
          <td>
            <select 
              class="status-select" 
              data-delivery-id="${delivery.id}"
              style="padding: 0.375rem 0.75rem; border: 2px solid #e5e7eb; border-radius: 0.375rem; font-size: 0.875rem; cursor: pointer;"
            >
              <option value="Pending" ${delivery.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Processing" ${delivery.status === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="In Transit" ${delivery.status === 'In Transit' ? 'selected' : ''}>In Transit</option>
              <option value="Delivered" ${delivery.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            </select>
            <button 
              class="action-btn edit" 
              onclick="updateDeliveryStatus(${delivery.id})"
              style="margin-left: 0.5rem;"
              title="Update Status"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          </td>
        `;
        
        tbody.appendChild(row);
      });
      
      // Update metrics
      updateStaffDeliveryMetrics(deliveries);
    }
  } catch (error) {
    console.error('Load deliveries error:', error);
    showToast('Failed to load deliveries', 'error');
    const tbody = document.getElementById('staffDeliveryList');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #ef4444;">❌ Failed to load deliveries</td></tr>';
    }
  }
}
// Get Status Badge HTML
function getStatusBadge(status) {
  const statusMap = {
    'pending': { color: '#f59e0b', bg: '#fef3c7', text: 'Pending' },
    'processing': { color: '#3b82f6', bg: '#dbeafe', text: 'Processing' },
    'in_transit': { color: '#8b5cf6', bg: '#ede9fe', text: 'In Transit' },
    'delivered': { color: '#10b981', bg: '#d1fae5', text: 'Delivered' }
  };
  
  const statusInfo = statusMap[status] || { color: '#6b7280', bg: '#f3f4f6', text: status };
  
  return `<span style="padding: 0.25rem 0.75rem; background: ${statusInfo.bg}; color: ${statusInfo.color}; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">${statusInfo.text}</span>`;
}

// Get Type Badge HTML
function getTypeBadge(type) {
  const typeMap = {
    'Outbound': { color: '#0ea5e9', bg: '#e0f2fe', icon: '📦' },
    'Inbound': { color: '#ec4899', bg: '#fce7f3', icon: '📥' }
  };
  
  const typeInfo = typeMap[type] || { color: '#6b7280', bg: '#f3f4f6', icon: '📦' };
  
  return `<span style="padding: 0.25rem 0.75rem; background: ${typeInfo.bg}; color: ${typeInfo.color}; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">${typeInfo.icon} ${type}</span>`;
}

// Open Add Delivery Modal
function openAddDeliveryModal() {
  editingDeliveryId = null;
  document.getElementById('deliveryModalTitle').textContent = 'Add New Delivery';
  document.getElementById('deliveryForm').reset();
  showModal('deliveryModal');
}

// Handle Delivery Form Submit
async function handleDeliverySubmit(event) {
  event.preventDefault();
  
  const data = {
    customer_name: document.getElementById('deliveryCustomer').value,
    contact_number: document.getElementById('deliveryContactNumber').value,
    address: document.getElementById('deliveryAddress').value,
    product: document.getElementById('deliveryProduct').value,
    status: document.getElementById('deliveryStatus').value,
    delivery_type: document.getElementById('deliveryType').value,
    delivery_date: document.getElementById('deliveryDate').value || null
  };

  try {
    let result;
    if (editingDeliveryId) {
      result = await API.updateDelivery(editingDeliveryId, data);
    } else {
      result = await API.createDelivery(data);
    }
    
    if (result.success) {
      showToast('✅ ' + result.message + (result.ref_code ? `\nReference Code: ${result.ref_code}` : ''));
      hideModal('deliveryModal');
      loadDeliveryList();
      loadDeliveryStats();
    } else {
      alert('❌ ' + result.message);
    }
  } catch (error) {
    console.error('Save delivery error:', error);
    showToast('❌ Failed to save delivery', 'error');
  }
}

// Edit Delivery
async function editDelivery(id) {
  try {
    const result = await API.getDeliveries();
    if (result.success) {
      const item = result.data.find(del => del.id === id);
      if (!item) {
        showToast('Delivery not found', 'error');
        return;
      }
      
      editingDeliveryId = id;
      document.getElementById('deliveryModalTitle').textContent = 'Update Delivery';
      document.getElementById('deliveryCustomer').value = item.customer_name;
      document.getElementById('deliveryContactNumber').value = item.contact_number || '';
      document.getElementById('deliveryAddress').value = item.address;
      document.getElementById('deliveryProduct').value = item.product || '';
      document.getElementById('deliveryStatus').value = item.status;
      document.getElementById('deliveryType').value = item.delivery_type || 'Outbound';
      document.getElementById('deliveryDate').value = item.delivery_date ? item.delivery_date.split('T')[0] : '';
      
      showModal('deliveryModal');
    }
  } catch (error) {
    console.error('Edit delivery error:', error);
    showToast('❌ Failed to load delivery details', 'error');
  }
}

// Delete Delivery
async function deleteDelivery(id) {
  if (!confirm('Are you sure you want to delete this delivery?')) return;
  
  try {
    const result = await API.deleteDelivery(id);
    if (result.success) {
      showToast(result.message, 'success');
      loadDeliveryList();
      loadDeliveryStats();
    } else {
      showToast('❌ ' + result.message, 'error');
    }
  } catch (error) {
    console.error('Delete delivery error:', error);
    showToast('❌ Failed to delete delivery', 'error');
  }
}

// NEW FUNCTION - Update Delivery Status (Staff Only)
async function updateDeliveryStatus(deliveryId) {
  const selectElement = document.querySelector(`.status-select[data-delivery-id="${deliveryId}"]`);
  
  if (!selectElement) {
    showToast('Error: Could not find status selector', 'error');
    return;
  }
  
  const newStatus = selectElement.value;
  
  try {
    const result = await API.updateDeliveryStatus(deliveryId, newStatus);
    
    if (result.success) {
      showToast('✓ Delivery status updated successfully', 'success');
      loadStaffDeliveryList(); // Reload to show updated data
    } else {
      showToast('❌ ' + result.message, 'error');
    }
  } catch (error) {
    console.error('Update status error:', error);
    showToast('❌ Failed to update status', 'error');
  }
}

// Helper function to update delivery metrics
function updateStaffDeliveryMetrics(deliveries) {
  const pending = deliveries.filter(d => d.status === 'Pending').length;
  const processing = deliveries.filter(d => d.status === 'Processing').length;
  const inTransit = deliveries.filter(d => d.status === 'In Transit').length;
  const delivered = deliveries.filter(d => d.status === 'Delivered').length;
  
  const pendingEl = document.getElementById('staffDeliveryPendingCount');
  const processingEl = document.getElementById('staffDeliveryProcessingCount');
  const inTransitEl = document.getElementById('staffDeliveryInTransitCount');
  const deliveredEl = document.getElementById('staffDeliveryDeliveredCount');
  
  if (pendingEl) pendingEl.textContent = pending;
  if (processingEl) processingEl.textContent = processing;
  if (inTransitEl) inTransitEl.textContent = inTransit;
  if (deliveredEl) deliveredEl.textContent = delivered;
}


// =============================================================================
// ADMIN & STAFF MODULE - SALES RECORDS (FIXED)
// =============================================================================

// Load Sales List (Admin)
// Load Sales List (Admin)
async function loadSalesList() {
  try {
    const result = await API.getSales();
    
    if (result.success) {
      const tbody = document.getElementById('adminSalesList');
      if (!tbody) return;
      
      tbody.innerHTML = '';
      
      if (result.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #9ca3af;">No sales records found</td></tr>';
        
        // Reset analytics
        const totalSalesEl = document.getElementById('totalSales');
        const totalRecordsEl = document.getElementById('totalRecords');
        const averageSaleEl = document.getElementById('averageSale');
        if (totalSalesEl) totalSalesEl.textContent = '₱0.00';
        if (totalRecordsEl) totalRecordsEl.textContent = '0';
        if (averageSaleEl) averageSaleEl.textContent = '₱0.00';
        return;
      }
      
      result.data.forEach(item => {
        const row = `
          <tr>
            <td>${formatDate(item.sale_date)}</td>
            <td>${item.customer_name}</td>
            <td>${item.product_name}</td>
            <td>${formatCurrency(item.amount)}</td>
            <td>
              <button class="action-btn delete" onclick="deleteSales(${item.id})" title="Delete"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
      
      // Load Analytics
      loadSalesAnalytics();
    }
  } catch (error) {
    console.error('Load sales error:', error);
    showToast('❌ Failed to load sales records');
  }
}
// =============================================================================
// SALES ANALYTICS - CHARTS AND OVERVIEW
// =============================================================================

// Load Sales Analytics (Overview + Charts)
async function loadSalesAnalytics() {
  try {
    const result = await API.getSales();
    
    if (result.success && result.data.length > 0) {
      const salesData = result.data;
      
      // Calculate Overview Statistics
      const totalRecords = salesData.length;
      const totalSales = salesData.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
      const averageSale = totalSales / totalRecords;
      
      // Update Overview Cards
      const totalSalesEl = document.getElementById('totalSales');
      const totalRecordsEl = document.getElementById('totalRecords');
      const averageSaleEl = document.getElementById('averageSale');
      
      if (totalSalesEl) totalSalesEl.textContent = formatCurrency(totalSales);
      if (totalRecordsEl) totalRecordsEl.textContent = totalRecords.toString();
      if (averageSaleEl) averageSaleEl.textContent = formatCurrency(averageSale);
      
      // Load Monthly Sales Data for Charts
      await loadMonthlySalesCharts();
    } else {
      // No sales data
      const totalSalesEl = document.getElementById('totalSales');
      const totalRecordsEl = document.getElementById('totalRecords');
      const averageSaleEl = document.getElementById('averageSale');
      
      if (totalSalesEl) totalSalesEl.textContent = '₱0.00';
      if (totalRecordsEl) totalRecordsEl.textContent = '0';
      if (averageSaleEl) averageSaleEl.textContent = '₱0.00';
    }
  } catch (error) {
    console.error('Load sales analytics error:', error);
  }
}

// Load Monthly Sales Charts
async function loadMonthlySalesCharts() {
  try {
    const response = await fetch(`${API_URL}/sales/monthly`);
    const monthlyData = await response.json();
    
    if (monthlyData && monthlyData.length > 0) {
      // Prepare data for charts
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const labels = monthlyData.map(item => `${monthNames[item.month - 1]} ${item.year}`);
      const amounts = monthlyData.map(item => parseFloat(item.total));
      
      // Render Bar Chart
      renderRevenueBarChart(labels, amounts);
      
      // Render Line Chart
      renderSalesLineChart(labels, amounts);
    }
  } catch (error) {
    console.error('Load monthly sales error:', error);
  }
}

// Render Revenue Bar Chart
function renderRevenueBarChart(labels, data) {
  const ctx = document.getElementById('revenueBarChart');
  if (!ctx) return;
  
  // Destroy existing chart if it exists
  if (window.revenueBarChartInstance) {
    window.revenueBarChartInstance.destroy();
  }
  
  window.revenueBarChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Monthly Revenue (₱)',
        data: data,
        backgroundColor: 'rgba(220, 20, 60, 0.7)',
        borderColor: '#DC143C',
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'Revenue: ₱' + context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '₱' + value.toLocaleString('en-US');
            }
          }
        }
      }
    }
  });
}

// Render Sales Line Chart
function renderSalesLineChart(labels, data) {
  const ctx = document.getElementById('salesLineChart');
  if (!ctx) return;
  
  // Destroy existing chart if it exists
  if (window.salesLineChartInstance) {
    window.salesLineChartInstance.destroy();
  }
  
  window.salesLineChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Sales Trend (₱)',
        data: data,
        backgroundColor: 'rgba(220, 20, 60, 0.1)',
        borderColor: '#DC143C',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#DC143C',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'Sales: ₱' + context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '₱' + value.toLocaleString('en-US');
            }
          }
        }
      }
    }
  });
}


// Load Sales List (Staff)
async function loadStaffSalesList() {
  try {
    const result = await API.getSales();
    
    if (result.success) {
      const tbody = document.getElementById('staffSalesList');
      if (!tbody) return;
      
      tbody.innerHTML = '';
      
      if (result.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #9ca3af;">No sales records found</td></tr>';
        return;
      }
      
       result.data.forEach(item => {
        const row = `
          <tr>
            <td>${formatDate(item.sale_date)}</td>
            <td>${item.customer_name}</td>
            <td>${item.product_name}</td>
            <td>${formatCurrency(item.amount)}</td>
            <td>
              <button class="action-btn edit" onclick="editStaffSalesRecord(${item.id})" title="Edit">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Edit
              </button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    }
  } catch (error) {
    console.error('Load sales error:', error);
    showToast('❌ Failed to load sales records');
  }
}

// Edit Staff Sales Record
async function editStaffSalesRecord(id) {
  try {
    const result = await API.getSales();
    
    if (result.success) {
      const record = result.data.find(item => item.id === id);
      
      if (record) {
        // Populate form fields
        document.getElementById('editSalesId').value = record.id;
        document.getElementById('editSalesCustomer').value = record.customer_name;
        document.getElementById('editSalesProduct').value = record.product_name;
        document.getElementById('editSalesAmount').value = record.amount;
        document.getElementById('editSalesDate').value = record.sale_date.split('T')[0];
        
        // Show modal
        showModal('editSalesModal');
      }
    }
  } catch (error) {
    console.error('Edit sales error:', error);
    showToast('❌ Failed to load sales record', 'error');
  }
}

// Handle Edit Sales Form Submit (Staff)
document.addEventListener('DOMContentLoaded', function() {
  const editForm = document.getElementById('editStaffSalesForm');
  
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const id = document.getElementById('editSalesId').value;
      const customer_name = document.getElementById('editSalesCustomer').value;
      const product_name = document.getElementById('editSalesProduct').value;
      const amount = document.getElementById('editSalesAmount').value;
      const sale_date = document.getElementById('editSalesDate').value;
      
      try {
        const result = await API.updateSales(id, {
          customer_name,
          product_name,
          amount,
          sale_date
        });
        
        if (result.success) {
          showToast('✅ Sales record updated successfully', 'success');
          hideModal('editSalesModal');
          
          // Reload sales list and analytics
          loadStaffSalesList();
          loadStaffSalesAnalytics();
        } else {
          showToast('❌ ' + result.message, 'error');
        }
      } catch (error) {
        console.error('Update sales error:', error);
        showToast('❌ Failed to update sales record', 'error');
      }
    });
  }
});

// Load Staff Sales Analytics (Overview + Charts)
async function loadStaffSalesAnalytics() {
  try {
    const result = await API.getSales();

    if (result.success && result.data.length > 0) {
      const salesData = result.data;

      // Calculate Overview Statistics
      const totalRecords = salesData.length;
      const totalSales = salesData.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
      const averageSale = totalSales / totalRecords;

      // Update Overview Cards
      const totalSalesEl = document.getElementById('staffTotalSales');
      const totalRecordsEl = document.getElementById('staffTotalRecords');
      const averageSaleEl = document.getElementById('staffAverageSale');

      if (totalSalesEl) totalSalesEl.textContent = formatCurrency(totalSales);
      if (totalRecordsEl) totalRecordsEl.textContent = totalRecords.toString();
      if (averageSaleEl) averageSaleEl.textContent = formatCurrency(averageSale);

      // Load Monthly Sales Data for Charts
      await loadStaffMonthlySalesCharts();
    } else {
      // No sales data
      const totalSalesEl = document.getElementById('staffTotalSales');
      const totalRecordsEl = document.getElementById('staffTotalRecords');
      const averageSaleEl = document.getElementById('staffAverageSale');

      if (totalSalesEl) totalSalesEl.textContent = '₱0.00';
      if (totalRecordsEl) totalRecordsEl.textContent = '0';
      if (averageSaleEl) averageSaleEl.textContent = '₱0.00';
    }
  } catch (error) {
    console.error('Load staff sales analytics error:', error);
  }
}

// Load Staff Monthly Sales Charts
async function loadStaffMonthlySalesCharts() {
  try {
    const response = await fetch(`${API_URL}/sales/monthly`);
    const monthlyData = await response.json();

    if (monthlyData && monthlyData.length > 0) {
      // Prepare data for charts
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const labels = monthlyData.map(item => `${monthNames[item.month - 1]} ${item.year}`);
      const amounts = monthlyData.map(item => parseFloat(item.total));

      // Render Bar Chart
      renderStaffRevenueBarChart(labels, amounts);

      // Render Line Chart
      renderStaffSalesLineChart(labels, amounts);
    }
  } catch (error) {
    console.error('Load staff monthly sales error:', error);
  }
}

// Render Staff Revenue Bar Chart
function renderStaffRevenueBarChart(labels, data) {
  const ctx = document.getElementById('staffRevenueBarChart');
  if (!ctx) return;

  // Destroy existing chart if it exists
  if (window.staffRevenueBarChartInstance) {
    window.staffRevenueBarChartInstance.destroy();
  }

  window.staffRevenueBarChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Monthly Revenue (₱)',
        data: data,
        backgroundColor: 'rgba(220, 20, 60, 0.7)',
        borderColor: '#DC143C',
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'Revenue: ₱' + context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '₱' + value.toLocaleString('en-US');
            }
          }
        }
      }
    }
  });
}

// Render Staff Sales Line Chart
function renderStaffSalesLineChart(labels, data) {
  const ctx = document.getElementById('staffSalesLineChart');
  if (!ctx) return;

  // Destroy existing chart if it exists
  if (window.staffSalesLineChartInstance) {
    window.staffSalesLineChartInstance.destroy();
  }

  window.staffSalesLineChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Sales Trend (₱)',
        data: data,
        backgroundColor: 'rgba(220, 20, 60, 0.1)',
        borderColor: '#DC143C',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#DC143C',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'Sales: ₱' + context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '₱' + value.toLocaleString('en-US');
            }
          }
        }
      }
    }
  });
}

// Open Add Sales Modal
function openAddSalesModal() {
  document.getElementById('salesForm').reset();
  showModal('salesModal');
}

// Handle Sales Form Submit (Admin) (FIXED - now checks both field IDs)
async function handleSalesSubmit(event) {
  event.preventDefault();
  
  // FIXED: Try both possible field IDs (admin.html has salesDateInput)
  const dateField = document.getElementById('salesDateInput') || document.getElementById('salesDate');
  
  const data = {
    customer_name: document.getElementById('salesCustomerName').value,
    product_name: document.getElementById('salesProductName').value,
    amount: parseFloat(document.getElementById('salesAmount').value),
    sale_date: dateField ? dateField.value : new Date().toISOString().split('T')[0]
  };

  try {
    const result = await API.createSales(data);
    
    if (result.success) {
      showToast(result.message, 'success');
      hideModal('salesModal');
      loadSalesList();
      if (window.location.pathname.includes('staff.html')) {
        loadStaffSalesList();
      }
    } else {
      showToast('❌ ' + result.message, 'error');
    }
  } catch (error) {
    console.error('Save sales error:', error);
    showToast('❌ Failed to save sales record', 'error');
  }
}


// Handle Staff Sales Form Submit - FIXED ELEMENT IDS for staff.html
async function handleStaffSalesSubmit(event) {
  event.preventDefault();

  const data = {
    customer_name: document.getElementById('salesCustomer').value,
    product_name: document.getElementById('salesProduct').value,
    amount: parseFloat(document.getElementById('salesAmount').value), // FIXED: was staffSalesAmount
    sale_date: document.getElementById('salesDate').value || new Date().toISOString().split('T')[0] // FIXED: was staffSalesDate
  };

  try {
    const result = await API.createSales(data);

    if (result.success) {
  showToast(result.message, 'success');
  document.getElementById('staffSalesForm').reset();
  
  // Reload the sales list for staff
  loadStaffSalesList();
  
  // Reload analytics to update totals and charts
  loadStaffSalesAnalytics();
  
  // Log success for debugging
  console.log('Sales record added:', data);
} else {
  showToast('❌ ' + result.message, 'error');
}
  } catch (error) {
    console.error('Save sales error:', error);
    showToast('❌ Failed to save sales record', 'error');
  }
}
// Delete Sales
async function deleteSales(id) {
  if (!confirm('Are you sure you want to delete this sales record?')) return;
  
  try {
    const result = await API.deleteSales(id);
    if (result.success) {
      showToast('✅ ' + result.message, 'success');
      loadSalesList();
    } else {
      showToast('❌ ' + result.message, 'error');
    }
  } catch (error) {
    console.error('Delete sales error:', error);
    showToast('❌ Failed to delete sales record', 'error');
  }
}

// =============================================================================
// ADMIN & STAFF MODULE - REVIEWS MANAGEMENT (FIXED)
// =============================================================================

// Load Reviews List
async function loadReviewsList() {
  try {
    const result = await API.getReviews();
    
    if (result.success) {
      const tbody = document.getElementById('reviewsList');
      if (!tbody) return;
      
      tbody.innerHTML = '';
      
      if (result.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #9ca3af;">No reviews found</td></tr>';
        return;
      }
      
      result.data.forEach(item => {
        const row = `
          <tr>
            <td>${item.product_name}</td>
            <td>${item.review_text.substring(0, 80)}${item.review_text.length > 80 ? '...' : ''}</td>
            <td>${formatDate(item.review_date)}</td>
            <td>
              <button class="action-btn delete" onclick="deleteReview(${item.id})" title="Delete"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    }
  } catch (error) {
    console.error('Load reviews error:', error);
    showToast('❌ Failed to load reviews');
  }
}


// Load Staff Reviews List
// Load Staff Reviews List
async function loadStaffReviewsList() {
  try {
    const result = await API.getReviews();
    
    if (result.success) {
      const tbody = document.getElementById('staffReviewsList');
      if (!tbody) return;
      
      tbody.innerHTML = '';
      
      if (result.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #9ca3af;">No reviews found</td></tr>';
        return;
      }
      
      result.data.forEach(item => {
        const row = `
          <tr>
            <td>${item.product_name}</td>
            <td>${item.review_text.substring(0, 100)}${item.review_text.length > 100 ? '...' : ''}</td>
            <td>${formatDate(item.review_date)}</td>
            <td>
              <button class="action-btn edit" onclick="editStaffReview(${item.id})" title="Edit">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button class="action-btn delete" onclick="deleteStaffReview(${item.id})" title="Delete">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    }
  } catch (error) {
    console.error('Load reviews error:', error);
    showToast('❌ Failed to load reviews', 'error');
  }
}


// Open Add Review Modal
function openAddReviewModal() {
  document.getElementById('reviewForm').reset();
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('reviewDate').value = today;
  showModal('reviewModal');
}

// Handle Review Form Submit (Admin)
async function handleReviewSubmit(event) {
  event.preventDefault();
  
  const data = {
    product_name: document.getElementById('reviewProductName').value,
    reviewer_name: 'Admin', // Default value - no longer collected from form
    rating: 5, // Default value for backend compatibility
    review_text: document.getElementById('reviewTextInput').value,
    review_date: document.getElementById('reviewDate').value
  };

  try {
    const result = await API.createReview(data);
    
    if (result.success) {
      showToast(result.message, 'success');
      hideModal('reviewModal');
      loadReviewsList();
      if (window.location.pathname.includes('staff.html')) {
        loadStaffReviewsList();
      }
    } else {
      showToast(result.message, 'error');
    }
  } catch (error) {
    console.error('Save review error:', error);
    showToast('❌ Failed to save review', 'error');
  }
}

// Handle Staff Review Form Submit (NEW - for staff.html inline form)
// Handle Staff Review Form Submit (NEW - for staff.html inline form)
async function handleStaffReviewSubmit(event) {
  event.preventDefault();

  const data = {
    product_name: document.getElementById('reviewProduct').value,
    reviewer_name: 'Staff',
    rating: 5, // Default value for backend compatibility
    review_text: document.getElementById('reviewText').value,
    review_date: document.getElementById('staffReviewDate').value || new Date().toISOString().split('T')[0]
  };

  try {
    const result = await API.createReview(data);

    if (result.success) {
      showToast('✅ ' + result.message);
      document.getElementById('staffReviewForm').reset();
      loadStaffReviewsList();
    } else {
      showToast('❌ ' + result.message, 'error');
    }
  } catch (error) {
    console.error('Save review error:', error);
    showToast('❌ Failed to save review', 'error');
  }
}
// Delete Review
async function deleteReview(id) {
  if (!confirm('Are you sure you want to delete this review?')) return;
  
  try {
    const result = await API.deleteReview(id);
    if (result.success) {
      showToast(result.message, 'success');
      loadReviewsList();
    } else {
      showToast('❌ ' + result.message, 'error');
    }
  } catch (error) {
    console.error('Delete review error:', error);
    showToast('❌ Failed to delete review', 'error');
  }
}

// Delete Staff Review
async function deleteStaffReview(id) {
  if (!confirm('Are you sure you want to delete this review?')) return;
  
  try {
    const result = await API.deleteReview(id);
    if (result.success) {
      showToast('✅ ' + result.message, 'success');
      loadStaffReviewsList();
    } else {
      showToast('❌ ' + result.message, 'error');
    }
  } catch (error) {
    console.error('Delete review error:', error);
    showToast('❌ Failed to delete review', 'error');
  }
}

// Edit Staff Review
async function editStaffReview(id) {
  try {
    const result = await API.getReviews();
    
    if (result.success) {
      const review = result.data.find(item => item.id === id);
      
      if (review) {
        // Populate form fields
        document.getElementById('reviewProduct').value = review.product_name;
        document.getElementById('reviewText').value = review.review_text;
        document.getElementById('staffReviewDate').value = review.review_date.split('T')[0];
        
        // Store the ID in a data attribute for form submission
        const form = document.getElementById('staffReviewForm');
        form.dataset.editingId = id;
        
        // Change button text temporarily to indicate editing
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> Update Review';
        submitBtn.dataset.originalText = originalText;
      }
    }
  } catch (error) {
    console.error('Edit review error:', error);
    showToast('❌ Failed to load review', 'error');
  }
}

// =============================================================================
// ADMIN MODULE - STAFF ACCOUNT MANAGEMENT
// =============================================================================

// Load Staff Accounts List
async function loadStaffAccountsList() {
  try {
    const result = await API.getStaff();
    
    if (result.success) {
      const tbody = document.getElementById('staffAccountsList');
      if (!tbody) return;
      
      tbody.innerHTML = '';
      
      if (result.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #9ca3af;">No staff accounts found</td></tr>';
        return;
      }
      
      result.data.forEach(item => {
        const row = `
          <tr>
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td><span class="stock-status in-stock">Staff</span></td>
            <td>${formatDate(item.created_at)}</td>
            <td>
              <button class="action-btn delete" onclick="deleteStaffAccount(${item.id})" title="Delete"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    }
  } catch (error) {
    console.error('Load staff accounts error:', error);
    showToast('❌ Failed to load staff accounts');
  }
}

// Open Add Staff Account Modal
function openAddStaffModal() {
  const modalHTML = `
    <div id="staffAccountModal" class="modal active">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Create Staff Account</h3>
          <button class="modal-close" onclick="hideModal('staffAccountModal'); document.getElementById('staffAccountModal').remove();">×</button>
        </div>
        <div class="modal-body">
          <form id="staffAccountForm">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" id="staffAccountName" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" id="staffAccountEmail" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" id="staffAccountPassword" class="form-input" required>
            </div>
            <div style="display: flex; gap: 0.75rem;">
              <button type="submit" class="btn btn-accent" style="flex: 1;">Create Account</button>
              <button type="button" class="btn btn-secondary" onclick="hideModal('staffAccountModal'); document.getElementById('staffAccountModal').remove();" style="flex: 1;">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  document.getElementById('staffAccountForm').addEventListener('submit', handleStaffAccountSubmit);
  
}

// Handle Staff Account Form Submit
async function handleStaffAccountSubmit(event) {
  event.preventDefault();
  
  const data = {
    name: document.getElementById('staffAccountName').value,
    email: document.getElementById('staffAccountEmail').value,
    password: document.getElementById('staffAccountPassword').value,
    role: 'staff'
  };

  try {
    const result = await API.createStaff(data);
    
    if (result.success) {
     showToast(result.message, 'success');
      hideModal('staffAccountModal');
      document.getElementById('staffAccountModal').remove();
      loadStaffAccountsList();
    } else {
      showToast('❌ ' + result.message, 'error');
    }
  } catch (error) {
    console.error('Create staff account error:', error);
    showToast('❌ Failed to create staff account', 'error');
  }
}

// Delete Staff Account
async function deleteStaffAccount(id) {
  if (!confirm('Are you sure you want to delete this staff account?')) return;
  
  try {
    const result = await API.deleteStaff(id);
    if (result.success) {
      showToast(result.message, 'success');
      loadStaffAccountsList();
    } else {
      showToast('❌ ' + result.message, 'error');
    }
  } catch (error) {
    console.error('Delete staff account error:', error);
    showToast('❌ Failed to delete staff account', 'error');
  }
}

// =============================================================================
// STAFF MODULE - INVENTORY (FIXED)
// =============================================================================

// =============================================================================
// STAFF MODULE - INVENTORY (VIEW-ONLY)
// =============================================================================

async function loadStaffInventoryList() {
  try {
    const result = await API.getInventory();
    
    if (result.success) {
      const container = document.getElementById('inventoryList');
      if (!container) return;
      
      container.innerHTML = '';
      
      if (result.data.length === 0) {
        container.innerHTML = `
          <p style="text-align: center; color: #9ca3af; padding: 2rem;">
            No inventory items found
          </p>
        `;
        return;
      }
      
      // Create table for view-only display
      let tableHTML = `
        <div class="table-container">
          <table>
            <thead>
  <tr>
    <th>Item Name</th>
    <th>Category</th>
    <th>Quantity</th>
    <th>Stock Status</th>
    <th>Last Updated</th>
    <th>Actions</th>
  </tr>
</thead>
            <tbody>
      `;
      
      result.data.forEach(item => {
        const status = item.quantity > 10 ? 'in-stock' : 'low-stock';
        const statusText = item.quantity > 10 ? 'In Stock' : 'Low Stock';
        
        tableHTML += `
  <tr>
    <td>${item.name}</td>
    <td>${item.category}</td>
    <td><strong>${item.quantity}</strong></td>
    <td><span class="stock-status ${status}">${statusText}</span></td>
    <td>${formatDateTime(item.last_updated)}</td>
    <td>
      <button class="action-btn edit" onclick="openEditInventoryModal(${item.id}, '${item.name.replace(/'/g, "\\'")}', '${item.category}', ${item.quantity})">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        Edit
      </button>
    </td>
  </tr>
`;
      });
      
      tableHTML += `
            </tbody>
          </table>
        </div>
      `;
      
      container.innerHTML = tableHTML;
    }
  } catch (error) {
    console.error('Load inventory error:', error);
    const container = document.getElementById('inventoryList');
    if (container) {
      container.innerHTML = '<p style="text-align: center; color: #ef4444; padding: 2rem;">❌ Failed to load inventory</p>';
    }
  }
}

// =============================================================================
// STAFF MODULE - INVENTORY EDIT FUNCTIONALITY
// =============================================================================

function openEditInventoryModal(id, name, category, quantity) {
  // Populate modal fields
  document.getElementById('editInventoryId').value = id;
  document.getElementById('editInventoryName').value = name;
  document.getElementById('editInventoryCategory').value = category;
  document.getElementById('editInventoryQuantity').value = quantity;
  
  // Update stock preview
  updateStockPreview(quantity);
  
  // Show modal
  showModal('editInventoryModal');
}

function updateStockPreview(quantity) {
  const preview = document.getElementById('stockPreview');
  if (!preview) return;
  
  const qty = parseInt(quantity) || 0;
  
  if (qty <= 10) {
    preview.textContent = 'Low Stock';
    preview.style.color = '#991b1b';
  } else {
    preview.textContent = 'In Stock';
    preview.style.color = '#065f46';
  }
}

// Real-time stock status preview as user types
document.addEventListener('DOMContentLoaded', () => {
  const qtyInput = document.getElementById('editInventoryQuantity');
  if (qtyInput) {
    qtyInput.addEventListener('input', (e) => {
      updateStockPreview(e.target.value);
    });
  }
});

// Handle Edit Inventory Form Submission
document.addEventListener('DOMContentLoaded', () => {
  const editForm = document.getElementById('editInventoryForm');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const id = document.getElementById('editInventoryId').value;
      const name = document.getElementById('editInventoryName').value;
      const category = document.getElementById('editInventoryCategory').value;
      const quantity = parseInt(document.getElementById('editInventoryQuantity').value);
      
      if (!category || quantity < 0) {
        showToast('Please fill all fields correctly', 'error');
        return;
      }
      
      try {
        const result = await API.updateInventory(id, { 
          name, 
          category, 
          quantity 
        });
        
        if (result.success) {
          showToast('Inventory updated successfully', 'success');
          hideModal('editInventoryModal');
          loadStaffInventoryList(); // Reload the list
        } else {
          showToast(result.message || 'Failed to update inventory', 'error');
        }
      } catch (error) {
        console.error('Update inventory error:', error);
        showToast('Failed to update inventory', 'error');
      }
    });
  }
});



// =============================================================================
// PAGE INITIALIZATION
// =============================================================================

// Dashboard Tab Switching
function initDashboardTabs() {
  const tabs = document.querySelectorAll('.dashboard-tab');
  const modules = document.querySelectorAll('.dashboard-module');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      modules.forEach(m => m.classList.remove('active'));
      
      const targetModule = document.getElementById(targetTab + 'Module');
      if (targetModule) {
        targetModule.classList.add('active');
        
        // Load data for that module
        if (targetTab === 'furniture') loadFurnitureList();
        else if (targetTab === 'business') loadBusinessInfo();
        else if (targetTab === 'inventory' && window.location.pathname.includes('admin.html')) loadInventoryList();
        else if (targetTab === 'inventory' && window.location.pathname.includes('staff.html')) loadStaffInventoryList();
       else if (targetTab === 'delivery' && window.location.pathname.includes('admin.html')) {
  loadDeliveryList();
  loadDeliveryStats();
}
        else if (targetTab === 'delivery' && window.location.pathname.includes('staff.html')) {
  loadStaffDeliveryList();
  loadDeliveryStats();
}
       else if (targetTab === 'sales' && window.location.pathname.includes('admin.html')) {
  loadSalesList();
  loadSalesAnalytics();
}

        else if (targetTab === 'sales' && window.location.pathname.includes('staff.html')) {
  loadStaffSalesList();
  loadStaffSalesAnalytics();
}
        else if (targetTab === 'reviews' && window.location.pathname.includes('admin.html')) loadReviewsList();
        else if (targetTab === 'reviews' && window.location.pathname.includes('staff.html')) loadStaffReviewsList();
        else if (targetTab === 'staff') loadStaffAccountsList();
      }
    });
  });
}

// Modal Close Buttons
function initModalCloseButtons() {
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      hideModal(modalId);
    });
  });
}

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Furniture Management System Initialized - Backend Mode (FIXED VERSION)');
  
  initDashboardTabs();
  initModalCloseButtons();
  
  // Admin Page
  if (window.location.pathname.includes('admin.html')) {
    loadFurnitureList();
    initAdminFurnitureSearch();
    
    const addFurnitureBtn = document.getElementById('addFurnitureBtn');
    if (addFurnitureBtn) addFurnitureBtn.addEventListener('click', openAddFurnitureModal);
    
    const furnitureForm = document.getElementById('furnitureForm');
    if (furnitureForm) furnitureForm.addEventListener('submit', handleFurnitureSubmit);
    
    const furnitureImage = document.getElementById('furnitureImage');
    if (furnitureImage) furnitureImage.addEventListener('change', handleFurnitureImageUpload);
    
    // NEW: Business Information Forms
    const aboutForm = document.getElementById('aboutForm');
    if (aboutForm) aboutForm.addEventListener('submit', handleAboutFormSubmit);
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.addEventListener('submit', handleContactFormSubmit);
    
    const addStockBtn = document.getElementById('addStockBtn');
    if (addStockBtn) addStockBtn.addEventListener('click', openAddInventoryModal);
    
    const stockForm = document.getElementById('stockForm');
    if (stockForm) stockForm.addEventListener('submit', handleInventorySubmit);
    
    const addDeliveryBtn = document.getElementById('addDeliveryBtn');
    if (addDeliveryBtn) addDeliveryBtn.addEventListener('click', openAddDeliveryModal);
    
    const deliveryForm = document.getElementById('deliveryForm');
    if (deliveryForm) deliveryForm.addEventListener('submit', handleDeliverySubmit);
    
    const addSalesBtn = document.getElementById('addSalesBtn');
    if (addSalesBtn) addSalesBtn.addEventListener('click', openAddSalesModal);
    
    const salesForm = document.getElementById('salesForm');
    if (salesForm) salesForm.addEventListener('submit', handleSalesSubmit);
    
    const addReviewBtn = document.getElementById('addReviewBtn');
    if (addReviewBtn) addReviewBtn.addEventListener('click', openAddReviewModal);
    
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) reviewForm.addEventListener('submit', handleReviewSubmit);
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Staff Page
   
  if (window.location.pathname.includes('staff.html')) {
    loadStaffInventoryList();
    
    const deliveryForm = document.getElementById('deliveryForm');
    if (deliveryForm) deliveryForm.addEventListener('submit', handleDeliverySubmit);
    
    // NEW: Staff Review Form
    const staffReviewForm = document.getElementById('staffReviewForm');
    if (staffReviewForm) staffReviewForm.addEventListener('submit', handleStaffReviewSubmit);
    
    // NEW: Staff Sales Form
    const staffSalesForm = document.getElementById('staffSalesForm');
    if (staffSalesForm) staffSalesForm.addEventListener('submit', handleStaffSalesSubmit);
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Login Page
  if (window.location.pathname.includes('login.html')) {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    
    const signupForm = document.getElementById('signupForm');
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
  }
  
  // About Page - AUTO-LOAD BUSINESS INFO
  if (window.location.pathname.includes('about.html')) {
    loadAboutPageContent();
  }
  
  // Contact Page - AUTO-LOAD CONTACT INFO
  if (window.location.pathname.includes('contact.html')) {
    loadContactPageContent();
  }
  // Furniture List Page - AUTO-LOAD PRODUCTS (ADD THIS)
  if (window.location.pathname.includes('furniture-list.html')) {
    loadPublicFurnitureList();
    initFurnitureListFilters();
  }
  // Furniture Detail Page - AUTO-LOAD PRODUCT DETAILS (ADD THIS)
  if (window.location.pathname.includes('furniture-detail.html')) {
    loadFurnitureDetail();
  }
  if (window.location.pathname.includes('track-delivery.html')) {
  const publicTrackForm = document.getElementById('publicTrackForm');
  if (publicTrackForm) {
    publicTrackForm.addEventListener('submit', handlePublicTrackDelivery);
  }
}
});


// Add button to Staff Module for creating staff accounts (Admin only)
if (window.location.pathname.includes('admin.html')) {
  setTimeout(() => {
    const staffModule = document.getElementById('staffModule');
    if (staffModule && !document.getElementById('addStaffAccountBtn')) {
      const card = staffModule.querySelector('.card');
      if (card) {
        const btnHTML = `
          <div style="margin-bottom: 1.5rem;">
            <button class="btn btn-accent" id="addStaffAccountBtn" onclick="openAddStaffModal()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create New Staff Account
            </button>
          </div>
        `;
        card.insertAdjacentHTML('beforebegin', btnHTML);
      }
    }
  }, 500);
}

console.log('✅ All modules loaded - Backend functionality should be operational');