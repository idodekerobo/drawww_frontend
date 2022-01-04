import { Timestamp, DocumentReference } from "firebase/firestore";
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
   shoeGender: SneakerGender,
   shoeSize: string,
   buyerTransactions?: DocumentReference[],
   sellerTransactions?: DocumentReference[],
   sellerWaitlist?: boolean,
   eligibleToOnboardToStripe?: boolean,
   sellerOnboardedToStripe?: SellerStripeOnboardingStatus,
   stripeAccountData?: IStripeUserData
}
export enum SellerStripeOnboardingStatus {
   "not_onboarded" = 0,
   "partially_onboarded" = 1,
   "completely_onboarded" = 2
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
   transactions: DocumentReference[],
   buyerTickets: string[],
}

export interface IAccountUrlParams {
   accountId: string,
}
export interface IDrawUrlParams {
   drawId: string,
}

export interface IUserTransactionObject {
   sellerUserId: string,
   sellerStripeAcctId: string,
   stripePaymentIntentId: string,
   drawId :string,
   ticketsSold: number, 
   buyerUserId: string,
   subtotalDollarAmount: number,
   taxDollarAmount: number,
   totalDollarAmount: number,
   nameOnCard: string,
   emailAddress: string,
}
export interface ITransactionFirestoreObject extends IUserTransactionObject {
   id: string,
   dateCompleted: Timestamp,
}

export interface IDrawCardProps {
   draw: IDrawDataFromFirestoreType
}