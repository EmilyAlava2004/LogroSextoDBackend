import { DataTypes } from "sequelize";
import { sequelize } from "../db/conexion.js"; 

export const CategoryModel = sequelize.define("categories", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
}, {
  timestamps: false,
});
