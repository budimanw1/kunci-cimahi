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
import { Calendar, DollarSign, Clock, CheckCircle, Loader2, Trash2, Edit2, Save, X, Bell, Phone } from 'lucide-react'
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
                setRealtimeStatus(status as any)
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
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
                        {/* Realtime Status Indicator */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border text-xs font-medium shadow-sm whitespace-nowrap">
                            <div className={`w-2 h-2 rounded-full ${realtimeStatus === 'SUBSCRIBED' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                            {realtimeStatus === 'SUBSCRIBED' ? 'Live' : 'Connecting'}
                        </div>

                        <Button variant="outline" size="sm" onClick={handleTestNotification} className="whitespace-nowrap">
                            <Bell className="w-4 h-4 mr-2" />
                            Tes
                        </Button>

                        <div className="w-full md:w-auto">
                            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                        </div>

                        <Button variant="outline" size="icon" onClick={handleLogout} title="Logout">
                            <X className="h-4 w-4" />
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

                {/* Desktop View: Table */}
                <div className="hidden md:block">
                    <Card className="overflow-hidden border-0 shadow-md">
                        <CardHeader className="bg-muted/30 pb-4">
                            <CardTitle>Daftar Booking</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
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

                {/* Mobile View: Cards */}
                <div className="block md:hidden space-y-4 pb-10">
                    <h2 className="text-lg font-semibold mb-4 px-1 flex items-center justify-between">
                        <span>Daftar Booking</span>
                        <span className="text-xs font-normal text-muted-foreground">{bookings.length} Pesanan</span>
                    </h2>

                    {bookings.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground bg-white rounded-xl border border-dashed p-4">
                            <div className="mb-2">📭</div>
                            Tidak ada booking pada periode ini
                        </div>
                    ) : (
                        bookings.map((booking) => (
                            <Card key={booking.id} className="overflow-hidden shadow-sm border-l-4" style={{
                                borderLeftColor: booking.status === 'completed' ? '#22c55e' : booking.status === 'on_the_way' ? '#3b82f6' : '#eab308'
                            }}>
                                <CardContent className="p-4 space-y-4">
                                    {/* Header Card */}
                                    <div className="flex justify-between items-start border-b pb-3 border-dashed">
                                        <div>
                                            <div className="text-xs text-muted-foreground mb-1">ID Tiket</div>
                                            <div className="font-mono text-base font-bold text-gray-900 tracking-wide">{booking.ticket_id}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-muted-foreground mb-1">Tanggal</div>
                                            <div className="text-xs font-medium">
                                                {new Date(booking.created_at).toLocaleString('id-ID', {
                                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-1 gap-3 py-1">
                                        <div className="bg-gray-50 p-2.5 rounded-lg space-y-1">
                                            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Pelanggan</div>
                                            <div className="font-semibold text-sm">{booking.customer_name}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {booking.phone_number}
                                            </div>
                                        </div>

                                        <div className="space-y-3 px-1">
                                            <div>
                                                <div className="text-xs text-muted-foreground mb-0.5">Lokasi</div>
                                                <div className="text-sm leading-snug">{booking.location}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground mb-0.5">Masalah</div>
                                                <div className="text-sm leading-snug font-medium text-gray-800">{booking.problem_type}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions Area */}
                                    <div className="pt-4 border-t bg-gray-50/50 -mx-4 -mb-4 px-4 pb-4 mt-2 space-y-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex-1">
                                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Status</div>
                                                <Select
                                                    value={booking.status}
                                                    onChange={(e) => updateBookingStatus(booking.id, e.target.value as Booking['status'])}
                                                    className="text-xs h-9 w-full bg-white shadow-sm"
                                                >
                                                    <option value="pending">⏳ Menunggu</option>
                                                    <option value="on_the_way">🚀 Perjalanan</option>
                                                    <option value="completed">✅ Selesai</option>
                                                </Select>
                                            </div>

                                            <div className="flex-1">
                                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Harga</div>
                                                {editingId === booking.id ? (
                                                    <div className="flex items-center gap-1 h-9">
                                                        <Input
                                                            type="number"
                                                            value={editPrice}
                                                            onChange={(e) => setEditPrice(e.target.value)}
                                                            className="h-full px-2 text-right bg-white text-sm"
                                                        />
                                                        <Button size="icon" variant="default" className="h-9 w-9 bg-green-600 hover:bg-green-700 shrink-0" onClick={() => savePrice(booking.id)}>
                                                            <Save className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="h-9 w-9 text-red-600 shrink-0" onClick={cancelEditing}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={() => startEditing(booking)}
                                                        className="h-9 flex items-center justify-between px-3 bg-white border rounded-md cursor-pointer hover:border-blue-300 shadow-sm group transition-all"
                                                    >
                                                        <span className="font-bold text-sm text-gray-900">
                                                            {booking.price ? formatCurrency(booking.price) : '-'}
                                                        </span>
                                                        <Edit2 className="h-3 w-3 text-muted-foreground group-hover:text-blue-500" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700 h-9 text-xs"
                                            onClick={() => deleteBooking(booking.id)}
                                        >
                                            <Trash2 className="h-3 w-3 mr-2" />
                                            Hapus Booking
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
