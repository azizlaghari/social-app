import { Layout } from 'antd'

// import { MdOutlineDarkMode, MdDarkMode } from 'react-icons/md'
// import { useDispatch, useSelector } from 'react-redux'
// import { toggleTheme } from '../redux'
import MenuDrawer from './MenuDrawer'

const { Content } = Layout

const MobileLayout = ({ active, children }) => {
  // const dispatch = useDispatch()
  // const theme = useSelector((state) => state.theme.theme)

  return (
    <Layout className='m-layout'>
      <div className='mobile-header'>
        <MenuDrawer active={active} />
        {/* <Switch
          style={{ marginRight: 10 }}
          className='themeSwitch'
          defaultChecked={theme === 'light' ? false : true}
          checkedChildren={<MdDarkMode style={{ fontSize: '20px', marginRight: '5px' }} />}
          unCheckedChildren={<MdOutlineDarkMode style={{ fontSize: '20px', marginLeft: '5px' }} />}
          onChange={() => dispatch(toggleTheme())}
        /> */}
      </div>
      <Content className='m-children'>{children}</Content>
    </Layout>
  )
}

export default MobileLayout
