export const useKategori = () => {
  const getAllKategori = async () => {
    const res = await fetch("/api/kategori")
    if (!res.ok) throw new Error("Gagal mengambil data buah")
    return res.json()
  }

  return { getAllKategori }
}
