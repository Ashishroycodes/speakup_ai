/**
 * SpeakUp Vocabulary Learning Hub Data
 * 
 * Scalable data architecture powering the 12 core communication categories:
 * 1. 🗣️ Basic Communication
 * 2. 💬 Daily Useful Words
 * 3. 🔥 Gen Z & Modern Slang (with Casual/Informal usage guidance)
 * 4. 📱 Social Media & Internet
 * 5. 💼 Professional English
 * 6. 🎯 Interview Vocabulary
 * 7. 🗣️ English Speaking
 * 8. 🎓 College & Student Life
 * 9. 🚀 Advanced Vocabulary
 * 10. 📚 Idioms & Expressions
 * 11. 🔤 Phrasal Verbs
 * 12. ⚡ Confusing Words (with comparison pairs & memory tricks)
 * 
 * Each entry supports:
 * id, word, pronunciation, meaning, hindiMeaning, partOfSpeech,
 * example, conversationExample, synonyms, antonyms, collocations,
 * category, categoryName, level (Beginner | Intermediate | Advanced),
 * usageNote, speakingPrompt.
 */

export const HUB_CATEGORIES = [
  {
    id: 'basic-communication',
    name: 'Basic Communication',
    icon: '🗣️',
    description: 'Useful everyday English words and phrases for beginners.',
    tag: 'Everyday'
  },
  {
    id: 'daily-useful',
    name: 'Daily Useful Words',
    icon: '💬',
    description: 'Common words people actually use in everyday conversations.',
    tag: 'Conversation'
  },
  {
    id: 'gen-z-slang',
    name: 'Gen Z & Modern Slang',
    icon: '🔥',
    description: 'Modern Gen Z words, slang, internet expressions and casual phrases.',
    tag: 'Casual / Informal',
    isSlang: true
  },
  {
    id: 'social-media',
    name: 'Social Media & Internet',
    icon: '📱',
    description: 'Modern social-media vocabulary and online expressions.',
    tag: 'Digital Era'
  },
  {
    id: 'professional',
    name: 'Professional English',
    icon: '💼',
    description: 'Words and phrases commonly used in workplaces and professional communication.',
    tag: 'Workplace'
  },
  {
    id: 'interview',
    name: 'Interview Vocabulary',
    icon: '🎯',
    description: 'Vocabulary for HR interviews, technical rounds, strengths, and career talks.',
    tag: 'Career'
  },
  {
    id: 'speaking',
    name: 'English Speaking',
    icon: '🎙️',
    description: 'Words and phrases specifically useful for natural spoken English.',
    tag: 'Spoken Fluency'
  },
  {
    id: 'college-student',
    name: 'College & Student Life',
    icon: '🎓',
    description: 'Vocabulary for presentations, assignments, teamwork, exams and campus life.',
    tag: 'Campus'
  },
  {
    id: 'advanced',
    name: 'Advanced Vocabulary',
    icon: '🚀',
    description: 'High-level words that help you sound more precise and articulate.',
    tag: 'Precision'
  },
  {
    id: 'idioms',
    name: 'Idioms & Expressions',
    icon: '📚',
    description: 'Common English idioms, expressions and natural conversational phrases.',
    tag: 'Idioms'
  },
  {
    id: 'phrasal-verbs',
    name: 'Phrasal Verbs',
    icon: '🔤',
    description: 'Useful phrasal verbs for everyday and professional communication.',
    tag: 'Phrasal Verbs'
  },
  {
    id: 'confusing-words',
    name: 'Confusing Words',
    icon: '⚡',
    description: 'Words that learners commonly confuse and how to use them accurately.',
    tag: 'Clarity Guide',
    isConfusing: true
  }
];

export const HUB_VOCABULARY = [
  // =========================================================================
  // 1. 🗣️ BASIC COMMUNICATION
  // =========================================================================
  {
    id: 'v-greet',
    word: 'Greet',
    pronunciation: '/ɡriːt/',
    meaning: 'To welcome someone with friendly words or polite gestures upon meeting.',
    hindiMeaning: 'अभिवादन करना / स्वागत करना',
    partOfSpeech: 'verb',
    level: 'Beginner',
    category: 'basic-communication',
    categoryName: 'Basic Communication',
    example: 'Always smile and greet the panel members when entering an interview room.',
    conversationExample: {
      speakerA: 'How do you usually begin a meeting with a new colleague?',
      speakerB: 'I greet them warmly with a smile and ask how their day is going.'
    },
    synonyms: ['Welcome', 'Salute', 'Acknowledge', 'Address'],
    antonyms: ['Ignore', 'Overlook', 'Disregard'],
    collocations: ['greet warmly', 'greet someone with a smile', 'greet clients'],
    speakingPrompt: 'Use GREET in a sentence describing how you welcome friends to your home.'
  },
  {
    id: 'v-apologize',
    word: 'Apologize',
    pronunciation: '/əˈpɒl.ə.dʒaɪz/',
    meaning: 'To express regret for something that caused trouble, delay, or misunderstanding.',
    hindiMeaning: 'माफी मांगना / खेद प्रकट करना',
    partOfSpeech: 'verb',
    level: 'Beginner',
    category: 'basic-communication',
    categoryName: 'Basic Communication',
    example: 'I apologize for joining the group discussion a few minutes late.',
    conversationExample: {
      speakerA: 'I apologize for interrupting your sentence.',
      speakerB: 'No problem at all! Please go ahead and share your thought.'
    },
    synonyms: ['Say sorry', 'Regret', 'Ask forgiveness', 'Excuse oneself'],
    antonyms: ['Defend', 'Justify', 'Blame'],
    collocations: ['sincerely apologize', 'apologize for the delay', 'apologize in advance'],
    speakingPrompt: 'Use APOLOGIZE in a sentence to politely address a minor mistake.'
  },
  {
    id: 'v-clarify',
    word: 'Clarify',
    pronunciation: '/ˈklær.ɪ.faɪ/',
    meaning: 'To make a statement or idea easier to understand by providing more details.',
    hindiMeaning: 'स्पष्ट करना / साफ समझाना',
    partOfSpeech: 'verb',
    level: 'Beginner',
    category: 'basic-communication',
    categoryName: 'Basic Communication',
    example: 'Could you please clarify what you mean by the project deadline?',
    conversationExample: {
      speakerA: 'I did not quite catch the third requirement.',
      speakerB: 'Let me clarify that point with a simple practical example.'
    },
    synonyms: ['Explain', 'Elucidate', 'Simplify', 'Clear up'],
    antonyms: ['Confuse', 'Complicate', 'Obscure'],
    collocations: ['clarify a doubt', 'seek clarification', 'help clarify'],
    speakingPrompt: 'Use CLARIFY in a sentence to politely ask for more information.'
  },
  {
    id: 'v-appreciate',
    word: 'Appreciate',
    pronunciation: '/əˈpriː.ʃi.eɪt/',
    meaning: 'To recognize the full worth or good qualities of someone or something.',
    hindiMeaning: 'सराहना करना / कद्र करना',
    partOfSpeech: 'verb',
    level: 'Beginner',
    category: 'basic-communication',
    categoryName: 'Basic Communication',
    example: 'I truly appreciate your timely guidance on this speech.',
    conversationExample: {
      speakerA: 'Thank you for reviewing my slide deck so quickly!',
      speakerB: 'You are welcome! I really appreciate the effort you put into the visuals.'
    },
    synonyms: ['Value', 'Acknowledge', 'Praise', 'Cherish'],
    antonyms: ['Disparage', 'Undervalue', 'Ignore'],
    collocations: ['deeply appreciate', 'appreciate your help', 'appreciate feedback'],
    speakingPrompt: 'Use APPRECIATE in a sentence expressing gratitude to a mentor or peer.'
  },
  {
    id: 'v-hesitant-basic',
    word: 'Hesitant',
    pronunciation: '/ˈhez.ɪ.tənt/',
    meaning: 'Slow in acting or speaking because of doubt, nervousness, or uncertainty.',
    hindiMeaning: 'संकोची / झिझकने वाला',
    partOfSpeech: 'adjective',
    level: 'Intermediate',
    category: 'basic-communication',
    categoryName: 'Basic Communication',
    example: 'I was hesitant to speak up at first, but everyone was very welcoming.',
    conversationExample: {
      speakerA: 'Why were you hesitant during the group introduction?',
      speakerB: 'I was worried about my accent, but I realized communication is about clarity.'
    },
    synonyms: ['Uncertain', 'Reluctant', 'Tentative', 'Timid'],
    antonyms: ['Decisive', 'Confident', 'Eager'],
    collocations: ['feel hesitant', 'hesitant to speak', 'hesitant about'],
    speakingPrompt: 'Describe a moment you felt HESITANT and how you took action anyway.'
  },
  {
    id: 'v-encourage',
    word: 'Encourage',
    pronunciation: '/ɪnˈkʌr.ɪdʒ/',
    meaning: 'To give support, confidence, or hope to someone to speak up or try.',
    hindiMeaning: 'प्रोत्साहित करना / बढ़ावा देना',
    partOfSpeech: 'verb',
    level: 'Intermediate',
    category: 'basic-communication',
    categoryName: 'Basic Communication',
    example: 'Our team mentor encouraged everyone to ask at least one question.',
    conversationExample: {
      speakerA: 'I am not sure if my spoken English is good enough for the presentation.',
      speakerB: 'I encourage you to participate; practice is how we all improve!'
    },
    synonyms: ['Support', 'Motivate', 'Inspire', 'Cheer on'],
    antonyms: ['Discourage', 'Deter', 'Dishearten'],
    collocations: ['warmly encourage', 'encourage active participation', 'encourage students'],
    speakingPrompt: 'Use ENCOURAGE to describe how you would motivate a nervous peer.'
  },
  {
    id: 'v-diplomatic',
    word: 'Diplomatic',
    pronunciation: '/ˌdɪp.ləˈmæt.ɪk/',
    meaning: 'Skillful in handling sensitive situations without causing offense.',
    hindiMeaning: 'कुशल / बिना किसी को ठेस पहुंचाए बात करने वाला',
    partOfSpeech: 'adjective',
    level: 'Advanced',
    category: 'basic-communication',
    categoryName: 'Basic Communication',
    example: 'She gave a diplomatic answer when asked to compare the two rival proposals.',
    conversationExample: {
      speakerA: 'How did you resolve the disagreement between the two project leads?',
      speakerB: 'I remained diplomatic, highlighted common ground, and framed it as a shared win.'
    },
    synonyms: ['Tactful', 'Polite', 'Discreet', 'Prudent'],
    antonyms: ['Tactless', 'Blunt', 'Rude', 'Aggressive'],
    collocations: ['diplomatic response', 'remain diplomatic', 'diplomatic manner'],
    speakingPrompt: 'Use DIPLOMATIC in a sentence about handling difficult feedback.'
  },
  {
    id: 'v-empathetic',
    word: 'Empathetic',
    pronunciation: '/ˌem.pəˈθet.ɪk/',
    meaning: 'Showing an ability to truly understand and share another person’s feelings.',
    hindiMeaning: 'सहानुभूतिपूर्ण / दूसरों के भाव को समझने वाला',
    partOfSpeech: 'adjective',
    level: 'Advanced',
    category: 'basic-communication',
    categoryName: 'Basic Communication',
    example: 'An empathetic listener pays close attention to emotions, not just words.',
    conversationExample: {
      speakerA: 'What makes a great communicator in team settings?',
      speakerB: 'Being empathetic helps you validate concerns and connect genuinely with others.'
    },
    synonyms: ['Compassionate', 'Understanding', 'Sensitive', 'Caring'],
    antonyms: ['Callous', 'Indifferent', 'Unsympathetic'],
    collocations: ['empathetic approach', 'empathetic listener', 'deeply empathetic'],
    speakingPrompt: 'Use EMPATHETIC in a sentence about listening to someone in distress.'
  },

  // =========================================================================
  // 2. 💬 DAILY USEFUL WORDS
  // =========================================================================
  {
    id: 'v-convenient',
    word: 'Convenient',
    pronunciation: '/kənˈviː.ni.ənt/',
    meaning: 'Fitting in well with a person’s schedule, comfort, or plans.',
    hindiMeaning: 'सुविधाजनक / अनुकूल',
    partOfSpeech: 'adjective',
    level: 'Beginner',
    category: 'daily-useful',
    categoryName: 'Daily Useful Words',
    example: 'Would Friday afternoon be convenient for our study session?',
    conversationExample: {
      speakerA: 'What time should we meet tomorrow for practice?',
      speakerB: '5:00 PM is very convenient for me since my lectures end at four.'
    },
    synonyms: ['Handy', 'Suitable', 'Appropriate', 'Accessible'],
    antonyms: ['Inconvenient', 'Awkward', 'Troublesome'],
    collocations: ['convenient time', 'highly convenient', 'at your earliest convenience'],
    speakingPrompt: 'Use CONVENIENT in a sentence suggesting a meetup time.'
  },
  {
    id: 'v-in-a-nutshell-daily',
    word: 'In a nutshell',
    pronunciation: '/ɪn ə ˈnʌt.ʃel/',
    meaning: 'In a very brief and concise summary.',
    hindiMeaning: 'संक्षेप में / कम शब्दों में',
    partOfSpeech: 'phrase',
    level: 'Beginner',
    category: 'daily-useful',
    categoryName: 'Daily Useful Words',
    example: 'In a nutshell, daily practice is what transforms shy speakers into confident ones.',
    conversationExample: {
      speakerA: 'Can you summarize what the workshop covered?',
      speakerB: 'In a nutshell, active listening and pacing make the biggest impact.'
    },
    synonyms: ['In brief', 'In short', 'To sum up', 'Succinctly'],
    antonyms: ['In detail', 'At length'],
    collocations: ['put it in a nutshell', 'in a nutshell, we believe...'],
    speakingPrompt: 'Use IN A NUTSHELL to summarize your dream career in one sentence.'
  },
  {
    id: 'v-spontaneous-daily',
    word: 'Spontaneous',
    pronunciation: '/spɒnˈteɪ.ni.əs/',
    meaning: 'Done or said naturally without being planned ahead of time.',
    hindiMeaning: 'स्वाभाविक / बिना पूर्व तैयारी के',
    partOfSpeech: 'adjective',
    level: 'Intermediate',
    category: 'daily-useful',
    categoryName: 'Daily Useful Words',
    example: 'His spontaneous jokes kept the whole room smiling throughout the break.',
    conversationExample: {
      speakerA: 'Did you prepare that speech beforehand?',
      speakerB: 'No, it was completely spontaneous based on the audience reaction.'
    },
    synonyms: ['Impromptu', 'Unrehearsed', 'Instinctive', 'Natural'],
    antonyms: ['Premeditated', 'Planned', 'Calculated'],
    collocations: ['spontaneous conversation', 'spontaneous decision', 'be spontaneous'],
    speakingPrompt: 'Use SPONTANEOUS to describe an impromptu decision you made.'
  },
  {
    id: 'v-reluctant',
    word: 'Reluctant',
    pronunciation: '/rɪˈlʌk.tənt/',
    meaning: 'Unwilling and hesitant to do something.',
    hindiMeaning: 'अनिच्छुक / झिझकता हुआ',
    partOfSpeech: 'adjective',
    level: 'Intermediate',
    category: 'daily-useful',
    categoryName: 'Daily Useful Words',
    example: 'He was reluctant to share his draft until he polished the conclusion.',
    conversationExample: {
      speakerA: 'Why was Aryan reluctant to take the stage?',
      speakerB: 'He felt unprepared, but once he began speaking he did very well.'
    },
    synonyms: ['Hesitant', 'Disinclined', 'Unwilling', 'Averse'],
    antonyms: ['Willing', 'Eager', 'Enthusiastic'],
    collocations: ['reluctant to agree', 'seem reluctant', 'reluctant participant'],
    speakingPrompt: 'Use RELUCTANT in a sentence describing a task you hesitated to start.'
  },
  {
    id: 'v-overwhelmed',
    word: 'Overwhelmed',
    pronunciation: '/ˌoʊ.vərˈwelmd/',
    meaning: 'Feeling completely submerged by too many tasks, emotions, or responsibilities.',
    hindiMeaning: 'अभिभूत / अत्यधिक दबाव महसूस करना',
    partOfSpeech: 'adjective',
    level: 'Intermediate',
    category: 'daily-useful',
    categoryName: 'Daily Useful Words',
    example: 'When exam week arrived, I felt overwhelmed until I built a structured schedule.',
    conversationExample: {
      speakerA: 'You seem quiet today. Is everything okay?',
      speakerB: 'I have three assignment deadlines this week and I feel a bit overwhelmed.'
    },
    synonyms: ['Swamped', 'Overburdened', 'Stressed', 'Inundated'],
    antonyms: ['Calm', 'Relaxed', 'Composed'],
    collocations: ['feel overwhelmed', 'overwhelmed with tasks', 'easily overwhelmed'],
    speakingPrompt: 'Use OVERWHELMED in a sentence and explain how you de-stress.'
  },
  {
    id: 'v-inevitable-daily',
    word: 'Inevitable',
    pronunciation: '/ɪnˈev.ɪ.tə.bəl/',
    meaning: 'Certain to happen and completely impossible to prevent.',
    hindiMeaning: 'अपरिहार्य / जिसे टाला न जा सके',
    partOfSpeech: 'adjective',
    level: 'Advanced',
    category: 'daily-useful',
    categoryName: 'Daily Useful Words',
    example: 'Making mistakes while learning a new language is natural and inevitable.',
    conversationExample: {
      speakerA: 'Are you worried about stumbling during your mock interview?',
      speakerB: 'A few stumbles are inevitable, but staying composed is what matters.'
    },
    synonyms: ['Unavoidable', 'Inescapable', 'Bound to happen', 'Sure'],
    antonyms: ['Avoidable', 'Preventable', 'Unlikely'],
    collocations: ['inevitable outcome', 'it is inevitable that', 'inevitable conclusion'],
    speakingPrompt: 'Use INEVITABLE in a sentence about learning from life challenges.'
  },
  {
    id: 'v-serendipity',
    word: 'Serendipity',
    pronunciation: '/ˌser.ənˈdɪp.ə.ti/',
    meaning: 'The occurrence of finding valuable or pleasant things by sheer good chance.',
    hindiMeaning: 'शुभ संयोग / सुखद अप्रत्याशित घटना',
    partOfSpeech: 'noun',
    level: 'Advanced',
    category: 'daily-useful',
    categoryName: 'Daily Useful Words',
    example: 'Meeting my current project collaborator at the coffee shop was pure serendipity.',
    conversationExample: {
      speakerA: 'How did you discover this speaking practice community?',
      speakerB: 'It was serendipity! A classmate was practicing in the library and invited me.'
    },
    synonyms: ['Happy chance', 'Fortunate coincidence', 'Good fortune', 'Providence'],
    antonyms: ['Bad luck', 'Misfortune'],
    collocations: ['pure serendipity', 'moment of serendipity', 'stroke of serendipity'],
    speakingPrompt: 'Use SERENDIPITY to describe a wonderful coincidence in your life.'
  },

  // =========================================================================
  // 3. 🔥 GEN Z & MODERN SLANG (Casual / Informal with usage notes)
  // =========================================================================
  {
    id: 'v-lowkey',
    word: 'Lowkey',
    pronunciation: '/ˈloʊ.kiː/',
    meaning: 'Secretly, subtly, or to a moderate degree without drawing public attention.',
    hindiMeaning: 'थोड़ा-सा / चुपके से / बिना दिखावे के',
    partOfSpeech: 'adverb / slang',
    level: 'Beginner',
    category: 'gen-z-slang',
    categoryName: 'Gen Z & Modern Slang',
    isSlang: true,
    usageNote: 'Casual / Informal: Best used with close peers, friends, and casual online chat. Do NOT use in job interviews, formal client emails, or academic papers.',
    example: 'I am lowkey nervous about speaking on camera today.',
    conversationExample: {
      speakerA: 'Are you ready for the open mic tonight?',
      speakerB: 'I am lowkey terrified, but I really want to challenge myself!'
    },
    synonyms: ['Subtly', 'Quietly', 'Secretly', 'Somewhat'],
    antonyms: ['Highkey', 'Openly', 'Blatantly'],
    collocations: ['lowkey nervous', 'lowkey want to', 'keep it lowkey'],
    speakingPrompt: 'Use LOWKEY in a casual sentence describing a feeling you have kept quiet.'
  },
  {
    id: 'v-highkey',
    word: 'Highkey',
    pronunciation: '/ˈhaɪ.kiː/',
    meaning: 'Openly, strongly, or without trying to hide your emotion or opinion.',
    hindiMeaning: 'खुलकर / स्पष्ट रूप से / बिना किसी झिझक के',
    partOfSpeech: 'adverb / slang',
    level: 'Beginner',
    category: 'gen-z-slang',
    categoryName: 'Gen Z & Modern Slang',
    isSlang: true,
    usageNote: 'Casual / Informal: Use with peers and social groups. Avoid in formal business or academic contexts.',
    example: 'I highkey love how easy it is to practice spoken English here.',
    conversationExample: {
      speakerA: 'Do you actually like the group discussion format?',
      speakerB: 'I highkey prefer it because everyone gets equal speaking time.'
    },
    synonyms: ['Openly', 'Distinctly', 'Strongly', 'Blatantly'],
    antonyms: ['Lowkey', 'Secretly', 'Quietly'],
    collocations: ['highkey excited', 'highkey love', 'highkey agree'],
    speakingPrompt: 'Use HIGHKEY in a casual conversation expressing an enthusiastic preference.'
  },
  {
    id: 'v-vibe',
    word: 'Vibe',
    pronunciation: '/vaɪb/',
    meaning: 'The general mood, atmosphere, or feeling given off by a person, place, or song.',
    hindiMeaning: 'माहौल / तरकीब / सकारात्मक ऊर्जा',
    partOfSpeech: 'noun / verb / slang',
    level: 'Beginner',
    category: 'gen-z-slang',
    categoryName: 'Gen Z & Modern Slang',
    isSlang: true,
    usageNote: 'Casual / Informal: Extremely common in conversational English and social culture. In formal settings, replace with "atmosphere" or "ambiance".',
    example: 'The study lounge has such a calm and productive vibe.',
    conversationExample: {
      speakerA: 'How did you like the campus startup event?',
      speakerB: 'The vibe was incredible! Everyone was enthusiastic and encouraging.'
    },
    synonyms: ['Atmosphere', 'Energy', 'Aura', 'Mood'],
    antonyms: ['Bad energy', 'Dullness'],
    collocations: ['good vibes', 'match the vibe', 'vibe check'],
    speakingPrompt: 'Use VIBE to describe the atmosphere of your favorite coffee shop or study room.'
  },
  {
    id: 'v-sus',
    word: 'Sus',
    pronunciation: '/sʌs/',
    meaning: 'Short for suspicious, questionable, or untrustworthy.',
    hindiMeaning: 'संदेहास्पद / जिस पर शक हो',
    partOfSpeech: 'adjective / slang',
    level: 'Beginner',
    category: 'gen-z-slang',
    categoryName: 'Gen Z & Modern Slang',
    isSlang: true,
    usageNote: 'Casual / Informal: Popularized by gaming and social memes. In formal settings, use "suspicious", "dubious", or "questionable".',
    example: 'That email offering an instant job without an interview looks very sus.',
    conversationExample: {
      speakerA: 'Did you click on that mysterious link in the group chat?',
      speakerB: 'No way, that sender looks super sus. I reported it.'
    },
    synonyms: ['Suspicious', 'Shady', 'Dubious', 'Fishy'],
    antonyms: ['Trustworthy', 'Legit', 'Authentic'],
    collocations: ['acting sus', 'sounds sus', 'kind of sus'],
    speakingPrompt: 'Use SUS in a casual scenario warning a friend about an online scam.'
  },
  {
    id: 'v-cringe',
    word: 'Cringe',
    pronunciation: '/krɪndʒ/',
    meaning: 'Feeling deeply embarrassed, awkward, or uncomfortable due to someone’s behavior.',
    hindiMeaning: 'शर्मिंदगी महसूस होना / असहज कर देने वाला',
    partOfSpeech: 'adjective / verb / slang',
    level: 'Beginner',
    category: 'gen-z-slang',
    categoryName: 'Gen Z & Modern Slang',
    isSlang: true,
    usageNote: 'Casual / Informal: Common among young adults and social media comments. In formal writing, use "awkward", "embarrassing", or "uncomfortable".',
    example: 'Looking at my first recorded speech video makes me cringe, but it shows my progress!',
    conversationExample: {
      speakerA: 'Are you going to re-watch your recorded speech?',
      speakerB: 'It might feel a little cringe at first, but it is the best way to catch filler words.'
    },
    synonyms: ['Awkward', 'Embarrassing', 'Cringeworthy', 'Uncomfortable'],
    antonyms: ['Cool', 'Smooth', 'Graceful'],
    collocations: ['pure cringe', 'make someone cringe', 'cringe moment'],
    speakingPrompt: 'Use CRINGE in a sentence reflecting on an awkward public speaking moment.'
  },
  {
    id: 'v-flex',
    word: 'Flex',
    pronunciation: '/fleks/',
    meaning: 'To show off or boast about accomplishments, wealth, or abilities.',
    hindiMeaning: 'दिखावा करना / शेखी बघारना',
    partOfSpeech: 'verb / noun / slang',
    level: 'Intermediate',
    category: 'gen-z-slang',
    categoryName: 'Gen Z & Modern Slang',
    isSlang: true,
    usageNote: 'Casual / Informal: Used humorously or critically among friends. In workplace settings, use "demonstrate capabilities" or "showcase achievements".',
    example: 'Scoring 95% on the IELTS speaking exam on the first attempt is a massive flex.',
    conversationExample: {
      speakerA: 'Did Rahul really build an entire AI chatbot over the weekend?',
      speakerB: 'Yeah, and he demoed it today—honestly, that was an impressive flex.'
    },
    synonyms: ['Show off', 'Boast', 'Flaunt', 'Brag'],
    antonyms: ['Understate', 'Downplay', 'Stay humble'],
    collocations: ['weird flex', 'subtle flex', 'flex your skills'],
    speakingPrompt: 'Use FLEX in a humorous sentence describing a friend who showed off.'
  },
  {
    id: 'v-ghost',
    word: 'Ghost',
    pronunciation: '/ɡoʊst/',
    meaning: 'To suddenly cut off all communication with someone without any explanation.',
    hindiMeaning: 'अचानक बातचीत बंद कर देना / गायब हो जाना',
    partOfSpeech: 'verb / slang',
    level: 'Intermediate',
    category: 'gen-z-slang',
    categoryName: 'Gen Z & Modern Slang',
    isSlang: true,
    usageNote: 'Casual / Informal: Originally from modern dating, now also used for recruiters or project partners who go silent. In professional writing, use "cease communication".',
    example: 'The recruiter promised to send feedback by Monday, but then completely ghosted me.',
    conversationExample: {
      speakerA: 'Did the freelance client ever send the contract?',
      speakerB: 'Nope, they completely ghosted after our initial discovery call.'
    },
    synonyms: ['Disappear', 'Cut contact', 'Drop communication', 'Go silent'],
    antonyms: ['Follow up', 'Stay in touch', 'Reply'],
    collocations: ['get ghosted', 'ghost someone', 'totally ghosted'],
    speakingPrompt: 'Use GHOST in a sentence about waiting for a reply that never arrived.'
  },
  {
    id: 'v-lit',
    word: 'Lit',
    pronunciation: '/lɪt/',
    meaning: 'Extremely exciting, enjoyable, energetic, or impressive.',
    hindiMeaning: 'जबरदस्त / ऊर्जा से भरपूर / शानदार',
    partOfSpeech: 'adjective / slang',
    level: 'Intermediate',
    category: 'gen-z-slang',
    categoryName: 'Gen Z & Modern Slang',
    isSlang: true,
    usageNote: 'Casual / Informal: Common in casual conversation and social event reviews. Do not use in formal reports.',
    example: 'The college fest concert last night was absolutely lit!',
    conversationExample: {
      speakerA: 'How was the hackathon after-party?',
      speakerB: 'It was so lit! The music and team celebrations were unforgettable.'
    },
    synonyms: ['Exciting', 'Thrilling', 'Amazing', 'Hyped'],
    antonyms: ['Boring', 'Dull', 'Lifeless'],
    collocations: ['totally lit', 'get lit', 'lit atmosphere'],
    speakingPrompt: 'Use LIT in a casual conversation describing an unforgettable festival.'
  },
  {
    id: 'v-w-slang',
    word: 'W (Win)',
    pronunciation: '/dʌbəl.juː/',
    meaning: 'Short for "Win"; an achievement, great outcome, or success.',
    hindiMeaning: 'जीत / सफलता / बड़ी कामयाबी',
    partOfSpeech: 'noun / slang',
    level: 'Intermediate',
    category: 'gen-z-slang',
    categoryName: 'Gen Z & Modern Slang',
    isSlang: true,
    usageNote: 'Casual / Informal: Often typed as "W" or "Huge W" in chat and comments. In professional writing, use "major victory" or "key milestone".',
    example: 'Landing the Google summer internship is a massive W for our college batch.',
    conversationExample: {
      speakerA: 'My team just won the inter-college debate tournament!',
      speakerB: 'Let’s go! That is a huge W, congratulations!'
    },
    synonyms: ['Victory', 'Success', 'Triumph', 'Achievement'],
    antonyms: ['L (Loss)', 'Failure', 'Defeat'],
    collocations: ['huge W', 'take the W', 'common W'],
    speakingPrompt: 'Use W (WIN) in a congratulatory message to a friend who passed an exam.'
  },
  {
    id: 'v-l-slang',
    word: 'L (Loss)',
    pronunciation: '/el/',
    meaning: 'Short for "Loss"; a failure, setback, or embarrassing mistake.',
    hindiMeaning: 'हार / झटका / नुकसान',
    partOfSpeech: 'noun / slang',
    level: 'Intermediate',
    category: 'gen-z-slang',
    categoryName: 'Gen Z & Modern Slang',
    isSlang: true,
    usageNote: 'Casual / Informal: Often paired with "Take the L" (accept defeat). In professional contexts, replace with "setback" or "unfavorable outcome".',
    example: 'Forgetting my presentation notes was an L, but I recovered by speaking from memory.',
    conversationExample: {
      speakerA: 'Did you end up getting tickets to the tech summit?',
      speakerB: 'No, they sold out in two minutes. Big L for our group.'
    },
    synonyms: ['Setback', 'Defeat', 'Misfortune', 'Loss'],
    antonyms: ['W (Win)', 'Victory', 'Success'],
    collocations: ['take the L', 'big L', 'massive L'],
    speakingPrompt: 'Use L in a sentence about turning a minor failure into a learning lesson.'
  },
  {
    id: 'v-no-cap',
    word: 'No cap',
    pronunciation: '/noʊ kæp/',
    meaning: 'Meaning "no lie", "truthfully", or "I am completely serious".',
    hindiMeaning: 'सच में / बिना किसी झूठ के / बिल्कुल सच',
    partOfSpeech: 'phrase / slang',
    level: 'Advanced',
    category: 'gen-z-slang',
    categoryName: 'Gen Z & Modern Slang',
    isSlang: true,
    usageNote: 'Casual / Informal: "Cap" means lie; "no cap" emphasizes sincerity among Gen Z speakers. Never use in professional presentations.',
    example: 'This AI speech tool helped me overcome my stammer in two weeks, no cap.',
    conversationExample: {
      speakerA: 'Is Professor Sharma’s exam really that difficult?',
      speakerB: 'It was the hardest paper I have ever taken in my life, no cap.'
    },
    synonyms: ['Truthfully', 'For real', 'Honestly', 'No lie'],
    antonyms: ['Capping', 'Lying', 'Exaggerating'],
    collocations: ['no cap bro', 'for real no cap'],
    speakingPrompt: 'Use NO CAP in a sentence sharing a surprising yet completely true fact.'
  },
  {
    id: 'v-bet',
    word: 'Bet',
    pronunciation: '/bet/',
    meaning: 'An affirmation expressing enthusiastic agreement, confirmation, or "You’re on!"',
    hindiMeaning: 'पक्का / मंजूर है / बिल्कुल ठीक',
    partOfSpeech: 'interjection / slang',
    level: 'Advanced',
    category: 'gen-z-slang',
    categoryName: 'Gen Z & Modern Slang',
    isSlang: true,
    usageNote: 'Casual / Informal: Used like "Sounds good" or "Deal" among peers. Use "Certainly" or "Agreed" in business communication.',
    example: 'Speaker A: "Let’s do a 15-minute mock interview at 6 PM." Speaker B: "Bet!"',
    conversationExample: {
      speakerA: 'Can you help me practice the technical HR questions tomorrow?',
      speakerB: 'Bet! I will prepare five tough scenario questions for you.'
    },
    synonyms: ['Deal', 'Agreed', 'Sounds good', 'Definitely'],
    antonyms: ['No way', 'Pass', 'Disagree'],
    collocations: ['say bet', 'aight bet', 'bet then'],
    speakingPrompt: 'Use BET in a casual dialogue accepting a fun challenge from a friend.'
  },
  {
    id: 'v-slay',
    word: 'Slay',
    pronunciation: '/sleɪ/',
    meaning: 'To do something exceptionally well, look amazing, or perform with supreme confidence.',
    hindiMeaning: 'कमाल कर देना / छा जाना',
    partOfSpeech: 'verb / slang',
    level: 'Advanced',
    category: 'gen-z-slang',
    categoryName: 'Gen Z & Modern Slang',
    isSlang: true,
    usageNote: 'Casual / Informal: High praise on social media and amongst friends for outfits, presentations, or achievements. In formal reviews, use "excelled" or "delivered flawlessly".',
    example: 'You completely slayed that college debate competition round!',
    conversationExample: {
      speakerA: 'I was so anxious before the keynote speech.',
      speakerB: 'You couldn’t tell at all; you absolutely slayed the delivery!'
    },
    synonyms: ['Excel', 'Nail it', 'Triumph', 'Dominate'],
    antonyms: ['Flop', 'Fail', 'Mess up'],
    collocations: ['slay the day', 'you slayed', 'slay that presentation'],
    speakingPrompt: 'Use SLAY in an encouraging remark to someone who did an awesome job.'
  },
  {
    id: 'v-goat',
    word: 'GOAT',
    pronunciation: '/ɡoʊt/',
    meaning: 'Acronym for "Greatest Of All Time"; someone who is unmatched in their skill.',
    hindiMeaning: 'सर्वकालिक सर्वश्रेष्ठ / सबसे महान',
    partOfSpeech: 'noun / slang',
    level: 'Advanced',
    category: 'gen-z-slang',
    categoryName: 'Gen Z & Modern Slang',
    isSlang: true,
    usageNote: 'Casual / Informal: Widely used in sports, music, and peer circles. For formal recommendations, write "industry benchmark" or "pioneering leader".',
    example: 'When it comes to storytelling and charisma on stage, Steve Jobs is the GOAT.',
    conversationExample: {
      speakerA: 'Who is your all-time favorite public speaker?',
      speakerB: 'Martin Luther King Jr. is undeniably the GOAT when it comes to inspiring rhetoric.'
    },
    synonyms: ['Legend', 'The finest', 'Unrivaled', 'Master'],
    antonyms: ['Novice', 'Amateur', 'Mediocre'],
    collocations: ['the real GOAT', 'GOAT status', 'undisputed GOAT'],
    speakingPrompt: 'Use GOAT in a sentence praising someone you look up to the most.'
  },

  // =========================================================================
  // 4. 📱 SOCIAL MEDIA & INTERNET
  // =========================================================================
  {
    id: 'v-dm',
    word: 'DM',
    pronunciation: '/diːˈem/',
    meaning: 'Direct Message; a private message sent between users on social platforms.',
    hindiMeaning: 'निजी संदेश (डायरेक्ट मैसेज)',
    partOfSpeech: 'noun / verb',
    level: 'Beginner',
    category: 'social-media',
    categoryName: 'Social Media & Internet',
    example: 'If you want the vocabulary PDF study notes, DM me on Instagram.',
    conversationExample: {
      speakerA: 'Did the speaker share his email address?',
      speakerB: 'He asked us to DM him on LinkedIn to connect directly.'
    },
    synonyms: ['Private message', 'PM', 'Chat message'],
    antonyms: ['Public post', 'Broadcast'],
    collocations: ['slide into DMs', 'send a DM', 'check your DMs'],
    speakingPrompt: 'Use DM in a sentence asking someone for private follow-up details.'
  },
  {
    id: 'v-follow-back',
    word: 'Follow back',
    pronunciation: '/ˈfɒl.oʊ bæk/',
    meaning: 'To follow the account of someone who has recently followed you.',
    hindiMeaning: 'वापस फॉलो करना',
    partOfSpeech: 'phrasal verb',
    level: 'Beginner',
    category: 'social-media',
    categoryName: 'Social Media & Internet',
    example: 'She followed the AI researcher on X and was thrilled when he followed back.',
    conversationExample: {
      speakerA: 'Did the college coding club accept your request?',
      speakerB: 'Yes, and their official page followed me back today.'
    },
    synonyms: ['Reciprocate follow', 'Connect in return'],
    antonyms: ['Unfollow', 'Block'],
    collocations: ['promise to follow back', 'instant follow back'],
    speakingPrompt: 'Use FOLLOW BACK in a sentence about connecting with fellow creators.'
  },
  {
    id: 'v-story',
    word: 'Story',
    pronunciation: '/ˈstɔː.ri/',
    meaning: 'A temporary post, photo, or short video that disappears after 24 hours.',
    hindiMeaning: 'स्टोरी (24 घंटे में हटने वाला पोस्ट)',
    partOfSpeech: 'noun',
    level: 'Beginner',
    category: 'social-media',
    categoryName: 'Social Media & Internet',
    example: 'I posted our team’s hackathon win on my Instagram story.',
    conversationExample: {
      speakerA: 'Did you see the campus event reminder?',
      speakerB: 'Yes, the student council posted it on their story this morning.'
    },
    synonyms: ['Temporary status', 'Ephemeral post'],
    antonyms: ['Permanent post', 'Grid post'],
    collocations: ['post a story', 'reply to story', 'story highlight'],
    speakingPrompt: 'Use STORY in a sentence describing something fun you shared today.'
  },
  {
    id: 'v-mention',
    word: 'Mention',
    pronunciation: '/ˈmen.ʃən/',
    meaning: 'To tag or refer to someone’s username in a social media post or comment.',
    hindiMeaning: 'उल्लेख करना / मेंशन करना',
    partOfSpeech: 'verb / noun',
    level: 'Beginner',
    category: 'social-media',
    categoryName: 'Social Media & Internet',
    example: 'Make sure to mention our campus club in your post so we can repost it.',
    conversationExample: {
      speakerA: 'How did you know the workshop slides were released?',
      speakerB: 'The host mentioned me in the comment section with the link.'
    },
    synonyms: ['Tag', 'Reference', 'Cite', 'Call out'],
    antonyms: ['Omit', 'Ignore'],
    collocations: ['mention someone', 'get a mention', 'mention in comments'],
    speakingPrompt: 'Use MENTION in a sentence describing giving credit to a collaborator online.'
  },
  {
    id: 'v-tag',
    word: 'Tag',
    pronunciation: '/tæɡ/',
    meaning: 'To attach someone’s profile handle or label to an image, video, or discussion.',
    hindiMeaning: 'टैग करना / नाम जोड़ना',
    partOfSpeech: 'verb / noun',
    level: 'Beginner',
    category: 'social-media',
    categoryName: 'Social Media & Internet',
    example: 'Please tag everyone who worked on the presentation slide deck.',
    conversationExample: {
      speakerA: 'Did Priya post the graduation group photo?',
      speakerB: 'Yes, she tagged all thirty classmates in the caption.'
    },
    synonyms: ['Label', 'Link handle', 'Identify'],
    antonyms: ['Untag', 'Remove tag'],
    collocations: ['tag a friend', 'tagged photo', 'tag in the comments'],
    speakingPrompt: 'Use TAG in a sentence about sharing photos from a college trip.'
  },
  {
    id: 'v-fyp',
    word: 'FYP',
    pronunciation: '/ɛf.waɪ.piː/',
    meaning: 'For You Page; the algorithm-driven personalized video feed on platforms like TikTok and Reels.',
    hindiMeaning: 'पर्सनलाइज्ड फीड (फॉर यू पेज)',
    partOfSpeech: 'noun / acronym',
    level: 'Intermediate',
    category: 'social-media',
    categoryName: 'Social Media & Internet',
    example: 'English pronunciation tips suddenly took over my entire FYP this morning.',
    conversationExample: {
      speakerA: 'How did you discover this speech technique?',
      speakerB: 'A linguistics professor’s 60-second video popped up on my FYP.'
    },
    synonyms: ['Explore feed', 'Algorithmic feed', 'Recommended feed'],
    antonyms: ['Following tab'],
    collocations: ['hit the FYP', 'on my FYP', 'FYP algorithm'],
    speakingPrompt: 'Use FYP in a sentence describing an educational video you discovered.'
  },
  {
    id: 'v-pov',
    word: 'POV',
    pronunciation: '/piː.oʊ.viː/',
    meaning: 'Point Of View; a video format displaying a relatable scenario from a first-person perspective.',
    hindiMeaning: 'दृष्टिकोण / पहले व्यक्ति के नजरिए से',
    partOfSpeech: 'noun / acronym',
    level: 'Intermediate',
    category: 'social-media',
    categoryName: 'Social Media & Internet',
    example: 'POV: You practiced your introduction speech 20 times and nailed the interview.',
    conversationExample: {
      speakerA: 'Why are POV videos so viral right now?',
      speakerB: 'Because they make the audience feel like they are experiencing the moment themselves.'
    },
    synonyms: ['Perspective', 'First-person viewpoint', 'Angle'],
    antonyms: ['Third-person view'],
    collocations: ['POV format', 'POV meme', 'write a POV'],
    speakingPrompt: 'Create a spoken one-line POV about overcoming stage fright.'
  },
  {
    id: 'v-viral',
    word: 'Viral',
    pronunciation: '/ˈvaɪ.rəl/',
    meaning: 'Spreading rapidly from person to person across the internet in a brief time.',
    hindiMeaning: 'तेजी से फैलने वाला / वायरल',
    partOfSpeech: 'adjective',
    level: 'Intermediate',
    category: 'social-media',
    categoryName: 'Social Media & Internet',
    example: 'Her short clip explaining confusing English idioms went viral overnight.',
    conversationExample: {
      speakerA: 'Did you expect your communication tips thread to blow up?',
      speakerB: 'Not at all! It went viral with over 50,000 shares within 24 hours.'
    },
    synonyms: ['Rapidly shared', 'Sensational', 'Trending', 'Explosive'],
    antonyms: ['Unnoticed', 'Overlooked', 'Dormant'],
    collocations: ['go viral', 'viral post', 'viral sensation'],
    speakingPrompt: 'Use VIRAL in a sentence describing a piece of useful content that spread fast.'
  },
  {
    id: 'v-trending',
    word: 'Trending',
    pronunciation: '/ˈtrend.ɪŋ/',
    meaning: 'Currently generating massive interest, searches, and discussion across digital channels.',
    hindiMeaning: 'चर्चित / ट्रेंड में चल रहा',
    partOfSpeech: 'adjective',
    level: 'Intermediate',
    category: 'social-media',
    categoryName: 'Social Media & Internet',
    example: 'AI communication coaches are currently trending among college job seekers.',
    conversationExample: {
      speakerA: 'What is trending on tech forums today?',
      speakerB: 'Voice-to-text models that can analyze tone and filler words in real time.'
    },
    synonyms: ['Popular', 'Buzzing', 'Current', 'Hot topic'],
    antonyms: ['Outdated', 'Forgotten', 'Obsolete'],
    collocations: ['trending topic', 'trending now', 'start trending'],
    speakingPrompt: 'Use TRENDING in a sentence discussing a recent technology breakthrough.'
  },
  {
    id: 'v-reel',
    word: 'Reel',
    pronunciation: '/riːl/',
    meaning: 'A fast-paced, vertical short-form video designed for mobile social media.',
    hindiMeaning: 'शॉर्ट वीडियो (रील)',
    partOfSpeech: 'noun',
    level: 'Intermediate',
    category: 'social-media',
    categoryName: 'Social Media & Internet',
    example: 'I watch one short English speaking reel every day during my morning commute.',
    conversationExample: {
      speakerA: 'How do you keep your vocabulary study habit consistent?',
      speakerB: 'I create a 30-second reel explaining one new word each afternoon.'
    },
    synonyms: ['Short video', 'Short-form clip', 'Micro-video'],
    antonyms: ['Full-length video', 'Feature film'],
    collocations: ['record a reel', 'trending reel audio', 'viral reel'],
    speakingPrompt: 'Use REEL in a sentence describing a creator whose content inspires you.'
  },
  {
    id: 'v-creator',
    word: 'Creator',
    pronunciation: '/kriˈeɪ.tər/',
    meaning: 'An individual who crafts, publishes, and curates original digital content for an audience.',
    hindiMeaning: 'कंटेंट निर्माता (क्रिएटर)',
    partOfSpeech: 'noun',
    level: 'Intermediate',
    category: 'social-media',
    categoryName: 'Social Media & Internet',
    example: 'Many digital creators use SpeakUp to practice voice modulation before recording.',
    conversationExample: {
      speakerA: 'Do you consider podcasting a form of content creation?',
      speakerB: 'Definitely; audio creators must have exceptional pacing and vocal clarity.'
    },
    synonyms: ['Content maker', 'Digital artist', 'Influencer', 'Producer'],
    antonyms: ['Consumer', 'Passive viewer'],
    collocations: ['digital creator', 'creator economy', 'content creator'],
    speakingPrompt: 'Use CREATOR in a sentence about the importance of authentic communication.'
  },
  {
    id: 'v-engagement',
    word: 'Engagement',
    pronunciation: '/ɪnˈɡeɪdʒ.mənt/',
    meaning: 'The quantitative level of user interaction (likes, comments, shares, saves) with content.',
    hindiMeaning: 'जुड़ाव / दर्शकों की प्रतिक्रिया',
    partOfSpeech: 'noun',
    level: 'Advanced',
    category: 'social-media',
    categoryName: 'Social Media & Internet',
    example: 'Asking an open-ended question at the end of a video dramatically increases engagement.',
    conversationExample: {
      speakerA: 'Why did your educational thread receive so much engagement?',
      speakerB: 'Because I provided clear action steps and replied to every single question.'
    },
    synonyms: ['Interaction', 'Involvement', 'Response rate', 'Audience participation'],
    antonyms: ['Indifference', 'Inaction', 'Disregard'],
    collocations: ['high engagement', 'engagement rate', 'drive engagement'],
    speakingPrompt: 'Use ENGAGEMENT in a sentence explaining how public speakers hold attention.'
  },
  {
    id: 'v-algorithm',
    word: 'Algorithm',
    pronunciation: '/ˈæl.ɡə.rɪð.əm/',
    meaning: 'A system of computational rules that decides how content is ranked and distributed.',
    hindiMeaning: 'एल्गोरिदम (कंप्यूटेशनल नियम प्रणाली)',
    partOfSpeech: 'noun',
    level: 'Advanced',
    category: 'social-media',
    categoryName: 'Social Media & Internet',
    example: 'The recommendation algorithm promotes educational posts that keep viewers engaged.',
    conversationExample: {
      speakerA: 'Why do different users see different videos on their feed?',
      speakerB: 'The algorithm personalizes each user’s stream according to their past interactions.'
    },
    synonyms: ['Computational logic', 'Ranking system', 'Processing formula'],
    antonyms: ['Random selection'],
    collocations: ['feed algorithm', 'algorithm update', 'beat the algorithm'],
    speakingPrompt: 'Use ALGORITHM in a sentence explaining how modern platforms deliver recommendations.'
  },
  {
    id: 'v-content',
    word: 'Content',
    pronunciation: '/ˈkɒn.tent/',
    meaning: 'The collective media, information, or entertainment created for online audiences.',
    hindiMeaning: 'सामग्री / डिजिटल कंटेंट',
    partOfSpeech: 'noun',
    level: 'Advanced',
    category: 'social-media',
    categoryName: 'Social Media & Internet',
    example: 'Creating educational content requires research, concise scripting, and confident delivery.',
    conversationExample: {
      speakerA: 'What is the key to producing impactful online content?',
      speakerB: 'Focus on solving a specific problem for your audience rather than chasing trends.'
    },
    synonyms: ['Media', 'Material', 'Information', 'Subject matter'],
    antonyms: ['Filler'],
    collocations: ['curate content', 'produce valuable content', 'content strategy'],
    speakingPrompt: 'Use CONTENT in a sentence discussing what kind of educational media you enjoy.'
  },

  // =========================================================================
  // 5. 💼 PROFESSIONAL ENGLISH
  // =========================================================================
  {
    id: 'v-touch-base',
    word: 'Touch base',
    pronunciation: '/tʌtʃ beɪs/',
    meaning: 'To briefly make contact with someone to check progress, align, or exchange updates.',
    hindiMeaning: 'बातचीत करना / संपर्क साधना',
    partOfSpeech: 'idiom / phrase',
    level: 'Beginner',
    category: 'professional',
    categoryName: 'Professional English',
    example: 'Let us touch base tomorrow morning to confirm our presentation lineup.',
    conversationExample: {
      speakerA: 'Do you have time for a full review meeting today?',
      speakerB: 'My calendar is tight, but we can quickly touch base for five minutes.'
    },
    synonyms: ['Check in', 'Connect briefly', 'Follow up', 'Sync up'],
    antonyms: ['Lose touch', 'Disconnect'],
    collocations: ['touch base offline', 'touch base next week', 'quickly touch base'],
    speakingPrompt: 'Use TOUCH BASE in a professional sentence proposing a short check-in.'
  },
  {
    id: 'v-benchmark',
    word: 'Benchmark',
    pronunciation: '/ˈbentʃ.mɑːrk/',
    meaning: 'A recognized standard or reference point against which other things are evaluated.',
    hindiMeaning: 'मानक / कसौटी',
    partOfSpeech: 'noun / verb',
    level: 'Beginner',
    category: 'professional',
    categoryName: 'Professional English',
    example: 'Our speaking fluency score of 80 serves as the benchmark for graduating students.',
    conversationExample: {
      speakerA: 'How do we know if our customer response time is acceptable?',
      speakerB: 'We benchmark our metrics against the top five enterprise SaaS providers.'
    },
    synonyms: ['Standard', 'Yardstick', 'Criterion', 'Baseline'],
    antonyms: ['Guesswork', 'Anomaly'],
    collocations: ['set a benchmark', 'industry benchmark', 'benchmark performance'],
    speakingPrompt: 'Use BENCHMARK in a sentence discussing personal improvement standards.'
  },
  {
    id: 'v-leverage',
    word: 'Leverage',
    pronunciation: '/ˈlev.ər.ɪdʒ/',
    meaning: 'To utilize an existing asset, skill, or relationship to its maximum strategic advantage.',
    hindiMeaning: 'पूरा लाभ उठाना / सही इस्तेमाल करना',
    partOfSpeech: 'verb / noun',
    level: 'Intermediate',
    category: 'professional',
    categoryName: 'Professional English',
    example: 'We can leverage our student network to gather user feedback for the app.',
    conversationExample: {
      speakerA: 'How can small teams compete with large legacy corporations?',
      speakerB: 'By leveraging modern AI tools to iterate and ship features ten times faster.'
    },
    synonyms: ['Harness', 'Capitalize on', 'Utilize', 'Exploit'],
    antonyms: ['Squander', 'Waste', 'Neglect'],
    collocations: ['leverage data', 'leverage technology', 'strategic leverage'],
    speakingPrompt: 'Use LEVERAGE in a sentence describing how you use your strengths in teamwork.'
  },
  {
    id: 'v-deliverable',
    word: 'Deliverable',
    pronunciation: '/dɪˈlɪv.ər.ə.bəl/',
    meaning: 'A tangible or intangible output that must be provided upon completion of a project.',
    hindiMeaning: 'सौंपे जाने योग्य कार्य / निर्धारित परिणाम',
    partOfSpeech: 'noun',
    level: 'Intermediate',
    category: 'professional',
    categoryName: 'Professional English',
    example: 'Our main deliverable for this sprint is the functional speech recognition module.',
    conversationExample: {
      speakerA: 'What deliverables are due before Friday’s client review?',
      speakerB: 'The finalized architecture blueprint and the user testing summary report.'
    },
    synonyms: ['Output', 'Result', 'Handover item', 'Milestone product'],
    antonyms: ['Work in progress'],
    collocations: ['key deliverable', 'project deliverables', 'timely deliverable'],
    speakingPrompt: 'Use DELIVERABLE in a sentence explaining your role in a group project.'
  },
  {
    id: 'v-bandwidth',
    word: 'Bandwidth',
    pronunciation: '/ˈbænd.wɪtθ/',
    meaning: 'The mental capacity, time, or resources an individual or team has to take on extra tasks.',
    hindiMeaning: 'समय या काम करने की क्षमता',
    partOfSpeech: 'noun',
    level: 'Intermediate',
    category: 'professional',
    categoryName: 'Professional English',
    example: 'I would love to help with the design review, but I don’t have the bandwidth this week.',
    conversationExample: {
      speakerA: 'Can your team take ownership of the new documentation portal?',
      speakerB: 'Currently our engineering team lacks the bandwidth due to upcoming release deadlines.'
    },
    synonyms: ['Capacity', 'Availability', 'Workload limits'],
    antonyms: ['Free time', 'Overcapacity'],
    collocations: ['lack the bandwidth', 'sufficient bandwidth', 'bandwidth constraint'],
    speakingPrompt: 'Use BANDWIDTH in a sentence politely turning down additional tasks.'
  },
  {
    id: 'v-synergy',
    word: 'Synergy',
    pronunciation: '/ˈsɪn.ər.dʒi/',
    meaning: 'The interaction of combined entities producing a total effect greater than individual efforts.',
    hindiMeaning: 'सहक्रिया / तालमेल से मिलने वाला बड़ा लाभ',
    partOfSpeech: 'noun',
    level: 'Intermediate',
    category: 'professional',
    categoryName: 'Professional English',
    example: 'The synergy between our research group and the design team produced a brilliant prototype.',
    conversationExample: {
      speakerA: 'Why did the merger between both companies succeed so rapidly?',
      speakerB: 'There was exceptional synergy across their sales and engineering divisions.'
    },
    synonyms: ['Collaboration', 'Harmony', 'Combined effect', 'Teamwork'],
    antonyms: ['Discord', 'Conflict', 'Friction'],
    collocations: ['create synergy', 'team synergy', 'positive synergy'],
    speakingPrompt: 'Use SYNERGY in a sentence explaining the power of complementary team skills.'
  },
  {
    id: 'v-streamline',
    word: 'Streamline',
    pronunciation: '/ˈstriːm.laɪn/',
    meaning: 'To simplify or optimize a process to make it more efficient, organized, and effective.',
    hindiMeaning: 'सरल और व्यवस्थित बनाना',
    partOfSpeech: 'verb',
    level: 'Intermediate',
    category: 'professional',
    categoryName: 'Professional English',
    example: 'We streamlined our onboarding flow, reducing new user friction by forty percent.',
    conversationExample: {
      speakerA: 'How can we speed up our weekly code review cycle?',
      speakerB: 'We can streamline it with automated linters and a standardized template.'
    },
    synonyms: ['Simplify', 'Optimize', 'Accelerate', 'Trim'],
    antonyms: ['Complicate', 'Clutter', 'Delay'],
    collocations: ['streamline processes', 'streamline operations', 'streamline workflow'],
    speakingPrompt: 'Use STREAMLINE in a sentence proposing an efficiency improvement.'
  },
  {
    id: 'v-stakeholder',
    word: 'Stakeholder',
    pronunciation: '/ˈsteɪkˌhoʊl.dər/',
    meaning: 'A person, group, or organization with a vested interest or concern in a project or business.',
    hindiMeaning: 'हितधारक / संबंधित पक्ष',
    partOfSpeech: 'noun',
    level: 'Advanced',
    category: 'professional',
    categoryName: 'Professional English',
    example: 'We held a Town Hall meeting to keep key university stakeholders informed of campus upgrades.',
    conversationExample: {
      speakerA: 'Who needs to approve the updated privacy policy?',
      speakerB: 'All major stakeholders, including legal counsel and student representatives.'
    },
    synonyms: ['Interested party', 'Shareholder', 'Participant', 'Contributor'],
    antonyms: ['Bystander', 'Outsider'],
    collocations: ['internal stakeholders', 'key stakeholder', 'stakeholder management'],
    speakingPrompt: 'Use STAKEHOLDER in a sentence discussing how leaders balance diverse expectations.'
  },
  {
    id: 'v-alignment',
    word: 'Alignment',
    pronunciation: '/əˈlaɪn.mənt/',
    meaning: 'A state of agreement, agreement of purpose, or coordinated positioning among teams.',
    hindiMeaning: 'सहमति / तालमेल / एक ही दिशा में होना',
    partOfSpeech: 'noun',
    level: 'Advanced',
    category: 'professional',
    categoryName: 'Professional English',
    example: 'Before kicking off development, we ensured complete leadership alignment on core priorities.',
    conversationExample: {
      speakerA: 'Why was yesterday’s strategy session so productive?',
      speakerB: 'It brought complete alignment between product vision and customer feedback.'
    },
    synonyms: ['Consensus', 'Accord', 'Harmony', 'Agreement'],
    antonyms: ['Misalignment', 'Disagreement', 'Divergence'],
    collocations: ['strategic alignment', 'achieve alignment', 'ensure alignment'],
    speakingPrompt: 'Use ALIGNMENT in a sentence describing resolving conflicting team goals.'
  },

  // =========================================================================
  // 6. 🎯 INTERVIEW VOCABULARY
  // =========================================================================
  {
    id: 'v-candidate',
    word: 'Candidate',
    pronunciation: '/ˈkæn.dɪ.dət/',
    meaning: 'A person who applies for a job position or is considered for a formal role.',
    hindiMeaning: 'उम्मीदवार / अभ्यर्थी',
    partOfSpeech: 'noun',
    level: 'Beginner',
    category: 'interview',
    categoryName: 'Interview Vocabulary',
    example: 'An ideal candidate demonstrates both strong technical capability and active listening.',
    conversationExample: {
      speakerA: 'What qualities stood out in today’s top interview candidate?',
      speakerB: 'She communicated her project decisions clearly and asked insightful questions.'
    },
    synonyms: ['Applicant', 'Job seeker', 'Contender', 'Prospect'],
    antonyms: ['Recruiter', 'Interviewer'],
    collocations: ['promising candidate', 'ideal candidate', 'candidate pool'],
    speakingPrompt: 'Use CANDIDATE in a sentence describing the mindset of a prepared applicant.'
  },
  {
    id: 'v-accomplish',
    word: 'Accomplish',
    pronunciation: '/əˈkʌm.plɪʃ/',
    meaning: 'To successfully complete or achieve a goal through dedicated effort and skill.',
    hindiMeaning: 'पूरा करना / हासिल करना',
    partOfSpeech: 'verb',
    level: 'Beginner',
    category: 'interview',
    categoryName: 'Interview Vocabulary',
    example: 'In my last role, I accomplished a twenty percent reduction in onboarding friction.',
    conversationExample: {
      speakerA: 'What are you most proud of accomplishing in your academic capstone?',
      speakerB: 'I accomplished building an AI audio analyzer that works completely offline.'
    },
    synonyms: ['Achieve', 'Attain', 'Fulfill', 'Execute'],
    antonyms: ['Fail', 'Abandon', 'Give up'],
    collocations: ['accomplish a milestone', 'accomplish objectives', 'sense of accomplishment'],
    speakingPrompt: 'Use ACCOMPLISH in an interview answer highlighting a key success.'
  },
  {
    id: 'v-diligent',
    word: 'Diligent',
    pronunciation: '/ˈdɪl.ɪ.dʒənt/',
    meaning: 'Showing steady, conscientious, and attentive care in one’s duties.',
    hindiMeaning: 'परिश्रमी / लगनशील / ध्यानपूर्वक काम करने वाला',
    partOfSpeech: 'adjective',
    level: 'Beginner',
    category: 'interview',
    categoryName: 'Interview Vocabulary',
    example: 'My diligent approach to code reviews helped catch edge cases before deployment.',
    conversationExample: {
      speakerA: 'How would your professors describe your work ethic?',
      speakerB: 'They would describe me as diligent and disciplined with deadlines.'
    },
    synonyms: ['Conscientious', 'Hardworking', 'Assiduous', 'Meticulous'],
    antonyms: ['Careless', 'Lazy', 'Negligent'],
    collocations: ['diligent effort', 'diligent worker', 'diligent preparation'],
    speakingPrompt: 'Use DILIGENT in a sentence describing your academic preparation.'
  },
  {
    id: 'v-adaptable',
    word: 'Adaptable',
    pronunciation: '/əˈdæp.tə.bəl/',
    meaning: 'Able to adjust smoothly to new environments, unexpected changes, or tools.',
    hindiMeaning: 'अनुकूलनशील / परिस्थितियों के अनुसार ढलने वाला',
    partOfSpeech: 'adjective',
    level: 'Intermediate',
    category: 'interview',
    categoryName: 'Interview Vocabulary',
    example: 'Being adaptable allowed me to quickly switch from legacy Java to modern TypeScript.',
    conversationExample: {
      speakerA: 'How do you handle sudden shifts in project requirements?',
      speakerB: 'I pride myself on being adaptable; I listen, regroup, and reprioritize calmly.'
    },
    synonyms: ['Flexible', 'Versatile', 'Resilient', 'Adjustable'],
    antonyms: ['Rigid', 'Inflexible', 'Stubborn'],
    collocations: ['highly adaptable', 'adaptable mindset', 'remain adaptable'],
    speakingPrompt: 'Use ADAPTABLE in an interview answer about managing unexpected change.'
  },
  {
    id: 'v-spearhead',
    word: 'Spearhead',
    pronunciation: '/ˈspɪər.hed/',
    meaning: 'To lead an initiative, campaign, or significant project from the front.',
    hindiMeaning: 'नेतृत्व करना / पहल करना',
    partOfSpeech: 'verb',
    level: 'Intermediate',
    category: 'interview',
    categoryName: 'Interview Vocabulary',
    example: 'I spearheaded the student mentorship initiative across our entire department.',
    conversationExample: {
      speakerA: 'Tell me about a time you demonstrated leadership.',
      speakerB: 'I spearheaded a student coding boot camp that trained over 120 juniors.'
    },
    synonyms: ['Lead', 'Pioneer', 'Drive', 'Champion'],
    antonyms: ['Follow', 'Retreat', 'Lag behind'],
    collocations: ['spearhead an effort', 'spearhead development', 'spearhead the campaign'],
    speakingPrompt: 'Use SPEARHEAD in a sentence showcasing leadership on a past project.'
  },
  {
    id: 'v-proficient',
    word: 'Proficient',
    pronunciation: '/prəˈfɪʃ.ənt/',
    meaning: 'Competent, skilled, and adept at doing or using something through training.',
    hindiMeaning: 'निपुण / कुशल / दक्ष',
    partOfSpeech: 'adjective',
    level: 'Intermediate',
    category: 'interview',
    categoryName: 'Interview Vocabulary',
    example: 'I am proficient in public speaking, technical writing, and full-stack development.',
    conversationExample: {
      speakerA: 'What programming languages are you most proficient in?',
      speakerB: 'I am highly proficient in Python and JavaScript for building real-world web apps.'
    },
    synonyms: ['Skilled', 'Adept', 'Competent', 'Capable'],
    antonyms: ['Incompetent', 'Inept', 'Unskilled'],
    collocations: ['proficient in English', 'technically proficient', 'highly proficient'],
    speakingPrompt: 'Use PROFICIENT in a sentence stating your top communication or technical skill.'
  },
  {
    id: 'v-track-record',
    word: 'Track record',
    pronunciation: '/træk ˈrek.ərd/',
    meaning: 'The past achievements, performance history, or proven results of a person or team.',
    hindiMeaning: 'पिछला प्रदर्शन / उपलब्धियों का रिकॉर्ड',
    partOfSpeech: 'noun phrase',
    level: 'Intermediate',
    category: 'interview',
    categoryName: 'Interview Vocabulary',
    example: 'Our college team has a strong track record of winning national hackathons.',
    conversationExample: {
      speakerA: 'Why should we hire you for this leadership position?',
      speakerB: 'I bring a proven track record of shipping complex features on time and mentoring juniors.'
    },
    synonyms: ['Proven history', 'Past performance', 'Reputation', 'Resume'],
    antonyms: ['Unproven history'],
    collocations: ['proven track record', 'solid track record', 'impressive track record'],
    speakingPrompt: 'Use TRACK RECORD in an interview sentence highlighting your reliability.'
  },
  {
    id: 'v-milestone',
    word: 'Milestone',
    pronunciation: '/ˈmaɪl.stoʊn/',
    meaning: 'An important event, achievement, or stage in the development of a career or project.',
    hindiMeaning: 'मील का पत्थर / महत्वपूर्ण पड़ाव',
    partOfSpeech: 'noun',
    level: 'Intermediate',
    category: 'interview',
    categoryName: 'Interview Vocabulary',
    example: 'Reaching one thousand daily active users was a massive milestone for our startup.',
    conversationExample: {
      speakerA: 'How do you measure progress across a six-month roadmap?',
      speakerB: 'We break the big vision down into bi-weekly milestones with measurable outcomes.'
    },
    synonyms: ['Landmark', 'Breakthrough', 'Turning point', 'Achievement'],
    antonyms: ['Stagnation'],
    collocations: ['reach a milestone', 'major milestone', 'project milestone'],
    speakingPrompt: 'Use MILESTONE in a sentence discussing a recent personal breakthrough.'
  },
  {
    id: 'v-growth-mindset',
    word: 'Growth mindset',
    pronunciation: '/ɡroʊθ ˈmaɪnd.set/',
    meaning: 'The belief that skills, intelligence, and communication can be developed through dedication.',
    hindiMeaning: 'सकारात्मक विकास की सोच',
    partOfSpeech: 'noun phrase',
    level: 'Advanced',
    category: 'interview',
    categoryName: 'Interview Vocabulary',
    example: 'Possessing a growth mindset helps me treat constructive criticism as valuable fuel.',
    conversationExample: {
      speakerA: 'How do you respond when your initial idea fails?',
      speakerB: 'With a growth mindset; every failure highlights an assumption that needs refining.'
    },
    synonyms: ['Continuous improvement', 'Learning mentality', 'Adaptability'],
    antonyms: ['Fixed mindset', 'Defensiveness'],
    collocations: ['adopt a growth mindset', 'foster a growth mindset', 'growth mindset culture'],
    speakingPrompt: 'Use GROWTH MINDSET in an interview response about overcoming a setback.'
  },
  {
    id: 'v-analytical',
    word: 'Analytical',
    pronunciation: '/ˌæn.əˈlɪt.ɪ.kəl/',
    meaning: 'Using logical, systematic reasoning and data to dissect complex challenges.',
    hindiMeaning: 'विश्लेषणात्मक / तार्किक',
    partOfSpeech: 'adjective',
    level: 'Advanced',
    category: 'interview',
    categoryName: 'Interview Vocabulary',
    example: 'Her analytical approach helped uncover the root cause of the server bottleneck.',
    conversationExample: {
      speakerA: 'How do you prioritize competing feature requests?',
      speakerB: 'I use an analytical framework combining user impact scores and implementation effort.'
    },
    synonyms: ['Logical', 'Methodical', 'Systematic', 'Data-driven'],
    antonyms: ['Impulsive', 'Illogical', 'Haphazard'],
    collocations: ['analytical skills', 'analytical thinking', 'highly analytical'],
    speakingPrompt: 'Use ANALYTICAL in a sentence describing how you make sound decisions.'
  },

  // =========================================================================
  // 7. 🗣️ ENGLISH SPEAKING
  // =========================================================================
  {
    id: 'v-clarity-speaking',
    word: 'Clarity',
    pronunciation: '/ˈklær.ə.ti/',
    meaning: 'The quality of being easily heard, clearly articulated, and effortlessly understood.',
    hindiMeaning: 'स्पष्टता / साफ बोलना',
    partOfSpeech: 'noun',
    level: 'Beginner',
    category: 'speaking',
    categoryName: 'English Speaking',
    example: 'Vocal clarity is far more important in conversations than speaking quickly.',
    conversationExample: {
      speakerA: 'How can I make my speech sound more confident?',
      speakerB: 'Focus on clarity: articulate your consonants and breathe between sentences.'
    },
    synonyms: ['Clearness', 'Lucidity', 'Distinctness', 'Precision'],
    antonyms: ['Ambiguity', 'Vagueness', 'Mumbling'],
    collocations: ['speak with clarity', 'vocal clarity', 'clarity of thought'],
    speakingPrompt: 'Use CLARITY in a sentence about delivering an effective speech.'
  },
  {
    id: 'v-conversational-speaking',
    word: 'Conversational',
    pronunciation: '/ˌkɒn.vəˈseɪ.ʃən.əl/',
    meaning: 'Relaxed, natural, and friendly in delivery rather than stiff or academic.',
    hindiMeaning: 'बातचीत के अंदाज का / स्वाभाविक',
    partOfSpeech: 'adjective',
    level: 'Beginner',
    category: 'speaking',
    categoryName: 'English Speaking',
    example: 'Great podcasts sound conversational because the hosts talk with you, not at you.',
    conversationExample: {
      speakerA: 'Should I memorize my introduction speech word for word?',
      speakerB: 'Memorize key bullet points instead so your tone stays conversational.'
    },
    synonyms: ['Informal', 'Natural', 'Chatty', 'Engaging'],
    antonyms: ['Stiff', 'Robotic', 'Monotonous'],
    collocations: ['conversational tone', 'conversational English', 'sound conversational'],
    speakingPrompt: 'Use CONVERSATIONAL in a sentence describing a warm and friendly speaker.'
  },
  {
    id: 'v-fluency-speaking',
    word: 'Fluency',
    pronunciation: '/ˈfluː.ən.si/',
    meaning: 'The ability to express thoughts smoothly, easily, and without constant halting.',
    hindiMeaning: 'प्रवाह / धाराप्रवाह बोलने की क्षमता',
    partOfSpeech: 'noun',
    level: 'Beginner',
    category: 'speaking',
    categoryName: 'English Speaking',
    example: 'Fluency comes from regular speaking habits rather than just reading grammar rules.',
    conversationExample: {
      speakerA: 'What helped you achieve fluency in English?',
      speakerB: 'Daily five-minute voice journals and practicing out loud every single morning.'
    },
    synonyms: ['Smoothness', 'Eloquence', 'Flow', 'Command of language'],
    antonyms: ['Hesitancy', 'Dysfluency', 'Halting speech'],
    collocations: ['spoken fluency', 'build fluency', 'achieve fluency'],
    speakingPrompt: 'Use FLUENCY in a sentence explaining your daily language learning routine.'
  },
  {
    id: 'v-articulate-speaking',
    word: 'Articulate',
    pronunciation: '/ɑːrˈtɪk.jə.lət/',
    meaning: 'Expressing thoughts and arguments clearly, coherently, and effectively in speech.',
    hindiMeaning: 'सुवक्ता / विचारों को साफ-साफ व्यक्त करने वाला',
    partOfSpeech: 'verb / adjective',
    level: 'Intermediate',
    category: 'speaking',
    categoryName: 'English Speaking',
    example: 'She was able to articulate her ideas so clearly that the audience remained captivated.',
    conversationExample: {
      speakerA: 'What made the guest speaker’s talk so memorable?',
      speakerB: 'He was extremely articulate and used relatable real-world analogies.'
    },
    synonyms: ['Expressive', 'Eloquent', 'Lucid', 'Coherent'],
    antonyms: ['Incoherent', 'Mumbling', 'Unclear'],
    collocations: ['highly articulate', 'articulate thoughts', 'articulate clearly'],
    speakingPrompt: 'Use ARTICULATE in a sentence describing someone who explains things well.'
  },
  {
    id: 'v-enunciate',
    word: 'Enunciate',
    pronunciation: '/ɪˈnʌn.si.eɪt/',
    meaning: 'To pronounce words, vowels, and consonants distinctly and precisely.',
    hindiMeaning: 'स्पष्ट उच्चारण करना',
    partOfSpeech: 'verb',
    level: 'Intermediate',
    category: 'speaking',
    categoryName: 'English Speaking',
    example: 'Remember to enunciate the ending consonants of your words when speaking on a mic.',
    conversationExample: {
      speakerA: 'Why did the audio speech recognizer misunderstand my phrase?',
      speakerB: 'Slow down slightly and enunciate each syllable with deliberate precision.'
    },
    synonyms: ['Pronounce clearly', 'Vocalize', 'Utter', 'Articulate'],
    antonyms: ['Mumble', 'Slur', 'Garble'],
    collocations: ['enunciate words', 'enunciate clearly', 'carefully enunciate'],
    speakingPrompt: 'Use ENUNCIATE in a sentence reminding a speaker to avoid mumbling.'
  },
  {
    id: 'v-cadence',
    word: 'Cadence',
    pronunciation: '/ˈkeɪ.dəns/',
    meaning: 'The rhythmic flow, pacing, and inflection of voice while speaking.',
    hindiMeaning: 'आवाज का लय और उतार-चढ़ाव (लयबद्धता)',
    partOfSpeech: 'noun',
    level: 'Intermediate',
    category: 'speaking',
    categoryName: 'English Speaking',
    example: 'The motivational speaker used a dynamic cadence that kept the hall on the edge of their seats.',
    conversationExample: {
      speakerA: 'How do great storytellers avoid sounding boring?',
      speakerB: 'They alter their cadence—speeding up for excitement and slowing down for key truths.'
    },
    synonyms: ['Rhythm', 'Tempo', 'Pace', 'Lilt', 'Inflection'],
    antonyms: ['Monotone', 'Droning'],
    collocations: ['vocal cadence', 'rhythmic cadence', 'steady cadence'],
    speakingPrompt: 'Use CADENCE in a sentence discussing how voice modulation engages listeners.'
  },
  {
    id: 'v-monotone',
    word: 'Monotone',
    pronunciation: '/ˈmɒn.ə.toʊn/',
    meaning: 'A flat, unvarying vocal tone without pitch changes, variety, or emotion.',
    hindiMeaning: 'एक ही सुर में बोलना / बिना भाव का स्वर',
    partOfSpeech: 'noun / adjective',
    level: 'Intermediate',
    category: 'speaking',
    categoryName: 'English Speaking',
    example: 'Speaking in a monotone voice will make even the most interesting topic feel dry.',
    conversationExample: {
      speakerA: 'What feedback did the speech coach give you?',
      speakerB: 'She advised me to add pitch variation so my delivery doesn’t fall into a monotone.'
    },
    synonyms: ['Droning', 'Flat', 'Expressionless', 'Unvarying'],
    antonyms: ['Expressive', 'Dynamic', 'Melodic'],
    collocations: ['monotone voice', 'sound monotone', 'flat monotone'],
    speakingPrompt: 'Use MONOTONE in a sentence advising a speaker to add vocal energy.'
  },
  {
    id: 'v-eloquent',
    word: 'Eloquent',
    pronunciation: '/ˈel.ə.kwənt/',
    meaning: 'Fluent, persuasive, and beautifully graceful in spoken expression.',
    hindiMeaning: 'सुवक्ता / प्रभावशाली और सुंदर ढंग से बोलने वाला',
    partOfSpeech: 'adjective',
    level: 'Advanced',
    category: 'speaking',
    categoryName: 'English Speaking',
    example: 'His eloquent valedictory address brought tears and standing ovations to the auditorium.',
    conversationExample: {
      speakerA: 'How did the debate captain persuade the entire judging panel?',
      speakerB: 'She was extraordinarily eloquent, weaving solid data into a compelling human story.'
    },
    synonyms: ['Articulate', 'Persuasive', 'Poetic', 'Graceful'],
    antonyms: ['Inarticulate', 'Clumsy', 'Crude'],
    collocations: ['eloquent speaker', 'eloquent speech', 'eloquent defense'],
    speakingPrompt: 'Use ELOQUENT in a sentence praising a memorable keynote address.'
  },
  {
    id: 'v-nuance',
    word: 'Nuance',
    pronunciation: '/ˈnjuː.ɑːns/',
    meaning: 'A subtle distinction or fine shade of meaning, feeling, tone, or expression.',
    hindiMeaning: 'बारीकी / सूक्ष्म अंतर',
    partOfSpeech: 'noun',
    level: 'Advanced',
    category: 'speaking',
    categoryName: 'English Speaking',
    example: 'Mastering vocal nuance allows you to convey sarcasm, empathy, or excitement effortlessly.',
    conversationExample: {
      speakerA: 'What separates an intermediate speaker from an advanced one?',
      speakerB: 'The ability to understand and deliver humor and subtle cultural nuance.'
    },
    synonyms: ['Subtlety', 'Fine distinction', 'Shade of meaning', 'Delicacy'],
    antonyms: ['Overtness', 'Crude obviousness'],
    collocations: ['subtle nuance', 'emotional nuance', 'catch the nuance'],
    speakingPrompt: 'Use NUANCE in a sentence explaining how voice tone changes sentence meaning.'
  },

  // =========================================================================
  // 8. 🎓 COLLEGE & STUDENT LIFE
  // =========================================================================
  {
    id: 'v-syllabus',
    word: 'Syllabus',
    pronunciation: '/ˈsɪl.ə.bəs/',
    meaning: 'An outline of the subjects, grading criteria, and schedule in a course of study.',
    hindiMeaning: 'पाठ्यक्रम / कोर्स की रूपरेखा',
    partOfSpeech: 'noun',
    level: 'Beginner',
    category: 'college-student',
    categoryName: 'College & Student Life',
    example: 'Always review the syllabus in week one to understand project deadlines and exams.',
    conversationExample: {
      speakerA: 'Will the final exam cover the guest lecture topics?',
      speakerB: 'Let’s check the syllabus; the professor noted all testable chapters there.'
    },
    synonyms: ['Course outline', 'Curriculum guide', 'Study schedule'],
    antonyms: ['Unstructured study'],
    collocations: ['course syllabus', 'read the syllabus', 'syllabus guidelines'],
    speakingPrompt: 'Use SYLLABUS in a sentence about planning semester study goals.'
  },
  {
    id: 'v-deadline',
    word: 'Deadline',
    pronunciation: '/ˈded.laɪn/',
    meaning: 'The absolute latest time or date by which a task or assignment must be submitted.',
    hindiMeaning: 'अंतिम समय सीमा',
    partOfSpeech: 'noun',
    level: 'Beginner',
    category: 'college-student',
    categoryName: 'College & Student Life',
    example: 'We submitted the research paper two hours ahead of the midnight deadline.',
    conversationExample: {
      speakerA: 'Can we ask the professor for a two-day deadline extension?',
      speakerB: 'We can email politely, but let’s finish our parts today just in case.'
    },
    synonyms: ['Due date', 'Cutoff time', 'Target date', 'Time limit'],
    antonyms: ['Open-ended timeline'],
    collocations: ['meet a deadline', 'tight deadline', 'miss the deadline'],
    speakingPrompt: 'Use DEADLINE in a sentence describing managing team project timelines.'
  },
  {
    id: 'v-collaborate-college',
    word: 'Collaborate',
    pronunciation: '/kəˈlæb.ə.reɪt/',
    meaning: 'To work jointly with others toward a shared objective or academic goal.',
    hindiMeaning: 'सहयोग करना / मिलकर काम करना',
    partOfSpeech: 'verb',
    level: 'Intermediate',
    category: 'college-student',
    categoryName: 'College & Student Life',
    example: 'We collaborated with the design society to host the annual campus tech expo.',
    conversationExample: {
      speakerA: 'Are you working on the final project solo?',
      speakerB: 'No, I am collaborating with two classmates from the data science department.'
    },
    synonyms: ['Cooperate', 'Partner', 'Team up', 'Join forces'],
    antonyms: ['Compete', 'Work in isolation'],
    collocations: ['collaborate on a project', 'collaborate with peers', 'closely collaborate'],
    speakingPrompt: 'Use COLLABORATE in a sentence about teamwork in college.'
  },
  {
    id: 'v-plagiarism',
    word: 'Plagiarism',
    pronunciation: '/ˈpleɪ.dʒə.rɪ.zəm/',
    meaning: 'The practice of copying someone else’s work or ideas and passing them off as one’s own.',
    hindiMeaning: 'साहित्यिक चोरी / किसी और के काम की नकल करना',
    partOfSpeech: 'noun',
    level: 'Intermediate',
    category: 'college-student',
    categoryName: 'College & Student Life',
    example: 'Always cite your academic sources properly to avoid any hint of plagiarism.',
    conversationExample: {
      speakerA: 'Did the assignment portal flag your essay?',
      speakerB: 'Zero plagiarism! I rephrased everything in my own words and cited every paper.'
    },
    synonyms: ['Copying', 'Infringement', 'Bootlegging', 'Appropriation'],
    antonyms: ['Originality', 'Authenticity', 'Original creation'],
    collocations: ['avoid plagiarism', 'plagiarism check', 'academic plagiarism'],
    speakingPrompt: 'Use PLAGIARISM in a sentence explaining the value of original writing.'
  },
  {
    id: 'v-extracurricular',
    word: 'Extracurricular',
    pronunciation: '/ˌek.strə.kəˈrɪk.jə.lər/',
    meaning: 'Activities pursued outside the regular academic curriculum, like clubs, sports, or student council.',
    hindiMeaning: 'पाठ्येतर गतिविधियाँ / सह-पाठ्यक्रम क्रियाकलाप',
    partOfSpeech: 'adjective',
    level: 'Intermediate',
    category: 'college-student',
    categoryName: 'College & Student Life',
    example: 'Active participation in extracurricular activities builds invaluable leadership skills.',
    conversationExample: {
      speakerA: 'Does taking part in college societies help in job interviews?',
      speakerB: 'Absolutely; interviewers love seeing extracurricular teamwork and public speaking.'
    },
    synonyms: ['Co-curricular', 'After-school activities', 'Club participation'],
    antonyms: ['Academic only', 'Curricular'],
    collocations: ['extracurricular activities', 'extracurricular involvement'],
    speakingPrompt: 'Use EXTRACURRICULAR to describe a hobby or club you love on campus.'
  },
  {
    id: 'v-capstone',
    word: 'Capstone',
    pronunciation: '/ˈkæp.stoʊn/',
    meaning: 'A culminating project, thesis, or presentation that brings together everything learned in a degree.',
    hindiMeaning: 'अंतिम मुख्य परियोजना / समापन प्रोजेक्ट',
    partOfSpeech: 'noun',
    level: 'Advanced',
    category: 'college-student',
    categoryName: 'College & Student Life',
    example: 'For our final year capstone, our team built an interactive AI communication assistant.',
    conversationExample: {
      speakerA: 'When is your final capstone presentation scheduled?',
      speakerB: 'Next Thursday before the university evaluation panel and industry sponsors.'
    },
    synonyms: ['Culminating project', 'Final project', 'Crowning achievement', 'Senior thesis'],
    antonyms: ['Introductory assignment'],
    collocations: ['capstone project', 'capstone defense', 'senior capstone'],
    speakingPrompt: 'Use CAPSTONE in a sentence describing a major learning project you completed.'
  },
  {
    id: 'v-thesis',
    word: 'Thesis',
    pronunciation: '/ˈθiː.sɪs/',
    meaning: 'A long essay or dissertation involving personal research, submitted for an academic degree.',
    hindiMeaning: 'शोध प्रबंध / थीसिस',
    partOfSpeech: 'noun',
    level: 'Advanced',
    category: 'college-student',
    categoryName: 'College & Student Life',
    example: 'Her master’s thesis explored the psychological effects of virtual public speaking.',
    conversationExample: {
      speakerA: 'Have you finalized your research topic for the thesis?',
      speakerB: 'Yes, I am analyzing how real-time acoustic feedback speeds up pronunciation fluency.'
    },
    synonyms: ['Dissertation', 'Research monograph', 'Treatise', 'Paper'],
    antonyms: ['Brief note'],
    collocations: ['defend a thesis', 'write a thesis', 'thesis advisor'],
    speakingPrompt: 'Use THESIS in a sentence about conducting rigorous research.'
  },

  // =========================================================================
  // 9. 🚀 ADVANCED VOCABULARY
  // =========================================================================
  {
    id: 'v-lucid',
    word: 'Lucid',
    pronunciation: '/ˈluː.sɪd/',
    meaning: 'Expressed clearly and easy to understand; free from obscurity or confusion.',
    hindiMeaning: 'सुस्पष्ट / समझने में आसान',
    partOfSpeech: 'adjective',
    level: 'Beginner',
    category: 'advanced',
    categoryName: 'Advanced Vocabulary',
    example: 'The professor gave a lucid explanation of quantum algorithms in simple terms.',
    conversationExample: {
      speakerA: 'Did the technical architecture document make sense to you?',
      speakerB: 'Yes, the diagrams and notes were remarkably lucid and well-structured.'
    },
    synonyms: ['Clear', 'Comprehensible', 'Crystal-clear', 'Luminous'],
    antonyms: ['Confusing', 'Murky', 'Obscure', 'Vague'],
    collocations: ['lucid explanation', 'lucid presentation', 'lucid style'],
    speakingPrompt: 'Use LUCID in a sentence describing an exceptionally clear teacher.'
  },
  {
    id: 'v-pragmatic',
    word: 'Pragmatic',
    pronunciation: '/præɡˈmæt.ɪk/',
    meaning: 'Dealing with things sensibly and realistically based on practical considerations.',
    hindiMeaning: 'व्यावहारिक / यथार्थवादी',
    partOfSpeech: 'adjective',
    level: 'Beginner',
    category: 'advanced',
    categoryName: 'Advanced Vocabulary',
    example: 'Instead of chasing perfection, taking a pragmatic approach helped us launch on time.',
    conversationExample: {
      speakerA: 'Should we rebuild the entire database or optimize existing queries?',
      speakerB: 'A pragmatic decision is to optimize queries first so users get instant speedups.'
    },
    synonyms: ['Practical', 'Realistic', 'Sensible', 'Hardheaded'],
    antonyms: ['Idealistic', 'Impractical', 'Unrealistic'],
    collocations: ['pragmatic approach', 'pragmatic solution', 'pragmatic mindset'],
    speakingPrompt: 'Use PRAGMATIC in a sentence about choosing a sensible solution over theory.'
  },
  {
    id: 'v-meticulous',
    word: 'Meticulous',
    pronunciation: '/məˈtɪk.jə.ləs/',
    meaning: 'Showing great attention to detail; very careful and precise in execution.',
    hindiMeaning: 'अति सूक्ष्म / बहुत सावधान और सटीक',
    partOfSpeech: 'adjective',
    level: 'Intermediate',
    category: 'advanced',
    categoryName: 'Advanced Vocabulary',
    example: 'Her meticulous preparation ensured there were zero technical glitches during the webinar.',
    conversationExample: {
      speakerA: 'How did your team catch that obscure memory bug?',
      speakerB: 'Rohan conducted a meticulous line-by-line audit of the entire codebase.'
    },
    synonyms: ['Thorough', 'Painstaking', 'Detailed', 'Precise'],
    antonyms: ['Careless', 'Sloppy', 'Hasty'],
    collocations: ['meticulous attention to detail', 'meticulous planning', 'meticulous research'],
    speakingPrompt: 'Use METICULOUS in a sentence describing a disciplined habit of yours.'
  },
  {
    id: 'v-paradigm',
    word: 'Paradigm',
    pronunciation: '/ˈpær.ə.daɪm/',
    meaning: 'A typical example, pattern, or overarching framework of ideas and beliefs.',
    hindiMeaning: 'प्रतिमान / मिसाल / वैचारिक ढांचा',
    partOfSpeech: 'noun',
    level: 'Intermediate',
    category: 'advanced',
    categoryName: 'Advanced Vocabulary',
    example: 'Generative AI represents a fundamental paradigm shift in how humans communicate with computers.',
    conversationExample: {
      speakerA: 'How has modern English learning changed over the past five years?',
      speakerB: 'It shifted from memorizing dry grammar tables to a dynamic, interactive speaking paradigm.'
    },
    synonyms: ['Model', 'Framework', 'Pattern', 'Prototype', 'Standard'],
    antonyms: ['Anomaly', 'Deviation'],
    collocations: ['paradigm shift', 'dominant paradigm', 'new paradigm'],
    speakingPrompt: 'Use PARADIGM in a sentence describing a major change in technology or education.'
  },
  {
    id: 'v-ubiquitous',
    word: 'Ubiquitous',
    pronunciation: '/juːˈbɪk.wɪ.təs/',
    meaning: 'Present, appearing, or found everywhere simultaneously.',
    hindiMeaning: 'सर्वव्यापी / हर जगह मौजूद',
    partOfSpeech: 'adjective',
    level: 'Intermediate',
    category: 'advanced',
    categoryName: 'Advanced Vocabulary',
    example: 'Smartphones have become so ubiquitous that almost everyone carries a world of knowledge in their pocket.',
    conversationExample: {
      speakerA: 'Do you think remote video calls are here to stay?',
      speakerB: 'Undoubtedly; video conferencing tools have become ubiquitous across every global industry.'
    },
    synonyms: ['Omnipresent', 'Everywhere', 'Universal', 'Pervasive'],
    antonyms: ['Rare', 'Scarce', 'Infrequent'],
    collocations: ['ubiquitous presence', 'become ubiquitous', 'ubiquitous technology'],
    speakingPrompt: 'Use UBIQUITOUS in a sentence discussing a technology used everywhere today.'
  },
  {
    id: 'v-quintessential',
    word: 'Quintessential',
    pronunciation: '/ˌkwɪn.tɪˈsen.ʃəl/',
    meaning: 'Representing the most perfect or typical example of a particular quality or class.',
    hindiMeaning: 'उत्कृष्ट उदाहरण / सर्वोत्कृष्ट प्रतीक',
    partOfSpeech: 'adjective',
    level: 'Advanced',
    category: 'advanced',
    categoryName: 'Advanced Vocabulary',
    example: 'His gracious speech was the quintessential example of sportsmanship and humility.',
    conversationExample: {
      speakerA: 'What makes this startup story so inspiring?',
      speakerB: 'It is the quintessential journey of college friends solving a problem from their dorm room.'
    },
    synonyms: ['Archetypal', 'Classic', 'Prototypical', 'Definitive'],
    antonyms: ['Atypical', 'Uncharacteristic'],
    collocations: ['quintessential example', 'quintessential experience', 'quintessential leader'],
    speakingPrompt: 'Use QUINTESSENTIAL in a sentence describing an ideal team leader.'
  },
  {
    id: 'v-ephemeral',
    word: 'Ephemeral',
    pronunciation: '/ɪˈfem.ər.əl/',
    meaning: 'Lasting for a very brief, fleeting period of time; transitory.',
    hindiMeaning: 'क्षणिक / अल्पकालिक',
    partOfSpeech: 'adjective',
    level: 'Advanced',
    category: 'advanced',
    categoryName: 'Advanced Vocabulary',
    example: 'Fame on social media can be ephemeral, but genuine communication skills last a lifetime.',
    conversationExample: {
      speakerA: 'Why do you prioritize deep long-form reading over short video reels?',
      speakerB: 'Viral trends are ephemeral, whereas deep insights build enduring wisdom.'
    },
    synonyms: ['Fleeting', 'Transitory', 'Momentary', 'Short-lived'],
    antonyms: ['Permanent', 'Enduring', 'Everlasting', 'Eternal'],
    collocations: ['ephemeral nature', 'ephemeral beauty', 'ephemeral trends'],
    speakingPrompt: 'Use EPHEMERAL in a sentence contrasting fleeting trends with lasting habits.'
  },

  // =========================================================================
  // 10. 📚 IDIOMS & EXPRESSIONS
  // =========================================================================
  {
    id: 'v-break-the-ice',
    word: 'Break the ice',
    pronunciation: '/breɪk ði aɪs/',
    meaning: 'To say or do something in a social situation that relieves initial awkwardness or tension.',
    hindiMeaning: 'झिझक मिटाना / बातचीत की शुरुआत करना',
    partOfSpeech: 'idiom',
    level: 'Beginner',
    category: 'idioms',
    categoryName: 'Idioms & Expressions',
    example: 'A lighthearted joke about the rainy weather helped break the ice at the start of the meeting.',
    conversationExample: {
      speakerA: 'The group introduction felt silent and stiff at first.',
      speakerB: 'So I shared a quick funny story to break the ice, and soon everyone opened up.'
    },
    synonyms: ['Warm up the room', 'Start talking', 'Ease tension', 'Get conversation rolling'],
    antonyms: ['Clam up', 'Freeze the conversation'],
    collocations: ['break the ice with a question', 'icebreaker activity', 'helped break the ice'],
    speakingPrompt: 'Use BREAK THE ICE in a sentence describing how you start conversations with strangers.'
  },
  {
    id: 'v-under-the-weather',
    word: 'Under the weather',
    pronunciation: '/ˈʌn.dər ðə ˈweð.ər/',
    meaning: 'Feeling slightly sick, tired, unwell, or low on energy.',
    hindiMeaning: 'तबीयत ठीक न होना / अस्वस्थ महसूस करना',
    partOfSpeech: 'idiom',
    level: 'Beginner',
    category: 'idioms',
    categoryName: 'Idioms & Expressions',
    example: 'I was feeling a bit under the weather yesterday, but a good night’s rest fixed it.',
    conversationExample: {
      speakerA: 'Why wasn’t Rohit at the speaking circle today?',
      speakerB: 'He texted that he is feeling under the weather with a sore throat.'
    },
    synonyms: ['Unwell', 'Ailing', 'Run-down', 'Indisposed'],
    antonyms: ['Healthy', 'Fit as a fiddle', 'Energetic'],
    collocations: ['feel under the weather', 'a bit under the weather'],
    speakingPrompt: 'Use UNDER THE WEATHER in a polite message excusing yourself from a meeting.'
  },
  {
    id: 'v-on-the-same-page',
    word: 'On the same page',
    pronunciation: '/ɒn ðə seɪm peɪdʒ/',
    meaning: 'In complete agreement about decisions, goals, or shared understandings.',
    hindiMeaning: 'एक राय होना / पूरी तरह सहमत होना',
    partOfSpeech: 'idiom',
    level: 'Beginner',
    category: 'idioms',
    categoryName: 'Idioms & Expressions',
    example: 'Before we present to the panel, let us review our speaking order so we are all on the same page.',
    conversationExample: {
      speakerA: 'Did the frontend and backend engineers agree on the API schema?',
      speakerB: 'Yes, after yesterday’s quick standup we are completely on the same page.'
    },
    synonyms: ['In agreement', 'In harmony', 'Aligned', 'Of one mind'],
    antonyms: ['At odds', 'In conflict', 'Misaligned'],
    collocations: ['get on the same page', 'ensure we are on the same page'],
    speakingPrompt: 'Use ON THE SAME PAGE in a sentence about coordinating team responsibilities.'
  },
  {
    id: 'v-bite-the-bullet',
    word: 'Bite the bullet',
    pronunciation: '/baɪt ðə ˈbʊl.ɪt/ ',
    meaning: 'To face an inevitable, difficult situation with courage and get it over with.',
    hindiMeaning: 'मुश्किल परिस्थिति का हिम्मत से सामना करना',
    partOfSpeech: 'idiom',
    level: 'Intermediate',
    category: 'idioms',
    categoryName: 'Idioms & Expressions',
    example: 'I had avoided public speaking for years, but finally decided to bite the bullet and join.',
    conversationExample: {
      speakerA: 'Are you still putting off that difficult phone call with your supervisor?',
      speakerB: 'No, I am biting the bullet and calling him right after lunch.'
    },
    synonyms: ['Face the music', 'Grit one’s teeth', 'Tackle head-on', 'Take the plunge'],
    antonyms: ['Procrastinate', 'Evade', 'Dodge'],
    collocations: ['bite the bullet and speak', 'time to bite the bullet'],
    speakingPrompt: 'Use BITE THE BULLET in a sentence describing a tough fear you conquered.'
  },
  {
    id: 'v-cut-to-the-chase',
    word: 'Cut to the chase',
    pronunciation: '/kʌt tuː ðə tʃeɪs/',
    meaning: 'To get straight to the essential point without wasting time on background details.',
    hindiMeaning: 'मुद्दे की बात पर आना',
    partOfSpeech: 'idiom',
    level: 'Intermediate',
    category: 'idioms',
    categoryName: 'Idioms & Expressions',
    example: 'We only have ten minutes left in this interview, so let us cut to the chase.',
    conversationExample: {
      speakerA: 'The presenter spent twenty minutes explaining basic history.',
      speakerB: 'I wished he would cut to the chase and demo the actual AI features.'
    },
    synonyms: ['Get to the point', 'Cut the preamble', 'Be direct', 'Zero in'],
    antonyms: ['Beat around the bush', 'Ramble', 'Diverge'],
    collocations: ['let’s cut to the chase', 'cut straight to the chase'],
    speakingPrompt: 'Use CUT TO THE CHASE in a sentence refocusing a wandering discussion.'
  },
  {
    id: 'v-ball-is-in-your-court',
    word: 'The ball is in your court',
    pronunciation: '/ðə bɔːl ɪz ɪn jɔːr kɔːrt/',
    meaning: 'It is now your turn or personal responsibility to make the next move or decision.',
    hindiMeaning: 'अब फैसला आपके हाथ में है',
    partOfSpeech: 'idiom',
    level: 'Intermediate',
    category: 'idioms',
    categoryName: 'Idioms & Expressions',
    example: 'We made our final offer on the project contract; now the ball is in their court.',
    conversationExample: {
      speakerA: 'Did the hiring manager reply to your follow-up email?',
      speakerB: 'They sent over the schedule options, so the ball is in my court to pick a slot.'
    },
    synonyms: ['Your turn', 'Your decision', 'Next move is yours'],
    antonyms: ['Out of your hands'],
    collocations: ['ball is in their court', 'put the ball in someone’s court'],
    speakingPrompt: 'Use THE BALL IS IN YOUR COURT in a sentence about concluding a business negotiation.'
  },
  {
    id: 'v-hit-the-ground-running',
    word: 'Hit the ground running',
    pronunciation: '/hɪt ðə ɡraʊnd ˈrʌn.ɪŋ/',
    meaning: 'To start a new activity or job immediately with full energy, enthusiasm, and speed.',
    hindiMeaning: 'शुरुआत से ही पूरी ऊर्जा और गति से काम करना',
    partOfSpeech: 'idiom',
    level: 'Advanced',
    category: 'idioms',
    categoryName: 'Idioms & Expressions',
    example: 'Thanks to thorough onboarding, our new intern hit the ground running on day one.',
    conversationExample: {
      speakerA: 'How quickly did your team adapt to the new framework?',
      speakerB: 'Everyone did preparatory reading over the weekend and hit the ground running on Monday.'
    },
    synonyms: ['Start fast', 'Take off smoothly', 'Charge forward', 'Make immediate progress'],
    antonyms: ['Lag behind', 'Hesitate', 'False start'],
    collocations: ['ready to hit the ground running', 'hit the ground running from day one'],
    speakingPrompt: 'Use HIT THE GROUND RUNNING in an interview response about how you start a new role.'
  },

  // =========================================================================
  // 11. 🔤 PHRASAL VERBS
  // =========================================================================
  {
    id: 'v-figure-out',
    word: 'Figure out',
    pronunciation: '/ˈfɪɡ.jər aʊt/',
    meaning: 'To understand, solve, or find a solution to a problem through thinking.',
    hindiMeaning: 'हल निकालना / समझ लेना',
    partOfSpeech: 'phrasal verb',
    level: 'Beginner',
    category: 'phrasal-verbs',
    categoryName: 'Phrasal Verbs',
    example: 'It took me a few days, but I finally figured out how to record clear audio.',
    conversationExample: {
      speakerA: 'Did you solve that tricky speech cadence issue?',
      speakerB: 'Yes, I figured out that pausing at commas makes a tremendous difference.'
    },
    synonyms: ['Solve', 'Understand', 'Fathom', 'Decipher', 'Work out'],
    antonyms: ['Misunderstand', 'Give up'],
    collocations: ['figure out a solution', 'finally figure it out', 'try to figure out'],
    speakingPrompt: 'Use FIGURE OUT in a sentence describing solving a tough study problem.'
  },
  {
    id: 'v-follow-up-phrasal',
    word: 'Follow up',
    pronunciation: '/ˈfɒl.oʊ ʌp/',
    meaning: 'To take further action or continue communication to check status on something.',
    hindiMeaning: 'आगे की कार्रवाई करना / हालचाल लेना',
    partOfSpeech: 'phrasal verb',
    level: 'Beginner',
    category: 'phrasal-verbs',
    categoryName: 'Phrasal Verbs',
    example: 'Always follow up with a polite thank-you email within 24 hours of an interview.',
    conversationExample: {
      speakerA: 'Did the recruiter get back to you regarding the second round?',
      speakerB: 'Not yet, so I plan to follow up with a polite note tomorrow morning.'
    },
    synonyms: ['Check in', 'Pursue', 'Track progress', 'Revisit'],
    antonyms: ['Drop', 'Abandon'],
    collocations: ['follow up on an email', 'follow up with someone', 'follow up question'],
    speakingPrompt: 'Use FOLLOW UP in a sentence about checking on an important application.'
  },
  {
    id: 'v-look-forward-to',
    word: 'Look forward to',
    pronunciation: '/lʊk ˈfɔːr.wərd tuː/',
    meaning: 'To await an upcoming event or conversation with genuine pleasure and anticipation.',
    hindiMeaning: 'उत्सुकता से प्रतीक्षा करना',
    partOfSpeech: 'phrasal verb',
    level: 'Beginner',
    category: 'phrasal-verbs',
    categoryName: 'Phrasal Verbs',
    example: 'I look forward to speaking with the hiring committee next Tuesday.',
    conversationExample: {
      speakerA: 'Are you ready for the inter-college symposium tomorrow?',
      speakerB: 'Yes, I look forward to hearing the guest keynote speakers.'
    },
    synonyms: ['Anticipate with joy', 'Await eagerly', 'Count down to'],
    antonyms: ['Dread', 'Fear'],
    collocations: ['look forward to hearing from you', 'look forward to seeing you'],
    speakingPrompt: 'Use LOOK FORWARD TO in a formal closing sentence of an interview email.'
  },
  {
    id: 'v-bring-up',
    word: 'Bring up',
    pronunciation: '/brɪŋ ʌp/',
    meaning: 'To mention or introduce a topic during a discussion or meeting.',
    hindiMeaning: 'बात छेड़ना / चर्चा में लाना',
    partOfSpeech: 'phrasal verb',
    level: 'Intermediate',
    category: 'phrasal-verbs',
    categoryName: 'Phrasal Verbs',
    example: 'Don’t hesitate to bring up your concerns regarding team workload during the standup.',
    conversationExample: {
      speakerA: 'Why didn’t you mention the budget constraint during the call?',
      speakerB: 'I didn’t want to bring it up until we had the exact figures verified.'
    },
    synonyms: ['Mention', 'Introduce', 'Raise a point', 'Broach'],
    antonyms: ['Suppress', 'Bottle up', 'Conceal'],
    collocations: ['bring up a topic', 'bring up an issue', 'bring it up later'],
    speakingPrompt: 'Use BRING UP in a sentence describing raising a smart question in class.'
  },
  {
    id: 'v-carry-out',
    word: 'Carry out',
    pronunciation: '/ˈkær.i aʊt/',
    meaning: 'To execute, perform, or fulfill an experiment, task, or planned instruction.',
    hindiMeaning: 'अमल में लाना / पूरा करना',
    partOfSpeech: 'phrasal verb',
    level: 'Intermediate',
    category: 'phrasal-verbs',
    categoryName: 'Phrasal Verbs',
    example: 'Our team carried out five rounds of user interviews before finalizing the user interface.',
    conversationExample: {
      speakerA: 'Who is responsible for executing the automated performance tests?',
      speakerB: 'The QA team will carry out those tests tonight on the staging server.'
    },
    synonyms: ['Execute', 'Implement', 'Perform', 'Conduct'],
    antonyms: ['Neglect', 'Cancel', 'Abandon'],
    collocations: ['carry out research', 'carry out tests', 'carry out instructions'],
    speakingPrompt: 'Use CARRY OUT in a sentence describing executing an academic survey.'
  },
  {
    id: 'v-point-out',
    word: 'Point out',
    pronunciation: '/pɔɪnt aʊt/',
    meaning: 'To draw attention to a specific fact, error, or important truth.',
    hindiMeaning: 'ध्यान दिलाना / इशारा करना',
    partOfSpeech: 'phrasal verb',
    level: 'Intermediate',
    category: 'phrasal-verbs',
    categoryName: 'Phrasal Verbs',
    example: 'She politely pointed out a small calculation discrepancy in slide four.',
    conversationExample: {
      speakerA: 'Did the reviewer catch anything we missed in the proposal?',
      speakerB: 'Yes, he pointed out that we needed to include our server backup strategy.'
    },
    synonyms: ['Indicate', 'Highlight', 'Specify', 'Direct attention to'],
    antonyms: ['Overlook', 'Ignore'],
    collocations: ['point out a mistake', 'point out an advantage', 'as you pointed out'],
    speakingPrompt: 'Use POINT OUT in a polite sentence highlighting an important insight.'
  },
  {
    id: 'v-break-down-phrasal',
    word: 'Break down',
    pronunciation: '/breɪk daʊn/',
    meaning: 'To divide something complex or overwhelming into smaller, manageable pieces.',
    hindiMeaning: 'छोटे हिस्सों में बांटना / विस्तार से समझाना',
    partOfSpeech: 'phrasal verb',
    level: 'Advanced',
    category: 'phrasal-verbs',
    categoryName: 'Phrasal Verbs',
    example: 'If a speaking prompt feels difficult, break it down into past, present, and future.',
    conversationExample: {
      speakerA: 'How do you structure an answer to a complex behavioral interview question?',
      speakerB: 'I break it down using the STAR method: Situation, Task, Action, and Result.'
    },
    synonyms: ['Deconstruct', 'Analyze', 'Segment', 'Dissect'],
    antonyms: ['Lump together', 'Complicate'],
    collocations: ['break down a problem', 'break down into steps', 'let’s break it down'],
    speakingPrompt: 'Use BREAK DOWN in a sentence about tackling an ambitious goal step by step.'
  },

  // =========================================================================
  // 12. ⚡ CONFUSING WORDS (with comparison pairs & memory tricks)
  // =========================================================================
  {
    id: 'v-affect-effect',
    word: 'Affect vs Effect',
    pronunciation: '/əˈfekt/ vs /ɪˈfekt/',
    meaning: 'Affect is usually the ACTION/VERB (to influence), while Effect is usually the NOUN (the end result).',
    hindiMeaning: 'Affect = प्रभाव डालना (क्रिया) | Effect = प्रभाव/नतीजा (संज्ञा)',
    partOfSpeech: 'verb vs noun',
    level: 'Beginner',
    category: 'confusing-words',
    categoryName: 'Confusing Words',
    isConfusing: true,
    usageNote: 'Memory Trick: A = Action (Affect is an Action/Verb). E = End result (Effect is an End result/Noun). Example: "The weather affected my mood" (Action) vs "The special effect was stunning" (Noun).',
    example: 'Lack of sleep can negatively affect (verb) your focus, producing a bad effect (noun) on your presentation.',
    conversationExample: {
      speakerA: 'Should I write "The law had an immediate affect" or "effect"?',
      speakerB: 'Use "effect" with an E because it is a noun following the article "an".'
    },
    synonyms: ['Influence vs Result', 'Act upon vs Outcome'],
    antonyms: ['Cause vs Inaction'],
    collocations: ['adversely affect', 'cause and effect', 'side effect'],
    speakingPrompt: 'Create one sentence correctly using both AFFECT and EFFECT.'
  },
  {
    id: 'v-advice-advise',
    word: 'Advice vs Advise',
    pronunciation: '/ədˈvaɪs/ vs /ədˈvaɪz/',
    meaning: 'Advice (with a C) is a NOUN (a recommendation), whereas Advise (with an S) is a VERB (the action of giving counsel).',
    hindiMeaning: 'Advice = सलाह (संज्ञा) | Advise = सलाह देना (क्रिया)',
    partOfSpeech: 'noun vs verb',
    level: 'Beginner',
    category: 'confusing-words',
    categoryName: 'Confusing Words',
    isConfusing: true,
    usageNote: 'Memory Trick: Ice is a noun; "Advice" has "ice". Wise is what you do; "Advise" has "ise" with a /z/ sound. You give advice, but you advise someone.',
    example: 'My mentor gave me great advice (noun); she advised (verb) me to speak more slowly.',
    conversationExample: {
      speakerA: 'Can you advise me on my resume?',
      speakerB: 'Certainly! My main advice is to quantify your achievements with clear numbers.'
    },
    synonyms: ['Recommendation vs Guide', 'Counsel (n) vs Counsel (v)'],
    antonyms: ['Misdirection'],
    collocations: ['piece of advice', 'strongly advise', 'take someone’s advice'],
    speakingPrompt: 'Use ADVICE and ADVISE in two separate sentences to demonstrate the difference.'
  },
  {
    id: 'v-accept-except',
    word: 'Accept vs Except',
    pronunciation: '/əkˈsept/ vs /ɪkˈsept/',
    meaning: 'Accept means to receive or agree to something, whereas Except means excluding or leaving out.',
    hindiMeaning: 'Accept = स्वीकार करना | Except = के सिवाय / छोड़कर',
    partOfSpeech: 'verb vs preposition',
    level: 'Beginner',
    category: 'confusing-words',
    categoryName: 'Confusing Words',
    isConfusing: true,
    usageNote: 'Memory Trick: Except begins with "Ex" like "Exclude". Accept begins with "Ac" like "Acquire" or "Agree".',
    example: 'I accept the job offer gladly; everyone was friendly except the strict manager.',
    conversationExample: {
      speakerA: 'Did the entire team sign the agreement?',
      speakerB: 'All members accepted the terms except Aryan, who had questions.'
    },
    synonyms: ['Receive vs Exclude', 'Agree to vs Apart from'],
    antonyms: ['Reject vs Including'],
    collocations: ['accept an offer', 'everyone except', 'accept responsibility'],
    speakingPrompt: 'Use ACCEPT and EXCEPT in a single sentence describing team attendance.'
  },
  {
    id: 'v-your-youre',
    word: 'Your vs You’re',
    pronunciation: '/jɔːr/ vs /jʊər/',
    meaning: 'Your indicates possession (belonging to you), whereas You’re is the contraction for "You are".',
    hindiMeaning: 'Your = आपका / तुम्हारा | You’re = आप हैं (You are का संक्षिप्त रूप)',
    partOfSpeech: 'possessive vs contraction',
    level: 'Intermediate',
    category: 'confusing-words',
    categoryName: 'Confusing Words',
    isConfusing: true,
    usageNote: 'Memory Trick: If you can replace it with "You are" and the sentence makes sense, use "You’re". If not, use "Your". Ex: "Your speech was great" vs "You’re a great speaker".',
    example: 'You’re (you are) going to excel in your (belonging to you) speaking interview today!',
    conversationExample: {
      speakerA: 'Is it "Your welcome" or "You’re welcome"?',
      speakerB: 'It is always "You’re welcome" because it expands to "You are welcome".'
    },
    synonyms: ['Belonging to you vs You are'],
    antonyms: ['Mine vs I am'],
    collocations: ['your choice', 'you’re right', 'your turn'],
    speakingPrompt: 'State the rule out loud for choosing between YOUR and YOU’RE.'
  },
  {
    id: 'v-then-than',
    word: 'Then vs Than',
    pronunciation: '/ðen/ vs /ðæn/',
    meaning: 'Then relates to time, order, or sequence, whereas Than is used for comparisons.',
    hindiMeaning: 'Then = तब / फिर (समय) | Than = की तुलना में (तुलना)',
    partOfSpeech: 'adverb vs conjunction',
    level: 'Intermediate',
    category: 'confusing-words',
    categoryName: 'Confusing Words',
    isConfusing: true,
    usageNote: 'Memory Trick: "Then" has an E like "Time". "Than" has an A like "Comparison". Ex: "We practiced, then rested" (Time) vs "She speaks louder than me" (Comparison).',
    example: 'I prepared my opening outline first, and then (sequence) I spoke for more than (comparison) five minutes.',
    conversationExample: {
      speakerA: 'Should I write "more then five" or "more than five"?',
      speakerB: 'Use "than" with an A because you are comparing amounts.'
    },
    synonyms: ['After that vs In comparison with'],
    antonyms: ['Before vs Equal to'],
    collocations: ['better than', 'and then', 'more than'],
    speakingPrompt: 'Create a sentence using both THEN and THAN in a natural conversational way.'
  },
  {
    id: 'v-loose-lose',
    word: 'Loose vs Lose',
    pronunciation: '/luːs/ vs /luːz/',
    meaning: 'Loose (with two O’s) means not tight or free, whereas Lose (with one O) means to misplace, suffer defeat, or be deprived of.',
    hindiMeaning: 'Loose = ढीला / खुला | Lose = खोना / हारना',
    partOfSpeech: 'adjective vs verb',
    level: 'Advanced',
    category: 'confusing-words',
    categoryName: 'Confusing Words',
    isConfusing: true,
    usageNote: 'Memory Trick: "Loose" has lost its tightness (extra O makes it wide/loose). "Lose" lost an O! If you lose something, it is gone.',
    example: 'Make sure your microphone wire isn’t loose (not tight), or you might lose (misplace) your audio connection.',
    conversationExample: {
      speakerA: 'Don’t loose your confidence on stage!',
      speakerB: 'Watch the spelling—it is "lose" with one O when talking about losing confidence!'
    },
    synonyms: ['Slack/Baggy vs Misplace/Forfeit'],
    antonyms: ['Tight/Fitted vs Win/Find'],
    collocations: ['loose connection', 'lose hope', 'lose track of time'],
    speakingPrompt: 'Use LOOSE and LOSE in two separate sentences showing their correct meanings.'
  },
  {
    id: 'v-complement-compliment',
    word: 'Complement vs Compliment',
    pronunciation: '/ˈkɒm.plɪ.mənt/ vs /ˈkɒm.plɪ.mənt/',
    meaning: 'Complement (with an E) means to complete or enhance nicely, while Compliment (with an I) means an expression of praise.',
    hindiMeaning: 'Complement = पूरक होना / पूरा करना | Compliment = प्रशंसा / तारीफ',
    partOfSpeech: 'verb / noun',
    level: 'Advanced',
    category: 'confusing-words',
    categoryName: 'Confusing Words',
    isConfusing: true,
    usageNote: 'Memory Trick: Complement with an E Completes. Compliment with an I is something "I" like to receive (praise).',
    example: 'Her analytical research complemented (completed) my design work, and the professor gave us a wonderful compliment (praise).',
    conversationExample: {
      speakerA: 'Did the mentor complement or compliment your slide design?',
      speakerB: 'She complimented me on my color choices, saying they complement the corporate theme.'
    },
    synonyms: ['Enhance/Complete vs Praise/Flatter'],
    antonyms: ['Clash with vs Insult/Criticize'],
    collocations: ['pay a compliment', 'perfect complement', 'complement each other'],
    speakingPrompt: 'Use COMPLEMENT and COMPLIMENT in a sentence describing great teamwork.'
  },

  // =========================================================================
  // ADDITIONAL A-Z DICTIONARY WORDS (J, K, O, Q, R, W, X, Y, Z)
  // =========================================================================
  {
    id: 'v-jovial',
    word: 'Jovial',
    pronunciation: '/ˈdʒoʊ.vi.əl/',
    meaning: 'Cheerful, friendly, and good-humored in speech and manner.',
    hindiMeaning: 'प्रसन्नचित्त / हंसमुख',
    partOfSpeech: 'adjective',
    level: 'Beginner',
    category: 'speaking',
    categoryName: 'English Speaking',
    example: 'His jovial greeting put everyone at ease before the meeting started.',
    conversationExample: {
      speakerA: 'How was the new team lead during the first orientation?',
      speakerB: 'He was remarkably jovial and made us all feel welcome immediately.'
    },
    synonyms: ['Cheerful', 'Good-natured', 'Jolly', 'Buoyant'],
    antonyms: ['Gloomy', 'Morose', 'Sour'],
    collocations: ['jovial mood', 'jovial laughter', 'jovial host'],
    speakingPrompt: 'Use JOVIAL to describe a friend who always brings positive energy.'
  },
  {
    id: 'v-jargon',
    word: 'Jargon',
    pronunciation: '/ˈdʒɑːr.ɡən/',
    meaning: 'Specialized terms used by a specific group or profession that are difficult for others to understand.',
    hindiMeaning: 'विशिष्ट शब्दावली / तकनीकी भाषा',
    partOfSpeech: 'noun',
    level: 'Intermediate',
    category: 'professional',
    categoryName: 'Professional English',
    example: 'Avoid heavy technical jargon when presenting to non-technical stakeholders.',
    conversationExample: {
      speakerA: 'Why was the client confused during the software demo?',
      speakerB: 'The engineer used too much internal jargon instead of plain English.'
    },
    synonyms: ['Slang', 'Terminology', 'Technical lingo', 'Buzzwords'],
    antonyms: ['Plain English', 'Clear language'],
    collocations: ['technical jargon', 'industry jargon', 'avoid jargon'],
    speakingPrompt: 'Use JARGON in a sentence advising a team on communicating with customers.'
  },
  {
    id: 'v-judicious',
    word: 'Judicious',
    pronunciation: '/dʒuːˈdɪʃ.əs/',
    meaning: 'Having, showing, or done with sound judgment, wisdom, and prudence.',
    hindiMeaning: 'उचित / विवेकपूर्ण / समझदारी भरा',
    partOfSpeech: 'adjective',
    level: 'Advanced',
    category: 'advanced',
    categoryName: 'Advanced Vocabulary',
    example: 'A judicious choice of words helps defuse heated debates without offending anyone.',
    conversationExample: {
      speakerA: 'How did the project manager handle the sudden budget cut?',
      speakerB: 'Through judicious resource reallocation, preserving our core deliverables.'
    },
    synonyms: ['Wise', 'Prudent', 'Discreet', 'Sensible'],
    antonyms: ['Foolish', 'Rash', 'Indiscreet'],
    collocations: ['judicious use', 'judicious decision', 'judicious planning'],
    speakingPrompt: 'Use JUDICIOUS in an interview sentence discussing decision making.'
  },
  {
    id: 'v-knack',
    word: 'Knack',
    pronunciation: '/næk/',
    meaning: 'An acquired or natural skill, talent, or aptitude for doing something easily.',
    hindiMeaning: 'हुनर / कुशलता / आदत',
    partOfSpeech: 'noun',
    level: 'Beginner',
    category: 'daily-useful',
    categoryName: 'Daily Useful Words',
    example: 'She has a natural knack for explaining complicated algorithms in simple terms.',
    conversationExample: {
      speakerA: 'How does Aryan connect so effortlessly with interviewers?',
      speakerB: 'He just has a knack for conversational storytelling and active listening.'
    },
    synonyms: ['Talent', 'Gift', 'Aptitude', 'Skill'],
    antonyms: ['Inability', 'Clumsiness'],
    collocations: ['have a knack for', 'develop a knack', 'special knack'],
    speakingPrompt: 'Use KNACK in a sentence describing a communication skill you are good at.'
  },
  {
    id: 'v-keen',
    word: 'Keen',
    pronunciation: '/kiːn/',
    meaning: 'Highly interested, eager, enthusiastic, or having sharp mental perception.',
    hindiMeaning: 'उत्सुक / तीव्र / उत्सुकता से भरा',
    partOfSpeech: 'adjective',
    level: 'Intermediate',
    category: 'interview',
    categoryName: 'Interview Vocabulary',
    example: 'I am extremely keen to contribute to your engineering team’s open-source projects.',
    conversationExample: {
      speakerA: 'Would you be interested in leading our college speaking club?',
      speakerB: 'I am very keen on taking that leadership role this semester!'
    },
    synonyms: ['Eager', 'Enthusiastic', 'Sharp', 'Passionate'],
    antonyms: ['Apathetic', 'Reluctant', 'Indifferent'],
    collocations: ['keen interest', 'keen on learning', 'keen eye for detail'],
    speakingPrompt: 'Use KEEN in an interview answer expressing interest in the role.'
  },
  {
    id: 'v-kudos',
    word: 'Kudos',
    pronunciation: '/ˈkuː.doʊz/',
    meaning: 'Praise, congratulations, and recognition earned for an achievement.',
    hindiMeaning: 'प्रशंसा / बधाई / मान-सम्मान',
    partOfSpeech: 'noun / slang',
    level: 'Intermediate',
    category: 'gen-z-slang',
    categoryName: 'Gen Z & Modern Slang',
    isSlang: true,
    usageNote: 'Casual / Informal: Common in workplace peer-reviews and chat channels (e.g., Slack). In formal writing, use "commendation" or "praise".',
    example: 'Kudos to the entire team for delivering the presentation ahead of schedule!',
    conversationExample: {
      speakerA: 'Priya won first prize in the national extempore competition.',
      speakerB: 'Major kudos to her! She practiced every single morning.'
    },
    synonyms: ['Praise', 'Congratulations', 'Acclaim', 'Applause'],
    antonyms: ['Criticism', 'Disapproval'],
    collocations: ['kudos to', 'give kudos', 'earn kudos'],
    speakingPrompt: 'Use KUDOS in a peer message congratulating a friend.'
  },
  {
    id: 'v-overcome',
    word: 'Overcome',
    pronunciation: '/ˌoʊ.vərˈkʌm/',
    meaning: 'To succeed in dealing with and resolving a difficulty, fear, or obstacle.',
    hindiMeaning: 'विजय पाना / पार पाना / मात देना',
    partOfSpeech: 'verb',
    level: 'Beginner',
    category: 'interview',
    categoryName: 'Interview Vocabulary',
    example: 'Consistent vocal practice helped me overcome my fear of public speaking.',
    conversationExample: {
      speakerA: 'How did you handle your initial stage fright?',
      speakerB: 'I overcame it by speaking in small peer circles before addressing large halls.'
    },
    synonyms: ['Conquer', 'Surmount', 'Master', 'Triumph over'],
    antonyms: ['Succumb', 'Surrender', 'Yield'],
    collocations: ['overcome obstacles', 'overcome fear', 'overcome hesitation'],
    speakingPrompt: 'Use OVERCOME in an interview answer about conquering a personal challenge.'
  },
  {
    id: 'v-outspoken',
    word: 'Outspoken',
    pronunciation: '/aʊtˈspoʊ.kən/',
    meaning: 'Frank, candid, and candidly expressing opinions without hesitation.',
    hindiMeaning: 'मुखर / साफ-साफ बोलने वाला',
    partOfSpeech: 'adjective',
    level: 'Intermediate',
    category: 'speaking',
    categoryName: 'English Speaking',
    example: 'He is an outspoken advocate for student mental health and speech therapy.',
    conversationExample: {
      speakerA: 'Was Sneha hesitant during the campus council debate?',
      speakerB: 'Not at all; she was outspoken and presented student concerns fearlessly.'
    },
    synonyms: ['Frank', 'Candid', 'Direct', 'Vocal'],
    antonyms: ['Reticent', 'Timid', 'Reserved'],
    collocations: ['outspoken critic', 'outspoken advocate', 'remain outspoken'],
    speakingPrompt: 'Use OUTSPOKEN in a sentence describing a passionate leader.'
  },
  {
    id: 'v-query',
    word: 'Query',
    pronunciation: '/ˈkwɪər.i/',
    meaning: 'A formal question or polite request for information addressed to an authority or system.',
    hindiMeaning: 'प्रश्न / पूछताछ / शंका',
    partOfSpeech: 'noun / verb',
    level: 'Beginner',
    category: 'professional',
    categoryName: 'Professional English',
    example: 'If you have any query regarding the syllabus, feel free to email the professor.',
    conversationExample: {
      speakerA: 'Did the HR recruiter answer your salary query?',
      speakerB: 'Yes, she replied promptly with the full compensation breakdown.'
    },
    synonyms: ['Question', 'Inquiry', 'Interrogation', 'Doubt'],
    antonyms: ['Answer', 'Resolution'],
    collocations: ['raise a query', 'resolve a query', 'search query'],
    speakingPrompt: 'Use QUERY in a sentence politely asking for clarification.'
  },
  {
    id: 'v-qualify',
    word: 'Qualify',
    pronunciation: '/ˈkwɒl.ɪ.faɪ/',
    meaning: 'To meet the required standards, credentials, or competence for a role or event.',
    hindiMeaning: 'योग्य होना / अर्हता प्राप्त करना',
    partOfSpeech: 'verb',
    level: 'Intermediate',
    category: 'interview',
    categoryName: 'Interview Vocabulary',
    example: 'Her fluency and technical leadership qualify her for the senior engineering track.',
    conversationExample: {
      speakerA: 'Did our team qualify for the national round of the hackathon?',
      speakerB: 'Yes! We ranked in the top five out of two hundred participating colleges.'
    },
    synonyms: ['Meet standards', 'Be eligible', 'Certify', 'Fit the bill'],
    antonyms: ['Disqualify', 'Fail'],
    collocations: ['qualify for', 'fully qualify', 'qualify as'],
    speakingPrompt: 'Use QUALIFY in an interview answer showing how your background fits the job.'
  },
  {
    id: 'v-rephrase',
    word: 'Rephrase',
    pronunciation: '/ˌriːˈfreɪz/',
    meaning: 'To express an idea in an alternative, clearer way so that listeners understand easily.',
    hindiMeaning: 'नए शब्दों में कहना / दोबारा साफ समझाना',
    partOfSpeech: 'verb',
    level: 'Beginner',
    category: 'speaking',
    categoryName: 'English Speaking',
    example: 'When the interviewer looked confused, I politely rephrased my answer with an analogy.',
    conversationExample: {
      speakerA: 'I did not quite understand your initial proposal.',
      speakerB: 'Let me rephrase it: we are reducing build times by caching dependencies.'
    },
    synonyms: ['Restate', 'Reword', 'Paraphrase', 'Put another way'],
    antonyms: ['Repeat verbatim'],
    collocations: ['allow me to rephrase', 'rephrase the question', 'rephrase politely'],
    speakingPrompt: 'Use REPHRASE in a sentence describing clarifying a misunderstood comment.'
  },
  {
    id: 'v-resilient',
    word: 'Resilient',
    pronunciation: '/rɪˈzɪl.jənt/',
    meaning: 'Able to recover quickly and bounce back from setbacks, criticism, or adversity.',
    hindiMeaning: 'कठिनाइयों से तुरंत उबरने वाला / लचीला',
    partOfSpeech: 'adjective',
    level: 'Intermediate',
    category: 'interview',
    categoryName: 'Interview Vocabulary',
    example: 'Resilient communicators treat stumbles as learning moments rather than failures.',
    conversationExample: {
      speakerA: 'How did you handle your proposal being rejected initially?',
      speakerB: 'I stayed resilient, integrated their feedback, and won approval on the second review.'
    },
    synonyms: ['Tenacious', 'Tough', 'Buoyant', 'Adaptable'],
    antonyms: ['Fragile', 'Vulnerable', 'Brittle'],
    collocations: ['resilient mindset', 'highly resilient', 'resilient spirit'],
    speakingPrompt: 'Use RESILIENT in an interview response about overcoming a setback.'
  },
  {
    id: 'v-rhetoric',
    word: 'Rhetoric',
    pronunciation: '/ˈret.ər.ɪk/',
    meaning: 'The art of effective, persuasive speaking or writing, using figures of speech and composition.',
    hindiMeaning: 'वक्तृत्व कला / भाषण कला / प्रभावोत्पादक भाषा',
    partOfSpeech: 'noun',
    level: 'Advanced',
    category: 'speaking',
    categoryName: 'English Speaking',
    example: 'Great political and social orators master rhetoric to move entire nations.',
    conversationExample: {
      speakerA: 'What made Winston Churchill’s wartime speeches so compelling?',
      speakerB: 'His masterful use of classical rhetoric, cadence, and vivid metaphors.'
    },
    synonyms: ['Oratory', 'Eloquence', 'Persuasion', 'Expressive delivery'],
    antonyms: ['Inarticulate speech'],
    collocations: ['powerful rhetoric', 'empty rhetoric', 'art of rhetoric'],
    speakingPrompt: 'Use RHETORIC in a sentence discussing persuasive public speaking.'
  },
  {
    id: 'v-warmth',
    word: 'Warmth',
    pronunciation: '/wɔːrmθ/',
    meaning: 'The quality of being friendly, welcoming, kind, and approachable in communication.',
    hindiMeaning: 'आत्मीयता / स्नेह / सौहार्द',
    partOfSpeech: 'noun',
    level: 'Beginner',
    category: 'basic-communication',
    categoryName: 'Basic Communication',
    example: 'Speaking with genuine vocal warmth makes listeners feel comfortable and valued.',
    conversationExample: {
      speakerA: 'Why do guests love attending Dr. Roy’s lectures?',
      speakerB: 'She teaches with such genuine warmth and enthusiasm that learning is a joy.'
    },
    synonyms: ['Friendliness', 'Cordiality', 'Affection', 'Hospitality'],
    antonyms: ['Coldness', 'Aloofness', 'Hostility'],
    collocations: ['vocal warmth', 'radiate warmth', 'welcome with warmth'],
    speakingPrompt: 'Use WARMTH in a sentence describing welcoming a new member to a club.'
  },
  {
    id: 'v-walkthrough',
    word: 'Walkthrough',
    pronunciation: '/ˈwɔːk.θruː/',
    meaning: 'A step-by-step demonstration, explanation, or review of a system or process.',
    hindiMeaning: 'विस्तृत प्रदर्शन / चरणबद्ध विवरण',
    partOfSpeech: 'noun',
    level: 'Intermediate',
    category: 'professional',
    categoryName: 'Professional English',
    example: 'The lead engineer gave a detailed code walkthrough before the feature launch.',
    conversationExample: {
      speakerA: 'Can you show me how the voice recording module operates?',
      speakerB: 'Sure, I will give you a five-minute live walkthrough right now.'
    },
    synonyms: ['Demonstration', 'Tour', 'Tutorial', 'Step-by-step guide'],
    antonyms: ['Brief glance'],
    collocations: ['code walkthrough', 'guided walkthrough', 'give a walkthrough'],
    speakingPrompt: 'Use WALKTHROUGH in a sentence offering to demo a feature to a peer.'
  },
  {
    id: 'v-xenial',
    word: 'Xenial',
    pronunciation: '/ˈziː.ni.əl/',
    meaning: 'Warm, hospitable, and graciously welcoming toward guests, strangers, or visiting delegates.',
    hindiMeaning: 'अतिथि-सत्कारशील / मेहमाननवाज',
    partOfSpeech: 'adjective',
    level: 'Advanced',
    category: 'advanced',
    categoryName: 'Advanced Vocabulary',
    example: 'The host university provided a remarkably xenial welcome to all international debate teams.',
    conversationExample: {
      speakerA: 'How were you treated during the foreign exchange symposium?',
      speakerB: 'The organizers were extraordinarily xenial, attending to every detail with kindness.'
    },
    synonyms: ['Hospitable', 'Welcoming', 'Cordial', 'Gracious'],
    antonyms: ['Inhospitable', 'Hostile', 'Cold'],
    collocations: ['xenial host', 'xenial reception', 'xenial spirit'],
    speakingPrompt: 'Use XENIAL in a sentence describing gracious hospitality.'
  },
  {
    id: 'v-yield',
    word: 'Yield',
    pronunciation: '/jiːld/',
    meaning: 'To produce, generate, or deliver a tangible outcome, benefit, or result.',
    hindiMeaning: 'पैदा करना / परिणाम देना / फल देना',
    partOfSpeech: 'verb / noun',
    level: 'Intermediate',
    category: 'professional',
    categoryName: 'Professional English',
    example: 'Consistent 15-minute daily speech rehearsals yield massive confidence gains within a month.',
    conversationExample: {
      speakerA: 'Did our revised customer feedback survey provide useful insights?',
      speakerB: 'Yes, it yielded tremendous clarity on what users want us to build next.'
    },
    synonyms: ['Produce', 'Generate', 'Provide', 'Return'],
    antonyms: ['Withhold', 'Consume'],
    collocations: ['yield results', 'yield benefits', 'high yield'],
    speakingPrompt: 'Use YIELD in an interview sentence showing how your efforts produce results.'
  },
  {
    id: 'v-yearn',
    word: 'Yearn',
    pronunciation: '/jɜːrn/',
    meaning: 'To have an intense, heartfelt desire or deep longing for something meaningful.',
    hindiMeaning: 'तीव्र इच्छा होना / तरसना / लालायित होना',
    partOfSpeech: 'verb',
    level: 'Advanced',
    category: 'advanced',
    categoryName: 'Advanced Vocabulary',
    example: 'Deep down, every hesitant speaker yearns to express their thoughts freely and without fear.',
    conversationExample: {
      speakerA: 'Why did you start this public speaking journey?',
      speakerB: 'I yearned to communicate my scientific research directly to the public.'
    },
    synonyms: ['Long for', 'Desire', 'Crave', 'Aspire to'],
    antonyms: ['Despise', 'Dislike'],
    collocations: ['yearn for', 'yearn to speak', 'deeply yearn'],
    speakingPrompt: 'Use YEARN in a personal sentence describing an aspiration you care about.'
  },
  {
    id: 'v-zeal',
    word: 'Zeal',
    pronunciation: '/ziːl/',
    meaning: 'Great energy, passion, and enthusiasm in pursuit of a cause or learning goal.',
    hindiMeaning: 'उत्साह / लगन / जोश',
    partOfSpeech: 'noun',
    level: 'Intermediate',
    category: 'speaking',
    categoryName: 'English Speaking',
    example: 'She approached each vocabulary challenge with infectious energy and unyielding zeal.',
    conversationExample: {
      speakerA: 'What makes your college debate team so dominant?',
      speakerB: 'Our shared zeal for rigorous research and respectful verbal persuasion.'
    },
    synonyms: ['Passion', 'Enthusiasm', 'Fervor', 'Ardor'],
    antonyms: ['Apathy', 'Indifference', 'Lethargy'],
    collocations: ['with great zeal', 'unmatched zeal', 'zeal for learning'],
    speakingPrompt: 'Use ZEAL in a sentence describing your dedication to personal mastery.'
  },
  {
    id: 'v-zenith',
    word: 'Zenith',
    pronunciation: '/ˈzen.ɪθ/',
    meaning: 'The time at which something is most powerful, successful, or at its highest peak.',
    hindiMeaning: 'चरमोत्कर्ष / शिखर / शीर्ष बिंदु',
    partOfSpeech: 'noun',
    level: 'Advanced',
    category: 'advanced',
    categoryName: 'Advanced Vocabulary',
    example: 'Winning the international oratory championship marked the zenith of her college speaking career.',
    conversationExample: {
      speakerA: 'Do you feel your speaking skills have reached their maximum potential?',
      speakerB: 'Not at all; I view every stage as a stepping stone toward a future zenith.'
    },
    synonyms: ['Peak', 'Pinnacle', 'Apex', 'Climax', 'Summit'],
    antonyms: ['Nadir', 'Lowest point', 'Bottom'],
    collocations: ['reach the zenith', 'at the zenith of', 'career zenith'],
    speakingPrompt: 'Use ZENITH in a sentence describing an ultimate milestone in life.'
  }
];

// Helper: Get today's rotating target words based on current day
export function getTodayWords(count = 5) {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const startIndex = (dayOfYear * 3) % HUB_VOCABULARY.length;
  const result = [];
  for (let i = 0; i < count; i++) {
    const item = HUB_VOCABULARY[(startIndex + i) % HUB_VOCABULARY.length];
    if (item && !result.some((r) => r.id === item.id)) {
      result.push(item);
    }
  }
  return result;
}

// Helper: Get smart recommendation based on user goal or recent activity
export function getRecommendedWords(activity = 'interview') {
  if (activity === 'interview') {
    return HUB_VOCABULARY.filter((w) => w.category === 'interview' || w.category === 'professional').slice(0, 4);
  }
  if (activity === 'slang') {
    return HUB_VOCABULARY.filter((w) => w.category === 'gen-z-slang').slice(0, 4);
  }
  return HUB_VOCABULARY.slice(0, 4);
}
