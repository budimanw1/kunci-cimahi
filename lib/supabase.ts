import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to generate unique ticket ID
export function generateTicketId(): string {
    const prefix = 'KC'
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `${prefix}-${timestamp}-${random}`
}

// Format currency to Indonesian Rupiah
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount)
}

// Format phone number for WhatsApp
export function formatWhatsAppNumber(phone: string): string {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '')

    // If starts with 0, replace with 62
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1)
    }

    // If doesn't start with 62, add it
    if (!cleaned.startsWith('62')) {
        cleaned = '62' + cleaned
    }

    return cleaned
}

// Generate WhatsApp message for booking
export function generateWhatsAppMessage(data: {
    ticketId: string
    customerName: string
    location: string
    vehicleType: string
    problemType: string
}): string {
    return encodeURIComponent(
        `🔑 *BOOKING BARU - KUNCI CIMAHI*\n\n` +
        `📋 Tiket: ${data.ticketId}\n` +
        `👤 Nama: ${data.customerName}\n` +
        `📍 Lokasi: ${data.location}\n` +
        `🚗 Kendaraan: ${data.vehicleType}\n` +
        `⚠️ Masalah: ${data.problemType}\n\n` +
        `Mohon segera ditindaklanjuti. Terima kasih!`
    )
}

// Generate customer confirmation WhatsApp message
export function generateCustomerWhatsAppMessage(ticketId: string, customerName: string): string {
    return encodeURIComponent(
        `Halo ${customerName}! 👋\n\n` +
        `Terima kasih telah memesan layanan KUNCI-CIMAHI.\n\n` +
        `📋 Nomor Tiket Anda: *${ticketId}*\n\n` +
        `Teknisi kami akan segera menghubungi Anda. ⚡\n\n` +
        `Layanan 24/7 - Bundaran Leuwigajah, Cimahi Selatan`
    )
}
