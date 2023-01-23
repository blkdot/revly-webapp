import React, { useEffect } from 'react';
import { endOfWeek, startOfWeek, subWeeks } from 'date-fns';
import { Outlet, Navigate } from 'react-router-dom';

import { useUserAuth } from '../contexts/AuthContext';
import SpinnerKit from '../kits/spinner/SpinnerKit';
import useDate from '../hooks/useDate';

const ProtectedRoutes = () => {
  const { user } = useUserAuth();
  const { setDate } = useDate();
  const defaultDate = {
    beforePeriod: {
      startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
      endDate: new Date(),
    },
    afterPeriod: {
      startDate: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
      endDate: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
    },
    titleDate: 'current week',
    titleafterPeriod: 'last week',
    typeDate: 'week',
  };
  const clear = () => {
    localStorage.setItem('date', JSON.stringify(defaultDate));
    setDate(defaultDate);
  };
  const checkLeaveTime = () => {
    const leaveTime = JSON.parse(localStorage.getItem('leaveTime'));
    if (new Date(leaveTime).toLocaleDateString() < new Date().toLocaleDateString()) {
      clear();
    } else if (new Date(leaveTime).getHours() <= new Date().getHours() - 3) {
      clear();
    }
  };
  useEffect(() => {
    window.load = checkLeaveTime();
    window.onbeforeunload = (e) => {
      localStorage.setItem('leaveTime', JSON.stringify(new Date()));
      e.target.hidden = true;
      return '';
    };
  }, []);

  if (typeof user === 'boolean' && user) {
    return (
      <div style={{ marginTop: '20rem', marginLeft: '45%' }}>
        <SpinnerKit />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
