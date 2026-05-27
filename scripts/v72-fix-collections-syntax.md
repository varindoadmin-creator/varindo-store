# V72 Fix Collections Syntax

Fixed invalid syntax in `src/app/collections/[group]/page.tsx`:

Incorrect:
`'new-arrivals', 'new-collections': {`

Correct:
`'new-arrivals': { ... }`
`'new-collections': { ... }`

This keeps `/collections/new-arrivals` as the main route while preserving `/collections/new-collections` as an alias.