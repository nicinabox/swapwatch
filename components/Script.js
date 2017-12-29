import React from 'react'

export default function Script ({children}) {
  return (
    <script type="text/javascript" dangerouslySetInnerHTML={{
      __html: children
    }} />
  )
}
