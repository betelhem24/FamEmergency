import { Router } from 'express';
import { getPosts, createPost, supportPost, addComment } from '../controllers/postController';

const router = Router();

router.get('/', getPosts);
router.post('/', createPost);
router.post('/:id/support', supportPost);
router.post('/:id/comment', addComment);

export default router;
