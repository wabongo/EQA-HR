export interface Document {
  id?: number;
  fileName: string;
  fileType: string;
  documentType: string;
  data: Blob;
}

export interface Candidate {
  id?: number;
  name: string;
  designation: string;
  documents: Document[];
  facility: string;
  idNumber: string;
  email: string;
  phoneNumber: string;
  status: ApplicationStatus;
}

export enum ApplicationStatus {
  RECEIVED = 'RECEIVED',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  REVIEWING = 'REVIEWING',
  HIRE = 'HIRE',
  NO_HIRE = 'NO_HIRE'
}
