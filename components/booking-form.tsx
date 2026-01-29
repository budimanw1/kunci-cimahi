'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { generateTicketId, formatWhatsAppNumber, generateWhatsAppMessage, generateCustomerWhatsAppMessage } from '@/lib/utils'
import { BookingFormData } from '@/lib/types'
import { Loader2 } from 'lucide-react'

export function BookingForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<BookingFormData>({
        customer_name: '',
        phone_number: '',
        location: '',
        vehicle_type: 'motor',
        problem_type: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const ticketId = generateTicketId()

            // Insert booking into Supabase
            const { data, error } = await supabase
                .from('bookings')
                .insert([
                    {
                        ticket_id: ticketId,
                        customer_name: formData.customer_name,
                        phone_number: formData.phone_number,
                        location: formData.location,
                        vehicle_type: formData.vehicle_type,
                        problem_type: formData.problem_type,
                        status: 'pending',
                    },
                ])
                .select()
                .single()

            if (error) throw error

            // Send WhatsApp notification to technician
            const technicianNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '62xxxxxxxxxx'
            const technicianMessage = generateWhatsAppMessage({
                ticketId,
                customerName: formData.customer_name,
                location: formData.location,
                vehicleType: formData.vehicle_type,
                problemType: formData.problem_type,
            })

            // Send confirmation to customer
            const customerNumber = formatWhatsAppNumber(formData.phone_number)
            const customerMessage = generateCustomerWhatsAppMessage(ticketId, formData.customer_name)

            // Open WhatsApp for technician notification
            window.open(`https://wa.me/${technicianNumber}?text=${technicianMessage}`, '_blank')

            // Redirect to success page with ticket ID
            router.push(`/booking/success?ticket=${ticketId}`)
        } catch (error) {
            console.error('Error creating booking:', error)
            alert(`Gagal membuat pesanan: ${(error as any).message || (error as any).details || 'Terjadi kesalahan tidak diketahui'}`)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Form Pemesanan Layanan</CardTitle>
                <CardDescription>
                    Isi formulir di bawah ini dan teknisi kami akan segera menghubungi Anda
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="customer_name">Nama Lengkap *</Label>
                        <Input
                            id="customer_name"
                            name="customer_name"
                            placeholder="Masukkan nama Anda"
                            value={formData.customer_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone_number">Nomor WhatsApp *</Label>
                        <Input
                            id="phone_number"
                            name="phone_number"
                            type="tel"
                            placeholder="08xxxxxxxxxx"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Lokasi Lengkap *</Label>
                        <Textarea
                            id="location"
                            name="location"
                            placeholder="Contoh: Jl. Raya Leuwigajah No. 123, Cimahi Selatan"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="vehicle_type">Jenis Kendaraan/Kunci *</Label>
                        <Select
                            value={formData.vehicle_type}
                            onValueChange={(value) =>
                                setFormData({ ...formData, vehicle_type: value as any })
                            }
                        >
                            <SelectTrigger id="vehicle_type">
                                <SelectValue placeholder="Pilih jenis kendaraan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="motor">Motor</SelectItem>
                                <SelectItem value="mobil">Mobil</SelectItem>
                                <SelectItem value="rumah">Rumah</SelectItem>
                                <SelectItem value="lainnya">Lainnya</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="problem_type">Masalah yang Dihadapi *</Label>
                        <Textarea
                            id="problem_type"
                            name="problem_type"
                            placeholder="Contoh: Kunci motor hilang, perlu duplikat kunci"
                            value={formData.problem_type}
                            onChange={handleChange}
                            required
                            rows={3}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="gold"
                        size="lg"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            'Kirim Pesanan'
                        )}
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                        Dengan mengirim formulir ini, Anda akan menerima nomor tiket dan teknisi kami akan
                        menghubungi Anda melalui WhatsApp.
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}
