import { useRef, useState, useEffect } from 'react'
import styles from './CategoryTabs.module.css'
import {
  FaSwimmingPool,
  FaUmbrellaBeach,
  FaCampground,
  FaCaravan,
  FaTree,
} from 'react-icons/fa'
import { MdOutlineCabin, MdOutlineCastle } from 'react-icons/md'
import {
  GiSnowflake2,
  GiDiamondHard,
  GiHouse,
  GiFishingBoat,
  GiSailboat,
} from 'react-icons/gi'
import { HiOutlineArrowRightCircle } from 'react-icons/hi2'
import { HiOutlineArrowLeftCircle } from 'react-icons/hi2'
import * as constants from '../../constants/constants'
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import FilterButton from '../FilterButton/FilterButton'
import { useTranslation } from 'react-i18next'

const categories = [
  {
    label: 'amazingPools',
    tag: constants.AMAZING_POOLS,
    icon: <FaSwimmingPool size={28} />,
  },
  {
    label: 'beachfront',
    tag: constants.BEACHFRONT,
    icon: <FaUmbrellaBeach size={28} />,
  },
  {
    label: 'cabins',
    tag: constants.CABINS,
    icon: <MdOutlineCabin size={28} />,
  },
  {
    label: 'tinyHomes',
    tag: constants.TINY_HOMES,
    icon: <GiHouse size={28} />,
  },
  {
    label: 'castles',
    tag: constants.CASTLES,
    icon: <MdOutlineCastle size={28} />,
  },
  {
    label: 'camping',
    tag: constants.CAMPING,
    icon: <FaCampground size={28} />,
  },
  { label: 'luxe', tag: constants.LUXE, icon: <GiDiamondHard size={28} /> },
  { label: 'arctic', tag: constants.ARCTIC, icon: <GiSnowflake2 size={28} /> },
  { label: 'caravans', tag: constants.CARAVANS, icon: <FaCaravan size={28} /> },
  {
    label: 'treeHouses',
    tag: constants.TREE_HOUSES,
    icon: <FaTree size={28} />,
  },
  {
    label: 'fishingBoats',
    tag: constants.FISHING_BOATS,
    icon: <GiFishingBoat size={28} />,
  },
  {
    label: 'sailboats',
    tag: constants.SAILBOATS,
    icon: <GiSailboat size={28} />,
  },
  {
    label: 'luxuryVillas',
    tag: constants.LUXURY_VILLAS,
    icon: <GiDiamondHard size={28} />,
  },
  {
    label: 'beachHouses',
    tag: constants.BEACH_HOUSES,
    icon: <FaUmbrellaBeach size={28} />,
  },
  { label: 'chalets', tag: constants.CHALETS, icon: <GiHouse size={28} /> },
  {
    label: 'riversideCabins',
    tag: constants.RIVERSIDE_CABINS,
    icon: <MdOutlineCabin size={28} />,
  },
]

const CategoryTabs = ({ toggleModal, setHistogramData }) => {
  const [activeTab, setActiveTab] = useState(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const scrollContainerRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const { t } = useTranslation();

  const handleTabClick = (tag) => {
    if (!isDragging) {
      setActiveTab(tag)
      const params = new URLSearchParams(searchParams)
      params.set('category', tag)
      navigate({
        pathname: location.pathname,
        search: createSearchParams(params).toString(),
      })
    }
  }

  const handleScroll = (direction) => {
    const scrollContainer = scrollContainerRef.current
    const scrollAmount = window.innerWidth * 0.4

    if (direction === 'left') {
      scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    } else {
      scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }

    setShowLeftArrow(scrollContainer.scrollLeft > 0)
  }

  const checkForScroll = () => {
    const scrollContainer = scrollContainerRef.current
    const maxScrollLeft =
      scrollContainer.scrollWidth - scrollContainer.clientWidth

    setShowLeftArrow(scrollContainer.scrollLeft > 0)
    setShowRightArrow(scrollContainer.scrollLeft < maxScrollLeft)
  }

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    checkForScroll()
    scrollContainer.addEventListener('scroll', checkForScroll)

    return () => {
      scrollContainer.removeEventListener('scroll', checkForScroll)
    }
  }, [])

  // Mouse drag scrolling
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const distance = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft - distance
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch scrolling
  const handleTouchStart = (e) => {
    setIsDragging(true)
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft
    const distance = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft - distance
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseUp)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseUp)
    }
  }, [])

  return (
    <div className={styles.categoryMenu}>
      <div className={styles.categoryTabsContainer}>
        <div className={styles.categoryTabsWrapper}>
          {showLeftArrow && (
            <div className={styles.scrollButtonLeftContainer}>
              <div
                className={styles.scrollButton}
                onClick={() => handleScroll('left')}
              >
                <HiOutlineArrowLeftCircle size={28} />
              </div>
            </div>
          )}
          <div
            className={styles.categoryTabs}
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {categories.map((category, id) => (
              <div
                key={id}
                className={`${styles.tabItem} ${
                  activeTab === category.label ? styles.tabItemActive : ''
                }`}
                onClick={() => handleTabClick(category.tag)}
              >
                <div className={styles.tabIcon}>{category.icon}</div>
                <span className={styles.tabLabel}>{t(`categories.${category.label}`)}</span>
              </div>
            ))}
          </div>
          {showRightArrow && (
            <div className={styles.scrollButtonRightContainer}>
              <div
                className={styles.scrollButton}
                onClick={() => handleScroll('right')}
              >
                <HiOutlineArrowRightCircle size={28} />
              </div>
            </div>
          )}
        </div>
        <div className={styles.filterButtonWrapper}>
          <FilterButton
            toggleModal={toggleModal}
            setHistogramData={setHistogramData}
          />
        </div>
      </div>
    </div>
  )
}

export default CategoryTabs
