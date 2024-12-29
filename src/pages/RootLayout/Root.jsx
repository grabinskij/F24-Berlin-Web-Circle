import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import colors from '../../theme/colors';
import styles from "./Root.module.css"
import { useEffect, useState } from "react";
import SharePopup from "../../components/SharePopup/SharePopup";
import LanguagePopUp from "../../components/LanguagePopUp/LanguagePopUp";


const Root = () =>
{
	const [modalIsVisible, setModalIsVisible] = useState(false);
  const [isVisible, setIsVisiable] = useState(false);
  const [exchangeRateUSD, setExchangeRateUSD] = useState(1) 
  const [exchangeRateUAH, setExchangeRateUAH] = useState(1)
  const [selectedCurrency, setSelectedCurrency] = useState('Euro') 


  const onCurrencyChange = (currency, exchangeRate) => {
    if (currency === 'USD') {
      setExchangeRateUSD(exchangeRate);
    } else if (currency === 'UAH') {
      setExchangeRateUAH(exchangeRate); 
    } else {
      setExchangeRateUSD(1);
      setExchangeRateUAH(1);
    }
  }

  const closeModal = () => setModalIsVisible(false);

	useEffect(() => {
    if (modalIsVisible) {
      document.body.classList.add('modalOpen');
    } else {
      document.body.classList.remove('modalOpen');
    }
  }, [modalIsVisible]);

  const modalContext = {
    modalIsVisible,
    setModalIsVisible,
    closeModal,
    exchangeRateUSD,
    exchangeRateUAH,
    selectedCurrency,
    setSelectedCurrency
  };

  const headerContext = {
    isVisible,
    setIsVisiable
  };

  const handelClose = () => {
    setIsVisiable(false);
  }

	const themeStyles = {
		"--primary": colors.primary,
		"--palette-deco": colors.paletteDeco,
		"--neutral": colors.neutral,
	};

	return (
		<div style={themeStyles} className={`${styles.rootLayout} ${modalIsVisible ? styles.modalOpen : ''}`}>
			<Header context={headerContext}/>
			<div className={styles.layoutBody}>
				<Outlet context={modalContext} />
			</div>
			<Footer/>

			{modalIsVisible && (
        <>
          <div className={styles.overlay} onClick={closeModal}></div>
          <SharePopup onClick={closeModal} />
        </>
      )}
      <div className={styles.languagePopUp}>
          <LanguagePopUp 
            onCloseClick={handelClose} 
            isVisible={isVisible}
            onCurrencyChange={onCurrencyChange}
            setExchangeRateUSD={setExchangeRateUSD}
            setExchangeRateUAH={setExchangeRateUAH}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
          />
      </div>
		</div>
	)
}
	
export default Root;