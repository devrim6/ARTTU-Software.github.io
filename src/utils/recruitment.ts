import { useState, useEffect } from 'react';

/**
 * RECRUITMENT STATUS CONFIGURATION
 * 
 * Centralized settings to control recruitment status across the entire website.
 * Adjust these flags to switch between active recruitment, closed/over,
 * and scheduled countdown states.
 */

// 1. Master toggle: Is recruitment currently open and accepting submissions?
// Set to false when recruitments are OVER / CLOSED.
// Set to true when a recruitment campaign is actively running.
export const isRecruitmentActive: boolean = false;

// 2. Countdown timer toggle for the upcoming recruitment cycle:
// - Set to true to start the live countdown timer ticking down to NEXT_RECRUITMENT_DATE.
// - Set to false when recruitments are over and the exact countdown has not started yet
//   (shows the next season announcement instead of a live countdown).
export const recruitmentsTimerStart: boolean = false;

// 3. Exact target date & time for the next recruitment opening:
// (Used when recruitmentsTimerStart = true)
export const NEXT_RECRUITMENT_DATE: Date = new Date('2027-10-01T00:00:00+03:00');

// 4. Human-readable season / timeline for when recruitments open next:
// (e.g. 'Autumn 2027', 'October 2027', 'Next Academic Year')
export const NEXT_RECRUITMENT_SEASON: string = 'Autumn 2027';

// Backward compatibility export for any existing imports
export const RECRUITMENT_START_DATE: Date = NEXT_RECRUITMENT_DATE;

export interface RecruitmentStatus {
  /** True when recruitment is actively open and accepting candidate applications */
  isOpen: boolean;
  /** True when recruitments are concluded / over */
  isOver: boolean;
  /** Whether the countdown timer to the next recruitment opening is currently running */
  recruitmentsTimerStart: boolean;
  /** Target date of next recruitment cycle */
  nextRecruitmentDate: Date;
  /** Human-readable season / date string for the next recruitment cycle */
  nextSeasonLabel: string;
  /** Countdown figures (used when recruitmentsTimerStart is true) */
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formattedCountdown: string;
}

function calculateStatus(): RecruitmentStatus {
  let active = isRecruitmentActive;
  let timerActive = recruitmentsTimerStart;

  // Allow manual override for previewing and testing via query params:
  // ?recruitment=open   -> forces active recruitment state
  // ?recruitment=closed -> forces recruitment closed with timer off
  // ?recruitment=timer  -> forces recruitment closed with timer on
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('recruitment');
    if (query === 'open') {
      active = true;
      timerActive = false;
    } else if (query === 'closed') {
      active = false;
      timerActive = false;
    } else if (query === 'timer') {
      active = false;
      timerActive = true;
    }
  }

  // 1. Recruitment is actively open
  if (active) {
    return {
      isOpen: true,
      isOver: false,
      recruitmentsTimerStart: false,
      nextRecruitmentDate: NEXT_RECRUITMENT_DATE,
      nextSeasonLabel: NEXT_RECRUITMENT_SEASON,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formattedCountdown: '00d 00h 00m 00s',
    };
  }

  // 2. Recruitment is over / closed and countdown timer is NOT started
  if (!timerActive) {
    return {
      isOpen: false,
      isOver: true,
      recruitmentsTimerStart: false,
      nextRecruitmentDate: NEXT_RECRUITMENT_DATE,
      nextSeasonLabel: NEXT_RECRUITMENT_SEASON,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formattedCountdown: '',
    };
  }

  // 3. Recruitment is over / closed and countdown timer IS started
  const now = Date.now();
  const diff = NEXT_RECRUITMENT_DATE.getTime() - now;

  if (diff <= 0) {
    return {
      isOpen: true,
      isOver: false,
      recruitmentsTimerStart: true,
      nextRecruitmentDate: NEXT_RECRUITMENT_DATE,
      nextSeasonLabel: NEXT_RECRUITMENT_SEASON,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formattedCountdown: '00d 00h 00m 00s',
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formattedCountdown = `${pad(days)}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;

  return {
    isOpen: false,
    isOver: true,
    recruitmentsTimerStart: true,
    nextRecruitmentDate: NEXT_RECRUITMENT_DATE,
    nextSeasonLabel: NEXT_RECRUITMENT_SEASON,
    days,
    hours,
    minutes,
    seconds,
    formattedCountdown,
  };
}

export function useRecruitmentStatus(): RecruitmentStatus {
  const [status, setStatus] = useState<RecruitmentStatus>(calculateStatus);

  useEffect(() => {
    // Only set an interval timer if recruitmentsTimerStart is enabled
    const timer = setInterval(() => {
      const nextStatus = calculateStatus();
      setStatus(nextStatus);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return status;
}
