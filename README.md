# Lottie Animation Editor

A professional Lottie animation editor built with Next.js and React, featuring a beautiful Canva-like UI.

## ✨ Features

- **File Upload**: Drag-and-drop, multi-file upload, URL import, ZIP support
- **Animation Canvas**: Play/pause, frame scrubbing, zoom (25%-200%), grid overlay
- **Layer Editing**: Multi-select layers, edit colors and opacity with real-time preview
- **Color Palettes**: 5 presets + custom palettes
- **Optimization**: Remove hidden layers, reduce file size
- **Batch Operations**: Bulk optimize and apply palettes to multiple files
- **Export**: Download edited animations as JSON

## 🚀 Getting Started

1. **Upload a Lottie File**
   - Drag and drop a `.json` or `.zip` file
   - Or paste a URL to a Lottie animation
   - Try the sample file: `/public/sample-lottie.json`

2. **Edit Your Animation**
   - Click "Open Editor" on any uploaded file
   - Select layers and modify colors/opacity
   - Apply color palettes for quick styling
   - Use the canvas controls to preview changes

3. **Export**
   - Click "Optimize" to reduce file size
   - Click "Export" to download your edited animation

## 🎨 Test the Editor

You can test with the included sample animation at `public/sample-lottie.json` or any Lottie file from [LottieFiles](https://lottiefiles.com/).

## 📚 API Endpoints

- `POST /api/upload` - Upload files
- `GET /api/file/[id]` - Get animation data
- `POST /api/file/[id]/edit-layer` - Edit layer properties
- `POST /api/file/[id]/apply-palette` - Apply color palette
- `POST /api/file/[id]/optimize` - Optimize animation
- `GET /api/file/[id]/export` - Download animation
- `POST /api/batch` - Batch operations

## 🛠️ Built With

- **Next.js 15** - React framework with serverless API routes
- **React 19** - UI library
- **lottie-web** - Animation rendering
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## 📝 Notes

- Data is stored in memory during development (clears on server restart)
- For production, consider adding persistent storage (Vercel KV, PostgreSQL, Redis)
- Sessions expire after 24 hours

## 🚢 Deploy to Production

Ready to deploy? This app is designed for serverless deployment:

1. **Vercel** (Recommended): One-click deployment
2. Add persistent storage for production use
3. Consider adding user authentication

---

Built with ❤️ using Next.js and React
