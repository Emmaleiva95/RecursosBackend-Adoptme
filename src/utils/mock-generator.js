import { fakerDE as faker } from '@faker-js/faker';
import userModel from '../dao/models/User.js';
import petModel from '../dao/models/Pet.js';
import bcrypt from 'bcrypt';

export const createHash = async(password) =>{
    const salts = await bcrypt.genSalt(10);
    return bcrypt.hash(password,salts);
}
export const generateUsersDB = async (quantity) => {
    const roleType = ['admin', 'user'];
    const users = []
    for (let i = 1; i <= quantity; i++) {
        let user = {
            first_name: faker.person.firstName(),
            last_name:faker.person.lastName(),
            email:faker.internet.email(),
            age: faker.number.int({ min: 20, max: 80 }),
            password: await createHash('coder123'),
            role: faker.helpers.arrayElement(roleType),
            pets: []
        }
        const newUser = new userModel(user)
        users.push(newUser)
    }
    try {
        const generatedUsers = await userModel.insertMany(users)
        return generatedUsers
    } catch(e) {
        console.log('unable to generate users', e)
        return null
    }
}

export const generatePetsDB = async (quantity) => {
    const pets = []
    const species = ['dog', 'cat'];
    for (let i = 1; i <= quantity; i++) {
        let pet = {
            id : faker.database.mongodbObjectId(),
            owner: null,
            adopted: false,
            name: faker.person.lastName(),
            specie: faker.helpers.arrayElement(species),
        };
        
        const newPet = new petModel(pet);
        pets.push(newPet)
    }
    try {
        const generatedPets = petModel.insertMany(pets);
        return generatedPets
    } catch (e) {
        console.log('unable to generate pets', e)
        return null;
    }
}