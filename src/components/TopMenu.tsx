"use client";

import { useEffect, useState } from "react";
import { 
    Box, AppBar, Toolbar, IconButton,
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DrawerMenu from "./DrawerMenu";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function TopMenu() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

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
                {
                    (user) && (
                        <Typography variant="body1" component="div" sx={{ cursor: "default" }}>
                            Welcome, {user.name}
                        </Typography>
                    )
                }
                <img
                    src="/img/logo.png"
                    alt="Logo"
                    width={60}
                    height={60}
                    style={{ objectFit: "contain",cursor:"pointer" }}
                    onClick={()=>{router.push("/")}}
                />
                </Toolbar>
            </AppBar>
        </Box>
    <DrawerMenu open={open} toggleDrawer={toggleDrawer} />
    </>
    );
}
