import { useTranslation } from 'react-i18next';
import styles from './DataIncrementsButtonForTheCalendar.module.css'; 

const DateIncrementsButtonForTheCalendar = ({selectedOption, setSelectedOption}) => {

  const { t } = useTranslation();

  const options = [
    { label: `${t('search.days.exactDates')}`, value: 'exact' },
    { label: `±1 ${t('search.days.day')}`, value: '1-day' },
    { label: `±2 ${t("search.days.days")}`, value: '2-days' },
    { label: `±3 ${t("search.days.days")}`, value: '3-days' },
    { label: `±7 ${t("search.days.daysUkr")}`, value: '7-days' },
    { label: `±14 ${t("search.days.daysUkr")}`, value: '14-days' }
  ];

  const handleOptionChange = (value) => {
    setSelectedOption(value); 
  };

  return (
    <div className= {styles.dateSelectionContainer}>
      {options.map((option) => (
        <div
          key={option.value}
          className={`${styles.option} ${selectedOption === option.value ? styles.selected : ''}`}
          onClick={() => handleOptionChange(option.value)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default DateIncrementsButtonForTheCalendar;
