import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { formatDistanceToNow, parseISO } from "date-fns";

import { useAppDispatch } from "../../app/store";
import { selectAllUsers } from "../users/usersSlice";
import { allNotificationsRead, selectAllNotifications } from "./notificationsSlice";
import classnames from "classnames";

export const NotificationsList = () => {
    const dispatch = useAppDispatch();
    const notifications = useSelector(selectAllNotifications);
    const users = useSelector(selectAllUsers);

    useEffect(() => {
        dispatch(allNotificationsRead())
    })

    const renderedNotifications = notifications.map(notification => {
        const date = parseISO(notification.date);
        const timeAgo = formatDistanceToNow(date);
        const user = users.find(user => user.id === notification.user) || {
            name: 'Unkown User'
        };

        const notificationClassName = classnames('notification', {
            new: notification.isNew
        });

        return (
            <div key={notification.id} className={notificationClassName}>
                <div>
                    <b>{user.name}</b> {notification.message}
                </div>
                <div title={notification.date}>
                    <i>{timeAgo} ago</i>
                </div>
            </div>
        )
    });

    return (
        <section className="notificationList">
            <h2>Notifications</h2>
            <ul>{renderedNotifications}</ul>
        </section>
    );

}