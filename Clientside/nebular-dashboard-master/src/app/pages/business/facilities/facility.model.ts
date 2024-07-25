export interface FacilityRequest {
  entity: FacilityRequest;
  id?: number;
  clinicName: string;
  dateOpened: string | Date | null;
  province: string;
  county: string;
  subcounty: string;
  type: FacilityType;
  physicalAddress: string;
  doctorInCharge: string;
  clinicContact: string;
  companyName: string;
  franchiseeContact: string;
  recruitmentEmail: string;
}
  export enum FacilityType {
    HUB = 'HUB',
    SATELLITE = 'SATELLITE',
    SPOKE = 'SPOKE'
  }