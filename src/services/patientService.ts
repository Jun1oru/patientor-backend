import patients from '../../data/patients';
import {
  Patient,
  Entry,
  NonSensitivePatientEntry,
  NewPatientEntry,
  NewEntry,
  Diagnosis,
} from '../types';
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
  return patients;
};

const getPatientById = (id: string): Patient => {
  const patient = patients.find((patient) => patient.id === id);
  if (!patient) {
    throw new Error(`Patient with id ${id} not found.`);
  }
  return patient;
};

const getNonSensitivePatients = (): NonSensitivePatientEntry[] => {
  return patients.map(
    ({ id, name, dateOfBirth, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
    })
  );
};

const addPatient = (entry: NewPatientEntry): Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...entry,
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const parseDiagnosisCodes = (
  object: unknown
): Array<Diagnosis['code']> => {
  if (
    !object ||
    typeof object !== 'object' ||
    !('diagnosisCodes' in object)
  ) {
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const addEntry = (patientId: string, entry: NewEntry): Entry => {
  const newEntry = {
    id: uuid(),
    ...entry,
  };

  const patient = getPatientById(patientId);
  newEntry.diagnosisCodes = parseDiagnosisCodes(newEntry);
  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getPatientById,
  getNonSensitivePatients,
  addPatient,
  addEntry,
};
