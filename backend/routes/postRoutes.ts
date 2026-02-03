import { Router } from 'express';
import { getPosts, createPost, supportPost, addComment, deletePost, deleteComment } from '../controllers/postController';

const router = Router();

router.get('/', getPosts);
router.post('/', createPost);
router.post('/:id/support', supportPost);
router.post('/:id/comment', addComment);
router.delete('/:id', deletePost);
router.delete('/:id/comment/:commentId', deleteComment);

export default router;
