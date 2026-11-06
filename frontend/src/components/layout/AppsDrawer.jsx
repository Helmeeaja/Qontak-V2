import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Box, HStack, VStack, Text } from "@chakra-ui/react";
import { X } from "@phosphor-icons/react";

const MY_APPS = [
  {
    name: "Mekari Jurnal",
    desc: "Integrated online accounting software",
    icon: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11.9976 1C14.5276 1 16.485 2.79041 17.2408 5.29699L21.7988 19.1196C22.2604 20.476 21.933 21.9433 20.7617 22.6549C19.5905 23.3665 18.2375 22.9219 17.3331 21.831L11.9976 15.4295L6.66209 21.831C5.75193 22.9219 4.40471 23.3665 3.23346 22.6549C2.06078 21.9433 1.74633 20.4669 2.19637 19.1196L6.77316 5.21961C7.55207 2.77069 9.49356 1 11.9976 1Z"
          fill="#40C3FF"
        />
      </svg>
    ),
    href: "#",
  },
];

const OTHER_APPS = [
  {
    name: "Talenta by Mekari",
    desc: "Advanced payroll automation & HR solution",
    icon: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4.88041 21.7974L18.703 17.2408C21.2096 16.485 23 14.5276 23 11.9976C23 9.49356 21.2293 7.55207 18.7804 6.77316L4.88041 2.19637C3.53305 1.74633 2.05672 2.06078 1.34511 3.23346C0.633493 4.40471 1.07806 5.75193 2.169 6.66209L8.57048 11.9976L2.169 17.3331C1.07806 18.2375 0.633493 19.5905 1.34511 20.7617C2.05672 21.933 3.52395 22.2604 4.88041 21.7988V21.7974Z"
          fill="#F22929"
        />
      </svg>
    ),
    href: "#",
  },
  {
    name: "Klikpajak by Mekari",
    desc: "Simple tax management platform",
    icon: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="#00A9E0" strokeWidth="1.8" />
        <path d="M8 8h8M8 12h8M8 16h5" stroke="#00A9E0" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    href: "#",
  },
  {
    name: "Qontak by Mekari",
    desc: "Complete CRM software",
    icon: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21 11.5a8.5 8.5 0 1 1-4.2-7.35"
          stroke="#6C5CE7"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="3" stroke="#6C5CE7" strokeWidth="1.8" />
        <path d="M19 3l2 2-2 2" stroke="#6C5CE7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    href: "#",
  },
  {
    name: "Mekari Flex",
    desc: "Flexible employee benefits management",
    icon: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="6" width="18" height="13" rx="2.5" stroke="#F5A623" strokeWidth="1.8" />
        <path d="M3 10h18" stroke="#F5A623" strokeWidth="1.8" />
        <path d="M7 6V4.5A1.5 1.5 0 0 1 8.5 3h7A1.5 1.5 0 0 1 17 4.5V6" stroke="#F5A623" strokeWidth="1.8" />
        <circle cx="12" cy="14.5" r="1.6" fill="#F5A623" />
      </svg>
    ),
    href: "#",
  },
  {
    name: "Mekari e-Sign",
    desc: "Digital signature application",
    icon: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3 17c2.5 0 3.5-2 4.5-4S9.5 8 11 8s1.5 2 2.5 2S15 8 16.5 8 18.5 11 21 11"
          stroke="#2ECC71"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path d="M4 20h16" stroke="#2ECC71" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    href: "#",
  },
];

const MORE_APPS = [
  {
    name: "Mekari University",
    desc: "Platform kursus dan sertifikasi profesional",
    icon: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 9l10-5 10 5-10 5L2 9z" stroke="#8E44AD" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" stroke="#8E44AD" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M22 9v5" stroke="#8E44AD" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    href: "#",
  },
  {
    name: "Mekari Hub",
    desc: "Launchpad",
    icon: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="3" stroke="#34495E" strokeWidth="1.8" />
        <circle cx="5" cy="5" r="2" stroke="#34495E" strokeWidth="1.8" />
        <circle cx="19" cy="5" r="2" stroke="#34495E" strokeWidth="1.8" />
        <circle cx="5" cy="19" r="2" stroke="#34495E" strokeWidth="1.8" />
        <circle cx="19" cy="19" r="2" stroke="#34495E" strokeWidth="1.8" />
        <path d="M6.5 6.5l3.5 3.5M17.5 6.5L14 10M6.5 17.5L10 14M17.5 17.5L14 14" stroke="#34495E" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    href: "#",
  },
];

function AppItem({ app }) {
  return (
    <HStack
      as="a"
      href={app.href}
      target="_blank"
      rel="noreferrer"
      align="flex-start"
      gap={4}
      p={2}
      borderRadius="md"
      cursor="pointer"
      transition="background 150ms ease"
      _hover={{ bg: "muted" }}
    >
      <Box
        w="42px" h="42px" flexShrink={0}
        border="1px solid" borderColor="border" borderRadius="md"
        display="flex" alignItems="center" justifyContent="center" bg="white"
      >
        {typeof app.icon === "string" ? (
          <img src={app.icon} alt={app.name} width={24} height={24} style={{ objectFit: "contain" }} />
        ) : (
          app.icon
        )}
      </Box>
      <VStack align="start" gap={0.5}>
        <Text fontSize="sm" fontWeight="semibold">{app.name}</Text>
        <Text fontSize="sm" color="foreground" opacity={0.6} lineHeight="1.6">{app.desc}</Text>
      </VStack>
    </HStack>
  );
}

function Section({ title, apps, divider }) {
  return (
    <Box>
      {divider && <Box borderTop="1px solid" borderColor="border" my={4} />}
      <Text fontSize="sm" mb={3} lineHeight="1.6">{title}</Text>
      <VStack align="stretch" gap={1}>
        {apps.map((a) => <AppItem key={a.name} app={a} />)}
      </VStack>
    </Box>
  );
}

export default function AppsDrawer({ open, onClose, userName }) {
  // Tutup dengan tombol ESC + kunci scroll body saat terbuka
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return createPortal(
    <>
      {/* Overlay (fade) */}
      <Box
        position="fixed" inset={0} bg="blackAlpha.600" zIndex={1000}
        opacity={open ? 1 : 0}
        pointerEvents={open ? "auto" : "none"}
        transition="opacity 300ms ease"
        onClick={onClose}
      />

      {/* Panel kanan (slide) */}
      <Box
        position="fixed" top={0} right={0} h="100vh"
        w={{ base: "100%", sm: "340px" }}
        bg="white" shadow="2xl" zIndex={1001}
        overflowY="auto"
        transform={open ? "translateX(0)" : "translateX(100%)"}
        opacity={open ? 1 : 0}
        visibility={open ? "visible" : "hidden"}
        transition="transform 350ms cubic-bezier(0.22, 1, 0.36, 1), opacity 250ms ease, visibility 350ms"
        willChange="transform"
      >
        <HStack justify="flex-end" p={4} pb={0}>
          <Box cursor="pointer" p={1} borderRadius="md" _hover={{ bg: "muted" }} onClick={onClose}>
            <X size={20} color="#595d67ff" />
          </Box>
        </HStack>

        <Box px={5} pb={8}>
          <Section
            title={`Hi ${userName || "there"}, your apps are listed here.`}
            apps={MY_APPS}
          />
          <Section
            divider
            title="Other apps by Mekari that might suit your business needs."
            apps={OTHER_APPS}
          />
          <Section divider title="More from Mekari." apps={MORE_APPS} />
        </Box>
      </Box>
    </>,
    document.body
  );
}