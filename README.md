# Money Master Pro — iPhone Offline Budget-App

## Enthalten
- `index.html` — App-Struktur
- `styles.css` — Premium-Dark-Design mit Neon-Grün, Animationen und responsivem Layout
- `app.js` — Buchungen, Budgets, Sparziele, Schulden, Diagramm, Import/Export
- `manifest.webmanifest` — PWA-Metadaten
- `sw.js` — Offline-Caching für die Web-App
- `assets/icon-192.png`, `assets/icon-512.png` — App-Icons

## Funktionen
- Übersicht mit Saldo, monatlichen Einnahmen/Ausgaben und Cashflow-Diagramm
- Buchungen hinzufügen, bearbeiten und einzeln löschen
- Monatsbudget mit Fortschrittsanzeige
- Sparziele mit Einzahlung, Bearbeitung und Löschen
- Schulden mit Rückzahlungen, Bearbeitung und Löschen
- JSON-Backup exportieren und importieren
- Daten lokal im Browser speichern; kein Konto nötig
- Responsive Layout mit iPhone-Safe-Area und Navigation unten

## Auf dem iPhone nutzen
Die App ist als installierbare Web-App (PWA) vorbereitet. Für Installation und Offline-Cache muss sie zuerst über HTTPS bereitgestellt werden (z. B. GitHub Pages). Danach:
1. URL in Safari öffnen.
2. Teilen antippen.
3. „Zum Home-Bildschirm“ auswählen.
4. App über das neue Symbol starten.
5. Einmal online öffnen, damit die Dateien im Offline-Cache landen.

Eine direkt aus einer ZIP-Datei gestartete lokale HTML-Datei wird auf iOS nicht in allen Fällen wie eine installierte Offline-App funktionieren. Das ZIP enthält keine native iOS-App und kein App-Store-Paket.

## Datenschutz / wichtige Hinweise
Finanzdaten werden in `localStorage` auf dem Gerät gespeichert. Browserdaten löschen, die Website-Daten entfernen oder die Web-App neu aufsetzen kann diese Daten löschen. Bitte regelmäßig Backups exportieren. Beim Import ersetzt die ausgewählte Sicherung den aktuellen App-Datenbestand. Es werden keine Bankkonten verbunden und keine Live-Börsenkurse abgerufen.

## Offline-Schriftarten
Das Styling verwendet derzeit Google Fonts als optionale Schriftquelle. Entferne die `@import`-Zeile in `styles.css`, wenn keine externe Schriftquelle geladen werden soll. Die App verwendet dann System-Schriftarten als Fallback.
