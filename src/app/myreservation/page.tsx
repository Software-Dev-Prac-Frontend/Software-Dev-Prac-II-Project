import { Box, Typography } from "@mui/material";

export default function MyReservationPage(){
    return (
        <Box sx={{display:"flex",flexDirection:"column",p:4}}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: "black",}}>My Reservations</Typography>
        </Box>
    );
}