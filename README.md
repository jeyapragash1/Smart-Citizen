
# Smart Citizen LK Frontend

Smart Citizen LK is a national digital service platform for Sri Lanka, providing citizens with access to e-services, document verification, smart marketplace, and more. This is the frontend application built with Next.js and React.

## 🚀 Features

- Modern, responsive UI with Tailwind CSS
- Floating AI Chatbot for instant help
- Authentication (register, login, OTP verification)
- Citizen services: Passports, NICs, Birth Certificates, Police Clearance, Payments, etc.
- Admin and GS officer dashboards
- Smart Marketplace for products
- Document verification and wallet
- Newsletter subscription
- Modular, scalable codebase

## 🛠️ Tech Stack

- [Next.js 16 (App Router)](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Lucide React Icons](https://lucide.dev/)
- [Vercel Geist Font](https://vercel.com/font)

## Getting Started

## Getting Started


### 1. Clone the repository

```bash
git clone https://github.com/jeyapragash1/Smart-Citizen.git
cd Smart-Citizen
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the development server


```bash
npm run dev
# or
yarn dev
```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


## 🌐 API Backend

This frontend expects a backend API running at `http://127.0.0.1:8000` (see `lib/api.ts`). Make sure to start the backend server for full functionality.

## 📦 Build & Deploy

To build for production:

```bash
npm run build
npm start
```

You can deploy on [Vercel](https://vercel.com/) or any platform supporting Next.js 16.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

MIT
