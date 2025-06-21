import { LocationModel } from "../models/LocationModel.js";

export const getLocations = async (req, res) => {
  try {
    const locations = await LocationModel.findAll();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createLocation = async (req, res) => {
  try {
    const { name, latitude, longitude, geofence_radius } = req.body;
    const location = await LocationModel.create({
      name,
      latitude,
      longitude,
      geofence_radius,
    });
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const location = await LocationModel.findByPk(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });

    await location.update(req.body);
    res.json({ message: "Location updated", location });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const deleted = await LocationModel.destroy({ where: { id: req.params.id } });
    deleted
      ? res.json({ message: "Location deleted" })
      : res.status(404).json({ message: "Location not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
