// components/LogoutButton.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export default function LogoutButton() {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/') 
    }

    return <Button
        variant="outline"
        onClick={handleSignOut}
        className="rounded-full hover:bg-highlight/80 text-highlight-foreground hover:text-highlight-foreground"
    >Logout</Button>
}