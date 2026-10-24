# SEO implementation notes

This branch adds Next.js Metadata API handlers for `/sitemap.xml` and `/robots.txt`.

Public sitemap pages: homepage, studio, biblioteca, glossario, progetto, regolamento, community, and the nine authored readings sourced from `lib/content.ts`. Personal notebook, admin, auth and API endpoints are excluded. Dynamic community discussions are not included.

Validate the canonical production domain and redirects before merging. No lastModified dates are invented: add meaningful publication/revision timestamps once editorial data supports them.

Check generated `/robots.txt`, `/sitemap.xml`, each page's canonical tag, Search Console indexing, and build status in the preview deployment before merging.
