export interface JoblistingsRequest {
  id: string;
  designation: string;
  description: string;
  facility: string;
  requirements: string;
  deadline: Date;
  jobType: string;
  status: string;
  applicationDate?: Date;  // Add this for applied jobs
  offerDate?: Date;        // Add this for offered jobs
  startDate?: Date;        // Add this for offered jobs
  // Add any other properties that might be needed
}