import { useContext, useEffect, useRef, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import {
    FiChevronLeft,
    FiChevronRight,
    FiHeart,
    FiMapPin,
    FiMaximize2,
    FiShare2,
    FiStar,
    FiX,
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider/AuthProvider';
import Loading from '../Loading';
import About from './TabContent/About';
import Accessibility from './TabContent/Accessibility';
import Overview from './TabContent/Overview';
import Policies from './TabContent/Policies';
import Rooms from './TabContent/Rooms';

const SingleResortPage = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const { allResortData } = useContext(AuthContext);
  const [resort, setResort] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  const sectionRefs = {
    overview: useRef(null),
    about: useRef(null),
    rooms: useRef(null),
    accessibility: useRef(null),
    policies: useRef(null),
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'about', label: 'About' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'policies', label: 'Policies' },
  ];

  useEffect(() => {
    if (allResortData && _id) {
      const foundResort = allResortData.find(resort => resort._id === _id);
      if (foundResort) setResort(foundResort);
    }
  }, [_id, allResortData]);

  // Auto-play slider
  useEffect(() => {
    if (!isImageHovered && !isGalleryOpen) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % 3);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isImageHovered, isGalleryOpen]);

  // Scroll event listener to update active tab
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      Object.entries(sectionRefs).forEach(([tab, ref]) => {
        if (ref.current) {
          const sectionTop = ref.current.offsetTop;
          const sectionHeight = ref.current.offsetHeight;

          if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
          ) {
            setActiveTab(tab);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!resort) return <Loading />;

  const { img, img2, img3, place_name, location } = resort;
  const placeholderImage = 'https://via.placeholder.com/1200x800?text=Image+not+available';
  const images = [img || placeholderImage, img2 || placeholderImage, img3 || placeholderImage];

  const handleTabClick = tab => {
    setActiveTab(tab);
    const offset = 100;
    const element = sectionRefs[tab].current;
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev === 0 ? 2 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % 3);
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-semibold">Back to results</span>
          </button>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Desktop: Grid Layout */}
          <div className="hidden md:grid md:grid-cols-4 gap-2 h-[500px] rounded-2xl overflow-hidden">
            {/* Main Large Image */}
            <div className="col-span-2 row-span-2 relative group cursor-pointer">
              <img
                src={images[0]}
                alt={`${place_name} - Main view`}
                onError={(e) => {
                  e.currentTarget.src = placeholderImage;
                }}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => {
                  setCurrentImageIndex(0);
                  setIsGalleryOpen(true);
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
            </div>

            {/* Side Images */}
            <div className="relative group cursor-pointer">
              <img
                src={images[1]}
                alt={`${place_name} - View 2`}
                onError={(e) => {
                  e.currentTarget.src = placeholderImage;
                }}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => {
                  setCurrentImageIndex(1);
                  setIsGalleryOpen(true);
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
            </div>

            <div className="relative group cursor-pointer">
              <img
                src={images[2]}
                alt={`${place_name} - View 3`}
                onError={(e) => {
                  e.currentTarget.src = placeholderImage;
                }}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => {
                  setCurrentImageIndex(2);
                  setIsGalleryOpen(true);
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
            </div>

            {/* View All Photos Button */}
            <div className="relative">
              <img
                src={images[0]}
                alt={`${place_name} - View 4`}
                onError={(e) => {
                  e.currentTarget.src = placeholderImage;
                }}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="absolute inset-0 bg-black/60 hover:bg-black/70 transition-all duration-200 flex items-center justify-center"
              >
                <div className="text-white text-center">
                  <FiMaximize2 className="mx-auto text-3xl mb-2" />
                  <span className="font-semibold text-lg">View all photos</span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile: Slider */}
          <div
            className="md:hidden relative h-64 sm:h-80 rounded-2xl overflow-hidden"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${place_name} - ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-lg transition-all duration-200 z-10"
              aria-label="Previous image"
            >
              <FiChevronLeft className="text-gray-800 text-xl" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-lg transition-all duration-200 z-10"
              aria-label="Next image"
            >
              <FiChevronRight className="text-gray-800 text-xl" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* View Gallery Button */}
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm hover:bg-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg transition-all duration-200"
            >
              <FiMaximize2 />
              <span>View all</span>
            </button>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex justify-end gap-3 mt-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200">
              <FiShare2 className="text-lg" />
              <span className="font-semibold">Share</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200">
              <FiHeart className="text-lg" />
              <span className="font-semibold">Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Property Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {place_name}
              </h1>
              {location && (
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <FiMapPin className="text-lg" />
                  <span className="text-base">{location}</span>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg">
                  <FiStar className="text-base" />
                  <span className="font-bold text-sm">
                    {(Math.random() * (10 - 7) + 7).toFixed(1)}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Excellent
                </span>
                <span className="text-sm text-gray-500">
                  ({Math.floor(Math.random() * 500 + 100)} reviews)
                </span>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex md:hidden gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white border-2 border-gray-300 hover:bg-gray-50 transition-colors duration-200">
                <FiShare2 className="text-lg" />
                <span className="font-semibold">Share</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white border-2 border-gray-300 hover:bg-gray-50 transition-colors duration-200">
                <FiHeart className="text-lg" />
                <span className="font-semibold">Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex-shrink-0 px-4 sm:px-6 py-4 text-sm sm:text-base font-semibold border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <section ref={sectionRefs.overview} className="scroll-mt-24">
            <Overview resort={resort} />
          </section>
          <section ref={sectionRefs.about} className="scroll-mt-24">
            <About resort={resort} />
          </section>
          <section ref={sectionRefs.rooms} className="scroll-mt-24">
            <Rooms resort={resort} />
          </section>
          <section ref={sectionRefs.accessibility} className="scroll-mt-24">
            <Accessibility resort={resort} />
          </section>
          <section ref={sectionRefs.policies} className="scroll-mt-24">
            <Policies resort={resort} />
          </section>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 z-10"
            aria-label="Close gallery"
          >
            <FiX className="text-white text-2xl" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium z-10">
            {currentImageIndex + 1} / {images.length}
          </div>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={images[currentImageIndex]}
              alt={`${place_name} - ${currentImageIndex + 1}`}
              onError={(e) => {
                e.currentTarget.src = placeholderImage;
              }}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200"
            aria-label="Previous image"
          >
            <FiChevronLeft className="text-white text-2xl" />
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200"
            aria-label="Next image"
          >
            <FiChevronRight className="text-white text-2xl" />
          </button>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/70 backdrop-blur-sm p-2 rounded-xl">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                  index === currentImageIndex
                    ? 'ring-2 ring-white scale-110'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = placeholderImage;
                  }}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleResortPage;
