export type UserStatus = 'PENDING' | 'ACTIVE' | 'REJECTED'

export interface User {
  id: number
  email: string
  name: string
  affiliation: string | null
  phone: string | null
  role: 'USER' | 'ADMIN'
  status: UserStatus
}

export interface UserCreate {
  email: string
  name: string
  affiliation: string
  phone: string
  role: string
}

export interface RegisterRequest {
  email: string
  name: string
  affiliation: string
  phone: string
}

export interface Instructor {
  id: number
  name: string
  rank: string
  specialty: string
  phone: string
  email: string
  affiliation: string
  educationTopic: string
  availableRegion: string
  rating: number
  recommendation: string
  category: string
  notes: string
  career: string | null
  oneLineReview: string | null
  conditions: string | null
  deliveryScore: number | null
  expertiseScore: number | null
  interactionScore: number | null
  timeManagementScore: number | null
  strengths: string | null
  weaknesses: string | null
}

export interface InstructorCreate {
  name: string
  rank: string
  specialty: string
  phone?: string
  email?: string
  affiliation?: string
  educationTopic?: string
  availableRegion?: string
  rating?: number
  recommendation?: string
  category: string
  notes?: string
  career?: string
  oneLineReview?: string
  conditions?: string
  deliveryScore?: number
  expertiseScore?: number
  interactionScore?: number
  timeManagementScore?: number
  strengths?: string
  weaknesses?: string
}

export interface Venue {
  id: number
  name: string
  address: string
  building: string
  roomNumber: string
  capacity: number
  region: string
  lectureCapacity: number
  accommodationCapacity: number
  mealCost: string
  overallRating: string
  notes: string
  website: string | null
  reservationContact: string | null
  summary: string | null
  lectureRooms: string | null
  usageFee: string | null
  bannerSize: string | null
  deskLayout: string | null
  roomStatus: string | null
  roomAmenities: string | null
  personalItems: string | null
  convenienceFacilities: string | null
  restaurantContact: string | null
  reservationRules: string | null
  importantTips: string | null
  subFacilities: string | null
  evaluation: string | null
  surveyImages: string | null
}

export interface VenueCreate {
  name: string
  address?: string
  building?: string
  roomNumber?: string
  capacity: number
  region?: string
  lectureCapacity?: number
  accommodationCapacity?: number
  mealCost?: string
  overallRating?: string
  notes?: string
  website?: string
  reservationContact?: string
  summary?: string
  lectureRooms?: string
  usageFee?: string
  bannerSize?: string
  deskLayout?: string
  roomStatus?: string
  roomAmenities?: string
  personalItems?: string
  convenienceFacilities?: string
  restaurantContact?: string
  reservationRules?: string
  importantTips?: string
  subFacilities?: string
  evaluation?: string
  surveyImages?: string
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'

export interface TrainingRequest {
  id: number
  userId: number
  userName: string
  userEmail: string
  identityInstructorId: number | null
  identityInstructorName: string | null
  identityInstructorRank: string | null
  securityInstructorId: number | null
  securityInstructorName: string | null
  securityInstructorRank: string | null
  communicationInstructorId: number | null
  communicationInstructorName: string | null
  communicationInstructorRank: string | null
  venueId: number
  venueName: string
  venueRoomNumber: string
  secondVenueId: number | null
  secondVenueName: string | null
  secondVenueRoomNumber: string | null
  trainingType: string
  fleet: string
  requestDate: string
  requestEndDate: string | null
  startTime: string | null
  status: RequestStatus
  notes: string | null
  plan: string | null
  createdAt: string
}

export interface AssignInstructors {
  identityInstructorId: number | null
  securityInstructorId: number | null
  communicationInstructorId: number | null
}

export interface TrainingRequestCreate {
  userId: number
  venueId: number
  secondVenueId?: number
  trainingType: string
  fleet: string
  requestDate: string
  requestEndDate?: string
  startTime?: string
  notes?: string
}

export interface AvailabilityResponse {
  bookedInstructorIds: number[]
  bookedVenueIds: number[]
}

export interface InstructorSchedule {
  id: number
  instructorId: number
  instructorName: string
  instructorRank: string
  scheduleDate: string
  endDate: string | null
  description: string
  source: string
  requestId: number | null
  createdAt: string
}

export interface InstructorScheduleCreate {
  instructorId: number
  scheduleDate: string
  endDate?: string
  description: string
}
