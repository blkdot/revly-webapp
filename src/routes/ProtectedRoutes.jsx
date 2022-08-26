import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUserAuth } from '../contexts/AuthContext';

export const ProtectedRoutes = ({ children }) => {
    const { user } = useUserAuth()
    return (
        user !== undefined ? <Outlet /> : <Navigate to='/' />
    )
}