export interface JoblistingsRequest {
  id?: string;
  designation: string;
  description: string;
  facility: string;
  requirements: string;
  deadline: Date;
}