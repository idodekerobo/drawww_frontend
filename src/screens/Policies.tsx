const ShippingHandling = () => {
   return (
      <>
         <h4 style={{ marginBottom: 10 }}>Shipping & Handling Time</h4>
         <p style={{ marginTop: 0 }}> 
            Once a drawww closes, it'll take 4-7 business days for us to receive the shoe.
            <br/>
            Once we receive the shoe and verify it is authentic and in proper condition, it'll take another 4-7 business days of shipping time for the winner to receive the shoe.
         </p>
      </>
   )
}
const CustomerService = () => {
   return (
      <>
         <h4 style={{ marginBottom: 10 }}>Contact Customer Service</h4>
         <p style={{ marginTop: 0 }}>
            You can contact customer service by emailing <a style={{ textDecoration: 'underline', color: 'black', fontWeight: 'bolder' }} href="mailto:idode@drawww.xyz">idode@drawww.xyz</a>.
         </p>
      </>
   )
}

const ChargebackPolicy = () => {
   return (
      <>
         <h4 style={{ marginBottom: 10 }}>Chargeback's</h4>
         <h5 style={{ marginTop: 0, marginBottom: 0, fontSize: 14 }}>ChargeBack Policy</h5>
         <p style={{ marginTop: 0 }}>
            When a credit or debit card holder disputes a payment to Drawww, a “chargeback” is filed for that purchase.<br />
            Once a chargeback is filed, any credit or debit cards associated with the chargeback will not be able to be used again with Drawww. After two or more chargebacks, the account associated with that purchase will be terminated.
         </p>
      </>
   )
}

const ReturnPolicy = () => {
   return (
      <>
         <h3>Return Policy</h3>
         <h4 style={{ marginBottom: 10 }}>Returns and Refunds</h4>

         <h5 style={{ marginTop: 0, marginBottom: 0, fontSize: 14 }}>Participating Auctions</h5>
         <p style={{ marginTop: 0 }}>
            Due to the nature of listings on Drawww, you cannot receive a refund for a ticket purchased on any auctions you've participated, in regardless of the result.
         </p>

         <h5 style={{ marginTop: 0, marginBottom: 0, fontSize: 14 }}>Winning Auctions</h5>
         <p style={{ marginTop: 0 }}>
            Due to the nature of listings on Drawww, you cannot receive a return for an item on a winning ticket that was purchased on any auctions. This applies even if the item is the wrong size. However, you are welcome to resell the item with Drawww.
         </p>

         <h5 style={{ marginTop: 0, marginBottom: 0, fontSize: 14 }}>Damaged or Incorrect Items</h5>
         <p style={{ marginTop: 0 }}>
            If you received your item damaged, were sent the incorrect item or were sent an item in the incorrect size, please email idode@drawww.xyz and send us the listed details within three days.
            <br/>
            Please send the following in the email:
            <ol>
               <li>1. A description of the damage or issue with the item</li>
               <li>2. Name of the listing</li>
               <li>3. Photo(s) of the issue you're referring to</li>
               <li>4. A picture of the shipping box in full</li>
            </ol>
         </p>

      </>
   )
}

const PrivacyPolicy = () => {
   return (
      <>
         <h3>Privacy Policy</h3>
         <h4 style={{ marginBottom: 10 }}>What Information Do We Collect</h4>

         <h5 style={{ marginTop: 0, marginBottom: 0, fontSize: 14}}>Account Information</h5>
         <p style={{ marginTop: 0 }}>
            When you create an Account, you will provide a username, email address, and password. You acknowledge that this is personal information, and by creating an account, acknowledge that we are able to identify you. We may use this personal contact information to send you important information about our services and product. 
         </p>

         <h5 style={{ marginTop: 0, marginBottom: 0, fontSize: 14}}>User Content</h5>
         <p style={{ marginTop: 0 }}>
            Some services and features may cause you to submit content such as pictures or comments. We may keep this content indefinitely, even after you have terminated your account. We may disclose this content to other parties in ways that do not reveal your personal information.
         </p>

         <h5 style={{ marginTop: 0, marginBottom: 0, fontSize: 14}}>User Contact Information</h5>
         <p style={{ marginTop: 0 }}>
            You may provide, and will if you are a Winning Buyer of a listing, personal information such as name, mailing address, and phone number. You acknowledge that this information may be personal to you, and by providing Personal Information to Drawww, you allow others, including us and applicable sellers, to identify you.
         </p>

         <h5 style={{ marginTop: 0, marginBottom: 0, fontSize: 14}}>Financial Information</h5>
         <p style={{ marginTop: 0 }}>
            We do not collect or store financial information, such as your payment method (valid credit card number, type, expiration, or other financial information). This information is collected and securely stored by our third party payment processing (the "Payment Processor") company. Use and storage of that information is governed by the Payment Processor's applicable terms of service and privacy policy.
         </p>

         <h5 style={{ marginTop: 0, marginBottom: 0, fontSize: 14}}>California Privacy Rights</h5>
         <p style={{ marginTop: 0 }}>
            Under California Civil Code sections 1798.83-1798.84, California residents are entitled to ask us for a notice identifying the categories of personal customer information which we share with our affiliates and/or third parties for marketing purposes, and providing contact information for such affiliates and/or third parties. If you are a California resident and would like a copy of this notice, please submit a written request to the following email address: <a href="mailtoidode@drawww.xyz">idode@drawww.xyz</a>.
         </p>

         <h4 style={{ marginBottom: 10 }}>How Can I Delete My Account?</h4>
         <p style={{ marginTop: 0 }}>
         Should you ever decide to delete your Account, you may do so by emailing <a href="mailtoidode@drawww.xyz">idode@drawww.xyz</a>. If you terminate your Account, any association between your Account and information we store will no longer be accessible through your Account. However, given the nature of sharing on the Services, any public activity on your Account prior to deletion will remain stored on our servers and will remain accessible to the public.
         </p>
      </>
   )
}
export { ChargebackPolicy, PrivacyPolicy, ReturnPolicy, CustomerService, ShippingHandling };