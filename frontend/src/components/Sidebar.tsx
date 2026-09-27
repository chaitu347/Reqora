"use client";

const navItems = [
  { label: "Home", href: "/dashboard", color: "#16A34A", bg: "#DCFCE7" },
  { label: "Workspaces", href: "/dashboard", color: "#2563EB", bg: "#DBEAFE" },
  { label: "Collections", href: "/dashboard", color: "#F97316", bg: "#FFEDD5" },
];

export default function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[#E5E7EB] bg-white">
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#16A34A] via-[#F97316] to-[#2563EB] text-sm font-bold text-white">
          R
        </div>
        <span className="text-lg font-bold text-[#111827]">Reqora</span>
      </div>

      <nav className="flex-1 px-3 py-4">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-[#374151] transition-colors hover:bg-[#F7F8FA]"
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold"
              style={{ backgroundColor: item.bg, color: item.color }}
            >
              {item.label[0]}
            </span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="border-t border-[#E5E7EB] p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-base font-medium text-[#DC2626] transition-colors hover:bg-red-50"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-red-50 text-xs font-bold text-[#DC2626]">
            ↩
          </span>
          Sign out
        </button>
      </div>
    </aside>
  );
}