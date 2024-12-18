import express, { Request, Response, NextFunction } from 'express';
import {
  Patient,
  NonSensitivePatientEntry,
  NewPatientEntry,
  NewEntry,
  Entry,
} from '../types';
import patientService from '../services/patientService';
import { NewPatientSchema, NewEntrySchema } from '../utils';
import { z } from 'zod';

const router = express.Router();

const newPatientParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const newEntryParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMidleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.get('/', (_req, res: Response<NonSensitivePatientEntry[]>) => {
  res.send(patientService.getNonSensitivePatients());
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  res.send(patientService.getPatientById(id));
});

router.post(
  '/',
  newPatientParser,
  (
    req: Request<unknown, unknown, NewPatientEntry>,
    res: Response<Patient>
  ) => {
    const addedEntry = patientService.addPatient(req.body);
    res.json(addedEntry);
  }
);

router.post(
  '/:id/entries',
  newEntryParser,
  (
    req: Request<{ id: string }, unknown, NewEntry>,
    res: Response<Entry>
  ) => {
    const id = req.params.id;
    const addedEntry = patientService.addEntry(id, req.body);
    res.json(addedEntry);
  }
);

router.use(errorMidleware);

export default router;
