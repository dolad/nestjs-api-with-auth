

export interface ICreateBusinessInformationDTO {
    businessName: string;
    businessType: string; 
    businessAddress: string;
    businessPostcode: string;
    businessCountry: string;
    businessCity: string;
    businessId: string;
}


type myPartialPick<T, K extends keyof T> = Partial<Pick<T, Exclude<keyof T, K>>> & Pick<T, K>;

export type UpdateBusinessInformationDTO = myPartialPick<ICreateBusinessInformationDTO, 'businessId'>


