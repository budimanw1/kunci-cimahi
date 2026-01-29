'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { Booking, DashboardStats } from '@/lib/types'
import { Calendar, DollarSign, Clock, CheckCircle, Loader2, Trash2, Edit2, Save, X, Bell } from 'lucide-react'
import { DatePickerWithRange } from '@/components/date-range-picker'
import { DateRange } from 'react-day-picker'
import { addDays, startOfDay, endOfDay, subDays, subMonths } from 'date-fns'

export default function AdminDashboardPage() {
    const router = useRouter()
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
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 90),
        to: new Date(),
    })

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editPrice, setEditPrice] = useState<string>('')

    const [realtimeStatus, setRealtimeStatus] = useState<'CONNECTING' | 'SUBSCRIBED' | 'CHANNEL_ERROR' | 'CLOSED'>('CONNECTING')

    useEffect(() => {
        checkUser()
        // Request notification permission
        if ('Notification' in window) {
            Notification.requestPermission()
        }
    }, [])

    const handleTestNotification = () => {
        if (!('Notification' in window)) {
            alert('Browser Anda tidak mendukung notifikasi.')
            return
        }

        if (Notification.permission === 'granted') {
            new Notification('Tes Notifikasi Berhasil!', {
                body: 'Sistem notifikasi browser Anda berfungsi dengan baik.',
                icon: '/favicon.ico'
            })
            const audio = new Audio('/notification.mp3')
            audio.play().catch(e => console.log('Audio play failed', e))
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Tes Notifikasi Berhasil!')
                }
            })
        } else {
            alert('Izin notifikasi diblokir. Silakan reset izin di ikon gembok URL browser.')
        }
    }

    useEffect(() => {
        fetchBookings()
        fetchStats()

        // Subscribe to real-time updates
        const subscription = supabase
            .channel('bookings')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
                fetchBookings()
                fetchStats()

                // Show notification for new bookings
                if (payload.eventType === 'INSERT' && Notification.permission === 'granted') {
                    const newBooking = payload.new as Booking
                    new Notification('Pesanan Baru Masuk!', {
                        body: `${newBooking.customer_name} - ${newBooking.problem_type}`,
                        icon: '/favicon.ico'
                    })
                    // Play a subtle sound
                    const audio = new Audio('/notification.mp3') // Placeholder, browser default beep might suffice or need file
                }
            })
            .subscribe((status) => {
                console.log('Realtime Status:', status)
                setRealtimeStatus(status)
            })

        return () => {
            subscription.unsubscribe()
        }
    }, [dateRange]) // Refetch when date range changes

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/admin/login')
        }
    }

    // ... (keep fetchBookings and others same)



    const fetchBookings = async () => {
        try {
            let query = supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false })

            if (dateRange?.from) {
                query = query.gte('created_at', startOfDay(dateRange.from).toISOString())
            }
            if (dateRange?.to) {
                query = query.lte('created_at', endOfDay(dateRange.to).toISOString())
            }

            const { data, error } = await query

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
            const todayStart = startOfDay(now)
            const weekAgo = subDays(now, 7)
            const monthAgo = subMonths(now, 1)

            const completedToday = allBookings?.filter(
                (b) => b.status === 'completed' && new Date(b.created_at) >= todayStart
            ).length || 0

            // Helper to calculate revenue based on price field or default
            const calculateRevenue = (bookings: any[]) => {
                return bookings.reduce((sum, b) => sum + (b.price || (b.status === 'completed' ? 50000 : 0)), 0)
            }

            setStats({
                total_bookings: allBookings?.length || 0,
                pending_bookings: allBookings?.filter((b) => b.status === 'pending').length || 0,
                completed_today: completedToday,
                revenue_today: calculateRevenue(allBookings?.filter((b) => b.status === 'completed' && new Date(b.created_at) >= todayStart) || []),
                revenue_week: calculateRevenue(allBookings?.filter((b) => b.status === 'completed' && new Date(b.created_at) >= weekAgo) || []),
                revenue_month: calculateRevenue(allBookings?.filter((b) => b.status === 'completed' && new Date(b.created_at) >= monthAgo) || []),
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
            // Realtime subscription will handle refresh
        } catch (error) {
            console.error('Error updating booking:', error)
            alert('Gagal mengupdate status')
        }
    }

    const startEditing = (booking: Booking) => {
        setEditingId(booking.id)
        setEditPrice((booking.price || 0).toString())
    }

    const savePrice = async (id: string) => {
        try {
            const price = parseFloat(editPrice)
            if (isNaN(price)) return

            const { error } = await supabase
                .from('bookings')
                .update({ price, updated_at: new Date().toISOString() })
                .eq('id', id)

            if (error) throw error
            setEditingId(null)
            // Realtime subscription will handle refresh
        } catch (error) {
            console.error('Error updating price:', error)
            alert('Gagal mengupdate harga')
        }
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditPrice('')
    }

    const deleteBooking = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus booking ini? Data tidak dapat dikembalikan.')) return

        try {
            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('id', id)

            if (error) throw error
            // Realtime subscription will handle refresh
        } catch (error) {
            console.error('Error deleting booking:', error)
            alert('Gagal menghapus booking')
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

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="py-8 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Dashboard Admin</h1>
                        <p className="text-muted-foreground">Kelola pesanan dan statistik bisnis</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Realtime Status Indicator */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border text-xs font-medium shadow-sm">
                            <div className={`w-2 h-2 rounded-full ${realtimeStatus === 'SUBSCRIBED' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                            {realtimeStatus === 'SUBSCRIBED' ? 'Live Updates On' : 'Connecting...'}
                        </div>

                        <Button variant="outline" size="sm" onClick={handleTestNotification}>
                            <Bell className="w-4 h-4 mr-2" />
                            Tes Notif
                        </Button>

                        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                        <Button variant="outline" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
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
                            <p className="text-xs text-muted-foreground">Total Pemasukan</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Bookings Table */}
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle>Daftar Booking</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="text-left py-3 px-4 font-semibold text-sm">Tiket & Waktu</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm">Pelanggan</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm">Lokasi & Masalah</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm">Harga</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                                Tidak ada booking pada periode ini
                                            </td>
                                        </tr>
                                    ) : (
                                        bookings.map((booking) => (
                                            <tr key={booking.id} className="border-b hover:bg-white/50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="font-mono text-sm font-bold">{booking.ticket_id}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {new Date(booking.created_at).toLocaleString('id-ID', {
                                                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="font-medium">{booking.customer_name}</div>
                                                    <div className="text-sm text-muted-foreground">{booking.phone_number}</div>
                                                </td>
                                                <td className="py-3 px-4 max-w-xs">
                                                    <div className="truncate font-medium" title={booking.location}>{booking.location}</div>
                                                    <div className="truncate text-sm text-muted-foreground" title={booking.problem_type}>{booking.problem_type}</div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Select
                                                        value={booking.status}
                                                        onChange={(e) => updateBookingStatus(booking.id, e.target.value as Booking['status'])}
                                                        className="text-xs h-8 w-[130px] px-2 py-0 cursor-pointer"
                                                    >
                                                        <option value="pending">Menunggu</option>
                                                        <option value="on_the_way">Perjalanan</option>
                                                        <option value="completed">Selesai</option>
                                                    </Select>
                                                </td>
                                                <td className="py-3 px-4 min-w-[140px]">
                                                    {editingId === booking.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <Input
                                                                type="number"
                                                                value={editPrice}
                                                                onChange={(e) => setEditPrice(e.target.value)}
                                                                className="h-8 w-24 text-right"
                                                            />
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => savePrice(booking.id)}>
                                                                <Save className="h-4 w-4" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={cancelEditing}>
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className="font-medium">
                                                                {booking.price ? formatCurrency(booking.price) : '-'}
                                                            </span>
                                                            <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEditing(booking)}>
                                                                <Edit2 className="h-3 w-3 text-muted-foreground" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => deleteBooking(booking.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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
