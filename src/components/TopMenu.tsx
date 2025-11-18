"use client";

import { useState } from "react";
import { 
    Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText 
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DrawerMenu from "./DrawerMenu";

export default function TopMenu() {
    const [open, setOpen] = useState(false);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
    <>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: "white", color: "black" }}>
                <Toolbar>
                <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer}
                    >
                    <MenuIcon />
                    </IconButton>
                    </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Box>Logo</Box>
                </Toolbar>
            </AppBar>
        </Box>
    <DrawerMenu open={open} toggleDrawer={toggleDrawer} />
    </>
    );
}
