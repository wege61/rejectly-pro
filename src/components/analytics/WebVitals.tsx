'use client'

import { useEffect } from 'react'
import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals'

export function WebVitals() {
  useEffect(() => {
    const sendToAnalytics = (metric: Metric) => {
      if (typeof window !== 'undefined' && window.gtag) {
        // Send to Google Analytics
        window.gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        })

        // Console logging removed for production clarity
      }
    }

    // Register all Web Vitals
    onCLS(sendToAnalytics)
    onFCP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
    onINP(sendToAnalytics) // Replaces deprecated FID
  }, [])

  return null
}
