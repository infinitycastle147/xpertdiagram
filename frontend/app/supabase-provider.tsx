'use client'

import {createClient, SupabaseClient} from '@supabase/supabase-js'
import {useSession} from '@clerk/nextjs'
import {createContext, useContext, useEffect, useState} from 'react'
import { LoadingPage } from '@/components/ui/loading'

type SupabaseContext = {
    supabase: SupabaseClient | null
    isLoaded: boolean
}

const Context = createContext<SupabaseContext>({
    supabase: null,
    isLoaded: false
})

type Props = {
    children: React.ReactNode
}

export default function SupabaseProvider({children}: Props) {
    const {session, isLoaded: sessionLoaded} = useSession()
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        if (!sessionLoaded) return

        if (session) {
            // Only create new client if we don't have one or session changed
            const client = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_KEY!,
                {
                    accessToken: async () => {
                        const token = await session?.getToken();
                        return token || '';
                    }
                }
            );

            setSupabase(client)
        } else {
            setSupabase(null)
        }

        setIsLoaded(true)
    }, [session?.user?.id, sessionLoaded]) // Only re-run when user ID changes, not entire session object

    if (!sessionLoaded || !isLoaded) {
        return <LoadingPage />
    }

    return (
        <Context.Provider value={{supabase, isLoaded}}>
            {children}
        </Context.Provider>
    )
}

export const useSupabase = () => {
    const context = useContext(Context)
    if (context === undefined) {
        throw new Error('useSupabase must be used within a SupabaseProvider')
    }
    return {
        supabase: context.supabase,
        isLoaded: context.isLoaded
    }
}