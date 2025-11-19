import { Box, Typography } from "@mui/material";
import Image from "next/image";

export default function Banner(){
    return (
        <Box sx={{ position:"relative", overflow: "hidden", width: "100%", height: 500, mb:4}}>
            <Image
                src="/img/cover.jpg"
                alt="Event Banner"
                layout="fill"
                objectFit="cover"
            />
            <Box
                sx={{
                    position: "relative",
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: { xs: "2rem", md: "4rem" },
                    background: "linear-gradient(to right, rgba(0,0,0,0.6), transparent)",
                }}
            >
                <Typography sx={{ color: "white", fontSize: { xs: "1.875rem", sm: "2.25rem" }, fontWeight: 600 }}>
                    Find your next experience.
                </Typography>

                <Typography sx={{ color: "#e5e7eb", mt: 2 }}>
                    Browse upcoming events and book your spot in seconds.
                </Typography>
            </Box>
        </Box>
    );
}