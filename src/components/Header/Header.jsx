import airbnbLogo from "../../assets/logo_airbnb.svg"
import ButtonBeAHost from '../ButtonBeAHost/ButtonBeAHost'
import HeaderUserMenu from '../HeaderUserMenu/HeaderUserMenu'
import LanguageSelector from '../LanguageSelector/LanguageSelector'
import SearchPanel from '../SearchPanel/SearchPanel'
import styles from "./Header.module.css"

const Header = ({context}) => {

    const { setIsVisiable } = context;

    return (
        <div className={styles.headerSectionContainer}>
            <header className={styles.header}>
                <a className={styles.airbnbHomeButton} href="/">
                    <img src={airbnbLogo} className={styles.logoAirbnb} alt='The Logo of AirBnB' />
                </a>
                <SearchPanel />
                <div className={styles.userMenusWrapper}>
                    <ButtonBeAHost />
                    <LanguageSelector setIsVisiable={setIsVisiable}/>
                    <HeaderUserMenu />
                </div>
            </header>
        </div>
    )
}
export default Header