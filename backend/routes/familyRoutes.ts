import express from 'express';
import { addFamilyMember, searchUsers } from '../controllers/family/addController';
import { getFamilyMembers, removeFamilyMember, getFamilyByUser } from '../controllers/family/manageController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

// GET /api/family/search - Search for users to add
router.get('/search', searchUsers);

// POST /api/family/add - Search and add family member
router.post('/add', addFamilyMember);

// GET /api/family - Get all family members
router.get('/', getFamilyMembers);

// GET /api/family/user/:userId - Get family members of a specific user (for Doctors)
router.get('/user/:userId', getFamilyByUser);

// DELETE /api/family/:memberId - Remove family member
router.delete('/:memberId', removeFamilyMember);

export default router;
