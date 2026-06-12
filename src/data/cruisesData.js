export const enrichedCruiseData = {
  Caribbean: [
    {
      id: "CR-CAR-001",
      name: "Harmony of the Seas",
      cruiseLine: "Royal Caribbean",
      cruiseLineLogo: "https://logo.clearbit.com/royalcaribbean.com",
      route: "Fort Lauderdale → Nassau → St. Maarten → St. Thomas",
      departurePort: "Fort Lauderdale, FL",
      duration: 7,
      category: "Caribbean",
      image: "https://www.royalcaribbean.com/content/dam/royal/resources/fleet/fleet-harmony-of-the-seas.jpg",
      rating: 4.7,
      reviews: 2841,
      retailPrice: 1299,
      itinerary: ["Fort Lauderdale", "Nassau", "St. Maarten", "St. Thomas", "San Juan"],
      shipFeatures: ["18 Decks", "5,400 Guests", "Water Park", "Rock Climbing", "Casino"],
      cabinTypes: {
        inside: { name: "Inside", retailPrice: 1299 },
        outside: { name: "Ocean View", retailPrice: 1599 },
        balcony: { name: "Balcony", retailPrice: 1999 },
        suite: { name: "Suite", retailPrice: 3499 }
      },
      departureDates: ["2025-09-14", "2025-10-05", "2025-11-02", "2025-12-07", "2026-01-11"],
      includes: ["All meals", "Entertainment", "Kids club", "Fitness center"]
    },
    {
      id: "CR-CAR-002",
      name: "Norwegian Encore",
      cruiseLine: "Norwegian Cruise Line",
      cruiseLineLogo: "https://logo.clearbit.com/ncl.com",
      route: "Miami → Key West → Cozumel → Belize → Roatan",
      departurePort: "Miami, FL",
      duration: 7,
      category: "Caribbean",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Noordam.jpg/1200px-Noordam.jpg",
      rating: 4.5,
      reviews: 1923,
      retailPrice: 1099,
      itinerary: ["Miami", "Key West", "Cozumel", "Belize City", "Roatan"],
      shipFeatures: ["20 Decks", "3,998 Guests", "Go-Kart Track", "Laser Tag", "Casino"],
      cabinTypes: {
        inside: { name: "Inside", retailPrice: 1099 },
        outside: { name: "Ocean View", retailPrice: 1349 },
        balcony: { name: "Balcony", retailPrice: 1749 },
        suite: { name: "Suite", retailPrice: 2999 }
      },
      departureDates: ["2025-09-07", "2025-10-12", "2025-11-16", "2025-12-14", "2026-02-08"],
      includes: ["All meals", "Entertainment", "Spa access", "Fitness center"]
    }
  ],
  Mediterranean: [
    {
      id: "CR-MED-001",
      name: "MSC Bellissima",
      cruiseLine: "MSC Cruises",
      cruiseLineLogo: "https://logo.clearbit.com/msccruises.com",
      route: "Barcelona → Marseille → Genoa → Naples → Palermo → Valletta",
      departurePort: "Barcelona, Spain",
      duration: 7,
      category: "Mediterranean",
      image: "https://krfbe.twic.pics/library/original/aussenansicht.4erir5ax.jpg?twic=v1/cover=4:2.25/resize=768",
      rating: 4.6,
      reviews: 1456,
      retailPrice: 1599,
      itinerary: ["Barcelona", "Marseille", "Genoa", "Naples", "Palermo", "Valletta"],
      shipFeatures: ["19 Decks", "5,686 Guests", "Waterslides", "Theater", "Casino"],
      cabinTypes: {
        inside: { name: "Inside", retailPrice: 1599 },
        outside: { name: "Ocean View", retailPrice: 1899 },
        balcony: { name: "Balcony", retailPrice: 2299 },
        suite: { name: "Suite", retailPrice: 3999 }
      },
      departureDates: ["2025-09-20", "2025-10-18", "2025-11-08", "2026-03-14", "2026-04-11"],
      includes: ["All meals", "Entertainment", "Port charges", "Fitness center"]
    },
    {
      id: "CR-MED-002",
      name: "Celebrity Silhouette",
      cruiseLine: "Celebrity Cruises",
      cruiseLineLogo: "https://logo.clearbit.com/celebritycruises.com",
      route: "Athens → Mykonos → Santorini → Rhodes → Kusadasi → Istanbul",
      departurePort: "Athens (Piraeus), Greece",
      duration: 10,
      category: "Mediterranean",
      image: "https://cruiseindustrynews.com/wp-content/uploads/2018/09/goldenprincess.jpg.webp",
      rating: 4.8,
      reviews: 987,
      retailPrice: 2199,
      itinerary: ["Athens", "Mykonos", "Santorini", "Rhodes", "Kusadasi", "Istanbul"],
      shipFeatures: ["15 Decks", "2,850 Guests", "Rooftop Pool", "Fine Dining", "Spa"],
      cabinTypes: {
        inside: { name: "Inside", retailPrice: 2199 },
        outside: { name: "Ocean View", retailPrice: 2599 },
        balcony: { name: "Balcony", retailPrice: 3099 },
        suite: { name: "Suite", retailPrice: 5499 }
      },
      departureDates: ["2025-09-28", "2025-10-26", "2026-04-19", "2026-05-17", "2026-06-14"],
      includes: ["All meals", "Specialty dining", "Entertainment", "Port charges"]
    }
  ],
  Alaska: [
    {
      id: "CR-ALA-001",
      name: "Grand Princess",
      cruiseLine: "Princess Cruises",
      cruiseLineLogo: "https://logo.clearbit.com/princess.com",
      route: "Seattle → Juneau → Skagway → Glacier Bay → Ketchikan → Vancouver",
      departurePort: "Seattle, WA",
      duration: 7,
      category: "Alaska",
      image: "https://www.cruisemapper.com/images/ships/697-large-8a0e1141fd37fa5b98d5bb769ba1a7cc.jpg",
      rating: 4.5,
      reviews: 1102,
      retailPrice: 1799,
      itinerary: ["Seattle", "Juneau", "Skagway", "Glacier Bay", "Ketchikan", "Vancouver"],
      shipFeatures: ["18 Decks", "2,600 Guests", "Glacier Viewing Deck", "Spa", "Casino"],
      cabinTypes: {
        inside: { name: "Inside", retailPrice: 1799 },
        outside: { name: "Ocean View", retailPrice: 2099 },
        balcony: { name: "Balcony", retailPrice: 2599 },
        suite: { name: "Suite", retailPrice: 4299 }
      },
      departureDates: ["2025-09-06", "2025-09-20", "2025-10-04", "2026-05-09", "2026-05-23"],
      includes: ["All meals", "Entertainment", "Port charges", "Glacier viewing"]
    }
  ],
  Bahamas: [
    {
      id: "CR-BAH-001",
      name: "Carnival Vista",
      cruiseLine: "Carnival Cruise Line",
      cruiseLineLogo: "https://logo.clearbit.com/carnival.com",
      route: "Miami → Nassau → Freeport → Half Moon Cay",
      departurePort: "Miami, FL",
      duration: 5,
      category: "Bahamas",
      image: "https://static.vesselfinder.net/ship-photo/9229659-310376000-d8f654ac46fed19492ee563b98e67965/1?v1",
      rating: 4.3,
      reviews: 2156,
      retailPrice: 699,
      itinerary: ["Miami", "Nassau", "Freeport", "Half Moon Cay"],
      shipFeatures: ["15 Decks", "3,954 Guests", "WaterWorks", "SkyRide", "Casino"],
      cabinTypes: {
        inside: { name: "Inside", retailPrice: 699 },
        outside: { name: "Ocean View", retailPrice: 899 },
        balcony: { name: "Balcony", retailPrice: 1099 },
        suite: { name: "Suite", retailPrice: 2299 }
      },
      departureDates: ["2025-09-11", "2025-10-09", "2025-11-06", "2025-12-04", "2026-01-08"],
      includes: ["All meals", "Entertainment", "Waterpark access"]
    }
  ],
  Europe: [
    {
      id: "CR-EUR-001",
      name: "Queen Mary 2",
      cruiseLine: "Cunard",
      cruiseLineLogo: "https://logo.clearbit.com/cunard.com",
      route: "Southampton → Lisbon → Gibraltar → Barcelona → Marseille → Rome",
      departurePort: "Southampton, UK",
      duration: 14,
      category: "Europe",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Noordam.jpg/1200px-Noordam.jpg",
      rating: 4.9,
      reviews: 743,
      retailPrice: 3299,
      itinerary: ["Southampton", "Lisbon", "Gibraltar", "Barcelona", "Marseille", "Rome"],
      shipFeatures: ["13 Decks", "2,691 Guests", "White Star Service", "Library", "Ballroom"],
      cabinTypes: {
        inside: { name: "Inside", retailPrice: 3299 },
        outside: { name: "Ocean View", retailPrice: 3999 },
        balcony: { name: "Balcony", retailPrice: 4799 },
        suite: { name: "Suite", retailPrice: 8999 }
      },
      departureDates: ["2025-10-03", "2026-01-09", "2026-03-20", "2026-05-01"],
      includes: ["All meals", "White glove service", "Entertainment", "Port charges"]
    }
  ],
  Hawaii: [
    {
      id: "CR-HAW-001",
      name: "Pride of America",
      cruiseLine: "Norwegian Cruise Line",
      cruiseLineLogo: "https://logo.clearbit.com/ncl.com",
      route: "Honolulu → Kahului → Hilo → Kona → Nawiliwili → Honolulu",
      departurePort: "Honolulu, HI",
      duration: 7,
      category: "Hawaii",
      image: "https://cruiseindustrynews.com/wp-content/uploads/2018/09/goldenprincess.jpg.webp",
      rating: 4.6,
      reviews: 889,
      retailPrice: 1899,
      itinerary: ["Honolulu", "Kahului (Maui)", "Hilo (Big Island)", "Kona", "Nawiliwili (Kauai)"],
      shipFeatures: ["15 Decks", "2,186 Guests", "Multiple Pools", "Spa", "Dining"],
      cabinTypes: {
        inside: { name: "Inside", retailPrice: 1899 },
        outside: { name: "Ocean View", retailPrice: 2199 },
        balcony: { name: "Balcony", retailPrice: 2699 },
        suite: { name: "Suite", retailPrice: 4499 }
      },
      departureDates: ["2025-09-13", "2025-10-11", "2025-11-08", "2025-12-06", "2026-01-10"],
      includes: ["All meals", "Entertainment", "Inter-island travel"]
    }
  ]
};

export const cruiseCategories = [
  "All",
  "Alaska",
  "Caribbean",
  "Europe",
  "Bahamas",
  "Mediterranean",
  "Mexico",
  "Australia",
  "Asia",
  "South America",
  "Transatlantic",
  "Canada",
  "England",
  "Central America",
  "MiddleEast",
  "Panama Canal",
  "South Pacific",
  "Transpacific",
  "Baltic Sea",
  "Hawaii",
  "Greek Isles",
  "Norwegian Fjords",
  "New Zealand",
  "Iceland",
  "Dubai",
  "Singapore",
  "Japan",
  "Hong Kong",
  "Vietnam",
  "Thailand",
  "Fiji",
  "Tahiti",
  "Malaysia",
  "Indian Ocean",
  "Red Sea",
  "Seychelles",
  "Maldives",
  "Sri Lanka",
  "Chile",
  "Argentina",
  "Brazil",
  "Costa Rica",
  "Puerto Rico",
  "Barbados",
  "Jamaica",
  "St. Lucia",
  "St. Maarten",
  "Dominican Republic"
];
