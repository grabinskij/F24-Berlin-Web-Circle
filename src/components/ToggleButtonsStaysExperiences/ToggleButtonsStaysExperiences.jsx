import { useState } from 'react'
import styles from "../ToggleButtonsStaysExperiences/ToggleButtonsStaysExperiences.module.css"
import { useTranslation } from 'react-i18next';

const ToggleButtonsStaysExperiences = ({toggleSearchType}) => {

    const [activeButton, setActiveButton] = useState("stays");

    const { t } = useTranslation();

    const handleButtonClick = (button) => {
        setActiveButton(button);
        toggleSearchType(button);
    };

    return (
        <div className={styles.buttonContainer}>
            <button
                className={`${styles.toggleButton} ${activeButton === "stays" ? styles.active : styles.inactive}`}
                onClick={() => handleButtonClick("stays")}
            >{t('search.stays')}
            </button>
            <button
                className={`${styles.toggleButton} ${activeButton === "experiences" ? styles.active : styles.inactive}`}
                onClick={() => handleButtonClick("experiences")}
            > {t('search.experiences')}
            </button >
        </div >
    )
}

export default ToggleButtonsStaysExperiences