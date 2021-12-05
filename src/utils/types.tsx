import { Timestamp } from "firebase/firestore";
import { User } from 'firebase/auth';

export interface IAuthContextInterface {
   loggedIn: boolean,
   loading: boolean,
   user: User | null, 
   logInFunction: (loggedInUser: User) => void,
   logOutFunction: () => void,
   signUpFunction: (loggedInUser: User) => void,
}

export interface IUserData {
   name: string,
   phoneNum: string,
   city: string,
   state: string,
   zipCode: string,
   emailAddress?: string,
   sellerOnboardedToStripe?: SellerStripeOnboardingStatus,
   stripeAccountData?: IStripeUserData
}
export enum SellerStripeOnboardingStatus {
   NotOnboarded,
   PartiallyOnboarded,
   CompletelyOnboarded
}
export interface IStripeUserData {
   accountId: string,
   // the rest of the parameters are optional because of partial onboarding
   email?: string,
   business?: string,
   country?: string,
   defaultCurrency?: string,
   statementDescriptor?: string,
}

export interface IUserRaffleData {
   userUid: string,
   raffleSneakerBrand: string,
   raffleSneakerName: string,
   raffleSneakerSize: string,
   raffleDuration: number,
   numTotalRaffleTickets: number,
   pricePerRaffleTicket: number,
}
export interface IRaffleDataFromFirestoreType extends IUserRaffleData {
   id: string,
   active: boolean,
   numRemainingRaffleTickets: number,
   soldRaffleTickets: number,
   raffleType: string,
   timeRaffleCreated: Timestamp,
   raffleExpirationDate: Timestamp,
   raffleImageStoragePath: string,
   raffleImageDownloadUrls: string[],
}
// export interface IRaffleDataWithImageURls extends IRaffleDataFromFirestoreType {
//    raffleImageUrls: string[]
// }

export interface IAccountUrlParams {
   accountId?: string,
}
export interface IRaffleUrlParams {
   raffleId: string,
}

export interface IUserOrderObject {
   sellerUserId: string,
   sellerStripeAcctId: string,
   stripePaymentIntentId: string,
   raffleId :string,
   ticketsSold: number, 
   buyerUserId: string,
}
export interface ITransactionFirestoreObject extends IUserOrderObject {
   id: string,
   dateCompleted: Timestamp,
}

export interface IRaffleCardProps {
   raffle: IRaffleDataFromFirestoreType
}