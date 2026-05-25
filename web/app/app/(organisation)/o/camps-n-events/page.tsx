//@ts-nocheck
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function CampsAndEventsPage() {
  return (
    <ContentLayout title="Camps & Events Management">
      <div className="flex flex-wrap gap-5 justify-center">
        {/* Upcoming Camps Card */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg w-64 h-48 shadow-md transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 hover:-translate-y-1 hover:shadow-lg hover:border-red-500 dark:hover:border-[#e63946]">
          <div className="h-16 flex items-center justify-center bg-gray-100 dark:bg-black">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 fill-red-600 dark:fill-[#e63946]">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM7 12h5v5H7v-5z"/>
            </svg>
          </div>
          <div className="p-4 text-center">
            <h3 className="text-gray-800 dark:text-white font-semibold mb-2 group-hover:text-red-600 dark:group-hover:text-[#e63946]">Upcoming Camps</h3>
            <p className="text-gray-600 dark:text-[#b0b0b0] text-sm">View and manage all scheduled blood donation camps</p>
          </div>
        </div>
        
        {/* Schedule New Camp Card */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg w-64 h-48 shadow-md transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 hover:-translate-y-1 hover:shadow-lg hover:border-red-500 dark:hover:border-[#e63946]">
          <div className="h-16 flex items-center justify-center bg-gray-100 dark:bg-black">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 fill-red-600 dark:fill-[#e63946]">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
            </svg>
          </div>
          <div className="p-4 text-center">
            <h3 className="text-gray-800 dark:text-white font-semibold mb-2 group-hover:text-red-600 dark:group-hover:text-[#e63946]">Schedule Camp</h3>
            <p className="text-gray-600 dark:text-[#b0b0b0] text-sm">Create and plan new blood donation drives</p>
          </div>
        </div>
        
        {/* Camp Analytics Card */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg w-64 h-48 shadow-md transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 hover:-translate-y-1 hover:shadow-lg hover:border-red-500 dark:hover:border-[#e63946]">
          <div className="h-16 flex items-center justify-center bg-gray-100 dark:bg-black">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 fill-red-600 dark:fill-[#e63946]">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </div>
          <div className="p-4 text-center">
            <h3 className="text-gray-800 dark:text-white font-semibold mb-2 group-hover:text-red-600 dark:group-hover:text-[#e63946]">Camp Analytics</h3>
            <p className="text-gray-600 dark:text-[#b0b0b0] text-sm">Track performance metrics and collection data</p>
          </div>
        </div>
        
        {/* Past Camps Card */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg w-64 h-48 shadow-md transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 hover:-translate-y-1 hover:shadow-lg hover:border-red-500 dark:hover:border-[#e63946]">
          <div className="h-16 flex items-center justify-center bg-gray-100 dark:bg-black">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 fill-red-600 dark:fill-[#e63946]">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
          </div>
          <div className="p-4 text-center">
            <h3 className="text-gray-800 dark:text-white font-semibold mb-2 group-hover:text-red-600 dark:group-hover:text-[#e63946]">Past Camps</h3>
            <p className="text-gray-600 dark:text-[#b0b0b0] text-sm">View history and records of completed camps</p>
          </div>
        </div>
        
        {/* Venues & Partners Card */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg w-64 h-48 shadow-md transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 hover:-translate-y-1 hover:shadow-lg hover:border-red-500 dark:hover:border-[#e63946]">
          <div className="h-16 flex items-center justify-center bg-gray-100 dark:bg-black">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 fill-red-600 dark:fill-[#e63946]">
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
            </svg>
          </div>
          <div className="p-4 text-center">
            <h3 className="text-gray-800 dark:text-white font-semibold mb-2 group-hover:text-red-600 dark:group-hover:text-[#e63946]">Venues & Partners</h3>
            <p className="text-gray-600 dark:text-[#b0b0b0] text-sm">Manage locations and sponsoring organizations</p>
          </div>
        </div>
        
        {/* Feedback Card */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-lg w-64 h-48 shadow-md transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 hover:-translate-y-1 hover:shadow-lg hover:border-red-500 dark:hover:border-[#e63946]">
          <div className="h-16 flex items-center justify-center bg-gray-100 dark:bg-black">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 fill-red-600 dark:fill-[#e63946]">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
            </svg>
          </div>
          <div className="p-4 text-center">
            <h3 className="text-gray-800 dark:text-white font-semibold mb-2 group-hover:text-red-600 dark:group-hover:text-[#e63946]">Feedback</h3>
            <p className="text-gray-600 dark:text-[#b0b0b0] text-sm">Collect and manage donor and partner feedback</p>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}