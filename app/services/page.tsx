'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, FileText, Briefcase, Plane, Home, ArrowLeft, Heart, Landmark, GraduationCap, Zap, Utensils, MapPin } from 'lucide-react';

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", name: "All Services", icon: <Zap className="w-5 h-5"/> },
    { id: "personal", name: "Personal Identity", icon: <FileText className="w-5 h-5"/>, color: "blue" },
    { id: "land", name: "Land & Housing", icon: <Home className="w-5 h-5"/>, color: "green" },
    { id: "travel", name: "Travel & Visa", icon: <Plane className="w-5 h-5"/>, color: "purple" },
    { id: "business", name: "Business", icon: <Briefcase className="w-5 h-5"/>, color: "orange" },
    { id: "health", name: "Health & Welfare", icon: <Heart className="w-5 h-5"/>, color: "red" },
    { id: "legal", name: "Legal & Judiciary", icon: <Landmark className="w-5 h-5"/>, color: "indigo" },
    { id: "education", name: "Education", icon: <GraduationCap className="w-5 h-5"/>, color: "cyan" },
    { id: "local", name: "Local Government", icon: <MapPin className="w-5 h-5"/>, color: "yellow" },
    { id: "utilities", name: "Utilities", icon: <Utensils className="w-5 h-5"/>, color: "pink" },
  ];

  const services = [
    // Personal Identity Services
    { id: "birth-certificate", title: "Birth Certificate Copy", dept: "Registrar General", category: "personal", processing: "3-5 days" },
    { id: "death-certificate", title: "Death Certificate", dept: "Registrar General", category: "personal", processing: "2-3 days" },
    { id: "marriage-certificate", title: "Marriage Certificate", dept: "Registrar General", category: "personal", processing: "3-5 days" },
    { id: "nic-application", title: "National Identity Card (NIC)", dept: "Dept of Registration of Persons", category: "personal", processing: "10-15 days" },
    { id: "nic-renewal", title: "NIC Renewal", dept: "Dept of Registration of Persons", category: "personal", processing: "5-7 days" },
    { id: "name-change", title: "Name Change Certificate", dept: "Registrar General", category: "personal", processing: "7-10 days" },
    
    // Land & Housing Services
    { id: "land-title", title: "Land Title Registration", dept: "Land Registry", category: "land", processing: "15-20 days" },
    { id: "land-transfer", title: "Land Transfer Deed", dept: "Land Registry", category: "land", processing: "20-25 days" },
    { id: "property-tax", title: "Property Tax Assessment", dept: "Municipal Council", category: "land", processing: "5-7 days" },
    { id: "building-permit", title: "Building Permit", dept: "Municipal Council", category: "land", processing: "10-15 days" },
    { id: "land-clearance", title: "Land Clearance Certificate", dept: "Land Registry", category: "land", processing: "7-10 days" },
    { id: "deed-copy", title: "Certified Deed Copy", dept: "Land Registry", category: "land", processing: "3-5 days" },
    
    // Travel & Visa Services
    { id: "passport-renewal", title: "Passport Renewal", dept: "Immigration & Emigration", category: "travel", processing: "15-20 days" },
    { id: "passport-application", title: "Passport Application", dept: "Immigration & Emigration", category: "travel", processing: "20-30 days" },
    { id: "visa-application", title: "Visa Application", dept: "Immigration & Emigration", category: "travel", processing: "7-10 days" },
    { id: "travel-certificate", title: "Travel Authorization Certificate", dept: "Immigration & Emigration", category: "travel", processing: "3-5 days" },
    { id: "driving-license", title: "Driving License", dept: "Motor Traffic", category: "travel", processing: "5-7 days" },
    { id: "vehicle-registration", title: "Vehicle Registration", dept: "Motor Traffic", category: "travel", processing: "7-10 days" },
    
    // Business Services
    { id: "business-registration", title: "Business Registration", dept: "Registrar of Companies", category: "business", processing: "10-15 days" },
    { id: "company-incorporation", title: "Company Incorporation", dept: "Registrar of Companies", category: "business", processing: "15-20 days" },
    { id: "business-license", title: "Business License", dept: "Municipal Council", category: "business", processing: "5-7 days" },
    { id: "tax-registration", title: "Tax Registration (VAT)", dept: "Department of Inland Revenue", category: "business", processing: "7-10 days" },
    { id: "trade-license", title: "Trade License Renewal", dept: "Municipal Council", category: "business", processing: "3-5 days" },
    { id: "import-permit", title: "Import Permit", dept: "Customs Department", category: "business", processing: "10-15 days" },
    
    // Health & Welfare Services
    { id: "health-insurance", title: "Health Insurance Registration", dept: "Ministry of Health", category: "health", processing: "5-7 days" },
    { id: "maternity-benefit", title: "Maternity Benefit", dept: "Labour Department", category: "health", processing: "7-10 days" },
    { id: "disability-certificate", title: "Disability Certificate", dept: "Ministry of Health", category: "health", processing: "10-15 days" },
    { id: "pension-application", title: "Pension Application", dept: "Department of Pensions", category: "health", processing: "15-20 days" },
    { id: "welfare-assistance", title: "Welfare Assistance", dept: "Ministry of Social Services", category: "health", processing: "10-15 days" },
    
    // Legal & Judiciary Services
    { id: "police-clearance", title: "Police Clearance Report", dept: "Sri Lanka Police", category: "legal", processing: "5-7 days" },
    { id: "criminal-record", title: "Criminal Record Certificate", dept: "Sri Lanka Police", category: "legal", processing: "7-10 days" },
    { id: "court-affidavit", title: "Court Affidavit Approval", dept: "District Court", category: "legal", processing: "10-15 days" },
    { id: "legal-opinion", title: "Legal Opinion Request", dept: "Attorney General's Office", category: "legal", processing: "15-20 days" },
    
    // Education Services
    { id: "student-loan", title: "Student Loan Application", dept: "Ministry of Education", category: "education", processing: "10-15 days" },
    { id: "scholarship", title: "Scholarship Application", dept: "Ministry of Education", category: "education", processing: "20-25 days" },
    { id: "transcript", title: "Academic Transcript", dept: "University Grants Commission", category: "education", processing: "5-7 days" },
    { id: "degree-certificate", title: "Degree Certificate", dept: "University Grants Commission", category: "education", processing: "7-10 days" },
    
    // Local Government Services
    { id: "grama-certificate", title: "Grama Niladhari Character Certificate", dept: "District Secretariat", category: "local", processing: "3-5 days" },
    { id: "residence-certificate", title: "Residence Certificate", dept: "Grama Niladhari", category: "local", processing: "1-2 days" },
    { id: "income-certificate", title: "Income Certificate", dept: "Grama Niladhari", category: "local", processing: "2-3 days" },
    { id: "village-development", title: "Village Development Fund", dept: "District Secretariat", category: "local", processing: "10-15 days" },
    
    // Utilities Services
    { id: "water-connection", title: "Water Connection", dept: "Water Supply Board", category: "utilities", processing: "10-15 days" },
    { id: "electricity-connection", title: "Electricity Connection", dept: "Ceylon Electricity Board", category: "utilities", processing: "10-15 days" },
    { id: "utility-bill", title: "Utility Bill Payment", dept: "Water & Electricity Boards", category: "utilities", processing: "Instant" },
    { id: "gas-connection", title: "Gas Connection", dept: "Litro Gas Company", category: "utilities", processing: "5-7 days" },
  ];

  // Filter services based on selected category and search term
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         service.dept.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return "bg-blue-50 text-blue-700 border-blue-200";
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
      green: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
      purple: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
      orange: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
      red: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
      indigo: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
      cyan: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100",
      yellow: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
      pink: "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100",
    };
    return (category.color && category.color in colorMap ? colorMap[category.color] : "bg-blue-50 text-blue-700 border-blue-200");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 flex items-center gap-4">
        <Link href="/dashboard" className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">E-Services Portal</h1>
          <p className="text-gray-600 mt-1">Access all government services in one place</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white p-5 rounded-xl shadow-md flex gap-3 flex-col md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search services by name or department..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="px-6 py-2.5 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition shadow-sm">
            Search
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl font-medium text-sm transition-all border-2 ${
                selectedCategory === cat.id 
                  ? 'bg-blue-700 text-white border-blue-700 shadow-lg scale-105' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-200 hover:bg-blue-50'
              }`}
            >
              {cat.icon}
              <span className="text-center">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="max-w-7xl mx-auto mb-6">
        <p className="text-gray-600 font-medium">
          Showing <span className="text-blue-700 font-bold">{filteredServices.length}</span> services
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const categoryInfo = categories.find(c => c.id === service.category);
              return (
                <div key={service.id} className="bg-white p-6 rounded-xl border-2 border-gray-100 shadow-md hover:shadow-lg hover:border-blue-200 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-lg ${getCategoryColor(service.category)} border-2`}>
                      {categoryInfo?.icon}
                    </div>
                    <span className="text-xs font-bold bg-linear-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1 rounded-full">
                      {service.processing}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">Department:</p>
                  <p className="text-sm font-semibold text-gray-700 mb-4">{service.dept}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full text-white ${
                      service.category === 'personal' ? 'bg-blue-500' :
                      service.category === 'land' ? 'bg-green-500' :
                      service.category === 'travel' ? 'bg-purple-500' :
                      service.category === 'business' ? 'bg-orange-500' :
                      service.category === 'health' ? 'bg-red-500' :
                      service.category === 'legal' ? 'bg-indigo-500' :
                      service.category === 'education' ? 'bg-cyan-500' :
                      service.category === 'local' ? 'bg-yellow-500' :
                      service.category === 'utilities' ? 'bg-pink-500' :
                      'bg-gray-500'
                    }`}>
                      {categories.find(c => c.id === service.category)?.name}
                    </span>
                  </div>
                  
                  <Link href={`/dashboard/apply/${service.id}`}>
                    <button className="w-full py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition group-hover:from-blue-700 group-hover:to-blue-800">
                      Apply Now →
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-xl border-2 border-gray-200 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or category filter</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}