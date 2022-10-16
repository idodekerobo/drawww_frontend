import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";

const AboutScreen = () => {
   return (
      <>
         <NavigationBar />
         <div style={{ display: 'flex', flexDirection: 'column',  width: '90%', margin: '20px auto' }}>


            <h3>Drawww is the best way to buy and sell sneakers online</h3>
            <p>
               Drawww lets you buy tickets to win the most coveted and hard to find sneakers, clothes, and more! You can also list items in your collection for sale on Drawww.<br/>
               Everyone involved in the sneaker and streetwear community knows its gotten harder and harder to get the items that you love over the past few years. You have to invest huge amounts of money and time to <em>maybe</em> win an item or pay a lot of money on the resale market (RIP to your bank account).<br/><h4>Drawww is designed to help make the game a bit easier.</h4>
            </p>
            
            <h4><a href="/about/privacy">
               Privacy Policy
            </a></h4>
            <h4><a href="/about/returns">
               Return Policy
            </a></h4>

         </div>


         <div style={{marginTop: 25, marginBottom: 25 }}>
            <Footer />
         </div>
      </>
   )
}
export default AboutScreen;