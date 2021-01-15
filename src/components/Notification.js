import React from 'react';
import { Alert } from 'theme-ui';

const Notification = ({ message, msgType }) => {
  return (
    <Alert variant={msgType} mb={3}>
      {message}
    </Alert>
  );
};

export default Notification;
