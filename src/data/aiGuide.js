export const aiGuideResponses = {
  'self-attested': 'Self-attested means you sign a copy of the document yourself to confirm it is genuine. Simply print the document, write "Certified true copy" on it, sign, and date it.',
  'self-attested domicile certificate': 'A domicile certificate proves your place of residence. Self-attested means you sign a copy yourself. You can get one from your local Tehsildar office or apply online.',
  'income certificate': 'An Income Certificate is a document showing your family\'s approximate annual income. It is issued by the Tehsildar or Revenue Officer. You can apply for one at your local government office or online portal.',
  'what does income certificate mean': 'Income Certificate: A document showing your family\'s approximate annual income. For this application, you\'ll need to upload a valid certificate issued by the relevant authority.',
  'why do i need this document': 'This document is required to verify the eligibility information used in this application. It helps confirm that you meet the income criteria for this scholarship.',
  'what do i need to do next': 'You have completed 3 of 5 steps. Your next task is to upload the income certificate. After that, you\'ll review and submit your application.',
  'scholarship': 'The National Student Scholarship provides ₹25,000 per year to undergraduate students from economically weaker backgrounds. You appear eligible based on your profile.',
  'passing marks': 'For this scholarship, you need a minimum of 60% in your most recent examination. Your current academic profile meets this requirement.',
  'documents required': 'For the National Student Scholarship, you need: (1) Income certificate, (2) Academic marksheets, (3) Aadhaar card, (4) Bank passbook details.',
  'deadline': 'The application deadline for the National Student Scholarship is August 30, 2026. You still have time to complete the remaining steps.',
  'driving licence': 'To get a driving licence, you need to: (1) Apply for a learner\'s licence first, (2) Wait 30 days, (3) Apply for a permanent licence, (4) Pass the driving test.',
  'passport': 'Your passport application is currently in the police verification stage. This usually takes 1-2 weeks. You can track the status in your Applications section.',
  'eligible': 'Based on your profile as a B.Tech student with a family income below ₹6,00,000, you appear eligible for several scholarships. Check the Benefits section for personalized recommendations.',
  'default': 'I can help you understand government services, explain terminology, guide you through applications, and answer questions about your current task. What would you like to know?',
}

export function getAiGuideResponse(query, context) {
  const q = query.toLowerCase().trim()
  
  // Check for exact matches first
  for (const [key, response] of Object.entries(aiGuideResponses)) {
    if (q.includes(key)) {
      return response
    }
  }
  
  // Context-aware responses
  if (context?.page === 'tasks') {
    return 'You can tap on any task to see its details and complete the required steps. Tasks with deadlines are highlighted in red.'
  }
  if (context?.page === 'applications') {
    return 'The timeline shows each stage of your application. Green checkmarks indicate completed steps, the blue dot shows your current stage, and gray circles are upcoming steps.'
  }
  if (context?.page === 'benefits') {
    return 'The Benefits Finder shows schemes you may qualify for based on your profile. Higher match scores mean better eligibility. You can ask for more specific results in natural language.'
  }
  if (context?.page === 'inbox') {
    return 'Your inbox shows actionable notifications. Red items need your attention, yellow items are updates, and blue items are appointments.'
  }
  if (context?.highlightedText) {
    return `"${context.highlightedText}" — This term refers to a document or process in the application. Would you like me to explain it in more detail?`
  }
  
  return aiGuideResponses.default
}
