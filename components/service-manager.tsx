'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Service } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, Pencil, Trash2, Loader2, Save } from 'lucide-react'

export function ServiceManager() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingService, setEditingService] = useState<Service | null>(null)
    const [formData, setFormData] = useState<Partial<Service>>({
        title: '',
        description: '',
        price: 0,
        estimated_time: '',
        category: 'motor',
        icon: 'Key',
    })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('title', { ascending: true })

        if (error) {
            console.error('Error fetching services:', error)
            alert('Gagal mengambil data layanan')
        } else {
            setServices(data || [])
        }
        setLoading(false)
    }

    const handleOpenDialog = (service?: Service) => {
        if (service) {
            setEditingService(service)
            setFormData(service)
        } else {
            setEditingService(null)
            setFormData({
                title: '',
                description: '',
                price: 0,
                estimated_time: '',
                category: 'motor',
                icon: 'Key',
            })
        }
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            if (editingService) {
                // Update
                const { error } = await supabase
                    .from('services')
                    .update(formData)
                    .eq('id', editingService.id)

                if (error) throw error
            } else {
                // Create
                const { error } = await supabase
                    .from('services')
                    .insert([formData])

                if (error) throw error
            }

            setIsDialogOpen(false)
            fetchServices()
        } catch (error: any) {
            console.error('Error saving service:', error)
            alert(`Gagal menyimpan: ${error.message}`)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus layanan ini?')) return

        try {
            const { error } = await supabase.from('services').delete().eq('id', id)
            if (error) throw error
            fetchServices()
        } catch (error: any) {
            console.error('Error deleting service:', error)
            alert(`Gagal menghapus: ${error.message}`)
        }
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Daftar Layanan</h2>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> Tambah Layanan
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Layanan</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Harga</TableHead>
                            <TableHead>Estimasi</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service.id}>
                                <TableCell className="font-medium">{service.title}</TableCell>
                                <TableCell className="capitalize">{service.category}</TableCell>
                                <TableCell>Rp {service.price.toLocaleString('id-ID')}</TableCell>
                                <TableCell>{service.estimated_time}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button size="icon" variant="ghost" onClick={() => handleOpenDialog(service)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(service.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Nama Layanan</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Kategori</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val: any) => setFormData({ ...formData, category: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="motor">Motor</SelectItem>
                                    <SelectItem value="mobil">Mobil</SelectItem>
                                    <SelectItem value="rumah">Rumah</SelectItem>
                                    <SelectItem value="brankas">Brankas</SelectItem>
                                    <SelectItem value="lainnya">Lainnya</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="price">Harga (Rp)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="estimated_time">Estimasi Waktu</Label>
                            <Input
                                id="estimated_time"
                                placeholder="Contoh: 15 menit"
                                value={formData.estimated_time}
                                onChange={(e) => setFormData({ ...formData, estimated_time: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
