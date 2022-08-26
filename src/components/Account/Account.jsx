import React from 'react'
import { Button } from '@mui/material';
import { useUserAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const Account = () => {
    const { user, logOut } = useUserAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/');
            console.log(`${user.email} is logged out`)
        } catch (e) {
            console.log(e.message)
        }
    }

    return (
        <div>
            <Navbar />
            <h1>Account</h1>
            <p>User email: {user && user.email}</p>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    )
}

export default Account