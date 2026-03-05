export const adminNavSections = [
  {
    title: "Navigation",
    items: [
      { label: "Dashboard", icon: "mdi:view-dashboard-outline" },
      { label: "Content", icon: "mdi:file-document-multiple-outline", active: true },
      { label: "Categories", icon: "mdi:shape-outline" },
      { label: "Tags", icon: "mdi:tag-outline" },
      { label: "Authors", icon: "mdi:account-group-outline" },
      { label: "Comments", icon: "mdi:comment-outline" },
      { label: "Media", icon: "mdi:image-multiple-outline" },
      { label: "Calendar", icon: "mdi:calendar-month-outline" },
    ],
  },
  {
    title: "General",
    items: [
      { label: "Settings", icon: "mdi:cog-outline" },
      { label: "Help Center", icon: "mdi:help-circle-outline" },
      { label: "Log Out", icon: "mdi:logout" },
    ],
  },
];

export const statsCards = [
  { title: "Articles", value: "2.5k", change: "+8.5% this week", icon: "mdi:file-document-outline" },
  { title: "Avg. Read Time", value: "07:42", change: "+3.8% weekly avg", icon: "mdi:clock-outline" },
  { title: "Monthly Views", value: "340k", change: "+10% views monthly", icon: "mdi:eye-outline" },
  { title: "Published", value: "910", change: "+6.1% completions", icon: "mdi:check-circle-outline" },
];

export const revenueBars = [620, 430, 540, 470, 510, 450, 495, 530, 590, 625, 520, 560];

export const earningsRows = [
  { date: "Mar 01", contentCount: 14, type: "News", earning: "95,013" },
  { date: "Mar 02", contentCount: 10, type: "Tutorial", earning: "88,320" },
  { date: "Mar 03", contentCount: 8, type: "Blog", earning: "72,084" },
  { date: "Mar 04", contentCount: 16, type: "Course", earning: "99,301" },
  { date: "Mar 05", contentCount: 11, type: "News", earning: "81,552" },
];

export const popularArticles = [
  { title: "Getting Started with AI Agents", id: "A-1001", price: "$20", status: "Live" },
  { title: "Modern React Patterns in 2026", id: "A-1002", price: "$25", status: "Draft" },
  { title: "Web Security Checklist for Teams", id: "A-1003", price: "$26", status: "Live" },
  { title: "Building Editor.js Workflows", id: "A-1004", price: "$30", status: "Review" },
];
