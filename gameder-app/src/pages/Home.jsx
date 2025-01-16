import React from 'react'
import { Link } from 'react-router-dom'
import "./home.css"
import { easeIn, easeOut, motion } from 'framer-motion'
import { transform } from 'framer-motion'

function Home() {
    return (
        <>
            <Header />
            <FindGamesDesc />
            <ConnectFriendsDesc />
            <div className="get-started-bottom">
                <StartButton />
            </div>
        </>
    )
}

function Header() {
    return ( 
    <>
        <header className='site-main'>
            <div className='site-banner fade-in'>
                <h1 className='site-banner-title'>Gameder</h1>
                <p className='site-banner-caption'>
                    never get bored of gaming again
                </p>
                <StartButton />
                
            </div>
        </header>
    </>
    )
}

function StartButton() {
    return (
    <div className="get-started-container">
        <Link to="/explore" >
            <button className='get-started-button'>
                Get Started
            </button>
        </Link>
    </div>
    )
}

function FindGamesDesc() {
    return (
    <>
    <motion.div
        initial = {{x: "-50%"}}
        animate = {{x: "0%"}}
        transition = {{
            duration: 1,
            ease: easeOut,
        }}
    >
        <div className="section-desc">
            <div className="section-text left">
                <h2 className='section-subheading left'>
                    Find Fresh Games
                </h2>
                <p className='section-paragraph left'>
                    Sort by your favorite genres and platforms. Swipe left and right to find your next obsession.
                </p>
            </div>
            <img src="/findGamesImage.png" className='section-img right' />
        </div>
    </motion.div>
    
    </>
    )
}

function ConnectFriendsDesc() {
    return (
        <>
        <motion.div
            initial = {{x: "50%"}}
            whileInView = {{x: "0%"}}
            viewport={{ once: true }}
            transition = {{
                duration: 1,
                ease: easeOut,
            }}
        >
            <div className="section-desc">
                <div className="section-text left">
                    <h2 className='section-subheading left'>
                        Connect With Friends
                    </h2>
                    <p className='section-paragraph left'>
                        Connect with friends to swipe together and find your perfect match.
                    </p>
                </div>
                <img src="/connectFriendsImage.png" className='connect-fri-img' />
            </div>
        </motion.div>
        
        </>
    )
}

export default Home