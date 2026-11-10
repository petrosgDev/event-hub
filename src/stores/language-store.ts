import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'am';

const dictionaries = {
  en: {
    // Navbar
    searchEvents: 'Search events',
    findEvents: 'Find Events',
    createEvents: 'Create Events',
    findMyTickets: 'Find my tickets',
    adminPanel: 'Admin Panel',
    signIn: 'Sign In',
    getStarted: 'Get Started',
    dashboard: 'Dashboard',
    signOut: 'Sign Out',

    // Hero
    heroBadge: 'Debre Birhan University · Campus Events Platform',
    heroTitle1: 'Your Campus Events,',
    heroTitle2: 'One Platform',
    heroDescription: 'Discover workshops, seminars, hackathons, and cultural events at DBU. Register instantly, pay securely with Chapa, and never miss what matters.',
    exploreEvents: 'Explore Events',
    joinAsOrganizer: 'Join as Organizer',

    // Stats
    students: 'STUDENTS',
    eventsHosted: 'EVENTS HOSTED',
    organizers: 'ORGANIZERS',
    satisfaction: 'SATISFACTION',

    // Browse by Category
    browseByCategory: 'Browse by Category',
    browseByCategoryDesc: 'Find exactly the type of event you\'re looking for',

    // Features
    featuresTitle: 'Why EventHub DBU?',
    featuresSubtitle: 'Built exclusively for the campus community',
    feature1Title: 'Instant Registration',
    feature1Desc: 'One-click event registration with QR ticket generation. No paperwork needed.',
    feature2Title: 'QR Attendance',
    feature2Desc: 'Organizers scan QR codes at the door for instant, tamper-proof attendance verification.',
    feature3Title: 'Chapa Payments',
    feature3Desc: 'Secure payments via Telebirr, CBE Birr, and bank cards for paid events and vendor subscriptions.',
    feature4Title: 'Real-Time Analytics',
    feature4Desc: 'Organizers see live dashboards with registration counts, attendance rates, and revenue.',
    feature5Title: 'Digital Certificates',
    feature5Desc: 'Auto-generated certificates of participation distributed to attendees after events.',
    feature6Title: 'Admin Governance',
    feature6Desc: 'Super Admins approve vendors, moderate events, and oversee all platform payments.',

    // Events Section
    upcomingEvents: 'Upcoming Events',
    upcomingEventsDesc: 'Real events happening at Debre Birhan University',
    viewAllEvents: 'View All Events',
    noEventsYet: 'No events available yet. Check back soon!',
    browseAll: 'Browse All',
    free: 'Free',
    registered: 'registered',

    // Campus Map
    campusMap: '📍 Campus Map',
    findEventsOnCampus: 'Find Events on Campus',
    campusMapDesc: 'Every event is mapped to its exact location at Debre Birhan University. Never get lost — see the venue on the map and get walking directions instantly.',
    campusLoc1: 'Main Auditorium & Lecture Halls',
    campusLoc2: 'CS Building & Innovation Hub',
    campusLoc3: 'Business School & Library',
    campusLoc4: 'Campus Open Ground & Sports Fields',
    browseEventsNearYou: 'Browse Events Near You',

    // How It Works
    howItWorks: 'How It Works',
    howItWorksDesc: 'Four simple steps from discovery to attendance',
    step1Title: 'Discover',
    step1Desc: 'Browse events by category, date, or location on the DBU campus.',
    step2Title: 'Register & Pay',
    step2Desc: 'Register for free or pay securely via Chapa for premium events.',
    step3Title: 'Attend with QR',
    step3Desc: 'Show your QR ticket at the venue door for instant check-in.',
    step4Title: 'Get Certified',
    step4Desc: 'Receive digital certificates and track your event history.',

    // Testimonials
    whatStudentsSay: 'What Students Say',
    testimonial1: 'EventHub made it so easy to find and register for the AI workshop. The QR check-in was instant!',
    testimonial2: 'As an organizer, the analytics dashboard gives me real-time insights into my event performance.',
    testimonial3: 'I love how I can pay for events with Telebirr through Chapa. No cash needed on campus anymore.',

    // CTA
    ctaTitle: 'Ready to transform your campus events?',
    ctaDescription: 'Join thousands of students and organizers already using EventHub DBU.',
    ctaButton: 'Get Started Free',
    createAccount: 'Create Account',

    // Footer
    footerTagline: 'The premier event management platform for Debre Birhan University. Discover, register, and attend campus events seamlessly.',
    forStudents: 'For Students',
    discoverEvents: 'Discover Events',
    myTickets: 'My Tickets',
    certificates: 'Certificates',
    forOrganizers: 'For Organizers',
    createEvent: 'Create Event',
    qrScanner: 'QR Scanner',
    platform: 'Platform',
    allRightsReserved: 'All rights reserved.',

    // Theme
    theme: 'Theme',
    lightMode: 'Light',
    darkMode: 'Dark',

    // Language
    language: 'Language',
    english: 'English',
    amharic: 'አማርኛ (Amharic)',

    // Auth
    welcomeBack: 'Welcome back!',
    letsGetYouSignedIn: "Let's get you signed in to your account.",
    whatIsYourEmail: 'What is your university email?',
    andYourPassword: 'And your password?',
    forgotPassword: 'Forgot password?',
    dontHaveAccount: "Don't have an account?",
    createAnAccount: 'Create an account',
    alreadyHaveAccount: 'Already have an account?',

    // Super Admin Dashboard
    superAdminTitle: 'Super Admin Control Center',
    superAdminDesc: 'Full platform governance, vendor approval, and AI-driven insights.',
    pendingApprovals: 'vendors awaiting approval',
    totalUsers: 'Total Users',
    activeVendors: 'Active Vendors',
    totalEvents: 'Total Events',
    platformEngagement: 'Platform Engagement',
    tabOverview: 'Overview',
    tabVendors: 'Vendor Approvals',
    tabEvents: 'Event Moderation',
    tabUsers: 'User Management',
    platformGrowth: 'Platform Growth',
    growthDesc: 'Monthly user and event growth over 6 months',
    aiInsights: 'AI Insights',
    vendorApprovalQueue: 'Vendor Approval Queue',
    vendorQueueDesc: 'Review and approve vendor/organizer accounts before they can create events.',
    eventModerationTitle: 'Event Moderation',
    eventModerationDesc: 'Review all published and pending events across the platform.',
    userManagementTitle: 'User Management',
    userManagementDesc: 'Search, suspend, verify and manage all users on the platform.',
    allCaughtUp: 'All caught up!',
    noPendingVendors: 'No vendors are waiting for approval.',
    tableVendor: 'Vendor / Organization',
    tableEmail: 'Email',
    tableDept: 'Department',
    tableApplied: 'Applied',
    tablePayment: 'Payment',
    tableStatus: 'Status',
    tableActions: 'Actions',
    tableEventName: 'Event Name',
    tableOrganizer: 'Organizer',
    tablePrice: 'Price',
    tableDate: 'Date',
    tableRegistered: 'Registered',
    tableUser: 'User',
    tableRole: 'Role',
    tableJoined: 'Joined',
    approve: 'Approve',
    reject: 'Reject',
    suspend: 'Suspend',
    activate: 'Activate',
    view: 'View',
  },
  am: {
    // Navbar
    searchEvents: 'ክንውኖችን ፈልግ',
    findEvents: 'ክንውኖችን ፈልግ',
    createEvents: 'ክንውን ፍጠር',
    findMyTickets: 'ቲኬቶቼን ፈልግ',
    adminPanel: 'የአስተዳዳሪ ፓነል',
    signIn: 'ግባ',
    getStarted: 'ጀምር',
    dashboard: 'ዳሽቦርድ',
    signOut: 'ውጣ',

    // Hero
    heroBadge: 'ደብረ ብርሃን ዩኒቨርሲቲ · የግቢ ክንውኖች መድረክ',
    heroTitle1: 'የግቢዎ ክንውኖች፣',
    heroTitle2: 'በአንድ መድረክ',
    heroDescription: 'በደብረ ብርሃን ዩኒቨርሲቲ ውስጥ ወርክሾፖችን፣ ሴሚናሮችን፣ ሃካቶኖችን እና የባህል ክንውኖችን ያግኙ። በቅጽበት ይመዝገቡ፣ በቻፓ በጥንቃቄ ይክፈሉ፣ አስፈላጊ ነገሮችን በፍጹም አያምልጡ።',
    exploreEvents: 'ክንውኖችን ያስሱ',
    joinAsOrganizer: 'አዘጋጅ ሆነው ይቀላቀሉ',

    // Stats
    students: 'ተማሪዎች',
    eventsHosted: 'ክንውኖች ተካሂደዋል',
    organizers: 'አዘጋጆች',
    satisfaction: 'እርካታ',

    // Browse by Category
    browseByCategory: 'በምድብ ያስሱ',
    browseByCategoryDesc: 'የሚፈልጉትን የክንውን ዓይነት በትክክል ያግኙ',

    // Features
    featuresTitle: 'ለምን EventHub DBU?',
    featuresSubtitle: 'ለግቢ ማህበረሰብ ብቻ የተገነባ',
    feature1Title: 'ፈጣን ምዝገባ',
    feature1Desc: 'በአንድ ጠቅታ የክንውን ምዝገባ ከQR ቲኬት ጋር። ወረቀት አያስፈልግም።',
    feature2Title: 'QR ተገኝነት',
    feature2Desc: 'አዘጋጆች በበሩ ላይ QR ኮዶችን በመቃኘት ፈጣን፣ ዋስትና ያለው ተገኝነት ማረጋገጫ ያደርጋሉ።',
    feature3Title: 'የቻፓ ክፍያ',
    feature3Desc: 'በቴሌብር፣ በCBE ብር እና በባንክ ካርዶች ለክፍያ ክንውኖች ደህንነቱ የተጠበቀ ክፍያ።',
    feature4Title: 'በቀጥታ ትንተና',
    feature4Desc: 'አዘጋጆች የምዝገባ ቁጥሮችን፣ የተገኝነት ምጣኔዎችን እና ገቢን በቀጥታ ዳሽቦርዶች ያያሉ።',
    feature5Title: 'ዲጂታል ሰርተፊኬቶች',
    feature5Desc: 'ከክንውኖች በኋላ ለተሳታፊዎች በራስ-ሰር የተመነጩ የተሳትፎ ሰርተፊኬቶች።',
    feature6Title: 'የአስተዳዳሪ ቁጥጥር',
    feature6Desc: 'ሱፐር አድሚኖች ሻጮችን ያጸድቃሉ፣ ክንውኖችን ያስተዳድራሉ፣ ሁሉንም የመድረክ ክፍያዎች ይቆጣጠራሉ።',

    // Events Section
    upcomingEvents: 'መጪ ክንውኖች',
    upcomingEventsDesc: 'በደብረ ብርሃን ዩኒቨርሲቲ የሚካሄዱ እውነተኛ ክንውኖች',
    viewAllEvents: 'ሁሉንም ክንውኖች ይመልከቱ',
    noEventsYet: 'እስካሁን ምንም ክንውኖች የሉም። በቅርቡ ይመልከቱ!',
    browseAll: 'ሁሉንም ይመልከቱ',
    free: 'ነፃ',
    registered: 'ተመዝግበዋል',

    // Campus Map
    campusMap: '📍 የግቢ ካርታ',
    findEventsOnCampus: 'በግቢ ውስጥ ክንውኖችን ያግኙ',
    campusMapDesc: 'እያንዳንዱ ክንውን በደብረ ብርሃን ዩኒቨርሲቲ ውስጥ ባለበት ቦታ ላይ ተዘርግቷል። በፍጹም አይጠፉ — ቦታውን በካርታ ላይ ይመልከቱ።',
    campusLoc1: 'ዋና አዳራሽ እና የንግግር አዳራሾች',
    campusLoc2: 'የCS ሕንፃ እና የፈጠራ ማዕከል',
    campusLoc3: 'የቢዝነስ ት/ቤት እና ቤተ-መጽሐፍት',
    campusLoc4: 'ክፍት ሜዳ እና የስፖርት ሜዳዎች',
    browseEventsNearYou: 'አቅራቢያዎ ያሉ ክንውኖችን ያስሱ',

    // How It Works
    howItWorks: 'እንዴት ይሰራል',
    howItWorksDesc: 'ከፍለጋ እስከ ተሳትፎ አራት ቀላል ደረጃዎች',
    step1Title: 'ፈልግ',
    step1Desc: 'በምድብ፣ በቀን ወይም በቦታ ክንውኖችን በDBU ግቢ ውስጥ ያስሱ።',
    step2Title: 'ተመዝገብ እና ክፈል',
    step2Desc: 'በነፃ ይመዝገቡ ወይም ለፕሪሚየም ክንውኖች በቻፓ በጥንቃቄ ይክፈሉ።',
    step3Title: 'በQR ተገኝ',
    step3Desc: 'ለፈጣን ቼክ-ኢን በቦታው በር ላይ የQR ቲኬትዎን ያሳዩ።',
    step4Title: 'ሰርተፊኬት ያግኙ',
    step4Desc: 'ዲጂታል ሰርተፊኬቶችን ይቀበሉ እና የክንውን ታሪክዎን ይከታተሉ።',

    // Testimonials
    whatStudentsSay: 'ተማሪዎች ምን ይላሉ',
    testimonial1: 'EventHub የAI ወርክሾፕ ማግኘትና መመዝገብ በጣም ቀላል አድርጎልኛል። QR ቼክ-ኢኑ ፈጣን ነበር!',
    testimonial2: 'እንደ አዘጋጅ፣ የትንተና ዳሽቦርዱ ስለ ክንውን አፈጻጸሜ የቀጥታ ግንዛቤ ይሰጠኛል።',
    testimonial3: 'ለክንውኖች በቴሌብር በቻፓ መክፈል መቻሌ ያስደስተኛል። ግቢ ውስጥ ጥሬ ገንዘብ አያስፈልግም።',

    // CTA
    ctaTitle: 'የግቢ ክንውኖችዎን ለመለወጥ ዝግጁ ነዎት?',
    ctaDescription: 'EventHub DBU ን እየተጠቀሙ ካሉ በሺዎች ከሚቆጠሩ ተማሪዎች እና አዘጋጆች ጋር ይቀላቀሉ።',
    ctaButton: 'በነፃ ይጀምሩ',
    createAccount: 'መለያ ፍጠር',

    // Footer
    footerTagline: 'ለደብረ ብርሃን ዩኒቨርሲቲ ቀዳሚ የክንውን ማስተዳደሪያ መድረክ። ክንውኖችን ያግኙ፣ ይመዝገቡ፣ በቀላሉ ይሳተፉ።',
    forStudents: 'ለተማሪዎች',
    discoverEvents: 'ክንውኖችን ያግኙ',
    myTickets: 'ቲኬቶቼ',
    certificates: 'ሰርተፊኬቶች',
    forOrganizers: 'ለአዘጋጆች',
    createEvent: 'ክንውን ፍጠር',
    qrScanner: 'QR ስካነር',
    platform: 'መድረክ',
    allRightsReserved: 'ሁሉም መብቶች የተጠበቁ ናቸው።',

    // Theme
    theme: 'ገጽታ',
    lightMode: 'ብሩህ',
    darkMode: 'ጨለማ',

    // Language
    language: 'ቋንቋ',
    english: 'English',
    amharic: 'አማርኛ (Amharic)',

    // Auth
    welcomeBack: 'እንኳን ደህና መጡ!',
    letsGetYouSignedIn: 'ወደ መለያዎ እንግባ።',
    whatIsYourEmail: 'የዩኒቨርሲቲ ኢሜልዎ ምንድን ነው?',
    andYourPassword: 'የይለፍ ቃልዎ?',
    forgotPassword: 'የይለፍ ቃል ረሱ?',
    dontHaveAccount: 'መለያ የለዎትም?',
    createAnAccount: 'መለያ ይፍጠሩ',
    alreadyHaveAccount: 'አስቀድመው መለያ አለዎት?',

    // Super Admin Dashboard
    superAdminTitle: 'የሱፐር አድሚን ቁጥጥር ማዕከል',
    superAdminDesc: 'ሙሉ የመድረክ አስተዳደር፣ የሻጮች ማጽደቂያ እና በAI የተደገፉ ግንዛቤዎች።',
    pendingApprovals: 'ሻጮች ማጽደቂያ እየጠበቁ ነው',
    totalUsers: 'ጠቅላላ ተጠቃሚዎች',
    activeVendors: 'ንቁ ሻጮች',
    totalEvents: 'ጠቅላላ ክንውኖች',
    platformEngagement: 'የመድረክ ተሳትፎ',
    tabOverview: 'አጠቃላይ እይታ',
    tabVendors: 'የሻጮች ማጽደቂያ',
    tabEvents: 'የክንውኖች ቁጥጥር',
    tabUsers: 'የተጠቃሚዎች አስተዳደር',
    platformGrowth: 'የመድረክ እድገት',
    growthDesc: 'የ6 ወራት የተጠቃሚዎች እና የክንውኖች እድገት',
    aiInsights: 'የAI ግንዛቤዎች',
    vendorApprovalQueue: 'የሻጮች ማጽደቂያ ቅደም ተከተል',
    vendorQueueDesc: 'ሻጮች ክንውኖችን ከመፍጠራቸው በፊት መለያቸውን ይገምግሙ እና ያጽድቁ።',
    eventModerationTitle: 'የክንውኖች ቁጥጥር',
    eventModerationDesc: 'በመድረኩ ላይ ያሉ ሁሉንም የታተሙ እና በመጠባበቅ ላይ ያሉ ክንውኖችን ይገምግሙ።',
    userManagementTitle: 'የተጠቃሚዎች አስተዳደር',
    userManagementDesc: 'በመድረኩ ላይ ያሉ ሁሉንም ተጠቃሚዎች ይፈልጉ፣ ያግዱ፣ ያረጋግጡ እና ያስተዳድሩ።',
    allCaughtUp: 'ሁሉም ተጠናቋል!',
    noPendingVendors: 'ማጽደቂያ የሚጠባበቁ ሻጮች የሉም።',
    tableVendor: 'ሻጭ / ድርጅት',
    tableEmail: 'ኢሜል',
    tableDept: 'ትምህርት ክፍል',
    tableApplied: 'የተጠየቀበት ቀን',
    tablePayment: 'ክፍያ',
    tableStatus: 'ሁኔታ',
    tableActions: 'እርምጃዎች',
    tableEventName: 'የክንውን ስም',
    tableOrganizer: 'አዘጋጅ',
    tablePrice: 'ዋጋ',
    tableDate: 'ቀን',
    tableRegistered: 'ተመዝጋቢዎች',
    tableUser: 'ተጠቃሚ',
    tableRole: 'ሚና',
    tableJoined: 'የተቀላቀለበት ቀን',
    approve: 'አጽድቅ',
    reject: 'ውድቅ አድርግ',
    suspend: 'አግድ',
    activate: 'አንቀሳቅስ',
    view: 'ተመልከት',
  },
} as const;

type DictionaryKey = keyof typeof dictionaries.en;

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'eventhub-language',
    }
  )
);

export function useTranslation() {
  const { language } = useLanguageStore();
  
  const t = (key: DictionaryKey): string => {
    return dictionaries[language][key] || dictionaries.en[key] || key;
  };

  return { t, language };
}
