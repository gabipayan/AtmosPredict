import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    // TODO: GET weather data from city name
    const city = req.body.cityName;
    if (!city) {
      res.status(400).send('City not provided');
      return;
    }
    const weatherForCity = await WeatherService.getWeatherForCity(city); // error here
    //console.log(weatherForCity);


    // TODO: save city to search history
    HistoryService.saveCity(city);
    res.json(weatherForCity);
  } catch (error) {
    // Handle error here
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  // TODO: GET search history from history service
  const cities = await HistoryService.getCities();
  res.json(cities);
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  await HistoryService.removeCity(id);
  res.send('City removed from history');
});

export default router;
