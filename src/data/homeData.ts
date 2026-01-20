// Import ALL images from the assets/images directory recursively
// This includes dpmt-images, Baristha-sadaya, and any other folders you add.
const allAssets = import.meta.glob('../assets/images/**/*.{png,jpg,jpeg,svg}', { 
  eager: true, 
  import: 'default' 
});

// Helper function to get an image by filename (partial or full)
// You can optionally pass a specific folder name to narrow down the search.
const getImage = (searchName: string, folderName?: string) => {
  // Filter keys by folder if provided
  const candidateKeys = folderName 
    ? Object.keys(allAssets).filter(key => key.includes(folderName))
    : Object.keys(allAssets);

  // 1. Try to find a file that contains the search string (case-insensitive)
  const foundKey = candidateKeys.find(path => 
    path.toLowerCase().includes(searchName.toLowerCase())
  );

  if (foundKey) {
    return allAssets[foundKey];
  }

  // 2. Fallback: Use "Pabitra parajuli" as the default if looking in dpmt or generally
  // (Preserving previous logic for dpmt fallback)
  const defaultKey = Object.keys(allAssets).find(path => 
    path.toLowerCase().includes('pabitra')
  );
  
  if (defaultKey) {
    return allAssets[defaultKey];
  }

  // 3. Last resort placeholder
  return 'https://placehold.co/160x160';
};

export const activities = [
  { title: 'सामाजिक कार्यक्रम', img: 'https://placehold.co/400x260' },
  { title: 'सांस्कृतिक आयोजन', img: 'https://placehold.co/400x260' },
  { title: 'स्वास्थ्य सेवा', img: 'https://placehold.co/400x260' },
  { title: 'युवाओं के लिए', img: 'https://placehold.co/400x260' },
  { title: 'महिला मंच', img: 'https://placehold.co/400x260' },
  { title: 'शैक्षणिक सहयोग', img: 'https://placehold.co/400x260' },
  { title: 'रक्तदान शिविर', img: 'https://placehold.co/400x260' },
  { title: 'अन्न वितरण', img: 'https://placehold.co/400x260' },
  { title: 'आवास सहायता', img: 'https://placehold.co/400x260' }
]

export const leaderQuotes = [
  { name: 'Kewal Das', role: 'President', img: 'https://placehold.co/160x160', quote: 'समाज सेवा हमारा धर्म है।' },
  { name: 'Hari Om', role: 'Vice President', img: 'https://placehold.co/160x160', quote: 'एकता में शक्ति है।' },
  { name: 'Vikas Patel', role: 'Secretary', img: 'https://placehold.co/160x160', quote: 'युवा ही भविष्य हैं।' }
]

export const leaders = [
  { name: 'गौरव पटेल', role: 'अध्यक्ष', img: 'https://placehold.co/160x160' },
  { name: 'हितेश सोनी', role: 'उपाध्यक्ष', img: 'https://placehold.co/160x160' },
  { name: 'नरेश जैन', role: 'महामंत्री', img: 'https://placehold.co/160x160' },
  { name: 'राजेश गुप्ता', role: 'कोषाध्यक्ष', img: 'https://placehold.co/160x160' },
  { name: 'विनोद शर्मा', role: 'सदस्य', img: 'https://placehold.co/160x160' },
  { name: 'राहुल अग्रवाल', role: 'सदस्य', img: 'https://placehold.co/160x160' }
]

export const staff = [
  { name: 'ऑफिस 1', role: 'स्टाफ', img: 'https://placehold.co/160x160' },
  { name: 'ऑफिस 2', role: 'स्टाफ', img: 'https://placehold.co/160x160' },
  { name: 'ऑफिस 3', role: 'स्टाफ', img: 'https://placehold.co/160x160' },
  { name: 'ऑफिस 4', role: 'स्टाफ', img: 'https://placehold.co/160x160' },
  { name: 'ऑफिस 5', role: 'स्टाफ', img: 'https://placehold.co/160x160' },
  { name: 'ऑफिस 6', role: 'स्टाफ', img: 'https://placehold.co/160x160' }
]

export const dpmt = [
  {
    name: "श्री पार्वता बेल्वासे",
    role: "संयोजक",
    img: getImage("Parvata"),
  },
  {
    name: "श्री पावित्रा पराजुली",
    role: "सह संयोजक",
    img: getImage("Pabitra"),
  },
  {
    name: "श्री सुजता भण्डारी ",
    role: "सचिव",
    img: getImage("Sujata"),
  },
  {
    name: "श्री रेनु क्षेत्री",
    role: "सदस्य",
    img: getImage("Renu"),
  },
  {
    name: "श्री मिना पाण्डे",
    role: "सदस्य",
    img: getImage("Mina"),
  },
  {
    name: "श्री सरस्वती पाण्डे",
    role: "सदस्य",
    img: getImage("Saraswati"),
  },
  {
    name: "श्री विष्णुदेवी खराल",
    role: "सदस्य",
    img: getImage("Vishnu"),
  },
  {
    name: "श्री मन्दिरा शर्मा",
    role: "सदस्य",
    img: getImage("Mandira"),
  },
  {
    name: "श्री रमा ज्ञवाली",
    role: "सदस्य",
    img: getImage("Rama"),
  },
  {
    name: "श्री अर्जुनराज धीमीरे",
    role: "सदस्य",
    img: getImage("Arjun"),
  },
  {
    name: "श्री गंगाधर अधिकारी",
    role: "सदस्य",
    img: getImage("Ganga"),
  },
  {
    name: "श्री लक्ष्मी थापा",
    role: "सदस्य",
    img: getImage("Laxmi"),
  },
  {
    name: "श्री यमुना अधिकारी ",
    role: "सदस्य",
    img: getImage("Yamuna"),
  },
  {
    name: "श्री संगीता भुसाल",
    role: "सदस्य",
    img: getImage("Sangita"),
  },
  {
    name: "श्री सावित्रा खत्री",
    role: "स्सदस्य",
    img: getImage("Savitra"),
  },
];
