import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BackendUrl } from '@/utils/Urls';

const Redirect = () => {
  const { id } = useParams();

  useEffect(() => {
    window.location.href = `${BackendUrl}/${id}`;
  }, [id]);

  return <div>Redirecting you to the original site...</div>;
};

export default Redirect;
