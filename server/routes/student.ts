import { Router, Request, Response } from 'express';
import { getAllStudents } from '../db.js';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { phone_number, transaction_id } = req.body;

        if (!phone_number || !transaction_id) {
            res.status(400).json({ error: 'Phone number and Transaction ID are required' });
            return;
        }

        // Get all students (without pagination for login lookup)
        const result = await getAllStudents();
        const allStudents = result.data || result;

        const student = allStudents.find(
            (s: any) => s.phone_number === phone_number && s.transaction_id === transaction_id
        );

        if (student) {
            res.json({ success: true, student });
        } else {
            res.status(401).json({ error: 'Invalid credentials or student not found' });
        }
    } catch (err) {
        console.error('Student login error:', err);
        res.status(500).json({ error: 'Failed to authenticate student' });
    }
});

export default router;
