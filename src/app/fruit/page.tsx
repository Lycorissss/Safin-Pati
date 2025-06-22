  'use client'

  import { useEffect, useState } from 'react'
  import Link from 'next/link'
  import { useFruit } from '@/composables/useFruit'

  export default function HomePage() {
    const { getAllFruits } = useFruit()
    const [fruits, setFruits] = useState<any[]>([])

    useEffect(() => {
      getAllFruits().then(setFruits).catch(console.error)
    }, [])

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Daftar Buah</h1>
        <ul className="space-y-2">
          {fruits.map((fruit) => (
            <li key={fruit.id}>
              <Link href={`/fruit/${fruit.id}`} className="text-blue-600 hover:underline">
                {fruit.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }
