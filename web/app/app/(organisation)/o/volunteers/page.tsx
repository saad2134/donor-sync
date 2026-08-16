// --@ts-nocheck
"use client";

import { useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Search, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const INITIAL_VOLUNTEERS = [
  { id: 1, initials: "JD", name: "John Doe", role: "Medical Officer", skills: ["Phlebotomist", "First Aid"], skillCategory: "Medical", rating: 5, available: true },
  { id: 2, initials: "AK", name: "Amy Kim", role: "Registered Nurse", skills: ["Blood Draw", "Patient Care", "Medical"], skillCategory: "Medical", rating: 5, available: false },
  { id: 3, initials: "MR", name: "Mike Rodriguez", role: "Logistics Coordinator", skills: ["Transportation", "Logistics"], skillCategory: "Logistics", rating: 4, available: true },
  { id: 4, initials: "SP", name: "Sarah Parker", role: "Administrative Assistant", skills: ["Data Entry", "Reception", "Admin"], skillCategory: "Admin", rating: 3, available: true },
  { id: 5, initials: "RL", name: "Robert Lee", role: "Driver", skills: ["Transportation", "Logistics"], skillCategory: "Drivers", rating: 4, available: false },
  { id: 6, initials: "EJ", name: "Emma Johnson", role: "Counselor", skills: ["Donor Support", "Mental Health"], skillCategory: "Counselors", rating: 5, available: true },
];

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState(INITIAL_VOLUNTEERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All Skills");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Calculate dashboard stats based on state
  const totalVolunteers = volunteers.length;
  const availableNow = volunteers.filter(v => v.available).length;
  const highestRanked = volunteers.filter(v => v.rating === 5).length;
  const medicalPros = volunteers.filter(v => v.skillCategory === "Medical").length;

  const handleToggleAvailable = (id: number) => {
    setVolunteers(prev =>
      prev.map(v => (v.id === id ? { ...v, available: !v.available } : v))
    );
  };

  // Filter logic
  const filteredVolunteers = volunteers.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = selectedSkill === "All Skills" || 
      v.skillCategory.toLowerCase() === selectedSkill.toLowerCase() ||
      v.skills.some(s => s.toLowerCase() === selectedSkill.toLowerCase());

    const matchesStatus = selectedStatus === "All" ||
      (selectedStatus === "Available" && v.available) ||
      (selectedStatus === "By Rating" && v.rating === 5);

    return matchesSearch && matchesSkill && matchesStatus;
  });

  return (
    <ContentLayout title="Volunteers">
      <div className="space-y-6 px-2">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-4 border-b border-border/40">
          <h1 className="text-xl font-semibold text-red-600 dark:text-red-500">Volunteers Management</h1>
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search volunteers by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard title="TOTAL VOLUNTEERS" value={totalVolunteers} subtitle="Assigned + available members" />
          <DashboardCard title="AVAILABLE NOW" value={availableNow} subtitle="Ready for active camp assignment" />
          <DashboardCard title="HIGHEST RANKED" value={highestRanked} subtitle="5-star rated volunteers" />
          <DashboardCard title="MEDICAL PROS" value={medicalPros} subtitle="Healthcare / Phlebotomists" />
        </div>

        {/* Skill Filters */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Filter by Skill Category</p>
          <div className="flex flex-wrap gap-2 overflow-x-auto">
            {["All Skills", "Medical", "Logistics", "Admin", "Drivers", "Counselors"].map(skill => (
              <FilterButton
                key={skill}
                active={selectedSkill === skill}
                onClick={() => setSelectedSkill(skill)}
              >
                {skill}
              </FilterButton>
            ))}
          </div>
        </div>

        {/* Volunteers Section */}
        <div className="mt-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-500">Active Volunteers List</h2>
            <div className="flex flex-wrap gap-2">
              {["All", "Available", "By Rating"].map(status => (
                <FilterButton
                  key={status}
                  active={selectedStatus === status}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </FilterButton>
              ))}
            </div>
          </div>

          {/* Volunteer Cards */}
          {filteredVolunteers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-2xl">
              No volunteers match your current search or filter selections.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredVolunteers.map((vol) => (
                <div key={vol.id} className="bg-card border border-border/40 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 text-red-500 rounded-full text-lg font-bold shrink-0">
                      {vol.initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-foreground truncate">{vol.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{vol.role}</p>
                      <div className="flex flex-wrap gap-1 my-1.5">
                        {vol.skills.map((skill, index) => (
                          <span key={index} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-0.5 text-yellow-500 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < vol.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between gap-2">
                    <span className={`text-xs font-semibold flex items-center gap-1 ${vol.available ? "text-green-500" : "text-stone-500"}`}>
                      {vol.available ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      {vol.available ? "Available" : "On Assignment"}
                    </span>

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 px-2.5"
                      onClick={() => handleToggleAvailable(vol.id)}
                    >
                      Toggle
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
}

// Dashboard Card Component
function DashboardCard({ title, value, subtitle }) {
  return (
    <div className="bg-card border border-border/40 rounded-xl p-4 border-l-4 border-l-red-500 hover:shadow-md transition">
      <div className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase mb-1">{title}</div>
      <div className="text-2xl font-extrabold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{subtitle}</div>
    </div>
  );
}

// Filter Button Component
function FilterButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`py-1 px-3 rounded-lg text-xs font-medium border transition ${
        active
          ? "bg-accent text-white border-accent"
          : "bg-background text-muted-foreground border-border hover:bg-accent/10 hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}
