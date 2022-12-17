import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import qs from 'qs';

const useQueryState = (query) => {
  const location = useLocation();
  const navigate = useNavigate();

  const setQuery = useCallback((value) => {
    console.log('params');
    const existingQueries = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });

    const queryString = qs.stringify(
      { ...existingQueries, [query]: JSON.stringify(value) },
      { skipNulls: true },
    );

    navigate(`${location.pathname}?${queryString}`);
  }, []);

  return [qs.parse(location.search, { ignoreQueryPrefix: true })[query], setQuery];
};

export default useQueryState;
