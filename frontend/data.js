// ============================================================
//  DATA.JS — MediSense AI Dataset File
//  Contains: Hinglish map, Symptom categories, Hospital data
//  Edit this file to update medical data, add hospitals, etc.
// ============================================================


// ============================================================
//  STORAGE KEYS
//  These are the localStorage key names used throughout the app
// ============================================================
const SK = {
  USERS:   'ms_users_v2',    // all user accounts
  SESSION: 'ms_session_v2', // currently logged-in user
  CHATS:   'ms_chats_v2',   // chat history prefix
  PROFILE: 'ms_profile_v2'  // profile data
};


// ============================================================
//  HINGLISH MAP
//  Maps common Hinglish words/phrases to English medical terms
//  Add more entries as: "hinglish phrase": "english translation"
//  If the value is "" (empty string), the word is removed (filler words)
// ============================================================
const HM = {
  // Fever
  "bukhaar": "fever",
  "bukhar": "fever",
  "tez bukhaar": "high fever",
  "garmi lag rahi": "fever",
  "badan garam": "fever",
  "badan mein garmi": "fever",

  // Chills & Sweating
  "thanda lag raha": "chills",
  "kaanp raha": "chills",
  "thithurana": "chills",
  "paseena": "sweating",
  "pasina": "sweating",

  // Head
  "sar dard": "headache",
  "sardard": "headache",
  "sir dard": "headache",
  "sir me dard": "headache",
  "matha dard": "headache",
  "chakkar": "dizziness",
  "chakkar aa raha": "dizziness",
  "aankhon ke peeche dard": "pain behind eyes",

  // Throat & Nose
  "galaa dard": "sore throat",
  "gale mein dard": "sore throat",
  "gala kharab": "sore throat",
  "naak bahna": "runny nose",
  "naak se paani": "runny nose",
  "naak band": "nasal congestion",
  "nazla": "cold",
  "zukhaam": "cold",
  "zukham": "cold",
  "sardi": "cold",

  // Cough
  "khansi": "cough",
  "khaansi": "cough",
  "sukhi khansi": "dry cough",
  "chheenk": "sneezing",

  // Body & Joints
  "badan dard": "body pain",
  "badan toota": "body pain",
  "ang toot rahe": "body pain",
  "puri body mein dard": "body pain",
  "kamar dard": "back pain",
  "peeth dard": "back pain",
  "jodo mein dard": "joint pain",
  "ghutne mein dard": "joint pain",

  // Weakness & Fatigue
  "kamzori": "weakness",
  "kamjori": "weakness",
  "takaat nahi": "weakness",
  "thakaan": "fatigue",
  "thakan": "fatigue",
  "bahut thak gaya": "severe fatigue",

  // Stomach & Digestion
  "pet dard": "stomach pain",
  "pet mein dard": "stomach pain",
  "pait dard": "stomach pain",
  "ulti": "vomiting",
  "ulti ho rahi": "vomiting",
  "qaai": "vomiting",
  "ubkaayi": "nausea",
  "jee machlana": "nausea",
  "ji machal raha": "nausea",
  "dast": "diarrhea",
  "loose motion": "diarrhea",
  "qabd": "constipation",
  "kabz": "constipation",
  "bhook nahi": "loss of appetite",
  "kuch khaane ka mann nahi": "loss of appetite",

  // Breathing & Chest
  "saans nahi aa rahi": "shortness of breath",
  "saans lene mein takleef": "shortness of breath",
  "saans phoolna": "shortness of breath",
  "seena dard": "chest pain",
  "chhaati mein dard": "chest pain",
  "seene mein dard": "chest pain",

  // Skin
  "daane": "rash",
  "daane nikle": "rash",
  "kharish": "itching",
  "khujli": "itching",
  "peeli chamdi": "yellow skin",
  "aankhein peeli": "yellow skin",

  // Urinary
  "peshab mein jalan": "burning urination",
  "baar baar peshab": "frequent urination",

  // Filler words (no translation needed — just remove them)
  "mujhe": "",
  "mujhko": "",
  "mere ko": "",
  "ho raha hai": "",
  "ho rahi hai": "",
  "lag raha hai": "",
  "kaafi": "",
  "kafi": "",
  "aur": "and",
  "ya": "or",
  "bhi": "",
  "bahut": "severe",
  "thoda": "mild",
  "kal se": "since yesterday",
  "2 din se": "since 2 days",
  "3 din se": "since 3 days",

  // --- NEW ADDITIONS ---
  "jalan": "burning sensation",
  "pet jalna": "heartburn",
  "chhaati jalna": "heartburn",
  "khatti dakar": "acid reflux",
  "gas": "bloating",
  "pet phoolna": "bloating",
  "aankh laal": "red eyes",
  "kaan dard": "ear pain",
  "gale me kharash": "sore throat",
  "balgam": "phlegm",
  "soojan": "swelling",
  "sujan": "swelling",
  "phode": "blisters",
  "neend nahi": "insomnia",
  "dil dhadakna": "palpitations",
  "vajan girna": "weight loss",
  "khoon": "blood"
};


// ============================================================
//  SYMPTOM CATEGORIES
//  Each category has: name, icon, bg color, text color, symptom list
//  Each symptom has: n (name), s (severity: 'low'/'medium'/'high')
//  To add a new category: copy a block and edit it
// ============================================================
const SymData = [
  {
    name: 'Fever Conditions',
    icon: '🌡️',
    bg: '#fff5e6',
    color: '#d97706',
    syms: [
      { n: 'Fever',                s: 'medium' },
      { n: 'High Fever',           s: 'high'   },
      { n: 'Intermittent Fever',   s: 'medium' },
      { n: 'Chills',               s: 'medium' }
    ]
  },
  {
    name: 'Respiratory',
    icon: '😷',
    bg: '#e0f2fe',
    color: '#0369a1',
    syms: [
      { n: 'Cough',                s: 'low'    },
      { n: 'Shortness of Breath',  s: 'high'   },
      { n: 'Sore Throat',          s: 'low'    },
      { n: 'Runny Nose',           s: 'low'    },
      { n: 'Wheezing',             s: 'high'   }
    ]
  },
  {
    name: 'Head & Neurological',
    icon: '🧠',
    bg: '#f3e8ff',
    color: '#7c3aed',
    syms: [
      { n: 'Headache',             s: 'medium' },
      { n: 'Severe Headache',      s: 'high'   },
      { n: 'Dizziness',            s: 'medium' },
      { n: 'Confusion',            s: 'high'   },
      { n: 'Vision Changes',       s: 'high'   }
    ]
  },
  {
    name: 'Digestive System',
    icon: '🍽️',
    bg: '#dcfce7',
    color: '#166534',
    syms: [
      { n: 'Stomach Pain',         s: 'medium' },
      { n: 'Nausea',               s: 'low'    },
      { n: 'Vomiting',             s: 'medium' },
      { n: 'Diarrhea',             s: 'medium' },
      { n: 'Constipation',         s: 'low'    },
      { n: 'Loss of Appetite',     s: 'low'    }
    ]
  },
  {
    name: 'Muscles & Bones',
    icon: '🦴',
    bg: '#fef3c7',
    color: '#92400e',
    syms: [
      { n: 'Body Pain',            s: 'medium' },
      { n: 'Joint Pain',           s: 'medium' },
      { n: 'Back Pain',            s: 'medium' },
      { n: 'Fatigue',              s: 'low'    },
      { n: 'Weakness',             s: 'medium' }
    ]
  },
  {
    name: 'Skin Conditions',
    icon: '🔴',
    bg: '#fce7f3',
    color: '#be185d',
    syms: [
      { n: 'Skin Rash',            s: 'medium' },
      { n: 'Itching',              s: 'low'    },
      { n: 'Yellow Skin',          s: 'high'   },
      { n: 'Blisters',             s: 'medium' },
      { n: 'Swelling',             s: 'medium' }
    ]
  },
  {
    name: 'Heart & Cardiovascular',
    icon: '❤️',
    bg: '#fee2e2',
    color: '#991b1b',
    syms: [
      { n: 'Chest Pain',           s: 'high'   },
      { n: 'Palpitations',         s: 'high'   },
      { n: 'Leg Swelling',         s: 'medium' }
    ]
  },
  {
    name: 'Urinary System',
    icon: '💧',
    bg: '#dbeafe',
    color: '#1d4ed8',
    syms: [
      { n: 'Burning Urination',    s: 'medium' },
      { n: 'Frequent Urination',   s: 'medium' },
      { n: 'Blood in Urine',       s: 'high'   }
    ]
  }
];


// ============================================================
//  HOSPITAL DATA (Jaipur)
//  Add more hospitals by copying a block below and editing values
//  Fields:
//    id       — unique number
//    name     — hospital name
//    type     — "government" | "private" | "clinic"
//    address  — full address string
//    rating   — 0.0 to 5.0
//    reviews  — number of reviews (integer)
//    distance — km from city center (string)
//    open     — true = open now, false = closed
//    hours    — "24/7" or "8AM–10PM" etc.
//    phone    — main phone number
//    emergency— emergency number (or null if no emergency)
//    depts    — array of department names
//    beds     — number of beds
// ============================================================
const HospData = [
  {
    id: 1,
    name: "Sawai Man Singh (SMS) Hospital",
    type: "government",
    address: "Tonk Road, Gangwal Park, Jaipur",
    rating: 4.2,
    reviews: 2840,
    distance: "2.1",
    open: true,
    hours: "24/7",
    phone: "0141-2518888",
    emergency: "0141-2511013",
    depts: ["General Medicine", "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Emergency"],
    beds: 2400
  },
  {
    id: 2,
    name: "Fortis Escorts Hospital",
    type: "private",
    address: "Jawaharlal Nehru Marg, Near Malviya Nagar",
    rating: 4.5,
    reviews: 1560,
    distance: "3.4",
    open: true,
    hours: "24/7",
    phone: "0141-2547000",
    emergency: "0141-2547001",
    depts: ["Cardiology", "Oncology", "Orthopedics", "Neurosurgery", "ICU"],
    beds: 350
  },
  {
    id: 3,
    name: "Mahatma Gandhi Hospital",
    type: "government",
    address: "Sitabari, Tonk Road, Jaipur",
    rating: 4.0,
    reviews: 980,
    distance: "4.2",
    open: true,
    hours: "24/7",
    phone: "0141-2511015",
    emergency: "0141-2511016",
    depts: ["General Medicine", "Surgery", "Gynecology", "Pediatrics", "Emergency"],
    beds: 750
  },
  {
    id: 4,
    name: "Narayana Multispeciality Hospital",
    type: "private",
    address: "Sector 28, Near Gopalpura Bypass",
    rating: 4.3,
    reviews: 1230,
    distance: "5.1",
    open: true,
    hours: "24/7",
    phone: "0141-7100100",
    emergency: "0141-7100101",
    depts: ["Cardiology", "Nephrology", "Transplant", "Oncology", "Orthopedics"],
    beds: 200
  },
  {
    id: 5,
    name: "Eternal Heart Care Centre",
    type: "private",
    address: "Jagatpura Road, Malviya Nagar",
    rating: 4.6,
    reviews: 875,
    distance: "4.8",
    open: true,
    hours: "24/7",
    phone: "0141-3015555",
    emergency: "0141-3015556",
    depts: ["Cardiology", "Cardiac Surgery", "Cath Lab", "ICU", "Electrophysiology"],
    beds: 120
  },
  {
    id: 6,
    name: "City Pulse Clinic",
    type: "clinic",
    address: "B-14, Vaishali Nagar, Jaipur",
    rating: 4.1,
    reviews: 520,
    distance: "1.5",
    open: true,
    hours: "8AM–10PM",
    phone: "0141-2350100",
    emergency: null,
    depts: ["General Medicine", "Pediatrics", "Pathology", "Pharmacy"],
    beds: 20
  },
  {
    id: 7,
    name: "Rukmani Birla Hospital",
    type: "private",
    address: "Gopalpura Mode, Jaipur",
    rating: 4.4,
    reviews: 1450,
    distance: "5.7",
    open: false,
    hours: "8AM–8PM",
    phone: "0141-3056000",
    emergency: "0141-3056001",
    depts: ["Gynecology", "Obstetrics", "Neonatology", "Pediatrics", "IVF"],
    beds: 180
  },
  {
    id: 8,
    name: "Santokba Durlabhji Memorial Hospital",
    type: "private",
    address: "Bhawani Singh Marg, C-Scheme",
    rating: 4.3,
    reviews: 2100,
    distance: "3.0",
    open: true,
    hours: "24/7",
    phone: "0141-2566251",
    emergency: "0141-2566252",
    depts: ["Oncology", "Cardiology", "Orthopedics", "Endocrinology", "Gastrology"],
    beds: 400
  }
];


// ============================================================
//  DISEASE RULES (for local/offline diagnosis)
//  Used when Claude AI is unavailable
//  Fields:
//    name  — disease display name (Hindi in brackets optional)
//    match — symptom keywords to look for
//    min   — minimum number of matching symptoms to trigger
//    sev   — severity: "Mild" | "Moderate" | "Serious" | "Emergency"
//    doc   — which doctor/test to see
//    rec   — expected recovery time
//    meds  — basic medicine/care suggestions
// ============================================================
const DISEASE_RULES = [
  {
    name: 'Dengue Fever',
    match: ['fever', 'headache', 'joint pain', 'pain behind eyes', 'rash', 'severe'],
    min: 3,
    sev: 'Serious',
    doc: 'General Physician + Blood Test (CBC, Platelet)',
    rec: '7-14 days',
    meds: 'Paracetamol (Crocin 650), ORS, Lots of fluids, Papaya leaf extract. NO Ibuprofen/Aspirin.'
  },
  {
    name: 'Malaria',
    match: ['chills', 'fever', 'sweating', 'headache', 'weakness'],
    min: 3,
    sev: 'Serious',
    doc: 'General Physician (Blood Smear Test)',
    rec: '3-7 days with meds',
    meds: 'Anti-malarials prescribed by doctor. Paracetamol for fever.'
  },
  {
    name: 'Typhoid',
    match: ['fever', 'stomach pain', 'loss of appetite', 'headache', 'weakness'],
    min: 3,
    sev: 'Serious',
    doc: 'General Physician (Widal Test, Blood Culture)',
    rec: '2-3 weeks',
    meds: 'Antibiotics by doctor. Liquid diet. Avoid solid and spicy food initially.'
  },
  {
    name: 'COVID-19 / Viral Pneumonia',
    match: ['cough', 'fever', 'shortness of breath', 'breathless', 'fatigue', 'loss of taste', 'sore throat'],
    min: 3,
    sev: 'Serious',
    doc: 'Pulmonologist / General Physician + RTPCR Test',
    rec: '7-21 days',
    meds: 'Paracetamol, Vitamin C/D, zinc. Isolate. Seek help if O2 < 94%.'
  },
  {
    name: 'Asthma Exacerbation',
    match: ['shortness of breath', 'breathless', 'wheezing', 'cough', 'chest tight'],
    min: 2,
    sev: 'Serious',
    doc: 'Pulmonologist',
    rec: 'Immediate relief with inhalers',
    meds: 'Use your prescribed inhaler. Sit upright. If no relief in 15 mins, head to ER.'
  },
  {
    name: 'Acidity / GERD',
    match: ['stomach pain', 'heartburn', 'acid reflux', 'burning sensation', 'nausea', 'bloating'],
    min: 2,
    sev: 'Mild',
    doc: 'General Physician',
    rec: '1-2 days',
    meds: 'Antacids (Gelusil / Digene) or Pantoprazole. Avoid spicy/oily food, do not lie down immediately after eating.'
  },
  {
    name: 'Common Cold & Flu',
    match: ['cold', 'cough', 'sore throat', 'runny nose', 'sneezing', 'fever', 'phlegm'],
    min: 2,
    sev: 'Mild',
    doc: 'General Physician if >5 days',
    rec: '5-7 days',
    meds: 'Cetirizine (antihistamine), Crocin, steam inhalation, warm liquids.'
  },
  {
    name: 'Gastroenteritis (Food Poisoning)',
    match: ['stomach pain', 'vomiting', 'diarrhea', 'nausea', 'fever'],
    min: 2,
    sev: 'Moderate',
    doc: 'General Physician if >24 hrs or blood in stool',
    rec: '3-5 days',
    meds: 'ORS (Electral), Ondansetron for vomiting. Bland diet (khichdi, curd).'
  },
  {
    name: 'Jaundice / Hepatitis',
    match: ['yellow skin', 'jaundice', 'fatigue', 'loss of appetite', 'stomach pain', 'nausea'],
    min: 2,
    sev: 'Serious',
    doc: 'Gastroenterologist (LFT, Hepatitis panel)',
    rec: '4-8 weeks',
    meds: 'Doctor-prescribed only. Avoid oily/spicy food. High liquid and carb diet.'
  },
  {
    name: 'Kidney Stones',
    match: ['stomach pain', 'back pain', 'vomiting', 'nausea', 'burning urination', 'blood'],
    min: 3,
    sev: 'Serious',
    doc: 'Urologist (Ultrasound KUB)',
    rec: 'Depends on stone size',
    meds: 'Painkillers (prescribed). Drink 3-4 liters of water daily.'
  },
  {
    name: 'UTI (Urinary Tract Infection)',
    match: ['burning urination', 'frequent urination', 'fever', 'stomach pain'],
    min: 2,
    sev: 'Moderate',
    doc: 'General Physician (Urine Routine & Culture)',
    rec: '5-7 days with antibiotics',
    meds: 'Antibiotics by doctor. Drink 3+ liters water. Avoid caffeine.'
  },
  {
    name: 'Anemia / Vitamin Deficiency',
    match: ['fatigue', 'weakness', 'dizziness', 'loss of appetite', 'palpitations'],
    min: 3,
    sev: 'Moderate',
    doc: 'General Physician (CBC, Vitamin B12, D3 tests)',
    rec: 'Weeks to months',
    meds: 'Iron/B12 supplements, leafy greens, dates.'
  },
  {
    name: 'Arthritis / Joint Inflammation',
    match: ['joint pain', 'back pain', 'body pain', 'swelling', 'stiffness'],
    min: 2,
    sev: 'Moderate',
    doc: 'Orthopedician / Rheumatologist',
    rec: 'Ongoing management',
    meds: 'Ibuprofen (if not contraindicated), hot/cold packs, physiotherapy.'
  },
  {
    name: 'Migraine',
    match: ['headache', 'nausea', 'dizziness', 'vomiting'],
    min: 3,
    sev: 'Moderate',
    doc: 'Neurologist',
    rec: '1-3 days per episode',
    meds: 'Ibuprofen/Naproxen, rest in dark quiet room, cold compress.'
  },
  {
    name: 'Conjunctivitis / Pink Eye',
    match: ['red eyes', 'itching', 'swelling', 'watery eyes'],
    min: 2,
    sev: 'Mild',
    doc: 'Ophthalmologist',
    rec: '5-14 days',
    meds: 'Antibiotic eye drops (as prescribed). Wash hands frequently.'
  },
  {
    name: 'Fungal Infection',
    match: ['rash', 'itching', 'red patches'],
    min: 2,
    sev: 'Mild',
    doc: 'Dermatologist',
    rec: '1-4 weeks',
    meds: 'Antifungal creams (Clotrimazole) as prescribed. Keep area dry and clean.'
  }
];


// ============================================================
//  APP STATE
//  This is the global state object used across all JS files
//  Do NOT edit — managed by the app at runtime
// ============================================================
const App = {
  user:        null,       // logged-in user object
  isTyping:    false,      // true when AI is generating a response
  chips:       new Set(),  // set of selected symptom chip names
  convMsgs:    [],         // Claude conversation history array
  currentPage: 'home'      // currently visible page
};
