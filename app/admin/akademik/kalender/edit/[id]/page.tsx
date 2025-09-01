'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Save, ArrowLeft } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  category: string
  location?: string
}

interface EditKalenderPageProps {
  params: {
    id: string
  }
}

export default function EditKalenderPage({ params }: EditKalenderPageProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [event, setEvent] = useState<CalendarEvent>({
    id: '',
    title: '',
    description: '',
    date: '',
    time: '',
    category: '',
    location: ''
  })

  useEffect(() => {
    fetchEvent()
  }, [params.id])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('kalender_akademik')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error

      if (data) {
        setEvent({
          id: data.id,
          title: data.title || '',
          description: data.description || '',
          date: data.date || '',
          time: data.time || '',
          category: data.category || '',
          location: data.location || ''
        })
      }
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const { error } = await supabase
        .from('kalender_akademik')
        .update({
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          category: event.category,
          location: event.location,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)

      if (error) throw error

      router.push('/admin/akademik/kalender')
    } catch (error) {
      console.error('Error updating event:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof CalendarEvent, value: string) => {
    setEvent(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Kalender Akademik</h1>
              <p className="text-gray-600">Ubah informasi acara kalender akademik</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Informasi Acara</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Judul Acara *</Label>
              <Input
                id="title"
                value={event.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Masukkan judul acara"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={event.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Masukkan deskripsi acara"
                rows={4}
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal *</Label>
                <Input
                  id="date"
                  type="date"
                  value={event.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Waktu</Label>
                <Input
                  id="time"
                  type="time"
                  value={event.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <Select
                value={event.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="akademik">Akademik</SelectItem>
                  <SelectItem value="libur">Libur</SelectItem>
                  <SelectItem value="acara-khusus">Acara Khusus</SelectItem>
                  <SelectItem value="ujian">Ujian</SelectItem>
                  <SelectItem value="rapat">Rapat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                value={event.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Masukkan lokasi acara"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6">
              <Button
                onClick={handleSave}
                disabled={saving || !event.title || !event.date || !event.category}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.back()}
                disabled={saving}
              >
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}