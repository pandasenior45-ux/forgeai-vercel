# ForgeAI — GitHub + Vercel + Firebase Setup

## Files
- `index.html` — poora app (frontend)
- `api/generate.js` — Vercel serverless function, Gemini key yahan server-side use hoti hai
- `package.json`, `.gitignore` — project files

## 1) GitHub par upload
```
git init
git add .
git commit -m "ForgeAI - vercel + firebase"
git branch -M main
git remote add origin <apna-repo-url>
git push -u origin main
```

## 2) Vercel par deploy + API key
1. vercel.com par login karo, **Add New → Project**.
2. Apna GitHub repo import karo (koi build settings change karne ki zaroorat nahi — Vercel HTML + `/api` ko khud detect kar leta hai).
3. Deploy se pehle **Environment Variables** section mein:
   - Name: `GEMINI_API_KEY`
   - Value: apni asal Gemini API key
   - (optional) `GEMINI_MODEL` = `gemini-2.5-flash` agar koi doosra model use karna ho
4. **Deploy** dabao.
5. Baad mein bhi key add/change karni ho to: Project → **Settings → Environment Variables** → add/edit → phir **Deployments** tab se **Redeploy** zaroor karo (env var sirf naye deploy par apply hoti hai).

Key ab sirf `api/generate.js` (server) mein hai — browser/view-source mein kabhi nahi dikhegi.

## 3) Firebase Google Sign-In setup
1. [console.firebase.google.com](https://console.firebase.google.com) par naya project banao.
2. **Build → Authentication → Get started → Sign-in method** → **Google** ko enable karo.
3. **Project settings (gear icon) → General → Your apps** → **Web app (</>)** add karo.
4. Jo `firebaseConfig` object milega, usse copy kar ke `index.html` mein is jagah paste karo:
   ```js
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     appId: "..."
   };
   ```
5. **Authentication → Settings → Authorized domains** mein apna Vercel domain add karo (jaise `yourapp.vercel.app`) — warna Google popup sign-in **error** dega. Ye step bhoolna sabse common mistake hai.
6. Changes GitHub par push karo → Vercel khud redeploy kar dega.

## Notes / Limitations (jaanbojh kar as-is chora)
- Credits abhi bhi **is browser ke localStorage** mein hain — Google sign-in se identity real hoti hai, lekin credits cross-device sync nahi hongi (uske liye Firestore chahiye hoga, alag task hai).
- Admin panel password (`ADMIN_PASSWORD` in `index.html`) abhi bhi client-side hai — kisi bhi user ke view-source mein dikh sakta hai. Real production ke liye ye bhi backend (jaise `api/`) mein move karna chahiye.
- Gemini quota khatam ho ya `/api/generate` fail ho, to app automatically built-in **offline template** use kar leti hai taake user ko khali screen na mile.
