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
  cv: Document;
  idNumber: string;
  email: string;
  phoneNumber: string;
}
