import React, { useEffect } from 'react'
import './newUser.css'
import { Link } from 'react-router-dom'
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle, doSignOut } from '../firebase/auth'
import { useAuth } from '../contexts/authContext'
import { useState } from 'react'
import { auth } from '../firebase/firebase'
import 'boxicons'


function NewUser() {
    const [errorMessage, setErrorMessage] = useState("")
    async function createNewEmailAccount() {
        let email = document.getElementById("email-field").value
        let password;
        if (!window.localStorage.getItem("Token")) {
            password = document.getElementById("password-field").value
        }
        let username = document.getElementById("username-field").value
        if (!(email && password && username) && !(email && username &&window.localStorage.getItem("Token"))) {
            setErrorMessage("One or more fields missing.")
            console.warn("One of more fields missing")
            return {success: false}
        }
        else {
            setErrorMessage("")
        }
        const usernameExists = async (username) => {
            const result = await fetch(`https://mt7lf7z7vvnq3xhsfdko3pusmy0wtrqb.lambda-url.us-east-1.on.aws/account/check/username?username=${username}`)
            return result.json().then(json => {
                return json.exists
            })
        }
        const emailExists = async (email) => {
            const result = await fetch(`https://mt7lf7z7vvnq3xhsfdko3pusmy0wtrqb.lambda-url.us-east-1.on.aws/account/check/email?email=${email}`)
            return result.json().then(json => {
                return json.exists
            })
        }

        if (await usernameExists(username)) {
            setErrorMessage("Username already taken!")
            console.warn("Username already exists")
            return {success: false}
        }
        else if (await emailExists(email)) {
            setErrorMessage("Email already registered!")
            console.warn("Password already exists")
            return {success: false}
        }

        window.localStorage.setItem("Username", username)

        const addAccountToDatabase = async (email, username) => {
            return await fetch(`https://mt7lf7z7vvnq3xhsfdko3pusmy0wtrqb.lambda-url.us-east-1.on.aws/account/create`, {
                method: "POST",
                body: JSON.stringify({
                    "username": username,
                    "email": email,
                    "uid": window.localStorage.getItem("UserUID")
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(async (response) => {
                response = await response.json()
                if (response.success) {
                    return {success: true}
                }
                else {
                    console.log(response)
                    setErrorMessage("Error signing up. Please try again.")
                    return {success: false}
                }
            }).catch((error) => {
                console.log(error)
                return {success: false}
            })
        }

        if (password) {
            await doCreateUserWithEmailAndPassword(email, password).catch(() => {
                console.log("error")
                return {success: false}
            })
        }
        else {
            await addAccountToDatabase(email, username)
            window.location.href = "/home"
        }

        
    }

    return (
            <div className="signup-container">
                <h1>Sign Up</h1>
                <LoginField name={"Email"} inputID={"email-field"} placeholder={window.localStorage.getItem("Email")} disabled={Boolean(window.localStorage.getItem("Email"))} />
                <LoginField name={"Username"} inputID={"username-field"} />
                {!window.localStorage.getItem("Token") ? 
                    <LoginField name={"Password"} inputID={"password-field"} type={"password"}/>
                    : null
                }
                <button className="signup-button" onClick={createNewEmailAccount}>Sign Up</button>
                {!window.localStorage.getItem("Email") ?
                    <button className='google-sign-in-button' onClick={doSignInWithGoogle}>
                        <box-icon type="logo" name="google" />
                        Sign Up With Google
                    </button>
                    : null
                }
                <p>{errorMessage}</p>
            </div>
            );
}

function LoginField({ name, inputID, placeholder, disabled, type="text" }) {
    return (
        <div className="signup-field-container">
            <h2>{name}:</h2>
            <input type={type} className="signup-field" id={inputID} defaultValue={placeholder} disabled={Boolean(disabled)}></input>
        </div>
    )
}

export default NewUser