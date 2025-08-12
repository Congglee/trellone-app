# Material-UI Implementation Patterns

## Brief overview

This rule documents the established Material-UI (MUI) patterns, conventions, and best practices specifically identified from the Trellone React codebase. These guidelines ensure consistent component styling, proper theme integration, responsive design implementation, and maintainable Material-UI code across the application.

## Import patterns and component usage

- Use default imports for all Material-UI components, one per line: `import Box from '@mui/material/Box'`, `import Typography from '@mui/material/Typography'`, `import Button from '@mui/material/Button'`
- Import icons individually for tree-shaking: `import GoogleIcon from '@mui/icons-material/Google'`
- Use Material-UI component aliases when needed to avoid conflicts: `import { Card as MuiCard, Link as MuiLink } from '@mui/material'`
- Import Material-UI Grid2 for responsive layouts: `import Grid from '@mui/material/Unstable_Grid2'`
- Use `useColorScheme` hook for theme mode management: `import { useColorScheme } from '@mui/material'`
- Import theme utilities when needed: `import { useTheme, useMediaQuery } from '@mui/material'`

## Theme configuration and customization

- Use `experimental_extendTheme` for comprehensive theme setup with color schemes support
- Define custom theme properties using module augmentation for TypeScript integration
- Create custom theme constants for consistent spacing and layout dimensions
- Use `colorSchemes` object to define light and dark mode palettes separately
- Override component styles using the `components` key in theme configuration
- Use `unstable_sx` in component overrides for theme-aware styling within styleOverrides
- Define global CSS overrides in `MuiCssBaseline.styleOverrides` for scrollbar customization

## Styling conventions and sx prop usage

- Prefer `sx` prop over `styled` components for component-level styling
- Use theme callback functions in sx prop for theme-aware styling: `sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff' }}`
- Apply consistent spacing using theme spacing units: `gap: 2`, `padding: '0 1em'`
- Use theme breakpoints for responsive styling: `display: { xs: 'none', md: 'flex' }`
- Implement hover states using nested sx syntax: `'&:hover': { backgroundColor: 'primary.main' }`
- Use theme palette colors consistently: `color: 'primary.main'`, `bgcolor: 'background.paper'`

## Responsive design patterns

- Use Material-UI breakpoint system consistently: `{ xs: 'value', sm: 'value', md: 'value', lg: 'value' }`
- Apply responsive display properties: `display: { xs: 'none', md: 'inline-flex' }`
- Use responsive sizing for components: `width: { xs: 'auto', sm: 520 }`
- Implement responsive flexDirection: `flexDirection: { xs: 'column', md: 'row' }`
- Use `useMediaQuery` hook for conditional rendering based on breakpoints
- Apply responsive spacing and gaps: `gap: { xs: 1, md: 2 }`
- Use responsive typography sizing: `fontSize: { xs: '2.5rem', sm: '3rem' }`

## Component composition patterns

- Use Box component as the primary layout container with sx prop styling
- Implement Stack component for consistent spacing between elements
- Use Grid2 for responsive layout systems with proper spacing configuration
- Apply Tooltip components for enhanced user experience on interactive elements
- Use IconButton for clickable icons with proper accessibility attributes
- Implement Chip components for interactive tags and filters with consistent styling
- Use Card components with proper elevation and border radius for content containers

## Form integration with Material-UI

- Use TextField component with `fullWidth`, `variant='outlined'` as default configuration
- Apply consistent error styling using `error` prop with boolean values
- Use FormControl and InputLabel for complex form controls like Select components
- Implement FormControlLabel for checkbox and radio button groups
- Use Controller component from React Hook Form for Material-UI components that don't work with register
- Apply consistent form spacing using Box containers with margin/padding
- Use Alert component for form validation error display with severity levels

## Modal and dialog implementation

- Use Modal component with `disableScrollLock` for better UX in complex layouts
- Apply consistent modal styling with theme-aware background colors and border radius
- Use Dialog component with proper accessibility attributes and responsive sizing
- Implement DialogTitle, DialogContent, and DialogActions for structured dialog layout
- Use Divider components to separate dialog sections visually
- Apply proper z-index management for modal overlays and content
- Use Zoom transition component for modal entrance animations

## Icon usage and styling

- Import Material-UI icons individually: `import MenuIcon from '@mui/icons-material/Menu'`
- Use `fontSize='small'` consistently for icons in buttons and interactive elements
- Apply icon color inheritance: `sx={{ color: 'inherit' }}` for theme-aware coloring
- Use SvgIcon component for custom SVG icons with `inheritViewBox` prop
- Implement consistent icon sizing in different contexts (small, medium, large)
- Use startIcon and endIcon props in Button components for proper icon placement

## Animation and transition patterns

- Use Material-UI transition components: `Zoom`, `Fade`, `Slide` for entrance animations
- Apply theme transitions for smooth state changes: `theme.transitions.create(['margin', 'width'])`
- Use CSS keyframes for custom animations within styled components
- Implement hover transitions using sx prop: `transition: 'all 0.3s ease'`
- Apply consistent animation delays and durations across components
- Use transform properties for interactive feedback: `'&:hover': { transform: 'scale(1.1)' }`

## Layout and spacing consistency

- Use consistent padding and margin patterns: `padding: '0 1em'`, `margin: '1em'`
- Apply theme spacing units for consistent gaps: `gap: 2` (equivalent to 16px)
- Use flexbox properties consistently: `display: 'flex'`, `alignItems: 'center'`, `justifyContent: 'space-between'`
- Implement proper overflow handling: `overflowX: 'auto'`, `overflow: 'hidden'`
- Use position properties appropriately: `position: 'relative'`, `position: 'absolute'`
- Apply consistent border radius values: `borderRadius: '8px'`, `borderRadius: 0.5`

## Color and theming best practices

- Use theme palette colors instead of hardcoded values: `color: 'text.primary'`
- Apply theme-aware conditional styling for dark/light modes
- Use color generation utilities for dynamic colors: `generateColorFromString(title)`
- Implement consistent color schemes across light and dark themes
- Use Material-UI color imports when needed: `import { blueGrey } from '@mui/material/colors'`
- Apply proper contrast ratios for accessibility compliance

## Performance optimization patterns

- Use React.memo strategically for expensive Material-UI components
- Implement proper shouldForwardProp in styled components to avoid prop forwarding issues
- Use theme breakpoints efficiently to avoid unnecessary re-renders
- Apply consistent component composition to leverage Material-UI's built-in optimizations
- Use proper key props for list rendering with Material-UI components
- Leverage Material-UI's built-in performance features like sx prop compilation

## Accessibility and user experience

- Use proper ARIA attributes in interactive components: `aria-label`, `aria-describedby`
- Implement proper focus management with `autoFocus` and `focused` props
- Use semantic HTML elements through Material-UI component props: `component='main'`
- Apply proper color contrast for text and background combinations
- Use Tooltip components for additional context on interactive elements
- Implement proper keyboard navigation support through Material-UI's built-in features
