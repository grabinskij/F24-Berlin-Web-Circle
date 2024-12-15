import globe_icon from "../../assets/globe_icon.svg"
import styles from "./LanguageSelector.module.css"

const LanguageSelector = ({setIsVisiable}) => {

    const handelLanguageSelectionClick = () => {
        setIsVisiable(true);
    }

    return (
        <>
            <div className={styles.languageSelector} onClick={handelLanguageSelectionClick}>
                <img src={globe_icon} className={styles.globe_icon} alt="A globe icon as a link to select the language" />
            </div>
        </>
    )
}
export default LanguageSelector