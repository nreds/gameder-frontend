import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './navbar.css'

function Navbar() {
    function signOut() {
        window.localStorage.removeItem("UserUID")
        window.localStorage.removeItem("Token")
        window.localStorage.removeItem("Email")
        window.localStorage.removeItem("Username")
        
        window.location.href = "/home"
    }

    return (
        <nav className="site-nav">
            <div className="site-nav-left">
                <Link aria-current="page" className="site-nav-item" to="/" >
                    <img className="site-logo" src="/logo.png" alt="Gameder" />
                </Link>
                <Link className="site-nav-item" to="/explore">Explore</Link>
                <Link className="site-nav-item" to="/author/ghost/">Author</Link>
                <Link className="site-nav-item" to="https://ghost.org/docs/" target="_blank" rel="noopener noreferrer">Help</Link>
            </div>
            <div className="site-nav-right">
                {!window.localStorage.getItem("Username") ? <Link className="site-nav-button" to="/login">Register / Login</Link> : 
                    <Link className="site-nav-button" onClick={signOut}>Sign Out</Link>
                }
            </div>
        </nav>
    )
}

export default Navbar