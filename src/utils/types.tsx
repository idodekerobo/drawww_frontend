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
   NotOnboarded = 0,
   PartiallyOnboarded = 1,
   CompletelyOnboarded = 2,
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
export enum SneakerGender {
   "mens" = 0,
   "womens" = 1,
}
export interface IUserDrawData {
   userUid: string,
   sneakerGender: SneakerGender,
   raffleSneakerBrand: string,
   raffleSneakerName: string,
   raffleSneakerSize: string,
   raffleDuration: number,
   numTotalRaffleTickets: number,
   pricePerRaffleTicket: number,
}
export interface IDrawDataFromFirestoreType extends IUserDrawData {
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

export interface IAccountUrlParams {
   accountId?: string,
}
export interface IDrawUrlParams {
   drawId: string,
}

export interface IUserOrderObject {
   sellerUserId: string,
   sellerStripeAcctId: string,
   stripePaymentIntentId: string,
   drawId :string,
   ticketsSold: number, 
   buyerUserId: string,
}
export interface ITransactionFirestoreObject extends IUserOrderObject {
   id: string,
   dateCompleted: Timestamp,
}

export interface IDrawCardProps {
   draw: IDrawDataFromFirestoreType
}