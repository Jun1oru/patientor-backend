import {
  NewPatientEntry,
  NewEntry,
  Gender,
  Diagnosis,
  HealthCheckRating,
  SickLeave,
  Discharge,
} from './types';
import { z } from 'zod';

const BaseEntrySchema = z.object({
  id: z.string(),
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  diagnosisCodes: z
    .array(z.string() as z.ZodType<Diagnosis['code']>)
    .optional(),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

const SickLeaveSchema: z.ZodType<SickLeave> = z.object({
  startDate: z.string(),
  endDate: z.string(),
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: SickLeaveSchema.optional(),
});

const DischargeSchema: z.ZodType<Discharge> = z.object({
  date: z.string(),
  criteria: z.string(),
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: DischargeSchema.optional(),
});

const EntrySchema = z.union([
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
  HealthCheckEntrySchema,
]);

export const NewEntrySchema = z.union([
  HospitalEntrySchema.omit({ id: true }),
  OccupationalHealthcareEntrySchema.omit({ id: true }),
  HealthCheckEntrySchema.omit({ id: true }),
]);

export const toNewEntry = (object: unknown): NewEntry => {
  return NewEntrySchema.parse(object);
};

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
  entries: z.array(EntrySchema),
});

export const toNewPatientEntry = (
  object: unknown
): NewPatientEntry => {
  return NewPatientSchema.parse(object);
};
