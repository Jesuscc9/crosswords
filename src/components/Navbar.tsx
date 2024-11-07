import React, { useMemo, useState, useContext } from 'react'
import {
  Button,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Stack,
  Tooltip
} from '@mui/material'
import { Link } from 'react-router-dom'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
import Notifications from '@mui/icons-material/Notifications'
import useSession from '../hooks/useSession'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import styled from '@mui/material/styles/styled'
import { KeyboardArrowDown } from '@mui/icons-material'
import useProfile from '../hooks/useProfile'

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  opacity: 0.9,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  })
}))

const pages = [
  {
    title: 'Inicio',
    path: '/app/crosswords'
  },

  {
    title: 'Crear un crucigrama',
    path: '/app/crosswords/new',
    role: ['admin']
  }
]

export const Navbar = () => {
  const { signOut, userRole } = useSession()
  const { profile } = useProfile()

  // const session = supabase.auth.getSession()

  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [anchorElNotifications, setAnchorElNotifications] = useState(null)
  const [anchorElSubmenu, setAnchorElSubmenu] = useState(null) // Para manejar el submenú

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleOpenSubMenu = (event) => {
    setAnchorElSubmenu(event.currentTarget)
  }

  const handleCloseSubMenu = () => {
    setAnchorElSubmenu(null)
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleOpenNotifications = (event) => {
    setAnchorElNotifications(event.currentTarget)
  }

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null)
  }

  const settings = useMemo(
    () => [
      {
        title: 'Cerrar sesión',
        key: 'signOut',
        onClick: signOut
      }
    ],
    [signOut]
  )

  const filteredPages = useMemo(
    () =>
      pages.filter((page) => (page.role ? page.role.includes(userRole) : true)),
    [userRole]
  )

  return (
    <AppBar
      position='static'
      elevation={1}
      sx={{
        zIndex: 1
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size='large'
            aria-label='account of current user'
            aria-controls='menu-appbar'
            aria-haspopup='true'
            onClick={handleOpenNavMenu}
            color='inherit'
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id='menu-appbar'
            anchorEl={anchorElNav}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            {filteredPages.map((page) =>
              page.children ? (
                <MenuItem key={page.title} onClick={handleOpenSubMenu}>
                  <Typography textAlign='center'>{page.title}</Typography>
                  <Menu
                    id='submenu-appbar'
                    anchorEl={anchorElSubmenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    open={Boolean(anchorElSubmenu)}
                    onClose={handleCloseSubMenu}
                  >
                    {page.children.map((child) => (
                      <Link to={child.path} key={child.path}>
                        <MenuItem onClick={handleCloseSubMenu}>
                          <Typography textAlign='center'>
                            {child.title}
                          </Typography>
                        </MenuItem>
                      </Link>
                    ))}
                  </Menu>
                  <KeyboardArrowDown />
                </MenuItem>
              ) : (
                <Link to={page.path} key={page.path}>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign='center'>{page.title}</Typography>
                  </MenuItem>
                </Link>
              )
            )}
          </Menu>
        </Box>
        <img
          width={20}
          height={20}
          style={{
            marginRight: '10px'
          }}
          src='/favicon/favicon.svg'
        />
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {filteredPages.map((page) =>
            page.children ? (
              <div key={page.path}>
                <Button
                  onClick={handleOpenSubMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.title}
                  <KeyboardArrowDown />
                </Button>
                <Menu
                  id='submenu-appbar'
                  anchorEl={anchorElSubmenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  open={Boolean(anchorElSubmenu)}
                  onClose={handleCloseSubMenu}
                >
                  {page.children.map((child) => (
                    <Link to={child.path} key={child.path}>
                      <MenuItem onClick={handleCloseSubMenu}>
                        <Typography textAlign='center'>
                          {child.title}
                        </Typography>
                      </MenuItem>
                    </Link>
                  ))}
                </Menu>
              </div>
            ) : (
              <Link to={page.path} key={page.path}>
                <Button
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  onClick={handleCloseNavMenu}
                >
                  {page.title}
                </Button>
              </Link>
            )
          )}
        </Box>

        <Stack direction='row' alignItems='center' sx={{ flexGrow: 0 }}>
          <IconButton
            color='inherit'
            size='large'
            onClick={handleOpenNotifications}
          >
            <Notifications />
          </IconButton>
          <Menu
            id='menu-appbar'
            anchorEl={anchorElNotifications}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotifications}
          >
            <Box px={4} py={2}>
              <Typography color='info'>No hay notificaciones</Typography>
            </Box>
          </Menu>
          <Tooltip title='Abrir ajustes'>
            <Button color='inherit' size='large' onClick={handleOpenUserMenu}>
              {/* {data?.data.user ? (
                <Typography color='white' className='capitalize mr-2'>
                  {data.data.user.email}
                  <span className={`${data?.last_name ? 'ml-2' : 'm-0'}`}>
                    {data?.last_name}
                  </span>
                </Typography>
              ) : null} */}
              {profile?.username}
              <AccountCircle className='ml-3' />
            </Button>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id='menu-appbar'
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem onClick={setting.onClick} key={setting.title}>
                <Typography color='error'>{setting.title}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
