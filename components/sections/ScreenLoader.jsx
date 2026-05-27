'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import styles from '@/styles/sections/ScreenLoader.module.css'

export default function ScreenLoader({ onDismiss }) {
  const overlayRef = useRef(null)
  const logoContainerRef = useRef(null)
  const startBtnRef = useRef(null)

  useEffect(() => {
    // Elegant floating entrance timeline for premium branding
    gsap.set(logoContainerRef.current, { opacity: 0, y: 32, scale: 0.95 })
    gsap.set(startBtnRef.current, { opacity: 0, y: 16 })

    const tl = gsap.timeline({ delay: 0.25 })
    tl.to(logoContainerRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.1,
      ease: 'power4.out',
    })
    .to(startBtnRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
    }, '-=0.5')
  }, [])

  function handleStart() {
    window.dispatchEvent(
      new CustomEvent('loader-dismissed')
    )

    const overlay = overlayRef.current
    if (!overlay) return

    overlay.style.pointerEvents = 'none'

    // Create split layers
    const top = document.createElement('div')
    top.className = styles.splitTop

    const bottom = document.createElement('div')
    bottom.className = styles.splitBottom

    // Center line
    const line = document.createElement('div')
    line.className = styles.centerLine

    document.body.appendChild(top)
    document.body.appendChild(bottom)
    document.body.appendChild(line)

    // Hide original overlay fast
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.out',
    })

    // Animate line
    gsap.fromTo(
      line,
      {
        scaleX: 0,
        opacity: 0,
      },
      {
        scaleX: 1,
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out',
      }
    )

    // Split animation
    gsap.to(top, {
      y: '-100%',
      duration: 1,
      ease: 'expo.inOut',
      force3D: true,
    })

    gsap.to(bottom, {
      y: '100%',
      duration: 1,
      ease: 'expo.inOut',
      force3D: true,
    })

    // Fade line away
    gsap.to(line, {
      opacity: 0,
      duration: 0.3,
      delay: 0.2,
    })

    setTimeout(() => {
      top.remove()
      bottom.remove()
      line.remove()

      window.dispatchEvent(
        new CustomEvent('loader-animation-done')
      )

      onDismiss()
    }, 1000)
  }

  return (
    <div ref={overlayRef} className={styles.overlay}>
      <div className={styles.liquidBg} aria-hidden />

      <div ref={logoContainerRef} className={styles.logoContainer}>
        <Image
          src="/assets/logo-cropped.png"
          alt="SD Brand Logo"
          width={180}
          height={180}
          className={styles.logoImg}
          priority
        />
        <h1 className={styles.brandName}>SUDHAJIT DEY</h1>
        <p className={styles.brandTagline}>SOFTWARE ENGINEER</p>
      </div>

      <button
        ref={startBtnRef}
        className={styles.startBtn}
        onClick={handleStart}
      >
        Start
      </button>
    </div>
  )
}