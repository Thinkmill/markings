---
"@markings/types": minor
---

Move `Source` type out of main entrypoint and to `@markings/types/source` because `@markings/types` is used by the front-end packages but they do not use the `Source` type and the `Source` type uses a type from Babel and type-checking `@babel/types` takes multiple seconds.
