import {
  Users,
  Settings, UserSearch, ChartArea,
  HeartPulse, CircleAlert, Hospital, BellRing, BookHeart,
  History, SquareUserRound, MessageCircleReply, CalendarCheck, BotMessageSquare,
  LayoutGrid, Syringe, PersonStanding,
  LucideIcon, Tent, HandCoins,
  AlertCircle
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;

};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};



export function getMenuList(pathname: string, role: "guest" | "admin" | "removed" | "patient" | "donor" | "hospital" | "organisation"): Group[] {

  if (role === "organisation") {
    return [
      {
        groupLabel: "",
        menus: [
          {
            href: "/app/o/dashboard",
            label: "Dashboard",
            icon: LayoutGrid,
            submenus: []
          }
        ]
      },

      {
        groupLabel: "Manage",
        menus: [
          {
            href: "/app/o/camps-n-events",
            label: "Camps & Events",
            icon: Tent,
            submenus: []
          },
          {
            href: "/app/o/hospital-n-supply",
            label: "Hospital & Supply",
            icon: Hospital,
            submenus: []
          },
          {
            href: "/app/o/inventory",
            label: "Inventory",
            icon: Syringe,
            submenus: []
          },
          {
            href: "/app/o/volunteers",
            label: "Volunteers",
            icon: PersonStanding,
            submenus: []
          },
          {
            href: "/app/o/fundraising",
            label: "Fundraising",
            icon: HandCoins,
            submenus: []
          },
          {
            href: "/app/o/notifications",
            label: "Notifications",
            icon: BellRing
          },
        ]
      },
      {
        groupLabel: "Options",
        menus: [
          {
            href: "/app/o/profile",
            label: "Profile",
            icon: SquareUserRound
          },
          {
            href: "/app/o/settings",
            label: "Settings",
            icon: Settings
          },
        ]
      },
      {
        groupLabel: "Help & Support",
        menus: [
          {
            href: "/app/o/community",
            label: "Community",
            icon: Users
          },
          {
            href: "/app/o/feedback",
            label: "Feedback",
            icon: MessageCircleReply
          },
          {
            href: "/app/o/syncbot",
            label: "Chat with Syncbot",
            icon: BotMessageSquare
          }
        ]
      }
    ];
  }

  // HOSPITAL SIDEBAR OPTIONS 
  else if (role === "hospital") {
    return [
      {
        groupLabel: "",
        menus: [
          {
            href: "/app/h/dashboard",
            label: "Dashboard",
            icon: LayoutGrid,
            submenus: []
          }
        ]
      },

      {
        groupLabel: "Manage",
        menus: [
          {
            href: "/app/h/blood-requests",
            label: "Blood Requests",
            icon: HeartPulse,
            submenus: [/* 
              {
                href: "/donate/urgent",
                label: "Incoming Patients Requests"
              },
              {
                href: "/donate/nearby",
                label: "Request Processing & Status Updates",

              },
              {
                href: "/donate/nearby",
                label: "Urgent/Emergency Requests",

              }
             */]
          },
          {
            href: "/app/h/patient-management",
            label: "Patient Management",
            icon: UserSearch,
            submenus: [/* 
              {
                href: "/donate/urgent",
                label: "List of admitted patients"
              },
              {
                href: "/donate/nearby",
                label: "Blood transfusion schedules",

              },
              {
                href: "/donate/nearby",
                label: "Medical reports & case history",
              } */
            ]
          },
          {
            href: "/app/h/blood-inventory",
            label: "Blood Inventory",
            icon: Syringe,
            submenus: [
              /* {
                href: "/donate/urgent",
                label: "Available blood types & stock levels"
              },
              {
                href: "/donate/nearby",
                label: "Expiry alerts & low-stock warnings",

              },
              {
                href: "/donate/nearby",
                label: "Blood unit management",

              } */
            ]
          },
          {
            href: "/app/h/donor-management",
            label: "Donor Management",
            icon: BookHeart,
            submenus: [
              /* {
                href: "/donate/urgent",
                label: "List of registered donors"
              },
              {
                href: "/donate/nearby",
                label: "Donor eligibility & history",

              },
              {
                href: "/donate/nearby",
                label: "Recent donations",

              } */
            ]
          },
        /* {
          href: "",
          label: "Doctor & Staff Management",
          icon: UserSearch,
          submenus: [
            {
              href: "/donate/urgent",
              label: "Assigned doctors & specialists"
            },
            {
              href: "/donate/nearby",
              label: "Contact details & schedules",
              
            },
            {
              href: "/donate/nearby",
              label: "Duty rosters",
            }
          ]
        } */,
          {
            href: "/app/h/emergency-alerts",
            label: "Emergency Alerts",
            icon: AlertCircle,
            submenus: [/*
              {
                href: "/donate/urgent",
                label: "Critical low-stock alerts"
              },
              {
                href: "/donate/nearby",
                label: "Urgent blood requests",

              },
              {
                href: "/donate/nearby",
                label: "Emergency contact numbers",
              } */
            ]
          },
          {
            href: "/app/h/analytics",
            label: "Analytics",
            icon: ChartArea,
            submenus: [/*
              {
                href: "/not-found",
                label: "Monthly blood usage statistics"
              },
              {
                href: "/not-found",
                label: "Donor & request trends",

              },
              {
                href: "/not-found",
                label: "Hospital efficiency metrics",
              } */
            ]
          },
          {
            href: "/app/h/notifications",
            label: "Notifications",
            icon: BellRing
          },
        ]
      },
      {
        groupLabel: "Options",
        menus: [
          {
            href: "/app/h/profile",
            label: "Profile",
            icon: SquareUserRound
          },
          {
            href: "/app/h/settings",
            label: "Settings",
            icon: Settings
          },
        ]
      },
      {
        groupLabel: "Help & Support",
        menus: [
          {
            href: "/app/h/community",
            label: "Community",
            icon: Users
          },
          {
            href: "/app/h/feedback",
            label: "Feedback",
            icon: MessageCircleReply
          },
          {
            href: "/app/h/syncbot",
            label: "Chat with Syncbot",
            icon: BotMessageSquare
          }
        ]
      }
    ];
  }

  // PATIENT SIDEBAR OPTIONS
  else if (role === "patient") {
    return [
      {
        groupLabel: "",
        menus: [
          {
            href: "/app/p/dashboard",
            label: "Dashboard",
            icon: LayoutGrid,
            submenus: []
          }
        ]
      },
      {
        groupLabel: "Request",
        menus: [
          {
            href: "/app/p/request-blood",
            label: "Request Blood",
            icon: SquareUserRound
          },
          {
            href: "/app/p/appointments",
            label: "Appointments",
            icon: CalendarCheck
          },

          {
            href: "/app/p/history",
            label: "History",
            icon: History
          },
          {
            href: "/app/p/find-hospital",
            label: "Find Hospital",
            icon: Hospital
          },
          {
            href: "",
            label: "Emergency",
            icon: CircleAlert,
            submenus: [
              {
                href: "/app/p/emergency/request",
                label: "Emergency Request"
              },
              {
                href: "/app/p/emergency/ambulance",
                label: "Emergency Ambulance",

              }
            ]
          },

          {
            href: "/app/p/notifications",
            label: "Notifications",
            icon: BellRing
          },
        ]
      },
      {
        groupLabel: "Options",
        menus: [
          {
            href: "/app/p/profile",
            label: "Profile",
            icon: SquareUserRound
          },
          {
            href: "/app/p/settings",
            label: "Settings",
            icon: Settings
          },
        ]
      },
      {
        groupLabel: "Help & Support",
        menus: [
          {
            href: "/app/p/community",
            label: "Community",
            icon: Users
          },
          {
            href: "/app/p/feedback",
            label: "Feedback",
            icon: MessageCircleReply
          },
          {
            href: "/app/p/syncbot",
            label: "Chat with Syncbot",
            icon: BotMessageSquare
          }
        ]
      }
    ];
  }

  // DONOR SIDE BAR OPTIONS
  else if (role === "donor") {
    return [
      {
        groupLabel: "",
        menus: [
          {
            href: "/app/d/dashboard",
            label: "Dashboard",
            icon: LayoutGrid,
            submenus: []
          }
        ]
      },
      {
        groupLabel: "Contribute",
        menus: [
          {
            href: "",
            label: "Donate Now",
            icon: HeartPulse,
            submenus: [
              {
                href: "/app/d/donate/urgent",
                label: "Urgent"
              },
              {
                href: "/app/d/donate/nearby",
                label: "Nearby Donations"
              }
            ]
          },
          {
            href: "/app/d/appointments",
            label: "Appointments",
            icon: CalendarCheck
          },
          {
            href: "/app/d/donation-history",
            label: "Donation History",
            icon: History
          },
          {
            href: "/app/d/notifications",
            label: "Notifications",
            icon: BellRing
          }
        ]
      },
      {
        groupLabel: "Options",
        menus: [
          {
            href: "/app/d/profile",
            label: "Profile",
            icon: SquareUserRound
          },
          {
            href: "/app/d/settings",
            label: "Settings",
            icon: Settings
          },
        ]
      },
      {
        groupLabel: "Help & Support",
        menus: [
          {
            href: "/app/d/community",
            label: "Community",
            icon: Users
          },
          {
            href: "/app/d/feedback",
            label: "Feedback",
            icon: MessageCircleReply
          },
          {
            href: "/app/d/syncbot",
            label: "Chat with Syncbot",
            icon: BotMessageSquare
          }
        ]
      }
    ];
  }

  return []; // Default empty menu for unknown roles
}