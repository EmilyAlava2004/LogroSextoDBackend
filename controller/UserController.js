//Controller usuario
import { UserModel } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { TOKEN_KEY } from "../config/config.js";

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      attributes: ['id', 'user', 'email', 'numero' ]
    },{where: {state:true}});
  
    res.status(200).json({users});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getOneUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({where:{id:req.params.id}});
    if(!user){
      res.status(404).json({message: "user not found"});
    }
    res.status(200).json({user});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const updateUsers = async (req, res) => {
  const { user } = req.body;
  if (!(user)) {
    res.status(400).json({ message: "user is required" });
  }
  const userD = await UserModel.findOne({where:{id:req.params.id}});
  if(userD){
    userD.set({...userD,user:user});
      await userD.save();
      res.status(200).json({ message: "update" });
  }else{
      res.status(404).json({message: "user not found"});
  }
};
export const updateUsersEmail = async (req, res) => {
  const { email } = req.body;
  if (!(email)) {
    res.status(400).json({ message: "email is required" });
  }
  const oldUser = await UserModel.findOne({ where: { email: email } });
  if (oldUser) {
    return res.status(409).json("email already exist");
  }
  const userD = await UserModel.findOne({where:{id:req.params.id}});
  if(userD){
    userD.set({...userD,email:email});
      await userD.save();
      res.status(200).json({ message: "update" });
  }else{
      res.status(404).json({message: "user not found"});
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
    
    const userD = await UserModel.findOne({ where: { id: req.params.id } });
    if (userD) {
      // ✅ CORRECCIÓN: Encriptar la nueva contraseña
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

// export const deleteUsers = async (req, res) => {
//   const user = await UserModel.findOne({ where: { id: req.params.id } });
//   if (user) {
//     user.set({ ...user, state: false });
//     await user.save();
//     res.status(200).json({ message: "delete" });
//   } else {
//     res.status(404).json({ message: "type not found" });
//   }
// };

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).json({message:"All input is required"});
    }
    const user = await UserModel.findOne({
      where: { email: email.toLowerCase(),state: true // ✅ Solo usuarios activos
    },
    });
     // Check if user exists
     if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
   // If everything is valid, generate a token
    const token = jwt.sign({ user_id: user.id, email }, TOKEN_KEY, {
      expiresIn: "1h",
    });
      let dataUser={
          id:user.id,
          user:user.user,
          email:user.email,
          numero: user.numero,
      }
      res.status(200).json({ 
      success: true, // ✅ Agregar flag de éxito
      dataUser, 
      token: token,
      message: "Login successful"
    });
  } catch (err) {
    console.error("Login:", err.message );
    res.status(500).json({ error: err.message });
  }
};
export const logout = async (req, res)=>{

}
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