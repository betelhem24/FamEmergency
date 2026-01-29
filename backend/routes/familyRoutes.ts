import express from 'express';
import { addFamilyMember } from '../controllers/family/addController';
import { getFamilyMembers, removeFamilyMember } from '../controllers/family/manageController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

// POST /api/family/add - Search and add family member
router.post('/add', addFamilyMember);

// GET /api/family - Get all family members
router.get('/', getFamilyMembers);

// DELETE /api/family/:memberId - Remove family member
router.delete('/:memberId', removeFamilyMember);

export default router;
