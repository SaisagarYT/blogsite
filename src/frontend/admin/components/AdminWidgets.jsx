import { Icon } from "@iconify/react";
import { earningsRows, popularArticles, revenueBars, statsCards } from "../data/dashboardData";

export const StatGrid = () => (
  <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
    {statsCards.map((item) => (
      <article key={item.title} className="border border-(--bg-primary) bg-(--bg-secondary) rounded-xl p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-(--text-secondary)">{item.title}</p>
          <Icon icon={item.icon} width="18" height="18" className="text-(--text-secondary)" />
        </div>
        <h3 className="mt-1 text-3xl font-semibold">{item.value}</h3>
        <p className="mt-1 text-xs text-green-500">{item.change}</p>
      </article>
    ))}
  </section>
);

export const RevenueStatus = () => (
  <article className="border border-(--bg-primary) bg-(--bg-secondary) rounded-xl p-4 md:p-5">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold">Revenue Status</h3>
      <button className="text-xs border border-(--bg-primary) rounded-md px-2.5 py-1">This year</button>
    </div>
    <div className="mt-4 h-56 md:h-64 flex items-end gap-2 md:gap-3">
      {revenueBars.map((height, index) => (
        <div key={index} className="flex-1 bg-(--bg-background) rounded-md relative overflow-hidden">
          <div
            className="absolute left-0 right-0 bottom-0 rounded-md bg-indigo-500/90"
            style={{ height: `${height / 7}%` }}
          />
        </div>
      ))}
    </div>
    <div className="mt-2 text-[10px] md:text-xs text-(--text-secondary) grid grid-cols-12 gap-1">
      {[
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ].map((month) => (
        <span key={month} className="text-center">{month}</span>
      ))}
    </div>
  </article>
);

export const AudienceOverview = () => (
  <article className="border border-(--bg-primary) bg-(--bg-secondary) rounded-xl p-4 md:p-5">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold">Audience Overview</h3>
      <button className="text-xs border border-(--bg-primary) rounded-md px-2.5 py-1">All</button>
    </div>

    <div className="mt-6 flex items-center justify-center">
      <div
        className="w-44 h-44 rounded-full"
        style={{ background: "conic-gradient(#4f46e5 0 45%, #f97316 45% 72%, #eab308 72% 100%)" }}
      >
        <div className="w-[76%] h-[76%] rounded-full bg-(--bg-secondary) mx-auto mt-[12%] flex flex-col items-center justify-center">
          <p className="text-3xl font-semibold">12M+</p>
          <p className="text-xs text-(--text-secondary)">Total Readers</p>
        </div>
      </div>
    </div>

    <div className="mt-6 flex justify-center gap-5 text-xs">
      <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-indigo-500" />Current</span>
      <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-orange-500" />New</span>
      <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-yellow-500" />Returning</span>
    </div>
  </article>
);

export const EarningsReport = () => (
  <article className="border border-(--bg-primary) bg-(--bg-secondary) rounded-xl p-4 md:p-5 overflow-x-auto">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold">Earnings Reports</h3>
      <button className="text-xs border border-(--bg-primary) rounded-md px-2.5 py-1">Month</button>
    </div>
    <table className="w-full min-w-[480px] text-sm">
      <thead className="text-(--text-secondary)">
        <tr>
          <th className="text-left py-2">Date</th>
          <th className="text-left py-2">Item Count</th>
          <th className="text-left py-2">Type</th>
          <th className="text-left py-2">Earning</th>
        </tr>
      </thead>
      <tbody>
        {earningsRows.map((row) => (
          <tr key={row.date} className="border-t border-(--bg-primary)">
            <td className="py-2">{row.date}</td>
            <td className="py-2">{row.contentCount}</td>
            <td className="py-2 text-orange-500">{row.type}</td>
            <td className="py-2">${row.earning}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </article>
);

export const PopularProducts = () => (
  <article className="border border-(--bg-primary) bg-(--bg-secondary) rounded-xl p-4 md:p-5 overflow-x-auto">
    <h3 className="font-semibold mb-4">Most Popular Content</h3>
    <table className="w-full min-w-[560px] text-sm">
      <thead className="text-(--text-secondary)">
        <tr>
          <th className="text-left py-2">Article Name</th>
          <th className="text-left py-2">ID</th>
          <th className="text-left py-2">Price</th>
          <th className="text-left py-2">Status</th>
          <th className="text-left py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {popularArticles.map((item) => (
          <tr key={item.id} className="border-t border-(--bg-primary)">
            <td className="py-2">{item.title}</td>
            <td className="py-2 text-(--text-secondary)">{item.id}</td>
            <td className="py-2">{item.price}</td>
            <td className="py-2">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  item.status === "Live"
                    ? "bg-green-500/15 text-green-500"
                    : item.status === "Draft"
                      ? "bg-pink-500/15 text-pink-500"
                      : "bg-yellow-500/20 text-yellow-500"
                }`}
              >
                {item.status}
              </span>
            </td>
            <td className="py-2">
              <button className="w-7 h-7 rounded-full border border-(--bg-primary) flex items-center justify-center">
                <Icon icon="mdi:dots-horizontal" width="16" height="16" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </article>
);
