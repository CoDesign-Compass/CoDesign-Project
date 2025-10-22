// 1. 导入 CSS Module
import styles from './Badge.module.css'

const Badge = ({
  variant = 'light',
  color = 'primary',
  size = 'md',
  startIcon,
  endIcon,
  children,
}) => {
  const baseStyles = styles.badge
  const sizeClass = size === 'sm' ? styles['size-sm'] : styles['size-md']
  const colorClass = styles[`${variant}-${color}`]

  return (
    <span className={`${baseStyles} ${sizeClass} ${colorClass}`}>
      {startIcon && <span className={styles.iconStart}>{startIcon}</span>}
      {children}
      {endIcon && <span className={styles.iconEnd}>{endIcon}</span>}
    </span>
  )
}

export default Badge
