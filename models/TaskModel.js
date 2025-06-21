import { DataTypes } from "sequelize";
import { sequelize } from "../db/conexion.js";
import { UserModel } from "./UserModel.js";
import { CategoryModel } from "./CategoryModel.js"; 
import { LocationModel } from "./LocationModel.js";

export const TaskModel = sequelize.define("tasks", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pendiente", "en curso", "finalizado"),
    defaultValue: "pendiente",
  },
  priority: {
    type: DataTypes.ENUM("baja", "media", "alta"),
    defaultValue: "media",
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  location_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true,
});

// Relaciones
UserModel.hasMany(TaskModel, { foreignKey: "user_id" });
TaskModel.belongsTo(UserModel, { foreignKey: "user_id" });

CategoryModel.hasMany(TaskModel, { foreignKey: "category_id" });
TaskModel.belongsTo(CategoryModel, { foreignKey: "category_id" });

LocationModel.hasMany(TaskModel, { foreignKey: "location_id" });
TaskModel.belongsTo(LocationModel, { foreignKey: "location_id" });
