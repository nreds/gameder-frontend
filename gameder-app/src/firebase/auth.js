import { auth } from "./firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult, getAdditionalUserInfo } from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            window.localStorage.setItem("Token", userCredential.user.token)
            window.localStorage.setItem("UserUID", userCredential.user.uid)
            window.localStorage.setItem("Email", email)

            const addAccountToDatabase = (email, username) => {
                return fetch(`https://mt7lf7z7vvnq3xhsfdko3pusmy0wtrqb.lambda-url.us-east-1.on.aws/account/create`, {
                    method: "POST",
                    body: JSON.stringify({
                        "username": username,
                        "email": email,
                        "uid": userCredential.user.uid
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
            }
            addAccountToDatabase(email, window.localStorage.getItem("Username"))
            window.location.href = "/home"            
        })
        .catch((error) => {
            console.log(error.code, error.message)
        })
}

export const doSignInWithEmailAndPassword = async (email, pass) => {
    return signInWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
            console.log(userCredential)   
            window.localStorage.setItem("Token", userCredential.user.token)
            window.localStorage.setItem("UserUID", userCredential.user.uid)
            window.localStorage.setItem("Email", email)
            // window.location.href = "/home"
            return {success: true}
        })
        .catch((error) => {
            console.log(error.code, error.message)
            return {success: false}
        })
}

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
        .then(async (result) => {
        console.log("Sign in successful")
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        
        // The signed-in user info.
        const user = result.user;
        window.localStorage.setItem("Token", token)
        window.localStorage.setItem("UserUID", user.uid)
        window.localStorage.setItem("Email", user.email)

        const usernameExistsForGivenEmail = async (email) => {
            const result = await fetch(`https://mt7lf7z7vvnq3xhsfdko3pusmy0wtrqb.lambda-url.us-east-1.on.aws/account/get-account?email=${email}`)
            return result.json().then(json => {
                return json
            })
        }

        let account = await usernameExistsForGivenEmail(user.email)
                
        if (!(account.success)) {
            window.location.href = "/new_user"
            return {success: false}
        }
        else {
            window.localStorage.setItem("Username", account.account.username)
            window.location.href = "/home"
            return {success: true}
        }

        // IdP data available using getAdditionalUserInfo(result)
        
        // ...
        }).catch((error) => {
            // Handle Errors here.
            console.log(error.code, error.message)
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error Signing In")
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
        // result.user
    }

export const doSignOut = () => {
    window.location.href = "/"
    return auth.signOut()
}