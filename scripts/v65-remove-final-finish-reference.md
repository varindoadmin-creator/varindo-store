# V65 Remove Final Finish Reference

Fixed build error:

`Cannot find name 'finish'`

The remaining reference was in:
`const hasActiveFilters = query || collection || category || finish || size;`

Corrected to:
`const hasActiveFilters = query || collection || category || size;`