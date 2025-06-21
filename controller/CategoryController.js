import { CategoryModel } from "../models/CategoryModel.js";

export const getCategories = async (req, res) => {
  const categories = await CategoryModel.findAll();
  res.json(categories);
};

export const createCategory = async (req, res) => {
  const { name, icon, color } = req.body;
  const category = await CategoryModel.create({ name, icon, color });
  res.status(201).json(category);
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const category = await CategoryModel.findByPk(id);
  if (!category) return res.status(404).json({ message: "No existe la categoría" });

  await category.update(req.body);
  res.json({ message: "Actualizada", category });
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const deleted = await CategoryModel.destroy({ where: { id } });
  deleted
    ? res.json({ message: "Eliminada" })
    : res.status(404).json({ message: "No encontrada" });
};
