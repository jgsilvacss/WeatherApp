let cityCount = 0;




async function fetchData() {
  try {
    const cityName = document.getElementById("cityName").value.toLowerCase();

    const unsplashResponse = await fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${cityName}&client_id=rP1xiSZ8_-jPZHKfJ4iv4N_y0DVr7GD_LmTmZ9MbLM4`
    );
    const unsplashData = await unsplashResponse.json();
    const photoUrl = unsplashData.results[0].urls.regular;

    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=4fdc892e71154191dfaa95bef6530bce`
    );
    if (!geoResponse.ok) {
      throw new Error("Could not fetch city data");
    }

    const geoData = await geoResponse.json();
    const city = geoData[0];

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=4fdc892e71154191dfaa95bef6530bce`
    );
    if (!weatherResponse.ok) {
      throw new Error("Could not fetch weather data");
    }

    const weatherData = await weatherResponse.json();
    const temperatures = [];

    for (let i = 0; i < 5; i++) {
      const temp = (weatherData.list[i].main.temp - 273.15).toFixed(0);
      temperatures.push(temp);
  
      
    }

    let timestamp = weatherData.list[0].dt;
    const normalDate = new Date(timestamp * 1000);
    const year = normalDate.getFullYear();
    const month = ("0" + (normalDate.getMonth() + 1)).slice(-2);
    const day = ("0" + normalDate.getDate()).slice(-2);
    const formattedDate = `${day}/${month}/${year}`;
    const firstLetter = cityName.charAt(0)
    const firstLetterCap = firstLetter.toUpperCase()
    const remainingLetters = cityName.slice(1)
    const capitalizedCityName = firstLetterCap + remainingLetters

    // Container for both image and chart
    const chartsContainer = document.querySelector(".image-and-chart-container"); 

    // Image section
   
    const imageSection = document.createElement("div");
    imageSection.classList.add("image-section");
    chartsContainer.appendChild(imageSection);

    const imageElement = document.createElement("img");
    imageElement.src = photoUrl;
    imageElement.style.width = "50%"; // Adjust width as needed
    imageSection.appendChild(imageElement);

    // Chart Section
    const chartSection = document.createElement("div");
    chartSection.classList.add("chart-section");
    chartsContainer.appendChild(chartSection);

    const chartContainer = document.createElement("div");
    chartSection.appendChild(chartContainer); 

          const canvas = document.createElement("canvas");
          canvas.id = `chart-${cityName}`;
          canvas.classList.add("chart-canvas");
          canvas.style.opacity = 0.9;
          chartContainer.appendChild(canvas);

          const ctx = canvas.getContext("2d");
          Chart.defaults.font.family = "Tahoma";
          new Chart(ctx, {
            type: "line",
            data: {
              labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
              datasets: [
                {
                    
                    label: `${formattedDate}, ${capitalizedCityName} Temperature`,
                  data: temperatures,
                  backgroundColor: [
                    "rgba(255, 99, 132, 1.7)",
                    "rgba(54, 162, 235, 1.7)",
                    "rgba(255, 206, 86, 1.7)",
                    "rgba(75, 192, 192, 1.7)",
                    "rgba(153, 102, 255, 1.7)",
                  ],
                  borderWidth: 1,
                  borderColor: "black",
                  hoverBackgroundColor: [
                    "rgba(255, 99, 132, 0.4)",
                    "rgba(54, 162, 235, 0.4)",
                    "rgba(255, 206, 86, 0.4)",
                    "rgba(75, 192, 192, 0.4)",
                    "rgba(153, 102, 255, 0.4)",
                  ],
                  
                  hoverBorderWidth: 4,
                },
              ],
            },
            options: {
              maintainAspectRatio: true, 
              aspectRatio: 16 / 9 ,
              plugins:{
                legend:{
                  display: false,
                },
                title:{
                  display: true,
                  color: 'white',
                  text: `${formattedDate}, ${capitalizedCityName} Temperature`
                }
              },
              scales: {
                y: {
                beginAtZero: true,
                grid: {
                color: 'black'
                },
                ticks: {
                  color: 'white', 
                },
              },
              x: {
                grid: {
                color: 'black'
                },
                ticks: {
                  color: 'white', 
                },
              },
              },
              tooltips: {
                enabled : false,
            }
            },
          });

          cityCount++;
          if (cityCount > 2) {
            const firstChart = document.querySelector(".chart-container");
            firstChart.remove();
            cityCount--;
          }
        } catch (error) {
          console.log(error);
        }
      }