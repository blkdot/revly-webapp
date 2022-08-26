import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FormControl, TextField, Button } from '@mui/material';
import { useUserAuth } from '../../contexts/AuthContext';

const SignUp = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { signUp } = useUserAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            await signUp(email, password)
            navigate('/account')
            console.log(`${email} successfully registered as a new user`)
        } catch(e) {
            console.log(e.message)
            console.log(e.code)
        }
    }

    return (
        <div>
            <h1>Sign up to your account</h1>
            <p>
                Already have an account yet? <Link to='/'> Sign in.</Link>
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
                <Button variant='contained' onClick={handleSubmit}> Sign Up</Button>
            </FormControl>
        </div>
    )
}

export default SignUp