/**
 * SpeakUp Streak Engine Utilities
 * Handles calendar week calculations, streak milestones, and tier metadata
 */

/**
 * Check if two YYYY-MM-DD date strings fall in different Monday-to-Sunday calendar weeks
 */
export function isDifferentCalendarWeek(dateStr1, dateStr2) {
  if (!dateStr1 || !dateStr2) return false;
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  const day1 = d1.getDay();
  const mon1 = new Date(d1);
  mon1.setDate(d1.getDate() - (day1 === 0 ? 6 : day1 - 1));
  mon1.setHours(0, 0, 0, 0);

  const day2 = d2.getDay();
  const mon2 = new Date(d2);
  mon2.setDate(d2.getDate() - (day2 === 0 ? 6 : day2 - 1));
  mon2.setHours(0, 0, 0, 0);

  return mon1.getTime() !== mon2.getTime();
}

/**
 * Calculates days for Monday -> Sunday of the current calendar week
 */
export function getWeekDays(streakDays = {}, _lastPracticeDate = null) {
  const now = new Date();
  const todayNum = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();

  // Monday-based week (0 is Sunday, 1 is Monday ... 6 is Saturday)
  const currentDayOfWeek = now.getDay();
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const mondayDate = new Date(todayYear, todayMonth, todayNum + distanceToMonday);

  const dayKeys = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return dayKeys.map((key, index) => {
    const d = new Date(mondayDate.getFullYear(), mondayDate.getMonth(), mondayDate.getDate() + index);
    const isToday = (
      d.getDate() === todayNum &&
      d.getMonth() === todayMonth &&
      d.getFullYear() === todayYear
    );
    const isPast = d < new Date(todayYear, todayMonth, todayNum);
    const isFuture = d > new Date(todayYear, todayMonth, todayNum);
    const isCompleted = Boolean(streakDays && streakDays[key]);

    return {
      key,
      label: key,
      dateNum: d.getDate(),
      isToday,
      isPast,
      isFuture,
      isCompleted
    };
  });
}

/**
 * Motivational streak milestone calculation
 */
export function getStreakMilestone(currentStreak = 0) {
  const milestones = [
    { target: 3, name: '3-Day Spark', icon: '⚡' },
    { target: 7, name: '7-Day Week Warrior', icon: '🏆' },
    { target: 14, name: '14-Day Consistency Pro', icon: '🔥' },
    { target: 30, name: '30-Day Fluency Master', icon: '🌟' },
    { target: 60, name: '60-Day Speaking Legend', icon: '👑' }
  ];

  for (let i = 0; i < milestones.length; i++) {
    const m = milestones[i];
    if (currentStreak < m.target) {
      const prevTarget = i > 0 ? milestones[i - 1].target : 0;
      const progressInRange = Math.max(0, currentStreak - prevTarget);
      const rangeTotal = m.target - prevTarget;
      const percent = Math.min(100, Math.round((progressInRange / rangeTotal) * 100));
      return {
        ...m,
        daysRemaining: m.target - currentStreak,
        percent,
        isCompleted: false
      };
    }
  }

  return {
    target: 60,
    name: 'Speaking Legend',
    icon: '👑',
    daysRemaining: 0,
    percent: 100,
    isCompleted: true
  };
}

/**
 * Returns streak tier metadata
 */
export function getStreakTier(streak = 0) {
  if (streak === 0) return { label: 'Fresh Start', badge: 'Start Today!', color: 'gray' };
  if (streak === 1) return { label: 'Day 1 Spark', badge: 'Great Start! 🔥', color: 'amber' };
  if (streak < 3) return { label: 'Building Momentum', badge: 'Warming Up ⚡', color: 'amber' };
  if (streak < 7) return { label: 'On Fire!', badge: 'Solid Habit 🔥', color: 'orange' };
  if (streak < 14) return { label: 'Week Champion', badge: 'Unstoppable 🏆', color: 'purple' };
  if (streak < 30) return { label: 'Habit Master', badge: 'Mastery Zone 🌟', color: 'indigo' };
  return { label: 'Speaking Legend', badge: 'Legendary 👑', color: 'emerald' };
}
