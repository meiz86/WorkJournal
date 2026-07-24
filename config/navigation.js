const navigation = [
  {
    title: "Dashboard",
    icon: "fa-solid fa-house",
    url: "/",
    permission: "dashboard.view",
  },
  {
    title: "Projects",
    icon: "fa-solid fa-folder-open",
    url: "/projects",
    permission: "projects.view",
  },
  {
    title: "Activities",
    icon: "fa-solid fa-clipboard-list",
    url: "/activities",
    permission: "activities.view",
  },
  {
    title: "Tasks",
    icon: "fa-solid fa-list-check",
    url: "/tasks",
    permission: "tasks.view",
  },
  {
    title: "Centers",
    icon: "fa-solid fa-tower-broadcast",
    url: "/centers",
    permission: "centers.view",
  },
  {
    title: "Stations",
    icon: "fa-solid fa-tower-cell",
    url: "/stations",
    permission: "stations.view",
  },
  {
    title: "Departments",
    icon: "fa-solid fa-building",
    url: "/departments",
    permission: "departments.view",
  },
  {
    title: "Calendar",
    icon: "fa-solid fa-calendar",
    url: "/calendar",
    permission: "dashboard.view",
  },
  {
    title: "Reports",
    icon: "fa-solid fa-chart-line",
    url: "/reports",
    permission: "reports.view",
  },
  {
    title: "Users",
    icon: "fa-solid fa-users",
    url: "/users",
    permission: "users.view",
  },
  {
    title: "Roles",
    icon: "fa-solid fa-user-shield",
    url: "/roles",
    permission: "roles.manage",
  },
  {
    title: "Permissions",
    icon: "fa-solid fa-key",
    url: "/permissions",
    permission: "roles.manage",
  },
  {
    title: "Administration",
    icon: "fa-solid fa-users-gear",
    url: "/admin",
    permission: "roles.manage",
  },
];

module.exports = navigation;
