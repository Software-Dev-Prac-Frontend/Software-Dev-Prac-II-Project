"use client"

import { Drawer, Box, List, ListItem, ListItemText } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';

interface DrawerMenuProps {
  open: boolean;
  toggleDrawer: () => void;
}

export default function DrawerMenu({ open, toggleDrawer }: DrawerMenuProps) {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleSignOut = () => {
        logout();
        toggleDrawer();
    };

    // Define menu items based on user role
    const getMenuItems = () => {
        const menuItems = [
            { label: "Home", path: "/", visible: true },
        ];

        if (user?.role === "admin") {
            menuItems.push(
                { label: "Account Management", path: "/account-management", visible: true },
                { label: "Event Management", path: "/event-management", visible: true },
                { label: "Reservation Management", path: "/reservation-management", visible: true }
            );
        } else if (user?.role === "member") {
            menuItems.push(
                { label: "My Reservation", path: "/myreservation", visible: true },
                { label: "Reservation", path: "/reservation", visible: true }
            );
        }

        return menuItems;
    };

    const menuItems = getMenuItems();

    return(
    <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 250, height: "100%", display: "flex", flexDirection: "column", marginTop: 4}} role="presentation" onClick={toggleDrawer} onKeyDown={toggleDrawer}>
            <List>
                {menuItems.map((item, index) => (
                    <ListItem key={index} component="button" onClick={() => router.push(item.path)} sx={{cursor:"pointer"}}>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
            </List>
            <List sx={{ marginTop: "auto" }}>
                {!user ?
                    <ListItem component="button" onClick={() => router.push("/login")} sx={{cursor:"pointer"}}>
                        <ListItemText primary="Sign In" />
                    </ListItem>
                    :
                    <ListItem component="button" onClick={handleSignOut} sx={{cursor:"pointer"}}>
                        <ListItemText primary="Sign Out" />
                    </ListItem>
                }
            </List>
        </Box>
    </Drawer>);
}