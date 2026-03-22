export const COMMON_JOBS = Array.from(new Set([
  // Tech & Engineering (Software, Hardware, Data, Cloud, Security)
  "Software Engineer", "Senior Software Engineer", "Staff Software Engineer", "Principal Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile App Developer", "iOS Developer", "Android Developer", "React Developer", "Node.js Developer", "Python Developer", "Java Developer", "C++ Developer", "Ruby Developer", "Go Developer",
  "Data Scientist", "Senior Data Scientist", "Data Analyst", "Data Engineer", "Machine Learning Engineer", "AI Engineer", "Deep Learning Engineer", "Computer Vision Engineer", "NLP Engineer", "Big Data Engineer", "Database Administrator (DBA)", "Data Architect", "Business Intelligence Analyst", "BI Developer",
  "DevOps Engineer", "Site Reliability Engineer (SRE)", "Cloud Architect", "Cloud Engineer", "AWS Solutions Architect", "Azure Cloud Engineer", "Infrastructure Engineer", "Release Engineer", "Build Engineer",
  "Cybersecurity Analyst", "Information Security Analyst", "Penetration Tester", "Security Engineer", "Ethical Hacker", "Security Architect", "SOC Analyst", "Compliance Analyst",
  "Systems Administrator", "Network Administrator", "Network Engineer", "IT Support Specialist", "Help Desk Technician", "IT Manager", "IT Director", "Chief Technology Officer (CTO)", "Information Technology Manager", "Systems Analyst", "Technical Support Engineer", "Desktop Support Technician",
  "Software Architect", "Enterprise Architect", "Solutions Architect", "Technical Lead", "Engineering Manager", "VP of Engineering", "Director of Engineering",
  "QA Engineer", "QA Tester", "Quality Assurance Analyst", "Automation Engineer", "SDET (Software Development Engineer in Test)",
  "UI Designer", "UX Designer", "UI/UX Designer", "Product Designer", "UX Researcher", "Interaction Designer", "Visual Designer", "Game Developer", "Game Designer", "Level Designer", "Blockchain Developer", "Smart Contract Developer", "Web3 Developer", 
  "Hardware Engineer", "Embedded Systems Engineer", "Firmware Engineer", "Electrical Engineer", "Electronics Engineer", "Mechanical Engineer", "Civil Engineer", "Aerospace Engineer", "Chemical Engineer", "Industrial Engineer", "Biomedical Engineer", "Petroleum Engineer", "Materials Engineer", "Nuclear Engineer", "Marine Engineer", "Agricultural Engineer", "Mining Engineer", "Robotics Engineer", "Mechatronics Engineer", "Acoustical Engineer", "Automotive Engineer",
  
  // Product, Project Management & Agile
  "Product Manager", "Senior Product Manager", "Group Product Manager", "Director of Product", "VP of Product", "Chief Product Officer (CPO)", "Associate Product Manager", "Product Owner",
  "Project Manager", "Senior Project Manager", "Technical Project Manager", "IT Project Manager", "Construction Project Manager", "Scrum Master", "Agile Coach", "Release Train Engineer", "Program Manager", "Portfolio Manager",
  "Business Analyst", "Technical Business Analyst", "Systems Business Analyst", "Operations Analyst",
  
  // Marketing, Sales & Customer Success
  "Marketing Manager", "Director of Marketing", "VP of Marketing", "Chief Marketing Officer (CMO)", "Digital Marketing Specialist", "Digital Marketing Manager", "Growth Hacker", "Growth Marketing Manager", "SEO Specialist", "SEO Manager", "SEM Specialist", "Content Marketing Manager", "Content Strategist", "Social Media Manager", "Community Manager", "Email Marketing Specialist", "Product Marketing Manager", "Brand Manager", "Event Marketing Manager", "Public Relations Specialist", "PR Manager", "Media Buyer", "Media Planner",
  "Sales Representative", "Sales Manager", "Sales Director", "VP of Sales", "Chief Revenue Officer (CRO)", "Account Executive", "Senior Account Executive", "Enterprise Account Executive", "SDR (Sales Development Representative)", "BDR (Business Development Representative)", "Inside Sales Representative", "Outside Sales Representative", "Business Development Manager", "Partnerships Manager", "Channel Sales Manager", "Pre-Sales Engineer", "Sales Engineer", "Solutions Consultant",
  "Customer Success Manager", "Customer Success Director", "Client Success Manager", "Account Manager", "Key Account Manager", "Strategic Account Manager", "Customer Support Representative", "Customer Service Representative", "Customer Experience Manager", "Technical Account Manager", "Implementation Specialist", "Onboarding Specialist",
  
  // Finance, Accounting & Legal
  "Accountant", "Senior Accountant", "Staff Accountant", "Certified Public Accountant (CPA)", "Tax Accountant", "Auditor", "Internal Auditor", "External Auditor", "Bookkeeper", "Payroll Specialist", "Billing Specialist", "Accounts Payable Clerk", "Accounts Receivable Clerk", "Financial Controller", "Comptroller", 
  "Financial Analyst", "Senior Financial Analyst", "FP&A Analyst", "Investment Banker", "Investment Analyst", "Portfolio Manager", "Wealth Advisor", "Financial Advisor", "Financial Planner", "Quant (Quantitative Analyst)", "Actuary", "Risk Manager", "Credit Analyst", "Underwriter", "Loan Officer", "Mortgage Broker", "Venture Capitalist", "Private Equity Analyst", "Chief Financial Officer (CFO)", "VP of Finance", "Director of Finance",
  "Lawyer", "Attorney", "Corporate Counsel", "General Counsel", "Associate Attorney", "Partner", "Litigator", "Defense Attorney", "Prosecutor", "Public Defender", "Paralegal", "Legal Assistant", "Legal Secretary", "Contract Administrator", "Compliance Officer", "Compliance Manager", "Judge", "Magistrate",
  
  // HR, Operations & Administration
  "HR Manager", "HR Director", "VP of Human Resources", "Chief Human Resources Officer (CHRO)", "HR Generalist", "HR Business Partner (HRBP)", "Recruiter", "Technical Recruiter", "Corporate Recruiter", "Talent Acquisition Specialist", "Talent Acquisition Manager", "Sourcer", "Compensation and Benefits Manager", "Payroll Manager", "Training and Development Manager", "Learning and Development Specialist", "Employee Relations Manager", 
  "Operations Manager", "Director of Operations", "VP of Operations", "Chief Operating Officer (COO)", "General Manager", "Office Manager", "Office Administrator", "Administrative Assistant", "Executive Assistant", "Virtual Assistant", "Receptionist", "Data Entry Clerk", "File Clerk", "Mail Clerk",
  "Chief Executive Officer (CEO)", "Founder", "Co-Founder", "Managing Director", "President", "Vice President", "Chief of Staff", "Director", 
  
  // Supply Chain, Logistics & Transportation
  "Supply Chain Manager", "Supply Chain Analyst", "Logistics Manager", "Logistics Coordinator", "Procurement Manager", "Purchasing Agent", "Purchasing Manager", "Buyer", "Inventory Manager", "Inventory Control Specialist", "Warehouse Manager", "Warehouse Worker", "Warehouse Supervisor", "Material Handler", "Order Picker", "Shipping and Receiving Clerk", "Dispatcher", "Freight Broker", "Fleet Manager",
  "Truck Driver", "CDL Driver", "Delivery Driver", "Courier", "Route Driver", "Uber/Lyft Driver", "Taxi Driver", "Chauffeur", "Bus Driver", "Transit Operator", "Train Conductor", "Train Engineer", "Locomotive Engineer", "Subway Operator", "Pilot", "Commercial Pilot", "Flight Attendant", "Air Traffic Controller", "Aircraft Mechanic", "Aviation Engineer", "Sailor", "Captain", "First Mate", "Deckhand", "Marine Engineer", "Longshoreman",
  
  // Healthcare, Medicine & Pharmacy
  "Physician", "Doctor", "Medical Doctor (MD)", "Surgeon", "General Practitioner", "Family Medicine Physician", "Pediatrician", "Cardiologist", "Oncologist", "Neurologist", "Dermatologist", "Psychiatrist", "Anesthesiologist", "Radiologist", "Pathologist", "Gastroenterologist", "Endocrinologist", "Ophthalmologist", "Orthopedic Surgeon", "Urologist", "Gynecologist", "Obstetrician (OB/GYN)",
  "Registered Nurse (RN)", "Licensed Practical Nurse (LPN)", "Nurse Practitioner (NP)", "Travel Nurse", "ER Nurse", "ICU Nurse", "Pediatric Nurse", "Oncology Nurse", "Psychiatric Nurse", "Nurse Midwife", "Nurse Anesthetist", "Clinical Nurse Specialist", "Nursing Assistant", "Certified Nursing Assistant (CNA)", "Home Health Aide",
  "Dentist", "Orthodontist", "Oral Surgeon", "Periodontist", "Endodontist", "Dental Hygienist", "Dental Assistant", "Dental Lab Technician",
  "Pharmacist", "Clinical Pharmacist", "Pharmacy Technician", "Pharmacy Assistant",
  "Physical Therapist", "Occupational Therapist", "Speech-Language Pathologist", "Respiratory Therapist", "Radiation Therapist", "Massage Therapist", "Recreational Therapist",
  "Medical Assistant", "Physician Assistant (PA)", "Paramedic", "Emergency Medical Technician (EMT)", "Phlebotomist", "Surgical Technologist", "Radiologic Technologist", "Ultrasound Technician", "MRI Technologist", "Cardiovascular Technologist", "Medical Laboratory Technician", "Medical Laboratory Scientist", "Clinical Laboratory Scientist", "Medical Biller", "Medical Coder", "Medical Scribe", "Healthcare Administrator", "Hospital Administrator", "Clinic Manager", "Health Informatics Specialist", "Dietitian", "Nutritionist", "Chiropractor", "Acupuncturist",
  "Psychologist", "Clinical Psychologist", "Counselor", "Mental Health Counselor", "School Counselor", "Marriage and Family Therapist", "Clinical Social Worker", "Social Worker", "Behavioral Therapist", "Substance Abuse Counselor",
  "Veterinarian", "Veterinary Technician", "Veterinary Assistant", "Animal Groomer", "Animal Trainer", "Zookeeper", "Zoologist",
  
  // Education, Academia & Research
  "Teacher", "Elementary School Teacher", "Middle School Teacher", "High School Teacher", "Special Education Teacher", "ESL Teacher", "Substitute Teacher", "Preschool Teacher", "Kindergarten Teacher",
  "Professor", "Assistant Professor", "Associate Professor", "Adjunct Professor", "Lecturer", "Instructor", "Teaching Assistant (TA)", "Research Assistant", "Research Scientist", "Postdoctoral Researcher", "Dean", "Principal", "Superintendent", "Provost", "Chancellor", "Admissions Counselor", "Academic Advisor", "Financial Aid Counselor", "Registrar", "Librarian", "Archivist",
  "Instructional Designer", "Curriculum Developer", "Educational Technologist", "Tutor", "Test Prep Tutor", "Athletic Director", "Coach", "Physical Education Teacher", 
  "Scientist", "Biologist", "Chemist", "Physicist", "Astronomer", "Geologist", "Meteorologist", "Environmental Scientist", "Botanist", "Microbiologist", "Biochemist", "Epidemiologist", "Sociologist", "Political Scientist", "Economist", "Anthropologist", "Archaeologist", "Historian",
  
  // Trades, Construction & Manufacturing
  "Electrician", "Master Electrician", "Journeyman Electrician", "Plumber", "Master Plumber", "Pipefitter", "Steamfitter", "Carpenter", "Finish Carpenter", "Framer", "Cabinetmaker", "Welder", "Fabricator", "HVAC Technician", "HVAC Installer", "Construction Worker", "Construction Manager", "General Contractor", "Foreman", "Site Superintendent", "Estimator",
  "Painter", "Roofing Contractor", "Roofer", "Heavy Equipment Operator", "Crane Operator", "Excavator Operator", "Backhoe Operator", "Mechanic", "Auto Mechanic", "Diesel Mechanic", "Aircraft Mechanic", "Motorcycle Mechanic", "Bicycle Mechanic", "Small Engine Mechanic", 
  "Maintenance Worker", "Maintenance Technician", "Maintenance Supervisor", "Janitor", "Custodian", "Cleaner", "Housekeeper", "Maid", "Landscaper", "Groundskeeper", "Arborist", "Tree Trimmer",
  "Machinist", "CNC Machinist", "CNC Operator", "CNC Programmer", "Tool and Die Maker", "Millwright", "Forklift Operator", "Mason", "Brickmason", "Stonemason", "Concrete Finisher", "Ironworker", "Structural Iron Worker", "Boilermaker", "Elevator Mechanic", "Glazier", "Insulation Worker", "Sheet Metal Worker", "Solar Photovoltaic Installer", "Wind Turbine Technician", "Assembler", "Production Worker", "Quality Control Inspector", "Manufacturing Engineer", "Plant Manager", "Production Supervisor", "Safety Coordinator", "EHS Manager",
  
  // Real Estate, Architecture & Design
  "Real Estate Agent", "Realtor", "Real Estate Broker", "Property Manager", "Leasing Agent", "Real Estate Appraiser", "Title Examiner", "Escrow Officer", "Mortgage Originator",
  "Architect", "Landscape Architect", "Urban Planner", "City Planner", "Draftsman", "CAD Designer", "Interior Designer", "Interior Decorator", "Space Planner",
  "Graphic Designer", "Senior Graphic Designer", "Art Director", "Creative Director", "Illustrator", "Animator", "3D Artist", "Motion Graphics Designer", "Visual Effects Artist", "Industrial Designer", "Fashion Designer", "Textile Designer", "Jewelry Designer", "Floral Designer",
  
  // Media, Arts, Entertainment & Writing
  "Journalist", "Reporter", "Correspondent", "News Anchor", "News Editor", "Managing Editor", "Copy Editor", "Copywriter", "Senior Copywriter", "Technical Writer", "Grant Writer", "Content Writer", "Blogger", "Author", "Writer", "Novelist", "Screenwriter", "Playwright", "Poet", "Translator", "Interpreter",
  "Photographer", "Portrait Photographer", "Commercial Photographer", "Photojournalist", "Photo Editor", "Videographer", "Video Editor", "Film Director", "Film Producer", "Executive Producer", "Cinematographer", "Camera Operator", "Sound Engineer", "Audio Engineer", "Sound Designer", "Foley Artist", "Broadcaster", "Radio Host", "Podcaster", "Voice Actor",
  "Actor", "Actress", "Dancer", "Choreographer", "Musician", "Singer", "Composer", "Music Producer", "DJ", "Comedian", "Entertainer",
  
  // Food, Beverage & Hospitality
  "Chef", "Executive Chef", "Head Chef", "Sous Chef", "Pastry Chef", "Line Cook", "Prep Cook", "Short Order Cook", "Baker", "Butcher", "Meat Cutter",
  "Bartender", "Mixologist", "Barista", "Sommelier", "Waiter", "Waitress", "Server", "Host", "Hostess", "Maitre D'", "Busser", "Food Runner", "Dishwasher", "Caterer", "Catering Manager", "Restaurant Manager", "General Manager (Restaurant)", "Food Service Manager",
  "Hotel Manager", "Front Desk Agent", "Concierge", "Bellhop", "Porter", "Guest Services Manager", "Event Planner", "Event Coordinator", "Wedding Planner", "Meeting Planner", "Tour Guide", "Travel Agent", "Travel Guide",
  
  // Retail, Beauty & Personal Care
  "Retail Store Manager", "Assistant Store Manager", "Retail Shift Supervisor", "Cashier", "Store Clerk", "Sales Associate", "Retail Merchandiser", "Visual Merchandiser", "Retail Buyer", "Personal Shopper",
  "Hairdresser", "Hair Stylist", "Barber", "Cosmetologist", "Esthetician", "Skin Care Specialist", "Nail Technician", "Manicurist", "Makeup Artist", "Tattoo Artist", "Body Piercer", "Massage Therapist",
  "Personal Trainer", "Fitness Instructor", "Yoga Instructor", "Pilates Instructor", "Group Fitness Instructor", "Athletic Trainer", "Sports Coach", "Umpire", "Referee",
  
  // Public Service, Government & Military
  "Police Officer", "Sheriff", "Deputy", "State Trooper", "Highway Patrol", "Detective", "Criminal Investigator", "Crime Scene Investigator", "Forensic Scientist", "Police Chief", "Dispatcher", "911 Dispatcher",
  "Firefighter", "Fire Chief", "Fire Inspector", "Forest Firefighter",
  "Security Guard", "Security Officer", "Bodyguard", "Bouncer", "Loss Prevention Specialist",
  "Military Officer", "Military Enlisted", "Soldier", "Sailor (Military)", "Marine", "Airman", "Coast Guard", "Special Forces", "Intelligence Officer", "CIA Agent", "FBI Agent", "Secret Service Agent", "Border Patrol Agent", "Customs Officer", "TSA Screener",
  "Correctional Officer", "Prison Guard", "Probation Officer", "Parole Officer",
  "Politician", "Mayor", "Governor", "Senator", "Representative", "City Council Member", "Diplomat", "Foreign Service Officer", "Ambassador", "Civil Servant", "Public Administrator", "City Manager", "Postal Worker", "Mail Carrier", "Postmaster",
  
  // Agriculture, Forestry & Fishing
  "Farmer", "Farm Manager", "Agricultural Worker", "Rancher", "Herdsman", "Dairy Farmer", "Poultry Farmer", "Crop Farmer", "Agronomist", "Horticulturist",
  "Logger", "Lumberjack", "Forester", "Forest Ranger", "Park Ranger", "Conservation Scientist", "Wildlife Biologist",
  "Fisherman", "Deckhand (Fishing)", "Captain (Fishing)", "Aquaculturist", 
  
  // Miscellaneous
  "Astronaut", "Priest", "Pastor", "Minister", "Rabbi", "Imam", "Clergy", "Funeral Director", "Mortician", "Embalmer", "Locksmith", "Clockmaker", "Watchmaker", "Shoemaker", "Cobbler", "Tailor", "Seamstress", "Upholsterer", "Blacksmith"
])).sort();
