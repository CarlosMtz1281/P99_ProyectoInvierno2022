import { IconButton } from '@mui/material'
import React, { useState } from 'react'
import './App.css'
import Sidebar from './Components/Sidebar/Sidebar.jsx'
import { Box } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';

function App() {
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState('content')
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar open={open} setOpen={setOpen} setContent={setContent} />
            <Box sx={{
                width: 'calc(100%-240px)',
                padding: '15px',
                height: '120vh',
                position: 'relative',
            }}>

                <IconButton sx={{ bgcolor: 'primary.light', height: 'fit-content', borderRadius: 1, display: { xs: 'block', sm: 'none' }, position: 'Fixed', top: '3px' }} onClick={() => setOpen(!open)}>
                    <MenuIcon />
                </IconButton>
                <br />
                <br />
                {content}
            </Box>
        </Box>
    )
}

export default App
