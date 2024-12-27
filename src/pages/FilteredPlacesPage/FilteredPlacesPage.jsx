import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import "../../App.css";
import CategoryTabs from "../../components/CategoryTabs/CategoryTabs";
import ProductCard from "../../components/ProductCard/ProductCard";
import CalendarToggle from "../../components/calendarToggle/CalendarToggle";
import { BASE_URL } from "../../constants/constants";
import PriceRangeModal from "../../components/PriceRangeModal/PriceRangeModal";
import useOutsideClick from "../../hooks/useOutsideClick";
import { useTranslation } from "react-i18next";


function FilteredPlacesPage() {
  const [places, setPlaces] = useState([]);
  const [selectPlaceId, setSelectPlaceId] = useState(null);
  const [searchParams] = useSearchParams();
  const { modalIsVisible, setModalIsVisible, closeModal, exchangeRateUSD, exchangeRateUAH, selectedCurrency } = useOutletContext();
  const [isModalOpen, setModalOpen] = useState(false);
  const [histogramData, setHistogramData] = useState([]);
  const [bookings, setBookings] = useState([]);

  const rateEURUSD = parseFloat(localStorage.getItem('exchangeRateUSD')) || exchangeRateUSD || 1;
  const rateEURUAH = parseFloat(localStorage.getItem('exchangeRateUAH')) || exchangeRateUAH || 1;
  const currency = localStorage.getItem('selectedCurrency') || selectedCurrency || 'EUR';

  const toggleModal = () => setModalOpen((prev) => !prev);

  const priceRangeRef = useOutsideClick(() => setModalOpen(false))

  const { t } = useTranslation();

	useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modalOpen');
    } else {
      document.body.classList.remove('modalOpen');
    }
  }, [isModalOpen]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}places`, {
        params: searchParams,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => setPlaces(response?.data))
      .catch((error) => console.error(`Something went wrong. ${error.message}.`));
  }, [searchParams]);

  useEffect(() => {
    axios.get(
      (`http://localhost:8800/bookings`)
    )
    .then((response) => setBookings(response?.data))
    .catch((error) => console.error(`Something went wrong. ${error.message}.`));
  }, [searchParams] ); 

  const handlePlaceClick = (placeId) => {
    setSelectPlaceId(placeId);
    console.log("Selected Place ID:", placeId);

    axios
      .post(`${BASE_URL}savePlace`, { placeId })
      .then((response) => {
        console.log("Place ID sent successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error sending place ID:", error.message);
      });
  };

  const pricePerNightCurrencyCalculation = (placeId) => {
    if (bookings.length > 0) {
        const booking = bookings.find((booking) => booking.id === placeId); 
        return booking?.bookingData?.pricePerNight || 0; 
    }
    return 0; 
};


  const priceCurrencyCalculation = (price) => {
    console.log('Price received for calculation:', price);
    if (currency === 'USD') {
        return Math.round(price * rateEURUSD); 
    } else if (currency === 'UAH') {
        return Math.round(price * rateEURUAH); 
    } else {
        return Math.round(price); 
    }
};

  return (
    <div> 
      <div>
        <CalendarToggle />
      </div>
      
      <CategoryTabs toggleModal={toggleModal} setHistogramData={setHistogramData} />

      <div className="grid">
        {places.length === 0 || places.every((place) => !place.id) ? (
          <div className="noCategoryMessage">Sorry, no places were found in this category</div>
        ) : (
          places.map(
            (place) =>
              place.id && (
              <ProductCard
                key={place.id}
                images={place.images}
                linkTo={`/rooms/${place.id}`}
                onClick={() => handlePlaceClick(place.id)}
                modalIsVisible={modalIsVisible}
                setModalIsVisible={setModalIsVisible}
                closeModal={closeModal}
              >
                <h2 className="title">{place.title}</h2>
                <p className="host">{place.host}</p>
                <p className="price">{`
                  ${priceCurrencyCalculation(pricePerNightCurrencyCalculation(place.id))}${currency === 'USD' ? '$' : currency === 'UAH' ? '₴' : "€"}
                  ${t('product.forNight', {count: 1})}
                  `}
                </p>
              </ProductCard>
            )
          )
        )}
      </div>
			
      {isModalOpen && (
        <PriceRangeModal
          isOpen={isModalOpen}
          className="overlay"
          onClose={toggleModal}
          histogramData={histogramData}
          priceRangeRef={priceRangeRef}
        />
      )}
    </div>
  );
}

export default FilteredPlacesPage;
