import { NavLink, Outlet } from 'react-router'

const NAV = [
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/feedback', label: 'Feedback' },
  { to: '/admin/health', label: 'Health' },
]

export function AdminLayout() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col px-4">
      <header className="flex items-center gap-6 border-b border-border py-4">
        <span className="text-body-sm font-semibold text-fg">Admin</span>
        <nav className="flex gap-1">
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'flex min-h-[36px] items-center rounded-lg px-3 text-body-sm transition-colors',
                  isActive
                    ? 'bg-brand-50 font-medium text-brand-600'
                    : 'text-fg-subtle active:text-fg',
                ].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <div className="flex flex-1 flex-col py-6">
        <Outlet />
      </div>
    </div>
  )
}
