import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';

const product: Product = {
  id: 'p-001',
  name: 'Wireless Headphones',
  price: 25000,
  description: 'Comfortable headphones with clear sound.',
  imageUrl: 'https://example.com/product.jpg',
  category: 'Electronics',
  stock: 12
};

describe('ProductCard', () => {
  it('renders product details and triggers add to cart', () => {
    const onAddToCart = vi.fn();
    render(
      <MemoryRouter>
        <ProductCard product={product} onAddToCart={onAddToCart} />
      </MemoryRouter>
    );

    expect(screen.getByText(product.name)).toBeTruthy();
    expect(screen.getByText(/25,000/)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /add wireless headphones to cart/i }));
    expect(onAddToCart).toHaveBeenCalledWith(product);
  });

  it('disables add button when out of stock', () => {
    const onAddToCart = vi.fn();
    render(
      <MemoryRouter>
        <ProductCard product={{ ...product, stock: 0 }} onAddToCart={onAddToCart} />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /out of stock/i }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});
