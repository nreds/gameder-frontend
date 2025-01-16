import React, { useState, useEffect } from "react"
import moment from 'moment'
import './multiplayer.css'

function Multiplayer({ ws, setWs, dataStream }) {
    const [chatlog, setChatlog] = useState([])

    const [roomCode, setRoomCode] = useState("")

    const colorCodes = {
        user: "white",
        select: "#76d689",
        deselect: "yellow",
        join: "#17bd0b",
        leave: "#fa5555",
        create_room: "#15b8f5",
        filtering: "#b67af0",
        match: "#d954eb"
    }

    function createRoom() {
        document.getElementById("join-feedback").innerHTML = ""
        let ws = new WebSocket(`https://mt7lf7z7vvnq3xhsfdko3pusmy0wtrqb.lambda-url.us-east-1.on.aws/multiplayer/create-room/${window.localStorage.getItem('Username')}`)
        setWs(ws)
    }

    function joinRoom() {
        document.getElementById("join-feedback").innerHTML = ""
        let checkRoomCode = document.getElementById("room-code").value
        let ws = new WebSocket(`https://mt7lf7z7vvnq3xhsfdko3pusmy0wtrqb.lambda-url.us-east-1.on.aws/multiplayer/join-room?room_code=${checkRoomCode}&username=${window.localStorage.getItem("Username")}`)
        // ws.onerror = function(event) {
        //     console.log("bad")
        //     document.getElementById("join-feedback").innerHTML = "Room code does not exist"
        //     location.reload()
        // }
        ws.onopen = setWs(ws)
    }

    useEffect(() => {
        if (dataStream && dataStream.success == false) {
            document.getElementById("join-feedback").innerHTML = "Room code does not exist"
            setWs(null)
        }

        else if (dataStream && dataStream.success == true) {
            setWs(ws)
        }

        if (!dataStream || dataStream.type != "message") 
            return

        if (chatlog[chatlog.length - 1] && dataStream.content && dataStream.timestamp == chatlog[chatlog.length - 1].timestamp)
            return
        
        setChatlog(prevChatLog => [...prevChatLog, dataStream])
    }, [dataStream])

    return (
        <div className="multiplayer-container">
            <div className="multiplayer-title">
                <h1>Multiplayer</h1>
            </div>
            <div className="content-container">
                {!ws ? 
                    <div className="start-multiplayer-buttons">
                        <button onClick={createRoom}>Create Room</button>
                        <button onClick={joinRoom}>Join Room</button>
                        <input type="text" placeholder="Enter Room Code" id="room-code"></input>
                        
                    </div>
                    :
                    <div className="multiplayer-chat">
                        <div className="chatlog">
                            <ul>
                                {chatlog.map((dataStream, index) => <li key={index}><span style={{color: colorCodes[dataStream.content.event]}}>
                                    [{moment(dataStream.timestamp).format("LT")}] {dataStream.content.message}
                                </span></li>)}
                            </ul>
                        </div>
                        <form className="send-message" onSubmit={(e) => {
                                e.preventDefault()
                                // ws.send(JSON.stringify)
                                let textMessage = document.getElementById("message-text").value
                                // let newMsgList = chatlog.slice()
                                // newMsgList.push(textMessage)
                                // setChatlog(newMsgList)
                                console.log("sending data")
                                ws.send(JSON.stringify({
                                    type: "message", 
                                    event: "user",
                                    username: window.localStorage.getItem("Username"),
                                    content: 
                                        {message: `${window.localStorage.getItem("Username")}: ${textMessage}`}, 
                                    timestamp: Math.floor(Date.now() / 10) * 10}))
                                document.getElementById("message-text").value = ""
                            }}>
                            <input type="text" id="message-text"/>
                            <button className="send-button">Send</button>
                        </form>
                    </div>
                }
                <p id="join-feedback"></p>
            </div>
        </div>
    )
}


export default Multiplayer
