import { Avatar, Button, Tooltip } from 'antd'
import L from 'leaflet'
import ReactDOM from 'react-dom'
import React, { useEffect, useRef, useState } from 'react'
import { IoChatbubblesOutline } from 'react-icons/io5'
import { MapContainer, Marker, Popup, TileLayer, LayerGroup } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { imageBaseUrl } from '../config/constants'
import Layout from '../layout/Layout'
import { addReview, getALLusers, getReviews } from '../services/Reviews'
import Reviews from '../components/Reviews'
import { getAttachmentsByUserID } from '../services/Attachments'

const Home = () => {
  const mapRef = useRef(null)
  const [influencers, setInfluencers] = useState([])
  const [currentLocation, setCurrentLocation] = useState(null)
  const [reviews, setReviews] = useState([])
  const [selectedInfluencer, setSelectedInfluencer] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const [newReview, setNewReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [photosMedia, setPhotosMedia] = useState([])
  const [videosMedia, setVideosMedia] = useState([])

  const navigate = useNavigate()
  const ref = useRef()

  const handleNavigateToChat = (item) => {
    navigate(`/chat`, {
      state: {
        openChatWith: item,
      },
    })
  }
  const getReview = async (id) => {
    try {
      setLoading(true)
      const getReview = await getReviews(id)
      console.log({ getReview })
      setReviews(getReview)
      setLoading(false)
    } catch (e) {
      console.log({ e })
    }
  }
  const handleAddReview = async (e, id) => {
    e.preventDefault()
    console.log({ id })
    const val = {
      givenTo: id,
      comments: newReview,
      rating: 5,
    }
    try {
      const add = await addReview(val)
      console.log({ add })

      setNewReview('')
      await getReview(id)
    } catch (error) {
      console.error('Error adding review:', error)
    }
  }

  const clearReviews = () => {
    setReviews([])
    setSelectedInfluencer({})
  }
  const handleToggleReviews = async (influencer) => {
    setSelectedInfluencer((prevInfluencer) =>
      prevInfluencer && prevInfluencer.id === influencer.id ? null : influencer,
    )

    ref?.current?.open()
    await getReview(influencer?.id)
    await fetchAttchments(influencer?.id)
  }
  const fetchAttchments = async (id) => {
    try {
      const attachments = await getAttachmentsByUserID(id)
      console.log({ attachments })
      if (attachments) {
        const photoAttachments = attachments.data.filter(
          (attachment) => attachment.type === 'photo',
        )
        console.log('photoAttachments :', photoAttachments)
        setPhotosMedia(photoAttachments)
        const videoAttachments = attachments.data.filter(
          (attachment) => attachment.type === 'video',
        )
        setVideosMedia(videoAttachments)
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
    }
  }
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting current location:', error.message)
        },
      )
    } else {
      console.error('Geolocation is not supported by your browser')
    }
  }
  const currentLocationIcon = new L.Icon({
    iconUrl:
      'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  const influencerIcon = (profileImage) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<img src="${profileImage}" alt="Profile" style="width: 60px; height: 60px; border-radius: 50%;border: 3px solid rgb(18, 38, 71);">`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    })
  }
  const getUsers = async () => {
    try {
      const data = await getALLusers()
      console.log('🚀 ~ file: Home.jsx:138 ~ getUsers ~ data:', data)
      setAllUsers(data)
    } catch (e) {
      console.log({ e })
    }
  }
  const AllUsers = () => {
    const Influencers = allUsers.map((item, i) => ({
      id: item?._id,
      name: item?.name,
      email: item?.email,
      bio: item?.description,
      location: {
        latitude: item?.location.coordinates[1],
        longitude: item?.location.coordinates[0],
      },
      profileImage: item?.photo ? `${imageBaseUrl}/${item?.photo}` : logo,
      reviews: reviews,
    }))

    setInfluencers(Influencers.filter((val) => val?.id !== localStorage.getItem('userId')))
  }

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    AllUsers()
  }, [allUsers, reviews])
  // const addressPoints = [
  //   [-37.8839, 175.3745188667, '571'],
  //   [-37.8869090667, 175.3657417333, '486'],
  //   [-37.8894207167, 175.4015351167, '807'],
  //   [-37.8927369333, 175.4087452333, '899'],
  //   [-37.90585105, 175.4453463833, '1273'],
  //   [-37.9064188833, 175.4441556833, '1258'],
  //   [-37.90584715, 175.4463564333, '1279'],
  //   [-37.9033391333, 175.4244005667, '1078'],
  //   [-37.9061991333, 175.4492620333, '1309'],
  //   [-37.9058955167, 175.4445613167, '1261'],
  //   [-37.88888045, 175.39146475, '734'],
  //   [-37.8950811333, 175.41079175, '928'],
  //   [-37.88909235, 175.3922956333, '740'],
  //   [-37.8889259667, 175.3938591667, '759'],
  //   [-37.8876576333, 175.3859563833, '687'],
  //   [-37.89027155, 175.3973178833, '778'],
  //   [-37.8864473667, 175.3806136833, '631'],
  //   [-37.9000262833, 175.4183242167, '1012'],
  //   [-37.90036495, 175.4189457, '1024']]

  useEffect(() => {
    if (!mapRef.current && influencers.length) {
      const map = L.map('map', { minZoom: 3, zoomControl: false }).setView([-0.09, 51.505], 3)
      mapRef.current = map
      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current)
      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        // 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        // 'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
        // 'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',

        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
      ).addTo(mapRef.current)

      const points = influencers.map((influencer) => [
        influencer?.location?.latitude,
        influencer?.location?.longitude,
      ])
      var heat = new L.heatLayer(points, {
        maxZoom: 9,
        max: 10000000,
        radius: 60,
        blur: 40,
      })
      heat.setOptions({ max: 0.0001 })

      heat.addTo(mapRef.current)
      // L.heatLayer(points).addTo(mapRef.current)

      if (currentLocation) {
        L.marker([currentLocation.latitude, currentLocation.longitude], {
          icon: currentLocationIcon,
        })
          .addTo(mapRef.current)
          .bindPopup('Your Current Location')
      }

      influencers.forEach((influencer, index) => {
        const marker = L.marker([influencer?.location?.latitude, influencer?.location?.longitude], {
          icon: influencerIcon(influencer?.profileImage),
        })

        // Create a popup content as a DOM element
        const popupContent = document.createElement('div')

        // Add your JSX content to the popup element
        ReactDOM.render(
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={influencer?.profileImage ? influencer?.profileImage : logo} />

              <h3 className='name' style={{ paddingLeft: '5px' }}>
                {influencer?.name}
                <Tooltip
                  color='var(--primary)'
                  placement='rightTop'
                  title={`Chat with ${influencer?.name}`}
                >
                  <IoChatbubblesOutline
                    onClick={() => handleNavigateToChat(influencer)}
                    style={{
                      color: 'var(--gray300)',
                      marginLeft: '10px',
                      cursor: 'pointer',
                    }}
                    size={15}
                  />
                </Tooltip>
              </h3>
            </div>

            <div
              style={{
                marginTop: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                justifyContent: 'space-between',
              }}
            >
              <Button
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--textColor)',
                  width: '100%',
                }}
                onClick={() => handleToggleReviews(influencer, influencer?.email, influencer?.bio)}
              >
                Profile
              </Button>
            </div>
          </div>,
          popupContent,
        )

        marker.bindPopup(popupContent)
        marker.addTo(mapRef.current)
      })
    }
  }, [influencers, influencerIcon, currentLocation])
  // useEffect(() => {
  //   if (!mapRef.current && influencers.length) {
  //     const map = L.map('map').setView([-37.87, 175.475], 12)
  //     mapRef.current = map

  //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //       attribution:
  //         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //     }).addTo(mapRef.current)

  //     const points = addressPoints.map((p) => [p[0], p[1]])
  //     L.heatLayer(points).addTo(mapRef.current)

  //     if (currentLocation) {
  //       L.marker([currentLocation.latitude, currentLocation.longitude], {
  //         icon: currentLocationIcon,
  //       })
  //         .addTo(mapRef.current)
  //         .bindPopup('Your Current Location')
  //     }

  //     influencers.forEach((influencer, index) => {
  //       const marker = L.marker([influencer?.location?.latitude, influencer?.location?.longitude], {
  //         icon: influencerIcon(influencer?.profileImage),
  //       })
  //       marker
  //         .bindPopup(
  //           <div>
  //             <div style={{ display: 'flex', alignItems: 'center' }}>
  //               <Avatar src={influencer?.profileImage ? influencer?.profileImage : logo} />

  //               <h3 className='name' style={{ paddingLeft: '5px' }}>
  //                 {influencer?.name}
  //                 <Tooltip
  //                   color='var(--primary)'
  //                   placement='rightTop'
  //                   title={`Chat with ${influencer?.name}`}
  //                 >
  //                   <IoChatbubblesOutline
  //                     onClick={() => handleNavigateToChat(influencer)}
  //                     style={{ color: 'var(--gray300)', marginLeft: '10px', cursor: 'pointer' }}
  //                     size={15}
  //                   />
  //                 </Tooltip>
  //               </h3>
  //             </div>

  //             <div
  //               style={{
  //                 marginTop: 10,
  //                 display: 'flex',
  //                 alignItems: 'center',
  //                 gap: '10px',
  //                 justifyContent: 'space-between',
  //               }}
  //             >
  //               <Button
  //                 style={{
  //                   backgroundColor: 'var(--primary)',
  //                   color: 'var(--textColor)',
  //                   width: '100%',
  //                 }}
  //                 onClick={() =>
  //                   handleToggleReviews(influencer, influencer?.email, influencer?.bio)
  //                 }
  //               >
  //                 Profile
  //               </Button>
  //             </div>
  //           </div>,
  //         )
  //         .addTo(mapRef.current)
  //     })

  //     // Open popups when markers are added to the map

  //     // mapRef.current._layers.forEach((layer)=>{
  //     //        if (layer instanceof L.Marker) {
  //     //     layer.openPopup()
  //     //   }
  //     // })
  //     // .eachLayer((layer) => {
  //     //   if (layer instanceof L.Marker) {
  //     //     layer.openPopup()
  //     //   }
  //     // })
  //   }
  // }, [influencers, influencerIcon, addressPoints, currentLocation])

  return (
    <Layout active={'map'}>
      <section className='map-container'>
        <div
          style={{
            height: '100vh',
            width: '100%',
            backgroundColor: 'transparent',
            borderRadius: '10px',
          }}
        >
          <div id='map' style={{ height: '100vh' }}></div>
        </div>
        <Reviews
          selectedInfluencer={selectedInfluencer}
          _getReviews={getReview}
          reviews={reviews}
          clearReviews={clearReviews}
          photos={photosMedia}
          videos={videosMedia}
          loading={loading}
          ref={ref}
        />
      </section>
    </Layout>
  )
}

export default Home
