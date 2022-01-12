import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import styles from '../styles/Footer.module.css'
const Footer = () => {
   return (
      <div className={styles.iconContainer}>
         <a className={styles.iconWrapperATag} href="https://www.instagram.com/drawww.xyz/">
            <InstagramIcon className={styles.icon} />
         </a>
         <a className={styles.iconWrapperATag} href="https://twitter.com/drawwwxyz">
            <TwitterIcon className={styles.icon} />
         </a>
      </div>
   )
}
export default Footer;