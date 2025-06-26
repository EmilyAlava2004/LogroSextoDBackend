import { DataTypes } from 'sequelize';
import { sequelize } from '../db/conexion.js';

export const UserModel = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.STRING(20),
    defaultValue: 'usuario' // opcional: admin, usuario, etc.
  }
}, {
  tableName: 'usuarios', // nombre de la tabla en MySQL
  timestamps: true       // crea createdAt y updatedAt
});