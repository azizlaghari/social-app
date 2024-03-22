import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl } from 'react-leaflet'
import { Modal, Button, Upload, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import L from 'leaflet'
import defaultProfilePicUrl from '../../assets/logo.png'
import { imageBaseUrl } from '../../config/constants'

const LocationModal = ({ isOpen, onRequestClose, onLocationChange, onOk }) => {
  const [position, setPosition] = useState([51.505, -0.09])
  const user = useSelector((state) => state.auth.user)
  const [mapKey, setMapKey] = useState(0)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setPosition([latitude, longitude])
          onLocationChange([latitude, longitude])
        },
        (error) => {
          console.error(error)
        },
      )
    }
  }, [isOpen])

  const handleMapClick = (e) => {
    setPosition([e.latlng.lat, e.latlng.lng])
    onLocationChange([e.latlng.lat, e.latlng.lng])
  }
  const influencerIcon = (profileImage) => {
    const imageUrl = profileImage ? `${imageBaseUrl}/${profileImage}` : defaultProfilePicUrl // Set your default image path here

    return L.divIcon({
      className: 'custom-marker',
      html: `<img src="${imageUrl}" alt="Profile" style="width: 60px; height: 60px; border-radius: 50%;border: 4px solid #3388ff;">`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    })
  }
  const LocationMarker = () => {
    useMapEvents({
      dblclick: (e) => {
        const map = e.target
        const zoom = map.getZoom() + 1
        map.flyTo(e.latlng, zoom)
      },
    })

    return position === null ? null : (
      <Marker
        position={position}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            setPosition(e.target.getLatLng())
            onLocationChange([e.target.getLatLng().lat, e.target.getLatLng().lng])
          },
        }}
        icon={influencerIcon(user?.user?.photo)}
      />
    )
  }
  useEffect(() => {
    if (isOpen) {
      setMapKey((prevKey) => prevKey + 1)
    }
  }, [isOpen])
  const handleOk = () => {
    onOk()
    setMapKey(0)
  }

  const handleCancel = () => {
    onRequestClose()
    setMapKey(0)
  }
  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      afterClose={() => setMapKey(0)}
      title='Location'
      onOk={handleOk}
      okText='Save'
      className='custom-modal'
      width={'70%'}
    >
      <MapContainer
        zoomControl={false}
        key={mapKey}
        center={position}
        zoom={10}
        style={{ height: 480, width: '100%' }}
        minZoom={3}
        doubleClickZoom={true}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
        <ZoomControl position='bottomright' />
      </MapContainer>
    </Modal>
  )
}

export default LocationModal
