import NavigationBar from "../components/NavigationBar";
import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";
import { Link, Outlet } from "react-router-dom";

const HelpScreen = () => {
   return (
      <>
         <Helmet>
            <title> Customer Help | drawww</title>
            <meta name="description" content="Customer Help page" />
            <link rel="canonical" href={window.location.href} />
         </Helmet>
         <NavigationBar />
         <div className="hero-container" style={{ padding: 20, marginBottom: 20, height: '20%', backgroundColor: 'black', color: 'white' }}>
            <p>Drawww aims to provide the best customer experience in eCommerce.</p>
            <p>How can we help?</p>
         </div>
         <div style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', padding: '5px 20px' }}>
            <Card title="Return Policy" link="returns" /> 
            <Card title="Privacy Policy" link="privacy" /> 
            <Card title="Chargebacks" link="chargebacks" /> 
            <Card title="Shipping & Handling" link="shippinghandling" /> 
            <Card title="Customer Service" link="customerservice" /> 
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', width: '90%', margin: '20px auto' }}>
            <Outlet />
         </div>
         
         <div style={{ marginTop: 25, marginBottom: 25 }}>
            <Footer />
         </div>
      </>
   )
}
export default HelpScreen;

interface ICard {
   title: string,
   link: string,
}

const Card = ({ title, link }: ICard) => {
   return (
      <Link to={link} style={{ color: 'black' }}>
         <div style={{ border: '1px solid black', padding: 10, margin: 5, }} >
            <p style={{ fontWeight: 'bolder', fontSize: 14, margin: 7 }}>{title}</p>
            <p style={{ fontSize: 10, margin: '0 7px', }}>Click to learn more</p>
         </div>
      </Link>
   )
}