export const API_URL = "https://smart-citizen-backend.onrender.com";

// Helper to extract error message safely
export const getErrorMessage = (data: any) => {
  if (data.detail) {
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) {
        // FastAPI validation error is an array
        return data.detail.map((e: any) => `${e.loc[1]}: ${e.msg}`).join(", ");
    }
    return JSON.stringify(data.detail);
  }
  return "An unexpected error occurred";
};

// ==========================================
// 1. AUTHENTICATION (Public)
// ==========================================

export const registerUser = async (userData: any) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    // 🔥 FIXED: Use the helper to get the real text
    throw new Error(getErrorMessage(data));
  }
  return data;
};

export const loginUser = async (credentials: any) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }
  return data;
};

// Send OTP via email or phone
export const sendOTP = async (nic: string, contactMethod: 'email' | 'phone') => {
  const response = await fetch(`${API_URL}/api/auth/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nic,
      contact_method: contactMethod,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }
  return data;
};

// Verify OTP code
export const verifyOTP = async (nic: string, otpCode: string) => {
  const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nic,
      otp_code: otpCode,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }
  return data;
};

// ==========================================
// 2. HELPER: Get Token from Storage
// ==========================================
export const getAuthHeader = (): Record<string, string> => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem('token');
    if (token) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
    }
  }
  return { "Content-Type": "application/json" };
};

// ==========================================
// 3. CITIZEN SERVICES (Protected)
// ==========================================

export const submitApplication = async (data: any) => {
  const response = await fetch(`${API_URL}/api/applications/`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });

  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const getMyApplications = async () => {
  const response = await fetch(`${API_URL}/api/applications/my-apps`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

// ==========================================
// 4. ADMIN SERVICES (Protected)
// ==========================================

export const getPendingApplications = async () => {
  const response = await fetch(`${API_URL}/api/applications/pending`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const updateApplicationStatus = async (id: string, status: string) => {
  const response = await fetch(`${API_URL}/api/applications/${id}/status`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify({ status }),
  });

  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

// ==========================================
// 5. MARKETPLACE API
// ==========================================

export const getAllProducts = async () => {
  const response = await fetch(`${API_URL}/api/products/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const addProduct = async (productData: any) => {
  const response = await fetch(`${API_URL}/api/products/`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(productData),
  });

  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const updateProduct = async (productId: string, productData: any) => {
  const response = await fetch(`${API_URL}/api/products/${productId}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(productData),
  });

  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const deleteProduct = async (productId: string) => {
  const response = await fetch(`${API_URL}/api/products/${productId}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const getSmartRecommendations = async () => {
  const response = await fetch(`${API_URL}/api/recommendations/`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

// ==========================================
// 6. USER PROFILE & WALLET API
// ==========================================

export const getUserProfile = async () => {
  const response = await fetch(`${API_URL}/api/users/me`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error(getErrorMessage(await response.json()));
  return await response.json();
};

export const updateUserProfile = async (data: any) => {
  const response = await fetch(`${API_URL}/api/users/me`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const getWalletDocuments = async () => {
  const response = await fetch(`${API_URL}/api/users/wallet`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

// ==========================================
// 8. VERIFICATION API (Public)
// ==========================================
export const getCertificateStatus = async (certId: string) => {
  const response = await fetch(`${API_URL}/api/applications/verify/${certId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

// Subscribe to newsletter
export const subscribeNewsletter = async (email: string) => {
  const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(data));
  return data;
};

// Admin: get subscribers
export const getSubscribers = async () => {
  const response = await fetch(`${API_URL}/api/newsletter/subscribers`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};

// Admin: get notifications
export const getNotifications = async () => {
  const response = await fetch(`${API_URL}/api/newsletter/notifications`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error(await response.text());
  return await response.json();
};

// ==========================================
// 7. GS OFFICER API
// ==========================================

export const getGSStats = async () => {
  const response = await fetch(`${API_URL}/api/gs/stats`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const getVillagers = async () => {
  const response = await fetch(`${API_URL}/api/gs/villagers`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const addVillager = async (villagerData: any) => {
  const response = await fetch(`${API_URL}/api/gs/add-citizen`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(villagerData),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const updateVillager = async (nic: string, villagerData: any) => {
  const response = await fetch(`${API_URL}/api/gs/villagers/${nic}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(villagerData),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const deleteVillager = async (nic: string) => {
  const response = await fetch(`${API_URL}/api/gs/villagers/${nic}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const getLandDisputes = async () => {
  const response = await fetch(`${API_URL}/api/gs/land`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const getGSApplications = async () => {
  const response = await fetch(`${API_URL}/api/gs/applications`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error("Failed to fetch GS applications");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.applications || [];
};

export const getGSActivities = async () => {
  const response = await fetch(`${API_URL}/api/gs/activities`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error("Failed to fetch GS activities");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.activities || [];
};

export const addLandDispute = async (data: any) => {
  const response = await fetch(`${API_URL}/api/gs/land`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const getGSCertificates = async () => {
  const response = await fetch(`${API_URL}/api/gs/certificates`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const issueCertificate = async (certificateData: any) => {
  const response = await fetch(`${API_URL}/api/gs/certificates`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(certificateData),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const updateCertificate = async (certId: string, certificateData: any) => {
  const response = await fetch(`${API_URL}/api/gs/certificates/${certId}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(certificateData),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const deleteCertificate = async (certId: string) => {
  const response = await fetch(`${API_URL}/api/gs/certificates/${certId}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const getGSRecords = async () => {
  const response = await fetch(`${API_URL}/api/gs/records`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const getGSMessages = async () => {
  const response = await fetch(`${API_URL}/api/gs/messages`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const sendGSMessage = async (payload: any) => {
  const response = await fetch(`${API_URL}/api/gs/messages`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(payload),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const getGSSettings = async () => {
  const response = await fetch(`${API_URL}/api/gs/settings`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const updateGSSettings = async (payload: any) => {
  const response = await fetch(`${API_URL}/api/gs/settings`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(payload),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

// ==========================================
// 8. DS OFFICER API
// ==========================================

export const getDSStats = async () => {
  const response = await fetch(`${API_URL}/api/ds/stats`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const getDSQueue = async () => {
  const response = await fetch(`${API_URL}/api/ds/queue`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const getDSCertificates = async () => {
  const response = await fetch(`${API_URL}/api/ds/certificates`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

// use getGSOfficers/addGSOfficer below for DS GS management

// ==========================================
// 9. SUPER ADMIN API
// ==========================================

export const getAllOfficers = async () => {
  const response = await fetch(`${API_URL}/api/admin/users`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  return await response.json();
};

export const updateOfficer = async (id: string, data: any) => {
  const response = await fetch(`${API_URL}/api/admin/users/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update officer');
  }
  return await response.json();
};

export const verifyOfficer = async (id: string) => {
  const response = await fetch(`${API_URL}/api/admin/users/${id}/verify`, {
    method: "PUT",
    headers: getAuthHeader(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to verify officer');
  }
  return await response.json();
};

export const deleteOfficer = async (id: string) => {
  const response = await fetch(`${API_URL}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  return await response.json();
};

export const getAllServices = async () => {
  const response = await fetch(`${API_URL}/api/admin/services`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  return await response.json();
};

export const updateServiceConfig = async (id: string, data: any) => {
  const response = await fetch(`${API_URL}/api/admin/services/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const getRevenueAnalytics = async () => {
  const response = await fetch(`${API_URL}/api/admin/revenue`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  return await response.json();
};

export const getSystemStats = async () => {
  const response = await fetch(`${API_URL}/api/admin/stats`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  return await response.json();
};

// ==========================================
// NEW: HIERARCHY MANAGEMENT (Admin, DS, GS)
// ==========================================

// ===== ADMIN ENDPOINTS =====
export const assignDSToDiv = async (data: {
  ds_nic: string;
  province: string;
  district: string;
  ds_division: string;
}) => {
  const response = await fetch(`${API_URL}/api/admin/assign-ds`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(result));
  return result;
};

export const getAllDivisions = async () => {
  const response = await fetch(`${API_URL}/api/admin/divisions`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(data));
  return data;
};

export const updateDivision = async (ds_nic: string, data: {
  ds_name: string;
  province: string;
  district: string;
  division: string;
  phone: string;
  email: string;
}) => {
  const response = await fetch(`${API_URL}/api/admin/divisions/${ds_nic}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(result));
  return result;
};

export const deleteDivision = async (ds_nic: string) => {
  const response = await fetch(`${API_URL}/api/admin/divisions/${ds_nic}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(result));
  return result;
};

// ===== DS ENDPOINTS =====
export const addGSOfficer = async (data: {
  fullname: string;
  nic: string;
  phone: string;
  email: string;
  password: string;
  gs_section: string;
  address: string;
}) => {
  const response = await fetch(`${API_URL}/api/ds/add-gs`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(result));
  return result;
};

export const getGSOfficers = async () => {
  const response = await fetch(`${API_URL}/api/ds/gs-officers`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(data));
  return data;
};

// ===== GS ENDPOINTS =====
export const addCitizen = async (data: {
  fullname: string;
  nic: string;
  phone: string;
  email: string;
  password: string;
  address: string;
}) => {
  const response = await fetch(`${API_URL}/api/gs/add-citizen`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(result));
  return result;
};

// Download Certificate with Authentication
export const downloadCertificate = async (appId: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/applications/${appId}/download`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || 'Failed to download certificate';
    throw new Error(errorMessage);
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Certificate_${appId}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// Add this to your APPLICATION API section
export const deleteApplication = async (id: string) => {
  const response = await fetch(`${API_URL}/api/applications/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  
  // Note: Ensure your backend has a DELETE route for this. 
  // If not, this frontend call will fail. 
  // For this frontend task, we assume standard REST behavior.
  if (!response.ok) throw new Error("Failed to delete application");
  return await response.json();
};

// ==========================================
// 7. DOCUMENTS, CERTIFICATIONS & PERMITS
// ==========================================

export const getUserDocuments = async () => {
  const response = await fetch(`${API_URL}/api/user/documents`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    if (response.status === 404) return []; // Return empty array if no documents
    throw new Error("Failed to fetch documents");
  }
  
  const data = await response.json();
  return Array.isArray(data) ? data : data.documents || [];
};

export const getUserCertifications = async () => {
  const response = await fetch(`${API_URL}/api/user/certifications`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    if (response.status === 404) return []; // Return empty array if no certifications
    throw new Error("Failed to fetch certifications");
  }
  
  const data = await response.json();
  return Array.isArray(data) ? data : data.certifications || [];
};

export const getUserPermits = async () => {
  const response = await fetch(`${API_URL}/api/user/permits`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    if (response.status === 404) return []; // Return empty array if no permits
    throw new Error("Failed to fetch permits");
  }
  
  const data = await response.json();
  return Array.isArray(data) ? data : data.permits || [];
};

export const getUserNotifications = async () => {
  const response = await fetch(`${API_URL}/api/user/notifications`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    if (response.status === 404) return []; // Return empty array if no notifications
    throw new Error("Failed to fetch notifications");
  }
  
  const data = await response.json();
  return Array.isArray(data) ? data : data.notifications || [];
};

// ==========================================
// DS OFFICER API - EXTENDED
// ==========================================

// Batch Approvals
export const batchApproveApplications = async (applicationIds: string[]) => {
  const response = await fetch(`${API_URL}/api/ds/batch-approve`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({ application_ids: applicationIds }),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

// Performance Metrics
export const getPerformanceMetrics = async () => {
  const response = await fetch(`${API_URL}/api/ds/performance-metrics`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

// Complaints Management
export const getComplaints = async () => {
  const response = await fetch(`${API_URL}/api/ds/complaints`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const createComplaint = async (complaintData: any) => {
  const response = await fetch(`${API_URL}/api/ds/complaints`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(complaintData),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const updateComplaintStatus = async (complaintId: string, status: string) => {
  const response = await fetch(`${API_URL}/api/ds/complaints/${complaintId}?status=${status}`, {
    method: "PUT",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

// Audit Logs
export const getAuditLogs = async () => {
  const response = await fetch(`${API_URL}/api/ds/audit-logs`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

// Digital Signatures
export const getSignatureTemplates = async () => {
  const response = await fetch(`${API_URL}/api/ds/signature-templates`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const createSignatureTemplate = async (templateData: any) => {
  const response = await fetch(`${API_URL}/api/ds/signature-templates`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(templateData),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

// Workflow Analytics
export const getWorkflowAnalytics = async () => {
  const response = await fetch(`${API_URL}/api/ds/analytics`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

// Notifications
export const getDSNotifications = async () => {
  const response = await fetch(`${API_URL}/api/ds/notifications`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const createDSNotification = async (notificationData: any) => {
  const response = await fetch(`${API_URL}/api/ds/notifications`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(notificationData),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await fetch(`${API_URL}/api/ds/notifications/${notificationId}/read`, {
    method: "PUT",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

// Report Generation
export const generateReport = async (reportData: any) => {
  const response = await fetch(`${API_URL}/api/ds/generate-report`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(reportData),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

// Escalations
export const getEscalations = async () => {
  const response = await fetch(`${API_URL}/api/ds/escalations`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

export const createEscalation = async (escalationData: any) => {
  const response = await fetch(`${API_URL}/api/ds/escalations`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(escalationData),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

// Regional Reports
export const getRegionalReports = async () => {
  const response = await fetch(`${API_URL}/api/ds/regional-reports`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const resData = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(resData));
  return resData;
};

// ==========================================
// 14. ORDERS (Marketplace)
// ==========================================

export const createOrder = async (orderData: {
  items: Array<{ product_id: string; product_name: string; price: number; quantity: number; total: number }>;
  delivery_address: string;
  phone: string;
  payment_method: 'card' | 'cash_on_delivery' | 'bank_transfer';
}) => {
  const response = await fetch(`${API_URL}/api/orders/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(data));
  return data;
};

export const getMyOrders = async () => {
  const response = await fetch(`${API_URL}/api/orders/my-orders`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(data));
  return data;
};

export const getOrderDetails = async (orderId: string) => {
  const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(data));
  return data;
};

export const cancelOrder = async (orderId: string) => {
  const response = await fetch(`${API_URL}/api/orders/${orderId}/cancel`, {
    method: "PUT",
    headers: getAuthHeader(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(data));
  return data;
};

export const getAdminAllOrders = async () => {
  const response = await fetch(`${API_URL}/api/orders/admin/all`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(data));
  return data;
};

export const getOrderStats = async () => {
  const response = await fetch(`${API_URL}/api/orders/admin/stats`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(data));
  return data;
};

// ==========================================
// MESSAGING SYSTEM
// ==========================================

export const getConversations = async () => {
  const response = await fetch(`${API_URL}/api/messages/conversations`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(data));
  return data;
};

export const getConversationMessages = async (partnerNic: string) => {
  const response = await fetch(`${API_URL}/api/messages/conversation/${partnerNic}`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(data));
  return data;
};

export const sendMessage = async (messageData: {
  recipient_nic: string;
  subject: string;
  content: string;
  message_type?: string;
}) => {
  const response = await fetch(`${API_URL}/api/messages/send`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(messageData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(data));
  return data;
};

export const replyToMessage = async (messageId: string, content: string) => {
  const response = await fetch(`${API_URL}/api/messages/reply/${messageId}`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({ content }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(data));
  return data;
};

export const deleteMessage = async (messageId: string) => {
  const response = await fetch(`${API_URL}/api/messages/${messageId}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(data));
  return data;
};

export const getUsersForMessaging = async () => {
  const response = await fetch(`${API_URL}/api/messages/users`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(data));
  return data;
};

export const getUnreadMessageCount = async () => {
  const response = await fetch(`${API_URL}/api/messages/unread-count`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(data));
  return data;
};
