# Dashboard Pengelolaan Peminjaman Buku Perpustakaan

Aplikasi dashboard mobile (React Native + Expo, TypeScript) untuk mengelola data peminjaman buku perpustakaan dengan state management terstruktur menggunakan `useReducer` dan Context API.

## Cara Instalasi & Menjalankan

```bash
npm install
npx expo start
```

Perintah tambahan:

```bash
npm run android   # buka di Android
npm run ios       # buka di iOS
npm run web       # buka di web
npm run lint      # lint
npx tsc --noEmit  # typecheck
```

## Fitur

- Pengelolaan data peminjaman (tambah, ubah status, hapus via reducer)
- State global data peminjaman dengan `LoanContext` + `useReducer`
- Form tambah peminjaman (controlled input, validasi wajib isi, reset setelah submit)
- Ubah status pengembalian (Belum/Sudah Dikembalikan)
- Filter daftar: Semua / Belum Dikembalikan / Sudah Dikembalikan
- Tema terang & gelap dengan `ThemeContext`
- Dashboard ringkasan (Total, Belum Dikembalikan, Sudah Dikembalikan) dari derived state

## Struktur Folder

```text
.
├── App.tsx
├── blueprint.md
├── README.md
├── screenshots/
└── src/
    ├── app/                  # Expo Router entry (layout + index)
    ├── components/
    │   ├── FilterBar.tsx
    │   ├── LoanForm.tsx
    │   ├── LoanItem.tsx
    │   ├── LoanList.tsx
    │   ├── SummaryCard.tsx
    │   └── ThemeToggle.tsx
    ├── context/
    │   ├── LoanContext.tsx
    │   └── ThemeContext.tsx
    ├── reducers/
    │   └── loanReducer.ts
    ├── screens/
    │   └── DashboardScreen.tsx
    ├── theme/
    │   └── colors.ts
    └── types/
        └── index.ts
```

> Catatan: Proyek ini menggunakan Expo Router (`src/app/`) sebagai entry navigasi, dan `App.tsx` juga disediakan sesuai blueprint sebagai wrapper provider + screen.

## Screenshot

Screenshot disimpan di folder `screenshots/` (pengambilan manual dari emulator/perangkat):

- `01-dashboard.png` — tampilan dashboard dengan kartu ringkasan
- `02-form-peminjaman.png` — formulir tambah peminjaman
- `03-filter-semua.png` — filter Semua
- `04-filter-belum.png` — filter Belum Dikembalikan
- `05-filter-sudah.png` — filter Sudah Dikembalikan
- `06-status-sebelum.png` — sebelum status diubah
- `07-status-sesudah.png` — sesudah status diubah
- `08-tema-terang.png` — tema terang
- `09-tema-gelap.png` — tema gelap

## Penjelasan State Management

### 1. Penerapan State Management
State aplikasi dibagi menjadi dua konteks terpisah:
- **State data peminjaman** dikelola oleh `LoanProvider`/`useLoans` di `src/context/LoanContext.tsx` menggunakan `useReducer` (`src/reducers/loanReducer.ts`).
- **State tema** dikelola oleh `ThemeProvider`/`useTheme` di `src/context/ThemeContext.tsx` menggunakan `useState` untuk mode `light/dark`.

Pemisahan ini dilakukan karena tanggung jawabnya berbeda (data bisnis vs preferensi tampilan), sehingga perubahan tema tidak tercampur dengan logika data dan re-render lebih terkontrol. Data peminjaman terpusat pada satu sumber kebenaran (*single source of truth*) di `LoanState` (`loans` dan `filter`), lalu dibagikan ke komponen melalui Context.

### 2. Fungsi `useReducer`
Di `LoanContext.tsx` digunakan:
```ts
const [state, dispatch] = useReducer(loanReducer, initialState);
```
- `state`: kondisi data saat ini (`LoanState` berisi `loans` dan `filter`).
- `dispatch`: fungsi untuk mengirim aksi/perintah perubahan state.
- `action`: objek berisi `type` dan (opsional) `payload` (`src/types/index.ts`).
- `reducer`: fungsi murni `loanReducer(state, action)` yang menerima state lama dan action, lalu mengembalikan state baru.

`useReducer` dipilih karena jenis aksi perubahan data cukup banyak (`ADD_LOAN`, `TOGGLE_RETURN`, `DELETE_LOAN`, `SET_FILTER`), logika transisi state terpusat di satu tempat, lebih mudah dilacak, dan mudah diuji.

| Action | Fungsi |
|--------|--------|
| `ADD_LOAN` | Menambah data peminjaman baru (generate `id`, set `isReturned: false`) |
| `TOGGLE_RETURN` | Mengubah status sudah/belum dikembalikan berdasarkan `id` |
| `DELETE_LOAN` | Menghapus data peminjaman berdasarkan `id` (opsional, tersedia di reducer) |
| `SET_FILTER` | Mengubah filter tampilan (`all`/`borrowed`/`returned`) |

### 3. Context API
- `createContext` digunakan untuk membuat `LoanContext` dan `ThemeContext`.
- `Provider` (`LoanProvider`, `ThemeProvider`) membungkus tree komponen dan menyediakan value state/fungsi ke anak-anaknya.
- Custom hook `useLoans()` dan `useTheme()` membungkus `useContext` sekaligus memberi error jika dipakai di luar Provider.

Context mengatasi masalah **props drilling** (mengoper data/fungsi berlapis-lapis lewat props) karena komponen seperti `LoanForm`, `FilterBar`, `LoanList`, `LoanItem`, `SummaryCard`, dan `ThemeToggle` dapat langsung mengakses data/aksi dari hook tanpa menerima props data peminjaman dari parent.

Hierarki Provider (di `src/app/_layout.tsx` dan `App.tsx`):
```text
ThemeProvider → LoanProvider → DashboardScreen (via Stack/index)
```

### 4. Proses Perubahan State
- **Tambah peminjaman:** User mengisi form di `LoanForm.tsx` lalu menekan Tambah → validasi field wajib → `dispatch({ type: 'ADD_LOAN', payload })` → `loanReducer` membuat array `loans` baru dengan item baru di awal → `LoanProvider` memperbarui `state` → komponen pemakai `useLoans()` render ulang → `LoanList` dan kartu ringkasan (`SummaryCard` via derived values) berubah.
- **Ubah status:** User menekan tombol status di `LoanItem.tsx` → `dispatch({ type: 'TOGGLE_RETURN', payload: { id } })` → reducer memetakan array dan membalik `isReturned` pada item terkait (immutable) → UI badge/tombol dan angka ringkasan ter-update.
- **Filter:** User menekan tombol di `FilterBar.tsx` → `dispatch({ type: 'SET_FILTER', payload })` → `state.filter` berubah → `filteredLoans` dihitung ulang di `LoanContext` (`useMemo`) → `LoanList` menampilkan data sesuai filter.
- **Ganti tema:** User menekan `ThemeToggle.tsx` → `toggleTheme()` mengubah `mode` di `ThemeContext` → `colors` baru (light/dark dari `src/theme/colors.ts`) dibagikan lewat Context → seluruh komponen yang memakai `useTheme()` berganti warna, dan `StatusBar` di `DashboardScreen` menyesuaikan gaya.

Prinsip **immutability** diterapkan di reducer: state tidak dimutasi langsung. Setiap perubahan mengembalikan objek/array baru (`{ ...state }`, spread array, `map`, `filter`) sehingga perubahan state mudah dilacak dan aman untuk proses render React.
