
import express from 'express';
import cors from "cors";
import { PORT } from './config/config.js';
import  { RouterUsuer } from './router/UserRouter.js';
import { sequelize } from "./db/conexion.js";
import { RouterTask } from './router/TaskRouter.js';
import './models/TaskModel.js';
import "./models/TaskModel.js";
import "./models/CategoryModel.js";
import "./models/LocationModel.js";
import { RouterLocation } from './router/LocationRouter.js';
import { RouterCategory } from './router/CategoryRouter.js';

const _PORT = PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());


app.use('/api', RouterUsuer);
app.use('/api', RouterCategory);
app.use('/api', RouterLocation);
app.use('/api', RouterTask);

app.use(cors({
    origin: 'http://localhost:8100', // o la URL de tu frontend
  credentials: true
}));

const main = async () => {
    try {
        await sequelize.authenticate();
        console.log('Base de datos conectada.');
        await sequelize.sync({ alter: false })
        app.listen(_PORT, () => {
            console.log(`Servidor corriendo en el puerto => ${_PORT}`);
        });
    } catch (error) {
        console.log(`Error ${error}`);
    }
}
main();

