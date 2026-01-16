'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FileText, 
  UploadCloud, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Check,
  Cloud
} from 'lucide-react';
import { submitApplication, getUserProfile } from '@/lib/api'; // Import getUserProfile

export default function ApplicationForm() {
  const params = useParams();
  const router = useRouter();
  
  // 1. Get Service Name from URL (Dynamic)
  // Example: URL /apply/police-clearance -> "Police Clearance"
  const serviceId = params.id as string;
  const serviceTitle = serviceId
    ? serviceId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : "Service Application";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true); // Loading state for profile

  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
  };
  
  // 2. Form Data State (Initially Empty)
  const [formData, setFormData] = useState({
    nic: '', 
    name: '',
    phone: '',
    address: '',
    reason: ''
  });

  // 3. FETCH REAL USER DATA ON LOAD
  useEffect(() => {
    async function loadUserData() {
      try {
        setFetchingUser(true);
        const userProfile = await getUserProfile();
        
        // Auto-fill form with Database Data
        setFormData(prev => ({
          ...prev,
          nic: userProfile.nic || '',
          name: userProfile.fullname || '',
          phone: userProfile.phone || '',
          address: userProfile.address || ''
        }));
      } catch (error) {
        console.error("Failed to load user details", error);
        showNotification('error', 'Could not load user details. Please check your connection');
      } finally {
        setFetchingUser(false);
      }
    }
    loadUserData();
  }, []);

  // 4. UPLOADED FILES STATE
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Get required documents based on service type
  const getRequiredDocuments = () => {
    const docMap: { [key: string]: string[] } = {
      'Birth Certificate': ['Birth Report', 'Parent NIC', 'Birth Registration Form'],
      'Police Clearance': ['NIC Copy', 'Application Form', 'Declaration'],
      'National Id Card': ['Birth Certificate', 'GS Certificate', 'Proof of Residence'],
      'Passport': ['Birth Certificate', 'NIC', 'Passport Photos'],
      'Character Certificate': ['NIC Copy', 'Application Form'],
      'Residency Certificate': ['Proof of Address', 'NIC Copy'],
      'Driving License': ['NIC Copy', 'Medical Report', 'Driving Test Proof'],
      'Land Deed': ['Land Survey Report', 'Owner NIC', 'Tax Receipt']
    };
    return docMap[serviceTitle] || ['NIC Copy', 'Supporting Documents'];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      
      if (file.size > maxSize) {
        showNotification('error', `File "${file.name}" exceeds 5MB limit`);
        return false;
      }
      if (!validTypes.includes(file.type)) {
        showNotification('error', `File "${file.name}" must be PDF or JPG`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      showNotification('success', `${validFiles.length} file(s) uploaded successfully`);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    showNotification('success', 'File removed');
  };

  // MAIN LOGIC: Handle Steps and Submission
  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // FINAL STEP: Submit to Backend
      setLoading(true);
      
      try {
        const payload = {
            service_type: serviceTitle, // Use the Dynamic Title
            applicant_nic: formData.nic, // Use Real NIC
            details: {
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                reason: formData.reason
            },
            status: "Pending"
        };

        await submitApplication(payload);
        router.push('/payment');

      } catch (error) {
        console.error("Submission Error:", error);
        showNotification('error', 'Failed to submit application. Please try again');
      } finally {
        setLoading(false);
      }
    }
  };

  // If fetching user data, show loading screen
  if (fetchingUser) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="animate-spin w-10 h-10 mb-4 text-blue-600" />
        <p>Verifying Digital Identity...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {notification.show && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-5 duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl ${
            notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {notification.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            <div>
              <p className="font-semibold">{notification.type === 'success' ? 'Success' : 'Error'}</p>
              <p className="text-sm">{notification.message}</p>
            </div>
            <button onClick={() => setNotification({ ...notification, show: false })} className="ml-4 hover:bg-white/20 p-1 rounded transition">
              <X size={18} />
            </button>
          </div>
        </div>
      )}
      
      {/* Page Header */}
      <div className="mb-8">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-blue-600 flex items-center mb-4">
            <ArrowLeft size={16} className="mr-1"/> Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-blue-600"/> {serviceTitle} Application
        </h1>
        {/* Dynamic Ref ID based on timestamp for uniqueness */}
        <p className="text-gray-500">Application Reference: <span className="font-mono text-gray-700">REQ-{new Date().getTime().toString().slice(-6)}</span></p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
            <span className={`text-sm font-bold ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>1. Details</span>
            <span className={`text-sm font-bold ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>2. Uploads</span>
            <span className={`text-sm font-bold ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>3. Review</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
                className="bg-blue-600 h-full transition-all duration-500 ease-in-out" 
                style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
            ></div>
        </div>
      </div>

      {/* ==========================
          STEP 1: VERIFY DETAILS (REAL DATA)
      ========================== */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Verify Your Details</h2>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6 flex gap-3">
                <ShieldCheck className="text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                    We have auto-filled this form using your <strong>National Digital Identity</strong>. Please check if the details are correct.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number</label>
                    <input type="text" value={formData.nic} disabled className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 font-mono cursor-not-allowed" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" value={formData.name} disabled className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input 
                        type="text" 
                        value={formData.phone} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input 
                        type="text" 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Application</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Visa Purpose / Banking Requirement" 
                        value={formData.reason}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                    />
                </div>
            </div>
            
            <div className="flex justify-end">
                <button onClick={handleNext} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2">
                    Next Step <ArrowRight size={18} />
                </button>
            </div>
        </div>
      )}

      {/* ==========================
          STEP 2: UPLOAD DOCUMENTS
      ========================== */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Required Proofs</h2>
            
            {/* REQUIRED DOCUMENTS INFO */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <AlertCircle size={18} />
                    Required Documents
                </h4>
                <div className="flex flex-wrap gap-2">
                    {getRequiredDocuments().map((doc) => (
                        <span key={doc} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {doc}
                        </span>
                    ))}
                </div>
            </div>

            {/* FILE UPLOAD AREA */}
            <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:bg-blue-100 transition cursor-pointer mb-6"
            >
                <div className="flex flex-col items-center gap-3">
                    <UploadCloud className="text-blue-500" size={48} />
                    <div>
                        <p className="font-semibold text-gray-800">Click or Drag documents here</p>
                        <p className="text-sm text-gray-600">PDF, JPG or PNG • Max 5MB per file</p>
                    </div>
                </div>
                <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                />
            </div>

            {/* UPLOADED FILES LIST */}
            {uploadedFiles.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                        <Check className="text-green-600" size={18} />
                        Uploaded Files ({uploadedFiles.length})
                    </h4>
                    <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-3 rounded border border-green-200">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <FileText className="text-blue-500 flex-shrink-0" size={20} />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-gray-800 truncate">{file.name}</p>
                                        <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="flex-shrink-0 ml-2 p-1 hover:bg-red-100 rounded text-red-600"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <label htmlFor="file-upload" className="block mb-6">
                <button
                    type="button"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-medium transition"
                >
                    {uploadedFiles.length > 0 ? `Add More Files (${uploadedFiles.length} selected)` : 'Select Files'}
                </button>
            </label>

            <div className="flex justify-between mt-8">
                <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-900 font-medium">Back</button>
                <button 
                    onClick={handleNext} 
                    disabled={uploadedFiles.length === 0}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Review Application <ArrowRight size={18} />
                </button>
            </div>
        </div>
      )}

      {/* ==========================
          STEP 3: REVIEW & SUBMIT
      ========================== */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Review Summary</h2>

            <div className="space-y-4 mb-8">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Service Type</span>
                    <span className="font-bold text-gray-900">{serviceTitle}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Applicant</span>
                    <span className="font-bold text-gray-900">{formData.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Mobile</span>
                    <span className="font-bold text-gray-900">{formData.phone}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Reason</span>
                    <span className="font-bold text-gray-900">{formData.reason || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Documents Uploaded</span>
                    <span className="font-bold text-green-600">{uploadedFiles.length} file(s)</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-700 font-medium">Government Fee</span>
                    <span className="font-bold text-xl text-blue-700">LKR 1,500.00</span>
                </div>
            </div>

            {/* UPLOADED FILES SUMMARY */}
            {uploadedFiles.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                        <Check className="text-green-600" size={18} />
                        Uploaded Documents
                    </h4>
                    <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 bg-white p-2 rounded border border-green-200">
                                <FileText className="text-blue-500" size={18} />
                                <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                                <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-between">
                <button 
                  onClick={() => setStep(2)} 
                  disabled={loading}
                  className="text-gray-500 hover:text-gray-900 font-medium disabled:opacity-50"
                >
                  Back
                </button>
                
                <button 
                  onClick={handleNext} 
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2 shadow-lg disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><CreditCard size={18} /> Proceed to Payment</>}
                </button>
            </div>
        </div>
      )}

    </div>
  );
}