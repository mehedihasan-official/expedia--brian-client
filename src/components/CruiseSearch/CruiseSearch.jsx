import { useCallback, useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaCheckCircle, FaShip, FaStar } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { cruiseCategories, enrichedCruiseData } from "../../data/cruisesData";
import Loading from "../Loading";

const imageFallback =
  "https://placehold.co/900x520/e5e7eb/334155?text=Cruise+Image";
const logoFallback = "https://placehold.co/80x80/e5e7eb/334155?text=CL";

const calculateCruisePrices = (retailPrice) => {
  const discountedPrice = Math.round(retailPrice * 0.5);
  return {
    retailPrice,
    discountedPrice,
    savings: Math.round(retailPrice - discountedPrice),
    savingsPercent: 50,
  };
};

const normalizeRoute = (route = "") =>
  route.replaceAll("â†’", "->").replaceAll("→", "->");

const makeCabinTypes = (retailPrice) => ({
  inside: { name: "Inside", retailPrice },
  outside: { name: "Ocean View", retailPrice: Math.round(retailPrice * 1.22) },
  balcony: { name: "Balcony", retailPrice: Math.round(retailPrice * 1.48) },
  suite: { name: "Suite", retailPrice: Math.round(retailPrice * 2.45) },
});

const makeDepartureDates = () => {
  const today = new Date();
  const dates = [];
  for (let i = 1; i <= 6; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i * 38);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
};

const normalizeCruise = (cruise, category, index) => {
  const retailPrice = Number(cruise.retailPrice || cruise.price || 899);
  const route = normalizeRoute(cruise.route || "Miami -> Nassau");
  const itinerary = Array.isArray(cruise.itinerary)
    ? cruise.itinerary
    : route
        .split("->")
        .map((port) => port.trim())
        .filter(Boolean);

  return {
    id:
      cruise.id ||
      `CR-${category.replace(/\s+/g, "-").toUpperCase()}-${(cruise.name || "cruise")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .toUpperCase()}-${index + 1}`,
    name: cruise.name || "Featured Cruise",
    cruiseLine:
      cruise.cruiseLine ||
      (cruise.name?.includes("Princess")
        ? "Princess Cruises"
        : "Expedia Cruises"),
    cruiseLineLogo: cruise.cruiseLineLogo || logoFallback,
    route,
    departurePort: cruise.departurePort || itinerary[0] || "Flexible departure",
    duration: Number(cruise.duration || 7),
    category,
    image: cruise.image || imageFallback,
    rating: Number(cruise.rating || 4.4),
    reviews: Number(cruise.reviews || 500 + index * 37),
    retailPrice,
    itinerary,
    shipFeatures: cruise.shipFeatures || [
      "Dining",
      "Entertainment",
      "Pools",
      "Fitness Center",
    ],
    cabinTypes: cruise.cabinTypes || makeCabinTypes(retailPrice),
    departureDates: makeDepartureDates(),
    includes: cruise.includes || [
      "All meals",
      "Entertainment",
      "Taxes and fees",
    ],
  };
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const matchesDuration = (cruiseDuration, selectedDuration) => {
  if (!selectedDuration || selectedDuration === "Any duration") return true;
  if (selectedDuration === "3-5 nights")
    return cruiseDuration >= 3 && cruiseDuration <= 5;
  if (selectedDuration === "7 nights") return cruiseDuration === 7;
  if (selectedDuration === "10-14 nights")
    return cruiseDuration >= 10 && cruiseDuration <= 14;
  if (selectedDuration === "15+ nights") return cruiseDuration >= 15;
  return true;
};

const cabinOrder = ["inside", "outside", "balcony", "suite"];
const visibleCategories = cruiseCategories.filter(
  (category) => category !== "Asia" && category !== "Australia",
);
const isKnownCategory = (value) => cruiseCategories.includes(value);

const CruiseSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchState = useMemo(() => location.state || {}, [location.state]);
  const requestedDestination = searchState.destination || "All";
  const requestedCategory = isKnownCategory(requestedDestination)
    ? requestedDestination
    : "All";
  const [selectedCategory, setSelectedCategory] = useState(requestedCategory);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [selectedCabinType, setSelectedCabinType] = useState("inside");
  const [sortBy, setSortBy] = useState("recommended");
  const [expandedCruises, setExpandedCruises] = useState({});
  const [fallbackData, setFallbackData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadCruises = async () => {
      try {
        const response = await fetch("/DataInfo/cruiseData.json");
        const data = await response.json();
        if (isMounted) setFallbackData(data);
      } catch (error) {
        console.error("Error loading cruise data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCruises();
    return () => {
      isMounted = false;
    };
  }, []);

  const mergedCruisesByCategory = useMemo(() => {
    const merged = {};
    const addData = (source) => {
      Object.entries(source || {}).forEach(([category, cruises]) => {
        if (!Array.isArray(cruises)) return;
        const normalizedCategory =
          category === "default" ? "Caribbean" : category;
        merged[normalizedCategory] = [
          ...(merged[normalizedCategory] || []),
          ...cruises.map((cruise, index) =>
            normalizeCruise(cruise, normalizedCategory, index),
          ),
        ];
      });
    };

    addData(enrichedCruiseData);
    addData(fallbackData);
    return merged;
  }, [fallbackData]);

  const sortCruises = useCallback((list) =>
    [...list].sort((a, b) => {
      const aPrice =
        a.cabinTypes[selectedCabinType]?.retailPrice || a.retailPrice;
      const bPrice =
        b.cabinTypes[selectedCabinType]?.retailPrice || b.retailPrice;
      if (sortBy === "price") return aPrice - bPrice;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "duration") return a.duration - b.duration;
      return b.rating * 100 + b.reviews - (a.rating * 100 + a.reviews);
    }), [selectedCabinType, sortBy]);

  const { cruises, dateFilterRelaxed, showPopularFallback } = useMemo(() => {
    const allCruises = Object.values(mergedCruisesByCategory).flat();
    const categoryFiltered =
      selectedCategory === "All"
        ? allCruises
        : allCruises.filter((cruise) => cruise.category === selectedCategory);

    const destinationFiltered =
      requestedDestination === "All" ||
      selectedCategory !== requestedDestination
        ? categoryFiltered
        : categoryFiltered.filter(
            (cruise) => cruise.category === requestedDestination,
          );

    const portQuery = (searchState.departurePort || "").trim().toLowerCase();
    const dateFrom = searchState.departureDateFrom
      ? new Date(searchState.departureDateFrom)
      : null;
    const dateTo = searchState.departureDateTo
      ? new Date(searchState.departureDateTo)
      : null;

    const preDateFilter = destinationFiltered
      .filter(
        (cruise) =>
          !portQuery || cruise.departurePort.toLowerCase().includes(portQuery),
      )
      .filter((cruise) =>
        matchesDuration(cruise.duration, searchState.duration),
      );

    let dateFilterRelaxed = false;
    let filtered = preDateFilter;

    if (dateFrom || dateTo) {
      const dateFiltered = preDateFilter.filter((cruise) =>
        cruise.departureDates.some((date) => {
          const sailing = new Date(date);
          return (
            (!dateFrom || sailing >= dateFrom) &&
            (!dateTo || sailing <= dateTo)
          );
        }),
      );

      if (dateFiltered.length === 0 && preDateFilter.length > 0) {
        filtered = preDateFilter;
        dateFilterRelaxed = true;
      } else {
        filtered = dateFiltered;
      }
    }

    const sorted = sortCruises(filtered);

    if (sorted.length === 0) {
      return {
        cruises: sortCruises(allCruises),
        dateFilterRelaxed: false,
        showPopularFallback: allCruises.length > 0,
      };
    }

    return {
      cruises: sorted,
      dateFilterRelaxed,
      showPopularFallback: false,
    };
  }, [
    mergedCruisesByCategory,
    searchState,
    selectedCategory,
    requestedDestination,
    sortCruises,
  ]);

  const headerTitle =
    selectedCategory && selectedCategory !== "All"
      ? `${selectedCategory} Cruises`
      : "All Cruise Deals";

  const selectDepartureDate = (cruise, departureDate) => {
    const selectedCabin =
      cruise.cabinTypes[selectedCabinType] || cruise.cabinTypes.inside;
    const pricing = calculateCruisePrices(selectedCabin.retailPrice);
    navigate("/cruise-detail", {
      state: {
        cruise,
        selectedCabin,
        selectedCabinType,
        departureDate,
        pricing,
        paymentMode,
      },
    });
  };

  const renderCruiseCards = (cruiseList) => (
    <div className="grid gap-6 lg:grid-cols-2">
      {cruiseList.map((cruise) => {
        const selectedCabin =
          cruise.cabinTypes[selectedCabinType] || cruise.cabinTypes.inside;
        const pricing = calculateCruisePrices(selectedCabin.retailPrice);
        const pointsPreview = Math.round(
          (pricing.discountedPrice * 1.12) / 0.04,
        );

        return (
          <article
            key={cruise.id}
            className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="relative h-64 bg-slate-200">
              <img
                src={cruise.image}
                alt={cruise.name}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = imageFallback;
                }}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />
              <div className="absolute left-4 top-4 flex items-center gap-3 rounded-lg bg-white/95 px-3 py-2 shadow">
                <img
                  src={cruise.cruiseLineLogo}
                  alt={cruise.cruiseLine}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = logoFallback;
                  }}
                  className="h-8 w-8 rounded object-contain"
                />
                <span className="text-sm font-semibold text-slate-900">
                  {cruise.cruiseLine}
                </span>
              </div>
              <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/95 px-3 py-2 text-sm font-semibold text-slate-900 shadow">
                <FaStar className="text-yellow-400" />
                {cruise.rating.toFixed(1)}
              </div>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {cruise.name}
                </h2>
                <p className="mt-2 flex items-start gap-2 text-slate-700">
                  <FaShip className="mt-1 text-blue-600 shrink-0" />
                  <span>{cruise.route}</span>
                </p>
                <div className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  {cruise.duration} Nights
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Ports of call
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {cruise.itinerary.join(" -> ")}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {cruise.shipFeatures.slice(0, 5).map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {cabinOrder.map((type) => {
                  const cabin = cruise.cabinTypes[type];
                  if (!cabin) return null;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedCabinType(type)}
                      className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                        selectedCabinType === type
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-300 text-slate-700 hover:border-blue-300"
                      }`}
                    >
                      {cabin.name}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-slate-200 pt-5">
                {paymentMode === "cash" ? (
                  <div className="space-y-2">
                    <p className="text-sm text-slate-500">
                      Retail per person:{" "}
                      <span className="line-through">
                        ${pricing.retailPrice.toLocaleString()}
                      </span>
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      Member Price: $
                      {pricing.discountedPrice.toLocaleString()}/person
                    </p>
                    <p className="text-sm font-semibold text-green-700">
                      50% Member Savings
                    </p>
                    <p className="text-sm text-slate-600">
                      Includes taxes & fees
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-blue-600">
                      {pointsPreview.toLocaleString()} Points/person
                    </p>
                    <p className="text-sm font-semibold text-green-700">
                      $0.04 per point value
                    </p>
                    <p className="text-sm text-slate-600">
                      Includes taxes & fees
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setExpandedCruises((prev) => ({
                      ...prev,
                      [cruise.id]: !prev[cruise.id],
                    }))
                  }
                  className="mt-5 w-full rounded-full bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  {expandedCruises[cruise.id]
                    ? "Hide Dates"
                    : "View Dates & Book"}
                </button>
              </div>

              {expandedCruises[cruise.id] && (
                <div className="space-y-3 border-t border-slate-200 pt-5">
                  {cruise.departureDates.map((date) => (
                    <div
                      key={date}
                      className="grid gap-3 rounded-lg border border-slate-200 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 flex items-center gap-2">
                          <FaCalendarAlt className="text-blue-600" />
                          {formatDate(date)}
                        </p>
                        <p className="text-sm text-slate-600">
                          {cruise.duration} nights
                        </p>
                      </div>
                      <div className="font-semibold text-slate-900">
                        {paymentMode === "cash"
                          ? `$${pricing.discountedPrice.toLocaleString()}`
                          : `${pointsPreview.toLocaleString()} pts`}
                      </div>
                      <button
                        type="button"
                        onClick={() => selectDepartureDate(cruise, date)}
                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                      >
                        Select This Date
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <Loading
        title="Searching for cruises..."
        message="Finding the best sailings for your trip."
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{headerTitle}</h1>
            <p className="text-slate-600 mt-2">
              {searchState.departurePort
                ? `Departing from ${searchState.departurePort}`
                : "Flexible departure ports"}
              {searchState.duration ? ` - ${searchState.duration}` : ""}
            </p>
          </div>

          <label className="flex flex-col text-sm font-medium text-slate-700">
            Sort
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="mt-1 border border-slate-300 rounded-lg px-4 py-3 bg-white text-slate-900"
            >
              <option value="recommended">Recommended</option>
              <option value="price">Price: Low to High</option>
              <option value="rating">Highest Rated</option>
              <option value="duration">Duration</option>
            </select>
          </label>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {visibleCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold border ${
                selectedCategory === category
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-slate-300 text-slate-700 hover:border-blue-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[auto_1fr] md:items-center">
            <div className="inline-flex rounded-full border border-slate-300 bg-slate-100 p-1 w-full md:w-auto">
              {["cash", "points"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMode(mode)}
                  className={`flex-1 md:flex-none rounded-full px-5 py-2 text-sm font-semibold capitalize ${
                    paymentMode === mode
                      ? "bg-blue-600 text-white"
                      : "text-slate-700"
                  }`}
                >
                  Pay with {mode === "cash" ? "Cash" : "Points"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-blue-800 font-medium">
              <FaCheckCircle className="shrink-0" />
              <span>
                {paymentMode === "cash"
                  ? "50% Member Savings on All Cruises"
                  : "Points Value: $0.04 per point"}
              </span>
            </div>
          </div>
        </div>

        {dateFilterRelaxed && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Showing all available sailings — no exact matches for your selected
            dates.
          </div>
        )}

        {showPopularFallback ? (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
              <h2 className="text-xl font-semibold text-slate-900">
                No cruises found
              </h2>
              <p className="text-slate-600 mt-2">
                Try a wider date window, another port, or All destinations.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Here are some popular cruises you might like instead
              </h2>
              {renderCruiseCards(cruises)}
            </div>
          </div>
        ) : cruises.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              No cruises found
            </h2>
            <p className="text-slate-600 mt-2">
              Try a wider date window, another port, or All destinations.
            </p>
          </div>
        ) : (
          renderCruiseCards(cruises)
        )}
      </div>
    </div>
  );
};

export default CruiseSearch;
