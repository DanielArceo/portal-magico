"use client"

import { useState, useEffect, useRef } from "react"
import { Calendar, Gift, Heart, Music, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"



// Componente CakeModule interactivo
function CakeModule() {
  const [candlesBlown, setCandlesBlown] = useState<boolean[]>([false, false, false])
  const [wish, setWish] = useState("")
  const [wishMessage, setWishMessage] = useState("")
  const [showSpecialMessage, setShowSpecialMessage] = useState(false)
  const [showBirthdayMessage, setShowBirthdayMessage] = useState(false)

  const blowCandle = async (index: number) => {
    // No permitir apagar la última vela si no se ha escrito un deseo
    const remainingCandles = candlesBlown.filter(candle => !candle).length
    if (remainingCandles === 1 && !wish.trim()) {
      return // No hacer nada si es la última vela y no hay deseo escrito
    }
    
    if (!candlesBlown[index]) {
      const newCandlesBlown = [...candlesBlown]
      newCandlesBlown[index] = true
      setCandlesBlown(newCandlesBlown)
      
      // Si solo queda 1 vela encendida, mostrar el input de deseo
      if (newCandlesBlown.filter(candle => !candle).length === 1) {
        setWishMessage("¡Ahora pide tu deseo! ✨")
      }
      
      // Si todas las velas están sopladas, guardar el deseo y mostrar mensaje final
      if (newCandlesBlown.every(candle => candle)) {
        // Guardar el deseo en localStorage
        const savedWishes = JSON.parse(localStorage.getItem('birthdayWishes') || '[]')
        const newWish = {
          id: Date.now(),
          text: wish,
          date: new Date().toLocaleString(),
          timestamp: Date.now()
        }
        savedWishes.push(newWish)
        localStorage.setItem('birthdayWishes', JSON.stringify(savedWishes))
        
        // Guardar el deseo en archivo
        try {
          const response = await fetch('/api/wishes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              wish: wish,
              date: new Date().toLocaleDateString('es-ES')
            })
          })
          
          if (response.ok) {
            console.log('Deseo guardado en archivo exitosamente')
          } else {
            console.warn('Error al guardar deseo en archivo')
          }
        } catch (error) {
          console.warn('Error al guardar deseo en archivo:', error)
        }
        
        setWishMessage(`¡Tu deseo "${wish}" se hará realidad! ✨`)
        setShowSpecialMessage(true)
      }
    }
  }

  const resetCake = () => {
    setCandlesBlown([false, false, false])
    setWish("")
    setWishMessage("")
    setShowSpecialMessage(false)
    
    // Mostrar mensaje de cumpleaños por 5 segundos
    setShowBirthdayMessage(true)
    setTimeout(() => {
      setShowBirthdayMessage(false)
    }, 5000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="text-center mb-6 sm:mb-8 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3 sm:mb-4">
          🎂 Pastel Mágico
        </h2>
        <p className="text-gray-600 text-base sm:text-lg">
          Sopla las velas y pide un deseo mágico ✨
        </p>
      </div>

      {/* Pastel mejorado y perfectamente centrado - Responsive */}
      <div className="flex justify-center items-center w-full">
        <div className="relative w-[280px] h-[240px] sm:w-[380px] sm:h-[320px] md:w-[450px] md:h-[380px] lg:w-[500px] lg:h-[400px] mt-8 sm:mt-10 md:mt-12">
          {/* Capa base - La más grande (abajo) */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[240px] h-16 sm:w-[320px] sm:h-20 md:w-[380px] md:h-24 lg:w-[420px] lg:h-28 bg-gradient-to-r from-pink-300 to-purple-400 rounded-t-3xl shadow-lg">
            {/* Decoraciones base */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-around px-2 sm:px-3 md:px-4 lg:px-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-3 h-6 sm:w-4 sm:h-8 md:w-5 md:h-10 lg:w-6 lg:h-12 bg-gradient-to-t from-pink-200 to-white rounded-t-full"></div>
              ))}
            </div>
          </div>

          {/* Capa media */}
          <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 lg:bottom-28 left-1/2 transform -translate-x-1/2 w-[180px] h-12 sm:w-[240px] sm:h-16 md:w-[280px] md:h-20 lg:w-[320px] lg:h-24 bg-gradient-to-r from-purple-300 to-pink-400 rounded-t-3xl shadow-lg">
            {/* Decoraciones media */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-around px-2 sm:px-3 md:px-4 lg:px-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-2 h-4 sm:w-3 sm:h-6 md:w-4 md:h-8 lg:w-5 lg:h-10 bg-gradient-to-t from-purple-200 to-white rounded-t-full"></div>
              ))}
            </div>
          </div>

          {/* Capa superior - La más pequeña (arriba) */}
          <div className="absolute bottom-32 sm:bottom-40 md:bottom-48 lg:bottom-56 left-1/2 transform -translate-x-1/2 w-[120px] h-10 sm:w-[160px] sm:h-12 md:w-[200px] md:h-16 lg:w-[240px] lg:h-20 bg-gradient-to-r from-cyan-300 to-pink-400 rounded-t-3xl shadow-lg">
            {/* Velas */}
            <div className="absolute -top-8 sm:-top-10 md:-top-12 lg:-top-16 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 md:gap-4 lg:gap-5">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => blowCandle(index)}
                  className={`relative transition-all duration-500 ${
                    candlesBlown[index] 
                      ? 'opacity-30 scale-75' 
                      : 'hover:scale-110 cursor-pointer active:scale-95'
                  }`}
                  disabled={candlesBlown[index]}
                >
                  {/* Vela */}
                  <div className="w-2.5 h-12 sm:w-3 sm:h-14 md:w-3.5 md:h-16 lg:w-4 lg:h-18 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-full shadow-md">
                    {!candlesBlown[index] && (
                      <>
                        {/* Llama */}
                        <div className="absolute -top-3 sm:-top-4 md:-top-5 lg:-top-6 left-1/2 transform -translate-x-1/2 w-3 h-5 sm:w-3.5 sm:h-6 md:w-4 md:h-7 lg:w-5 lg:h-8 bg-gradient-to-t from-orange-400 to-yellow-200 rounded-full animate-pulse"></div>
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Área de deseos - Responsive */}
      <div className="mt-6 sm:mt-8 text-center px-4">
        {/* Mostrar input solo cuando quede 1 vela encendida */}
        {candlesBlown.filter(candle => !candle).length === 1 && (
          <div className="max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-6">
            <input
              type="text"
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="Escribe tu deseo mágico..."
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-xl sm:rounded-2xl text-base sm:text-lg font-medium text-gray-700 placeholder-gray-500 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            />
            {!wish.trim() && (
              <p className="mt-2 text-xs sm:text-sm text-pink-600 font-medium">
                ✨ Escribe tu deseo antes de apagar la última vela ✨
              </p>
            )}
          </div>
        )}
        
        {/* Primer mensaje - Deseo confirmado */}
        {wishMessage && (
          <div className="mt-4 sm:mt-6 p-6 sm:p-8 bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200 rounded-2xl border-2 border-pink-300 shadow-2xl animate-fadeInUp">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3">✨</div>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                {wishMessage}
              </p>
            </div>
          </div>
        )}

        {/* Segundo mensaje - Mensaje especial */}
        {showSpecialMessage && (
          <div className="mt-4 sm:mt-6 p-6 sm:p-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl border-2 border-purple-300 shadow-2xl animate-fadeInUp" style={{animationDelay: '0.5s'}}>
            <div className="text-center space-y-4">
              <div className="text-3xl sm:text-4xl mb-3">🌠</div>
              <div className="space-y-3">
                <p className="text-base sm:text-lg font-medium text-purple-700 italic">
                  "Pide, sueña, desea... 💭✨"
                </p>
                <p className="text-lg sm:text-xl font-bold text-indigo-700">
                  ¡y verás cómo el universo y yo conspiraremos para hacerlo realidad! 🌌💫
                </p>
                <div className="pt-2">
                  <p className="text-sm sm:text-base font-semibold text-pink-600">
                    Y Recuerda siempre tendrás deseos ilimitados 😎
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Mostrar botón solo cuando todas las velas estén apagadas */}
        {candlesBlown.every(candle => candle) && (
          <button
            onClick={resetCake}
            className="mt-4 sm:mt-6 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 animate-glow-pulse"
          >
            ✨ Volver a pedir un deseo ✨
          </button>
        )}

        {/* Mensaje emergente de cumpleaños */}
        {showBirthdayMessage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeInUp">
            <div className="bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200 p-8 sm:p-10 rounded-3xl border-4 border-pink-300 shadow-2xl text-center max-w-sm mx-4">
              <div className="text-4xl sm:text-5xl mb-4 animate-bounce">
                🎉
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-pink-700 mb-2">
                ¡Feliz cumpleaños!
              </h2>
              <div className="text-3xl sm:text-4xl animate-pulse">
                🎂✨
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  )
}

const BIRTHDAY_DATE = "1995-08-17" // Fecha correcta: 17/08/1995

// Función para crear estrellas fugaces solo en el cliente
const createShootingStars = () => {
  if (typeof window === 'undefined') return;
  const container = document.getElementById('shooting-stars-container');
  if (!container) return;
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const star = document.createElement('div');
      star.className = 'shooting-star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 0.5 + 's';
      star.style.animationDuration = (1 + Math.random() * 1) + 's';
      container.appendChild(star);
      setTimeout(() => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
      }, 4000);
    }, i * 100);
  }
};

// Frases que cambiarán cada 7 segundos
const birthdayPhrases = [
  "¡Bienvenido a los fabulosos 30! Ahora oficialmente eres un adulto 😎",
  "30 años y todavía sin saber qué hacer con tu vida... ¡perfecto! 🤷‍♂️",
  "Los 30 son los nuevos 20, pero con más dinero y menos energía 💸",
  "¡Felicidades! Ya puedes quejarte de tu espalda sin que sea raro 🦴",
  "30 años: La edad perfecta para acostarse a las 9 PM sin pena 😴",
  "¡Tres décadas de pura genialidad en este planeta! 🌍",
  "Ahora puedes decir 'en mis tiempos' sin que se rían de ti 👴",
  "30 años y aún fingiendo que sabes lo que haces... ¡sigue así! 🎭",
  "¡Oficialmente has desbloqueado el nivel 'Adulto Responsable'! 🔓",
  "Los 30: Cuando Netflix y una manta se vuelven tu plan perfecto 📺",
]

// Mensajes divertidos para fecha incorrecta
const funnyErrorMessages = [
  "¡Ups! Esa no es la fecha mágica... ¿Será que te comiste un número? 🍰",
  "Error 404: Regalos no encontrados. ¡Intenta otra vez! 🚨",
  "Esa fecha no está en el calendario de los regalos. ¡Corrige y sigue! 📅",
  "¡Niña traviesa! Esa no es la fecha correcta. ¿O acaso eres una hacker? 👾",
  "¿Seguro que no naciste en el futuro? Porque esa fecha no coincide. 🚀",
  "¡Casi casi! Pero no. ¿Quieres una pista? Pista: revisa el día/mes/año. 🔍",
  "¡Alto ahí! Esa fecha es para otro universo. Prueba de nuevo en este. 🌌",
  "¡Bip-bop! Robot detecta fecha incorrecta. ¡Reintentar? 🤖",
  "Si fueras un pastel, esa fecha no sería tu receta. ¡Inténtalo de nuevo! 🎂",
  "¡Shhh! El confeti se esconde hasta que pongas la fecha correcta. 🎊",
]

// Función mejorada para generar posiciones sin colisiones para TODOS los elementos
const generateAllElementPositions = () => {
  const allPositions: Array<{ x: number; y: number; type: string; size: number }> = []
  const minDistance = 8 // Distancia mínima en porcentaje
  const maxAttempts = 2000 // Más intentos para mejor distribución

  // Definir todos los elementos con sus tamaños
  const elements = [
    // Globos principales
    ...Array(20)
      .fill(0)
      .map((_, i) => ({ type: "balloon", size: 6, id: i })),
    // Mini globos
    ...Array(15)
      .fill(0)
      .map((_, i) => ({ type: "mini-balloon", size: 4, id: i })),
    // Estrellas
    ...Array(35)
      .fill(0)
      .map((_, i) => ({ type: "star", size: 3, id: i })),
    // Corazones
    ...Array(25)
      .fill(0)
      .map((_, i) => ({ type: "heart", size: 3, id: i })),
    // Burbujas
    ...Array(12)
      .fill(0)
      .map((_, i) => ({ type: "bubble", size: 4, id: i })),
  ]

  // Generar posiciones para todos los elementos
  for (const element of elements) {
    let attempts = 0
    let validPosition = false
    let newPosition = { x: 0, y: 0, type: element.type, size: element.size }

    while (!validPosition && attempts < maxAttempts) {
      // Generar posición aleatoria con márgenes
      newPosition = {
        x: 3 + Math.random() * 94, // Margen del 3% en cada lado
        y: 3 + Math.random() * 94,
        type: element.type,
        size: element.size,
      }

      // Verificar colisiones con elementos existentes
      validPosition = allPositions.every((pos) => {
        const distance = Math.sqrt(Math.pow(newPosition.x - pos.x, 2) + Math.pow(newPosition.y - pos.y, 2))
        const requiredDistance = minDistance + (newPosition.size + pos.size) / 2
        return distance >= requiredDistance
      })

      attempts++
    }

    // Si encontramos una posición válida, la agregamos
    if (validPosition) {
      allPositions.push(newPosition)
    } else {
      // Si no encontramos posición después de muchos intentos,
      // colocamos en una posición menos óptima pero visible
      const fallbackPosition = {
        x: 5 + Math.random() * 90,
        y: 5 + Math.random() * 90,
        type: element.type,
        size: element.size,
      }
      allPositions.push(fallbackPosition)
    }
  }

  // Separar por tipos para facilitar el renderizado
  return {
    balloons: allPositions.filter((p) => p.type === "balloon"),
    miniBalloons: allPositions.filter((p) => p.type === "mini-balloon"),
    stars: allPositions.filter((p) => p.type === "star"),
    hearts: allPositions.filter((p) => p.type === "heart"),
    bubbles: allPositions.filter((p) => p.type === "bubble"),
  }
}

// Componente para fondo animado con distribución inteligente
const AnimatedBackground = () => {
  type Position = { x: number; y: number; type: string; size: number }
  type ElementPositions = {
    balloons: Position[];
    miniBalloons: Position[];
    stars: Position[];
    hearts: Position[];
    bubbles: Position[];
  }
  const [elementPositions, setElementPositions] = useState<ElementPositions | null>(null)
  const [balloonAnims, setBalloonAnims] = useState<{delay: number, duration: number, innerDelay: number}[]>([])
  const [miniBalloonAnims, setMiniBalloonAnims] = useState<{delay: number, duration: number}[]>([])
  const [starAnims, setStarAnims] = useState<{delay: number, duration: number}[]>([])
  const [confettiAnims, setConfettiAnims] = useState<{left: number, delay: number, duration: number, colorIdx: number, shape: number}[]>([])
  const [heartAnims, setHeartAnims] = useState<{delay: number, duration: number}[]>([])
  const [bubbleAnims, setBubbleAnims] = useState<{delay: number, duration: number}[]>([])

  useEffect(() => {
    // Solo ejecutar en cliente
    const positions = generateAllElementPositions()
    setElementPositions(positions)
    setBalloonAnims(
      positions.balloons.map(() => ({
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 4,
        innerDelay: Math.random() * 3,
      }))
    )
    setMiniBalloonAnims(
      positions.miniBalloons.map(() => ({
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 3,
      }))
    )
    setStarAnims(
      positions.stars.map(() => ({
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2,
      }))
    )
    setConfettiAnims(
      Array.from({length: 20}).map(() => ({
        left: 5 + Math.random() * 90,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 3,
        colorIdx: Math.floor(Math.random() * 6),
        shape: Math.floor(Math.random() * 3),
      }))
    )
    setHeartAnims(
      positions.hearts.map(() => ({
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 3,
      }))
    )
    setBubbleAnims(
      positions.bubbles.map(() => ({
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 4,
      }))
    )
  }, [])

  if (!elementPositions) return null

  // Esperar a que los anims estén listos
  if (
    balloonAnims.length !== elementPositions.balloons.length ||
    miniBalloonAnims.length !== elementPositions.miniBalloons.length ||
    starAnims.length !== elementPositions.stars.length ||
    heartAnims.length !== elementPositions.hearts.length ||
    bubbleAnims.length !== elementPositions.bubbles.length
  ) {
    return null
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Fondo base con gradiente mejorado */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50"></div>
      
      {/* Efectos de luz adicionales */}
      <div className="absolute inset-0 bg-gradient-radial from-white/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-200/10 via-purple-200/10 to-blue-200/10"></div>

      {/* Globos flotantes animados - Rosas y Azules */}
      <div className="absolute inset-0">
        {elementPositions.balloons.map((position: Position, i: number) => (
          <div
            key={`balloon-${i}`}
            className="absolute animate-float-slow"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              animationDelay: `${balloonAnims[i].delay}s`,
              animationDuration: `${balloonAnims[i].duration}s`,
              zIndex: 1,
            }}
          >
            <div className="relative">
              {/* Globo principal con más colores */}
              <div
                className={`relative shadow-lg animate-bounce-slow ${
                  // Globos grandes alternados
                  i % 8 === 0
                    ? "w-10 h-12 bg-gradient-to-b from-red-300 to-red-500 border-2 border-red-200"
                    : i % 8 === 1
                      ? "w-10 h-12 bg-gradient-to-b from-blue-300 to-blue-500 border-2 border-blue-200"
                      : i % 8 === 2
                        ? "w-10 h-12 bg-gradient-to-b from-pink-300 to-pink-500 border-2 border-pink-200"
                        : i % 8 === 3
                          ? "w-10 h-12 bg-gradient-to-b from-green-300 to-green-500 border-2 border-green-200"
                          : i % 8 === 4
                            ? "w-10 h-12 bg-gradient-to-b from-purple-300 to-purple-500 border-2 border-purple-200"
                            : i % 8 === 5
                              ? "w-10 h-12 bg-gradient-to-b from-yellow-300 to-yellow-500 border-2 border-yellow-200"
                              : i % 8 === 6
                                ? "w-10 h-12 bg-gradient-to-b from-orange-300 to-orange-500 border-2 border-orange-200"
                                : "w-10 h-12 bg-gradient-to-b from-cyan-300 to-cyan-500 border-2 border-cyan-200"
                } rounded-full`}
                style={{ animationDelay: `${balloonAnims[i].innerDelay}s` }}
              >
                {/* Brillo del globo */}
                <div
                  className={`absolute top-2 left-2 w-2 h-3 rounded-full opacity-60 ${
                    i % 8 === 0
                      ? "bg-red-100"
                      : i % 8 === 1
                        ? "bg-blue-100"
                        : i % 8 === 2
                          ? "bg-pink-100"
                          : i % 8 === 3
                            ? "bg-green-100"
                            : i % 8 === 4
                              ? "bg-purple-100"
                              : i % 8 === 5
                                ? "bg-yellow-100"
                                : i % 8 === 6
                                  ? "bg-orange-100"
                                  : "bg-cyan-100"
                  }`}
                ></div>

                {/* Nudo del globo */}
                <div
                  className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${
                    i % 8 === 0
                      ? "bg-red-600"
                      : i % 8 === 1
                        ? "bg-blue-600"
                        : i % 8 === 2
                          ? "bg-pink-600"
                          : i % 8 === 3
                            ? "bg-green-600"
                            : i % 8 === 4
                              ? "bg-purple-600"
                              : i % 8 === 5
                                ? "bg-yellow-600"
                                : i % 8 === 6
                                  ? "bg-orange-600"
                                  : "bg-cyan-600"
                  }`}
                ></div>
              </div>

              {/* Hilo del globo */}
              <div className="w-px h-16 bg-gray-400 mx-auto opacity-70"></div>

              {/* Algunos globos con decoraciones especiales */}
              {i % 5 === 0 && (
                <div className="absolute -top-1 -right-1">
                  <div
                    className={`text-lg ${
                      i % 8 === 0
                        ? "text-red-300"
                        : i % 8 === 1
                          ? "text-blue-300"
                          : i % 8 === 2
                            ? "text-pink-300"
                            : i % 8 === 3
                              ? "text-green-300"
                              : i % 8 === 4
                                ? "text-purple-300"
                                : i % 8 === 5
                                  ? "text-yellow-300"
                                  : i % 8 === 6
                                    ? "text-orange-300"
                                    : "text-cyan-300"
                    }`}
                  >
                    {i % 4 === 0 ? "⭐" : i % 4 === 1 ? "💫" : i % 4 === 2 ? "✨" : "🌟"}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Globos adicionales más pequeños flotando */}
      <div className="absolute inset-0">
        {elementPositions.miniBalloons.map((position: Position, i: number) => (
          <div
            key={`mini-balloon-${i}`}
            className="absolute animate-float"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              animationDelay: `${miniBalloonAnims[i].delay}s`,
              animationDuration: `${miniBalloonAnims[i].duration}s`,
              zIndex: 2,
            }}
          >
            <div
              className={`w-6 h-7 rounded-full shadow-md relative ${
                i % 10 === 0
                  ? "bg-gradient-to-br from-red-200 to-red-400 border border-red-300"
                  : i % 10 === 1
                    ? "bg-gradient-to-br from-blue-200 to-blue-400 border border-blue-300"
                    : i % 10 === 2
                      ? "bg-gradient-to-br from-pink-200 to-pink-400 border border-pink-300"
                      : i % 10 === 3
                        ? "bg-gradient-to-br from-green-200 to-green-400 border border-green-300"
                        : i % 10 === 4
                          ? "bg-gradient-to-br from-purple-200 to-purple-400 border border-purple-300"
                          : i % 10 === 5
                            ? "bg-gradient-to-br from-yellow-200 to-yellow-400 border border-yellow-300"
                            : i % 10 === 6
                              ? "bg-gradient-to-br from-orange-200 to-orange-400 border border-orange-300"
                              : i % 10 === 7
                                ? "bg-gradient-to-br from-cyan-200 to-cyan-400 border border-cyan-300"
                                : i % 10 === 8
                                  ? "bg-gradient-to-br from-indigo-200 to-indigo-400 border border-indigo-300"
                                  : "bg-gradient-to-br from-teal-200 to-teal-400 border border-teal-300"
              }`}
            >
              {/* Mini brillo */}
              <div
                className={`absolute top-1 left-1 w-1 h-1 rounded-full opacity-80 ${
                  i % 10 === 0
                    ? "bg-red-50"
                    : i % 10 === 1
                      ? "bg-blue-50"
                      : i % 10 === 2
                        ? "bg-pink-50"
                        : i % 10 === 3
                          ? "bg-green-50"
                          : i % 10 === 4
                            ? "bg-purple-50"
                            : i % 10 === 5
                              ? "bg-yellow-50"
                              : i % 10 === 6
                                ? "bg-orange-50"
                                : i % 10 === 7
                                  ? "bg-cyan-50"
                                  : i % 10 === 8
                                    ? "bg-indigo-50"
                                    : "bg-teal-50"
                }`}
              ></div>
            </div>
            {/* Mini hilo */}
            <div className="w-px h-8 bg-gray-300 mx-auto opacity-50"></div>
          </div>
        ))}
      </div>

      {/* Estrellas brillantes */}
      <div className="absolute inset-0">
        {elementPositions.stars.map((position: Position, i: number) => (
          <div
            key={`star-${i}`}
            className="absolute animate-twinkle"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              animationDelay: `${starAnims[i].delay}s`,
              animationDuration: `${starAnims[i].duration}s`,
              zIndex: 3,
            }}
          >
            <div
              className={`text-yellow-400 ${i % 4 === 0 ? "text-3xl" : i % 4 === 1 ? "text-2xl" : i % 4 === 2 ? "text-xl" : "text-lg"}`}
            >
              {i % 5 === 0 ? "⭐" : i % 5 === 1 ? "✨" : i % 5 === 2 ? "🌟" : i % 5 === 3 ? "💫" : "🌠"}
            </div>
          </div>
        ))}
      </div>

      {/* Confeti cayendo - Posiciones aleatorias pero sin colisión inicial */}
      <div className="absolute inset-0">
        {confettiAnims.map((confetti, i) => (
          <div
            key={`confetti-${i}`}
            className="absolute animate-fall"
            style={{
              left: `${confetti.left}%`,
              top: "-10%", // Empezar arriba de la pantalla
              animationDelay: `${confetti.delay}s`,
              animationDuration: `${confetti.duration}s`,
              zIndex: 4,
            }}
          >
            <div
              className={`w-3 h-3 ${
                ["bg-red-500", "bg-blue-500", "bg-yellow-500", "bg-green-500", "bg-purple-500", "bg-pink-500"][
                  confetti.colorIdx
                ]
              } ${confetti.shape === 0 ? "transform rotate-45" : confetti.shape === 1 ? "rounded-full" : "transform rotate-12"}`}
            ></div>
          </div>
        ))}
      </div>

      {/* Corazones flotantes */}
      <div className="absolute inset-0">
        {elementPositions.hearts.map((position: Position, i: number) => (
          <div
            key={`heart-${i}`}
            className="absolute animate-float-heart"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              animationDelay: `${heartAnims[i].delay}s`,
              animationDuration: `${heartAnims[i].duration}s`,
              zIndex: 5,
            }}
          >
            <div
              className={`text-pink-400 opacity-70 ${i % 4 === 0 ? "text-2xl" : i % 4 === 1 ? "text-xl" : i % 4 === 2 ? "text-lg" : "text-base"}`}
            >
              {i % 4 === 0 ? "💖" : i % 4 === 1 ? "💝" : i % 4 === 2 ? "💕" : "💗"}
            </div>
          </div>
        ))}
      </div>

      {/* Burbujas de colores */}
      <div className="absolute inset-0">
        {elementPositions.bubbles.map((position: Position, i: number) => (
          <div
            key={`bubble-${i}`}
            className="absolute animate-bubble"
            style={{
              left: `${position.x}%`,
              bottom: "-50px", // Empezar abajo de la pantalla
              animationDelay: `${bubbleAnims[i].delay}s`,
              animationDuration: `${bubbleAnims[i].duration}s`,
              zIndex: 6,
            }}
          >
            <div
              className={`${i % 3 === 0 ? "w-4 h-4" : i % 3 === 1 ? "w-6 h-6" : "w-5 h-5"} rounded-full opacity-40 ${
                ["bg-red-300", "bg-blue-300", "bg-yellow-300", "bg-green-300", "bg-purple-300", "bg-pink-300"][
                  i % 6
                ]
              }`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente para texto con efecto de escritura
const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (currentIndex < text.length) {
          setDisplayText((prev) => prev + text[currentIndex])
          setCurrentIndex((prev) => prev + 1)
        }
      },
      delay + currentIndex * 100,
    )

    return () => clearTimeout(timer)
  }, [currentIndex, text, delay])

  return (
    <span>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

export default function BirthdayLogin() {
  // Todos los useState y useEffect aquí, sin returns antes
  const [date, setDate] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAuthenticated') === 'true'
    }
    return false
  })
  const [showFelicidades, setShowFelicidades] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('showFelicidades') === 'true'
    }
    return false
  })
  const [showError, setShowError] = useState(false)
  const [selectedModule, setSelectedModule] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedModule')
    }
    return null
  })
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('currentPhraseIndex') || '0')
    }
    return 0
  })
  const [phraseVisible, setPhraseVisible] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [isReady, setIsReady] = useState(false)
  const funnyErrorIndexRef = useRef(0)
  const [showSpecialModal, setShowSpecialModal] = useState(false)
  const [specialMessage, setSpecialMessage] = useState("")

  // Guardar estados en localStorage cuando cambien
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthenticated', isAuthenticated.toString())
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('showFelicidades', showFelicidades.toString())
    }
  }, [showFelicidades])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedModule) {
        localStorage.setItem('selectedModule', selectedModule)
      } else {
        localStorage.removeItem('selectedModule')
      }
    }
  }, [selectedModule])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentPhraseIndex', currentPhraseIndex.toString())
    }
  }, [currentPhraseIndex])

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseVisible(false)
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % birthdayPhrases.length)
        setPhraseVisible(true)
      }, 500)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const step = searchParams.get("step")
    if (step === "felicidades") {
      setIsAuthenticated(true)
      setShowFelicidades(true)
      setSelectedModule(null)
    } else if (step === "modulos") {
      setIsAuthenticated(true)
      setShowFelicidades(false)
      setSelectedModule(null)
    } else if (step && step.startsWith("modulo-")) {
      setIsAuthenticated(true)
      setShowFelicidades(false)
      setSelectedModule(step.replace("modulo-", ""))
    } else {
      setIsAuthenticated(false)
      setShowFelicidades(false)
      setSelectedModule(null)
    }
    setIsReady(true)
  }, [])

  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search)
      const step = params.get("step")
      if (step === "felicidades") {
        setIsAuthenticated(true)
        setShowFelicidades(true)
        setSelectedModule(null)
      } else if (step === "modulos") {
        setIsAuthenticated(true)
        setShowFelicidades(false)
        setSelectedModule(null)
      } else if (step && step.startsWith("modulo-")) {
        setIsAuthenticated(true)
        setShowFelicidades(false)
        setSelectedModule(step.replace("modulo-", ""))
      } else {
        setIsAuthenticated(false)
        setShowFelicidades(false)
        setSelectedModule(null)
      }
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  // Ahora sí, después de todos los hooks, el return condicional:
  if (!isReady) return null;

  // MODAL ESPECIAL - DEBE IR PRIMERO ANTES DE CUALQUIER OTRO RETURN
  if (showSpecialModal) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-2 sm:p-4 md:p-8 overflow-hidden">
        <AnimatedBackground />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl p-6 max-w-md w-full animate-fade-in border-2 border-pink-200">
            <Alert className="mb-4 border-pink-200 bg-pink-50">
              <AlertDescription className="text-purple-700 whitespace-pre-line text-base sm:text-lg leading-relaxed font-medium">
                {specialMessage}
              </AlertDescription>
            </Alert>
            <div className="flex justify-end">
              <Button 
                onClick={() => setShowSpecialModal(false)} 
                variant="outline"
                className="hover:bg-pink-100 border-pink-300 text-pink-700 hover:text-pink-800"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Actualizar la URL al cambiar de pantalla
  const goToStep = (step: string) => {
    const url = step ? `?step=${step}` : ""
    window.history.pushState({}, "", url)
  }

  const handleLogin = () => {
    console.log('Valor de date:', date)
    // Normalizar la fecha para aceptar 02091991 como especial
    let normalizedDate = date;
    if (date === '02091991') {
      normalizedDate = '1991-09-02';
    }
    if (normalizedDate === BIRTHDAY_DATE) {
      setIsAuthenticated(true)
      setShowFelicidades(true)
      setShowError(false)
      setShowConfetti(true)
      goToStep("felicidades")
      setTimeout(() => setShowConfetti(false), 3000)
      funnyErrorIndexRef.current = 0 // Reiniciar el índice si acierta
    } else if (normalizedDate === "1991-09-02") {
      console.log('¡Entró a la condición especial de 1991-09-02!')
      setSpecialMessage(`¡GUAU! ¿De verdad escribiste esta fecha? 🎉\n¡Alguien SÍ recordó mi cumpleaños! OMG, estoy shook. 😱\nComo premio por tu memoria legendaria (o fue suerte ), ¡te has ganado UNA PALABRA SECRETA! 🕵️‍♂️\n\nLa palabra es… [redoble de tambores]… ¡CURIOSIDAD! 🔍\n\n(¿O pensabas que sería \"pastel\"? 😏🎂)`)
      setShowSpecialModal(true)
      setShowError(false)
    } else {
      // Mostrar mensaje de error en orden secuencial
      setErrorMessage(funnyErrorMessages[funnyErrorIndexRef.current])
      setShowError(true)
      funnyErrorIndexRef.current = (funnyErrorIndexRef.current + 1) % funnyErrorMessages.length
    }
  }

  // Función para manejar el click del calendario
  const handleCalendarClick = () => {
    try {
      const input = document.getElementById("birthday") as HTMLInputElement
      if (input) {
        input.focus()
        if (input.showPicker) {
          input.showPicker()
        } else {
          // Fallback para navegadores que no soportan showPicker
          input.click()
        }
      }
    } catch (error) {
      console.log("Calendar picker not supported")
      // Fallback silencioso
    }
  }

  // Función para reiniciar todo el progreso
  const resetAllProgress = () => {
    if (typeof window !== 'undefined') {
      // Limpiar todo el localStorage
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('showFelicidades')
      localStorage.removeItem('selectedModule')
      localStorage.removeItem('currentPhraseIndex')
      localStorage.removeItem('selectedSongIndex')
      localStorage.removeItem('unlockedSongs')
      localStorage.removeItem('songPlayTime')
      localStorage.removeItem('currentWish')
      localStorage.removeItem('showFinalMessage')
      localStorage.removeItem('unlockedWishes')
      localStorage.removeItem('selectedFlowers')
      localStorage.removeItem('showDetail')
      localStorage.removeItem('foundWords')
      localStorage.removeItem('showCongratulations')
      localStorage.removeItem('gridSeed')
      localStorage.removeItem('birthdayWishes')
      localStorage.removeItem('savedDrawings')
      localStorage.removeItem('comments')
      
      // Recargar la página para aplicar los cambios
      window.location.reload()
    }
  }



  const modules = [
    {
      id: "cake",
      title: "Pastel",
      description: "¡Sopla las velas y pide un deseo!",
      icon: CakeIcon,
      color: "from-yellow-400 to-pink-400",
      hoverColor: "from-yellow-500 to-pink-500",
      isCake: true,
    },

    {
      id: "messages",
      title: "Mensajes del Corazón",
      description: "Cartas y dedicatorias llenas de amor",
      icon: HeartMessageIcon,
      color: "from-purple-500 to-indigo-500",
      hoverColor: "from-purple-600 to-indigo-600",
    },
    {
      id: "playlist",
      title: "Nuestra Banda Sonora",
      description: "Canciones que cuentan nuestra historia",
      icon: MusicNoteIcon,
      color: "from-blue-500 to-cyan-500",
      hoverColor: "from-blue-600 to-cyan-600",
    },
    {
      id: "wishes",
      title: "Deseos Mágicos",
      description: "Todo lo hermoso que deseo para ti",
      icon: MagicWishIcon,
      color: "from-yellow-500 to-orange-500",
      hoverColor: "from-yellow-600 to-orange-600",
    },
    {
      id: "magic-game",
      title: "Juego Mágico",
      description: "Descubre las virtudes que te hacen especial",
      icon: GameIcon,
      color: "from-green-500 to-emerald-500",
      hoverColor: "from-green-600 to-emerald-600",
    },
    {
      id: "drawing",
      title: "🔮 Portal Mágico",
      description: "Un lugar donde los sueños cobran vida...",
      icon: DrawingIcon,
      color: "from-violet-500 to-purple-500",
      hoverColor: "from-violet-600 to-purple-600",
    },
    {
      id: "comments",
      title: "💬 Comentarios y Sugerencias",
      description: "Déjame saber qué piensas de tu regalo especial",
      icon: CommentIcon,
      color: "from-amber-500 to-orange-500",
      hoverColor: "from-amber-600 to-orange-600",
    },
  ]

  // Efecto de confetti extra
  const ConfettiEffect = () => {
    if (!showConfetti) return null

    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti-burst"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              backgroundColor: ["#ff69b4", "#ff1493", "#9370db", "#4169e1", "#ffd700", "#ff6347", "#32cd32"][
                Math.floor(Math.random() * 7)
              ],
            }}
          >
            <div className="w-4 h-4 rounded-full"></div>
          </div>
        ))}
      </div>
    )
  }

  // Pantalla FELICIDADES
  if (showFelicidades && isAuthenticated && !selectedModule) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-2 sm:p-4 md:p-8 overflow-hidden">
        <AnimatedBackground />
        {showConfetti && <ConfettiEffect />}
        <div className="w-full max-w-2xl mx-auto relative z-10 flex flex-col items-center justify-center gap-10 py-12">
          <RainbowBalloonTitle onConfetti={() => setShowConfetti(true)} />
          <SpecialDateSection />
          <p className="text-xl sm:text-2xl md:text-3xl text-center text-gray-700 font-medium max-w-2xl">
            ¡Confirmado! 🔍 Hoy celebramos a LO MEJOR del mundo mundial 🌍🏆: ¡TÚ! Porque eres más brillante que el sol ☀️ y sobre todo más dulce que el chocolate 🍫
          </p>
          <p className="text-lg sm:text-xl md:text-2xl text-center text-gray-600 font-medium max-w-2xl mt-4">
            Disfruta tu regalo especial, explora cada opcion y déjate sorprender.
          </p>
          <Button
            className="mt-6 px-10 py-4 text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
            onClick={() => {
              setShowFelicidades(false)
              goToStep("modulos")
            }}
          >
            Ver mis sorpresas 🎁
          </Button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-2 sm:p-4 md:p-8 overflow-hidden">
        <AnimatedBackground />

        <Card className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl relative z-10 shadow-3xl border-0 bg-white/95 backdrop-blur-md transform hover:scale-105 transition-all duration-300 px-2 sm:px-6 md:px-12 py-4 sm:py-8 overflow-hidden">
          {/* Efecto de brillo en el borde */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl"></div>
          <CardHeader className="text-center space-y-2 sm:space-y-4">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-spin-slow shadow-lg">
              <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-bounce" />
            </div>
            <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
              ¡Feliz Cumpleaños! 🎉
            </CardTitle>
            <div className="space-y-2 sm:space-y-4">
              <div
                className={`text-lg sm:text-2xl md:text-3xl font-semibold text-purple-600 transition-all duration-500 transform ${
                  phraseVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                }`}
                style={{ minHeight: "32px" }}
              >
                {birthdayPhrases[currentPhraseIndex]}
              </div>
              <CardDescription className="text-base sm:text-xl md:text-2xl text-gray-600 font-medium">
                Ingresa tu fecha de cumpleaños para descubrir tu regalo especial
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="birthday" className="text-xs sm:text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-pink-500" />
                Tu fecha de cumpleaños
              </Label>
              <div className="relative group">
                <Input
                  id="birthday"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-2 border-pink-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 group-hover:shadow-lg pr-14 sm:pr-16 text-2xl sm:text-3xl py-6 sm:py-8 text-center w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg"
                  placeholder="dd/mm/aaaa"
                  style={{
                    colorScheme: "light",
                  }}
                />
                {/* Icono del calendario personalizado que actúa como botón */}
                <div
                  className="absolute right-3 sm:right-5 top-1/2 transform -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform duration-200 z-10"
                  onClick={handleCalendarClick}
                >
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-pink-400 hover:text-pink-600" />
                </div>
              </div>
            </div>

            {showError && (
              <Alert className="border-red-200 bg-red-50/90 backdrop-blur-sm animate-shake rounded-2xl shadow-lg border-2">
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                <AlertDescription className="text-red-700 text-xs sm:text-sm leading-relaxed font-medium">{errorMessage}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-extrabold py-6 sm:py-7 text-2xl sm:text-3xl md:text-4xl rounded-2xl shadow-3xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl relative overflow-hidden group border-2 border-white/20"
              disabled={!date}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <Gift className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 animate-bounce" />
                Abrir mi regalo mágico ✨
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 delay-200"></div>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (selectedModule) {
    return (
      <div className="min-h-screen relative p-4 overflow-hidden">
        <AnimatedBackground />
        <div className="max-w-4xl mx-auto relative z-10">
          <Button
            onClick={() => {
              setSelectedModule(null)
              goToStep("modulos")
            }}
            variant="outline"
            className="mb-6 hover:scale-105 transition-transform duration-200 shadow-lg bg-white/90 backdrop-blur-sm"
          >
            ← Volver a módulos
          </Button>
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md transform hover:scale-[1.02] transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="text-3xl flex items-center gap-3">
                {(() => {
                  const module = modules.find((m) => m.id === selectedModule)
                  const IconComponent = module?.icon || Gift
                  return (
                    <>
                      <IconComponent className="w-8 h-8 animate-pulse" />
                      {module?.title}
                    </>
                  )
                })()}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {selectedModule === 'cake' ? (
                <CakeModule />
              ) : selectedModule === 'playlist' ? (
                <PlaylistModule />
              ) : selectedModule === 'magic-game' ? (
                <MagicGameModule />
              ) : selectedModule === 'messages' ? (
                <MessagesModule />
              ) : selectedModule === 'wishes' ? (
                <WishesModule />
              ) : selectedModule === 'drawing' ? (
                <DrawingModule />
              ) : selectedModule === 'comments' ? (
                <CommentsModule />
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center animate-pulse">
                    <Heart className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-xl text-gray-600 mb-6">
                    Aquí irá el contenido de: {modules.find((m) => m.id === selectedModule)?.title}
                  </p>
                  <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                    Este módulo se puede personalizar con fotos, videos, texto, música y mucho más contenido especial 💝
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Renderizar la pantalla de selección de módulos si está autenticado, no hay módulo seleccionado y no está en felicitaciones
  return (
    <div className="min-h-screen relative flex items-center justify-center p-2 sm:p-4 md:p-8 overflow-hidden">
      <AnimatedBackground />
      
      {/* Efectos de partículas adicionales */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <div className="absolute top-20 left-10 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-75" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75" style={{animationDelay: '0.5s'}}></div>
      </div>
      
      <div className="w-full max-w-6xl mx-auto relative z-10 flex flex-col items-center justify-center gap-12 py-16">
        {/* Título mejorado con efectos */}
        <div className="text-center space-y-6">
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient mb-3 sm:mb-4 drop-shadow-lg px-2">
              Elige una opción para descubrir tu sorpresa
            </h2>
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-lg blur opacity-25 animate-pulse"></div>
          </div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-medium px-2">
            Cada tarjeta esconde una sorpresa especial llena de amor y magia ✨
          </p>
        </div>
        
        {/* Grid de módulos mejorado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-5xl px-2 sm:px-4">
          {modules.map((module, index) => (
            <button
              key={module.id}
              onClick={() => {
                setSelectedModule(module.id)
                goToStep(`modulo-${module.id}`)
              }}
              className={`
                group relative overflow-hidden rounded-2xl shadow-2xl 
                bg-gradient-to-br ${module.color} hover:${module.hoverColor} 
                text-white font-bold transition-all duration-500 
                hover:scale-105 hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-white/50
                transform hover:-translate-y-2
                ${index % 2 === 0 ? 'hover:rotate-1' : 'hover:-rotate-1'}
              `}
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Contenido de la tarjeta */}
              <div className="relative z-10 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center gap-3 sm:gap-4 min-h-[200px] sm:min-h-[240px] md:min-h-[280px]">
                {/* Icono con efectos mejorados */}
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 scale-110 group-hover:scale-125"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                  <div className="relative bg-white/20 backdrop-blur-md rounded-full p-3 sm:p-4 md:p-5 border-2 border-white/30 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110">
                    <module.icon className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 drop-shadow-lg ${
                      module.id === 'cake' ? 'animate-soft-scale' :
                      module.id === 'messages' ? 'animate-glow-pulse' :
                      module.id === 'playlist' ? 'animate-bounce' :
                      module.id === 'wishes' ? 'animate-pulse' :
                      'animate-gentle-float'
                    } group-hover:animate-bounce`} />
                  </div>
                  {/* Efecto de brillo adicional */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
                
                {/* Título */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-center leading-tight">
                  {module.title}
                </h3>
                
                {/* Descripción */}
                <p className="text-xs sm:text-sm font-medium text-white/90 text-center leading-relaxed max-w-xs">
                  {module.description}
                </p>
                
                {/* Indicador de hover */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Borde brillante */}
              <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-300"></div>
              
              {/* Partículas flotantes específicas para cada módulo */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                {module.id === 'cake' && (
                  <>
                    <div className="absolute top-4 left-4 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute top-6 right-6 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-75" style={{animationDelay: '1s'}}></div>
                    <div className="absolute bottom-4 left-6 w-1 h-1 bg-yellow-300 rounded-full animate-ping opacity-75" style={{animationDelay: '2s'}}></div>
                  </>
                )}
                {module.id === 'memories' && (
                  <>
                    <div className="absolute top-3 left-3 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute top-8 right-4 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-75" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute bottom-3 right-3 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-75" style={{animationDelay: '1.5s'}}></div>
                  </>
                )}
                {module.id === 'messages' && (
                  <>
                    <div className="absolute top-4 right-4 w-1 h-1 bg-red-400 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-75" style={{animationDelay: '1s'}}></div>
                    <div className="absolute top-6 left-6 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-75" style={{animationDelay: '2s'}}></div>
                  </>
                )}
                {module.id === 'playlist' && (
                  <>
                    <div className="absolute top-3 left-4 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute bottom-3 right-4 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-75" style={{animationDelay: '0.8s'}}></div>
                    <div className="absolute top-8 right-3 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-75" style={{animationDelay: '1.6s'}}></div>
                  </>
                )}
                {module.id === 'wishes' && (
                  <>
                    <div className="absolute top-4 left-4 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute bottom-4 right-4 w-1 h-1 bg-orange-400 rounded-full animate-ping opacity-75" style={{animationDelay: '1.2s'}}></div>
                    <div className="absolute top-6 right-6 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-75" style={{animationDelay: '0.6s'}}></div>
                  </>
                )}
                {module.id === 'magic-game' && (
                  <>
                    <div className="absolute top-3 left-3 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute bottom-3 left-4 w-1 h-1 bg-emerald-400 rounded-full animate-ping opacity-75" style={{animationDelay: '1s'}}></div>
                    <div className="absolute top-8 right-4 w-1 h-1 bg-green-300 rounded-full animate-ping opacity-75" style={{animationDelay: '1.8s'}}></div>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
        
        {/* Mensaje adicional */}
        <div className="text-center mt-8">
          <div className="bg-gradient-to-r from-pink-500/90 via-purple-500/90 to-blue-500/90 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30 shadow-2xl">
            <p className="text-xl font-bold text-white drop-shadow-lg">
              💝 Cada sorpresa está hecha con mucho amor y cariño especial para ti
            </p>
          </div>
        </div>

        {/* Botón de administración */}
        <div className="text-center mt-4">
          <Button
            onClick={resetAllProgress}
            variant="outline"
            className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-lg"
          >
            🔄 Reiniciar Progreso
          </Button>
        </div>
      </div>
    </div>
  )
}

// Component MessagesModule - Cartas del Corazón
function MessagesModule() {
  const [currentLetter, setCurrentLetter] = useState(0)
  const [showLetter, setShowLetter] = useState(false)
  const [letterVisible, setLetterVisible] = useState(false)
  
  const letters = [
         {
       title: "Mi Querida Gaby",
       content: `Gabys,

🎉 ¡Hoy cumples 30 años! ¡Qué fecha tan especial! 🎂
Oficialmente... ¡estás viejita! 😜💛

Espero que te guste este pequeño regalo que preparé para ti. ¡Al fin puse a mi cerebro a trabajar! 💻✨ Usé todos mis conocimientos de computación que ni sabía que tenía 😂. ¡Y debo admitir que me esforcé como nunca... más que cuando "disque trabajo"! 🤣

Disfruta todas las sorpresas que preparé para ti, porque ¡30 solo se cumple una vez! 🌟 Y una ocasión así amerita un regalo hecho con todo el amor del mundo. ❤️       


En este día tan especial ✨, quiero escribirte desde el fondo de mi corazón 💌 para decirte lo MUCHO que significas para mí.

Cada día que pasa, me doy cuenta de lo afortunado que fui al tenerte en mi vida. 😍 Tu sonrisa ilumina todo lo oscuro ☀️, tu risa es la música más dulce que he escuchado 🎶, y tu amor es el regalo más preciado que he recibido. 🎁💖

Eres más que una persona especial para mí: eres inspiración 🚀, eres motivación 💪, eres alegría pura 😊. Contigo aprendí que el amor a primera vista existe 💘, que la felicidad está en los pequeños detalles 🍃, y que la vida es mucho más hermosa cuando se comparte con alguien como tú. 🌈

En estos 30 años 🎂🎉, has tocado tantos corazones ❤️, iluminado tantos días ☀️ y hecho del mundo un lugar mejor, solo por ser TÚ. ¡Y yo soy el más afortunado por ser parte de tu historia! 📖💫

Gracias por ser exactamente quien eres: auténtica 🌟, brillante ✨, divertida 😆, inteligente 🧠 y, sobre todo, maravillosamente Gaby. Gracias por aceptarme tal como soy, por apoyarme incondicionalmente 🤝 y por creer en mí incluso cuando yo no lo hacía. 🙏

✨ Que este nuevo año de tu vida esté lleno de…

Momentos mágicos ✨

Risas compartidas 🤣

Sueños cumplidos 🌠

Y TODO el amor que mereces 💞

Que cada día te traiga nuevas razones para sonreír 😊 y que tu corazón siempre esté tan lleno de alegría como el mío cuando estoy contigo. 💖

Te quiero más de lo que las palabras pueden expresar 🥹, y estoy emocionadísimo por todos los momentos increíbles que aún te faltan por vivir. 🚀

Que este sea solo el comienzo de un año INCREÍBLE.
Con todo mi amor`,
       signature: "Con amor infinito"
     },
         {
       title: "Para el Futuro",
       content: `Mi Gaby,

Mientras escribo estas palabras ✍️, mi mente viaja por todos los momentos mágicos que hemos compartido. 🌈💭

Cambiaste mi vida de maneras que jamás imaginé posibles. 🌟 Fuimos:

Compañeros de aventuras 🚀🌎

Confidentes sin filtro 🤫💞

Mejores amigos 👯♂️

Y un amor que, aunque no pudo ser, dejó huella eterna 🥹❤️

Contigo descubrí que el amor verdadero no es perfecto... pero es real, auténtico y más hermoso que cualquier cuento de hadas. 🏰✨

Gracias por…

Estar ahí en mis momentos difíciles 🤝

Celebrar mis éxitos como si fueran tuyos 🎉

Reír conmigo hasta que nos dolía el estómago 🤣💦

Y llorar conmigo cuando la vida se ponía dura. 🥲

Me enseñaste que el amor no es encontrar a alguien perfecto, sino a alguien perfecto PARA TI. Y tú, con tus imperfecciones, tus locuras y tu autenticidad brillante, eres exactamente eso: MI PERSONA. 💖

✨ Que este nuevo año de tu vida esté repleto de…

Sonrisas que iluminen tu día 😊☀️

Logros que te hagan sentir orgullosa 🏆

Amor que te haga sentir única 💘

Y toda la felicidad que mereces. 🎁

Siempre te voy a querer ❤️, y estoy emocionado porque siento que… ¡aún nos queda un nuevo capítulo por escribir juntos! 📖🖊️

🎂 ¡Feliz cumpleaños, Gaby! 🎉
Que este sea el mejor año de tu vida… hasta ahora. 😉

Con todo mi corazón,
Para siempre… ❤️🐾`,
       signature: "Tu amor eterno"
     }
  ]
  
  const handleNextLetter = () => {
    setLetterVisible(false)
    setTimeout(() => {
      setCurrentLetter((prev) => (prev + 1) % letters.length)
      setLetterVisible(true)
    }, 500)
  }
  
  const handlePrevLetter = () => {
    setLetterVisible(false)
    setTimeout(() => {
      setCurrentLetter((prev) => (prev - 1 + letters.length) % letters.length)
      setLetterVisible(true)
    }, 500)
  }
  
  useEffect(() => {
    setShowLetter(true)
    setTimeout(() => setLetterVisible(true), 500)
  }, [])
  
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto">
      {/* Título y descripción */}
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          💌 Mensajes del Corazón 💌
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
          Cartas escritas con amor, dedicadas especialmente para ti en tu día especial
        </p>
      </div>
      {/* Carta principal */}
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-8 shadow-xl border-2 border-amber-300">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center animate-pulse">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{letters[currentLetter].title}</h3>
          </div>
          {/* Contenido de la carta */}
          <div className={`bg-white/90 rounded-xl p-6 shadow-lg border border-amber-200 transition-all duration-500 ${
            letterVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}>
            <div className="prose prose-lg max-w-none">
              <pre className="whitespace-pre-wrap font-serif text-gray-700 leading-relaxed text-base sm:text-lg">
                {letters[currentLetter].content}
              </pre>
            </div>
            {/* Firma */}
            <div className="text-right mt-8 pt-4 border-t border-amber-200">
              <p className="text-purple-600 font-bold text-lg">{letters[currentLetter].signature}</p>
            </div>
          </div>
          {/* Controles de navegación */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrevLetter}
              className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-all duration-300"
            >
              <div className="w-0 h-0 border-r-6 border-r-white border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </button>
            <div className="flex gap-2">
              {letters.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setLetterVisible(false)
                    setTimeout(() => {
                      setCurrentLetter(index)
                      setLetterVisible(true)
                    }, 500)
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentLetter 
                      ? 'bg-purple-600 scale-125' 
                      : 'bg-purple-300 hover:bg-purple-400'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNextLetter}
              className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-all duration-300"
            >
              <div className="w-0 h-0 border-l-6 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </button>
          </div>
        </div>
      </div>
      {/* Mensaje especial */}
      <div className="text-center mt-8">
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-6 shadow-lg border border-purple-200">
          <p className="text-xl font-bold text-purple-700 mb-2">💝 Mensaje Especial</p>
          <p className="text-gray-700 leading-relaxed">
            Cada palabra escrita aquí viene directamente del corazón. Que estas <span className="font-bold text-purple-600">cartas</span> te recuerden lo especial que eres y lo mucho que te quiero. 
            <br />
            <span className="font-semibold text-purple-600">¡Que el amor de estas palabras te acompañe siempre! 💌</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// Component MagicGameModule - Sopa de Letras con Virtudes
function MagicGameModule() {
  const [foundWords, setFoundWords] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('foundWords')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [selectedCells, setSelectedCells] = useState<number[][]>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [startCell, setStartCell] = useState<number[] | null>(null)
  const [showCongratulations, setShowCongratulations] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('showCongratulations') === 'true'
    }
    return false
  })
  const [lastFoundWord, setLastFoundWord] = useState<string | null>(null)
  const [gridSeed, setGridSeed] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gridSeed')
      return saved ? parseInt(saved) : null
    }
    return null
  })

  // Guardar progreso del juego en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('foundWords', JSON.stringify(foundWords))
    }
  }, [foundWords])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('showCongratulations', showCongratulations.toString())
    }
  }, [showCongratulations])

  useEffect(() => {
    if (typeof window !== 'undefined' && gridSeed !== null) {
      localStorage.setItem('gridSeed', gridSeed.toString())
    }
  }, [gridSeed])

  // Evitar hydration error: inicializar gridSeed solo en cliente
  useEffect(() => {
    if (gridSeed === null) {
      setGridSeed(Date.now())
    }
  }, [gridSeed])
  
  // Virtudes para buscar en la sopa de letras con colores
  const virtues = [
    { word: "BONITA", color: "from-red-400 to-pink-400", textColor: "text-red-800" },
    { word: "INTELIGENTE", color: "from-blue-400 to-cyan-400", textColor: "text-blue-800" },
    { word: "ALEGRE", color: "from-yellow-400 to-orange-400", textColor: "text-yellow-800" },
    { word: "GRACIOSA", color: "from-purple-400 to-indigo-400", textColor: "text-purple-800" },
    { word: "AMABLE", color: "from-green-400 to-emerald-400", textColor: "text-green-800" },
    { word: "PERSISTENTE", color: "from-pink-400 to-rose-400", textColor: "text-pink-800" },
    { word: "AUTÉNTICA", color: "from-teal-400 to-cyan-400", textColor: "text-teal-800" },
    { word: "CURIOSA", color: "from-indigo-400 to-blue-400", textColor: "text-indigo-800" },
    { word: "CREATIVA", color: "from-gray-400 to-slate-400", textColor: "text-gray-800" },
    { word: "CHISMOSITA", color: "from-violet-400 to-purple-400", textColor: "text-violet-800" }
  ]
  
  // Matriz de letras (15x15) con palabras distribuidas una sola vez y el resto aleatorio
  function generateLetterGrid(seed: number) {
    const size = 15
    const grid = Array.from({ length: size }, () => Array(size).fill(null))
    // Solo usar las palabras de la lista de virtudes
    const words = virtues.map(v => v.word)
    const directions = [
      [0, 1],   // horizontal derecha
      [1, 0],   // vertical abajo
      [1, 1],   // diagonal principal
      [-1, 1],  // diagonal secundaria
    ]
    // Semilla para aleatoriedad reproducible
    let randSeed = seed
    function random() {
      randSeed = (randSeed * 9301 + 49297) % 233280
      return randSeed / 233280
    }
    function canPlace(word: string, row: number, col: number, dRow: number, dCol: number) {
      for (let i = 0; i < word.length; i++) {
        const r = row + i * dRow
        const c = col + i * dCol
        if (r < 0 || r >= size || c < 0 || c >= size) return false
        if (grid[r][c] && grid[r][c] !== word[i]) return false
      }
      return true
    }
    function placeWord(word: string) {
      let placed = false
      let attempts = 0
      while (!placed && attempts < 200) {
        const dir = directions[Math.floor(random() * directions.length)]
        const dRow = dir[0], dCol = dir[1]
        const maxRow = dRow === 1 ? size - word.length : dRow === -1 ? word.length - 1 : size - 1
        const minRow = dRow === -1 ? word.length - 1 : 0
        const maxCol = dCol === 1 ? size - word.length : size - 1
        const minCol = 0
        const row = minRow + Math.floor(random() * (maxRow - minRow + 1))
        const col = minCol + Math.floor(random() * (maxCol - minCol + 1))
        if (canPlace(word, row, col, dRow, dCol)) {
          for (let i = 0; i < word.length; i++) {
            grid[row + i * dRow][col + i * dCol] = word[i]
          }
          placed = true
        }
        attempts++
      }
    }
    words.forEach(placeWord)
    // Rellenar el resto con letras aleatorias
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!grid[r][c]) {
          grid[r][c] = String.fromCharCode(65 + Math.floor(random() * 26))
        }
      }
    }
    return grid.map(row => row.join(""))
  }
  const letterGrid = gridSeed !== null ? generateLetterGrid(gridSeed) : []
  
  const checkWord = (word: string) => {
    const virtue = virtues.find(v => v.word === word)
    if (!foundWords.includes(word) && virtue) {
      setFoundWords(prev => [...prev, word])
      if (foundWords.length + 1 === virtues.length) {
        setShowCongratulations(true)
      }
    }
  }
  
  const handleCellClick = (row: number, col: number) => {
    if (!isSelecting) {
      setStartCell([row, col])
      setIsSelecting(true)
      setSelectedCells([[row, col]])
    } else {
      const selectedWord = getSelectedWord()
      const virtue = virtues.find(v => v.word === selectedWord)
      
      // Verificar que la palabra sea válida y esté en línea recta
      if (selectedWord && virtue && !foundWords.includes(selectedWord) && selectedCells.length > 1) {
        // Verificar que las celdas seleccionadas estén en línea recta
        const isValidSelection = validateWordSelection(selectedCells, selectedWord)
        
        if (isValidSelection) {
          // Palabra válida encontrada
          setFoundWords(prev => [...prev, selectedWord])
          setLastFoundWord(selectedWord)
          setTimeout(() => setLastFoundWord(null), 2000)
          if (foundWords.length + 1 === virtues.length) {
            setShowCongratulations(true)
          }
        }
      }
      setIsSelecting(false)
      setStartCell(null)
      setSelectedCells([])
    }
  }
  
  const handleCellHover = (row: number, col: number) => {
    if (isSelecting && startCell) {
      const [startRow, startCol] = startCell
      const cells = getCellsBetween(startRow, startCol, row, col)
      setSelectedCells(cells)
    }
  }

  // Sistema móvil: selección letra por letra
  const [mobileSelectedCells, setMobileSelectedCells] = useState<number[][]>([])
  
  const handleCellTap = (row: number, col: number) => {
    // Verificar si la celda ya está seleccionada
    const isAlreadySelected = mobileSelectedCells.some(([r, c]) => r === row && c === col)
    
    if (isAlreadySelected) {
      // Si ya está seleccionada, la deseleccionamos
      setMobileSelectedCells(prev => prev.filter(([r, c]) => !(r === row && c === col)))
    } else {
      // Agregar la nueva celda
      setMobileSelectedCells(prev => [...prev, [row, col]])
    }
    
    // Actualizar las celdas seleccionadas para mostrar
    const newSelectedCells = isAlreadySelected 
      ? mobileSelectedCells.filter(([r, c]) => !(r === row && c === col))
      : [...mobileSelectedCells, [row, col]]
    
    setSelectedCells(newSelectedCells)
    
    // Verificar si la palabra está completa
    const selectedWord = getSelectedWord()
    const virtue = virtues.find(v => v.word === selectedWord)
    
    if (selectedWord && virtue && !foundWords.includes(selectedWord)) {
      // Verificar que las celdas estén en línea recta
      const isValidSelection = validateWordSelection(newSelectedCells, selectedWord)
      
      if (isValidSelection) {
        // ¡Palabra encontrada!
        setFoundWords(prev => [...prev, selectedWord])
        setLastFoundWord(selectedWord)
        setTimeout(() => setLastFoundWord(null), 2000)
        
        if (foundWords.length + 1 === virtues.length) {
          setShowCongratulations(true)
        }
        
        // Limpiar selección móvil
        setMobileSelectedCells([])
        setSelectedCells([])
      }
    }
  }
  
  const getCellsBetween = (startRow: number, startCol: number, endRow: number, endCol: number) => {
    const cells: number[][] = []
    const deltaRow = endRow - startRow
    const deltaCol = endCol - startCol
    
    // Solo permitir líneas rectas (horizontal, vertical o diagonal perfecta)
    if (deltaRow === 0) {
      // Horizontal
      const start = Math.min(startCol, endCol)
      const end = Math.max(startCol, endCol)
      for (let col = start; col <= end; col++) {
        cells.push([startRow, col])
      }
    } else if (deltaCol === 0) {
      // Vertical
      const start = Math.min(startRow, endRow)
      const end = Math.max(startRow, endRow)
      for (let row = start; row <= end; row++) {
        cells.push([row, startCol])
      }
    } else if (Math.abs(deltaRow) === Math.abs(deltaCol)) {
      // Diagonal perfecta
      const steps = Math.abs(deltaRow)
      const stepRow = deltaRow / steps
      const stepCol = deltaCol / steps
      for (let i = 0; i <= steps; i++) {
        cells.push([startRow + i * stepRow, startCol + i * stepCol])
      }
    } else {
      // Si no es una línea recta, solo devolver la celda inicial
      cells.push([startRow, startCol])
    }
    
    return cells
  }
  
  const getSelectedWord = () => {
    if (selectedCells.length === 0) return ""
    
    let word = ""
    for (const [row, col] of selectedCells) {
      if (row >= 0 && row < letterGrid.length && col >= 0 && col < letterGrid[row].length) {
        word += letterGrid[row][col]
      }
    }
    return word
  }
  
  const validateWordSelection = (cells: number[][], word: string) => {
    if (cells.length !== word.length) return false
    
    // Verificar que las celdas estén en línea recta
    if (cells.length <= 1) return false
    
    const [firstRow, firstCol] = cells[0]
    const [lastRow, lastCol] = cells[cells.length - 1]
    
    const deltaRow = lastRow - firstRow
    const deltaCol = lastCol - firstCol
    
    // Verificar que sea horizontal, vertical o diagonal perfecta
    if (deltaRow !== 0 && deltaCol !== 0 && Math.abs(deltaRow) !== Math.abs(deltaCol)) {
      return false
    }
    
    // Verificar que las letras coincidan exactamente
    for (let i = 0; i < cells.length; i++) {
      const [row, col] = cells[i]
      if (row < 0 || row >= letterGrid.length || col < 0 || col >= letterGrid[row].length) {
        return false
      }
      if (letterGrid[row][col] !== word[i]) {
        return false
      }
    }
    
    return true
  }
  
  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(([r, c]) => r === row && c === col)
  }
  
  const isCellFound = (row: number, col: number) => {
    // Verificar si la celda es parte de una palabra encontrada
    return foundWords.some(word => {
      // Buscar la palabra en todas las direcciones
      const directions = [
        [0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]
      ]
      
      for (const [dRow, dCol] of directions) {
        // Verificar si esta celda es el inicio de la palabra en esta dirección
        let found = true
        for (let i = 0; i < word.length; i++) {
          const checkRow = row + i * dRow
          const checkCol = col + i * dCol
          if (checkRow < 0 || checkRow >= letterGrid.length || checkCol < 0 || checkCol >= letterGrid[checkRow].length) {
            found = false
            break
          }
          if (letterGrid[checkRow][checkCol] !== word[i]) {
            found = false
            break
          }
        }
        if (found) return true
        
        // Verificar si esta celda es el final de la palabra en esta dirección
        found = true
        for (let i = 0; i < word.length; i++) {
          const checkRow = row - i * dRow
          const checkCol = col - i * dCol
          if (checkRow < 0 || checkRow >= letterGrid.length || checkCol < 0 || checkCol >= letterGrid[checkRow].length) {
            found = false
            break
          }
          if (letterGrid[checkRow][checkCol] !== word[word.length - 1 - i]) {
            found = false
            break
          }
        }
        if (found) return true
        
        // Verificar si esta celda está en medio de la palabra
        for (let start = 0; start < word.length; start++) {
          found = true
          for (let i = 0; i < word.length; i++) {
            const checkRow = row + (i - start) * dRow
            const checkCol = col + (i - start) * dCol
            if (checkRow < 0 || checkRow >= letterGrid.length || checkCol < 0 || checkCol >= letterGrid[checkRow].length) {
              found = false
              break
            }
            if (letterGrid[checkRow][checkCol] !== word[i]) {
              found = false
              break
            }
          }
          if (found) return true
        }
      }
      return false
    })
  }
  
  const getCellColor = (row: number, col: number) => {
    // Obtener el color de la celda basado en la palabra encontrada
    for (const foundWord of foundWords) {
      const virtue = virtues.find(v => v.word === foundWord)
      if (virtue) {
        const directions = [
          [0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]
        ]
        
        for (const [dRow, dCol] of directions) {
          // Verificar si esta celda es el inicio de la palabra en esta dirección
          let found = true
          for (let i = 0; i < foundWord.length; i++) {
            const checkRow = row + i * dRow
            const checkCol = col + i * dCol
            if (checkRow < 0 || checkRow >= letterGrid.length || checkCol < 0 || checkCol >= letterGrid[checkRow].length) {
              found = false
              break
            }
            if (letterGrid[checkRow][checkCol] !== foundWord[i]) {
              found = false
              break
            }
          }
          if (found) return virtue.color
          
          // Verificar si esta celda es el final de la palabra en esta dirección
          found = true
          for (let i = 0; i < foundWord.length; i++) {
            const checkRow = row - i * dRow
            const checkCol = col - i * dCol
            if (checkRow < 0 || checkRow >= letterGrid.length || checkCol < 0 || checkCol >= letterGrid[checkRow].length) {
              found = false
              break
            }
            if (letterGrid[checkRow][checkCol] !== foundWord[foundWord.length - 1 - i]) {
              found = false
              break
            }
          }
          if (found) return virtue.color
          
          // Verificar si esta celda está en medio de la palabra
          for (let start = 0; start < foundWord.length; start++) {
            found = true
            for (let i = 0; i < foundWord.length; i++) {
              const checkRow = row + (i - start) * dRow
              const checkCol = col + (i - start) * dCol
              if (checkRow < 0 || checkRow >= letterGrid.length || checkCol < 0 || checkCol >= letterGrid[checkRow].length) {
                found = false
                break
              }
              if (letterGrid[checkRow][checkCol] !== foundWord[i]) {
                found = false
                break
              }
            }
            if (found) return virtue.color
          }
        }
      }
    }
    return null
  }
  
  const searchWordInGrid = (word: string, targetRow: number, targetCol: number) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]
    ]
    
    for (const [dRow, dCol] of directions) {
      let found = true
      for (let i = 0; i < word.length; i++) {
        const row = targetRow + i * dRow
        const col = targetCol + i * dCol
        if (row < 0 || row >= letterGrid.length || col < 0 || col >= letterGrid[row].length) {
          found = false
          break
        }
        if (letterGrid[row][col] !== word[i]) {
          found = false
          break
        }
      }
      if (found) return true
    }
    return false
  }
  
  // Botón de reinicio
  const handleRestart = () => {
    setFoundWords([])
    setSelectedCells([])
    setIsSelecting(false)
    setStartCell(null)
    setShowCongratulations(false)
    setLastFoundWord(null)
    setGridSeed(Date.now())
  }
  
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-6xl mx-auto">
      {/* Botón de reinicio */}
      <div className="w-full flex justify-end mb-2">
        <button
          onClick={handleRestart}
          className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 border-2 border-green-300"
        >
          Reiniciar juego
        </button>
      </div>

      {/* Título y descripción */}
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          🎮 Juego Mágico 🎮
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
          Encuentra las virtudes que te hacen tan especial. ¡Haz clic y arrastra para seleccionar las palabras!
        </p>
      </div>
      
      {/* Lista de virtudes a encontrar */}
      <div className="w-full max-w-2xl mx-auto mb-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 shadow-lg border border-green-200">
          <h3 className="text-xl font-bold text-green-700 mb-4 text-center">🌟 Virtudes a encontrar:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {virtues.map((virtue, index) => (
              <div
                key={virtue.word}
                className={`p-3 rounded-lg text-center font-medium transition-all duration-500 transform ${
                  foundWords.includes(virtue.word)
                    ? `bg-gradient-to-r ${virtue.color} ${virtue.textColor} border-2 border-current shadow-lg scale-105 animate-pulse`
                    : 'bg-white/70 text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {foundWords.includes(virtue.word) && (
                    <span className="animate-bounce">✅</span>
                  )}
                  <span className={foundWords.includes(virtue.word) ? 'font-bold' : ''}>
                    {virtue.word}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Encontradas: <span className="font-bold text-green-600">{foundWords.length}</span> / <span className="font-bold">{virtues.length}</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Sopa de letras */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white/90 rounded-2xl p-6 shadow-xl border border-green-200">
          <div className="grid grid-cols-15 gap-1 mb-6 w-full">
            {letterGrid.map((row, rowIndex) =>
              row.split('').map((letter, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    flex items-center justify-center font-bold rounded cursor-pointer
                    grow basis-0 min-w-0 h-auto aspect-square
                    text-[3vw] sm:text-sm md:text-base
                    transition-all duration-200 select-none touch-none
                    ${isCellSelected(rowIndex, colIndex)
                      ? 'bg-purple-400 text-white shadow-lg scale-110'
                      : isCellFound(rowIndex, colIndex)
                        ? `bg-gradient-to-r ${getCellColor(rowIndex, colIndex) || 'from-green-300 to-emerald-300'} text-white shadow-md`
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }
                  `}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                  onTouchEnd={() => handleCellTap(rowIndex, colIndex)}
                >
                  {letter}
                </div>
              ))
            )}
          </div>
          
          {/* Palabra seleccionada */}
          {selectedCells.length > 0 && (
            <div className="text-center mb-4">
              <p className="text-lg font-bold text-purple-600">
                Palabra seleccionada: <span className="bg-purple-100 px-3 py-1 rounded-lg">{getSelectedWord()}</span>
              </p>
            </div>
          )}
          
          {/* Indicador móvil */}
          {mobileSelectedCells.length > 0 && (
            <div className="text-center mb-4">
              <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                📱 Seleccionadas: {mobileSelectedCells.length} letras | Toca letra por letra para formar la palabra
              </p>
              <button 
                onClick={() => {
                  setMobileSelectedCells([])
                  setSelectedCells([])
                }}
                className="mt-2 px-3 py-1 text-xs bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
              >
                🔄 Limpiar selección
              </button>
            </div>
          )}
          
          {/* Instrucciones */}
          <div className="text-center">
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              💡 <strong>Instrucciones:</strong> 
              <br />
              <span className="hidden sm:inline">Desktop:</span> Haz clic y arrastra en línea recta para seleccionar.
              <br />
              <span className="sm:hidden">Móvil:</span> Toca letra por letra para formar la palabra. Toca de nuevo para deseleccionar.
              <br />
              Las palabras están en horizontal, vertical o diagonal.
            </p>
          </div>
        </div>
      </div>
      
      {/* Mensaje de palabra encontrada */}
      {lastFoundWord && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40 pointer-events-none">
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-xl shadow-2xl text-center animate-bounce">
            <h3 className="text-2xl font-bold mb-2">🎉 ¡Palabra Encontrada! 🎉</h3>
            <p className="text-xl font-bold">{lastFoundWord}</p>
          </div>
        </div>
      )}
      
      {/* Mensaje de felicitación */}
      {showCongratulations && (
        <div className="fixed inset-0 bg-gradient-to-br from-pink-100/80 via-purple-100/80 to-blue-100/80 flex items-center justify-center z-50">
          <div className="bg-white/90 border-4 border-pink-200 shadow-2xl rounded-3xl p-8 max-w-lg w-full animate-fade-in flex flex-col items-center">
            <h3 className="text-3xl font-extrabold mb-4 text-pink-600 drop-shadow">✨ ¡Mensaje para Gaby! ✨</h3>
            <p className="text-base sm:text-lg text-purple-700 whitespace-pre-line leading-relaxed font-medium text-center">
              ¿Sabes por qué escogí estas cualidades?
              <br />
              <b>¡Porque son ESO que hace a Gaby… ¡Gaby! 🌟</b>
              <br />
              Así es exactamente como te veo: <b>auténtica, brillante y única</b> (como un unicornio con 🦄).
              <br /><br />
              <b>Y oye, para esos días grises en que el mundo se siente pesado:</b>
              <br />
              <span className="text-pink-600">🔍 ¡Juega esta sopa de letras las veces que quieras!</span>
              <br />
              (Te reto a encontrar la palabra <b>"increíble"</b>… Spoiler: <b>¡ERES TÚ! 😉</b>).
              <br /><br />
              <b>Para que nunca, nunca, olvides:</b>
              <br />
              1️⃣ Lo genial que eres (sí, con E de <b>¡Extraordinaria!</b> y de <b>estrella! ⭐</b>).
              <br />
              2️⃣ Lo hermosa que eres (por dentro y por fuera, obvio).
              <br /><br />
              <b>¡Ah, y guarda espacio para más cumplidos… porque esto es solo el nivel 1! 🚀💖</b>
            </p>
            <button
              className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold shadow-lg hover:scale-105 transition-transform border-2 border-pink-300"
              onClick={() => setShowCongratulations(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      
      {/* Mensaje especial */}
      <div className="text-center mt-8">
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 shadow-lg border border-pink-200">
          <p className="text-xl font-bold text-pink-700 mb-2">💝 Mensaje Especial</p>
          <p className="text-gray-700 leading-relaxed">
            Cada virtud que encuentres representa una cualidad especial que te hace única y maravillosa. 
            <br />
            <span className="font-semibold text-purple-600">¡Que estas virtudes brillen siempre en tu vida! ✨</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// Component PlaylistModule
function PlaylistModule() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [selectedSongIndex, setSelectedSongIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('selectedSongIndex') || '0')
    }
    return 0
  })
  const [unlockedSongs, setUnlockedSongs] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unlockedSongs')
      return saved ? JSON.parse(saved) : [0]
    }
    return [0]
  })
  const [songPlayTime, setSongPlayTime] = useState<{[key: number]: number}>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('songPlayTime')
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })
  const [showUnlockMessage, setShowUnlockMessage] = useState(false)
  const [lastUnlockedSong, setLastUnlockedSong] = useState<number | null>(null)
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }
  
  // Guardar progreso de música en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedSongIndex', selectedSongIndex.toString())
    }
  }, [selectedSongIndex])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('unlockedSongs', JSON.stringify(unlockedSongs))
    }
  }, [unlockedSongs])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('songPlayTime', JSON.stringify(songPlayTime))
    }
  }, [songPlayTime])

  const selectSong = (index: number) => {
    if (unlockedSongs.includes(index)) {
      setSelectedSongIndex(index)
      setIsPlaying(false)
    }
  }
  
  // Función para marcar una canción como reproducida
  const markSongAsPlayed = (songIndex: number) => {
    if (!songPlayTime[songIndex]) {
      setSongPlayTime(prev => ({...prev, [songIndex]: Date.now()}))
      
      // Desbloquear la siguiente canción si no está desbloqueada
      const nextSongIndex = songIndex + 1
      if (nextSongIndex < playlistSongs.length && !unlockedSongs.includes(nextSongIndex)) {
        setUnlockedSongs(prev => [...prev, nextSongIndex])
        setLastUnlockedSong(nextSongIndex)
        setShowUnlockMessage(true)
        setTimeout(() => setShowUnlockMessage(false), 8000)
      }
    }
  }
  
  const playlistSongs = [
    {
      id: "luZz40sD0qQ",
      title: "La canción que nos define" + " 🎤🤝",
      artist: "El soundtrack de nuestra historia",
      description: "✨ Esta canción representa un momento mágico que compartimos juntos 💖"
    },
    {
      id: "TuY1py-wPl4",
      title: "🎵 'Nuestro Primer Beso'",
      artist: "✨ Esa canción nos robó el primer beso. 🎵🔥",
      description: "🎶 Esa Canción Que me hizo  Robarte el Primer Beso 🌹"
    },
    {
      id: "HJqlA_HTEU8",
      title: "\"Dos corazones, una misma melodía.\" 🎶💘",
      artist: "La melodía de nuestros corazones",
      description: "✨ Esa canción no era casualidad... cada estrofa deletreaba nuestros nombres 💫"
    },
    {
      id: "0z7ChKOIQFc",
      title: "✨ \"Ni el café ni el destino se enfriaron... solo nos distrajimos antes de la primera taza.\" ☕✨",
      artist: "Una canción especial para nosotros",
      description: "\"El café se enfrió… pero tu risa sigue calentando mis mañanas.\" 😊🔥"
    },
    {
      id: "J7EEkLPVdq0",
      title: "✨ \"Fue ese segundo en que la risa se cortó, los ojos se encontraron... y el universo susurró: «Esto ya es algo mas».\" 🌌💫",
      artist: "Escribirte era todo",
      description: "✨ \"Escribirte es mi forma de robarte sonrisas desde lejos, de dibujar mi nombre en tu rutina y decirte: «Aquí estoy, aunque no se note».\" ✍️🌙"
    },
    {
      id: "SzxEm98_nqY",
      title: "\"Esa melodía que sonaba de fondo cuando el 'tal vez' se convirtió en 'siempre'… y nuestras almas firmaron el contrato sin leerlo.\" 🎶",
      artist: "⭐✨🌟💫",
      description: "\"El 'algún día' sigue ahí, esperando a que el reloj diga ahora.\" ⏳✨"
    },
    {
      id: "RAh5xtdIVkA",
      title: "\"No empezaremos... continuaremos donde el miedo nos hizo pausar.\" 🎧⏯️",
      artist: "1 + 1 = 2 💕",
      description: "\"Reiniciaremos como el WiFi: después de gritarle al universo y resetear el router mil veces.\" 📡🤬💖"
    },
    {
      id: "dH7_By3Y2i0",
      title: "\"Porque el destino nos guardaba un último giro inesperado... y aquí estamos, sorprendidos de lo que nos deparaba\" 🌌✨🎭",
      artist: "Nos encontraremos en ese lugar",
      description: "✨ \"La banda sonora de nuestro futuro —esa canción que suena en cada esquina del tiempo—\""
    }
  ]
  
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto">
      {/* Título y descripción */}
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          🎵 Nuestra Banda Sonora 🎵
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
          Algunas canciones ya no son solo canciones 🎵...<br/>
          Son pedacitos de nuestra historia ✨,<br/>
          la banda sonora de todo lo bueno que vivimos juntos 💞.<br/>
          <br/>
          Y cuando las escuchemos 🎧,<br/>
          siempre nos recordarán por qué las elegimos
        </p>
      </div>
      
      {/* Reproductor principal */}
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow-xl border border-blue-200">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Music className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{playlistSongs[selectedSongIndex].title}</h3>
            <p className="text-purple-600 font-medium">{playlistSongs[selectedSongIndex].artist}</p>
          </div>
          
          {/* Reproductor de YouTube en miniatura */}
          <div className="relative w-full max-w-md mx-auto mb-6">
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={`https://www.youtube.com/embed/${playlistSongs[selectedSongIndex].id}?autoplay=0&controls=1&modestbranding=1&rel=0&showinfo=0&enablejsapi=1`}
                title={playlistSongs[selectedSongIndex].title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            {/* Indicador de progreso */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Canciones desbloqueadas: <span className="font-bold text-purple-600">{unlockedSongs.length}</span> / <span className="font-bold">{playlistSongs.length}</span>
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(unlockedSongs.length / playlistSongs.length) * 100}%` }}
                ></div>
              </div>
              {/* Botón para marcar como reproducida */}
              {!songPlayTime[selectedSongIndex] && (
                <button
                  onClick={() => markSongAsPlayed(selectedSongIndex)}
                  className="mt-3 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  ✅ Marcar como reproducida
                </button>
              )}
            </div>
          </div>
          
          {/* Controles de navegación entre canciones */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => selectSong(selectedSongIndex === 0 ? playlistSongs.length - 1 : selectedSongIndex - 1)}
              className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-all duration-300"
              disabled={playlistSongs.length <= 1}
            >
              <div className="w-0 h-0 border-r-6 border-r-white border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </button>
            
            {/* Botón de play/pause removido, solo controles nativos de YouTube */}
            
            <button
              onClick={() => selectSong(selectedSongIndex === playlistSongs.length - 1 ? 0 : selectedSongIndex + 1)}
              className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-all duration-300"
              disabled={playlistSongs.length <= 1}
            >
              <div className="w-0 h-0 border-l-6 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </button>
          </div>
          
          {/* Indicador de canción actual */}
          <div className="flex justify-center gap-2 mb-4">
            {playlistSongs.map((_, index) => (
              <button
                key={index}
                onClick={() => selectSong(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === selectedSongIndex 
                    ? 'bg-purple-600 scale-125' 
                    : 'bg-purple-300 hover:bg-purple-400'
                }`}
              />
            ))}
          </div>
          
          {/* Descripción de la canción */}
          {unlockedSongs.length > 1 && (
            <div className="text-center">
              <p className="text-gray-700 text-lg leading-relaxed bg-white/70 rounded-lg p-4 shadow-sm">
                {playlistSongs[selectedSongIndex].description}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Lista de canciones adicionales (placeholder) */}
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white/80 rounded-xl p-6 shadow-lg border border-purple-200">
          <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">🎼 Más canciones especiales</h4>
          <div className="space-y-3">
            {playlistSongs.map((song, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  unlockedSongs.includes(index)
                    ? index === selectedSongIndex 
                      ? 'bg-gradient-to-r from-purple-700 to-pink-700 shadow-lg border-2 border-white/20' 
                      : 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 opacity-60 cursor-not-allowed'
                }`}
                onClick={() => selectSong(index)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  unlockedSongs.includes(index)
                    ? index === selectedSongIndex 
                      ? 'bg-white/20 border-2 border-white/40' 
                      : 'bg-gradient-to-r from-purple-400 to-pink-400'
                    : 'bg-gradient-to-r from-gray-400 to-gray-500'
                }`}>
                  {unlockedSongs.includes(index) ? index + 1 : '🔒'}
                </div>
                <div className="flex-1">
                  <p className={`font-medium transition-colors duration-300 ${
                    unlockedSongs.includes(index)
                      ? index === selectedSongIndex 
                        ? 'text-white font-bold' 
                        : 'text-gray-800 group-hover:text-purple-600'
                      : 'text-gray-500'
                  }`}>
                    {unlockedSongs.includes(index) ? song.title : `Canción ${index + 1} 🔒`}
                  </p>
                  <p className={`text-sm ${
                    unlockedSongs.includes(index) 
                      ? index === selectedSongIndex 
                        ? 'text-white/90 font-medium' 
                        : 'text-gray-500'
                      : 'text-gray-400'
                  }`}>
                    {unlockedSongs.includes(index) ? song.artist : 'Desbloquea la canción anterior'}
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  unlockedSongs.includes(index)
                    ? index === selectedSongIndex 
                      ? 'bg-white/30 border-2 border-white/60' 
                      : 'bg-gray-300'
                    : 'bg-gray-400'
                }`}>
                  {unlockedSongs.includes(index) ? (
                    index === selectedSongIndex ? (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    ) : (
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    )
                  ) : (
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
            

          </div>
        </div>
      </div>
      
      {/* Mensaje de desbloqueo */}
      {showUnlockMessage && lastUnlockedSong !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-2xl text-center animate-fadeInUp">
            <h3 className="text-2xl font-bold mb-2">🎉 ¡Nueva Canción Desbloqueada! 🎉</h3>
            <p className="text-xl font-bold">{playlistSongs[lastUnlockedSong].title}</p>
            <p className="text-lg mt-2">¡Continúa descubriendo nuestra historia! ✨</p>
            {lastUnlockedSong === 1 && (
              <div className="mt-4 p-4 bg-white/20 rounded-lg">
                <p className="text-lg font-bold">✨ "La banda sonora de nuestro futuro —esa canción que suena en cada esquina del tiempo—" ✨</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Mensaje especial */}
      <div className="text-center mt-8">
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 shadow-lg border border-pink-200">
          <p className="text-xl font-bold text-pink-700 mb-2">💝 Mensaje Especial</p>
          <p className="text-gray-700 leading-relaxed">
            Cada nota de esta música está llena de amor y recuerdos. Que estas <span className="font-bold text-purple-600">canciones</span> te acompañen siempre y te recuerden lo especial que eres para mí. 
            <br />
            <span className="font-semibold text-purple-600">¡Que la música de nuestro amor nunca deje de sonar! 🎶</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// Component SurpriseGiftModule
function SurpriseGiftModule() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showFinalMessage, setShowFinalMessage] = useState(false)
  const [unlockedSteps, setUnlockedSteps] = useState([0])
  
  const steps = [
    {
      id: 1,
      title: "🎁 Primer Regalo Sorpresa",
      description: "Un pequeño detalle para empezar...",
      content: "¡Hola Gaby! 🌟\n\nEste es tu primer regalo sorpresa. ¿Sabes qué es lo más especial de ti? Que cada vez que te veo, mi corazón hace piruetas como si fuera un acróbata en el circo. 🎪\n\nEres la persona que hace que los días grises se vuelvan coloridos, que las risas sean más fuertes y que la vida sea más dulce. 🍯\n\n¡Y esto es solo el comienzo! ✨",
      emoji: "🎁",
      color: "from-pink-400 to-rose-400"
    },
    {
      id: 2,
      title: "💝 Segundo Regalo Sorpresa",
      description: "Algo que te hará sonreír...",
      content: "¿Sabes qué es lo que más me gusta de ti? 🤔\n\nTu capacidad de hacer que cualquier momento se vuelva mágico. Una simple conversación contigo puede transformar mi día completo. 🌈\n\nEres como un rayo de sol que ilumina todo a su paso, y yo soy afortunado de poder sentir tu calor. ☀️\n\n¡Cada día descubro algo nuevo que me hace quererte más! 💖",
      emoji: "💝",
      color: "from-purple-400 to-indigo-400"
    },
    {
      id: 3,
      title: "✨ Tercer Regalo Sorpresa",
      description: "Un mensaje especial del corazón...",
      content: "Gaby, eres más que una persona especial para mí. 🌟\n\nEres mi inspiración, mi motivación, mi alegría. Contigo aprendí que el amor verdadero existe y que la felicidad está en los pequeños detalles. 🍃\n\nGracias por ser exactamente quien eres: auténtica, brillante, divertida e inteligente. Gracias por aceptarme tal como soy. 🙏\n\n¡Que este nuevo año de tu vida esté lleno de momentos mágicos! ✨",
      emoji: "✨",
      color: "from-yellow-400 to-orange-400"
    },
    {
      id: 4,
      title: "🎉 Regalo Final Sorpresa",
      description: "El regalo más especial de todos...",
      content: "Y ahora, el regalo más importante de todos... 🎁\n\n¡TÚ! Sí, tú eres el regalo más preciado que he recibido en mi vida. 💎\n\nTu amor, tu amistad, tu presencia en mi vida es el regalo más valioso que alguien me ha dado. Cada momento contigo es un tesoro que guardo en mi corazón. 💖\n\n¡Que este cumpleaños sea el comienzo de un año lleno de amor, risas y momentos inolvidables! 🎂✨\n\nTe quiero más de lo que las palabras pueden expresar. 🥹",
      emoji: "🎉",
      color: "from-green-400 to-emerald-400"
    }
  ]
  
  const unlockNextStep = () => {
    const nextStep = currentStep + 1
    if (nextStep < steps.length && !unlockedSteps.includes(nextStep)) {
      setUnlockedSteps(prev => [...prev, nextStep])
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }
  
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowFinalMessage(true)
    }
  }
  
  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto">
      {/* Título y descripción */}
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
          🎁 Regalo Sorpresa 🎁
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
          Descubre regalos especiales que he preparado especialmente para ti. 
          <br />
          Cada uno esconde un mensaje lleno de amor y cariño. 💝
        </p>
      </div>
      
      {/* Indicador de progreso */}
      <div className="w-full max-w-2xl mx-auto mb-6">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6 shadow-lg border border-rose-200">
          <h3 className="text-xl font-bold text-rose-700 mb-4 text-center">📦 Progreso de Regalos</h3>
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 transition-all duration-500 ${
                  unlockedSteps.includes(index)
                    ? `bg-gradient-to-r ${step.color} shadow-lg scale-110`
                    : 'bg-gray-300'
                }`}>
                  {unlockedSteps.includes(index) ? step.emoji : index + 1}
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  unlockedSteps.includes(index) ? 'bg-rose-500' : 'bg-gray-300'
                }`}></div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Regalos desbloqueados: <span className="font-bold text-rose-600">{unlockedSteps.length}</span> / <span className="font-bold">{steps.length}</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Regalo actual */}
      <div className="w-full max-w-3xl mx-auto">
        <div className={`bg-gradient-to-br ${steps[currentStep].color} rounded-2xl p-8 shadow-xl border-2 border-white/20`}>
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
              <span className="text-4xl">{steps[currentStep].emoji}</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{steps[currentStep].title}</h3>
            <p className="text-white/90 text-lg">{steps[currentStep].description}</p>
          </div>
          
          {/* Contenido del regalo */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30">
            <div className="prose prose-lg max-w-none">
              <pre className="whitespace-pre-wrap font-serif text-gray-700 leading-relaxed text-base sm:text-lg">
                {steps[currentStep].content}
              </pre>
            </div>
          </div>
          
          {/* Controles de navegación */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goToPrevStep}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-all duration-300"
              disabled={currentStep === 0}
            >
              <div className="w-0 h-0 border-r-6 border-r-white border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </button>
            
            {/* Botón para desbloquear siguiente regalo */}
            {currentStep < steps.length - 1 && !unlockedSteps.includes(currentStep + 1) && (
              <button
                onClick={unlockNextStep}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-white/30"
              >
                🎁 Desbloquear Siguiente Regalo
              </button>
            )}
            
            <button
              onClick={goToNextStep}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-all duration-300"
              disabled={currentStep === steps.length - 1}
            >
              <div className="w-0 h-0 border-l-6 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </button>
          </div>
          
          {/* Indicador de regalo actual */}
          <div className="flex justify-center gap-2 mt-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-white scale-125' 
                    : unlockedSteps.includes(index)
                      ? 'bg-white/60 hover:bg-white/80'
                      : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Efecto de confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            >
              <span className="text-2xl">
                {['🎊', '🎉', '✨', '🌟', '💫', '🎁', '🎈', '💝'][Math.floor(Math.random() * 8)]}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Mensaje final */}
      {showFinalMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-rose-200 via-pink-200 to-purple-200 p-8 rounded-3xl border-4 border-rose-300 shadow-2xl text-center max-w-lg mx-4">
            <div className="text-4xl mb-4 animate-bounce">
              🎉
            </div>
            <h2 className="text-2xl font-bold text-rose-700 mb-4">
              ¡Has descubierto todos los regalos!
            </h2>
            <p className="text-rose-600 mb-6">
              Espero que hayas disfrutado cada uno de estos regalos especiales. 
              Recuerda que eres muy importante para mí y que te quiero mucho. 💖
            </p>
            <button
              onClick={() => setShowFinalMessage(false)}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      
      {/* Mensaje especial */}
      <div className="text-center mt-8">
        <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl p-6 shadow-lg border border-rose-200">
          <p className="text-xl font-bold text-rose-700 mb-2">💝 Mensaje Especial</p>
          <p className="text-gray-700 leading-relaxed">
            Cada regalo representa un momento especial de nuestro tiempo juntos. 
            <br />
            <span className="font-semibold text-rose-600">¡Que estos regalos te recuerden lo especial que eres! ✨</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// Componente RainbowBalloonTitle
function RainbowBalloonTitle({ onConfetti }: { onConfetti: () => void }) {
  // Animación arcoíris y efecto inflado
  return (
    <h1
      className="text-5xl sm:text-7xl md:text-8xl font-extrabold text-center select-none animate-balloon rainbow-text drop-shadow-lg cursor-pointer transition-transform duration-300"
      onMouseEnter={onConfetti}
      style={{ letterSpacing: '0.08em' }}
    >
      FELICIDADES
    </h1>
  )
}

// Componente SpecialDateSection
function SpecialDateSection() {
  // Calcular días y horas desde 17/08/1995
  const birthDate = new Date(1995, 7, 17) // Mes 7 = agosto (0-indexed)
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])
  const diffMs = now.getTime() - birthDate.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  return (
    <div className="w-full flex flex-col items-center gap-6">
              <div className="flex flex-col gap-3 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 shadow-lg border border-pink-200">
            <h3 className="text-xl font-bold text-pink-700 text-center mb-3">Desde el 17/08/1995, el mundo es mejor porque:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white/70 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{days.toLocaleString()}</div>
                <div className="text-sm text-gray-600">días llenos de tu esencia</div>
              </div>
              <div className="bg-white/70 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">{hours.toLocaleString()}</div>
                <div className="text-sm text-gray-600">horas de sonrisas y sueños</div>
              </div>
              <div className="bg-white/70 rounded-lg p-3 text-center animate-pulse">
                <div className="text-lg font-bold text-pink-600">🌟</div>
                <div className="text-sm text-gray-600">Y contando… ¡Que sigas iluminando cada día! 🌟</div>
              </div>
            </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <VintageCalendar />
                  <div className="bg-gradient-to-r from-gray-400 via-pink-400 to-purple-500 rounded-xl px-6 py-4 mt-2 shadow-xl flex justify-center items-center animate-glow-evolution relative overflow-hidden">
            <span
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-center text-white drop-shadow-lg animate-text-brightness cursor-pointer relative z-10"
              onMouseEnter={() => createShootingStars()}
              onClick={() => createShootingStars()}
            >
          ¡El día que el mundo se volvió más brillante!
            </span>
            <div id="shooting-stars-container" className="absolute inset-0 pointer-events-none"></div>
        </div>
      </div>
    </div>
  )
}

// Componente VintageCalendar (rediseñado moderno y festivo)
function VintageCalendar() {
  // Dibuja un calendario de agosto 1995 con el día 17 marcado
  const daysOfWeek = ["D", "L", "M", "M", "J", "V", "S"];
  const daysInMonth = 31;
  const firstDay = 2; // 0=Domingo, 1=Lunes, 2=Martes (agosto 1995 empieza martes)
  const today = 17;

  // Generar la matriz de días
  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 border-4 border-pink-200 rounded-3xl shadow-2xl p-4 w-[320px] sm:w-[400px] relative overflow-hidden">
        {/* Decoración superior */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          <span className="w-4 h-4 bg-pink-300 rounded-full shadow-md animate-bounce"></span>
          <span className="w-4 h-4 bg-yellow-300 rounded-full shadow-md animate-bounce delay-200"></span>
          <span className="w-4 h-4 bg-blue-300 rounded-full shadow-md animate-bounce delay-400"></span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="font-extrabold text-2xl text-pink-600 drop-shadow-sm tracking-wide">Agosto 1995</span>
          <span className="text-yellow-700 font-mono text-2xl">🎂</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-base font-bold mb-2">
          {daysOfWeek.map((d, i) => (
            <span key={d + i} className="text-pink-500 drop-shadow">{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarCells.map((day, i) =>
            day ? (
              <span
                key={i}
                className={
                  "relative rounded-xl px-2 py-2 transition-all duration-300 select-none " +
                  (day === today
                    ? "bg-gradient-to-br from-pink-400 via-yellow-300 to-purple-400 text-white font-extrabold shadow-xl border-4 border-pink-500 scale-110 animate-pulse-glow z-10" 
                    : "bg-white/70 text-pink-700 hover:bg-pink-100 shadow-sm border border-pink-100")
                }
                style={{ zIndex: day === today ? 10 : 1 }}
              >
                {day}
                {day === today && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl animate-bounce">🎉</span>
                )}
              </span>
            ) : (
              <span key={i}></span>
            )
          )}
        </div>
        {/* Decoración inferior */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          <span className="w-4 h-4 bg-blue-300 rounded-full shadow-md animate-bounce delay-200"></span>
          <span className="w-4 h-4 bg-yellow-300 rounded-full shadow-md animate-bounce delay-400"></span>
          <span className="w-4 h-4 bg-pink-300 rounded-full shadow-md animate-bounce"></span>
      </div>
    </div>
    </div>
  );
}

// Componente CakeIcon (SVG de pastel)
function CakeIcon(props: any) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <ellipse cx="32" cy="54" rx="24" ry="6" fill="#FDE68A" />
      <rect x="8" y="24" width="48" height="30" rx="8" fill="#F9A8D4" />
      <rect x="8" y="24" width="48" height="10" rx="5" fill="#FDE68A" />
      <rect x="8" y="34" width="48" height="10" rx="5" fill="#FECACA" />
      <rect x="8" y="44" width="48" height="10" rx="5" fill="#F9A8D4" />
      {/* Velas */}
      <rect x="18" y="14" width="2" height="10" rx="1" fill="#FBBF24" />
      <rect x="31" y="10" width="2" height="14" rx="1" fill="#FBBF24" />
      <rect x="44" y="14" width="2" height="10" rx="1" fill="#FBBF24" />
      {/* Llamas (se animarán en CakeModule) */}
    </svg>
  )
}



// Componente HeartMessageIcon (Corazón con mensaje)
function HeartMessageIcon(props: any) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      {/* Corazón principal */}
      <path d="M32 50 C32 50, 20 40, 20 30 C20 20, 32 15, 32 25 C32 15, 44 20, 44 30 C44 40, 32 50, 32 50 Z" fill="#EF4444"/>
      {/* Corazón interno */}
      <path d="M32 45 C32 45, 24 37, 24 30 C24 23, 32 20, 32 27 C32 20, 40 23, 40 30 C40 37, 32 45, 32 45 Z" fill="#FCA5A5"/>
      {/* Burbuja de mensaje */}
      <rect x="45" y="15" width="12" height="8" rx="4" fill="#8B5CF6"/>
      <path d="M45 19 L40 22 L45 25" fill="#8B5CF6"/>
      {/* Líneas del mensaje */}
      <rect x="47" y="17" width="6" height="1" rx="0.5" fill="white"/>
      <rect x="47" y="19" width="4" height="1" rx="0.5" fill="white"/>
      {/* Estrellas decorativas */}
      <path d="M15 20 L16 22 L18 22 L16.5 23.5 L17 26 L15 24.5 L13 26 L13.5 23.5 L12 22 L14 22 Z" fill="#FBBF24"/>
      <path d="M50 35 L51 37 L53 37 L51.5 38.5 L52 41 L50 39.5 L48 41 L48.5 38.5 L47 37 L49 37 Z" fill="#FBBF24"/>
    </svg>
  )
}

// Componente MusicNoteIcon (Notas musicales animadas)
function MusicNoteIcon(props: any) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      {/* Nota musical principal */}
      <ellipse cx="40" cy="25" rx="3" ry="2" fill="#3B82F6"/>
      <rect x="43" y="25" width="2" height="15" fill="#3B82F6"/>
      <ellipse cx="45" cy="40" rx="2" ry="1.5" fill="#3B82F6"/>
      {/* Nota musical secundaria */}
      <ellipse cx="25" cy="35" rx="2.5" ry="1.8" fill="#06B6D4"/>
      <rect x="27.5" y="35" width="1.5" height="12" fill="#06B6D4"/>
      <ellipse cx="29" cy="47" rx="1.5" ry="1.2" fill="#06B6D4"/>
      {/* Nota musical pequeña */}
      <ellipse cx="50" cy="15" rx="2" ry="1.5" fill="#8B5CF6"/>
      <rect x="52" y="15" width="1" height="8" fill="#8B5CF6"/>
      <ellipse cx="53" cy="23" rx="1" ry="0.8" fill="#8B5CF6"/>
      {/* Ondas de sonido */}
      <path d="M15 20 Q20 15, 25 20 Q30 25, 35 20" stroke="#F59E0B" strokeWidth="2" fill="none"/>
      <path d="M15 25 Q20 20, 25 25 Q30 30, 35 25" stroke="#F59E0B" strokeWidth="2" fill="none"/>
      <path d="M15 30 Q20 25, 25 30 Q30 35, 35 30" stroke="#F59E0B" strokeWidth="2" fill="none"/>
    </svg>
  )
}

// Componente MagicWishIcon (Estrella mágica con deseos)
function MagicWishIcon(props: any) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      {/* Estrella principal */}
      <path d="M32 10 L36 24 L50 24 L40 32 L44 46 L32 38 L20 46 L24 32 L14 24 L28 24 Z" fill="#F59E0B"/>
      <path d="M32 15 L34 25 L42 25 L36 30 L38 40 L32 35 L26 40 L28 30 L22 25 L30 25 Z" fill="#FDE68A"/>
      {/* Estrellas pequeñas */}
      <path d="M15 15 L16 18 L19 18 L16.5 20.5 L17 24 L15 22 L13 24 L13.5 20.5 L11 18 L14 18 Z" fill="#F472B6"/>
      <path d="M50 40 L51 43 L54 43 L51.5 45.5 L52 49 L50 47 L48 49 L48.5 45.5 L46 43 L49 43 Z" fill="#A78BFA"/>
      <path d="M10 45 L11 48 L14 48 L11.5 50.5 L12 54 L10 52 L8 54 L8.5 50.5 L6 48 L9 48 Z" fill="#34D399"/>
      {/* Chispas mágicas */}
      <circle cx="20" cy="20" r="1" fill="#FBBF24"/>
      <circle cx="45" cy="15" r="1" fill="#F472B6"/>
      <circle cx="55" cy="35" r="1" fill="#A78BFA"/>
      <circle cx="15" cy="50" r="1" fill="#34D399"/>
      <circle cx="40" cy="55" r="1" fill="#F59E0B"/>
    </svg>
  )
}

// Componente GameIcon (Control de juego mágico)
function GameIcon(props: any) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      {/* Control principal */}
      <rect x="12" y="20" width="40" height="24" rx="8" fill="#10B981"/>
      <rect x="14" y="22" width="36" height="20" rx="6" fill="#34D399"/>
      {/* Botones direccionales */}
      <circle cx="25" cy="32" r="4" fill="#059669"/>
      <circle cx="25" cy="32" r="2" fill="#10B981"/>
      <rect x="23" y="28" width="4" height="8" rx="2" fill="#059669"/>
      <rect x="28" y="23" width="8" height="4" rx="2" fill="#059669"/>
      {/* Botones de acción */}
      <circle cx="45" cy="28" r="3" fill="#DC2626"/>
      <circle cx="45" cy="36" r="3" fill="#2563EB"/>
      {/* Pantalla del juego */}
      <rect x="18" y="26" width="12" height="8" rx="2" fill="#1F2937"/>
      <rect x="19" y="27" width="10" height="6" rx="1" fill="#10B981"/>
      {/* Estrellas de puntos */}
      <path d="M50 15 L51 17 L53 17 L51.5 18.5 L52 21 L50 19.5 L48 21 L48.5 18.5 L47 17 L49 17 Z" fill="#FBBF24"/>
      <path d="M15 45 L16 47 L18 47 L16.5 48.5 L17 51 L15 49.5 L13 51 L13.5 48.5 L12 47 L14 47 Z" fill="#F472B6"/>
    </svg>
  )
}



// Módulo de flores eliminado - listo para nuevo contenido
function FlowersModule() {
  const [selectedFlowers, setSelectedFlowers] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedFlowers')
      return saved ? JSON.parse(saved) : []
    }
    return []
  });
  const [showDetail, setShowDetail] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('showDetail') === 'true'
    }
    return false
  });

  // Guardar estado de flores en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedFlowers', JSON.stringify(selectedFlowers))
    }
  }, [selectedFlowers])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('showDetail', showDetail.toString())
    }
  }, [showDetail])

  const flowers = [
    {
      name: "Rosas",
      emoji: "🌹",
      image: "/rosas.jpeg",
      color: "from-red-400 to-pink-400",
      description: "El símbolo del amor más puro y apasionado"
    },
    {
      name: "Tulipanes",
      emoji: "🌷",
      image: "/tulipanes.jpg",
      color: "from-pink-400 to-purple-400",
      description: "La elegancia y la gracia en cada pétalo"
    },
    {
      name: "Lirios",
      emoji: "🌸",
      image: "/lirios.webp",
      color: "from-white to-pink-200",
      description: "La pureza y la belleza celestial"
    },
    {
      name: "Orquídeas",
      emoji: "🌺",
      image: "/orquideas.webp",
      color: "from-purple-400 to-pink-400",
      description: "La sofisticación y el misterio natural"
    },
    {
      name: "Girasoles",
      emoji: "🌻",
      image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=200&h=200&fit=crop&crop=center",
      color: "from-yellow-400 to-orange-400",
      description: "La alegría y la luz que sigues al sol"
    },
    {
      name: "Margaritas",
      emoji: "��",
      image: "/margarita.jpg",
      color: "from-yellow-200 to-white",
      description: "La inocencia y la simplicidad hermosa"
    },
    {
      name: "Claveles",
      emoji: "🌺",
      image: "/clavel.jpg",
      color: "from-red-300 to-pink-300",
      description: "El amor maternal y la admiración profunda"
    }
  ]

  const toggleFlower = (flowerName: string) => {
    setSelectedFlowers([flowerName]) // Solo permite una flor seleccionada
    setShowDetail(false) // Oculta el detalle si se cambia de flor
  }

  const handleShowDetail = () => {
    if (selectedFlowers.length === 1) {
      setShowDetail(true)
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-6xl mx-auto">
      {/* Título y descripción */}
      <div className="text-center mb-4 sm:mb-6 px-2 sm:px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2 sm:mb-4">
          🌸 Tus Flores 🌸
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl px-2">
          Selecciona la flor que más te gusta y descubre el mensaje especial que tiene para ti
        </p>
      </div>
      {/* Grid de flores */}
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {flowers.map((flower, index) => (
            <div
              key={flower.name}
              className={`cursor-pointer transform transition-all duration-300 hover:scale-105 ${selectedFlowers.includes(flower.name) ? 'ring-4 ring-pink-400' : ''}`}
              onClick={() => toggleFlower(flower.name)}
            >
              <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-lg border-2 border-gray-200 hover:border-pink-300 transition-all duration-300">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden border-2 border-gray-200">
                  <img 
                    src={flower.image} 
                    alt={flower.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{flower.name}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{flower.description}</p>
                {selectedFlowers.includes(flower.name) && (
                  <div className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg font-bold">
                    Seleccionada
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Botón para ver detalle especial */}
      {selectedFlowers.length > 0 && (
        <div className="text-center mt-6 sm:mt-8 px-2 sm:px-4">
          <button
            onClick={handleShowDetail}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
          >
            🌸 Seleccionar
          </button>
        </div>
      )}
      {/* Detalle especial de la flor seleccionada */}
      {showDetail && selectedFlowers.length === 1 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="max-w-lg w-full mx-2 sm:mx-4">
            <FlorDetalleEspecial flor={selectedFlowers[0] as keyof typeof detallesPorFlor} />
            <button
              onClick={() => setShowDetail(false)}
              className="mt-4 sm:mt-6 w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-2 sm:py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 text-sm sm:text-base"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Detalles especiales por flor
const detallesPorFlor = {
  Rosas: {
    tipo: 'mensaje',
    mensaje: 'El amor más puro y apasionado florece en tu corazón.',
    efecto: 'destellos',
    sonido: 'latido',
  },
  Tulipanes: {
    tipo: 'imagen',
    imagen: '/public/tulipanes.jpg',
    curiosidad: 'En Holanda, los tulipanes simbolizan prosperidad y alegría.',
    fondo: 'naranja',
  },
  Lirios: {
    tipo: 'mensaje',
    mensaje: 'La elegancia y la pureza se reflejan en cada uno de tus gestos.',
    efecto: 'brillos',
    sonido: 'agua',
  },
  Orquídeas: {
    tipo: 'curiosidad',
    curiosidad: 'Las orquídeas representan la belleza rara y el misterio.',
    efecto: 'neblina',
    fondo: 'violeta',
  },
  Girasoles: {
    tipo: 'ramo',
    mensaje: 'Tu alegría ilumina la vida de quienes te rodean.',
    ramo: 'girasoles',
    fondo: 'campo',
  },
  Margaritas: {
    tipo: 'minijuego',
    mensaje: 'La inocencia y la sinceridad te definen.',
    minijuego: 'deshojar',
    fondo: 'amarillo',
  },
  Claveles: {
    tipo: 'poema',
    poema: 'El clavel, símbolo de admiración y cariño profundo.',
    sticker: '/public/clavel.jpg',
    fondo: 'rosado',
  },
};

// Componente para mostrar el detalle especial de la flor seleccionada
function FlorDetalleEspecial({ flor }: { flor: keyof typeof detallesPorFlor }) {
  if (!flor) return null;
  const detalle = detallesPorFlor[flor];
  if (!detalle) return null;

  switch (detalle.tipo) {
    case 'mensaje':
      return (
        <div className="text-lg sm:text-xl md:text-2xl text-center p-4 sm:p-6 bg-white/80 rounded-xl shadow-lg">
          <span>{'mensaje' in detalle ? detalle.mensaje : ''}</span>
          {'efecto' in detalle && detalle.efecto === 'destellos' && <span className="block mt-3 sm:mt-4 animate-pulse text-pink-400">✨✨✨</span>}
        </div>
      );
    case 'imagen':
      return (
        <div className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white/80 rounded-xl shadow-lg">
          {'imagen' in detalle && <img src={detalle.imagen} alt={flor} className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-2xl shadow-md" />}
          <span className="text-sm sm:text-base md:text-lg text-center">{'curiosidad' in detalle ? detalle.curiosidad : ''}</span>
        </div>
      );
    case 'curiosidad':
      return (
        <div className="text-lg sm:text-xl text-center p-4 sm:p-6 bg-white/80 rounded-xl shadow-lg">
          <span>{'curiosidad' in detalle ? detalle.curiosidad : ''}</span>
        </div>
      );
    case 'interaccion':
      return (
        <div className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white/80 rounded-xl shadow-lg">
          <button
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-yellow-300 flex items-center justify-center shadow-lg hover:rotate-180 transition-transform duration-700"
            onClick={e => e.currentTarget.classList.toggle('rotate-180')}
          >
            🌻
          </button>
          <span className="text-sm sm:text-base md:text-lg text-center">{'mensaje' in detalle ? detalle.mensaje : ''}</span>
        </div>
      );
    case 'minijuego':
      return <DeshojarMargarita mensaje={'mensaje' in detalle ? detalle.mensaje : ''} />;
    case 'poema':
      return (
        <div className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white/80 rounded-xl shadow-lg">
          <span className="italic text-sm sm:text-base md:text-lg text-center">{'poema' in detalle ? detalle.poema : ''}</span>
          {'sticker' in detalle && detalle.sticker && <img src={detalle.sticker} alt="clavel" className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl" />}
        </div>
      );
    case 'ramo':
      return <RamoGirasoles mensaje={'mensaje' in detalle ? detalle.mensaje : ''} />;
    default:
      return null;
  }
}

// Componente del ramo de girasoles
function RamoGirasoles({ mensaje }: { mensaje: string }) {
  const [showBouquet, setShowBouquet] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [petals, setPetals] = useState(Array(12).fill(true));
  const [currentPetal, setCurrentPetal] = useState(0);
  const [showTypewriter, setShowTypewriter] = useState(false);

  const petalMessages = [
    "Eres mi sol ☀️",
    "Mi alegría 🌻",
    "Mi inspiración ✨",
    "Mi felicidad 😊",
    "Mi amor 💖",
    "Mi todo 🌟",
    "Mi sueño 🌙",
    "Mi presente 🎁",
    "Mi futuro 🚀",
    "Mi vida 💫",
    "Mi corazón ❤️",
    "Mi Gaby 🌸"
  ];

  const handleShowBouquet = () => {
    setShowBouquet(true);
    setTimeout(() => setShowConfetti(true), 500);
    setTimeout(() => setShowMessage(true), 2000);
  };

  const handlePetalClick = (index: number) => {
    if (petals[index]) {
      const newPetals = [...petals];
      newPetals[index] = false;
      setPetals(newPetals);
      setCurrentPetal(index);
      
      if (newPetals.filter(p => !p).length === 12) {
        setTimeout(() => setShowTypewriter(true), 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-200 rounded-2xl shadow-xl">
      {!showBouquet ? (
        <button
          onClick={handleShowBouquet}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 text-lg sm:text-xl"
        >
          🌻 ¡Recibir mi ramo de girasoles! 🌻
        </button>
      ) : (
        <>
          {/* Confeti dorado */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-2xl animate-confetti-gold"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
          )}

          {/* Ramo de girasoles */}
          <div className="relative animate-bouquet-delivery">
            <div className="relative w-48 h-60 sm:w-64 sm:h-80">
              {/* Tallos */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-32 bg-gradient-to-t from-green-600 to-green-400 rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-28 bg-gradient-to-t from-green-600 to-green-400 rounded-full" style={{ transform: 'translateX(-20px)' }}></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-30 bg-gradient-to-t from-green-600 to-green-400 rounded-full" style={{ transform: 'translateX(20px)' }}></div>
              
              {/* Girasoles */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 animate-sunflower-glow">
                <div className="text-6xl">🌻</div>
              </div>
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 animate-sunflower-glow" style={{ transform: 'translateX(-25px)', animationDelay: '0.5s' }}>
                <div className="text-5xl">🌻</div>
              </div>
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 animate-sunflower-glow" style={{ transform: 'translateX(25px)', animationDelay: '1s' }}>
                <div className="text-5xl">🌻</div>
              </div>
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 animate-sunflower-glow" style={{ transform: 'translateX(-15px)', animationDelay: '1.5s' }}>
                <div className="text-4xl">🌻</div>
              </div>
              <div className="absolute top-14 left-1/2 transform -translate-x-1/2 animate-sunflower-glow" style={{ transform: 'translateX(15px)', animationDelay: '2s' }}>
                <div className="text-4xl">🌻</div>
              </div>
              
              {/* Cinta */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
            </div>
          </div>

          {/* Mensaje inicial */}
          {showMessage && !showTypewriter && (
            <div className="text-center px-2 sm:px-4">
              <h3 className="text-xl sm:text-2xl font-bold text-yellow-800 mb-3 sm:mb-4">
                🌻 ¡Tu ramo de girasoles! 🌻
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-yellow-700 mb-4 sm:mb-6">
                Haz clic en cada pétalo para descubrir un mensaje especial
              </p>
            </div>
          )}

          {/* Pétalos interactivos */}
          {showMessage && (
            <div className="relative w-40 h-40 sm:w-48 sm:h-48">
              {petals.map((vivo, i) =>
                vivo ? (
                  <button
                    key={i}
                    className="absolute left-1/2 top-1/2 origin-bottom text-2xl select-none cursor-pointer hover:scale-110 transition-transform duration-200"
                    style={{
                      transform: `rotate(${i * 30}deg) translateY(-80px)`
                    }}
                    onClick={() => handlePetalClick(i)}
                  >
                    🌻
                  </button>
                ) : (
                  <div
                    key={i}
                    className="absolute left-1/2 top-1/2 origin-bottom text-lg animate-petal-fall"
                    style={{
                      transform: `rotate(${i * 30}deg) translateY(-80px)`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  >
                    ✨
                  </div>
                )
              )}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">
                🌻
              </div>
            </div>
          )}

          {/* Mensajes de los pétalos */}
          {currentPetal < 12 && !petals[currentPetal] && (
            <div className="text-center p-3 sm:p-4 bg-white/90 rounded-xl shadow-lg animate-fade-in mx-2 sm:mx-4">
              <p className="text-lg sm:text-xl font-bold text-yellow-800">
                {petalMessages[currentPetal]}
              </p>
            </div>
          )}

          {/* Mensaje final con typewriter */}
          {showTypewriter && (
            <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-xl shadow-lg mx-2 sm:mx-4">
              <div className="overflow-hidden">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-800 animate-typewriter whitespace-nowrap">
                  {mensaje}
                </p>
                <span className="inline-block w-1 h-6 sm:h-8 bg-yellow-800 animate-blink ml-1"></span>
              </div>
              <div className="mt-3 sm:mt-4 text-3xl sm:text-4xl animate-bounce">
                🌻✨💖
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Mini-juego: Deshojar margarita
function DeshojarMargarita({ mensaje }: { mensaje: string }) {
  const [petalos, setPetalos] = useState(Array(8).fill(true));
  const [fin, setFin] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32">
        {petalos.map((vivo, i) =>
          vivo ? (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 origin-bottom text-3xl select-none cursor-pointer"
              style={{
                transform: `rotate(${i * 45}deg) translateY(-60px)`
              }}
              onClick={() => {
                const next = [...petalos];
                next[i] = false;
                setPetalos(next);
                if (next.every(p => !p)) setFin(true);
              }}
            >
              🌼
            </span>
          ) : null
        )}
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">🌼</span>
      </div>
      <span className="text-sm sm:text-base md:text-lg text-center mt-2 px-2">{fin ? mensaje : 'Haz clic en los pétalos para deshojar la margarita'}</span>
    </div>
  );
}

// Component WishesModule - Deseos Mágicos
function WishesModule() {
  const [currentWish, setCurrentWish] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('currentWish') || '0')
    }
    return 0
  })
  const [showConfetti, setShowConfetti] = useState(false)
  const [showFinalMessage, setShowFinalMessage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('showFinalMessage') === 'true'
    }
    return false
  })
  const [unlockedWishes, setUnlockedWishes] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unlockedWishes')
      return saved ? JSON.parse(saved) : [0]
    }
    return [0]
  })
  const [wishVisible, setWishVisible] = useState(false)
  
  // Guardar progreso de deseos en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentWish', currentWish.toString())
    }
  }, [currentWish])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('showFinalMessage', showFinalMessage.toString())
    }
  }, [showFinalMessage])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('unlockedWishes', JSON.stringify(unlockedWishes))
    }
  }, [unlockedWishes])
  
  const wishes = [
    {
      id: 1,
      title: "🌟 Deseo de Felicidad",
      category: "Emocional",
      wish: "Que cada mañana te despiertes con una sonrisa en el rostro y la certeza de que eres amada. Que encuentres alegría en los pequeños momentos y que tu risa ilumine cada día. Que la felicidad sea tu compañera constante.",
      emoji: "🌟",
      color: "from-yellow-400 to-orange-400",
      icon: "😊"
    },
    {
      id: 2,
      title: "💪 Deseo de Fortaleza",
      category: "Personal",
      wish: "Que tengas la fuerza interior para superar cualquier obstáculo que la vida te presente. Que tu determinación sea inquebrantable y que siempre encuentres el coraje para perseguir tus sueños, sin importar cuán grandes sean.",
      emoji: "💪",
      color: "from-blue-400 to-cyan-400",
      icon: "🦁"
    },
    {
      id: 3,
      title: "💖 Deseo de Amor",
      category: "Relacional",
      wish: "Que seas rodeada de personas que te amen incondicionalmente, que te valoren por quien eres y que te apoyen en cada paso de tu camino. Que el amor que das regrese a ti multiplicado.",
      emoji: "💖",
      color: "from-pink-400 to-rose-400",
      icon: "💕"
    },
    {
      id: 4,
      title: "🎯 Deseo de Éxito",
      category: "Profesional",
      wish: "Que alcances todos los objetivos que te propongas, que tus esfuerzos sean recompensados y que encuentres satisfacción en cada logro. Que tu talento y dedicación te lleven a lugares increíbles.",
      emoji: "🎯",
      color: "from-green-400 to-emerald-400",
      icon: "🏆"
    },
    {
      id: 5,
      title: "✨ Deseo de Magia",
      category: "Espiritual",
      wish: "Que la magia del universo te sorprenda cada día, que encuentres belleza en lo inesperado y que tu espíritu siempre mantenga esa chispa de asombro y curiosidad que te hace única.",
      emoji: "✨",
      color: "from-purple-400 to-indigo-400",
      icon: "🔮"
    },
    {
      id: 6,
      title: "🌍 Deseo de Aventura",
      category: "Experiencial",
      wish: "Que viajes por el mundo y descubras lugares increíbles, que vivas experiencias que te cambien la vida y que cada día traiga algo nuevo y emocionante. Que tu vida sea una gran aventura.",
      emoji: "🌍",
      color: "from-teal-400 to-cyan-400",
      icon: "✈️"
    },
    {
      id: 7,
      title: "🧠 Deseo de Sabiduría",
      category: "Intelectual",
      wish: "Que tu mente siempre esté abierta al aprendizaje, que encuentres respuestas a tus preguntas y que tu curiosidad te lleve a descubrir cosas increíbles. Que la sabiduría sea tu guía.",
      emoji: "🧠",
      color: "from-indigo-400 to-purple-400",
      icon: "📚"
    },
    {
      id: 8,
      title: "🎨 Deseo de Creatividad",
      category: "Artístico",
      wish: "Que tu creatividad fluya sin límites, que encuentres nuevas formas de expresarte y que tu imaginación te lleve a crear cosas hermosas. Que el arte y la belleza siempre estén presentes en tu vida.",
      emoji: "🎨",
      color: "from-violet-400 to-purple-400",
      icon: "🎭"
    },
    {
      id: 9,
      title: "🏠 Deseo de Hogar",
      category: "Familiar",
      wish: "Que siempre tengas un lugar donde sentirte segura y amada, que tu hogar esté lleno de risas, amor y momentos especiales. Que encuentres paz y tranquilidad en tu espacio personal.",
      emoji: "🏠",
      color: "from-amber-400 to-orange-400",
      icon: "🏡"
    },
    {
      id: 10,
      title: "🌈 Deseo de Esperanza",
      category: "Futuro",
      wish: "Que siempre mantengas la esperanza en tu corazón, que creas en un futuro brillante y que tu optimismo te ayude a superar cualquier dificultad. Que cada día sea una nueva oportunidad para brillar.",
      emoji: "🌈",
      color: "from-rose-400 to-pink-400",
      icon: "⭐"
    }
  ]
  
  const unlockNextWish = () => {
    const nextWish = currentWish + 1
    if (nextWish < wishes.length && !unlockedWishes.includes(nextWish)) {
      setUnlockedWishes(prev => [...prev, nextWish])
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }
  
  const goToNextWish = () => {
    if (currentWish < wishes.length - 1) {
      setWishVisible(false)
      setTimeout(() => {
        const nextWish = currentWish + 1
        setCurrentWish(nextWish)
        // Desbloquear automáticamente el deseo al que se navega
        if (!unlockedWishes.includes(nextWish)) {
          setUnlockedWishes(prev => [...prev, nextWish])
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
        setWishVisible(true)
      }, 300)
    } else {
      setShowFinalMessage(true)
    }
  }
  
  const goToPrevWish = () => {
    if (currentWish > 0) {
      setWishVisible(false)
      setTimeout(() => {
        const prevWish = currentWish - 1
        setCurrentWish(prevWish)
        // Desbloquear automáticamente el deseo al que se navega
        if (!unlockedWishes.includes(prevWish)) {
          setUnlockedWishes(prev => [...prev, prevWish])
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
        setWishVisible(true)
      }, 300)
    }
  }
  
  useEffect(() => {
    setWishVisible(true)
  }, [])
  
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl mx-auto px-2 sm:px-4">
      {/* Título y descripción */}
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2 sm:mb-4">
          ✨ Deseos Mágicos ✨
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl px-2">
          Una colección de deseos especiales que quiero que se cumplan para ti. 
          <br className="hidden sm:block" />
          Cada uno está lleno de amor y buenas intenciones. 🌟
        </p>
      </div>
      
      {/* Indicador de progreso */}
      <div className="w-full max-w-2xl mx-auto mb-4 sm:mb-6">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-yellow-200">
          <h3 className="text-lg sm:text-xl font-bold text-yellow-700 mb-3 sm:mb-4 text-center">🎯 Progreso de Deseos</h3>
          <div className="grid grid-cols-5 sm:grid-cols-5 gap-1 sm:gap-2 mb-3 sm:mb-4">
            {wishes.map((wish, index) => (
              <div key={wish.id} className="flex flex-col items-center">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm mb-1 transition-all duration-500 ${
                  unlockedWishes.includes(index)
                    ? `bg-gradient-to-r ${wish.color} shadow-lg scale-110`
                    : 'bg-gray-300'
                }`}>
                  {unlockedWishes.includes(index) ? wish.icon : index + 1}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Deseos desbloqueados: <span className="font-bold text-yellow-600">{unlockedWishes.length}</span> / <span className="font-bold">{wishes.length}</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Deseo actual */}
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-4">
        <div className={`bg-gradient-to-br ${wishes[currentWish].color} rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border-2 border-white/20`}>
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
              <span className="text-2xl sm:text-3xl md:text-4xl">{wishes[currentWish].emoji}</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">{wishes[currentWish].title}</h3>
            <p className="text-white/90 text-sm sm:text-base md:text-lg mb-2">{wishes[currentWish].category}</p>
          </div>
          
          {/* Contenido del deseo */}
          <div className={`bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-white/30 transition-all duration-500 ${
            wishVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}>
            <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg font-medium">
                {wishes[currentWish].wish}
              </p>
            </div>
          </div>
          
          {/* Controles de navegación */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button
              onClick={goToPrevWish}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-all duration-300"
              disabled={currentWish === 0}
            >
              <div className="w-0 h-0 border-r-4 sm:border-r-6 border-r-white border-t-3 sm:border-t-4 border-t-transparent border-b-3 sm:border-b-4 border-b-transparent"></div>
            </button>
            
            <button
              onClick={goToNextWish}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-all duration-300"
              disabled={currentWish === wishes.length - 1}
            >
              <div className="w-0 h-0 border-l-4 sm:border-l-6 border-l-white border-t-3 sm:border-t-4 border-t-transparent border-b-3 sm:border-b-4 border-b-transparent"></div>
            </button>
          </div>
          
          {/* Indicador de deseo actual */}
          <div className="flex justify-center gap-1 sm:gap-2 mt-4 sm:mt-6">
            {wishes.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setWishVisible(false)
                  setTimeout(() => {
                    setCurrentWish(index)
                    // Desbloquear automáticamente el deseo al que se navega
                    if (!unlockedWishes.includes(index)) {
                      setUnlockedWishes(prev => [...prev, index])
                      setShowConfetti(true)
                      setTimeout(() => setShowConfetti(false), 3000)
                    }
                    setWishVisible(true)
                  }, 300)
                }}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentWish 
                    ? 'bg-white scale-125' 
                    : unlockedWishes.includes(index)
                      ? 'bg-white/60 hover:bg-white/80'
                      : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Efecto de confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            >
              <span className="text-2xl">
                {['✨', '🌟', '💫', '⭐', '🎊', '🎉', '💖', '🌈'][Math.floor(Math.random() * 8)]}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Mensaje final */}
      {showFinalMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-yellow-300 shadow-2xl text-center max-w-sm sm:max-w-lg mx-4">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 animate-bounce">
              ✨
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-700 mb-3 sm:mb-4">
              ¡Has descubierto todos los deseos!
            </h2>
            <p className="text-sm sm:text-base text-yellow-600 mb-4 sm:mb-6">
              Que todos estos deseos se cumplan en tu vida. 
              Recuerda que mereces todo lo hermoso que el universo tiene para ofrecer. 🌟
            </p>
            <button
              onClick={() => setShowFinalMessage(false)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      
      {/* Mensaje especial */}
      <div className="text-center mt-6 sm:mt-8 px-2 sm:px-4">
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-yellow-200">
          <p className="text-lg sm:text-xl font-bold text-yellow-700 mb-2">💝 Mensaje Especial</p>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Cada deseo está pensado especialmente para ti y tu felicidad. 
            <br className="hidden sm:block" />
            <span className="font-semibold text-yellow-600">¡Que la magia del universo haga realidad todos estos deseos! ✨</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// Component DrawingIcon (Lápiz y papel)
function DrawingIcon(props: any) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      {/* Papel */}
      <rect x="12" y="20" width="32" height="28" rx="2" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
      <rect x="14" y="22" width="28" height="24" rx="1" fill="#F9FAFB"/>
      {/* Líneas del papel */}
      <rect x="16" y="26" width="24" height="1" fill="#E5E7EB"/>
      <rect x="16" y="30" width="20" height="1" fill="#E5E7EB"/>
      <rect x="16" y="34" width="22" height="1" fill="#E5E7EB"/>
      <rect x="16" y="38" width="18" height="1" fill="#E5E7EB"/>
      {/* Lápiz */}
      <rect x="40" y="15" width="3" height="20" rx="1.5" fill="#8B5CF6"/>
      <rect x="40.5" y="15" width="2" height="20" rx="1" fill="#A78BFA"/>
      {/* Punta del lápiz */}
      <path d="M40 15 L42.5 12 L43.5 12 L41 15 Z" fill="#6B7280"/>
      {/* Borrador */}
      <rect x="40" y="35" width="3" height="3" fill="#F472B6"/>
      {/* Dibujo en el papel */}
      <path d="M18 28 Q22 26, 26 28 Q30 30, 34 28" stroke="#8B5CF6" strokeWidth="2" fill="none"/>
      <circle cx="22" cy="32" r="2" fill="#A78BFA"/>
      <path d="M28 36 L32 34 L36 36" stroke="#F472B6" strokeWidth="2" fill="none"/>
      {/* Estrellas decorativas */}
      <path d="M50 25 L51 27 L53 27 L51.5 28.5 L52 31 L50 29.5 L48 31 L48.5 28.5 L47 27 L49 27 Z" fill="#FBBF24"/>
      <path d="M15 45 L16 47 L18 47 L16.5 48.5 L17 51 L15 49.5 L13 51 L13.5 48.5 L12 47 L14 47 Z" fill="#A78BFA"/>
    </svg>
  )
}

// Component DrawingModule - Módulo de Dibujo
function DrawingModule() {
  // Polyfill para localStorage en navegadores que no lo soportan
  const getLocalStorage = () => {
    try {
      return localStorage
    } catch (e) {
      console.warn('localStorage no disponible, usando fallback')
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {}
      }
    }
  }

  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(5)
  const [brushColor, setBrushColor] = useState('#FF69B4')
  const [selectedFrame, setSelectedFrame] = useState<'none' | 'pink' | 'yellow' | 'green' | 'purple' | 'blue' | 'orange'>('none')
  const [tool, setTool] = useState<'brush' | 'pencil' | 'pen' | 'eraser' | 'spray' | 'fill' | 'line' | 'rectangle' | 'circle'>('brush')
  const [opacity, setOpacity] = useState(100)
  const [isFilled, setIsFilled] = useState(false)
  const [startPoint, setStartPoint] = useState<{x: number, y: number} | null>(null)
  const [savedDrawings, setSavedDrawings] = useState<string[]>([])
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)

  const colors = [
    // Colores temáticos de cumpleaños
    '#FF69B4', // Rosa brillante
    '#FF1493', // Rosa profundo
    '#FFD700', // Dorado
    '#FF6347', // Coral
    '#9370DB', // Violeta
    '#4169E1', // Azul real
    '#32CD32', // Verde lima
    '#FF4500', // Naranja rojizo
    '#DA70D6', // Orquídea
    '#FFB6C1', // Rosa claro
    '#000000'  // Negro
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Configuración del canvas con compatibilidad multi-navegador
    const dpr = (window.devicePixelRatio || 1)
    const rect = canvas.getBoundingClientRect()
    
    // Establecer tamaño del canvas considerando devicePixelRatio para pantallas de alta densidad
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    
    const context = canvas.getContext('2d', { 
      alpha: true,
      willReadFrequently: true 
    })
    if (!context) return

    // Escalar el contexto para pantallas de alta densidad
    context.scale(dpr, dpr)
    
    // Configuración inicial del contexto con compatibilidad
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = brushColor
    context.lineWidth = brushSize
    context.imageSmoothingEnabled = true
    // Polyfill para imageSmoothingQuality (no disponible en todos los navegadores)
    if ('imageSmoothingQuality' in context) {
      (context as any).imageSmoothingQuality = 'high'
    }
    
    contextRef.current = context

    // Cargar dibujos guardados desde localStorage con manejo de errores
    try {
      const storage = getLocalStorage()
      const saved = storage.getItem('savedDrawings')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setSavedDrawings(parsed)
        }
      }
    } catch (error) {
      console.warn('Error al cargar dibujos guardados:', error)
      // Limpiar localStorage corrupto
      const storage = getLocalStorage()
      storage.removeItem('savedDrawings')
    }
  }, [])

  useEffect(() => {
    if (contextRef.current) {
      switch (tool) {
        case 'brush':
          contextRef.current.strokeStyle = brushColor
          contextRef.current.lineWidth = brushSize
          contextRef.current.globalAlpha = opacity / 100
          break
        case 'pencil':
          contextRef.current.strokeStyle = '#888888'
          contextRef.current.lineWidth = brushSize * 0.8
          contextRef.current.globalAlpha = 0.6
          break
        case 'pen':
          contextRef.current.strokeStyle = '#000000'
          contextRef.current.lineWidth = Math.max(1, brushSize * 0.5)
          contextRef.current.globalAlpha = 1
          break
        case 'eraser':
          contextRef.current.strokeStyle = '#FFFFFF'
          contextRef.current.lineWidth = brushSize
          contextRef.current.globalAlpha = 1
          break
        case 'spray':
          contextRef.current.strokeStyle = brushColor
          contextRef.current.lineWidth = 1
          contextRef.current.globalAlpha = opacity / 100
          break
        case 'fill':
          contextRef.current.fillStyle = brushColor
          contextRef.current.globalAlpha = opacity / 100
          break
        case 'line':
        case 'rectangle':
        case 'circle':
          contextRef.current.strokeStyle = brushColor
          contextRef.current.fillStyle = isFilled ? brushColor : 'transparent'
          contextRef.current.lineWidth = brushSize
          contextRef.current.globalAlpha = opacity / 100
          break
      }
    }
  }, [brushColor, brushSize, tool, opacity, isFilled])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Prevenir comportamiento por defecto para eventos táctiles
    if ('touches' in e) {
      e.preventDefault()
    }
    
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas || !contextRef.current) return

    const rect = canvas.getBoundingClientRect()
    let x: number, y: number
    
    if ('touches' in e && e.touches.length > 0) {
      // Evento táctil
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else if ('clientX' in e) {
      // Evento de mouse
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    } else {
      return
    }

    if (tool === 'fill') {
      // Herramienta de relleno - versión simplificada
      const size = 20
      contextRef.current.fillStyle = brushColor
      contextRef.current.globalAlpha = opacity / 100
      contextRef.current.fillRect(x - size/2, y - size/2, size, size)
    } else if (tool === 'line' || tool === 'rectangle' || tool === 'circle') {
      // Herramientas de formas
      setStartPoint({x, y})
    } else {
      // Herramientas de dibujo libre
      contextRef.current.beginPath()
      contextRef.current.moveTo(x, y)
    }
  }



  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return

    // Prevenir comportamiento por defecto para eventos táctiles
    if ('touches' in e) {
      e.preventDefault()
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    let x: number, y: number
    
    if ('touches' in e && e.touches.length > 0) {
      // Evento táctil
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else if ('clientX' in e) {
      // Evento de mouse
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    } else {
      return
    }

    if (tool === 'spray') {
      // Herramienta de spray
      for (let i = 0; i < 20; i++) {
        const sprayX = x + (Math.random() - 0.5) * brushSize * 2
        const sprayY = y + (Math.random() - 0.5) * brushSize * 2
        contextRef.current.fillRect(sprayX, sprayY, 1, 1)
      }
    } else if (tool === 'line' && startPoint) {
      // Herramienta de línea
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height)
      contextRef.current.beginPath()
      contextRef.current.moveTo(startPoint.x, startPoint.y)
      contextRef.current.lineTo(x, y)
      contextRef.current.stroke()
    } else if (tool === 'rectangle' && startPoint) {
      // Herramienta de rectángulo
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height)
      const width = x - startPoint.x
      const height = y - startPoint.y
      if (isFilled) {
        contextRef.current.fillRect(startPoint.x, startPoint.y, width, height)
      }
      contextRef.current.strokeRect(startPoint.x, startPoint.y, width, height)
    } else if (tool === 'circle' && startPoint) {
      // Herramienta de círculo
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height)
      const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2))
      contextRef.current.beginPath()
      contextRef.current.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI)
      if (isFilled) {
        contextRef.current.fill()
      }
      contextRef.current.stroke()
    } else if (tool !== 'fill') {
      // Herramientas de dibujo libre
      contextRef.current.lineTo(x, y)
      contextRef.current.stroke()
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    setStartPoint(null)
    if (contextRef.current && tool !== 'line' && tool !== 'rectangle' && tool !== 'circle') {
      contextRef.current.closePath()
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas || !contextRef.current) return

    contextRef.current.clearRect(0, 0, canvas.width, canvas.height)
  }

  const saveDrawing = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      // Usar formato PNG con compatibilidad multi-navegador
      const imageData = canvas.toDataURL('image/png', 1.0)
      const newSavedDrawings = [...savedDrawings, imageData]
      setSavedDrawings(newSavedDrawings)
      
      // Guardar en localStorage con manejo de errores
      try {
        const storage = getLocalStorage()
        storage.setItem('savedDrawings', JSON.stringify(newSavedDrawings))
      } catch (storageError) {
        console.warn('Error al guardar en localStorage:', storageError)
        // Si localStorage está lleno, limpiar dibujos antiguos
        if (storageError instanceof Error && storageError.name === 'QuotaExceededError') {
          const storage = getLocalStorage()
          const reducedDrawings = newSavedDrawings.slice(-5) // Mantener solo los últimos 5
          storage.setItem('savedDrawings', JSON.stringify(reducedDrawings))
          setSavedDrawings(reducedDrawings)
        }
      }

      // Guardar dibujo en archivo
      try {
        const response = await fetch('/api/drawings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageData: imageData,
            title: `Dibujo de Gaby - ${new Date().toLocaleString('es-ES')}`
          })
        })
        
        if (response.ok) {
          console.log('Dibujo guardado en archivo exitosamente')
        } else {
          console.warn('Error al guardar dibujo en archivo')
        }
      } catch (error) {
        console.warn('Error al guardar dibujo en archivo:', error)
      }
      
      setShowSaveModal(true)
      setShowConfetti(true)
      setTimeout(() => setShowSaveModal(false), 5000)
      setTimeout(() => setShowConfetti(false), 4000)
    } catch (error) {
      console.error('Error al guardar dibujo:', error)
      alert('Error al guardar el dibujo. Intenta de nuevo.')
    }
  }

  const deleteDrawing = (index: number) => {
    try {
      const newSavedDrawings = savedDrawings.filter((_, i) => i !== index)
      setSavedDrawings(newSavedDrawings)
      const storage = getLocalStorage()
      storage.setItem('savedDrawings', JSON.stringify(newSavedDrawings))
    } catch (error) {
      console.error('Error al eliminar dibujo:', error)
      alert('Error al eliminar el dibujo. Intenta de nuevo.')
    }
  }

  const downloadDrawing = (imageData: string, index: number) => {
    try {
      // Crear elemento de descarga con compatibilidad multi-navegador
      const link = document.createElement('a')
      link.download = `dibujo-gaby-${index + 1}.png`
      link.href = imageData
      
      // Agregar al DOM temporalmente para compatibilidad con Safari
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error al descargar dibujo:', error)
      // Fallback: abrir en nueva pestaña
      window.open(imageData, '_blank')
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-6xl mx-auto px-4">
      {/* Título */}
      <div className="text-center mb-4 sm:mb-6 px-2 sm:px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4">
          🔮 Portal Mágico 🔮
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl px-2">
          Un lugar donde los sueños cobran vida... Usa tu imaginación para crear algo único.
          <br className="hidden sm:block" />
          Puedes guardar y descargar tus creaciones. ✨
          <br className="hidden sm:block" />
          <span className="text-violet-600 font-semibold">🎨✨ Nunca dejes de dibujar ✨🎨</span>
        </p>
      </div>

      {/* Barra de herramientas */}
      <div className="w-full max-w-4xl bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-3 sm:p-4 shadow-lg border border-violet-200">
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-4">
          {/* Herramientas */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <span className="text-xs sm:text-sm font-medium text-violet-700">Herramienta:</span>
            <div className="grid grid-cols-3 sm:flex gap-1 w-full sm:w-auto">
              <button
                onClick={() => setTool('brush')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  tool === 'brush' 
                    ? 'bg-violet-600 text-white shadow-lg scale-105' 
                    : 'bg-white text-violet-600 hover:bg-violet-100 border border-violet-200'
                }`}
              >
                🖌️ Pincel
              </button>
              <button
                onClick={() => setTool('pencil')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  tool === 'pencil' 
                    ? 'bg-violet-600 text-white shadow-lg scale-105' 
                    : 'bg-white text-violet-600 hover:bg-violet-100 border border-violet-200'
                }`}
              >
                ✏️ Lápiz
              </button>
              <button
                onClick={() => setTool('pen')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  tool === 'pen' 
                    ? 'bg-violet-600 text-white shadow-lg scale-105' 
                    : 'bg-white text-violet-600 hover:bg-violet-100 border border-violet-200'
                }`}
              >
                ✒️ Pluma
              </button>
                             <button
                 onClick={() => setTool('eraser')}
                 className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                   tool === 'eraser' 
                     ? 'bg-red-600 text-white shadow-lg scale-105' 
                     : 'bg-white text-red-600 hover:bg-red-100 border border-red-200'
                 }`}
               >
                 🧽 Borrador
               </button>
               <button
                 onClick={() => setTool('spray')}
                 className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                   tool === 'spray' 
                     ? 'bg-violet-600 text-white shadow-lg scale-105' 
                     : 'bg-white text-violet-600 hover:bg-violet-100 border border-violet-200'
                 }`}
               >
                 🌫️ Spray
               </button>
               <button
                 onClick={() => setTool('fill')}
                 className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                   tool === 'fill' 
                     ? 'bg-violet-600 text-white shadow-lg scale-105' 
                     : 'bg-white text-violet-600 hover:bg-violet-100 border border-violet-200'
                 }`}
               >
                 🎨 Relleno
               </button>
               <button
                 onClick={() => setTool('line')}
                 className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                   tool === 'line' 
                     ? 'bg-violet-600 text-white shadow-lg scale-105' 
                     : 'bg-white text-violet-600 hover:bg-violet-100 border border-violet-200'
                 }`}
               >
                 📏 Línea
               </button>
               <button
                 onClick={() => setTool('rectangle')}
                 className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                   tool === 'rectangle' 
                     ? 'bg-violet-600 text-white shadow-lg scale-105' 
                     : 'bg-white text-violet-600 hover:bg-violet-100 border border-violet-200'
                 }`}
               >
                 ⬜ Rectángulo
               </button>
               <button
                 onClick={() => setTool('circle')}
                 className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                   tool === 'circle' 
                     ? 'bg-violet-600 text-white shadow-lg scale-105' 
                     : 'bg-white text-violet-600 hover:bg-violet-100 border border-violet-200'
                 }`}
               >
                 ⭕ Círculo
               </button>
            </div>
          </div>

          {/* Tamaño de la herramienta */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span className="text-xs sm:text-sm font-medium text-violet-700">Tamaño:</span>
            <div className="flex items-center gap-1 sm:gap-2">
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-16 sm:w-20 md:w-24"
              />
              <span className="text-xs text-violet-600 w-4 sm:w-6">{brushSize}</span>
            </div>
          </div>

          {/* Opacidad */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span className="text-xs sm:text-sm font-medium text-violet-700">Opacidad:</span>
            <div className="flex items-center gap-1 sm:gap-2">
              <input
                type="range"
                min="10"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-16 sm:w-20 md:w-24"
              />
              <span className="text-xs text-violet-600 w-6 sm:w-8">{opacity}%</span>
            </div>
          </div>

          {/* Relleno */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span className="text-xs sm:text-sm font-medium text-violet-700">Relleno:</span>
            <button
              onClick={() => setIsFilled(!isFilled)}
              className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                isFilled 
                  ? 'bg-violet-600 text-white shadow-lg scale-105' 
                  : 'bg-white text-violet-600 hover:bg-violet-100 border border-violet-200'
              }`}
            >
              {isFilled ? '🟦 Relleno' : '⬜ Contorno'}
            </button>
          </div>

          {/* Colores */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span className="text-xs sm:text-sm font-medium text-violet-700">Color:</span>
            <div className="grid grid-cols-6 sm:flex gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setBrushColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                    brushColor === color ? 'border-violet-700 scale-125' : 'border-gray-300 hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Marco */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span className="text-xs sm:text-sm font-medium text-violet-700">Marco:</span>
            <select
              value={selectedFrame}
              onChange={(e) => setSelectedFrame(e.target.value as any)}
              className="px-2 py-1 text-xs border border-violet-200 rounded-lg bg-white text-violet-700 w-full sm:w-auto"
            >
              <option value="none">🖼️ Sin marco</option>
              <option value="pink">💖 Rosa</option>
              <option value="yellow">⭐ Dorado</option>
              <option value="green">🌸 Verde</option>
              <option value="purple">🎂 Púrpura</option>
              <option value="blue">💙 Azul</option>
              <option value="orange">🧡 Naranja</option>
            </select>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={clearCanvas}
              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              🗑️ Borrar Todo
            </button>
            <button
              onClick={saveDrawing}
              className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              💾 Guardar
            </button>
            <button
              onClick={() => setShowGallery(!showGallery)}
              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              🖼️ Galería ({savedDrawings.length})
            </button>
          </div>
        </div>
      </div>

      {/* Área de dibujo */}
      <div className="w-full max-w-4xl px-2 sm:px-4">
        <div className={`bg-white rounded-xl shadow-2xl border-4 overflow-hidden transition-all duration-500 ${
          selectedFrame === 'pink' ? 'border-pink-300' :
          selectedFrame === 'yellow' ? 'border-yellow-300' :
          selectedFrame === 'green' ? 'border-green-300' :
          selectedFrame === 'purple' ? 'border-purple-300' :
          selectedFrame === 'blue' ? 'border-blue-300' :
          selectedFrame === 'orange' ? 'border-orange-300' :
          'border-violet-200'
        }`}>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] cursor-crosshair touch-none"
            style={{ 
              touchAction: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              userSelect: 'none'
            }}
            width="800"
            height="600"
          />
        </div>
      </div>

      {/* Galería de dibujos guardados */}
      {showGallery && (
        <div className="w-full max-w-4xl bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 sm:p-6 shadow-lg border border-violet-200">
          <h3 className="text-xl sm:text-2xl font-bold text-violet-700 mb-3 sm:mb-4 text-center">🖼️ Galería de Dibujos</h3>
          {savedDrawings.length === 0 ? (
            <p className="text-center text-gray-600 py-6 sm:py-8 text-sm sm:text-base">No hay dibujos guardados aún. ¡Empieza a dibujar!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {savedDrawings.map((drawing, index) => (
                <div key={index} className="bg-white rounded-lg p-3 shadow-md">
                  <img src={drawing} alt={`Dibujo ${index + 1}`} className="w-full h-32 object-contain rounded border" />
                  <div className="flex justify-between mt-2">
                    <button
                      onClick={() => downloadDrawing(drawing, index)}
                      className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors duration-200"
                    >
                      📥 Descargar
                    </button>
                    <button
                      onClick={() => deleteDrawing(index)}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors duration-200"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Efecto de confeti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            >
              <span className="text-2xl">
                {['🎊', '🎉', '✨', '🌟', '💫', '⭐', '🎁', '🎂', '🎈', '💖', '🌈', '🎨'][Math.floor(Math.random() * 12)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación de guardado */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-pink-200 via-purple-200 to-yellow-200 p-6 rounded-2xl border-4 border-pink-300 shadow-2xl text-center max-w-sm sm:max-w-md animate-pulse">
            <div className="text-4xl mb-4 animate-bounce">🎁</div>
            <h3 className="text-xl font-bold text-pink-700 mb-2">¡Regalo Registrado! 🎉</h3>
            <p className="text-pink-600 text-sm sm:text-base mb-3">
              ¡Perfecto! Ya tengo tu pedido especial guardado. 
              <br />
              <span className="font-semibold">¡Ahora sé exactamente qué regalarte! 😉</span>
            </p>
            <div className="text-2xl animate-pulse">✨</div>
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div className="text-center mt-4 sm:mt-6 px-2 sm:px-4">
        <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-xl p-3 sm:p-4 shadow-lg border border-violet-200">
          <p className="text-xs sm:text-sm text-violet-700">
            💡 <strong>Consejos:</strong> Usa diferentes colores y tamaños de pincel para crear algo único. 
            <br className="hidden sm:block" />
            ¡Déjate llevar por tu imaginación y crea algo especial! ✨
          </p>
        </div>
      </div>
    </div>
  )
}

// Component CommentIcon (Comentarios y sugerencias)
function CommentIcon(props: any) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      {/* Burbuja de comentario principal */}
      <rect x="8" y="20" width="40" height="24" rx="8" fill="#F59E0B"/>
      <rect x="10" y="22" width="36" height="20" rx="6" fill="#FBBF24"/>
      {/* Cola de la burbuja */}
      <path d="M20 44 L16 48 L20 52 L24 48 Z" fill="#F59E0B"/>
      <path d="M22 46 L18 50 L22 54 L26 50 Z" fill="#FBBF24"/>
      {/* Líneas de texto */}
      <rect x="15" y="28" width="26" height="2" rx="1" fill="#92400E"/>
      <rect x="15" y="32" width="20" height="2" rx="1" fill="#92400E"/>
      <rect x="15" y="36" width="24" height="2" rx="1" fill="#92400E"/>
      {/* Estrellas de calificación */}
      <path d="M45 15 L46 17 L48 17 L46.5 18.5 L47 21 L45 19.5 L43 21 L43.5 18.5 L42 17 L44 17 Z" fill="#F472B6"/>
      <path d="M50 12 L51 14 L53 14 L51.5 15.5 L52 18 L50 16.5 L48 18 L48.5 15.5 L47 14 L49 14 Z" fill="#A78BFA"/>
      <path d="M55 15 L56 17 L58 17 L56.5 18.5 L57 21 L55 19.5 L53 21 L53.5 18.5 L52 17 L54 17 Z" fill="#34D399"/>
      {/* Chispas de feedback */}
      <circle cx="15" cy="15" r="1" fill="#FBBF24"/>
      <circle cx="55" cy="25" r="1" fill="#F472B6"/>
      <circle cx="10" cy="35" r="1" fill="#A78BFA"/>
      <circle cx="50" cy="45" r="1" fill="#34D399"/>
    </svg>
  )
}

// Component CommentsModule - Comentarios y Sugerencias
function CommentsModule() {
  const [comment, setComment] = useState("")
  const [type, setType] = useState<'comentario' | 'sugerencia' | 'feedback'>('comentario')
  const [rating, setRating] = useState(0)
  const [selectedModule, setSelectedModule] = useState('general')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const modules = [
    { id: 'general', name: 'General', emoji: '🌟' },
    { id: 'cake', name: 'Pastel Mágico', emoji: '🎂' },
    { id: 'messages', name: 'Mensajes del Corazón', emoji: '💌' },
    { id: 'playlist', name: 'Nuestra Banda Sonora', emoji: '🎵' },
    { id: 'wishes', name: 'Deseos Mágicos', emoji: '✨' },
    { id: 'magic-game', name: 'Juego Mágico', emoji: '🎮' },
    { id: 'drawing', name: 'Portal Mágico', emoji: '🎨' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!comment.trim()) {
      alert('Por favor, escribe un comentario')
      return
    }

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: comment.trim(),
          type: type,
          rating: rating,
          module: selectedModule
        })
      })
      
      if (response.ok) {
        setShowSuccess(true)
        setShowConfetti(true)
        setComment("")
        setRating(0)
        setType('comentario')
        setSelectedModule('general')
        
        setTimeout(() => setShowSuccess(false), 5000)
        setTimeout(() => setShowConfetti(false), 4000)
      } else {
        alert('Error al guardar el comentario. Intenta de nuevo.')
      }
    } catch (error) {
      console.error('Error al guardar comentario:', error)
      alert('Error al guardar el comentario. Intenta de nuevo.')
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto px-4">
      {/* Título */}
      <div className="text-center mb-4 sm:mb-6 px-2 sm:px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2 sm:mb-4">
          💬 Comentarios y Sugerencias 💬
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl px-2">
          ¡Tu opinión es muy importante para mí! 
          <br className="hidden sm:block" />
          Déjame saber qué piensas de tu regalo especial y cómo puedo mejorarlo ✨
        </p>
      </div>

      {/* Formulario */}
      <div className="w-full max-w-2xl bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 sm:p-6 shadow-lg border border-amber-200">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Tipo de comentario */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-amber-700 mb-2">
              🎯 Tipo de comentario:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { value: 'comentario', label: '💭 Comentario', desc: 'Tu opinión general' },
                { value: 'sugerencia', label: '💡 Sugerencia', desc: 'Ideas para mejorar' },
                { value: 'feedback', label: '🌟 Feedback', desc: 'Lo que más te gustó' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value as any)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    type === option.value
                      ? 'bg-amber-600 text-white shadow-lg scale-105'
                      : 'bg-white text-amber-600 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <div className="font-bold">{option.label}</div>
                  <div className="text-xs opacity-75">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Módulo específico */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-amber-700 mb-2">
              📱 Módulo específico:
            </label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full p-3 rounded-lg border-2 border-amber-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-200 bg-white"
            >
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.emoji} {module.name}
                </option>
              ))}
            </select>
          </div>

          {/* Calificación */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-amber-700 mb-2">
              ⭐ Calificación (opcional):
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl sm:text-3xl transition-all duration-200 hover:scale-110 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-500 mt-1">
              {rating === 0 ? 'Sin calificar' : `${rating} estrella${rating > 1 ? 's' : ''}`}
            </p>
            {/* Mostrar las estrellas seleccionadas */}
            {rating > 0 && (
              <div className="flex justify-center gap-1 mt-2">
                {Array.from({ length: rating }).map((_, index) => (
                  <span key={index} className="text-lg text-yellow-400">⭐</span>
                ))}
              </div>
            )}
          </div>

          {/* Comentario */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-amber-700 mb-2">
              💭 Tu comentario:
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe aquí tu comentario, sugerencia o feedback..."
              className="w-full p-3 rounded-lg border-2 border-amber-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-200 bg-white resize-none"
              rows={6}
              required
            />
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 sm:py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 text-lg sm:text-xl"
          >
            💝 Enviar Comentario
          </button>
        </form>
      </div>

      {/* Mensaje de éxito */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-amber-200 via-orange-200 to-yellow-200 p-6 rounded-2xl border-4 border-amber-300 shadow-2xl text-center max-w-sm sm:max-w-md animate-pulse">
            <div className="text-4xl mb-4 animate-bounce">💝</div>
            <h3 className="text-xl font-bold text-amber-700 mb-2">¡Comentario Enviado! 🎉</h3>
            <p className="text-amber-600 text-sm sm:text-base mb-3">
              ¡Gracias por tu feedback! 
              <br />
              <span className="font-semibold">Tu opinión me ayuda a mejorar tu experiencia 😊</span>
            </p>
            <div className="text-2xl animate-pulse">✨</div>
          </div>
        </div>
      )}

      {/* Efecto de confeti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            >
              <span className="text-2xl">
                {['💝', '💬', '💡', '🌟', '✨', '⭐', '🎉', '🎊', '💖', '🌈', '🎯', '📝'][Math.floor(Math.random() * 12)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Información adicional */}
      <div className="text-center mt-4 sm:mt-6 px-2 sm:px-4">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-3 sm:p-4 shadow-lg border border-amber-200">
          <p className="text-xs sm:text-sm text-amber-700">
            💡 <strong>Tip:</strong> Tus comentarios se guardan de forma segura y me ayudan a crear experiencias cada vez mejores para ti.
            <br className="hidden sm:block" />
            ¡No dudes en ser honesta y detallada! ✨
          </p>
        </div>
      </div>
    </div>
  )
}
