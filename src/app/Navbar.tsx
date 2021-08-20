import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchNotifications, selectAllNotifications } from '../features/notifications/notificationsSlice';
import Notification from '../models/Notification';
import { useAppDispatch } from './store';

export const Navbar = () => {
  const dispatch = useAppDispatch();

  const notifications: Notification[] = useSelector(selectAllNotifications);
  const numUnreadNotifications: number = notifications.filter(n => !n.read).length;

  let unreadNotifications;

  if (numUnreadNotifications > 0) {
    unreadNotifications = (
      <span className="badge">{numUnreadNotifications}</span>
    )
  }

  const fetchNewNotifications = () => {
    dispatch(fetchNotifications());
  }

  return (
    <nav>
      <section>
        <h1>Redux</h1>
        <div className="navContent">
          <div className="navLinks">
            <Link to="/">Posts</Link>
            <Link to="/users">Users</Link>
            <Link to="/notifications">Notifications {unreadNotifications}</Link>
          </div>
          <button className="button" onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
        </div>
      </section>
    </nav>
  )
}
