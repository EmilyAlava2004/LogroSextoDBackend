import { DataTypes } from "sequelize";
import { sequelize } from "../db/conexion.js";

export const LocationModel = sequelize.define("locations", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false,
  },
  geofence_radius: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
  },
}, {
  timestamps: false,
});
