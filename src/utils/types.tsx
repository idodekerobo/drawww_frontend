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
   enteredDraws?: {
      [key: string]: number
   },
   buyerTransactions?: DocumentReference[],
   sellerTransactions?: DocumentReference[],
   sellerWaitlist?: boolean,
   paymentDataOnFile?: boolean,
   paymentData?: PaymentData,
}
interface PaymentData {
   braintree: {},
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
   raffleType: string,
   tickets: IDrawTicket[],
   numRemainingRaffleTickets: number,
   soldRaffleTickets: number,
   timeRaffleCreated: Timestamp,
   raffleExpirationDate: Timestamp,
   raffleImageStoragePath: string,
   raffleImageDownloadUrls: string[],
   transactions: DocumentReference[],
   buyerTickets: string[],
}
export interface IDrawTicket {
   id: string,
   number: number,
   status: ITicketStatus,
   raffleId: string,
   buyerId?: string,
   paid: boolean,
   transactionId?: string,
}
enum ITicketStatus {
   "available" = 0,
   "sold" = 1,
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