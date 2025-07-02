import React from "react";

const NotificationBadge = ({ unreadCount }) => {
  return (
    <div className="notificationBadgeWrapper relative">
      {unreadCount > 0 && (
        <button className="notificationBadge bg-red-600 py-1 px-2.5 rounded-full absolute right-0 z-50 bottom-10">
          <p className="text-xs text-white">{unreadCount}</p>
        </button>
      )}
    </div>
  );
};

export default NotificationBadge;
