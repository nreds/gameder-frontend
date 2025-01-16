import React from 'react'
import './explore.css'
import FilterBar from '../components/Filterbar'
import { useEffect, useState } from 'react'
import Multiplayer from '../components/Multiplayer'

var platformShortHand = {
    "PC (Microsoft Windows)": "PC",
    "PlayStation 4": "PS4",
    "PlayStation 3": "PS3",
    "PlayStation 5": "PS5",
    "Xbox One": "Xbox One",
    "Xbox Series X|S": "Xbox Series X|S",
    "Nintendo Switch": "Switch",
    "Mac": "Mac"

}

function Explore() {
    if (!window.localStorage.getItem("UserUID") || !window.localStorage.getItem("Username")) {
        window.location.href = "/Login"
    }
    const [gamesList, setGamesList] = useState([])
    const [currentGameIndex, setCurrentGameIndex] = useState(0)
    const [ws, setWs] = useState(null)
    const [dataStream, setDataStream] = useState(null)
    const [matches, setMatches] = useState([])
    const [matchedIndex, setMatchedIndex] = useState(null)
    
    if (ws) {
        ws.onmessage = (e) => setDataStream(JSON.parse(e.data))
    }

    useEffect(() => {
        console.log(dataStream)
        if (dataStream != null && dataStream.content && dataStream.content.game != null) {
            setMatchedIndex(dataStream.content.game)
            document.querySelector(".match-found").classList.add("match-found-shown")
        }
    }, [dataStream])

    return (
        <div className='site-main'>
            <FilterBar setGamesList={setGamesList} setCurrentGameIndex={setCurrentGameIndex} ws={ws} dataStream={dataStream} />
            <Multiplayer ws={ws} setWs={setWs} dataStream={dataStream} />
            <Tile gamesList={gamesList} currentGameIndex={currentGameIndex} matchedIndex={matchedIndex}/>
            <ChangeGameButtons gamesList={gamesList} setCurrentGameIndex={setCurrentGameIndex} currentGameIndex={currentGameIndex} 
                setGamesList={setGamesList} ws={ws} matches={matches} setMatches={setMatches} setMatchedIndex={setMatchedIndex}/>
            <div className="match-found">
                <h1 className='match-found-heading'>Match Found!</h1>
                <div className="match-found-scroll">
                {matchedIndex != null ?
                    <>
                        <h2>{gamesList[matchedIndex].name}</h2>
                        <img src={gamesList[matchedIndex].img} className='matched-img'></img>
                        <div className='match-info'>
                            <div className="match-player-count match-stats" title='Total Rating Count' style={{cursor: "pointer"}}>
                                <img src="/playerCountIcon.png"/>
                                <p>{gamesList[matchedIndex].total_rating_count}</p>
                            </div>
                            <div className="match-rating match-stats" title='Rating' style={{cursor: "pointer"}}>
                                <img src="/ratingIcon.png"/>
                                <p>{Math.round(gamesList[matchedIndex].rating)}</p>
                            </div>
                            <div className="match-player-count match-stats" title='Available Platforms' style={{cursor: "pointer"}}>
                                <img src="/platformIcon.png" />
                                <p>{gamesList[matchedIndex].platforms
                                    .filter((platform) => (platform["name"] in platformShortHand))
                                    .map((platform) => platformShortHand[platform["name"]]).join(", ")}</p>
                            </div>
                        </div>
                        <p className='match-desc'>{gamesList[matchedIndex].summary}</p>
                        <button onClick={() => {
                            document.querySelector(".match-found").classList.remove("match-found-shown")
                            setMatchedIndex(null)
                        }}>
                            Continue browsing
                        </button>
                    </>
                    :
                    <></>
                }
                </div>
                
                
                
            </div>
        </div>
    )
}

function Tile({ gamesList, currentGameIndex, matchedIndex }) {
    let currentGame = gamesList[currentGameIndex]
    if (matchedIndex) {
        currentGame=gamesList[matchedIndex]
    }
    if (currentGame) {
        return (
            <div className="tile-container">
                <img src={currentGame.img} className='tile-img' ></img>
                <div className="game-info-text">
                    <h1 className='tile-header'>{currentGame.name}</h1>
                    <p className='tile-description'>{currentGame.summary}</p>
                </div>
                
                <div className="info-container player-count" title='Total Rating Count' style={{cursor: "pointer"}}>
                    <img src="/playerCountIcon.png" />
                    <p>{currentGame.total_rating_count}</p>
                </div>
                <div className="info-container rating" title='Rating' style={{cursor: "pointer"}}>
                    <img src="/ratingIcon.png" />
                    {/* <svg style={{fill: `rgb(${game_data.rating*5}, ${game_data.rating*5}, ${game_data.rating*5})`}} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                        viewBox="0 0 473.486 473.486" xml:space="preserve">
                    <polygon points="473.486,182.079 310.615,157.952 235.904,11.23 162.628,158.675 0,184.389 117.584,299.641 91.786,462.257 
                        237.732,386.042 384.416,460.829 357.032,298.473 "/>
                    </svg> */}
                    <p>{Math.round(currentGame.rating)}</p>
                </div>
                {/* <div className="info-container price">
                    <img src="/priceIcon.png" />
                    <p>${currentGame.price}</p>
                </div> */}
                <div className="info-container platform" title='Available Platforms' style={{cursor: "pointer"}}>
                    <img src="/platformIcon.png" />
                    <p>{currentGame.platforms
                        .filter((platform) => (platform["name"] in platformShortHand))
                        .map((platform) => platformShortHand[platform["name"]]).join(", ")}</p>
                </div>
    
            </div>
        )
    }
    else if (!currentGame) {
        return (
            <div className="tile-container">
                    <div className="game-info-text">
                        <h1>Select Filters to Get Started!</h1>
                        <p className='tile-description'>Choose your favorite genres, themes, and platforms!</p>
                    </div>
                    <div className="info-container player-count">
                        <img src="/playerCountIcon.png" />
                        <p></p>
                    </div>
                    <div className="info-container rating">
                        <img src="/ratingIcon.png" />
                        {/* <svg style={{fill: `rgb(${game_data.rating*5}, ${game_data.rating*5}, ${game_data.rating*5})`}} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                            viewBox="0 0 473.486 473.486" xml:space="preserve">
                        <polygon points="473.486,182.079 310.615,157.952 235.904,11.23 162.628,158.675 0,184.389 117.584,299.641 91.786,462.257 
                            237.732,386.042 384.416,460.829 357.032,298.473 "/>
                        </svg> */}
                        <p></p>
                    </div>
                    <div className="info-container price">
                        <img src="/priceIcon.png" />
                        <p></p>
                    </div>
                    <div className="info-container platform">
                        <img src="/platformIcon.png" />
                        <p></p>
                    </div>
        
                </div>
        )
    }
    
}

function ChangeGameButtons({ gamesList, setCurrentGameIndex, currentGameIndex, setGamesList, ws, matches, setMatches, setMatchedIndex }) {
    function dimButton(query) {
        document.querySelector(query).style.color = "gray"
        document.querySelector(query).style.background = "none"
    }
    function highlightButton(query) {
        document.querySelector(query).style.color = "transparent"
        document.querySelector(query).style.background = "linear-gradient(90deg, rgb(152, 135, 210), rgb(103, 103, 239))"
        document.querySelector(query).style.backgroundClip = "text"
    }
    useEffect(() => {
        if (currentGameIndex == 0) {
            document.querySelector(".prev-game-button").style.color = "gray"
        }
    }, [gamesList])

    async function nextGame() {
        if (gamesList.length) {
            highlightButton(".prev-game-button")
        }

        // document.querySelector(".prev-game-button").style.color = "purple"
        if (currentGameIndex >= gamesList.length-2) {
            dimButton(".next-game-button")
            // document.querySelector(".next-game-button").style.color = "gray"
        }

        if (gamesList[currentGameIndex+3] && gamesList[currentGameIndex+3].img == null) {
            let newList = JSON.parse(JSON.stringify(gamesList))
            const fetchImage = async (name) => {
                const result = await fetch(`https://mt7lf7z7vvnq3xhsfdko3pusmy0wtrqb.lambda-url.us-east-1.on.aws/game/get-image?name=${name}`)
                return result.json().then(json => {
                    return json.url
                })
            }
            let url = await fetchImage(newList[currentGameIndex+3].name)
            new Image().src = url
            newList[currentGameIndex+3].img = await fetchImage(newList[currentGameIndex+3].name)

            setGamesList(JSON.parse(JSON.stringify(newList)))
        }

        if (currentGameIndex < gamesList.length-1) {
            setCurrentGameIndex(currentGameIndex+1)
        }
        
        
    }
    async function prevGame() {
        // document.querySelector(".next-game-button").style.color = "purple"
        highlightButton(".next-game-button")
        if (currentGameIndex < 2) {
            // document.querySelector(".prev-game-button").style.color = "gray"
            dimButton(".prev-game-button")
        }
        if (currentGameIndex > 0) {
            setCurrentGameIndex(currentGameIndex-1)
        }
        
    }

    async function matchGame() {
        if (!matches.includes(currentGameIndex)) {
            setMatches(prevMatches => [...prevMatches, currentGameIndex])
        }
        if (ws) {
            ws.send(JSON.stringify({type: "match", username: window.localStorage.getItem("Username"), content: {game: currentGameIndex}}))
        }
        else {
            setMatchedIndex(currentGameIndex)
            document.querySelector(".match-found").classList.add("match-found-shown")
        }
    }

    return (
        <div className="change-game-buttons-container">
            <button className='prev-game-button' onClick={prevGame}>Prev</button>
            <button className='match-game-button' onClick={matchGame}>Match</button>
            <button className='next-game-button' onClick={nextGame}>Next</button>       
        </div>
    )
}

export default Explore