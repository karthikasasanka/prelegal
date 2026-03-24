import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Home from './page'

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

describe('Home page', () => {
  it('renders without crashing', () => {
    render(<Home />)
    expect(screen.getByText(/get started/i)).toBeTruthy()
  })
})
