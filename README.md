# SigmaMath - Platformă de Meditații la Matematică 📐

O platformă web modernă, rapidă și interactivă destinată rezervării sesiunilor de meditații la matematică. Construită exclusiv cu **HTML, CSS și Vanilla JavaScript**, aplicația dispune de un frontend vibrant cu animații complexe și de un **Panou de Administrare complet funcțional** susținut de `localStorage`.

---

## 🌟 Funcționalități Principale

### 1. Landing Page (Frontend Public)
- **Design Ultra-Modern:** Interfață *Dark Mode* cu tematică de neon, layout-uri flexibile bazate pe *Flexbox*, efecte *Glassmorphism* și micro-interacțiuni.
- **Sandbox Matematic Interactiv:** O secțiune animată, controlată de utilizator prin slidere, care desenează în timp real pe un grafic o funcție trigonometrică.
- **Metodologie Completă:** O secțiune de beneficii expusă printr-un UI centrat, dinamic, cu rubrici precum *Evaluare Inițială, Rapoarte de Progres, Tablă Interactivă, Comunitate & Suport și Teste & Quiz-uri*.
- **Formular Inteligent de Rezervare:** Permite elevilor să își introducă datele, nivelul de studiu și formatul dorit (1-la-1 sau Grup).
- **Notificări Automate prin Email:** Integrat cu [FormSubmit](https://formsubmit.co/), fiecare cerere completată trimite instant un email direct din frontend către `sigma.math.ro@gmail.com`.

### 2. Panou de Administrare (Admin Dashboard)
- **Autentificare Locală:** Acces securizat cu parolă pentru profesor.
- **Gestionare prin Tab-uri:**
  - **Cereri Noi:** Solicitările noi venite de pe platformă, așteptând validarea.
  - **Ore Consacrate:** Tabelul elevilor programați (rândurile sunt interactive și deschid automat datele complete ale slotului/grupului la click).
  - **Persoane Nealocate:** Zona de siguranță ("Soft Delete") pentru a nu pierde datele copiilor eliberați din orar; de aici se fac ștergerile definitive.

### 3. Modul Avansat de Gestionare a Orarului (Sloturi)
- **Sistem de Grupe:** Calendarul recunoaște diferența dintre sloturile *Solo* și *Grup*, colorându-le distinct și contorizând participanții.
- **Modal Multi-Elev:** La click pe un slot de grup sau pe un rând din tabel, administratorul poate vizualiza toți elevii existenți în acea oră, îi poate elibera / șterge independent, sau poate adăuga manual pe altcineva.
- **Alocare și Auto-completare Inteligentă:** La adăugarea manuală a unui elev nou într-o grupă existentă, formularul **pre-completează și blochează automat** nivelul de studiu și formatul, pe baza grupului respectiv (prevenind mixarea unui elev de gimnaziu într-o grupă de liceu).

---

## 🛠️ Tehnologii Utilizate

- **HTML5 & CSS3:** Fără framework-uri greoaie; utilizăm Flexbox, variabile CSS (Custom Properties) și keyframes pentru performanță maximă.
- **Vanilla JavaScript (ES6+):** Logica de gestiune a datelor și interactivitatea (fără React, Vue sau Angular).
- **LocalStorage API:** Persistența datelor în browser (JSON) servind rolul de "bază de date".
- **Lucide Icons:** Pachet open-source pentru iconografie curată.
- **FormSubmit API:** Endpoint webhook pentru preluarea datelor și trimiterea email-urilor, fără a necesita un server de backend.

---

## 🚀 Rulare și Instalare

Deoarece platforma este construită complet static (Frontend-only), procesul de rulare este instant:
1. Descarcă sau clonează acest repository.
2. Deschide fișierul `index.html` în orice browser modern (Chrome, Edge, Safari, Firefox).
3. **Nu necesită NodeJS, npm, sau setări de server!** 

*(Notă: Pentru a testa funcționalitatea de e-mail a FormSubmit, o singură primă completare a formularului va trimite un link de confirmare către căsuța de e-mail de primire; după click-ul pe activare, toate mail-urile ulterioare ajung automat).*

---

> *Proiect dezvoltat de Antigravity (Google DeepMind).*
