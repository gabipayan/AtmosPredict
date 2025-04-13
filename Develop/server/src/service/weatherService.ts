import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  description: string;
  temp: number;
  humidity: number;
  wind: number;
  icon: string;
  constructor(city: string, date: string, description: string, temp: number, humidity: number, wind: number, icon: string) {
    this.city = city;
    this.date = date;
    this.description = description;
    this.temp = temp;
    this.humidity = humidity;
    this.wind = wind;
    this.icon = icon;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {

  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;
  constructor() {
    this.baseURL = 'https://api.openweathermap.org/';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }
// method to convert kelvin to fahrenheit
  private kelvinToFahrenheit(kelvin: number): number {
    return Number(((kelvin - 273.15) * (9/5) + 32).toFixed(2));
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query);
      // Log the full response to inspect it
      //console.log('Full Response:', response);

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType?.includes('application/json')) {
        // Log and throw an error if not JSON
        const text = await response.text();
        console.error('Error response:', text);
        throw new Error('Failed to fetch valid JSON data');
      }
      const data = await response.json();
    //  console.log('Fetched data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw new Error('Error fetching location data');
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {

    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}geo/1.0/direct?q=${this.cityName}&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${this.apiKey}`;
  }

  private buildForecastQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData[0]);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    return await this.fetchLocationData(query);
  }
  private async fetchForecastData(coordinates: Coordinates) {
    const query = this.buildForecastQuery(coordinates);
    return await this.fetchLocationData(query);
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    // checking if response is defined and has the properties I expect
    if (!response || !response.name || !response.weather || !response.main || !response.wind) {
      throw new Error('Invalid weather data structure');
    }
    const { name } = response;
    const { dt, weather, main, wind } = response;
    const { description, icon } = weather[0];
    const { temp, humidity } = main;
    const { speed } = wind;
    return new Weather(name, dt, description, this.kelvinToFahrenheit(temp), humidity, speed, icon);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(forecastData: any) {
    if (!forecastData || !forecastData.list) {
      throw new Error('Invalid forecast data structure');
    }
   // console.log("Forecast Data:", forecastData);
    // filter out the data for the next 5 days
    const filteredForecast = forecastData.list.filter((forecast: any) => {
      // we have to pass a testing condition inorder to KEEP the record 
      let item = forecast.dt_txt.split(' ')[1];  // ['2023-10-01', '12:00:00']
      if (item === '12:00:00') {
        return item;
      }
    });

    //console.log("Filtered Forecast:", filteredForecast);

    const forecastArray = filteredForecast.map((forecast: any) => {
      const { dt, weather, main } = forecast;
      const { description, icon } = weather[0];
      const {speed} = forecast.wind;
      const { temp, humidity } = main;
      return new Weather(this.cityName, dt, description, this.kelvinToFahrenheit(temp), humidity, speed, icon);
    });
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const forecastData = await this.fetchForecastData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(forecastData);
    return [currentWeather, ...forecastArray];
  }
}

export default new WeatherService();
