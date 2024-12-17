import { generatePetsDB, generateUsersDB } from "../utils/mock-generator.js";

export const createUsers = async(req,res)=> {
    const { quantity } = req.body;
    if(!quantity) return res.status(400).send({status:"error",error:"quantity missing"})
    const result = await generateUsersDB(quantity)
    res.send({status: "success", payload: result})
}

export const createPets = async(req,res)=> {
    const { quantity } = req.body;
    if(!quantity) return res.status(400).send({status:"error",error:"quantity missing"})
    const result = await generatePetsDB(quantity)
    res.send({status: "success", payload: result})
}
