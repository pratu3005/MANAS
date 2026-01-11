
import React from 'react';
import { MoodType } from './types';

export const MOOD_CONFIG: Record<MoodType, { emoji: string; label: string; color: string; bg: string }> = {
  excellent: { emoji: '🤩', label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  good: { emoji: '😊', label: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' },
  neutral: { emoji: '😐', label: 'Neutral', color: 'text-gray-600', bg: 'bg-gray-100' },
  fair: { emoji: '😔', label: 'Fair', color: 'text-orange-600', bg: 'bg-orange-100' },
  poor: { emoji: '😢', label: 'Poor', color: 'text-red-600', bg: 'bg-red-100' },
};

export interface Resource {
  id: string;
  name: string;
  description: string;
  category: 'Crisis' | 'National' | 'Therapy' | 'Local';
  phone?: string;
  website: string;
  urgent?: boolean;
}

export const RESOURCES: Resource[] = [
  {
    id: 'c1',
    name: '988 Suicide & Crisis Lifeline',
    description: 'Free, confidential 24/7 support for people in distress, prevention and crisis resources.',
    category: 'Crisis',
    phone: '988',
    website: 'https://988lifeline.org',
    urgent: true
  },
  {
    id: 'c2',
    name: 'Crisis Text Line',
    description: 'Text HOME to 741741 to connect with a Volunteer Crisis Counselor.',
    category: 'Crisis',
    phone: '741741',
    website: 'https://www.crisistextline.org',
    urgent: true
  },
  {
    id: 'n1',
    name: 'NAMI (National Alliance on Mental Illness)',
    description: 'The nation’s largest grassroots mental health organization dedicated to building better lives.',
    category: 'National',
    phone: '1-800-950-NAMI',
    website: 'https://www.nami.org'
  },
  {
    id: 'n2',
    name: 'Mental Health America (MHA)',
    description: 'Leading community-based nonprofit dedicated to addressing the needs of those living with mental illness.',
    category: 'National',
    website: 'https://mhanational.org'
  },
  {
    id: 't1',
    name: 'Psychology Today Therapist Finder',
    description: 'Comprehensive directory to find therapists, teletherapy, psychiatrists, and treatment centers.',
    category: 'Therapy',
    website: 'https://www.psychologytoday.com/us/therapists'
  },
  {
    id: 't2',
    name: 'Zocdoc',
    description: 'Find and book top-rated local doctors and specialists, including mental health professionals.',
    category: 'Therapy',
    website: 'https://www.zocdoc.com'
  },
  {
    id: 'l1',
    name: 'SAMHSA Treatment Locator',
    description: 'Confidential and anonymous source of information for persons seeking treatment facilities.',
    category: 'Local',
    phone: '1-800-662-HELP',
    website: 'https://findtreatment.gov'
  }
];

export const ARTICLES = [
  {
    id: '1',
    title: 'Understanding Anxiety',
    summary: 'A deep dive into the physical and mental symptoms of anxiety and how to manage them.',
    category: 'Education',
    image: 'https://picsum.photos/seed/anxiety/600/400'
  },
  {
    id: '2',
    title: 'The Power of Mindfulness',
    summary: 'Simple techniques to bring mindfulness into your daily routine for better mental clarity.',
    category: 'Wellness',
    image: 'https://picsum.photos/seed/mind/600/400'
  },
  {
    id: '3',
    title: 'Building Resilience',
    summary: 'How to bounce back from life challenges and strengthen your psychological core.',
    category: 'Growth',
    image: 'https://picsum.photos/seed/resilience/600/400'
  }
];
