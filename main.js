`use strict`;
(
    () => {

        const BASE_URL = `http://api.weatherapi.com/v1/current.json?key=`
        const API_KEY = `49766b5882c44ee8a0341421250705`

        window.addEventListener(`load`, async () => {
            let searchedCities = new Set()
            let lastSearchedCity = ``

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

            async function getWeatherData(city) {
                if (!city || city.trim() === ``) throw new Error(`City name is empty`)
                const response = await fetch(`${BASE_URL}${API_KEY}&q=${city}`)
                if (!response.ok) throw new Error(`City not found or API error`)
                return await response.json()
            }

            function displayWeather(data) {
                cityInput.value = ``

                const cityNameElem = document.querySelector(`.cityName`)
                const countryElem = document.querySelector(`.country`)
                const tempElem = document.querySelector(`.temp`)
                const conditionElem = document.querySelector(`.condition`)
                const iconElem = document.getElementById(`icon`)

                cityNameElem.innerText = data.location.name
                countryElem.innerText = data.location.country
                tempElem.innerHTML = `${data.current.temp_c} c`
                conditionElem.innerHTML = data.current.condition.text
                iconElem.style.display = `block`
                iconElem.src = `https:${data.current.condition.icon}`
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

                    displaySearchHistory()
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
                console.clear()
                console.log(`Searched cities:`)
                for (const city of searchedCities) {
                    console.log(`•`, city)
                }
            }
        })
    }
)()
//https://github.com/ItzikTempleman/Weather
