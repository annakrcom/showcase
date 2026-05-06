# Anna Kryzhanivska — Portfolio

Static portfolio site for a photo retoucher. Plain HTML/CSS/JS — no build step.

## Structure

```
porto/
├── index.html          # Root: redirects to /en/ (or browser language)
├── 404.html            # GitHub Pages 404 page
├── assets/
│   ├── css/style.css   # Single shared stylesheet (dark theme)
│   ├── js/main.js      # Mobile nav toggle
│   └── images/         # Drop your real images here
├── en/                 # English pages
├── de/                 # German pages
├── fr/                 # French pages
└── it/                 # Italian pages
```

Each language folder contains the same 7 pages:
`index.html`, `services.html`, `portfolio.html`, `experience.html`, `faq.html`, `contact.html`.

## Edit content

Open any `.html` file in a text editor and change the text between the tags. The structure is the same in every file — header on top, content in the middle, footer at the bottom.

To change the same text in all 4 languages, edit it in `en/`, `de/`, `fr/`, and `it/`.

## Change colors / fonts

Edit `assets/css/style.css`. Variables at the top:

```css
:root {
  --bg: #0e0e0e;       /* page background */
  --text: #e8e8e8;     /* main text */
  --accent: #c9a86a;   /* accent (gold) */
}
```

## Add real portfolio images

1. Drop your images into `assets/images/portfolio/`.
2. In each `portfolio.html` file, replace the placeholder `<div class="portfolio-item">` blocks with:
   ```html
   <a class="portfolio-item" href="../assets/images/portfolio/your-image.jpg">
     <img src="../assets/images/portfolio/your-image.jpg" alt="Description">
   </a>
   ```

## Update contact info

In each `contact.html`, change `hello@example.com` to your real email and update the social links.

## Preview locally

Just double-click `index.html` in Finder, or run a tiny local server:

```bash
cd porto
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a new public repo on GitHub (e.g. `portfolio`).
2. Push the contents of this folder to the repo:
   ```bash
   cd porto
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/<username>/portfolio.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source: `main` branch, root folder**.
4. Your site goes live at `https://<username>.github.io/portfolio/`.

## Add a custom domain (later)

Create a `CNAME` file in the project root containing just your domain name (e.g. `annakryzhanivska.com`), then point your DNS to GitHub Pages.
