import React, { useState, createContext } from 'react';
import { clone } from 'ramda';
import uuid from 'react-uuid';

export const NotificationContext = createContext();

const NotificationProvider = (props) => {
  const [notifications, setNotifications] = useState({});

  const addNotification = (type, heading, description) => {
    const id = uuid();
    const newNotification = { id, type, heading, description };
    setNotifications((n) => ({ ...n, [id]: newNotification }));
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications((n) => {
      let tmpObj = clone(n);
      delete tmpObj[id];
      return tmpObj;
    });
  };
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
      }}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
