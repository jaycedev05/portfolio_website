import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BlogIndexPage } from './pages/BlogIndexPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { HomePage } from './pages/HomePage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-white text-[var(--color-ink)]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--color-ink)] focus:text-white focus:rounded"
        >
          Skip to main content
        </a>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
