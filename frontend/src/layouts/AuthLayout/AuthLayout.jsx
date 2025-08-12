import React from 'react'
import styles from './styles.module.scss'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}
