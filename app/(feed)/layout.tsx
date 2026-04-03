import React from 'react'
import FeedRootLayout from '../components/FeedRootLayout'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FeedRootLayout>{children}</FeedRootLayout>
    </>
  )
}
