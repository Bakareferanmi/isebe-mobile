# Isebe — React Native (Expo) app

Mobile rebuild of the Isebe restaurant web app. Same Firebase project and Cloudinary account, so the
existing menu, homepage content, blog posts and analytics data all carry over.

## Run it

```bash
npm install
npx expo start          # scan the QR code with the Expo Go app (Android / iOS)
npm run typecheck       # tsc --noEmit
```

## Before you ship — please check

1. **WhatsApp number** – set it in the app's admin → Homepage tab (stored in Firestore as `whatsapp_num`),
   or change the default in `src/data/fallback.ts`.
2. **Firestore rules** – the Firebase config in `src/lib/firebase.ts` is public by design; your security rules
   are what protect writes. Make sure only signed-in admins can write `menu_items`, `blog_posts`, `site`,
   and that anonymous users can only `increment` the analytics docs.
3. **Admin access** – triple-tap the logo (top-left) to open the admin panel, same as the web app.

## Structure

```
src/app/            Expo Router screens (index, cart modal, blog/[id], legal/[type], admin)
src/components/     Hero, FeaturedCarousel, MenuRow, BlogCard, admin/* tabs
src/context/        DataContext (Firestore listeners), CartContext (+WhatsApp checkout), ToastContext
src/lib/            firebase, analytics, cloudinary upload, theme tokens, formatters
src/data/           fallback menu/posts, legal text
```

## Web → native mapping

| Web | Native |
| --- | --- |
| `app.js` Firestore `onSnapshot` listeners | `DataContext` |
| cart array + drawer | `CartContext` + `/cart` modal |
| `wa.me` checkout link | `Linking.openURL` |
| `localStorage` visitor id | AsyncStorage |
| `<input type=file>` + Cloudinary | `expo-image-picker` + Cloudinary |
| service worker / manifest | not needed (use EAS Build for installable APKs/IPAs) |

## Build an installable app

```bash
npm i -g eas-cli
eas login
eas build -p android --profile preview   # APK you can sideload
```
