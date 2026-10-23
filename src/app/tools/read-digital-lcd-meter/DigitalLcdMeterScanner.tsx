'use client'

import React from 'react'
import ToolShell from '@/components/tools/ToolShell'

export default function DigitalLcdMeterScanner() {
  const steps = [
    {
      title: 'Wait for Active kWh Screen',
      description:
        'Modern smart LCD meters cycle between voltage, time, and max demand. Wait until "kWh" or code "01 / 02" appears before taking your photo.',
    },
    {
      title: 'Read Whole Kilowatt-Hours Left-to-Right',
      description:
        'Digital utility meters record cumulative power. Capture all main digits on the illuminated 7-segment display.',
    },
    {
      title: 'Ignore Fractional Decimal Digits',
      description:
        'Digits after a decimal point or bordered in red represent tenths of a kWh. The AI automatically strips decimals to match utility billing practices.',
    },
    {
      title: 'Compare with Previous Reading',
      description:
        'Subtract your last billing cycle index from this new reading to get total units burned during the period.',
    },
  ]

  const faqs = [
    {
      question: 'Is my meter photo uploaded to any server or cloud database?',
      answer:
        'No. All image preprocessing, canvas downscaling, and neural OCR run 100% client-side directly in your browser using WebAssembly. Your photos never leave your device.',
    },
    {
      question: 'How do I handle reflection, glare, or low light on the meter screen?',
      answer:
        'Avoid direct camera flash on reflective LCD covers. Angle the camera slightly (10-15 degrees) or illuminate with ambient light. If glare obscures a digit, our interactive manual stepper lets you correct it in 1 second.',
    },
    {
      question: 'Can I track my readings over time and forecast my electricity bill?',
      answer:
        'Yes! Simply click "Add to My Meter Tracking" after scanning. It instantly logs the reading into your local Read Meter guest session to calculate daily burn rate, projected bill, and slab threshold warnings.',
    },
    {
      question: 'Does this scanner work for 3-phase and solar net meters?',
      answer:
        'Yes. 3-phase digital meters and bi-directional net meters display import and export kWh on standard 7-segment LCD screens which are fully supported.',
    },
  ]

  return (
    <ToolShell
      category="electricity"
      categoryName="Electricity (kWh)"
      title="Instant Digital Meter Scanner (kWh)"
      subtitle="Point your phone camera or drop a photo to extract 7-segment digital meter readings and strip decimals in seconds."
      defaultUnit="kWh"
      unitOptions={['kWh', 'MWh', 'Units']}
      sampleReadingPlaceholder="54128"
      meterTypeLabel="Digital Electric Meter (LCD)"
      howItWorksSteps={steps}
      faqs={faqs}
      regexPattern={/\b\d{4,7}(?:\.\d+)?\b/g}
      decimalHandling="strip"
    />
  )
}
