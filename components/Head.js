import React from 'react'
import Head from 'next/head'
import { insertRule } from 'next/css'

export default () => (
  <Head>
    <title>Mechwatch</title>
    <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" />
  </Head>
)

insertRule(`
  body {
    line-height: 1.6;
    font-family: Lato, Helvetica Neue;
  }
  a {
    color: blue;
    text-decoration: none;
  }
  td {
    padding: 5px;
  }
  .container {
    width: 1100px;
    margin: 0 auto;
  }
`)
