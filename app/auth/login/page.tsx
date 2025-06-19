'use client'

import { LoginForm } from '@/components/login-form'
import PageHeader from '@/components/shared/PageHeader'
import { User, FileText, Calendar } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Login Orang tua"
        description="Akses informasi perkembangan anak Anda"
        background="bg-accent/20"
      />

      <section className="flex justify-center bg-background">
        <div className='container mx-auto px-4'>
          <div className=' max-w-4xl mx-auto'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              <LoginForm className="w-full max-w-md" />
              
              <div className='bg-highlight/10 rounded-xl p-6'>
                <h3 className='text-xl font-bold mb-4'>Portal Orang Tua</h3>
                <p className='text-muted-foreground mb-6'>
                  Portal Orang Tua TK ABA Mertosanan memberikan akses untuk memantau perkembangan anak Anda.
                  Dapatkan informasi terbaru mengenai aktifitas sekolah, laporan perkembangan, dan hasil karya anak.
                </p>
                
                <div className='space-y-4'>
                  <div className='flex items-start bg-white p-4 rounded-lg'>
                    <div className='bg-primary/20 p-2 rounded-full mr-3'>
                      <User className='h-5 w-5 text-primary-foreground' />
                    </div>
                    <div>
                      <h4 className='font-semibold'>Laporan Perkembangan</h4>
                      <p className='text-sm text-muted-foreground'>
                        Akses laporan perkembangan anak Anda secara berkala.
                      </p>
                    </div>
                  </div>
                  
                  <div className='flex items-start bg-white p-4 rounded-lg'>
                    <div className='bg-accent/20 p-2 rounded-full mr-3'>
                      <FileText className='h-5 w-5 text-accent-foreground' />
                    </div>
                    <div>
                      <h4 className='font-semibold'>Hasil Karya</h4>
                      <p className='text-sm text-muted-foreground'>
                        Lihat dan unduh hasil karya anak di sekolah.
                      </p>
                    </div>
                  </div>
                  
                  <div className='flex items-start bg-white p-4 rounded-lg'>
                    <div className='bg-attention/20 p-2 rounded-full mr-3'>
                      <Calendar className='h-5 w-5 text-accent-foreground' />
                    </div>
                    <div>
                      <h4 className='font-semibold'>Jadwal &amp; Kegiatan </h4>
                      <p className='text-sm text-muted-foreground'>
                        Informasi jadwal kegiatan dan acara sekolah.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
