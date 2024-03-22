export const fetchAddress = async (latitude, longitude) => {
  // Use OpenStreetMap Nominatim API for reverse geocoding
  const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`

  try {
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (data.address) {
      const formattedAddress = `${data?.address?.state || ''} ${data?.address?.country || ''}`
      return formattedAddress
    }
  } catch (error) {
    console.error('Error fetching address:', error)
  }
}
