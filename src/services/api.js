export const guests = [
  { id: 1, name: 'John Smith', email: 'john@email.com', phone: '+1 555-0101', room: '101', checkIn: '2026-06-15', checkOut: '2026-06-20', status: 'Checked In' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1 555-0102', room: '205', checkIn: '2026-06-16', checkOut: '2026-06-18', status: 'Reserved' },
  { id: 3, name: 'Michael Brown', email: 'mike@email.com', phone: '+1 555-0103', room: '312', checkIn: '2026-06-14', checkOut: '2026-06-17', status: 'Checked Out' },
  { id: 4, name: 'Emily Davis', email: 'emily@email.com', phone: '+1 555-0104', room: '108', checkIn: '2026-06-17', checkOut: '2026-06-22', status: 'Checked In' },
]

export const staff = [
  { id: 1, name: 'Robert Wilson', role: 'Manager', department: 'Front Desk', email: 'robert@hotel.com', phone: '+1 555-0201', status: 'Active' },
  { id: 2, name: 'Lisa Anderson', role: 'Receptionist', department: 'Front Desk', email: 'lisa@hotel.com', phone: '+1 555-0202', status: 'Active' },
  { id: 3, name: 'David Martinez', role: 'Housekeeping', department: 'Housekeeping', email: 'david@hotel.com', phone: '+1 555-0203', status: 'Active' },
  { id: 4, name: 'Jennifer Lee', role: 'Chef', department: 'Kitchen', email: 'jennifer@hotel.com', phone: '+1 555-0204', status: 'On Leave' },
]

export const rooms = [
  { id: 1, number: '101', type: 'Standard', floor: 1, price: 120, status: 'Not Available', capacity: 2 },
  { id: 2, number: '205', type: 'Deluxe', floor: 2, price: 180, status: 'Not Available', capacity: 2 },
  { id: 3, number: '312', type: 'Suite', floor: 3, price: 350, status: 'Available', capacity: 4 },
  { id: 4, number: '108', type: 'Standard', floor: 1, price: 120, status: 'Not Available', capacity: 2 },
  { id: 5, number: '401', type: 'Presidential', floor: 4, price: 800, status: 'Available', capacity: 6 },
  { id: 6, number: '210', type: 'Deluxe', floor: 2, price: 180, status: 'Not Available', capacity: 2 },
]

export const bookings = [
  { id: 1, guest: 'John Smith', room: '101', checkIn: '2026-06-15', checkOut: '2026-06-20', guests: 2, status: 'Active' },
  { id: 2, guest: 'Sarah Johnson', room: '205', checkIn: '2026-06-16', checkOut: '2026-06-18', guests: 1, status: 'Upcoming' },
  { id: 3, guest: 'Emily Davis', room: '108', checkIn: '2026-06-17', checkOut: '2026-06-22', guests: 3, status: 'Active' },
  { id: 4, guest: 'Michael Brown', room: '312', checkIn: '2026-06-14', checkOut: '2026-06-17', guests: 2, status: 'Completed' },
]

export const billing = [
  { id: 1, guest: 'John Smith', room: '101', amount: 600, paid: 600, method: 'Online', date: '2026-06-15', status: 'Paid' },
  { id: 2, guest: 'Sarah Johnson', room: '205', amount: 360, paid: 180, method: 'Cash', date: '2026-06-16', status: 'Partial' },
  { id: 3, guest: 'Emily Davis', room: '108', amount: 600, paid: 0, method: '-', date: '2026-06-17', status: 'Pending' },
  { id: 4, guest: 'Michael Brown', room: '312', amount: 1050, paid: 1050, method: 'Online', date: '2026-06-14', status: 'Paid' },
]

export const dashboardStats = {
  totalGuests: 48,
  activeBookings: 12,
  availableRooms: 18,
  totalRevenue: 24580,
  occupancyRate: 72,
  staffOnDuty: 14,
}

export async function fetchGuests() {
  return Promise.resolve(guests)
}

export async function fetchStaff() {
  return Promise.resolve(staff)
}

export async function fetchRooms() {
  return Promise.resolve(rooms)
}

export async function fetchBookings() {
  return Promise.resolve(bookings)
}

export async function fetchBilling() {
  return Promise.resolve(billing)
}

export async function fetchDashboardStats() {
  return Promise.resolve(dashboardStats)
}
