import React from 'react'
import './filterbar.css'
import { useEffect } from 'react'

function FilterBar({ setGamesList, setCurrentGameIndex, ws, dataStream }) {
    var temp = {
        type: "checkbox",
        username: "str",
        content: {
            value: true,
            id: "filter"
        }
    }

    if (ws) {
        let checkboxes = document.querySelectorAll(".filter-checkbox")
        checkboxes = Array.from(checkboxes)
        checkboxes.map((checkbox) => {
            checkbox.addEventListener("change", () => {
                ws.send(JSON.stringify({
                    type: "checkbox",
                    username: window.localStorage.getItem("Username"),
                    content: {
                        value: checkbox.checked,
                        id: checkbox.id
                    },
                    timestamp: Math.floor(Date.now() / 10) * 10
                }))
                ws.send(JSON.stringify({
                    type: "message",
                    username: window.localStorage.getItem("Username"),
                    content: {
                        message: `${window.localStorage.getItem("Username")} ${checkbox.checked ? 'selected' : 'deselected'} ${checkbox.id}`,
                        event: checkbox.checked ? "select" : "deselect"
                    },
                    timestamp: Math.floor(Date.now() / 10) * 10
                }))
            })
        })
        let ratingSlider = Array.from(document.querySelectorAll(".slider"))
        ratingSlider.map((slider) => {
            slider.addEventListener("change", () => {
                ws.send(JSON.stringify({
                    type: "slider",
                    username: window.localStorage.getItem("Username"),
                    content: {
                        value: slider.value,
                        id: slider.id
                    },
                    timestamp: Math.floor(Date.now() / 10) * 10
                }))
                ws.send(JSON.stringify({
                    type: "message",
                    username: window.localStorage.getItem("Username"),
                    content:
                        { message: `${window.localStorage.getItem("Username")} set ${slider.id} to ${slider.value}`, event: "select" },
                    timestamp: Math.floor(Date.now() / 10) * 10
                }))
            })
        })
    }

    useEffect(() => {
        if (dataStream && dataStream.type == "checkbox") {
            document.getElementById(dataStream.content.id).checked = dataStream.content.value
        }

        if (dataStream && dataStream.type == "slider") {
            document.getElementById(dataStream.content.id).value = dataStream.content.value
        }
        if (dataStream && dataStream.type == "filter") {
            setTimeout(() => { getGames() }, 500)
            // getGames()
        }
        if (dataStream && dataStream.type == "togglemenu") {
            toggleMenu()
        }
        if (dataStream && dataStream.type == "joinData") {
            console.log(dataStream.content)
            dataStream.content.checkboxList.map((id) => document.getElementById(id).checked = true)
            Object.keys(dataStream.content.sliderList).map((id) => document.getElementById(id).value = dataStream.content.sliderList[id])
        }
    }, [dataStream])

    function toggleMenu() {
        document.querySelector(".filter-menu").classList.toggle("closemenu")
        document.querySelectorAll(".filter-category").forEach((element) => { element.classList.toggle("hidden") })
        document.querySelector(".filter-button").classList.toggle("hidden")
    }



    function getGameFilterString(filter) {
        let filterstr = document.querySelectorAll("." + filter)
        return Array.from(filterstr).filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.id).join()
    }
    function getGames() {
        let platforms = getGameFilterString("Platforms")
        let genres = getGameFilterString("Genres")
        let themes = getGameFilterString("Themes")
        // let price = document.querySelector(".Price").value
        let rating = document.querySelector(".Ratings").value
        console.log(rating)

        const fetchImage = async (name) => {
            const result = await fetch(`https://mt7lf7z7vvnq3xhsfdko3pusmy0wtrqb.lambda-url.us-east-1.on.aws/game/get-image?name=${name}`)
            return result.json().then(json => {
                return json.url
            })
        }

        const fetchData = async () => {
            const result = await fetch(`https://mt7lf7z7vvnq3xhsfdko3pusmy0wtrqb.lambda-url.us-east-1.on.aws/game/query-games?platforms=` + platforms + "&genres=" + genres + "&themes=" + themes + "&rating=" + rating)
            result.json().then(async (json) => {
                if (json.length == 0) {
                    setGamesList([{
                        id: -1,
                        genres: [{
                            id: -1,
                            name: "none"
                        }],
                        name: "No Results Found!",
                        platforms: [{
                            id: -1,
                            name: "none"
                        }],
                        rating: 0,
                        summary: "Your search returned no results. Try changing the filters!",
                        total_rating_count: 0
                    }])
                    return
                }
                for (let i = 0; i < Math.min(4, json.length); i++) {
                    json[i].img = await fetchImage(json[i].name)
                }

                setGamesList(json)
                setCurrentGameIndex(0)

            })
        }
        fetchData();
        if (!document.querySelector(".filter-menu").classList.contains("closemenu")) {
            document.querySelector(".filter-menu").classList.toggle("closemenu")
            document.querySelectorAll(".filter-category").forEach((element) => { element.classList.toggle("hidden") })
            document.querySelector(".filter-button").classList.toggle("hidden")
        }
    }

    function broadcastMatching() {
        ws.send(JSON.stringify({
            type: "filter",
            username: window.localStorage.getItem("Username"),
            content: {
                value: true
            },
            timestamp: Math.round(Math.floor(Date.now() / 10) * 10)
        }))
        ws.send(JSON.stringify({
            type: "message",
            username: window.localStorage.getItem("Username"),
            content: {
                message: `${window.localStorage.getItem("Username")} started matching!`,
                event: "filtering"
            },
            timestamp: Math.round(Math.floor(Date.now() / 10) * 10)
        }))
    }

    return (
        <>
            <div className="filter-menu">
                <div className="menu-icon-title">
                    <MenuIcon ws={ws} />
                    <h1>Filters</h1>
                </div>
                <div className="filter-categories">
                    <div className="filter-left-column">
                        <FilterCategory name={"Platforms"} filters=
                            {["PC", "Xbox X|S", "Xbox One", "Switch", "PS4", "PS3", "Mac"]} />
                        <FilterCategory name={"Genres"} filters=
                            {["Fighting", "Shooter", "Platformer", "Rhythm", "Puzzle", "Racing",
                                "RPG", "Sports", "Strategy", "Adventure", "Indie", "MOBA"]} />
                    </div>
                    <div className="filter-right-column">
                        {/* <FilterCategory type={"slider"} name={"Price"} filters={["$0", "$99"]} /> */}
                        <FilterCategory type={"slider"} name={"Ratings"} filters={["0", "100"]} />
                        <FilterCategory name={"Themes"} filters=
                            {["Action", "Fantasy", "Sci-Fi", "Horror", "Thriller", "Survival", "Historical",
                                "Comedy", "Business", "Drama", "Sandbox", "Educational", "Kids", "Open world",
                                "Party", "Mystery", "Warfare", "Non-fiction"]} />
                    </div>
                </div>
                <div className="filter-button-container">
                    <button className='filter-button' onClick={ws ? broadcastMatching : getGames}>
                        Filter
                    </button>
                </div>

            </div>

        </>
    )
}

function MenuIcon({ ws }) {
    function toggleMenu() {
        document.querySelector(".filter-menu").classList.toggle("closemenu")
        document.querySelectorAll(".filter-category").forEach((element) => { element.classList.toggle("hidden") })
        document.querySelector(".filter-button").classList.toggle("hidden")
    }
    function broadcastToggleMenu() {
        ws.send(JSON.stringify({
            type: "togglemenu",
            username: window.localStorage.getItem("Username"),
            content: {
                value: true
            },
            timestamp: Math.floor(Date.now() / 10) * 10
        }))
    }
    return (
        <>
            <button className="menu-icon-container" onClick={toggleMenu}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </button>
        </>
    )
}

function FilterCategory({ name, filters, type = "list" }) {
    if (type == "slider") {
        return (
            <div className='filter-category'>
                <h2>{name}</h2>
                <form className='filter-range'>
                    <label style={{ fontSize: '2rem' }}>{filters[0]}</label>
                    <input type="range" className={`${name} slider`} min={filters[0]} max={filters[1]} id={name} style={{
                        width: '100%',
                        marginLeft: '0.5vw',
                        marginRight: '0.5vw'
                    }} />
                    <label style={{ fontSize: '2rem' }}>{filters[1]}</label>
                </form>
            </div>
        )
    }

    return (
        <div className="filter-category">
            <h2>{name}</h2>
            <form className='filter-list'>
                {filters.map(filter =>
                    <div className='filter-checkbox-form' key={filter + "input"}>
                        <input type='checkbox' className={`${name} filter-checkbox`} id={filter} key={filter + "box"}></input>
                        <label htmlFor={filter} key={filter + "label"} style={{ fontSize: '2rem' }}>  {filter}</label>
                    </div>
                )}
            </form>
        </div>
    )
}

export default FilterBar