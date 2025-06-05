'use client';

import { useState, useEffect, useRef, MutableRefObject } from 'react';
import { motion } from 'framer-motion';

type Star = {
  id: number;
  isSpecial: boolean;
  isCollectible: boolean;
  size: number;
  x: number;
  y: number;
  twinkleDelay: number;
  found?: boolean;
};

const TOTAL_STARS = 30;
const COLLECTIBLE_MIN = 5;
const COLLECTIBLE_MAX = 10;

const generateStars = (): Star[] => {
  const collectibleCount =
    Math.floor(Math.random() * (COLLECTIBLE_MAX - COLLECTIBLE_MIN + 1)) +
    COLLECTIBLE_MIN;

  const collectibleIndices = new Set<number>();
  while (collectibleIndices.size < collectibleCount) {
    collectibleIndices.add(Math.floor(Math.random() * TOTAL_STARS));
  }

  const specialStarIndex =
    Array.from(collectibleIndices)[
      Math.floor(Math.random() * collectibleIndices.size)
    ];

  return Array.from({ length: TOTAL_STARS }).map((_, i) => ({
    id: i,
    isSpecial: i === specialStarIndex,
    isCollectible: collectibleIndices.has(i),
    size: Math.random() * 3 + 1.5,
    x: Math.random() * 90 + 5,
    y: Math.random() * 80 + 10,
    twinkleDelay: Math.random() * 5,
  }));
};

export default function Home() {
  const [stars, setStars] = useState<Star[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Music control states
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSongIndex, setSelectedSongIndex] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([] as (HTMLAudioElement | null)[]);

  useEffect(() => {
  setStars(generateStars());

  const idx = Math.floor(Math.random() * 2); // Pick a random song every time
  setSelectedSongIndex(idx);
}, []);


  // Play the selected song when game starts and not already playing
  useEffect(() => {
    if (gameStarted && selectedSongIndex !== null && !isPlaying) {
      const audio = audioRefs.current[selectedSongIndex];
      if (audio) {
        audio.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  }, [gameStarted, selectedSongIndex, isPlaying]);

  // Stop music handler
  const stopMusic = () => {
    audioRefs.current.forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    setIsPlaying(false);
  };

  // Only collectible stars count for "left"
  const collectibleStarsLeft = stars.filter(
    (s) => s.isCollectible && !s.isSpecial && !s.found
  ).length;

  const handleStarClick = (
    id: number,
    isSpecial: boolean,
    isCollectible: boolean
  ) => {
    if (!isCollectible) return;

    if (isSpecial) {
      if (collectibleStarsLeft === 0) {
        setGameWon(true);
      }
      return;
    }

    setStars((prev) =>
      prev.map((star) => (star.id === id ? { ...star, found: true } : star))
    );
  };

  return (
    <main
      style={{
        height: '100vh',
        background: 'linear-gradient(180deg, #2e0854 0%, #150230 100%)',
        overflow: 'hidden',
        color: 'white',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      {/* Moon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          top: '10vh',
          right: '5vw',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 30% 30%, #f0e8ff 60%, transparent 80%), #8a65c1',
          boxShadow: '0 0 20px 8px rgba(138, 101, 193, 0.7)',
          filter: 'drop-shadow(0 0 8px #a18bef)',
          clipPath: 'ellipse(70% 100% at 35% 50%)',
          zIndex: 10,
        }}
      />

      {!gameStarted && !gameWon && (
        <>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '3rem', marginBottom: '0.2rem', zIndex: 10 }}
          >
            Hey Chitra, The night is pretty isn't it?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3,
            }}
            style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#d4c1ff', zIndex: 10 }}
          >
            wannna go catch the stars with me?
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px #a865ff' }}
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.6,
            }}
            style={{
              background:
                'linear-gradient(135deg, #7b39f5 0%, #a865ff 100%)',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '50px',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(123, 57, 245, 0.7)',
              zIndex: 10,
            }}
            onClick={() => setGameStarted(true)}
          >
            Let's go?
          </motion.button>
        </>
      )}

      {gameStarted && !gameWon && (
        <div
          style={{
            position: 'relative',
            width: '80vw',
            height: '60vh',
            border: '2px solid #a865ff',
            borderRadius: '15px',
            background:
              'radial-gradient(circle at center, #1e0e3f 40%, transparent 100%)',
            overflow: 'hidden',
            zIndex: 10,
            userSelect: 'none',
          }}
        >
          <p style={{ padding: '10px', fontWeight: 'bold', fontSize: '1.2rem' }}>
            Stars left: {collectibleStarsLeft}
          </p>

          {stars.map(({ id, size, isSpecial, x, y, twinkleDelay, found, isCollectible }) => {
            if (found) return null;

            const floatAnimation = {
              y: ['0%', '10%', '0%'],
              opacity: [0.6, 1, 0.6],
            };

            const specialStarAnimation =
              isSpecial && collectibleStarsLeft === 0
                ? {
                    opacity: [1, 0.3, 1],
                    scale: [1, 1.2, 1],
                    y: ['0%', '-5%', '0%'],
                  }
                : floatAnimation;

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={specialStarAnimation}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: twinkleDelay,
                  ease: 'easeInOut',
                }}
                style={{
                  position: 'absolute',
                  top: `${y}%`,
                  left: `${x}%`,
                  width: size * 10,
                  height: size * 10,
                  borderRadius: '50%',
                  backgroundColor: isCollectible ? 'white' : 'rgba(255,255,255,0.2)',
                  filter: isSpecial
                    ? 'drop-shadow(0 0 15px #b88aff)'
                    : isCollectible
                    ? 'drop-shadow(0 0 6px #ddd)'
                    : 'none',
                  cursor: isCollectible
                    ? isSpecial && collectibleStarsLeft > 0
                      ? 'not-allowed'
                      : 'pointer'
                    : 'default',
                  boxShadow: isSpecial ? '0 0 15px 5px #b88aff' : undefined,
                  zIndex: 20,
                }}
                onClick={() => handleStarClick(id, isSpecial, isCollectible)}
                title={
                  isSpecial
                    ? collectibleStarsLeft === 0
                      ? 'Click to unlock your poem!'
                      : 'Collect all other glowing stars first'
                    : isCollectible
                    ? 'Collect me!'
                    : ''
                }
              >
                {isCollectible && !isSpecial && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: twinkleDelay,
                      ease: 'easeInOut',
                    }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: size * 12,
                      height: size * 12,
                      borderRadius: '50%',
                      boxShadow: '0 0 10px 6px white',
                      pointerEvents: 'none',
                      zIndex: 15,
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {gameWon && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'rgba(40, 20, 70, 0.9)',
            padding: '2rem',
            borderRadius: '20px',
            maxWidth: '600px',
            boxShadow: '0 0 15px #a865ff',
            zIndex: 20,
            userSelect: 'text',
          }}
        >
          <h2 style={{ marginBottom: '1rem' }}>Dear Sapna!! 🌙</h2>
          <p style={{ fontSize: '1.3rem', whiteSpace: 'pre-line' }}>
            {`In the hush of night, when silence sings,

Know that even the stars lean close to listen.

You are not alone in your ache,

The garden remembers your every bloom and tear.

Sadness may visit, but it never stays,

It only teaches the heart to grow in softer ways.`}
          </p>
          <h3 style={{ marginBottom: '1rem' }}>Oh dear, I'm with you always! 💐</h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              marginTop: '1.5rem',
              background:
                'linear-gradient(135deg, #7b39f5 0%, #a865ff 100%)',
              border: 'none',
              padding: '0.8rem 1.8rem',
              borderRadius: '50px',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(123, 57, 245, 0.7)',
            }}
            onClick={() => {
              setGameWon(false);
              setGameStarted(false);
              setStars(generateStars());
            }}
          >
            Lets go catch the stars again? :) 
          </motion.button>
        </motion.div>
      )}

      {/* Stop music button on bottom right */}
      {isPlaying && (
        <button
          onClick={stopMusic}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            padding: '0.5rem 1rem',
            borderRadius: '30px',
            border: 'none',
            background:
              'linear-gradient(135deg, #7b39f5 0%, #a865ff 100%)',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(123, 57, 245, 0.7)',
            zIndex: 50,
          }}
          title="Stop music"
        >
          🔇 Stop Music
        </button>
      )}

      {/* Audio elements */}
      <audio
        ref={(el: HTMLAudioElement | null) => {
          (audioRefs as MutableRefObject<(HTMLAudioElement | null)[]>).current[0] = el;
        }}
        src="/music/song1.mp3"
        loop
        preload="auto"
      />
      <audio
        ref={(el: HTMLAudioElement | null) => {
          (audioRefs as MutableRefObject<(HTMLAudioElement | null)[]>).current[1] = el;
        }}
        src="/music/song2.mp3"
        loop
        preload="auto"
      />
    </main>
  );
}
