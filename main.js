`use strict`;
(
    () => {

        const BASE_URL = `https://api.weatherapi.com/v1/current.json?key=`
        const API_KEY = `49766b5882c44ee8a0341421250705`

        window.addEventListener(`load`, async () => {
            let searchedCities = new Set()
            let lastSearchedCity = ``
            const historyPanel = document.getElementById(`historyPanel`)
            historyPanel.style.display = `none`
            const cityInput = document.getElementById(`cityInput`)

            await loadLastSearchedCity()

            document.getElementById(`searchCityBtn`).addEventListener(`click`, async () => {
                const typedCity = cityInput.value.trim()
                if (typedCity) {
                    await fetchAndDisplayWeather(typedCity)
                }
            })

            document.getElementById(`saveLocation`).addEventListener(`click`, () => {
                if (lastSearchedCity) {
                    saveCityToHistory(lastSearchedCity)
                    displaySearchHistory()
                }
            })
            document.getElementById(`showHistoryBtn`).addEventListener(`click`, () => {
                displaySearchHistory()
            })

            document.getElementById(`closeHistory`).addEventListener(`click`, ()=>{
                historyPanel.style.display = `none`
            })

            async function getWeatherData(city) {
                if (!city || city.trim() === ``) throw new Error(`City name is empty`)
                const response = await fetch(`${BASE_URL}${API_KEY}&q=${city}`)
                if (!response.ok) throw new Error(`City not found or API error`)
                return await response.json()
            }

            function displayWeather(data) {
                cityInput.value = ``

                const cityName = document.getElementById(`cityName`)
                const country = document.getElementById(`country`)
                const temp = document.getElementById(`temp`)
                const condition = document.getElementById(`condition`)
                const icon = document.getElementById(`icon`)

                cityName.innerText = data.location.name
                country.innerText = data.location.country
                temp.innerText = `${(data.current.temp_c).toFixed(0)}c`
                condition.innerText = data.current.condition.text
                icon.style.display = `block`
                icon.src = `https:${data.current.condition.icon}`
            }

            function saveCityToHistory(city) {
                city = city.trim()
                searchedCities.add(city)
                const cityArray = [...searchedCities]
                const json = JSON.stringify(cityArray)
                localStorage.setItem(`searchedCities`, json)
            }

            async function loadLastSearchedCity() {
                const json = localStorage.getItem(`searchedCities`)
                if (json) {
                    const cityArray = JSON.parse(json)
                    searchedCities = new Set(cityArray)

                    if (cityArray.length > 0) {
                        const lastCity = cityArray[cityArray.length - 1]
                        try {
                            const data = await getWeatherData(lastCity)
                            displayWeather(data)
                            lastSearchedCity = lastCity
                        } catch (err) {
                            console.log(`Could not load last saved city:`, err.message)
                        }
                    }

                }
            }

            async function fetchAndDisplayWeather(city) {
                try {
                    const data = await getWeatherData(city)
                    displayWeather(data)
                    lastSearchedCity = city
                } catch (err) {
                    console.log(err.message)
                }
            }

            function displaySearchHistory() {
                historyPanel.style.display = `block`
                historyPanel.innerHTML = ''

                const reversedArray = [...searchedCities].reverse()

                for (let item of reversedArray) {
                    const rowDiv = document.createElement('div')
                    rowDiv.innerHTML = `<p>${item}</p><hr>`
                    rowDiv.style.cursor = 'pointer'
                    rowDiv.addEventListener('click', async () => {
                        const data = await getWeatherData(item)
                        displayWeather(data)
                        lastSearchedCity=item
                        }
                    )
                    historyPanel.appendChild(rowDiv)
                }
            }
        })
    }
)()

