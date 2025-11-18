"use client"

import { Drawer, Box, List, ListItem, ListItemText } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DrawerMenuProps {
  open: boolean;
  toggleDrawer: () => void;
}

export default function DrawerMenu({ open, toggleDrawer }: DrawerMenuProps) {
    const router = useRouter();
    const [login, setLogin] =  useState<boolean>(false);
    return(
    <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 250, height: "100%", display: "flex", flexDirection: "column", marginTop: 4}} role="presentation" onClick={toggleDrawer} onKeyDown={toggleDrawer}>
            <List>
                <ListItem component="button" onClick={() => router.push("/")} sx={{cursor:"pointer"}}>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem component="button" onClick={() => router.push("/myreservation")} sx={{cursor:"pointer"}}>
                    <ListItemText primary="My Reservation" />
                </ListItem>
                <ListItem component="button" onClick={() => router.push("/reservation")} sx={{cursor:"pointer"}}>
                    <ListItemText primary="Reservation" />
                </ListItem>
                <ListItem component="button">
                    <ListItemText primary="Reservation Management" />
                </ListItem>
                <ListItem component="button">
                    <ListItemText primary="Account Management" /> 
                </ListItem>
            </List>
            <List sx={{ marginTop: "auto" }}>
                {(!login ?
                    <ListItem component="button" onClick={() => router.push("/login")} sx={{cursor:"pointer"}}>
                        <ListItemText primary="Sign In" />
                    </ListItem>
                    :
                    <ListItem component="button" sx={{cursor:"pointer"}}>
                        <ListItemText primary="Sign Out" />
                    </ListItem>
                )}
            </List>
        </Box>
    </Drawer>);
}