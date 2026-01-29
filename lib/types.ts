export interface Booking {
    id: string
    ticket_id: string
    customer_name: string
    phone_number: string
    location: string
    vehicle_type: 'motor' | 'mobil' | 'rumah' | 'lainnya'
    problem_type: string
    status: 'pending' | 'on_the_way' | 'completed'
    price?: number
    created_at: string
    updated_at: string
}

export interface Service {
    id: string
    name: string
    description: string
    price_start: number
    estimated_time: string
    icon: string
    category: 'motor' | 'mobil' | 'rumah'
    created_at: string
}

export interface Testimonial {
    id: string
    customer_name: string
    location: string
    rating: number
    comment: string
    service_type: string
    created_at: string
    is_active: boolean
}

export interface BookingFormData {
    customer_name: string
    phone_number: string
    location: string
    vehicle_type: 'motor' | 'mobil' | 'rumah' | 'lainnya'
    problem_type: string
}

export interface DashboardStats {
    total_bookings: number
    pending_bookings: number
    completed_today: number
    revenue_today: number
    revenue_week: number
    revenue_month: number
}
