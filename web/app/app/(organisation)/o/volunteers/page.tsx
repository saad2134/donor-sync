//@ts-nocheck
"use client";
import { useState } from "react";
import PlaceholderContent from "@/components/custom/placeholder-content";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Search } from "lucide-react";

export default function VolunteersPage() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <ContentLayout title="Volunteers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-semibold text-red-600 dark:text-red-500">Volunteers Management</h1>
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search volunteers..."
              className="w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard title="TOTAL VOLUNTEERS" value="428" subtitle="+12 this month" />
          <DashboardCard title="AVAILABLE NOW" value="85" subtitle="Ready for assignment" />
          <DashboardCard title="HIGHEST RANKED" value="37" subtitle="5-star rated volunteers" />
          <DashboardCard title="MEDICAL PROS" value="64" subtitle="Healthcare staff" />
        </div>

        {/* Mobile Filters Toggle */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="md:hidden w-full py-2 px-4 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300"
        >
          {showMobileFilters ? "Hide Skill Filters" : "Show Skill Filters"}
        </button>

        {/* Mobile Filters */}
        <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block`}>
          <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto">
            <FilterButton active={true}>All Skills</FilterButton>
            <FilterButton>Medical</FilterButton>
            <FilterButton>Logistics</FilterButton>
            <FilterButton>Admin</FilterButton>
            <FilterButton>Drivers</FilterButton>
            <FilterButton>Counselors</FilterButton>
            <FilterButton>Phlebotomists</FilterButton>
          </div>
        </div>

        {/* Volunteers Section */}
        <div className="mt-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-500">Active Volunteers</h2>
            <div className="flex flex-wrap gap-2">
              <FilterButton active={true}>All</FilterButton>
              <FilterButton>Available</FilterButton>
              <FilterButton>By Rating</FilterButton>
              <FilterButton>By Experience</FilterButton>
            </div>
          </div>

          {/* Volunteer Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <VolunteerCard
              initials="JD"
              name="John Doe"
              role="Medical Officer"
              skills={["Phlebotomist", "First Aid"]}
              rating={5}
              available={true}
            />
            <VolunteerCard
              initials="AK"
              name="Amy Kim"
              role="Registered Nurse"
              skills={["Blood Draw", "Patient Care", "Medical"]}
              rating={5}
              available={false}
            />
            <VolunteerCard
              initials="MR"
              name="Mike Rodriguez"
              role="Logistics Coordinator"
              skills={["Transportation", "Logistics"]}
              rating={4}
              available={true}
            />
            <VolunteerCard
              initials="SP"
              name="Sarah Parker"
              role="Administrative Assistant"
              skills={["Data Entry", "Reception", "Admin"]}
              rating={3}
              available={true}
            />
            <VolunteerCard
              initials="RL"
              name="Robert Lee"
              role="Driver"
              skills={["Transportation", "Logistics"]}
              rating={4}
              available={false}
            />
            <VolunteerCard
              initials="EJ"
              name="Emma Johnson"
              role="Counselor"
              skills={["Donor Support", "Mental Health"]}
              rating={5}
              available={true}
            />
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-1">
          <PageButton icon={<ChevronLeftIcon />} />
          <PageButton active={true}>1</PageButton>
          <PageButton>2</PageButton>
          <PageButton>3</PageButton>
          <PageButton>4</PageButton>
          <PageButton icon={<ChevronRightIcon />} />
        </div>
      </div>
    </ContentLayout>
  );
}

// Dashboard Card Component
function DashboardCard({ title, value, subtitle }) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 border-l-4 border-red-500 shadow hover:shadow-lg transition-all hover:translate-y-[-5px] hover:bg-red-500 dark:hover:bg-red-600 group">
      <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-white mb-2">{title}</div>
      <div className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-white">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-white">{subtitle}</div>
    </div>
  );
}

// Filter Button Component
function FilterButton({ children, active }) {
  return (
    <button
      className={`py-1.5 px-3 rounded text-sm border ${
        active
          ? "bg-red-500 text-white border-red-500"
          : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-red-500 hover:border-red-500 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

// Volunteer Card Component
function VolunteerCard({ initials, name, role, skills, rating, available }) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 flex border-l-4 border-transparent hover:border-red-500 shadow transition-all hover:translate-y-[-3px]">
      <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-zinc-200 dark:bg-zinc-700 rounded-full mr-3 text-lg md:text-xl text-red-500 flex-shrink-0">
        {initials}
      </div>
      <div className="min-w-0">
        <h3 className="text-sm md:text-base font-bold text-gray-800 dark:text-white truncate hover:text-red-500 dark:hover:text-red-500 transition-colors">
          {name}
        </h3>
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">{role}</p>
        <div className="flex flex-wrap gap-1 my-1.5">
          {skills.map((skill, index) => (
            <span key={index} className="text-xs bg-zinc-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded">
              {skill}
            </span>
          ))}
        </div>
        <div className="flex gap-0.5 text-yellow-500 text-xs">
          {[...Array(5)].map((_, i) => (
            <span key={i}>{i < rating ? "★" : "☆"}</span>
          ))}
        </div>
        <div className={`text-xs mt-1.5 ${available ? "text-green-500" : "text-red-500"}`}>
          {available ? "Available" : "On Assignment"}
        </div>
      </div>
    </div>
  );
}

// Page Button Component
function PageButton({ children, icon, active }) {
  return (
    <button
      className={`w-8 h-8 flex items-center justify-center rounded ${
        active
          ? "bg-red-500 text-white"
          : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-red-500 hover:text-white"
      }`}
    >
      {icon || children}
    </button>
  );
}

// Icons
function ChevronLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
    </svg>
  );
}
