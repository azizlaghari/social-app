import { Menu } from 'antd'
import { FaGlobeEurope, FaPaperPlane } from 'react-icons/fa'
import { FcEnteringHeavenAlive } from 'react-icons/fc'
import { MdLogout, MdOutlineFeed, MdPersonOutline } from 'react-icons/md'
import { IoChatbubblesOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logosidbar.png'
import { useSelector } from 'react-redux'
import { useState } from 'react'

const MainMenu = ({ active }) => {
  const theme = useSelector((state) => state.theme.theme)
  const navigate = useNavigate()

  return (
    <Menu
      mode={'inline'}
      defaultSelectedKeys={[active]}
      // style={{
      //   background: 'green',
      // }}
    >
      <nav className='navLinks'>
        <div>
          <div className='company-logo'>
            <img
              src={Logo}
              alt='logo'
              style={{ width: 100, cursor: 'pointer' }}
              onClick={() => navigate('/')}
            />
          </div>
          <div
            style={{
              backgroundColor: active === 'map' ? '#324261' : 'transparent',
              borderRadius: '10px',
            }}
          >
            <Menu.Item
              key='map'
              className={'sidebar-menu'}
              icon={
                <FaGlobeEurope
                  style={{ color: active === 'map' ? '#6366f1' : '#fff' }}
                  className='menu-icon'
                />
              }
              onClick={() => navigate('/')}
              style={{
                backgroundColor: 'rgba(99, 102, 241,0.8)',
              }}
            >
              <p>Map</p>
            </Menu.Item>
          </div>
          <div
            style={{
              backgroundColor: active === 'feed' ? '#324261' : 'transparent',
              borderRadius: '10px',
            }}
          >
            <Menu.Item
              key='feed'
              className={'sidebar-menu'}
              icon={
                <MdOutlineFeed
                  style={{ color: active === 'feed' ? '#6366f1' : '#fff' }}
                  className='menu-icon'
                />
              }
              onClick={() => navigate('/feed')}
            >
              <p>Feed</p>
            </Menu.Item>
          </div>

          {/* <Menu.Item
            key='recordVideo'
            // key='video'
            className={'sidebar-menu'}
            icon={<FcEnteringHeavenAlive />}
            onClick={() => navigate('/video')}
          >
            <p style={{ color: active === 'video' ? '#5156be' : '#000' }}>Go Live</p>
          </Menu.Item> */}
          <div
            style={{
              backgroundColor: active === 'chat' ? '#324261' : 'transparent',
              borderRadius: '10px',
            }}
          >
            <Menu.Item
              key='chat'
              className={'sidebar-menu'}
              icon={
                <IoChatbubblesOutline
                  style={{ color: active === 'chat' ? '#6366f1' : '#fff' }}
                  className='menu-icon'
                />
              }
              onClick={() => navigate('/chat')}
              // style={{ backgroundColor: active === 'chat' ? 'red' : 'transparent' }}
            >
              <p>Chat</p>
            </Menu.Item>
          </div>
          {/* <Menu.Item
            key='photo'
            className={'sidebar-menu'}
            icon={<FaPaperPlane color={'var(--lightBorder)'} className='menu-icon' />}
            onClick={() => navigate('/photo-capture')}
            style={{ backgroundColor: active === 'chat' ? 'red' : 'transparent' }}
          >
            <p style={{ color: active === 'chat' ? '#5156be' : '#000' }}>Photo</p>
          </Menu.Item> */}

          <div
            style={{
              backgroundColor: active === 'profile' ? '#324261' : 'transparent',
              borderRadius: '10px',
            }}
          >
            <Menu.Item
              key='profile'
              className={'sidebar-menu'}
              icon={
                <MdPersonOutline style={{ color: active === 'profile' ? '#6366f1' : '#fff' }} />
              }
              onClick={() => navigate('/profile')}
            >
              <p>Profile</p>
            </Menu.Item>
          </div>

          {/* <Menu.Item
        key='videoUpload'
        className={'sidebar-menu'}
        icon={<UploadOutlined />}
        onClick={() => navigate('/videoUpload')}
      >
        Upload Videos
      </Menu.Item> */}
        </div>
        <div
          style={{
            margin: '1rem 0',
            backgroundColor: active === 'logout' ? '#324261' : 'transparent',
            borderRadius: '10px',
          }}
        >
          <Menu.Item
            onClick={() => {
              localStorage.removeItem('token')
              navigate('/login')
            }}
            key='logout'
            className={'sidebar-menu'}
            icon={<MdLogout style={{ color: active === 'logout' ? '#6366f1' : '#fff' }} />}
          >
            Logout
          </Menu.Item>
        </div>
      </nav>
    </Menu>
  )
}

export default MainMenu
