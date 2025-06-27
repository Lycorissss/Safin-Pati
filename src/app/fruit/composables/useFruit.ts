export const useFruit = () => {
  const getAllFruits = async () => {
    const res = await fetch("/api/fruit/all")
    if (!res.ok) throw new Error("Gagal mengambil data buah")
    return res.json()
  }

  const getFruitById = async (id: number) => {
    const res = await fetch(`/api/fruit/${id}`)
    if (!res.ok) throw new Error("Buah tidak ditemukan")
    return res.json()
  }

  return { getAllFruits, getFruitById }
}
