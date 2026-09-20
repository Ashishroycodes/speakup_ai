import { useState, useEffect, useCallback } from 'react';

const TIMETABLE_STORAGE_KEY = 'speakup_student_timetable_v1';
const TIMETABLE_DATE_KEY = 'speakup_timetable_last_date_v1';

export const DEFAULT_TIMETABLE = [
  {
    id: 'time-1',
    title: 'Morning Fluency Warmup',
    time: '08:00 AM',
    duration: '5 min',
    description: 'Tongue twisters, vocal projection, and confidence affirmation.',
    category: 'warmup',
    completed: true,
    isCustom: false
  },
  {
    id: 'time-2',
    title: 'Midday Vocab & Idioms',
    time: '01:30 PM',
    duration: '10 min',
    description: 'Master 3 high-impact words and conversational idioms.',
    category: 'vocab',
    completed: true,
    isCustom: false
  },
  {
    id: 'time-3',
    title: 'Evening AI Coach Voice Call',
    time: '07:00 PM',
    duration: '15 min',
    description: 'Hands-free real-time conversation practice on job & college topics.',
    category: 'conversation',
    completed: false,
    isCustom: false
  },
  {
    id: 'time-4',
    title: 'Night 60-Second Challenge',
    time: '10:00 PM',
    duration: '5 min',
    description: 'Speak for 60 seconds on an impromptu prompt to earn +20 XP.',
    category: 'challenge',
    completed: false,
    isCustom: false
  }
];

export function useTimetable() {
  const [timetable, setTimetable] = useState(() => {
    try {
      const todayStr = new Date().toDateString();
      const lastSavedDate = localStorage.getItem(TIMETABLE_DATE_KEY);
      const saved = localStorage.getItem(TIMETABLE_STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);
        // If it's a new calendar day, keep the slots but reset completion checks
        if (lastSavedDate !== todayStr) {
          localStorage.setItem(TIMETABLE_DATE_KEY, todayStr);
          return parsed.map((slot) => ({ ...slot, completed: false }));
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read timetable from localStorage', e);
    }
    return DEFAULT_TIMETABLE;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TIMETABLE_STORAGE_KEY, JSON.stringify(timetable));
      localStorage.setItem(TIMETABLE_DATE_KEY, new Date().toDateString());
    } catch (e) {
      console.warn('Could not write timetable to localStorage', e);
    }
  }, [timetable]);

  // Toggle completion of a slot
  const toggleSlotComplete = useCallback((slotId) => {
    setTimetable((prev) =>
      prev.map((slot) =>
        slot.id === slotId ? { ...slot, completed: !slot.completed } : slot
      )
    );
  }, []);

  // Update scheduled time for a slot
  const updateSlotTime = useCallback((slotId, newTime) => {
    setTimetable((prev) =>
      prev.map((slot) =>
        slot.id === slotId ? { ...slot, time: newTime } : slot
      )
    );
  }, []);

  // Add custom practice block
  const addCustomSlot = useCallback((newSlotData) => {
    const newSlot = {
      id: `custom-${Date.now()}`,
      title: newSlotData.title || 'Speaking Practice Block',
      time: newSlotData.time || '04:00 PM',
      duration: newSlotData.duration || '10 min',
      description: newSlotData.description || 'Personalized speaking practice drill.',
      category: newSlotData.category || 'practice',
      completed: false,
      isCustom: true
    };
    setTimetable((prev) => [...prev, newSlot]);
  }, []);

  // Remove a custom slot
  const removeSlot = useCallback((slotId) => {
    setTimetable((prev) => prev.filter((slot) => slot.id !== slotId));
  }, []);

  // Reset timetable for today (uncheck all)
  const resetTimetable = useCallback(() => {
    setTimetable((prev) => prev.map((slot) => ({ ...slot, completed: false })));
  }, []);

  // Reset timetable to initial defaults
  const resetToDefaults = useCallback(() => {
    setTimetable(DEFAULT_TIMETABLE);
    try {
      localStorage.setItem(TIMETABLE_STORAGE_KEY, JSON.stringify(DEFAULT_TIMETABLE));
    } catch {
      // Safe ignore
    }
  }, []);

  // Stats
  const completedCount = timetable.filter((s) => s.completed).length;
  const totalCount = timetable.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    timetable,
    toggleSlotComplete,
    updateSlotTime,
    addCustomSlot,
    removeSlot,
    resetTimetable,
    resetToDefaults,
    completedCount,
    totalCount,
    completionPercentage
  };
}
