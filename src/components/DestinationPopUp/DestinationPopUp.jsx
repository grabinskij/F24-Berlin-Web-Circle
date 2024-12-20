import Styles from './DestinationPopUp.module.css';
import World from '../../assets/Destination/World.jpg';
import UnitedStates from '../../assets/Destination/UnitedStates.webp';
import Spain from '../../assets/Destination/Spain.webp';
import SouthEastAsia from '../../assets/Destination/SouthEastAsia.webp';
import MiddleEast from '../../assets/Destination/MiddleEast.webp';
import Italy from '../../assets/Destination/Italy.webp';
import DestinationButton from './DestinationButton/DestinationButton';
import { useTranslation } from 'react-i18next';

const DestinationPopUp = ({
    title,
    onClick,
}) => {

const { t } = useTranslation();

const destinations = [
    {image:World, description: t('search.imFlexible')},
    {image:UnitedStates, description: t('search.unitedStates')},
    {image:Spain, description: t('search.spain')},
    {image:SouthEastAsia, description: t('search.southeastAsia')},
    {image:MiddleEast, description: t('search.middleEast')},
    {image:Italy, description: t('search.italy')}];

const handelDestination = (item) =>{
    onClick(item);
}
const arrayChunk = (arr, n) => {
    const array = arr.slice();
    const chunks = [];
    while (array.length) chunks.push(array.splice(0, n));
    return chunks;
  };
    return(
        <div className={Styles.popup}>
            <div className={Styles.title}>
                {title}
            </div>
            <div className={Styles.regionContainer}>
                {arrayChunk(destinations, 3).map((row, i) => (
                    <div className={Styles.regionRow} key={i}>
                        {row.map((item, i) => (
                            <div key={i}>
                                <DestinationButton destination={item} onClick={(e)=>handelDestination(e)}/>
                            </div>
                        ))}
                    </div>
                ))}         
            </div>
        </div>
    )
}
export default DestinationPopUp;