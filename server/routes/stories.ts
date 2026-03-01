import express from 'express';
import { getSuccessStories, addSuccessStory, updateSuccessStory, deleteSuccessStory } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/stories - Get all success stories (public)
router.get('/', async (req, res) => {
    try {
        const stories = await getSuccessStories();
        res.json(stories);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/stories - Add new success story (admin-protected)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, course, story, avatar } = req.body;

        // Validation
        if (!name || !course || !story) {
            return res.status(400).json({ error: 'Name, course, and story are required' });
        }

        const id = await addSuccessStory({ name, course, story, avatar });
        res.status(201).json({ id, message: 'Success story added successfully' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/stories/:id - Update success story (admin-protected)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const storyId = req.params.id;
        if (!storyId || Array.isArray(storyId)) {
            return res.status(400).json({ error: 'Invalid story ID' });
        }
        const { name, course, story, avatar } = req.body;

        // Validation
        if (!name && !course && !story && avatar === undefined) {
            return res.status(400).json({ error: 'At least one field to update is required' });
        }

        const success = await updateSuccessStory(parseInt(storyId), { name, course, story, avatar });
        if (!success) {
            return res.status(404).json({ error: 'Success story not found' });
        }
        res.json({ message: 'Success story updated successfully' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/stories/:id - Delete success story (admin-protected)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const storyId = req.params.id;
        if (!storyId || Array.isArray(storyId)) {
            return res.status(400).json({ error: 'Invalid story ID' });
        }

        const success = await deleteSuccessStory(parseInt(storyId));
        if (!success) {
            return res.status(404).json({ error: 'Success story not found' });
        }
        res.json({ message: 'Success story deleted successfully' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
