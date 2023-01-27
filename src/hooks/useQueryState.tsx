import qs from 'qs';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useQueryState = (query) => {
  const location = useLocation();
  const navigate = useNavigate();

  const setQuery = useCallback(
    (value) => {
      const existingQueries = qs.parse(location.search, {
        ignoreQueryPrefix: true,
      });

      const queryString = qs.stringify(
        { ...existingQueries, [query]: JSON.stringify(value) },
        { skipNulls: true }
      );

      navigate(`${location.pathname}?${queryString}`);
    },
    [query, JSON.stringify(location)]
  );

  return [qs.parse(location.search, { ignoreQueryPrefix: true })[query], setQuery];
};

export default useQueryState;
