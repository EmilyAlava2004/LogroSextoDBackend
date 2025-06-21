import { TaskModel } from "../models/TaskModel.js";
import { UserModel } from "../models/UserModel.js";
import { CategoryModel } from "../models/CategoryModel.js";
import { LocationModel } from "../models/LocationModel.js";

export const getTasks = async (req, res) => {
  const tasks = await TaskModel.findAll({
    include: [UserModel, CategoryModel, LocationModel],
  });
  res.json(tasks);
};

export const getTaskById = async (req, res) => {
  const task = await TaskModel.findByPk(req.params.id, {
    include: [UserModel, CategoryModel, LocationModel],
  });
  task
    ? res.json(task)
    : res.status(404).json({ message: "Tarea no encontrada" });
};

export const createTask = async (req, res) => {
  const { title, description, date, status, priority, user_id, category_id, location_id } = req.body;
  const task = await TaskModel.create({ title, description, date, status, priority, user_id, category_id, location_id });
  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const task = await TaskModel.findByPk(req.params.id);
  if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

  await task.update(req.body);
  res.json({ message: "Tarea actualizada", task });
};

export const deleteTask = async (req, res) => {
  const deleted = await TaskModel.destroy({ where: { id: req.params.id } });
  deleted
    ? res.json({ message: "Tarea eliminada" })
    : res.status(404).json({ message: "No encontrada" });
};
