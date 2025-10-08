// --@ts-nocheck
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function UrgentDonationsPage() {
  return (
    <ContentLayout title="Community">
      <div className="min-h-screen p-8 bg-gray-200 text-black dark:bg-black dark:text-white rounded-2xl">
        <h1 className="text-4xl sm:text-3xl font-bold text-red-600 mb-8">DonorSync Community</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              title: "Forums & Discussions",
              description: "Join conversations on various topics. Ask questions, share insights, and learn from community members.",
              button: "Browse Forums",
              footerLeft: "👥 1,254 members",
              footerRight: "💬 87 today",
            },
            {
              title: "Active Groups",
              description: "Find groups focused on specific interests. Collaborate on projects, share resources, and build connections.",
              button: "Explore Groups",
              footerLeft: "🔍 42 groups",
              footerRight: "🔥 12 active now",
            },
            {
              title: "Success Stories",
              description: "Read inspiring stories from community members who achieved their goals and overcame challenges.",
              button: "Read Stories",
              footerLeft: "🏆 328 stories",
              footerRight: "⭐ 4.9 rating",
            },
            {
              title: "Connect with Others",
              description: "Find mentors, peers, and friends. Build your network and create meaningful relationships.",
              button: "Connect Now",
              footerLeft: "🔄 76 new connections",
              footerRight: "👋 43 seeking mentors",
            },
            {
              title: "Community Polls",
              description: "Participate in community polls and surveys. Share your opinion and see what others think.",
              button: "Vote Now",
              footerLeft: "📊 8 active polls",
              footerRight: "✅ 642 participants",
            },
            {
              title: "Upcoming Events",
              description: "Don't miss our online and offline events. Workshops, webinars, meetups, and more.",
              button: "See Calendar",
              footerLeft: "🗓 12 upcoming",
              footerRight: "🎟 3 open registrations",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="rounded-xl shadow-lg transition-transform overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] hover:-translate-y-1.5 shadow-red-500/10 dark:shadow-red-500/20 hover:shadow-red-500/30 dark:hover:shadow-red-500/40"
            >
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">{card.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 leading-relaxed">{card.description}</p>
                <a
                  href="#"
                  className="inline-block px-3 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-500 transition-colors"
                >
                  {card.button}
                </a>
              </div>
              <div className="px-5 py-3 flex justify-between text-gray-600 dark:text-gray-400 text-xs border-t border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-[#111]">
                <span>{card.footerLeft}</span>
                <span>{card.footerRight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ContentLayout>
  );
}