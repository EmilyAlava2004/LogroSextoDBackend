import express from 'express';
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation
} from '../controller/LocationController.js';

const router = express.Router();

router.get('/locations', getLocations);
router.post('/locations', createLocation);
router.put('/locations/:id', updateLocation);
router.delete('/locations/:id', deleteLocation);

export const RouterLocation = router;
