//Controller usuario
import { UserModel } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // ✅ Cambiado para consistencia
import { TOKEN_KEY } from "../config/config.js";

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      attributes: ['id', 'user', 'email', 'numero'],
      where: { state: true }
    });
  
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOneUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      where: { id: req.params.id, state: true }
    });
    
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUsers = async (req, res) => {
  try {
    const { user } = req.body;
    
    if (!user) {
      return res.status(400).json({ message: "user is required" });
    }
    
    const userD = await UserModel.findOne({
      where: { id: req.params.id, state: true }
    });
    
    if (userD) {
      userD.set({ ...userD.dataValues, user: user });
      await userD.save();
      res.status(200).json({ message: "update successful" });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUsersEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }
    
    const oldUser = await UserModel.findOne({ 
      where: { email: email.toLowerCase() } 
    });
    
    if (oldUser && oldUser.id !== parseInt(req.params.id)) {
      return res.status(409).json({ message: "email already exists" });
    }
    
    const userD = await UserModel.findOne({
      where: { id: req.params.id, state: true }
    });
    
    if (userD) {
      userD.set({ ...userD.dataValues, email: email.toLowerCase() });
      await userD.save();
      res.status(200).json({ message: "email updated successfully" });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUsersPassword = async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: "password is required" });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: "password must be at least 6 characters" });
    }
    
    const userD = await UserModel.findOne({ 
      where: { id: req.params.id, state: true } 
    });
    
    if (userD) {
      const encryptedPassword = await bcrypt.hash(password.toString(), 10);
      userD.set({ ...userD.dataValues, password: encryptedPassword });
      await userD.save();
      res.status(200).json({ message: "password updated successfully" });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!(email && password)) {
      return res.status(400).json({ message: "All input is required" });
    }
    
    const user = await UserModel.findOne({
      where: { 
        email: email.toLowerCase(),
        state: true
      }
    });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Validate password
    const isPasswordValid = await bcrypt.compare(password.toString(), user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // If everything is valid, generate a token
    const token = jwt.sign(
      { user_id: user.id, email: user.email }, 
      TOKEN_KEY, 
      { expiresIn: "24h" }
    );
    
    let dataUser = {
      id: user.id,
      user: user.user,
      email: user.email,
      numero: user.numero,
    };
    
    res.status(200).json({ 
      success: true,
      dataUser, 
      token: token,
      message: "Login successful"
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  // En JWT no necesitas hacer nada en el servidor para logout
  // El cliente simplemente elimina el token
  res.status(200).json({ 
    success: true,
    message: "Logout successful" 
  });
};

export const refresh = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }
    
    const payload = jwt.verify(token, TOKEN_KEY);
    
    // Verificar que el usuario aún existe y está activo
    const user = await UserModel.findOne({
      where: { 
        id: payload.user_id,
        state: true 
      }
    });
    
    if (!user) {
      return res.status(401).json({ message: "User not found or inactive" });
    }
    
    // Generar nuevo token
    const newToken = jwt.sign(
      { user_id: user.id, email: user.email }, 
      TOKEN_KEY, 
      { expiresIn: "24h" }
    );
    
    res.status(200).json({ 
      success: true,
      token: newToken,
      message: "Token refreshed successfully"
    });
    
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    
    console.error("Refresh token error:", error);
    res.status(500).json({ error: error.message });
  }
};