'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useFruit } from '@/composables/useFruit'

export default function FruitDetailClientPage() {
  const params = useParams()
  const { getFruitById } = useFruit()
  const [fruit, setFruit] = useState<any>(null)

  useEffect(() => {
    if (!params?.id) return
    getFruitById(Number(params.id))
      .then(setFruit)
      .catch(console.error)
  }, [params])

  if (!fruit) return <p>Loading...</p>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">{fruit.name}</h1>
      <p><strong>Family:</strong> {fruit.family}</p>
      <p><strong>Genus:</strong> {fruit.genus}</p>
      <p><strong>Carbs:</strong> {fruit.nutritions.carbohydrates}</p>
    </div>
  )
}
