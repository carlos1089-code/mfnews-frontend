import { Box, Container } from "@mui/material";
import { Navbar } from "../components/Navbar.tsx";
import { type ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ flexGrow: 1, mt: 4, mb: 8 }}>
        {children}
      </Container>
    </Box>
  );
};
