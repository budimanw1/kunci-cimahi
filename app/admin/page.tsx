'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { supabase, formatCurrency } from '@/lib/supabase'
import { Booking, DashboardStats } from '@/lib/types'
import { Calendar, DollarSign, Clock, CheckCircle, Loader2 } from 'lucide-react'

export default function AdminDashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [stats, setStats] = useState<DashboardStats>({
        total_bookings: 0,
        pending_bookings: 0,
        completed_today: 0,
        revenue_today: 0,
        revenue_week: 0,
        revenue_month: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBookings()
        fetchStats()

        // Subscribe to real-time updates
        const subscription = supabase
            .channel('bookings')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
                fetchBookings()
                fetchStats()
            })
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const fetchBookings = async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50)

            if (error) throw error
            setBookings(data || [])
        } catch (error) {
            console.error('Error fetching bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            const { data: allBookings, error } = await supabase
                .from('bookings')
                .select('*')

            if (error) throw error

            const now = new Date()
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

            const completedToday = allBookings?.filter(
                (b) => b.status === 'completed' && new Date(b.created_at) >= today
            ).length || 0

            setStats({
                total_bookings: allBookings?.length || 0,
                pending_bookings: allBookings?.filter((b) => b.status === 'pending').length || 0,
                completed_today: completedToday,
                revenue_today: completedToday * 50000, // Estimated average
                revenue_week: (allBookings?.filter((b) => new Date(b.created_at) >= weekAgo && b.status === 'completed').length || 0) * 50000,
                revenue_month: (allBookings?.filter((b) => new Date(b.created_at) >= monthAgo && b.status === 'completed').length || 0) * 50000,
            })
        } catch (error) {
            console.error('Error fetching stats:', error)
        }
    }

    const updateBookingStatus = async (id: string, status: Booking['status']) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('id', id)

            if (error) throw error
            fetchBookings()
            fetchStats()
        } catch (error) {
            console.error('Error updating booking:', error)
            alert('Gagal mengupdate status')
        }
    }

    const getStatusBadgeVariant = (status: Booking['status']) => {
        switch (status) {
            case 'pending':
                return 'pending'
            case 'on_the_way':
                return 'on_the_way'
            case 'completed':
                return 'completed'
            default:
                return 'default'
        }
    }

    const getStatusLabel = (status: Booking['status']) => {
        switch (status) {
            case 'pending':
                return 'Menunggu'
            case 'on_the_way':
                return 'Perjalanan'
            case 'completed':
                return 'Selesai'
            default:
                return status
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Dashboard Admin</h1>
                    <p className="text-muted-foreground">Kelola pesanan dan lihat statistik layanan</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_bookings}</div>
                            <p className="text-xs text-muted-foreground">Semua waktu</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_bookings}</div>
                            <p className="text-xs text-muted-foreground">Menunggu proses</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Selesai Hari Ini</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completed_today}</div>
                            <p className="text-xs text-muted-foreground">Booking selesai</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pendapatan Bulan Ini</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.revenue_month)}</div>
                            <p className="text-xs text-muted-foreground">Estimasi</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Bookings Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Booking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-semibold text-sm">Tiket ID</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm">Nama</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm">Telepon</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm">Lokasi</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm">Masalah</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8 text-muted-foreground">
                                                Belum ada booking
                                            </td>
                                        </tr>
                                    ) : (
                                        bookings.map((booking) => (
                                            <tr key={booking.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4 font-mono text-sm">{booking.ticket_id}</td>
                                                <td className="py-3 px-4">{booking.customer_name}</td>
                                                <td className="py-3 px-4">{booking.phone_number}</td>
                                                <td className="py-3 px-4 max-w-xs truncate">{booking.location}</td>
                                                <td className="py-3 px-4 max-w-xs truncate">{booking.problem_type}</td>
                                                <td className="py-3 px-4">
                                                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                                                        {getStatusLabel(booking.status)}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Select
                                                        value={booking.status}
                                                        onChange={(e) => updateBookingStatus(booking.id, e.target.value as Booking['status'])}
                                                        className="text-sm h-8"
                                                    >
                                                        <option value="pending">Menunggu</option>
                                                        <option value="on_the_way">Perjalanan</option>
                                                        <option value="completed">Selesai</option>
                                                    </Select>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
