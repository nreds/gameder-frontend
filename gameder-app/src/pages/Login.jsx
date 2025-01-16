import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './login.css'
import { doSignInWithEmailAndPassword, doSignInWithGoogle, doSignOut } from '../firebase/auth'
import { useAuth } from '../contexts/authContext'
import { useState } from 'react'
import { auth } from '../firebase/firebase'
import 'boxicons'
import { signInWithEmailAndPassword } from 'firebase/auth'

function LoginPage() {
    useEffect(() => {
        setCurrentUser({token: window.localStorage.getItem("Token"), userUID: window.localStorage.getItem("UserUID"), email: window.localStorage.getItem("Email"), username: window.localStorage.getItem("Username")})
    }, [])

    const [userLoggedIn, setUserLoggedIn] = useState(false)
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [currentUser, setCurrentUser] = useState({token: null, userUID: null, email: null, username: null})

    const onSubmitEmailPass = async (e) => {
        e.preventDefault()
        setIsSigningIn(true)
        let email = document.getElementById("user-field").value
        let pass = document.getElementById("password-field").value
        let resp = await doSignInWithEmailAndPassword(email, pass)
        if (!resp.success) {
            console.log("Error")
            document.getElementById("error-feedback").innerHTML = "Error logging in. Check credentials"
        }
        else {
            let account = await fetch(`https://mt7lf7z7vvnq3xhsfdko3pusmy0wtrqb.lambda-url.us-east-1.on.aws/account/get-account?email=${email}`)
            window.localStorage.setItem("Username", account.account.username)
            window.localStorage.setItem("UserUID", account.account.uid)
            window.location.href = "/home"
        }
        auth.onAuthStateChanged(() => setUserLoggedIn(!userLoggedIn))
    }

    const onSubmitGoogle = async (e) => {
        e.preventDefault()
        setIsSigningIn(true)
        auth.onAuthStateChanged(() => setUserLoggedIn(!userLoggedIn))
    
        await doSignInWithGoogle()

    }

    return (
    <div className="login-container">
        <h1>Login</h1>
        <LoginField name={"Username/Email"} inputID={"user-field"} />
        <LoginField name={"Password"} inputID={"password-field"} type={"password"}/>
        <button className="login-button" onClick={onSubmitEmailPass}>Login</button>
        <button className='google-sign-in-button' onClick={onSubmitGoogle}>
            <box-icon type="logo" name="google" />
            Sign in With Google
        </button>
        <p id="error-feedback"></p>
        <Link to="/new_user">New user? Sign up.</Link>
    </div>
    );
}

function LoginField({ name, inputID, type="text" }) {
    return (
        <div className="login-field-container">
            <h2>{name}:</h2>
            <input type={type} className="login-field" id={inputID}></input>
        </div>
    )
}

export default LoginPage