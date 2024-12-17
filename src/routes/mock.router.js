import { Router } from 'express';
import { createPets, createUsers } from '../controllers/mock.controller.js';
const router = Router();

router.post('/create-mock-pets',createPets);
router.post('/create-mock-users',createUsers);

export default router;