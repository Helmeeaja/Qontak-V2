import { useState, useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const location = useLocation();
  const isSettings = location.pathname.startsWith("/settings");

  // State untuk mendeteksi tema
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem("app_theme") || "light";
  });

  // Dengarkan perubahan tema dari TopBar
  useEffect(() => {
    const handleThemeChange = () => {
      setThemeMode(localStorage.getItem("app_theme") || "light");
    };
    window.addEventListener("themeChanged", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);

    return () => {
      window.removeEventListener("themeChanged", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  // Warna dinamis
  const isDark = themeMode === "dark";
  const bgColor = isDark ? "#121212" : "white";
  const textColor = isDark ? "#F3F4F6" : "inherit";

  
  const scrollbarCss = {
    "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
      width: "12px",
      height: "12px",
    },
    "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
      background: isDark ? "#121212" : "#ffffff",
    },
    "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
      background: isDark ? "#634f27" : "#cbd5e1",
      borderRadius: "8px",
      border: `3px solid ${isDark ? "#121212" : "#ffffff"}`,
    },
    "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
      background: isDark ? "#E5B85C" : "#94a3b8",
    },
  };

  return (
    <Flex
      h="100vh"
      bg={bgColor}
      color={textColor}
      overflow="hidden"
      transition="background 0.3s ease, color 0.3s ease"
      css={scrollbarCss}
    >
      {!isFullscreen && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      <Flex flex={1} flexDirection="column" minW={0}>
        {!isFullscreen && (
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
        )}
        <Box
          flex={1}
          p={isFullscreen || isSettings ? 0 : { base: 4, md: 6 }}
          overflow={isSettings ? "hidden" : "auto"}
        >
          <Outlet context={{ isFullscreen, setIsFullscreen, toggleFullscreen }} />
        </Box>
      </Flex>
    </Flex>
  );
}