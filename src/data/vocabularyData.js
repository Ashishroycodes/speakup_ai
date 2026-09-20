/**
 * SpeakUp Vocabulary Mastery - Curated High-Yield Communication Data
 * 
 * Includes:
 * 1. 14 Smart Categories across Beginner, Intermediate, and Advanced tiers.
 * 2. 80+ Rich Word Entries with IPA, POS, Meaning, Hindi Meaning, A/B Conversation,
 *    Synonyms, Antonyms, Collocations, Common Mistakes, and Speaking Prompts.
 * 3. Daily Rotating Word of the Day collection.
 * 4. Confusing Words Comparison pairs (Affect vs Effect, Advice vs Advise, etc.).
 * 5. Phrases & Idioms with conversational contexts.
 * 6. 11 Real-Life Scenario Vocabulary packs.
 * 7. Interactive Quiz Questions Bank across multiple question formats.
 */

export const VOCAB_CATEGORIES = [
  { id: 'all', name: 'All Words', icon: 'Sparkles', count: 80 },
  { id: 'daily-conversation', name: 'Daily Conversation', icon: 'MessageCircle', count: 12 },
  { id: 'college-student', name: 'College & Student Life', icon: 'GraduationCap', count: 8 },
  { id: 'job-interview', name: 'Job & Interview', icon: 'Briefcase', count: 10 },
  { id: 'workplace', name: 'Workplace', icon: 'Building2', count: 9 },
  { id: 'travel', name: 'Travel', icon: 'Plane', count: 6 },
  { id: 'technology', name: 'Technology', icon: 'Cpu', count: 6 },
  { id: 'emotions', name: 'Emotions & Feelings', icon: 'Heart', count: 6 },
  { id: 'confidence', name: 'Confidence & Personality', icon: 'Zap', count: 7 },
  { id: 'communication', name: 'Communication', icon: 'Users', count: 8 },
  { id: 'business', name: 'Business English', icon: 'TrendingUp', count: 6 },
  { id: 'academic', name: 'Academic English', icon: 'BookMarked', count: 6 },
  { id: 'verbs', name: 'Commonly Used Verbs', icon: 'Activity', count: 8 },
  { id: 'phrasal-verbs', name: 'Phrasal Verbs', icon: 'Layers', count: 8 },
  { id: 'idioms', name: 'Idioms & Expressions', icon: 'Compass', count: 8 }
];

export const VOCAB_LEVELS = [
  { id: 1, name: 'Starter', minWords: 0, badge: '🌱 Starter' },
  { id: 2, name: 'Beginner', minWords: 10, badge: '🚀 Beginner' },
  { id: 3, name: 'Conversational', minWords: 25, badge: '💬 Conversational' },
  { id: 4, name: 'Confident Speaker', minWords: 50, badge: '⭐ Confident Speaker' },
  { id: 5, name: 'Advanced Communicator', minWords: 80, badge: '🏆 Advanced Communicator' }
];

export const VOCABULARY_LIST = [
  // 1. Daily Conversation
  {
    id: 'v-confident',
    word: 'Confident',
    phonetic: '/ˈkɒn.fɪ.dənt/',
    pos: 'adjective',
    difficulty: 'Beginner',
    categoryId: 'daily-conversation',
    categoryName: 'Daily Conversation',
    meaning: 'Feeling sure of your abilities and having trust in yourself.',
    hindiMeaning: 'आत्मविश्वासी / जिसे खुद पर भरोसा हो',
    example: 'I feel confident about my presentation after practicing in the mirror.',
    conversation: {
      speakerA: 'Are you ready for your project presentation today?',
      speakerB: 'Yes, I feel confident about it because I rehearsed thoroughly.'
    },
    synonyms: ['Self-assured', 'Positive', 'Certain', 'Poised'],
    antonyms: ['Insecure', 'Hesitant', 'Doubtful', 'Timid'],
    collocations: ['confident about', 'confident in', 'grow confident', 'feel confident'],
    commonMistake: {
      avoid: "I am confident on my speaking.",
      use: "I am confident about my speaking (or confident in my speaking).",
      explanation: "Use 'about' or 'in' with confident, never 'on'."
    },
    speakingPrompt: 'Use CONFIDENT in a sentence about an upcoming milestone or skill you are proud of.',
    tag: 'Core Fluency',
    xpValue: 15
  },
  {
    id: 'v-hesitant',
    word: 'Hesitant',
    phonetic: '/ˈhez.ɪ.tənt/',
    pos: 'adjective',
    difficulty: 'Beginner',
    categoryId: 'daily-conversation',
    categoryName: 'Daily Conversation',
    meaning: 'Slow in acting or speaking because you are uncertain or nervous.',
    hindiMeaning: 'झिझकने वाला / संकोची',
    example: 'She was hesitant to speak at first, but soon joined the conversation.',
    conversation: {
      speakerA: 'Why were you hesitant to share your idea during the meetup?',
      speakerB: 'I was hesitant because I was worried my pronunciation was not clear.'
    },
    synonyms: ['Uncertain', 'Reluctant', 'Timid', 'Tentative'],
    antonyms: ['Decisive', 'Eager', 'Willing', 'Confident'],
    collocations: ['hesitant to speak', 'feel hesitant', 'hesitant about'],
    commonMistake: {
      avoid: "He was hesitant for talking.",
      use: "He was hesitant to talk (or hesitant about talking).",
      explanation: "Follow hesitant with 'to + base verb' or 'about + gerund'."
    },
    speakingPrompt: 'Describe a moment when you felt HESITANT and how you overcame it.',
    tag: 'Daily Conversation',
    xpValue: 15
  },
  {
    id: 'v-in-a-nutshell',
    word: 'In a nutshell',
    phonetic: '/ɪn ə ˈnʌt.ʃel/',
    pos: 'phrase / connector',
    difficulty: 'Beginner',
    categoryId: 'daily-conversation',
    categoryName: 'Daily Conversation',
    meaning: 'In a very brief and concise summary.',
    hindiMeaning: 'संक्षेप में / कम शब्दों में',
    example: 'In a nutshell, consistent daily practice builds lasting speaking confidence.',
    conversation: {
      speakerA: 'What did the professor say in today\'s guest lecture?',
      speakerB: 'In a nutshell, artificial intelligence will assist workers rather than replace them.'
    },
    synonyms: ['Briefly', 'In summary', 'In short', 'To sum up'],
    antonyms: ['In detail', 'At length', 'Exhaustively'],
    collocations: ['put it in a nutshell', 'in a nutshell, we need...'],
    commonMistake: {
      avoid: "In the nutshell...",
      use: "In a nutshell...",
      explanation: "The idiom is fixed with the indefinite article 'a'."
    },
    speakingPrompt: 'Use IN A NUTSHELL to summarize your goal for this month in one sentence.',
    tag: 'Connector',
    xpValue: 15
  },
  {
    id: 'v-spontaneous',
    word: 'Spontaneous',
    phonetic: '/spɒnˈteɪ.ni.əs/',
    pos: 'adjective',
    difficulty: 'Intermediate',
    categoryId: 'daily-conversation',
    categoryName: 'Daily Conversation',
    meaning: 'Done or said in a natural and sudden way without being planned ahead of time.',
    hindiMeaning: 'स्वाभाविक / बिना पूर्व तैयारी के',
    example: 'His spontaneous jokes kept the whole room smiling throughout the break.',
    conversation: {
      speakerA: 'Did you prepare that speech beforehand?',
      speakerB: 'No, it was completely spontaneous based on the audience\'s reactions.'
    },
    synonyms: ['Unrehearsed', 'Impromptu', 'Instinctive', 'Natural'],
    antonyms: ['Premeditated', 'Planned', 'Rehearsed', 'Calculated'],
    collocations: ['spontaneous reaction', 'spontaneous conversation', 'be spontaneous'],
    commonMistake: {
      avoid: "He gave a spontaneous answer with planning.",
      use: "He gave a spontaneous answer without any prior planning.",
      explanation: "Spontaneous inherently means without prior planning."
    },
    speakingPrompt: 'Use SPONTANEOUS in a sentence describing a fun impromptu trip or conversation.',
    tag: 'Personality',
    xpValue: 15
  },

  // 2. College & Student Life
  {
    id: 'v-articulate',
    word: 'Articulate',
    phonetic: '/ɑːrˈtɪk.jə.lət/',
    pos: 'verb / adjective',
    difficulty: 'Intermediate',
    categoryId: 'college-student',
    categoryName: 'College & Student Life',
    meaning: 'To express thoughts, arguments, or ideas clearly and effectively in speech.',
    hindiMeaning: 'साफ-साफ व्यक्त करना / सुवक्ता',
    example: 'She was able to articulate her project architecture with exceptional clarity.',
    conversation: {
      speakerA: 'How did your team\'s viva presentation go with the dean?',
      speakerB: 'It went great! Priya articulated our algorithm so well that they were impressed.'
    },
    synonyms: ['Express', 'Voice', 'Enunciate', 'Elucidate'],
    antonyms: ['Mumble', 'Garble', 'Hesitate', 'Obscure'],
    collocations: ['articulate an idea', 'articulate clearly', 'highly articulate speaker'],
    commonMistake: {
      avoid: "She articulated about the project.",
      use: "She articulated the project details (or articulated her perspective).",
      explanation: "Articulate is a transitive verb; state the object directly without 'about'."
    },
    speakingPrompt: 'Use ARTICULATE in a sentence about explaining a complex topic to a classmate.',
    tag: 'Academic Polish',
    xpValue: 15
  },
  {
    id: 'v-collaborate',
    word: 'Collaborate',
    phonetic: '/kəˈlæb.ə.reɪt/',
    pos: 'verb',
    difficulty: 'Beginner',
    categoryId: 'college-student',
    categoryName: 'College & Student Life',
    meaning: 'To work jointly with others toward a shared objective or project.',
    hindiMeaning: 'सहयोग करना / मिलकर काम करना',
    example: 'We collaborated with the design students to create a modern user interface.',
    conversation: {
      speakerA: 'Are you working on the final capstone alone?',
      speakerB: 'No, I am collaborating with two classmates from the computer science department.'
    },
    synonyms: ['Cooperate', 'Team up', 'Partner', 'Work together'],
    antonyms: ['Compete', 'Oppose', 'Disengage', 'Work in isolation'],
    collocations: ['collaborate with someone', 'collaborate on a project', 'collaborate closely'],
    commonMistake: {
      avoid: "We collaborated together on this.",
      use: "We collaborated on this (together is redundant).",
      explanation: "'Collaborate' already means working together."
    },
    speakingPrompt: 'Use COLLABORATE in a sentence sharing how you work in a team.',
    tag: 'Teamwork',
    xpValue: 15
  },
  {
    id: 'v-procrastinate',
    word: 'Procrastinate',
    phonetic: '/prəʊˈkræs.tɪ.neɪt/',
    pos: 'verb',
    difficulty: 'Intermediate',
    categoryId: 'college-student',
    categoryName: 'College & Student Life',
    meaning: 'To delay or postpone doing something that must be done, often out of hesitation or laziness.',
    hindiMeaning: 'काम टालना / टालमटोल करना',
    example: 'I decided not to procrastinate on my semester assignment this time.',
    conversation: {
      speakerA: 'Have you finished drafting the literature review?',
      speakerB: 'Not yet. I procrastinated over the weekend and now I have to rush.'
    },
    synonyms: ['Delay', 'Postpone', 'Put off', 'Dilly-dally'],
    antonyms: ['Expedite', 'Prioritize', 'Accelerate', 'Take action'],
    collocations: ['procrastinate on', 'tend to procrastinate', 'stop procrastinating'],
    commonMistake: {
      avoid: "Don't procrastinate doing homework.",
      use: "Don't procrastinate on doing homework (or on your homework).",
      explanation: "Use 'procrastinate on' when referencing tasks."
    },
    speakingPrompt: 'Use PROCRASTINATE in a sentence about beating a study habit.',
    tag: 'Productivity',
    xpValue: 15
  },

  // 3. Job & Interview
  {
    id: 'v-resilient',
    word: 'Resilient',
    phonetic: '/rɪˈzɪl.jənt/',
    pos: 'adjective',
    difficulty: 'Intermediate',
    categoryId: 'job-interview',
    categoryName: 'Job & Interview',
    meaning: 'Able to recover quickly from difficult conditions, setbacks, or pressure.',
    hindiMeaning: 'कठिनाइयों से जल्दी उबरने वाला / लचीला',
    example: 'She showed she was resilient by quickly fixing the server bug under tight pressure.',
    conversation: {
      speakerA: 'What makes you a suitable candidate for this fast-paced startup role?',
      speakerB: 'I am highly resilient; when unexpected bugs occur, I stay calm and find solutions.'
    },
    synonyms: ['Adaptable', 'Tough', 'Strong', 'Persistent'],
    antonyms: ['Fragile', 'Vulnerable', 'Brittle', 'Sensitive'],
    collocations: ['resilient under pressure', 'remain resilient', 'resilient workforce'],
    commonMistake: {
      avoid: "He is resilient to fail.",
      use: "He is resilient in the face of failure.",
      explanation: "Pair resilient with 'against' or 'in the face of', not 'to + verb'."
    },
    speakingPrompt: 'Tell an interviewer why you are RESILIENT when dealing with unexpected challenges.',
    tag: 'Interview Asset',
    xpValue: 20
  },
  {
    id: 'v-prioritize',
    word: 'Prioritize',
    phonetic: '/praɪˈɒr.ɪ.taɪz/',
    pos: 'verb',
    difficulty: 'Beginner',
    categoryId: 'job-interview',
    categoryName: 'Job & Interview',
    meaning: 'To treat something as more important than other things.',
    hindiMeaning: 'प्राथमिकता देना',
    example: 'In a workplace, you must prioritize urgent customer requests over internal messages.',
    conversation: {
      speakerA: 'How do you handle having five different deadlines on the same day?',
      speakerB: 'I prioritize tasks based on their business urgency and impact on the team.'
    },
    synonyms: ['Order', 'Rank', 'Give precedence to', 'Focus on'],
    antonyms: ['Neglect', 'Disregard', 'Overlook', 'Postpone'],
    collocations: ['prioritize tasks', 'prioritize work over leisure', 'learn to prioritize'],
    commonMistake: {
      avoid: "I prioritize to finish early.",
      use: "I prioritize finishing the core tasks early.",
      explanation: "Prioritize takes a noun or gerund object, not a bare infinitive."
    },
    speakingPrompt: 'Use PRIORITIZE in a sentence answering a common interview question.',
    tag: 'Work Ethic',
    xpValue: 15
  },
  {
    id: 'v-leverage',
    word: 'Leverage',
    phonetic: '/ˈlev.ər.ɪdʒ/',
    pos: 'verb / noun',
    difficulty: 'Advanced',
    categoryId: 'job-interview',
    categoryName: 'Job & Interview',
    meaning: 'To use something to maximum advantage to accomplish a goal.',
    hindiMeaning: 'भरपूर लाभ उठाना / उपयोग करना',
    example: 'We can leverage our previous project code to build this prototype in half the time.',
    conversation: {
      speakerA: 'Why should we hire you for our full-stack engineering team?',
      speakerB: 'I can leverage my experience with cloud deployment to reduce your server costs immediately.'
    },
    synonyms: ['Utilize', 'Capitalize on', 'Harness', 'Exploit constructively'],
    antonyms: ['Waste', 'Squander', 'Underutilize', 'Ignore'],
    collocations: ['leverage technology', 'leverage experience', 'leverage relationships'],
    commonMistake: {
      avoid: "We will leverage for success.",
      use: "We will leverage our data for success.",
      explanation: "Leverage needs a direct object (what are you leveraging?)."
    },
    speakingPrompt: 'Use LEVERAGE to explain how you use your core skill to solve problems.',
    tag: 'Leadership',
    xpValue: 20
  },

  // 4. Workplace & Professional
  {
    id: 'v-feasible',
    word: 'Feasible',
    phonetic: '/ˈfiː.zə.bəl/',
    pos: 'adjective',
    difficulty: 'Intermediate',
    categoryId: 'workplace',
    categoryName: 'Workplace',
    meaning: 'Possible to do easily or conveniently; practically realistic.',
    hindiMeaning: 'संभव / व्यावहारिक रूप से करने योग्य',
    example: 'Delivering the entire feature in two days is simply not feasible without bugs.',
    conversation: {
      speakerA: 'Can we launch the redesign before Friday\'s investor call?',
      speakerB: 'A full launch isn\'t feasible, but we can demo a working staging preview.'
    },
    synonyms: ['Viable', 'Practicable', 'Workable', 'Achievable'],
    antonyms: ['Impossible', 'Impractical', 'Unattainable', 'Unrealistic'],
    collocations: ['economically feasible', 'technically feasible', 'feasible solution'],
    commonMistake: {
      avoid: "The plan is feasible to do.",
      use: "The plan is feasible (or viable).",
      explanation: "'Feasible' already implies doable; saying 'feasible to do' is redundant."
    },
    speakingPrompt: 'Use FEASIBLE to assess whether a deadline or project idea is realistic.',
    tag: 'Workplace Pragmatism',
    xpValue: 15
  },
  {
    id: 'v-streamline',
    word: 'Streamline',
    phonetic: '/ˈstriːm.laɪn/',
    pos: 'verb',
    difficulty: 'Intermediate',
    categoryId: 'workplace',
    categoryName: 'Workplace',
    meaning: 'To make a system, organization, or process more efficient and simple by removing unnecessary steps.',
    hindiMeaning: 'सरल और कुशल बनाना / सुव्यवस्थित करना',
    example: 'We introduced automated testing to streamline our deployment pipeline.',
    conversation: {
      speakerA: 'Why does customer onboarding take nearly an hour?',
      speakerB: 'We need to streamline the sign-up form and remove repetitive verification steps.'
    },
    synonyms: ['Simplify', 'Optimize', 'Rationalize', 'Refine'],
    antonyms: ['Complicate', 'Clutter', 'Delay', 'Convolute'],
    collocations: ['streamline processes', 'streamline operations', 'streamline workflow'],
    commonMistake: {
      avoid: "We streamlined the process into easy.",
      use: "We streamlined the process to make it easy.",
      explanation: "Use a purpose clause 'to make it...' rather than 'into easy'."
    },
    speakingPrompt: 'Use STREAMLINE to suggest a way to make team tasks quicker.',
    tag: 'Efficiency',
    xpValue: 15
  },
  {
    id: 'v-accountability',
    word: 'Accountability',
    phonetic: '/əˌkaʊn.təˈbɪl.ə.ti/',
    pos: 'noun',
    difficulty: 'Advanced',
    categoryId: 'workplace',
    categoryName: 'Workplace',
    meaning: 'The fact or condition of being responsible for actions and decisions and expected to explain them.',
    hindiMeaning: 'जवाबदेही / उत्तरदायित्व',
    example: 'Great leaders embrace personal accountability when project targets are missed.',
    conversation: {
      speakerA: 'What is the most important cultural value in high-performing teams?',
      speakerB: 'Clear accountability: everyone owns their piece and follows through reliably.'
    },
    synonyms: ['Responsibility', 'Answerability', 'Ownership', 'Liability'],
    antonyms: ['Irresponsibility', 'Blame-shifting', 'Negligence', 'Evasion'],
    collocations: ['hold someone accountable', 'demand accountability', 'sense of accountability'],
    commonMistake: {
      avoid: "I take accountability of this error.",
      use: "I take accountability for this error.",
      explanation: "Use the preposition 'for' with accountability, not 'of'."
    },
    speakingPrompt: 'Use ACCOUNTABILITY to discuss why taking responsibility builds respect.',
    tag: 'Leadership',
    xpValue: 20
  },

  // 5. Travel
  {
    id: 'v-itinerary',
    word: 'Itinerary',
    phonetic: '/aɪˈtɪn.ər.ər.i/',
    pos: 'noun',
    difficulty: 'Beginner',
    categoryId: 'travel',
    categoryName: 'Travel',
    meaning: 'A planned route or journey, often listing dates, times, and destinations.',
    hindiMeaning: 'यात्रा कार्यक्रम / सफर की योजना',
    example: 'Our weekend itinerary includes visiting the old fort, sampling local cuisine, and hiking.',
    conversation: {
      speakerA: 'Have you planned our sightseeing schedule for Mumbai?',
      speakerB: 'Yes, I shared the detailed itinerary in our travel group chat.'
    },
    synonyms: ['Travel plan', 'Schedule', 'Route', 'Timetable'],
    antonyms: ['Improvisation', 'Disorder', 'Unplanned wandering'],
    collocations: ['detailed itinerary', 'travel itinerary', 'plan an itinerary'],
    commonMistake: {
      avoid: "I made an itinerary of travel.",
      use: "I planned a travel itinerary.",
      explanation: "Use 'travel itinerary' as a compound noun."
    },
    speakingPrompt: 'Use ITINERARY in a sentence describing your dream holiday route.',
    tag: 'Travel Essential',
    xpValue: 15
  },
  {
    id: 'v-hospitable',
    word: 'Hospitable',
    phonetic: '/hɒsˈpɪt.ə.bəl/',
    pos: 'adjective',
    difficulty: 'Intermediate',
    categoryId: 'travel',
    categoryName: 'Travel',
    meaning: 'Friendly, welcoming, and generous to guests or visitors.',
    hindiMeaning: 'अतिथि-सत्कार करने वाला / मिलनसार',
    example: 'The local villagers were remarkably hospitable, offering us warm tea and shelter.',
    conversation: {
      speakerA: 'How did you find your stay in the mountain valley?',
      speakerB: 'The homestay hosts were so hospitable that we felt completely at home.'
    },
    synonyms: ['Welcoming', 'Friendly', 'Generous', 'Courteous'],
    antonyms: ['Hostile', 'Cold', 'Unwelcoming', 'Aloof'],
    collocations: ['warm and hospitable', 'hospitable hosts', 'hospitable culture'],
    commonMistake: {
      avoid: "They were hospitable with us.",
      use: "They were hospitable to us (or towards us).",
      explanation: "Use 'hospitable to' or 'towards', not 'with'."
    },
    speakingPrompt: 'Describe a warm place or person using the word HOSPITABLE.',
    tag: 'Interpersonal',
    xpValue: 15
  },

  // 6. Technology
  {
    id: 'v-scalable',
    word: 'Scalable',
    phonetic: '/ˈskeɪ.lə.bəl/',
    pos: 'adjective',
    difficulty: 'Intermediate',
    categoryId: 'technology',
    categoryName: 'Technology',
    meaning: 'Able to grow, expand, or handle an increased workload without losing performance.',
    hindiMeaning: 'विस्तार योग्य / जिसे आसानी से बड़ा किया जा सके',
    example: 'We designed the database to be scalable so it supports millions of simultaneous users.',
    conversation: {
      speakerA: 'Will our backend crash if our product goes viral on LinkedIn?',
      speakerB: 'Not at all; our cloud architecture is fully scalable and auto-provisions servers.'
    },
    synonyms: ['Expandable', 'Adaptable', 'Extensible', 'Flexible'],
    antonyms: ['Rigid', 'Unadaptable', 'Fixed-capacity', 'Bottlenecked'],
    collocations: ['scalable architecture', 'highly scalable', 'scalable business model'],
    commonMistake: {
      avoid: "The code is scalable to many users.",
      use: "The code is scalable for millions of users.",
      explanation: "Use 'scalable for' or 'scalable to handle'."
    },
    speakingPrompt: 'Use SCALABLE to describe a modern digital tool or system.',
    tag: 'Tech Literacy',
    xpValue: 15
  },
  {
    id: 'v-intuitive',
    word: 'Intuitive',
    phonetic: '/ɪnˈtjuː.ɪ.tɪv/',
    pos: 'adjective',
    difficulty: 'Intermediate',
    categoryId: 'technology',
    categoryName: 'Technology',
    meaning: 'Easy to understand and use immediately without needing complex training or instructions.',
    hindiMeaning: 'सहज / आसानी से समझ आने वाला',
    example: 'The new SpeakUp user interface is intuitive enough that students start speaking in 10 seconds.',
    conversation: {
      speakerA: 'What made you choose this design over the previous layout?',
      speakerB: 'The buttons and navigation are completely intuitive; users never get lost.'
    },
    synonyms: ['User-friendly', 'Straightforward', 'Self-explanatory', 'Accessible'],
    antonyms: ['Confusing', 'Counter-intuitive', 'Complex', 'Convoluted'],
    collocations: ['intuitive design', 'intuitive interface', 'intuitive navigation'],
    commonMistake: {
      avoid: "The app is intuitive for learning.",
      use: "The app has an intuitive design for learners.",
      explanation: "'Intuitive' describes how naturally something feels to the user."
    },
    speakingPrompt: 'Describe your favorite smartphone app using the word INTUITIVE.',
    tag: 'User Experience',
    xpValue: 15
  },

  // 7. Emotions & Feelings
  {
    id: 'v-overwhelmed',
    word: 'Overwhelmed',
    phonetic: '/ˌəʊ.vəˈwelmd/',
    pos: 'adjective',
    difficulty: 'Beginner',
    categoryId: 'emotions',
    categoryName: 'Emotions & Feelings',
    meaning: 'Feeling completely swamped by too many tasks, intense emotions, or demands.',
    hindiMeaning: 'अभिभूत / अत्यधिक दबाव महसूस करना',
    example: 'Whenever you feel overwhelmed, break your goals into small 15-minute sprints.',
    conversation: {
      speakerA: 'You seem quiet today. Is everything okay with your campus work?',
      speakerB: 'I felt overwhelmed with exam prep, but talking it out helps relieve the stress.'
    },
    synonyms: ['Overburdened', 'Stressed', 'Swamped', 'Flustered'],
    antonyms: ['Calm', 'Relaxed', 'Composed', 'In control'],
    collocations: ['feel overwhelmed', 'overwhelmed by work', 'overwhelmed with emotions'],
    commonMistake: {
      avoid: "I am overwhelmed from studying.",
      use: "I feel overwhelmed by studying (or with studying).",
      explanation: "Use 'by' or 'with' after overwhelmed, not 'from'."
    },
    speakingPrompt: 'Use OVERWHELMED in a sentence explaining how you regain focus when stressed.',
    tag: 'Emotional Fluency',
    xpValue: 15
  },
  {
    id: 'v-empathy',
    word: 'Empathy',
    phonetic: '/ˈem.pə.θi/',
    pos: 'noun',
    difficulty: 'Intermediate',
    categoryId: 'emotions',
    categoryName: 'Emotions & Feelings',
    meaning: 'The ability to understand and share the feelings and perspectives of another person.',
    hindiMeaning: 'सहानुभूति / दूसरे की भावना को समझना',
    example: 'Active listening requires empathy; you must listen to understand, not just to reply.',
    conversation: {
      speakerA: 'Why did the client appreciate your customer support response so much?',
      speakerB: 'I demonstrated real empathy for their frustration before offering technical solutions.'
    },
    synonyms: ['Compassion', 'Understanding', 'Sensitivity', 'Fellow feeling'],
    antonyms: ['Apathy', 'Callousness', 'Indifference', 'Self-centeredness'],
    collocations: ['show empathy', 'practice empathy', 'deep empathy for someone'],
    commonMistake: {
      avoid: "I have empathy to you.",
      use: "I have empathy for you.",
      explanation: "The correct preposition is 'empathy for someone'."
    },
    speakingPrompt: 'Use EMPATHY in a sentence about solving a misunderstanding with a friend.',
    tag: 'Soft Skills',
    xpValue: 15
  },

  // 8. Confidence & Personality
  {
    id: 'v-poised',
    word: 'Poised',
    phonetic: '/pɔɪzd/',
    pos: 'adjective',
    difficulty: 'Advanced',
    categoryId: 'confidence',
    categoryName: 'Confidence & Personality',
    meaning: 'Having a calm, self-confident, and dignified manner.',
    hindiMeaning: 'संतुलित / शांत और आत्मविश्वासी',
    example: 'Despite the tough grilling from the judges, she remained poised and answered every inquiry.',
    conversation: {
      speakerA: 'How did your junior manage to speak before a hall of 500 people?',
      speakerB: 'She was remarkably poised, breathing deeply and delivering each point with grace.'
    },
    synonyms: ['Composed', 'Collected', 'Self-possessed', 'Graceful'],
    antonyms: ['Flustered', 'Agitated', 'Unsettled', 'Nervous'],
    collocations: ['remain poised', 'poised under pressure', 'poised speaker'],
    commonMistake: {
      avoid: "She stayed poised to panic.",
      use: "She stayed poised and resisted panic.",
      explanation: "Poised refers to composure; do not attach incompatible verbs."
    },
    speakingPrompt: 'Use POISED in a sentence describing a public figure or friend you admire.',
    tag: 'Elegance',
    xpValue: 20
  },
  {
    id: 'v-assertive',
    word: 'Assertive',
    phonetic: '/əˈsɜː.tɪv/',
    pos: 'adjective',
    difficulty: 'Intermediate',
    categoryId: 'confidence',
    categoryName: 'Confidence & Personality',
    meaning: 'Expressing opinions and desires firmly and with confidence without being aggressive.',
    hindiMeaning: 'दृढ़ / अपनी बात आत्मविश्वास से रखने वाला',
    example: 'Being assertive allows you to say no politely when your plate is full.',
    conversation: {
      speakerA: 'Did you accept that unfair project assignment?',
      speakerB: 'No, I was assertive and explained why the workload needed to be redistributed.'
    },
    synonyms: ['Confident', 'Firm', 'Decisive', 'Direct'],
    antonyms: ['Passive', 'Timid', 'Aggressive', 'Submissive'],
    collocations: ['be assertive', 'assertive communication', 'assertive posture'],
    commonMistake: {
      avoid: "Assertive means fighting with people.",
      use: "Assertive means standing up for yourself politely without aggression.",
      explanation: "Assertiveness is distinct from hostility or aggressiveness."
    },
    speakingPrompt: 'Use ASSERTIVE in a sentence about polite boundaries at work or college.',
    tag: 'Assertiveness',
    xpValue: 15
  },

  // 9. Communication
  {
    id: 'v-nuanced',
    word: 'Nuanced',
    phonetic: '/ˈnjuː.ɑːnst/',
    pos: 'adjective',
    difficulty: 'Advanced',
    categoryId: 'communication',
    categoryName: 'Communication',
    meaning: 'Characterized by subtle distinctions, variations, or delicate depths of meaning.',
    hindiMeaning: 'बारीकियों से भरा / सूक्ष्म भेद वाला',
    example: 'His presentation offered a nuanced take on modern college career choices.',
    conversation: {
      speakerA: 'Is remote work purely positive or purely negative?',
      speakerB: 'It requires a nuanced view: it offers flexibility but requires disciplined communication.'
    },
    synonyms: ['Subtle', 'Sophisticated', 'Multi-layered', 'Discerning'],
    antonyms: ['Simplistic', 'Black-and-white', 'Crude', 'Superficial'],
    collocations: ['nuanced perspective', 'nuanced discussion', 'nuanced understanding'],
    commonMistake: {
      avoid: "He gave a nuanced on the issue.",
      use: "He gave a nuanced explanation of the issue.",
      explanation: "'Nuanced' is an adjective, so it needs a noun (perspective, explanation, view)."
    },
    speakingPrompt: 'Use NUANCED in a sentence about debating a controversial topic constructively.',
    tag: 'Intellectual Polish',
    xpValue: 20
  },
  {
    id: 'v-coherent',
    word: 'Coherent',
    phonetic: '/kəʊˈhɪə.rənt/',
    pos: 'adjective',
    difficulty: 'Intermediate',
    categoryId: 'communication',
    categoryName: 'Communication',
    meaning: 'Logical, orderly, and clearly connected so that listeners can easily understand.',
    hindiMeaning: 'तर्कसंगत / सुसंगत',
    example: 'Using transition connectors like \'furthermore\' keeps your speech coherent.',
    conversation: {
      speakerA: 'Why did the audience follow his technical keynote so smoothly?',
      speakerB: 'Because his argument was completely coherent from the intro to conclusion.'
    },
    synonyms: ['Logical', 'Structured', 'Consistent', 'Lucid'],
    antonyms: ['Incoherent', 'Disjointed', 'Confused', 'Muddled'],
    collocations: ['coherent argument', 'coherent thought', 'sound coherent'],
    commonMistake: {
      avoid: "His speech was coherent with my thinking.",
      use: "His speech was coherent and easy to follow.",
      explanation: "'Coherent' describes internal clarity and logic, not agreement with someone."
    },
    speakingPrompt: 'Use COHERENT in a sentence about organizing a speech outline.',
    tag: 'Structure',
    xpValue: 15
  },

  // 10. Business English
  {
    id: 'v-benchmark',
    word: 'Benchmark',
    phonetic: '/ˈbentʃ.mɑːk/',
    pos: 'noun / verb',
    difficulty: 'Intermediate',
    categoryId: 'business',
    categoryName: 'Business English',
    meaning: 'A standard or point of reference against which things may be compared and assessed.',
    hindiMeaning: 'मानक / तुलना का पैमाना',
    example: 'Our startup uses industry benchmarks to ensure our customer satisfaction stays above 90%.',
    conversation: {
      speakerA: 'How do we know if our app\'s speed is acceptable?',
      speakerB: 'We should benchmark our loading latency against top competitors.'
    },
    synonyms: ['Standard', 'Criterion', 'Gauge', 'Touchstone'],
    antonyms: ['Abnormality', 'Deviation', 'Outlier'],
    collocations: ['set a benchmark', 'industry benchmark', 'benchmark against competitors'],
    commonMistake: {
      avoid: "We benchmarked to the best company.",
      use: "We benchmarked against the best company.",
      explanation: "Use 'benchmark against', not 'to'."
    },
    speakingPrompt: 'Use BENCHMARK in a sentence discussing quality standards.',
    tag: 'Business Acumen',
    xpValue: 15
  },
  {
    id: 'v-tangible',
    word: 'Tangible',
    phonetic: '/ˈtæn.dʒə.bəl/',
    pos: 'adjective',
    difficulty: 'Intermediate',
    categoryId: 'business',
    categoryName: 'Business English',
    meaning: 'Real and able to be shown, felt, or noticed; definite rather than imaginary.',
    hindiMeaning: 'ठोस / वास्तविक',
    example: 'Practicing 10 minutes a day produces tangible improvements in spoken fluency within a month.',
    conversation: {
      speakerA: 'What did our communication training accomplish this quarter?',
      speakerB: 'We saw tangible results: a 30% drop in interview anxiety among our students.'
    },
    synonyms: ['Concrete', 'Measurable', 'Real', 'Noticeable'],
    antonyms: ['Intangible', 'Abstract', 'Vague', 'Imperceptible'],
    collocations: ['tangible results', 'tangible benefits', 'tangible evidence'],
    commonMistake: {
      avoid: "The idea is tangible.",
      use: "The idea produces tangible outcomes.",
      explanation: "Abstract ideas themselves are rarely tangible; their outcomes are."
    },
    speakingPrompt: 'Use TANGIBLE to describe a visible improvement you noticed in yourself.',
    tag: 'Professional',
    xpValue: 15
  },

  // 11. Academic English
  {
    id: 'v-substantiate',
    word: 'Substantiate',
    phonetic: '/səbˈstæn.ʃi.eɪt/',
    pos: 'verb',
    difficulty: 'Advanced',
    categoryId: 'academic',
    categoryName: 'Academic English',
    meaning: 'To provide evidence or data to prove the truth of an assertion.',
    hindiMeaning: 'प्रमाणित करना / सबूत से सिद्ध करना',
    example: 'You must substantiate your thesis argument with peer-reviewed research papers.',
    conversation: {
      speakerA: 'The professor challenged my debate claims during the seminar.',
      speakerB: 'Did you substantiate your point with survey figures from the census?'
    },
    synonyms: ['Corroborate', 'Validate', 'Verify', 'Support with facts'],
    antonyms: ['Disprove', 'Refute', 'Undermine', 'Contradict'],
    collocations: ['substantiate a claim', 'substantiate an allegation', 'substantiate with data'],
    commonMistake: {
      avoid: "I substantiate that it is true.",
      use: "I substantiate my claim with data.",
      explanation: "Substantiate takes the claim as the direct object."
    },
    speakingPrompt: 'Use SUBSTANTIATE in a sentence about backing up an opinion in a group discussion.',
    tag: 'Scholarly',
    xpValue: 20
  },

  // 12. Commonly Used Verbs
  {
    id: 'v-elaborate',
    word: 'Elaborate',
    phonetic: '/iˈlæb.ə.reɪt/',
    pos: 'verb / adjective',
    difficulty: 'Beginner',
    categoryId: 'verbs',
    categoryName: 'Commonly Used Verbs',
    meaning: 'To develop or explain an idea in greater detail and richness.',
    hindiMeaning: 'विस्तार से बताना',
    example: 'Could you elaborate on what you mean by proactive team communication?',
    conversation: {
      speakerA: 'I think our college festival needs a fresh theme.',
      speakerB: 'That sounds interesting! Could you elaborate on what theme you have in mind?'
    },
    synonyms: ['Expand on', 'Flesh out', 'Clarify', 'Detail'],
    antonyms: ['Summarize', 'Condense', 'Abbreviate', 'Simplify'],
    collocations: ['elaborate on an idea', 'elaborate further', 'elaborate plan'],
    commonMistake: {
      avoid: "Could you elaborate about this?",
      use: "Could you elaborate on this?",
      explanation: "Use the preposition 'on' with the verb elaborate, never 'about'."
    },
    speakingPrompt: 'Use ELABORATE in a sentence asking someone politely for more details.',
    tag: 'Power Verb',
    xpValue: 15
  },
  {
    id: 'v-facilitate',
    word: 'Facilitate',
    phonetic: '/fəˈsɪl.ɪ.teɪt/',
    pos: 'verb',
    difficulty: 'Intermediate',
    categoryId: 'verbs',
    categoryName: 'Commonly Used Verbs',
    meaning: 'To make an action, process, or meeting easier and help it run smoothly.',
    hindiMeaning: 'आसान बनाना / सुगम करना',
    example: 'The moderator will facilitate today\'s group discussion so everyone gets a turn.',
    conversation: {
      speakerA: 'What role will you play in tomorrow\'s workshop?',
      speakerB: 'I will facilitate the brainstorming breakout rooms for the first-year students.'
    },
    synonyms: ['Enable', 'Assist', 'Smooth the way for', 'Expedite'],
    antonyms: ['Hinder', 'Block', 'Impede', 'Obstruct'],
    collocations: ['facilitate discussion', 'facilitate learning', 'facilitate collaboration'],
    commonMistake: {
      avoid: "He facilitated me to learn.",
      use: "He facilitated my learning (or facilitated the workshop).",
      explanation: "Facilitate applies to processes and activities, not people directly."
    },
    speakingPrompt: 'Use FACILITATE in a sentence about helping a team project run smoother.',
    tag: 'Action Verb',
    xpValue: 15
  },

  // 13. Phrasal Verbs
  {
    id: 'v-bring-up',
    word: 'Bring up',
    phonetic: '/brɪŋ ʌp/',
    pos: 'phrasal verb',
    difficulty: 'Beginner',
    categoryId: 'phrasal-verbs',
    categoryName: 'Phrasal Verbs',
    meaning: 'To introduce a topic, question, or suggestion into a conversation.',
    hindiMeaning: 'मुद्दा उठाना / चर्चा में लाना',
    example: 'I was glad you brought up the topic of flexible meeting hours during the standup.',
    conversation: {
      speakerA: 'Did you mention our server budget to the manager?',
      speakerB: 'Yes, I brought it up right at the beginning of our one-on-one call.'
    },
    synonyms: ['Mention', 'Introduce', 'Raise', 'Broach'],
    antonyms: ['Bottle up', 'Suppress', 'Ignore', 'Silence'],
    collocations: ['bring up a topic', 'bring up an issue', 'bring it up gently'],
    commonMistake: {
      avoid: "I brought out the topic in the meeting.",
      use: "I brought up the topic in the meeting.",
      explanation: "'Bring out' means to release or highlight; 'bring up' means to mention."
    },
    speakingPrompt: 'Use BRING UP in a sentence about initiating a difficult or important conversation.',
    tag: 'Phrasal Verb',
    xpValue: 15
  },
  {
    id: 'v-follow-through',
    word: 'Follow through',
    phonetic: '/ˈfɒl.əʊ θruː/',
    pos: 'phrasal verb',
    difficulty: 'Intermediate',
    categoryId: 'phrasal-verbs',
    categoryName: 'Phrasal Verbs',
    meaning: 'To continue an action or commitment until it is completed; to keep your word.',
    hindiMeaning: 'किए गए वादे को अंत तक निभाना',
    example: 'True reliability means following through on your commitments even when busy.',
    conversation: {
      speakerA: 'Can we rely on Rohan to deliver the video edits on time?',
      speakerB: 'Absolutely. He always follows through on his promises.'
    },
    synonyms: ['Carry out', 'Execute', 'Deliver', 'Complete'],
    antonyms: ['Abandon', 'Back out', 'Renege', 'Drop the ball'],
    collocations: ['follow through on a promise', 'follow through with plans'],
    commonMistake: {
      avoid: "He followed up his promise.",
      use: "He followed through on his promise.",
      explanation: "'Follow up' means checking on status; 'follow through' means completing it yourself."
    },
    speakingPrompt: 'Use FOLLOW THROUGH in a sentence about personal discipline or integrity.',
    tag: 'Action Verb',
    xpValue: 15
  },

  // 14. Idioms & Expressions
  {
    id: 'v-break-the-ice',
    word: 'Break the ice',
    phonetic: '/breɪk ðiː aɪs/',
    pos: 'idiom',
    difficulty: 'Beginner',
    categoryId: 'idioms',
    categoryName: 'Idioms & Expressions',
    meaning: 'To do or say something that relieves tension and makes people feel comfortable in a new setting.',
    hindiMeaning: 'शुरुआती झिझक दूर करना / बातचीत शुरू करना',
    example: 'He shared a humorous childhood story to break the ice before the workshop began.',
    conversation: {
      speakerA: 'Everyone seemed so stiff at the networking dinner.',
      speakerB: 'I know! Thankfully, Ananya broke the ice with a fun quick trivia question.'
    },
    synonyms: ['Warm up the room', 'Ease tension', 'Initiate conversation'],
    antonyms: ['Freeze up', 'Maintain silence', 'Keep distance'],
    collocations: ['break the ice with a joke', 'ice-breaker activity', 'a way to break the ice'],
    commonMistake: {
      avoid: "Break an ice.",
      use: "Break the ice.",
      explanation: "This is a fixed idiom: always use 'the ice'."
    },
    speakingPrompt: 'Describe your favorite way to BREAK THE ICE when meeting someone new.',
    tag: 'Social Fluency',
    xpValue: 15
  },
  {
    id: 'v-piece-of-cake',
    word: 'A piece of cake',
    phonetic: '/ə piːs əv keɪk/',
    pos: 'idiom',
    difficulty: 'Beginner',
    categoryId: 'idioms',
    categoryName: 'Idioms & Expressions',
    meaning: 'Something that is very easy or effortless to accomplish.',
    hindiMeaning: 'बेहद आसान काम / बाएं हाथ का खेल',
    example: 'Once you understand the basic formulas, solving these math problems is a piece of cake.',
    conversation: {
      speakerA: 'Was the English speaking test difficult today?',
      speakerB: 'Not at all! After all our SpeakUp practice, it was a piece of cake.'
    },
    synonyms: ['Breeze', 'Child\'s play', 'Walk in the park', 'Effortless'],
    antonyms: ['Uphill battle', 'Tough nut to crack', 'Herculean task'],
    collocations: ['be a piece of cake', 'turn out to be a piece of cake'],
    commonMistake: {
      avoid: "The exam was piece of cake.",
      use: "The exam was a piece of cake.",
      explanation: "Do not omit the indefinite article 'a'."
    },
    speakingPrompt: 'Use A PIECE OF CAKE in a sentence about a skill that used to be hard but is now easy.',
    tag: 'Classic Idiom',
    xpValue: 15
  }
];

export const VOCABULARY_ITEMS = VOCABULARY_LIST;

// Rotating Word of the Day Pool
export const WORD_OF_THE_DAY_POOL = [
  {
    id: 'wotd-confident',
    word: 'Confident',
    pos: 'adjective',
    phonetic: '/ˈkɒn.fɪ.dənt/',
    meaning: 'Feeling sure about your abilities and qualities.',
    hindiMeaning: 'आत्मविश्वासी',
    example: 'I feel confident when I express my ideas clearly in group discussions.',
    realUsage: 'Self-confidence grows through daily practice, not through perfection.',
    challenge: 'Speak for 30 seconds about one skill you feel confident using today.',
    tag: 'Word of the Day',
    category: 'Confidence & Personality'
  },
  {
    id: 'wotd-resilient',
    word: 'Resilient',
    pos: 'adjective',
    phonetic: '/rɪˈzɪl.jənt/',
    meaning: 'Able to recover quickly from setbacks or difficult situations.',
    hindiMeaning: 'कठिनाइयों से उबरने वाला',
    example: 'Resilient communicators view stumbles as learning moments rather than failures.',
    realUsage: 'Being resilient in interviews means staying composed even when asked tough questions.',
    challenge: 'Tell a 30-second story about a time you showed resilience.',
    tag: 'Word of the Day',
    category: 'Job & Interview'
  },
  {
    id: 'wotd-articulate',
    word: 'Articulate',
    pos: 'verb / adjective',
    phonetic: '/ɑːrˈtɪk.jə.lət/',
    meaning: 'To express your thoughts clearly and precisely in spoken words.',
    hindiMeaning: 'स्पष्ट रूप से व्यक्त करना',
    example: 'She articulated her vision for the tech society so well that everyone voted for her.',
    realUsage: 'Articulate speakers pause deliberately to organize thoughts before answering.',
    challenge: 'Use articulate in a sentence describing your communication goals.',
    tag: 'Word of the Day',
    category: 'College & Student Life'
  }
];

// Current Word of the Day (deterministic based on day of year)
export const WORD_OF_THE_DAY = (() => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return WORD_OF_THE_DAY_POOL[dayOfYear % WORD_OF_THE_DAY_POOL.length];
})();

// Confusing Words Comparison Pairs
export const CONFUSING_WORDS_LIST = [
  {
    id: 'pair-affect-effect',
    pairTitle: 'Affect vs. Effect',
    wordA: {
      word: 'Affect',
      pos: 'usually a VERB',
      meaning: 'To influence or make a change to something.',
      example: 'Lack of sleep can negatively affect your speech delivery.',
      quickTip: 'A = Action (Affect is an Action/Verb)'
    },
    wordB: {
      word: 'Effect',
      pos: 'usually a NOUN',
      meaning: 'The result or consequence of a change.',
      example: 'Daily practice has a positive effect on your confidence.',
      quickTip: 'E = End result (Effect is an End result/Noun)'
    },
    miniQuiz: {
      question: 'The new attendance policy will _____ all final-year students.',
      correctWord: 'affect',
      explanation: 'Here we need a verb meaning "to influence", so "affect" is correct.'
    }
  },
  {
    id: 'pair-advice-advise',
    pairTitle: 'Advice vs. Advise',
    wordA: {
      word: 'Advice',
      pos: 'NOUN (rhymes with "ice")',
      meaning: 'Recommendations or suggestions offered to help someone.',
      example: 'My mentor gave me valuable advice on handling interview stress.',
      quickTip: 'Advice has a \'c\' like \'Council\' (it is a thing).'
    },
    wordB: {
      word: 'Advise',
      pos: 'VERB (rhymes with "wise")',
      meaning: 'To give counsel or suggest a course of action to someone.',
      example: 'I would advise you to rehearse your introduction out loud.',
      quickTip: 'Advise has an \'s\' like \'Speak\' (it is an action).'
    },
    miniQuiz: {
      question: 'Can you please _____ me on which career path to choose?',
      correctWord: 'advise',
      explanation: 'We need an action verb here, so "advise" is correct.'
    }
  },
  {
    id: 'pair-accept-except',
    pairTitle: 'Accept vs. Except',
    wordA: {
      word: 'Accept',
      pos: 'VERB',
      meaning: 'To agree to receive or take something willingly.',
      example: 'She was delighted to accept the summer internship offer.',
      quickTip: 'Accept = Acknowledge and take.'
    },
    wordB: {
      word: 'Except',
      pos: 'PREPOSITION',
      meaning: 'Not including; other than.',
      example: 'Everyone was present in the meeting except the team lead.',
      quickTip: 'Except = Exclude.'
    },
    miniQuiz: {
      question: 'All team members participated, _____ for one intern who was sick.',
      correctWord: 'except',
      explanation: 'We mean "excluding", so "except" is the right choice.'
    }
  },
  {
    id: 'pair-lose-loose',
    pairTitle: 'Lose vs. Loose',
    wordA: {
      word: 'Lose',
      pos: 'VERB (one \'o\')',
      meaning: 'To fail to keep, win, or locate something.',
      example: 'If you speak too quickly, you might lose the audience\'s attention.',
      quickTip: 'One \'o\' lost its partner.'
    },
    wordB: {
      word: 'Loose',
      pos: 'ADJECTIVE (two \'o\'s)',
      meaning: 'Not tight, fitting loosely, or not firmly fixed.',
      example: 'The microphone cable was loose, causing static noise.',
      quickTip: 'Two \'o\'s have plenty of room (loose fit).'
    },
    miniQuiz: {
      question: 'Make sure not to _____ your focus during the group discussion.',
      correctWord: 'lose',
      explanation: 'We need the verb meaning "misplace or fail to retain", which is "lose".'
    }
  },
  {
    id: 'pair-then-than',
    pairTitle: 'Then vs. Than',
    wordA: {
      word: 'Then',
      pos: 'ADVERB',
      meaning: 'At that time; or next in a sequence.',
      example: 'We practiced for 20 minutes, and then we reviewed our transcript.',
      quickTip: 'Then relates to Time (both have \'e\').'
    },
    wordB: {
      word: 'Than',
      pos: 'CONJUNCTION / PREPOSITION',
      meaning: 'Used to introduce the second element in a comparison.',
      example: 'Speaking out loud is much more effective than silent reading.',
      quickTip: 'Than relates to compArison (both have \'a\').'
    },
    miniQuiz: {
      question: 'She is more confident _____ she was last semester.',
      correctWord: 'than',
      explanation: 'We are comparing past and present confidence, so "than" is correct.'
    }
  },
  {
    id: 'pair-your-youre',
    pairTitle: 'Your vs. You\'re',
    wordA: {
      word: 'Your',
      pos: 'POSSESSIVE PRONOUN',
      meaning: 'Belonging to you.',
      example: 'Your voice is clear and pleasant to listen to.',
      quickTip: 'Belongs to you.'
    },
    wordB: {
      word: 'You\'re',
      pos: 'CONTRACTION (You + are)',
      meaning: 'Short for "you are".',
      example: 'You\'re doing a fantastic job with daily practice!',
      quickTip: 'Test if you can say "you are". If yes, use you\'re.'
    },
    miniQuiz: {
      question: 'I think _____ ready to ace that job interview!',
      correctWord: 'you\'re',
      explanation: 'You can say "you are ready", so the contraction "you\'re" is correct.'
    }
  },
  {
    id: 'pair-bring-take',
    pairTitle: 'Bring vs. Take',
    wordA: {
      word: 'Bring',
      pos: 'VERB (movement TOWARD)',
      meaning: 'To carry or convey toward the speaker or current location.',
      example: 'Please bring your resume to my office tomorrow.',
      quickTip: 'Bring = come here with it.'
    },
    wordB: {
      word: 'Take',
      pos: 'VERB (movement AWAY)',
      meaning: 'To carry or convey away from the speaker or current location.',
      example: 'Take these presentation notes home to review tonight.',
      quickTip: 'Take = go there with it.'
    },
    miniQuiz: {
      question: 'When you visit our campus, please _____ a valid student ID card.',
      correctWord: 'bring',
      explanation: 'Movement toward the campus where the speaker is requires "bring".'
    }
  }
];

// Natural Conversational Phrases & Idioms with Context
export const PHRASES_AND_IDIOMS_LIST = [
  {
    id: 'ph-agree',
    title: 'Expressing Agreement Naturally',
    category: 'Conversational Phrases',
    items: [
      {
        phrase: 'I completely agree with you.',
        formality: 'Neutral / Formal',
        meaning: 'Full 100% agreement.',
        example: 'I completely agree with your assessment of the timeline.'
      },
      {
        phrase: 'I see eye to eye with you on this.',
        formality: 'Conversational Idiom',
        meaning: 'To share the exact same perspective.',
        example: 'We definitely see eye to eye on how to structure the slides.'
      },
      {
        phrase: 'You took the words right out of my mouth!',
        formality: 'Casual / Friendly',
        meaning: 'I was just about to say the exact same thing.',
        example: 'You took the words right out of my mouth; that was my plan too!'
      }
    ]
  },
  {
    id: 'ph-disagree',
    title: 'Diplomatic & Polite Disagreement',
    category: 'Professional Workplace',
    items: [
      {
        phrase: 'I see where you are coming from, but...',
        formality: 'Diplomatic & Professional',
        meaning: 'Validates their viewpoint before presenting an alternative.',
        example: 'I see where you are coming from, but our budget will not permit it.'
      },
      {
        phrase: 'I have a slightly different perspective on this.',
        formality: 'Polite / Meeting',
        meaning: 'Softens disagreement by calling it a distinct angle.',
        example: 'I have a slightly different perspective on our marketing strategy.'
      },
      {
        phrase: 'I agree to some extent, however...',
        formality: 'Balanced / Academic',
        meaning: 'Partial agreement with reservations.',
        example: 'I agree to some extent, however user testing might prove otherwise.'
      }
    ]
  },
  {
    id: 'ph-clarify',
    title: 'Asking for Clarification Without Awkwardness',
    category: 'Communication',
    items: [
      {
        phrase: 'Could you elaborate a bit more on that point?',
        formality: 'Polite & Professional',
        meaning: 'Asks the speaker to expand with more details.',
        example: 'Could you elaborate on the second phase of the deployment?'
      },
      {
        phrase: 'Just to make sure we are on the same page...',
        formality: 'Workplace Connector',
        meaning: 'Confirms shared understanding before proceeding.',
        example: 'Just to make sure we are on the same page, the draft is due Tuesday?'
      },
      {
        phrase: 'If I understand correctly, you are saying that...',
        formality: 'Active Listening',
        meaning: 'Paraphrasing their point to prevent misunderstandings.',
        example: 'If I understand correctly, we are prioritizing mobile users first?'
      }
    ]
  },
  {
    id: 'ph-buying-time',
    title: 'Buying Time to Think Calmly',
    category: 'Interview & Presentation',
    items: [
      {
        phrase: 'That is an insightful question. Let me reflect on that for a second.',
        formality: 'Executive / Interview',
        meaning: 'Buys 3-5 seconds to organize thoughts gracefully.',
        example: 'That is an insightful question. Let me reflect on our top priority.'
      },
      {
        phrase: 'The way I look at this situation is...',
        formality: 'Smooth Transition',
        meaning: 'Transitions into your reasoning while gathering your points.',
        example: 'The way I look at this situation is that quality precedes speed.'
      }
    ]
  }
];

// 11 Real-Life Scenarios with Recommended Vocabulary
export const SCENARIO_VOCABULARY_MAP = [
  {
    id: 'sc-interview',
    title: 'Job Interview',
    icon: 'Briefcase',
    desc: 'Power expressions to articulate strengths, experience, and problem-solving.',
    recommendedWords: ['v-articulate', 'v-resilient', 'v-prioritize', 'v-leverage', 'v-confident'],
    speakingChallenge: 'Explain how you handled a difficult project using LEVERAGE and RESILIENT.'
  },
  {
    id: 'sc-professor',
    title: 'Talking to a Professor',
    icon: 'GraduationCap',
    desc: 'Respectful, clear, and academic phrasing for office hours and assignment queries.',
    recommendedWords: ['v-elaborate', 'v-substantiate', 'v-hesitant', 'v-feasible'],
    speakingChallenge: 'Politely ask your professor to ELABORATE on an assignment requirement.'
  },
  {
    id: 'sc-presentation',
    title: 'Giving a Presentation',
    icon: 'Presentation',
    desc: 'Connectors and structured language to guide an audience seamlessly.',
    recommendedWords: ['v-in-a-nutshell', 'v-coherent', 'v-tangible', 'v-poised'],
    speakingChallenge: 'Open your presentation using IN A NUTSHELL to summarize your main thesis.'
  },
  {
    id: 'sc-classmates',
    title: 'Talking to Classmates',
    icon: 'Users',
    desc: 'Natural, friendly, and collaborative student conversation.',
    recommendedWords: ['v-collaborate', 'v-procrastinate', 'v-spontaneous', 'v-break-the-ice'],
    speakingChallenge: 'Convince a friend to COLLABORATE with you on a semester hackathon.'
  },
  {
    id: 'sc-workplace',
    title: 'Professional Workplace Conversation',
    icon: 'Building2',
    desc: 'Executive terminology for meetings, standups, and manager alignment.',
    recommendedWords: ['v-streamline', 'v-feasible', 'v-accountability', 'v-benchmark'],
    speakingChallenge: 'Propose a way to STREAMLINE daily reporting in your team meeting.'
  },
  {
    id: 'sc-group-discussion',
    title: 'Group Discussion',
    icon: 'MessagesSquare',
    desc: 'Diplomatic phrases to enter debates, voice agreement, and guide consensus.',
    recommendedWords: ['v-nuanced', 'v-assertive', 'v-coherent', 'v-articulate'],
    speakingChallenge: 'Present a NUANCED opinion on modern technology without interrupting others.'
  },
  {
    id: 'sc-asking-help',
    title: 'Asking for Help',
    icon: 'HelpCircle',
    desc: 'Polite inquiries that make others eager to support you without feeling burdened.',
    recommendedWords: ['v-hesitant', 'v-elaborate', 'v-bring-up', 'v-empathy'],
    speakingChallenge: 'Overcome feeling HESITANT to ask a colleague for a 10-minute code review.'
  },
  {
    id: 'sc-meeting-new-people',
    title: 'Meeting New People',
    icon: 'Sparkles',
    desc: 'Friendly openers, active empathy, and warm follow-up remarks.',
    recommendedWords: ['v-break-the-ice', 'v-empathy', 'v-spontaneous', 'v-hospitable'],
    speakingChallenge: 'Use BREAK THE ICE to start a natural chat at a technology conference.'
  },
  {
    id: 'sc-phone-call',
    title: 'Talking on a Phone Call',
    icon: 'PhoneCall',
    desc: 'Clear vocal cadence and polite telephone etiquette for interviews or service.',
    recommendedWords: ['v-articulate', 'v-follow-through', 'v-coherent', 'v-confident'],
    speakingChallenge: 'Confirm a phone interview appointment and promise to FOLLOW THROUGH on sending your portfolio.'
  },
  {
    id: 'sc-hr-conversation',
    title: 'HR & Onboarding Conversation',
    icon: 'UserCheck',
    desc: 'Professional communication regarding benefits, culture, and career trajectories.',
    recommendedWords: ['v-prioritize', 'v-accountability', 'v-tangible', 'v-leverage'],
    speakingChallenge: 'Discuss your first 90-day goals with HR using PRIORITIZE and TANGIBLE.'
  },
  {
    id: 'sc-introducing-yourself',
    title: 'Introducing Yourself',
    icon: 'Smile',
    desc: 'Crisp elevator pitch highlighting your background, passions, and goals.',
    recommendedWords: ['v-confident', 'v-articulate', 'v-poised', 'v-collaborate'],
    speakingChallenge: 'Give a 45-second introduction of yourself sounding POISED and CONFIDENT.'
  }
];

// Interactive Smart Quiz Questions Bank
export const QUIZ_QUESTIONS_BANK = [
  {
    id: 'q-1',
    type: 'meaning',
    question: 'What is the precise meaning of "Articulate"?',
    options: [
      'To speak loudly and aggressively',
      'To express thoughts and ideas with clarity and precision',
      'To memorize long speeches word for word',
      'To talk continuously without pausing'
    ],
    correctAnswer: 1,
    explanation: '"Articulate" means communicating your thoughts and arguments clearly, coherently, and effectively.',
    example: 'An articulate speaker helps listeners understand complex topics effortlessly.'
  },
  {
    id: 'q-2',
    type: 'fill-blank',
    question: 'Fill in the blank: "After months of practice, Priya felt completely _____ about her job interview."',
    options: [
      'hesitant',
      'confident',
      'procrastinating',
      'incoherent'
    ],
    correctAnswer: 1,
    explanation: '"Confident" means feeling sure of your capabilities, which perfectly fits after months of preparation.',
    example: 'I feel confident about answering situational questions.'
  },
  {
    id: 'q-3',
    type: 'collocation',
    question: 'Which is the correct English collocation?',
    options: [
      'I am confident on my presentation.',
      'I am confident about my presentation.',
      'I am confident with to present.',
      'I am confident at my presentation.'
    ],
    correctAnswer: 1,
    explanation: 'The adjective "confident" pairs naturally with the preposition "about" (or "in"), never "on".',
    example: 'She is confident about her technical skills.'
  },
  {
    id: 'q-4',
    type: 'synonym',
    question: 'What is a strong synonym for "Resilient"?',
    options: [
      'Fragile',
      'Adaptable & persistent',
      'Careless',
      'Hesitant'
    ],
    correctAnswer: 1,
    explanation: '"Resilient" describes the ability to bounce back quickly from setbacks and adapt to pressure.',
    example: 'Resilient engineers stay calm during production outages.'
  },
  {
    id: 'q-5',
    type: 'hindi-english',
    question: 'Translate to English: "संक्षेप में कहें तो, अभ्यास ही सफलता की कुंजी है।"',
    options: [
      'In a nutshell, practice is the key to success.',
      'In the nut, practice is very nice.',
      'For summary, practice is important.',
      'By the way, practice makes good.'
    ],
    correctAnswer: 0,
    explanation: '"In a nutshell" is the natural English idiom meaning "संक्षेप में" (in brief summary).',
    example: 'In a nutshell, we met all quarterly goals.'
  },
  {
    id: 'q-6',
    type: 'confusing-pair',
    question: 'Choose the correct word: "The sudden rain will _____ our travel plans."',
    options: [
      'affect',
      'effect',
      'effective',
      'affecting'
    ],
    correctAnswer: 0,
    explanation: '"Affect" is the verb meaning "to influence or change". "Effect" is the noun (result).',
    example: 'The rain will affect traffic on the highway.'
  },
  {
    id: 'q-7',
    type: 'situational',
    question: 'You want to politely ask a professor for more explanation during office hours. Which is best?',
    options: [
      'Tell me more now.',
      'Could you please elaborate on that specific chapter concept?',
      'You did not explain well, talk again.',
      'I want you to repeat everything.'
    ],
    correctAnswer: 1,
    explanation: 'Using "Could you please elaborate on..." is courteous, diplomatic, and academically polished.',
    example: 'Could you please elaborate on the methodology section?'
  },
  {
    id: 'q-8',
    type: 'antonym',
    question: 'What is the opposite (antonym) of "Coherent"?',
    options: [
      'Lucid',
      'Logical',
      'Disjointed / Incoherent',
      'Articulate'
    ],
    correctAnswer: 2,
    explanation: 'While "coherent" means structured and easy to follow, "disjointed" means fragmented and confusing.',
    example: 'A disjointed presentation confuses listeners.'
  }
];
