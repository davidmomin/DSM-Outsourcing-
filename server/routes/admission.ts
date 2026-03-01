import { Router, Request, Response } from 'express';
import { addAdmission } from '../db.js';

const router = Router();

router.post('/admission', async (req: Request, res: Response) => {
  try {
    const { student_name, phone_number, email, course_name, transaction_id, notes } = req.body;

    if (!student_name || !phone_number || !course_name || !transaction_id) {
      res.status(400).json({ error: 'Required fields: name, phone, course, transaction_id' });
      return;
    }

    const result = await addAdmission({
      student_name,
      phone_number,
      email,
      course_name,
      transaction_id,
      notes
    });

    res.status(201).json({
      success: true,
      id: result.id,
      message: 'Admission recorded successfully! Welcome to DSM Outsourcing.'
    });
  } catch (err: any) {
    console.error('Admission error:', err);
    res.status(500).json({ error: 'Failed to process admission' });
  }
});

export default router;
