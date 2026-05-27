# V73 Fix Duplicate New Arrivals Key

Fixed build error:

`An object literal cannot have multiple properties with the same name`

Cause:
The collections metadata object contained duplicate `new-arrivals` keys.

Fix:
Rebuilt the collection metadata object with one valid key each:
- new-arrivals
- new-collections
- best-sellers
- promo-items
- woods
- patterns
- solids