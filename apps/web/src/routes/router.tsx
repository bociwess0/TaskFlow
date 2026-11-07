import { createBrowserRouter } from 'react-router'
import { ThemePreviewPage } from '@/routes/theme-preview-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ThemePreviewPage />,
  },
])
