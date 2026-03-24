import { render, screen } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import Home from './page'

vi.mock('next/image', () => ({
  default: ({ src, alt, width, height }: { src: string; alt: string; width?: number; height?: number }) =>
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} />,
}))

describe('Home page', () => {
  it('renders without crashing', () => {
    render(<Home />)
    screen.getByText(/get started/i)
  })
})
