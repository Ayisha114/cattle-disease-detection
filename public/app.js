// Global state
let currentUser = null;
let currentToken = null;
let currentReportId = null;

const API_BASE = window.location.origin + '/api';

// Initialize app
window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    localStorage.setItem('token', token);
    window.history.replaceState({}, document.title, '/');
  }
  
  const savedToken = localStorage.getItem('token');
  if (savedToken) {
    currentToken = savedToken;
    loadUser();
  }
};

// Authentication functions
function googleLogin() {
  window.location.href = API_BASE + '/auth/google';
}

async function sendOTP() {
  const phone = document.getElementById('phoneInput').value;
  
  if (!/^\d{10}$/.test(phone)) {
    alert('Please enter a valid 10-digit phone number');
    return;
  }
  
  try {
    const response = await fetch(API_BASE + '/auth/phone/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    
    const data = await response.json();
    
    if (data.success) {
      document.getElementById('phoneLoginForm').classList.add('hidden');
      document.getElementById('otpVerifyForm').classList.remove('hidden');
      
      if (data.dev_otp) {
        document.getElementById('devOTP').textContent = `Dev OTP: ${data.dev_otp}`;
      }
    } else {
      alert(data.error || 'Failed to send OTP');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function verifyOTP() {
  const phone = document.getElementById('phoneInput').value;
  const otp = document.getElementById('otpInput').value;
  const name = document.getElementById('nameInput').value;
  
  if (!name) {
    alert('Please enter your name');
    return;
  }
  
  if (!/^\d{6}$/.test(otp)) {
    alert('Please enter a valid 6-digit OTP');
    return;
  }
  
  try {
    const response = await fetch(API_BASE + '/auth/phone/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, name })
    });
    
    const data = await response.json();
    
    if (data.success) {
      currentToken = data.token;
      localStorage.setItem('token', data.token);
      currentUser = data.user;
      showApp();
    } else {
      alert(data.error || 'Invalid OTP');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

function backToPhone() {
  document.getElementById('otpVerifyForm').classList.add('hidden');
  document.getElementById('phoneLoginForm').classList.remove('hidden');
  document.getElementById('otpInput').value = '';
  document.getElementById('devOTP').textContent = '';
}

async function loadUser() {
  try {
    const response = await fetch(API_BASE + '/auth/me', {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    
    const data = await response.json();
    
    if (data.user) {
      currentUser = data.user;
      showApp();
    } else {
      logout();
    }
  } catch (error) {
    logout();
  }
}

function showApp() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('navbar').classList.remove('hidden');
  showPage('home');
  updateUserProfile();
  
  if (currentUser.role === 'admin') {
    document.getElementById('adminLink').classList.remove('hidden');
    document.getElementById('adminLink').onclick = () => showPage('admin');
  }
}

function updateUserProfile() {
  document.getElementById('userName').textContent = `Welcome, ${currentUser.name}!`;
  document.getElementById('userEmail').textContent = currentUser.email_or_phone;
  document.getElementById('userId').textContent = `User ID: ${currentUser.user_id}`;
  
  if (currentUser.profile_picture) {
    document.getElementById('userAvatar').src = currentUser.profile_picture;
  } else {
    document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=3b82f6&color=fff&size=80`;
  }
}

function logout() {
  localStorage.removeItem('token');
  currentToken = null;
  currentUser = null;
  location.reload();
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('hidden');
}

// Page navigation
function showPage(page) {
  ['homePage', 'uploadPage', 'reportsPage', 'profilePage', 'adminPage'].forEach(p => {
    document.getElementById(p).classList.add('hidden');
  });
  
  document.getElementById(page + 'Page').classList.remove('hidden');
  document.getElementById(page + 'Page').classList.add('fade-in');
  
  // Close mobile menu
  document.getElementById('mobileMenu').classList.add('hidden');
  
  if (page === 'reports') loadReports();
  if (page === 'profile') loadProfile();
  if (page === 'admin') loadAdminDashboard();
}

// Image upload functions
function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('previewImg').src = e.target.result;
      document.getElementById('imagePreview').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
}

async function uploadImage() {
  const fileInput = document.getElementById('imageInput');
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Please select an image');
    return;
  }
  
  document.getElementById('imagePreview').classList.add('hidden');
  document.getElementById('loadingSpinner').classList.remove('hidden');
  
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await fetch(API_BASE + '/upload/predict', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${currentToken}` },
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      displayResults(data.report);
      currentReportId = data.report.report_id;
    } else {
      alert(data.error || 'Upload failed');
      resetUpload();
    }
  } catch (error) {
    alert('Error: ' + error.message);
    resetUpload();
  }
}

function displayResults(report) {
  document.getElementById('loadingSpinner').classList.add('hidden');
  document.getElementById('resultSection').classList.remove('hidden');
  
  const statusEl = document.getElementById('resultStatus');
  statusEl.textContent = report.status;
  statusEl.className = report.status === 'Healthy' ? 'text-2xl font-bold mb-4 text-center text-green-600' : 'text-2xl font-bold mb-4 text-center text-red-600';
  
  document.getElementById('resultDisease').textContent = report.disease_name;
  document.getElementById('resultStage').textContent = report.stage;
  document.getElementById('resultConfidence').textContent = report.confidence + '%';
  document.getElementById('confidenceBar').style.width = report.confidence + '%';
  
  const precautionsList = document.getElementById('precautionsList');
  precautionsList.innerHTML = '';
  report.precautions.forEach(precaution => {
    const li = document.createElement('li');
    li.textContent = precaution;
    precautionsList.appendChild(li);
  });
  
  // Voice output if enabled
  if (currentUser.voice_enabled) {
    const text = `Status: ${report.status}. ${report.status === 'Diseased' ? `Disease: ${report.disease_name}. Stage: ${report.stage}.` : ''} Confidence: ${report.confidence} percent.`;
    speak(text);
  }
}

function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }
}

function resetUpload() {
  document.getElementById('imageInput').value = '';
  document.getElementById('imagePreview').classList.add('hidden');
  document.getElementById('loadingSpinner').classList.add('hidden');
  document.getElementById('resultSection').classList.add('hidden');
  currentReportId = null;
}

async function downloadReport() {
  if (!currentReportId) return;
  window.open(`${API_BASE}/reports/${currentReportId}/download`, '_blank');
}

// Reports page
async function loadReports() {
  try {
    const response = await fetch(API_BASE + '/reports', {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    
    const data = await response.json();
    
    const reportsList = document.getElementById('reportsList');
    reportsList.innerHTML = '';
    
    if (data.reports.length === 0) {
      reportsList.innerHTML = '<p class="text-gray-600 col-span-full text-center py-8">No reports yet. Upload an image to get started!</p>';
      return;
    }
    
    data.reports.forEach(report => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition';
      card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
          <span class="px-3 py-1 rounded-full text-sm font-semibold ${report.status === 'Healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
            ${report.status}
          </span>
          <span class="text-sm text-gray-500">${new Date(report.timestamp).toLocaleDateString()}</span>
        </div>
        <img src="${report.image_url}" class="w-full h-48 object-cover rounded-lg mb-4" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">
        <div class="space-y-2">
          <p class="text-sm text-gray-600">Disease: <span class="font-semibold text-gray-800">${report.disease_name}</span></p>
          <p class="text-sm text-gray-600">Stage: <span class="font-semibold text-gray-800">${report.stage}</span></p>
          <p class="text-sm text-gray-600">Confidence: <span class="font-semibold text-gray-800">${report.confidence}%</span></p>
        </div>
        <button onclick="downloadReportById('${report.report_id}')" class="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          <i class="fas fa-download mr-2"></i>Download PDF
        </button>
      `;
      reportsList.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading reports:', error);
  }
}

function downloadReportById(reportId) {
  window.open(`${API_BASE}/reports/${reportId}/download`, '_blank');
}

// Profile page
function loadProfile() {
  const profileDetails = document.getElementById('profileDetails');
  profileDetails.innerHTML = `
    <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
      <img src="${currentUser.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=3b82f6&color=fff&size=100`}" class="w-24 h-24 rounded-full">
      <div class="text-center md:text-left">
        <h3 class="text-2xl font-bold text-gray-800">${currentUser.name}</h3>
        <p class="text-gray-600">${currentUser.email_or_phone}</p>
      </div>
    </div>
    <div class="space-y-3">
      <div class="flex justify-between py-3 border-b">
        <span class="text-gray-600">User ID</span>
        <span class="font-semibold">${currentUser.user_id}</span>
      </div>
      <div class="flex justify-between py-3 border-b">
        <span class="text-gray-600">Auth Provider</span>
        <span class="font-semibold capitalize">${currentUser.auth_provider}</span>
      </div>
      <div class="flex justify-between py-3 border-b">
        <span class="text-gray-600">Role</span>
        <span class="font-semibold capitalize">${currentUser.role}</span>
      </div>
      <div class="flex justify-between py-3 border-b">
        <span class="text-gray-600">Member Since</span>
        <span class="font-semibold">${new Date(currentUser.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  `;
}

// Admin dashboard
async function loadAdminDashboard() {
  try {
    const response = await fetch(API_BASE + '/admin/stats', {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    
    const data = await response.json();
    
    if (data.success) {
      const stats = data.stats;
      
      document.getElementById('totalUsers').textContent = stats.totalUsers;
      document.getElementById('totalReports').textContent = stats.totalReports;
      document.getElementById('healthyCount').textContent = stats.healthyCount;
      document.getElementById('diseasedCount').textContent = stats.diseasedCount;
      
      // Status chart
      const statusCtx = document.getElementById('statusChart').getContext('2d');
      new Chart(statusCtx, {
        type: 'bar',
        data: {
          labels: ['Healthy', 'Diseased'],
          datasets: [{
            label: 'Count',
            data: [stats.healthyCount, stats.diseasedCount],
            backgroundColor: ['#10b981', '#ef4444']
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } }
        }
      });
      
      // Disease chart
      const diseaseCtx = document.getElementById('diseaseChart').getContext('2d');
      new Chart(diseaseCtx, {
        type: 'doughnut',
        data: {
          labels: stats.diseaseDistribution.map(d => d.disease),
          datasets: [{
            data: stats.diseaseDistribution.map(d => d.count),
            backgroundColor: ['#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#10b981']
          }]
        },
        options: { responsive: true }
      });
      
      // Recent activity
      const activityDiv = document.getElementById('recentActivity');
      activityDiv.innerHTML = `
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs md:text-sm">Report ID</th>
              <th class="px-4 py-2 text-left text-xs md:text-sm">User</th>
              <th class="px-4 py-2 text-left text-xs md:text-sm">Status</th>
              <th class="px-4 py-2 text-left text-xs md:text-sm hidden md:table-cell">Disease</th>
              <th class="px-4 py-2 text-left text-xs md:text-sm hidden md:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            ${stats.recentReports.map(r => `
              <tr class="border-b hover:bg-gray-50">
                <td class="px-4 py-2 text-xs md:text-sm">${r.report_id.substring(0, 8)}...</td>
                <td class="px-4 py-2 text-xs md:text-sm">${r.user_name}</td>
                <td class="px-4 py-2"><span class="px-2 py-1 rounded text-xs ${r.status === 'Healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${r.status}</span></td>
                <td class="px-4 py-2 text-xs md:text-sm hidden md:table-cell">${r.disease_name}</td>
                <td class="px-4 py-2 text-xs md:text-sm hidden md:table-cell">${new Date(r.timestamp).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    alert('Failed to load admin dashboard. Make sure you have admin privileges.');
  }
}