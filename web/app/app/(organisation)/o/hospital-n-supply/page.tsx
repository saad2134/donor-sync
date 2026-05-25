//@ts-nocheck
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function HospitalSupplyManagement() {
  return (
    <ContentLayout title="Hospital & Supply Management">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {/* Request Management Card */}
        <div className="bg-white dark:bg-stone-900 rounded-lg shadow-md overflow-hidden border border-stone-200 dark:border-stone-800">
          <div className="bg-red-600 dark:bg-red-700 text-white p-4 font-bold flex items-center justify-between">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V7h14v12zm-2-7H7v-2h10v2zm-4 4H7v-2h6v2z" />
              </svg>
              Request Management
            </span>
            <span className="bg-red-800 text-white px-2 py-1 rounded-full text-xs">5 New</span>
          </div>
          <div className="p-5">
            <div className="border-l-4 border-red-600 dark:border-red-500 p-3 mb-3 bg-stone-50 dark:bg-stone-800 rounded-r">
              <h4 className="text-stone-800 dark:text-white font-medium mb-1">City General Hospital</h4>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Request ID: #BRQ-2023-0458</p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">A+ (5 units), O- (3 units)</p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Requested: April 5, 2025</p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">
                Status: <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs animate-pulse">URGENT</span>
              </p>
            </div>
            
            <div className="border-l-4 border-red-600 dark:border-red-500 p-3 mb-3 bg-stone-50 dark:bg-stone-800 rounded-r">
              <h4 className="text-stone-800 dark:text-white font-medium mb-1">Memorial Medical Center</h4>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Request ID: #BRQ-2023-0457</p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">B- (2 units), AB+ (1 unit)</p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Requested: April 4, 2025</p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">
                Status: <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">PENDING</span>
              </p>
            </div>
            
            <div className="border-l-4 border-red-600 dark:border-red-500 p-3 mb-3 bg-stone-50 dark:bg-stone-800 rounded-r">
              <h4 className="text-stone-800 dark:text-white font-medium mb-1">Children's Hospital</h4>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Request ID: #BRQ-2023-0456</p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">O+ (4 units)</p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Requested: April 4, 2025</p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">
                Status: <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">APPROVED</span>
              </p>
            </div>
            
            <div className="text-center mt-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                View All Requests
              </button>
            </div>
          </div>
        </div>
        
        {/* Current Supply Status Card */}
        <div className="bg-white dark:bg-stone-900 rounded-lg shadow-md overflow-hidden border border-stone-200 dark:border-stone-800">
          <div className="bg-red-600 dark:bg-red-700 text-white p-4 font-bold flex items-center justify-between">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L6 7l1.41 1.41L12 4.83l4.59 3.58L18 7 12 2zm0 15-6-5 1.41-1.41L12 14.17l4.59-3.58L18 12l-6 5z" />
              </svg>
              Current Supply Status
            </span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded text-center border border-stone-200 dark:border-stone-700">
                <div className="text-red-600 dark:text-red-500 text-lg font-bold">A+</div>
                <div className="text-stone-600 dark:text-stone-400 text-sm">45 units</div>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded text-center border border-stone-200 dark:border-stone-700">
                <div className="text-red-600 dark:text-red-500 text-lg font-bold">A-</div>
                <div className="text-stone-600 dark:text-stone-400 text-sm">12 units</div>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded text-center border border-stone-200 dark:border-stone-700">
                <div className="text-red-600 dark:text-red-500 text-lg font-bold">B+</div>
                <div className="text-stone-600 dark:text-stone-400 text-sm">32 units</div>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded text-center border border-stone-200 dark:border-stone-700">
                <div className="text-red-600 dark:text-red-500 text-lg font-bold">B-</div>
                <div className="text-stone-600 dark:text-stone-400 text-sm">8 units</div>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded text-center border border-stone-200 dark:border-stone-700">
                <div className="text-red-600 dark:text-red-500 text-lg font-bold">AB+</div>
                <div className="text-stone-600 dark:text-stone-400 text-sm">18 units</div>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded text-center border border-stone-200 dark:border-stone-700">
                <div className="text-red-600 dark:text-red-500 text-lg font-bold">AB-</div>
                <div className="text-stone-600 dark:text-stone-400 text-sm">5 units</div>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded text-center border border-stone-200 dark:border-stone-700">
                <div className="text-red-600 dark:text-red-500 text-lg font-bold">O+</div>
                <div className="text-stone-600 dark:text-stone-400 text-sm">53 units</div>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded text-center border border-stone-200 dark:border-stone-700">
                <div className="text-red-600 dark:text-red-500 text-lg font-bold">O-</div>
                <div className="text-red-600 dark:text-red-500 text-sm">3 units</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 mb-3 bg-stone-50 dark:bg-stone-800 rounded border-l-3 border-red-600 dark:border-red-500">
              <span className="font-semibold text-stone-800 dark:text-stone-200">Critical Types:</span>
              <span className="text-red-600 dark:text-red-500 font-bold">O-, AB-</span>
            </div>
            
            <div className="flex justify-between items-center p-4 mb-3 bg-stone-50 dark:bg-stone-800 rounded border-l-3 border-red-600 dark:border-red-500">
              <span className="font-semibold text-stone-800 dark:text-stone-200">Expiring within 7 days:</span>
              <span className="text-yellow-500 dark:text-yellow-400 font-bold">12 units</span>
            </div>
            
            <div className="flex justify-between items-center p-4 mb-3 bg-stone-50 dark:bg-stone-800 rounded border-l-3 border-red-600 dark:border-red-500">
              <span className="font-semibold text-stone-800 dark:text-stone-200">Total Inventory:</span>
              <span className="text-stone-800 dark:text-stone-200 font-bold">176 units</span>
            </div>
            
            <div className="text-center mt-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                Full Inventory Report
              </button>
            </div>
          </div>
        </div>
        
        {/* Partner Hospitals Card */}
        <div className="bg-white dark:bg-stone-900 rounded-lg shadow-md overflow-hidden border border-stone-200 dark:border-stone-800">
          <div className="bg-red-600 dark:bg-red-700 text-white p-4 font-bold flex items-center justify-between">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 6.5a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zm4.5-1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.5 6v2h-2v7h-3v-7h-6v7H8v-7H6v-2c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2z" />
              </svg>
              Partner Hospitals
            </span>
          </div>
          <div className="p-5">
            <div className="border-l-4 border-red-600 dark:border-red-500 p-3 mb-3 bg-stone-50 dark:bg-stone-800 rounded-r">
              <h4 className="text-stone-800 dark:text-white font-medium mb-1">City General Hospital</h4>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Priority Level: <span className="text-green-600 dark:text-green-500">Platinum</span></p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Last Supply: April 2, 2025</p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Contact: Dr. Sarah Johnson</p>
            </div>
            
            <div className="border-l-4 border-red-600 dark:border-red-500 p-3 mb-3 bg-stone-50 dark:bg-stone-800 rounded-r">
              <h4 className="text-stone-800 dark:text-white font-medium mb-1">Memorial Medical Center</h4>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Priority Level: <span className="text-green-600 dark:text-green-500">Gold</span></p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Last Supply: March 28, 2025</p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Contact: Dr. Michael Chen</p>
            </div>
            
            <div className="border-l-4 border-red-600 dark:border-red-500 p-3 mb-3 bg-stone-50 dark:bg-stone-800 rounded-r">
              <h4 className="text-stone-800 dark:text-white font-medium mb-1">Children's Hospital</h4>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Priority Level: <span className="text-green-600 dark:text-green-500">Platinum</span></p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Last Supply: April 1, 2025</p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Contact: Dr. Emily Rodriguez</p>
            </div>
            
            <div className="border-l-4 border-red-600 dark:border-red-500 p-3 mb-3 bg-stone-50 dark:bg-stone-800 rounded-r">
              <h4 className="text-stone-800 dark:text-white font-medium mb-1">University Medical Center</h4>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Priority Level: <span className="text-green-600 dark:text-green-500">Silver</span></p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Last Supply: March 25, 2025</p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Contact: Dr. James Wilson</p>
            </div>
            
            <div className="text-center mt-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                Manage Hospital Partners
              </button>
            </div>
          </div>
        </div>
        
        {/* Blood Delivery Partners Card */}
        <div className="bg-white dark:bg-stone-900 rounded-lg shadow-md overflow-hidden border border-stone-200 dark:border-stone-800">
          <div className="bg-red-600 dark:bg-red-700 text-white p-4 font-bold flex items-center justify-between">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5M7.5 17c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5M20 8h-3V4H1v11h3c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h3v-5l-3-3zm-.5 1.5l1.96 2.5H17V9.5h2.5z" />
              </svg>
              Blood Delivery Partners
            </span>
          </div>
          <div className="p-5">
            <div className="border-l-4 border-red-600 dark:border-red-500 p-3 mb-3 bg-stone-50 dark:bg-stone-800 rounded-r">
              <h4 className="text-stone-800 dark:text-white font-medium mb-1">MedExpress Logistics</h4>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Service Level: <span className="text-green-600 dark:text-green-500">Emergency (24/7)</span></p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Current Deliveries: 2 Active</p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Contact: 1-800-MED-EXPR</p>
            </div>
            
            <div className="border-l-4 border-red-600 dark:border-red-500 p-3 mb-3 bg-stone-50 dark:bg-stone-800 rounded-r">
              <h4 className="text-stone-800 dark:text-white font-medium mb-1">LifeLine Transport</h4>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Service Level: <span className="text-green-600 dark:text-green-500">Standard (8am-8pm)</span></p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Current Deliveries: 1 Active</p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Contact: 1-888-LIFE-TR</p>
            </div>
            
            <div className="border-l-4 border-red-600 dark:border-red-500 p-3 mb-3 bg-stone-50 dark:bg-stone-800 rounded-r">
              <h4 className="text-stone-800 dark:text-white font-medium mb-1">CriticalCare Couriers</h4>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Service Level: <span className="text-green-600 dark:text-green-500">Rush (1-3 hours)</span></p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Current Deliveries: None</p>
              <p className="text-stone-600 dark:text-stone-300 text-sm">Contact: 1-855-CRIT-CR</p>
            </div>
            
            <div className="flex justify-between items-center p-4 mb-3 bg-stone-50 dark:bg-stone-800 rounded border-l-3 border-red-600 dark:border-red-500">
              <span className="font-semibold text-stone-800 dark:text-stone-200">Deliveries Today:</span>
              <span className="text-stone-800 dark:text-stone-200 font-bold">7 Completed, 3 Active</span>
            </div>
            
            <div className="text-center mt-4 flex flex-wrap justify-center gap-2">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                Schedule Delivery
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                Track Deliveries
              </button>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}