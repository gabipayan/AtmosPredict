
// TODO: Define a City class with name and id properties
import {promises as fs} from 'fs';

class City {
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
};
// TODO: Complete the HistoryService class
class HistoryService {

  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    try {
      const data = await fs.readFile('searchHistory.json', 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    try {
      await fs.writeFile('searchHistory.json', JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error(error);
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities = await this.read();
    return cities.map((city: any) => new City(city.name, city.id));
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async saveCity(city: string) {
    const cities = await this.read();
    const newCity = new City(city, cities.length.toString());
    cities.push(newCity);
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.read();
    const newCities = cities.filter((city: City) => city.id !== id);
    await this.write(newCities);
  }
}

export default new HistoryService();
