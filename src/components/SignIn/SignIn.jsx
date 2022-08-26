import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FormControl, TextField, Button } from '@mui/material';
import { useUserAuth } from '../../contexts/AuthContext';
import GoogleButton from "react-google-button";

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { signIn, googleSignIn } = useUserAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await signIn(email, password)
            navigate('/account');
            console.log(`${email} successfully signed in`);
        } catch(e) {
            console.log(e.message);
            console.log(e.code);
        }
    };

    const handleGoogleSubmit = async (e) => {
        e.preventDefault();
        try{
            await googleSignIn();
            navigate('/account');
        } catch (e) {
            console.log(e.message);
        }
    };

    return (
        <div>
            <h1>Sign in to your account</h1>
            <p>
                Don't have an account yet? <Link to='/signup'> Sign up.</Link>
            </p>
            <FormControl>
            <TextField
                    label="Email address"
                    onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant='contained' onClick={handleSubmit}>Sign In</Button>
            <GoogleButton onClick={handleGoogleSubmit} />
            </FormControl>
        </div>
    )
}

export default SignIn