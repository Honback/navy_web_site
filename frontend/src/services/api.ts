import type { User, UserCreate, RegisterRequest, Instructor, InstructorCreate, Venue, VenueCreate, TrainingRequest, TrainingRequestCreate, RequestStatus, AvailabilityResponse, InstructorSchedule, InstructorScheduleCreate, AssignInstructors } from '../types'

const BASE_URL = '/api'

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `API error: ${res.status}`)
  }
  return res.json()
}

async function fetchVoid(url: string, options?: RequestInit): Promise<void> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `API error: ${res.status}`)
  }
}

export const api = {
  login: (email: string) =>
    fetchJson<User>('/auth/login', { method: 'POST', body: JSON.stringify({ email }) }),
  register: (data: RegisterRequest) =>
    fetchJson<User>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  // Users
  getUsers: () => fetchJson<User[]>('/users'),
  createUser: (data: UserCreate) =>
    fetchJson<User>('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: number, data: UserCreate) =>
    fetchJson<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  approveUser: (id: number) =>
    fetchJson<User>(`/users/${id}/approve`, { method: 'PATCH' }),
  rejectUser: (id: number) =>
    fetchJson<User>(`/users/${id}/reject`, { method: 'PATCH' }),
  deleteUser: (id: number) => fetchVoid(`/users/${id}`, { method: 'DELETE' }),

  // Instructors
  getInstructors: () => fetchJson<Instructor[]>('/instructors'),
  createInstructor: (data: InstructorCreate) =>
    fetchJson<Instructor>('/instructors', { method: 'POST', body: JSON.stringify(data) }),
  updateInstructor: (id: number, data: InstructorCreate) =>
    fetchJson<Instructor>(`/instructors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteInstructor: (id: number) => fetchVoid(`/instructors/${id}`, { method: 'DELETE' }),

  // Instructor Schedules
  getSchedules: (startDate: string, endDate: string) =>
    fetchJson<InstructorSchedule[]>(`/instructor-schedules?startDate=${startDate}&endDate=${endDate}`),
  getSchedulesByInstructor: (instructorId: number, startDate?: string, endDate?: string) => {
    let url = `/instructor-schedules/instructor/${instructorId}`
    if (startDate && endDate) url += `?startDate=${startDate}&endDate=${endDate}`
    return fetchJson<InstructorSchedule[]>(url)
  },
  createSchedule: (data: InstructorScheduleCreate) =>
    fetchJson<InstructorSchedule>('/instructor-schedules', { method: 'POST', body: JSON.stringify(data) }),
  deleteSchedule: (id: number) => fetchVoid(`/instructor-schedules/${id}`, { method: 'DELETE' }),

  // Venues
  getVenues: () => fetchJson<Venue[]>('/venues'),
  createVenue: (data: VenueCreate) =>
    fetchJson<Venue>('/venues', { method: 'POST', body: JSON.stringify(data) }),
  updateVenue: (id: number, data: VenueCreate) =>
    fetchJson<Venue>(`/venues/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVenue: (id: number) => fetchVoid(`/venues/${id}`, { method: 'DELETE' }),

  // Training Requests
  getRequests: (userId?: number) =>
    fetchJson<TrainingRequest[]>(userId ? `/requests?userId=${userId}` : '/requests'),
  createRequest: (data: TrainingRequestCreate) =>
    fetchJson<TrainingRequest>('/requests', { method: 'POST', body: JSON.stringify(data) }),
  updateRequestStatus: (requestId: number, status: RequestStatus) =>
    fetchJson<TrainingRequest>(`/requests/${requestId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  assignInstructors: (requestId: number, data: AssignInstructors) =>
    fetchJson<TrainingRequest>(`/requests/${requestId}/instructors`, { method: 'PATCH', body: JSON.stringify(data) }),
  getAvailability: (date: string) =>
    fetchJson<AvailabilityResponse>(`/requests/availability?date=${date}`),
  updatePlan: (requestId: number, plan: string) =>
    fetchJson<TrainingRequest>(`/requests/${requestId}/plan`, { method: 'PATCH', body: JSON.stringify({ plan }) }),
}
