/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#121212", // Fondo principal
        primaryText: "#F5F5F5", // Texto principal
        secondaryText: "#A0A0A0", // Texto secundario
        accent: "#ffb300", // Color de acento (botones, enlaces)
        success: "#28A745", // Colores de éxito
        warning: "#FFC107", // Colores de advertencia
        error: "#DC3545", // Colores de error
        border: "#2C2C2C", // Color de bordes
        cardBackground: "#1F1F1F", // Fondo de tarjetas o contenedores
      },
    },
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
    },
  },
  plugins: [],
};
