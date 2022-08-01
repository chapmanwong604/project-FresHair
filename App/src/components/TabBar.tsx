import React from 'react';
import './TabBar.css';
import { Home, Cut, Settings, CalendarTime, CalendarEvent } from 'tabler-icons-react';
import { routes } from '../routes';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks';

interface TabButton {
  icon: any
  text: string
  href: string
}

const clientTabButtons: TabButton[] = [
  { icon: Home, text: '主頁', href: routes.home },
  { icon: Cut, text: '揾師傅', href: routes.findHairStylists },
  { icon: CalendarEvent, text: '預約詳情', href: routes.bookings },
  { icon: Settings, text: '設定', href: routes.settings },
]

const hairStylistTabButtons: TabButton[] = [
  { icon: Home, text: '主頁', href: routes.home },
  { icon: CalendarTime, text: '更表', href: routes.timeTable },
  { icon: CalendarEvent, text: '預約詳情', href: routes.bookings },
  { icon: Settings, text: '設定', href: routes.settings },
]

const availablePages = [
  routes.home,
  routes.findHairStylists,
  routes.bookings,
  routes.settings,
  routes.timeTable
  // routes.registerClient,
  // routes.registerHairStylist,
  // routes.login
]

// interface TabBarProps {
//   currentHref: string
// }

export default function TabBar() {
  const location = useLocation()
  const { user } = useAppSelector(state => state.user);

  return (
    <footer className={availablePages.includes(location.pathname) ? "TabBar" : "TabBar tab-disabled"} style={{ zIndex: 9999 }}>
      {((user?.role != "stylist") ? clientTabButtons : hairStylistTabButtons).map(tab => (
        <Link key={tab.text} to={tab.href}>
          <button className={tab.href == location.pathname ? 'tab-current' : ''}>
            <div className="tab-icon">
              <tab.icon size={24} strokeWidth={1.5} />
            </div>
            <span className="tab-label">{tab.text}</span>
          </button>
        </Link>
      ))}
    </footer>
  )
}

// export default () => {
//   const location = useLocation()
//   return <TabBar currentHref={location.pathname} />
// }
