import React, { useState } from 'react';
import { request } from '../utils/request';

export default () => {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const onHandle = async (params, callback) => {
    setError(false);
    setLoading(true);
    try {
      const response = await request({ showMessage: true, ...params });
      if (callback) callback(response);
      return response;
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return { isLoading, isError, onHandle };
};
