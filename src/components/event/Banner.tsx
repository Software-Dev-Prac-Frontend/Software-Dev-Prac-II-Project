"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";

const covers = [
    "/img/cover.jpg",
    "/img/cover2.png",
];

export default function Banner() {
    const [coverIndex, setCoverIndex] = useState(0);
    const router = useRouter();

    const handleBannerClick = () => {
        setCoverIndex((prev) => (prev + 1) % covers.length);
    };

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                height: "550px",
                overflow: "hidden",
            }}
        >
            <Image
                src={covers[coverIndex]}
                alt="Banner Image"
                fill
                style={{ objectFit: "cover", cursor: "pointer" }}
                onClick={handleBannerClick}
            />
            <Box
                sx={{
                    position: "absolute",
                    top: 250,
                    left: 0,
                    width: "100%",
                    zIndex: 20,
                    background: "linear-gradient(to right, rgba(0,0,0,0.6), transparent)",
                    textAlign: "center",
                    px: 2,
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        color: "white",
                        fontWeight: 600,
                        fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                    }}
                >
                    where every event finds its venue
                </Typography>

                <Typography
                    sx={{
                        color: "rgba(255,255,255,0.8)",
                        mt: 1,
                    }}
                >
                    Find and book the perfect space for your next event.
                </Typography>
            </Box>
        </Box>
    );
}