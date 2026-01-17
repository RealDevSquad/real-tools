# Metadata Remover

A premium, privacy-focused web application that strips sensitive metadata (Exif, XMP, IPTC) from images entirely in the browser.

## Features

- **🛡️ 100% Client-Side Privacy**: Images are processed locally using the HTML5 Canvas API. No files are ever uploaded to a server.
- **✨ Professional UI**: Clean, dark-mode interface with glassmorphism effects and smooth animations.
- **⚡ Instant Processing**: Removes metadata by re-encoding image data to a fresh container.
- **📊 Privacy Report**: Visual checklist of stripped data (GPS, Camera Model, Software, etc.).
- **🟢 High-Visibility Download**: Prominent, accessible download actions.

## Tech Stack

- **Framework**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

1.  **Clone the repository**

    ```bash
    git clone https://github.com/iamitprakash/metaData-remover.git
    cd metaData-remover
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # Ensure standard styles are set up
    npm install -D tailwindcss postcss autoprefixer
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

## How It Works

The application creates a new `Image` object from the uploaded file and draws it onto an `OffscreenCanvas` (or standard `canvas`). This process effectively discards the original file container along with its metadata tags (Exif, XMP, IPTC). The canvas is then exported as a new clean Blob.

## License

MIT
