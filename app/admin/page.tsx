'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, DollarSign, Clock, CheckCircle, Loader2, Trash2, Edit2, Save, X, Bell, Phone, LogOut, RefreshCw } from 'lucide-react'
import { format, subDays, startOfDay, endOfDay, subMonths } from 'date-fns'
import { DateRange } from 'react-day-picker'

import { supabase } from '@/lib/supabase'
import { Booking, DashboardStats } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DatePickerWithRange } from '@/components/date-range-picker'
import { ServiceManager } from '@/components/service-manager'

// Helper for currency formatting
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export default function AdminDashboard() {
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
    const [realtimeStatus, setRealtimeStatus] = useState<'CONNECTING' | 'SUBSCRIBED' | 'CHANNEL_ERROR' | 'CLOSED'>('CONNECTING')

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editPrice, setEditPrice] = useState<string>('')

    // In-App Notification State
    const [notification, setNotification] = useState<{ visible: boolean; message: string; type: 'info' | 'success' | 'warning' } | null>(null)

    const showInAppNotification = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
        setNotification({ visible: true, message, type })
        setTimeout(() => {
            setNotification(prev => prev?.message === message ? null : prev)
        }, 5000)
    }

    useEffect(() => {
        checkUser()
        if ('Notification' in window) {
            Notification.requestPermission()
        }
    }, [])

    useEffect(() => {
        fetchBookings()
        fetchStats()

        const channel = supabase.channel('bookings-realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'bookings' },
                (payload) => {
                    const newBooking = payload.new as Booking

                    // 1. Play Sound
                    const audio = new Audio('/notification.mp3')
                    audio.play().catch(err => console.log('Audio play blocked:', err))

                    // 2. Show Browser Notification
                    if (Notification.permission === 'granted') {
                        new Notification('Pesanan Baru Masuk!', {
                            body: `${newBooking.customer_name} - ${newBooking.problem_type}`,
                            icon: '/favicon.ico'
                        })
                    }

                    // 3. Show In-App Notification
                    showInAppNotification(`Pesanan Baru: ${newBooking.ticket_id} - ${newBooking.customer_name}`, 'success')

                    fetchBookings()
                    fetchStats()
                }
            )
            .subscribe((status) => {
                console.log('Realtime Status:', status)
                setRealtimeStatus(status as any)
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [dateRange])

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/admin/login')
        }
    }

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
            fetchBookings()
            fetchStats()
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
            fetchBookings()
            fetchStats()
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
            fetchBookings()
            fetchStats()
        } catch (error: any) {
            console.error('Delete error', error)
            alert('Gagal menghapus data')
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    const handleTestNotification = () => {
        // Implementation for test notification button
        showInAppNotification('Test notifikasi berhasil', 'info')
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
            {/* Notification Banner */}
            {notification && notification.visible && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${notification.type === 'success' ? 'bg-green-600 text-white' :
                        notification.type === 'warning' ? 'bg-yellow-500 text-white' :
                            'bg-blue-600 text-white'
                    }`}>
                    <Bell className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="ml-2 opacity-80 hover:opacity-100">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                            Dashboard Admin
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Kelola pesanan dan statistik bisnis
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${realtimeStatus === 'SUBSCRIBED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                            <div className={`w-2 h-2 rounded-full ${realtimeStatus === 'SUBSCRIBED' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                            {realtimeStatus === 'SUBSCRIBED' ? 'Live' : 'Connecting...'}
                        </div>
                        <Button variant="outline" size="sm" onClick={handleTestNotification}>
                            <Bell className="h-4 w-4 mr-2" />
                            Tes Notif
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Keluar
                        </Button>
                    </div>
                </div>

                <div className="mb-8">
                    <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                </div>

                <Tabs defaultValue="bookings" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                        <TabsTrigger value="bookings">Pesanan</TabsTrigger>
                        <TabsTrigger value="services">Kelola Layanan</TabsTrigger>
                    </TabsList>

                    <TabsContent value="bookings" className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                        {/* Booking List */}
                        <Card className="overflow-hidden border-0 shadow-md">
                            <CardHeader className="bg-muted/30 pb-4">
                                <CardTitle>Daftar Booking</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {bookings.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <div className="mb-2 text-2xl">📭</div>
                                        Tidak ada booking pada periode ini
                                    </div>
                                ) : (
                                    <div className="space-y-4 p-4 md:space-y-0 md:p-0">
                                        {/* Mobile View / Desktop Mixed */}
                                        {bookings.map((booking) => (
                                            <div key={booking.id} className="bg-white border rounded-lg shadow-sm overflow-hidden md:border-b md:rounded-none md:shadow-none md:last:border-0 hover:bg-gray-50/50 transition-colors">
                                                <div className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center">

                                                    {/* ID & Date */}
                                                    <div className="flex justify-between md:col-span-2 md:block">
                                                        <div className="font-mono font-bold text-blue-600">{booking.ticket_id}</div>
                                                        <div className="text-xs text-muted-foreground md:mt-1">
                                                            {format(new Date(booking.created_at), 'dd MMM HH:mm')}
                                                        </div>
                                                    </div>

                                                    {/* Customer Info */}
                                                    <div className="mt-2 md:mt-0 md:col-span-3">
                                                        <div className="font-medium text-gray-900">{booking.customer_name}</div>
                                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Phone className="h-3 w-3" /> {booking.phone_number}
                                                        </div>
                                                    </div>

                                                    {/* Problem & Location */}
                                                    <div className="mt-2 md:mt-0 md:col-span-3">
                                                        <div className="text-sm font-medium text-gray-800">{booking.problem_type}</div>
                                                        <div className="text-xs text-muted-foreground truncate" title={booking.location}>
                                                            {booking.location}
                                                        </div>
                                                    </div>

                                                    {/* Status & Price & Actions */}
                                                    <div className="mt-4 pt-4 border-t md:mt-0 md:pt-0 md:border-t-0 md:col-span-4 flex flex-col md:flex-row items-start md:items-center gap-3 justify-end">

                                                        {/* Status Update */}
                                                        <select
                                                            value={booking.status}
                                                            onChange={(e) => updateBookingStatus(booking.id, e.target.value as Booking['status'])}
                                                            className="text-xs h-9 bg-white shadow-sm border rounded-md px-2 w-full md:w-auto"
                                                        >
                                                            <option value="pending">⏳ Menunggu</option>
                                                            <option value="on_the_way">🚀 Perjalanan</option>
                                                            <option value="completed">✅ Selesai</option>
                                                        </select>

                                                        {/* Price Edit */}
                                                        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-2">
                                                            {editingId === booking.id ? (
                                                                <div className="flex items-center gap-1">
                                                                    <Input
                                                                        type="number"
                                                                        value={editPrice}
                                                                        onChange={(e) => setEditPrice(e.target.value)}
                                                                        className="h-8 w-24 px-2 text-right text-xs"
                                                                        autoFocus
                                                                    />
                                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => savePrice(booking.id)}>
                                                                        <Save className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={cancelEditing}>
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className="font-semibold text-sm cursor-pointer hover:text-blue-600 flex items-center gap-1 group"
                                                                    onClick={() => startEditing(booking)}
                                                                >
                                                                    {booking.price ? formatCurrency(booking.price) : '-'}
                                                                    <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                                                                </div>
                                                            )}

                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                onClick={() => deleteBooking(booking.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="services">
                        <Card>
                            <CardContent className="p-6">
                                <ServiceManager />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
