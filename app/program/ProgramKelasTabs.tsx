// app/program-kurikulum/ProgramKelasTabs.tsx
'use client';

import { useState } from 'react';

type Props = {
    data: {
        kb: string | null | undefined;
        tka: string | null | undefined;
        tkb: string | null | undefined;
    };
};

export default function ProgramKelasTabs({ data }: Props) {
    const [activeTab, setActiveTab] = useState<'kb' | 'tka' | 'tkb'>('kb');

    const tabStyles = {
        base: { padding: '10px 20px', cursor: 'pointer', border: 'none', backgroundColor: 'transparent', borderRadius: '20px' },
        active: { backgroundColor: 'white', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
    };

    const contentMap = {
        kb: data.kb,
        tka: data.tka,
        tkb: data.tkb
    };

    return (
        <div>
            {/* Navigasi Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', backgroundColor: '#e5e7eb', padding: '8px', borderRadius: '25px', marginBottom: '30px' }}>
                <button 
                    style={{...tabStyles.base, ...(activeTab === 'kb' ? tabStyles.active : {})}}
                    onClick={() => setActiveTab('kb')}>
                    Kelompok Bermain
                </button>
                <button 
                    style={{...tabStyles.base, ...(activeTab === 'tka' ? tabStyles.active : {})}}
                    onClick={() => setActiveTab('tka')}>
                    TK A
                </button>
                <button 
                    style={{...tabStyles.base, ...(activeTab === 'tkb' ? tabStyles.active : {})}}
                    onClick={() => setActiveTab('tkb')}>
                    TK B
                </button>
            </div>

            {/* Konten Tab */}
            <div>
                {/* Tampilkan konten berdasarkan tab aktif */}
                <div dangerouslySetInnerHTML={{ __html: contentMap[activeTab] || 'Konten belum tersedia.' }} />
            </div>
        </div>
    );
}