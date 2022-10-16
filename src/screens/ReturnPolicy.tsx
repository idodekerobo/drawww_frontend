import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";


const ReturnPolicy = () => {
   return (
      <>
         <NavigationBar />
         <div style={{ display: 'flex', flexDirection: 'column', width: '90%', margin: '20px auto' }}>


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
                  <li>A description of the damage or issue with the item</li>
                  <li>Name of the listing</li>
                  <li>Photo(s) of the issue you're referring to</li>
                  <li>A picture of the shipping box in full</li>
               </ol>
            </p>


            <h4 style={{ marginBottom: 10 }}>Chargeback's</h4>
            <h5 style={{ marginTop: 0, marginBottom: 0, fontSize: 14 }}>ChargeBack Policy</h5>
            <p style={{ marginTop: 0 }}>
               When a credit or debit card holder disputes a payment to Drawww, a “chargeback” is filed for that purchase.<br/>
               Once a chargeback is filed, any credit or debit cards associated with the chargeback will not be able to be used again with Drawww. After two or more chargebacks, the account associated with that purchase will be terminated.
            </p>

         </div>

         <div style={{ marginTop: 25, marginBottom: 25 }}>
            <Footer />
         </div>
      </>
   )
}
export default ReturnPolicy;