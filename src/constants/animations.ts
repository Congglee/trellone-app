import { keyframes } from '@mui/material/styles'

export const slideInLeft = keyframes`
  from {
    transform: translateX(-100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

export const slideInRight = keyframes`
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

export const slideOutLeft = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100px);
    opacity: 0;
  }
`

export const slideOutRight = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100px);
    opacity: 0;
  }
`

export const fadeInUp = keyframes`
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

export const rotateIn = keyframes`
  from {
    transform: rotateY(-90deg) scale(0.8);
    opacity: 0;
  }
  to {
    transform: rotateY(0deg) scale(1);
    opacity: 1;
  }
`
