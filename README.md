# SigmaMath - Platformă de Meditații la Matematică 📐

O platformă web modernă, rapidă și interactivă destinată rezervării sesiunilor de meditații la matematică. Construită exclusiv cu **HTML, CSS și Vanilla JavaScript**, aplicația dispune de un frontend vibrant cu animații complexe și de un **Panou de Administrare complet funcțional** susținut de `localStorage`.

---

## 🌟 Funcționalități Principale

### 1. Landing Page (Frontend Public)
- **Design Ultra-Modern:** Interfață *Dark Mode* cu tematică de neon, efecte *Glassmorphism* și micro-interacțiuni (hover effects, tooltips).
- **Sandbox Matematic Interactiv:** O secțiune animată, controlată de utilizator prin slidere, care desenează în timp real pe un grafic o funcție trigonometrică.
- **Formular Inteligent de Rezervare:** Permite elevilor să își introducă datele, nivelul de studiu și formatul dorit (1-la-1 sau Grup). Include un modul vizual pentru alegerea dinamică a unui interval orar disponibil din calendar.
- **Notificări Automate prin Email:** Integrat cu [FormSubmit](https://formsubmit.co/), fiecare cerere completată trimite instant un email către administrator, direct din frontend.

### 2. Panou de Administrare (Admin Dashboard)
- **Autentificare Locală:** Acces securizat cu parolă pentru profesor (Email: `sigma.math.ro@gmail.com` | Parolă: `mamaligacucapac`).
- **Gestionare prin Tab-uri:**
  - **Cereri Noi:** Solicitările noi venite de pe platformă, așteptând validarea profesorului.
  - **Ore Consacrate:** Tabelul elevilor deja programați, afișând sloturile curente și permisiunea de a le schimba.
  - **Persoane Nealocate:** Zona de siguranță ("Soft Delete") pentru a nu pierde datele copiilor șterși din orar; din acest tab se pot face ștergerile definitive din baza de date.

### 3. Modul Avansat de Gestionare a Orarului (Sloturi)
- **Sistem de Grupe:** Calendarul recunoaște și randează inteligent diferența dintre sloturile *Solo* (cu un singur elev) și cele de *Grup* (colorate diferit, ex: "Grup: 3").
- **Modal Multi-Elev:** La un simplu click pe un slot de grup sau pe un rând din tabel, administratorul poate vizualiza toți elevii existenți în acea oră, îi poate elibera / șterge independent, sau poate adăuga manual pe altcineva.
- **Alocare cu 1-Click:** Din panou, adminul poate asocia instant orice cerere venită cu un interval din calendar, iar UI-ul se actualizează dinamic.

---

## 🛠️ Tehnologii Utilizate

- **HTML5 & CSS3:** Fără framework-uri greoaie; utilizăm CSS Grid, Flexbox, variabile CSS (Custom Properties) și keyframes pentru performanță maximă.
- **Vanilla JavaScript (ES6+):** Logica de gestiune a datelor și interactivitatea (fără React, Vue sau Angular).
- **LocalStorage API:** Persistența datelor în browser (JSON) servind rolul de "bază de date" pentru varianta demonstrativă a aplicației.
- **Lucide Icons:** Pachet open-source pentru o iconografie vectorială curată și modernă.
- **FormSubmit API:** Endpoint webhook pentru preluarea datelor și trimiterea email-urilor fără a necesita un server de backend.

---

## 🚀 Rulare și Instalare

Deoarece platforma este construită complet static (Frontend-only), procesul de rulare este instant:
1. Descarcă sau clonează acest repository.
2. Deschide fișierul `index.html` în orice browser modern (Chrome, Edge, Safari, Firefox).
3. **Nu necesită NodeJS, npm, sau setări de server!** Pentru a testa email-urile, reține că scriptul folosește `formsubmit.co` și cere o acțiune inițială de confirmare a adresei pe email-ul primitorului.

---

## 🎨 Ghid de Navigare a Codului

- `index.html` - Conține întreaga structură a platformei (Hero section, Formular, Beneficii) dar și toate elementele Modalurilor (Login, Dashboard, Slot Manager).
- `style.css` - Declarațiile variabilelor, estetica sticlei (`.glass-card`), logica de layout responsive și stările elementelor interactive din tabelul de admin.
- `main.js` - Starea aplicației (managementul tab-urilor din admin, salvarea/ștergerea în LocalStorage, redarea calendarului vizual, animația graficului SVG).

---

> *Proiect dezvoltat de Antigravity (Google DeepMind).*
