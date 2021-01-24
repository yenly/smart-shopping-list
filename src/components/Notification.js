import React from 'react';
import { Alert } from 'theme-ui';
import PropTypes from 'prop-types';

const Notification = ({ message, msgType }) => {
  return (
    <Alert variant={msgType} mb={3}>
      {message}
    </Alert>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  msgType: PropTypes.string.isRequired,
};

export default Notification;
