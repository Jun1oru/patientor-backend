import express, { Response } from 'express';
import { Diagnosis } from '../types';
import diagnosisService from '../services/diagnosisService';

const router = express.Router();

router.get('/', (_req, res: Response<Diagnosis[]>) => {
  res.send(diagnosisService.getDiagnoses());
});

export default router;
