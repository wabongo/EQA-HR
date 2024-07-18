export interface FacilityRequest {
    id?: number;
    clinicName: string;
    dateOpened: Date;
    province: string;
    county: string;
    subcounty: string;
    type: FacilityType;
    physicalAddress: string;
    doctorInCharge: string;
    clinicContact: string;
    llcName: string;
    franchiseeContact: string;
    recruitmentEmail: string;
  }
  
  export enum FacilityType {
    HUB = 'HUB',
    SATELLITE = 'SATELLITE',
    SPOKE = 'SPOKE'
  }