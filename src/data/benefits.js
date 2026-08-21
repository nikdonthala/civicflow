export const mockBenefits = [
  {
    id: 'BEN-001',
    name: 'National Student Scholarship',
    category: 'Education',
    amount: '₹25,000/year',
    deadline: '2026-08-30',
    eligibility: ['student', 'general'],
    matchReasons: ['Active student', 'Annual income below ₹6,00,000'],
    matchScore: 95,
    description: 'Financial assistance for undergraduate students from economically weaker backgrounds.',
    documents: ['Income certificate', 'Marksheet', 'Aadhaar', 'Bank details'],
    estimatedTime: '15 min',
    status: 'eligible',
    applied: true,
  },
  {
    id: 'BEN-002',
    name: 'AI Education Scholarship',
    category: 'Education',
    amount: '₹50,000/year',
    deadline: '2026-09-15',
    eligibility: ['student', 'engineering'],
    matchReasons: ['B.Tech student', 'Computer Science stream', 'Interest in AI/ML'],
    matchScore: 92,
    description: 'Special scholarship for engineering students pursuing AI and machine learning studies.',
    documents: ['Marksheet', 'College admission letter', 'Aadhaar', 'Statement of purpose'],
    estimatedTime: '20 min',
    status: 'eligible',
    applied: false,
  },
  {
    id: 'BEN-003',
    name: 'Digital India Learning Grant',
    category: 'Education',
    amount: '₹15,000 (one-time)',
    deadline: '2026-09-30',
    eligibility: ['student'],
    matchReasons: ['Active student enrollment'],
    matchScore: 85,
    description: 'Grant for students to access online learning platforms and digital resources.',
    documents: ['Student ID', 'Aadhaar'],
    estimatedTime: '5 min',
    status: 'eligible',
    applied: false,
  },
  {
    id: 'BEN-004',
    name: 'MGNREGA Employment',
    category: 'Employment',
    amount: 'Guaranteed 100 days work',
    deadline: null,
    eligibility: ['worker', 'job-seeker'],
    matchReasons: [],
    matchScore: 40,
    description: 'Guaranteed employment under the rural employment guarantee scheme.',
    documents: ['Aadhaar', 'Job card'],
    estimatedTime: '10 min',
    status: 'not-eligible',
    applied: false,
  },
  {
    id: 'BEN-005',
    name: 'PM-KISAN Support',
    category: 'Welfare',
    amount: '₹6,000/year',
    deadline: null,
    eligibility: ['farmer'],
    matchReasons: [],
    matchScore: 20,
    description: 'Direct income support for small and marginal farmers.',
    documents: ['Aadhaar', 'Land records', 'Bank details'],
    estimatedTime: '10 min',
    status: 'not-eligible',
    applied: false,
  },
  {
    id: 'BEN-006',
    name: 'Senior Citizen Health Card',
    category: 'Health',
    amount: 'Free health checkups',
    deadline: null,
    eligibility: ['senior-citizen'],
    matchReasons: [],
    matchScore: 15,
    description: 'Free annual health checkups and subsidized medicines for senior citizens.',
    documents: ['Aadhaar', 'Age proof'],
    estimatedTime: '5 min',
    status: 'not-eligible',
    applied: false,
  },
  {
    id: 'BEN-007',
    name: 'Skill India Training',
    category: 'Employment',
    amount: 'Free training + ₹1,000/month stipend',
    deadline: '2026-10-15',
    eligibility: ['job-seeker', 'student'],
    matchReasons: ['Young adult eligible for skill development'],
    matchScore: 70,
    description: 'Free vocational training programs with monthly stipend for skill development.',
    documents: ['Aadhaar', 'Education certificates'],
    estimatedTime: '8 min',
    status: 'eligible',
    applied: false,
  },
  {
    id: 'BEN-008',
    name: 'Housing for All',
    category: 'Housing',
    amount: 'Subsidized housing',
    deadline: '2026-12-31',
    eligibility: ['general'],
    matchReasons: ['Income criteria may be applicable'],
    matchScore: 55,
    description: 'Affordable housing scheme for economically weaker sections.',
    documents: ['Income certificate', 'Aadhaar', 'Address proof'],
    estimatedTime: '15 min',
    status: 'maybe-eligible',
    applied: false,
  },
]

export function getBenefitsForProfile(profile) {
  return mockBenefits
    .map(benefit => ({
      ...benefit,
      matchScore: calculateMatch(benefit, profile),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
}

function calculateMatch(benefit, profile) {
  let score = 0
  const occupation = profile.occupation?.toLowerCase() || ''
  
  if (benefit.eligibility.includes(occupation)) score += 60
  if (benefit.matchReasons.length > 0) score += 20
  if (benefit.deadline) score += 10
  if (benefit.status === 'eligible') score += 10
  
  return Math.min(score, 100)
}
