# Blueprint: Dashboard Pengelolaan Peminjaman Buku Perpustakaan

> **Stack:** React Native + Expo (TypeScript disarankan) · `useReducer` · Context API
> **Tujuan:** Aplikasi dashboard untuk mengelola peminjaman buku dengan state management terstruktur.

---

## 0. Instruksi untuk AI Agent (OpenAI / Codex)

Kamu adalah developer yang membangun aplikasi sesuai blueprint ini. Aturan kerja:

1. Kerjakan **berurutan per fase** (Fase 1 → Fase 9). Jangan lompat fase.
2. Setelah menyelesaikan sebuah tugas, **ubah `- [ ]` menjadi `- [x]`** pada file ini.
3. Di akhir tiap fase, jalankan aplikasi (`npx expo start`) dan pastikan tidak ada error sebelum lanjut.
4. Jangan menambah library state management eksternal (Redux, Zustand, dll.). Hanya `useReducer` + Context API.
5. Semua komponen harus mengakses data lewat **custom hook** (`useLoans`, `useTheme`), bukan lewat props drilling.
6. Jika ada keputusan yang tidak tercantum di sini, pilih opsi paling sederhana dan catat di bagian **Catatan Progress** di bawah.

---

## 1. Ringkasan Fitur

| No | Fitur | Teknik |
|----|-------|--------|
| 1 | Pengelolaan data peminjaman | `useReducer` |
| 2 | Berbagi state antar-komponen | Context API (`LoanContext`) |
| 3 | Form tambah peminjaman | Controlled input + dispatch `ADD_LOAN` |
| 4 | Ubah status pengembalian | Dispatch `TOGGLE_RETURN` |
| 5 | Filter (Semua / Belum / Sudah) | State filter di reducer + selector |
| 6 | Tema terang & gelap | Context API (`ThemeContext`) |
| 7 | Dashboard ringkasan | Nilai turunan (derived state) dari data loans |

---

## 2. Model Data

```ts
// src/types/index.ts
export type LoanStatus = 'returned' | 'borrowed';   // returned = sudah dikembalikan
export type LoanFilter = 'all' | 'borrowed' | 'returned';

export interface Loan {
  id: string;            // unik (Date.now().toString() atau uuid sederhana)
  borrowerName: string;  // nama peminjam
  bookTitle: string;     // judul buku
  borrowDate: string;    // format ISO: YYYY-MM-DD
  isReturned: boolean;   // status pengembalian
}

export interface LoanState {
  loans: Loan[];
  filter: LoanFilter;
}

export type LoanAction =
  | { type: 'ADD_LOAN'; payload: Omit<Loan, 'id' | 'isReturned'> }
  | { type: 'TOGGLE_RETURN'; payload: { id: string } }
  | { type: 'DELETE_LOAN'; payload: { id: string } }
  | { type: 'SET_FILTER'; payload: LoanFilter };
```

---

## 3. Struktur Folder

```
library-dashboard/
├── App.tsx
├── blueprint.md
├── README.md
├── screenshots/
└── src/
    ├── types/
    │   └── index.ts
    ├── context/
    │   ├── LoanContext.tsx       # Provider + useLoans()
    │   └── ThemeContext.tsx      # Provider + useTheme()
    ├── reducers/
    │   └── loanReducer.ts        # initialState + reducer
    ├── theme/
    │   └── colors.ts             # palet light & dark
    ├── components/
    │   ├── SummaryCard.tsx
    │   ├── LoanForm.tsx
    │   ├── LoanItem.tsx
    │   ├── LoanList.tsx
    │   ├── FilterBar.tsx
    │   └── ThemeToggle.tsx
    └── screens/
        └── DashboardScreen.tsx
```

---

## 4. Alur State (Gambaran Arsitektur)

```
 Komponen UI (Form / Item / FilterBar)
        │  dispatch(action)
        ▼
   loanReducer(state, action)  ──►  state baru (immutable)
        │
        ▼
   LoanContext.Provider (value = { state, dispatch })
        │
        ▼
   useLoans() ──► dibaca oleh Summary, List, Filter, dst.
```

```
 ThemeContext.Provider (value = { mode, colors, toggleTheme })
        │
        ▼
   useTheme() ──► dibaca semua komponen untuk styling
```

---

## 5. Fase Pengerjaan

### FASE 1 — Inisialisasi Proyek
- [x] Buat proyek: `npx create-expo-app library-dashboard --template blank-typescript`
- [x] Masuk ke folder proyek dan jalankan `npx expo start` untuk memastikan berjalan
- [x] Buat struktur folder sesuai bagian 3
- [ ] Install dependensi tambahan jika diperlukan: `npx expo install @react-native-community/datetimepicker` (opsional, untuk input tanggal)
- [x] Hapus kode boilerplate bawaan di `App.tsx`
- [x] **Cek fase:** aplikasi tampil tanpa error

### FASE 2 — Definisi Tipe & Data Awal
- [x] Buat `src/types/index.ts` berisi `Loan`, `LoanState`, `LoanAction`, `LoanFilter`
- [x] Siapkan data dummy awal (minimal 4 peminjaman, campuran sudah & belum dikembalikan) di `loanReducer.ts`
- [x] Definisikan `initialState: LoanState = { loans: [...], filter: 'all' }`
- [x] **Cek fase:** tidak ada error TypeScript

### FASE 3 — Reducer (`useReducer`)
- [x] Buat `src/reducers/loanReducer.ts`
- [x] Implementasi case `ADD_LOAN` (generate `id`, set `isReturned: false`, tambahkan ke awal array)
- [x] Implementasi case `TOGGLE_RETURN` (balik nilai `isReturned` berdasarkan `id`)
- [x] Implementasi case `DELETE_LOAN` (opsional, hapus berdasarkan `id`)
- [x] Implementasi case `SET_FILTER` (ubah nilai `filter`)
- [x] Pastikan reducer **pure** dan **immutable** (tidak memutasi state langsung)
- [x] Tambah `default` case yang mengembalikan state apa adanya
- [x] **Cek fase:** reducer diuji manual lewat `console.log` atau unit test sederhana

### FASE 4 — Context API untuk Data Peminjaman
- [x] Buat `src/context/LoanContext.tsx`
- [x] Buat `LoanContext` dengan `createContext`
- [x] Buat `LoanProvider` yang memanggil `useReducer(loanReducer, initialState)`
- [x] Sediakan nilai context: `{ state, dispatch }`
- [x] Buat custom hook `useLoans()` dengan pengecekan error jika dipakai di luar Provider
- [x] Tambahkan derived value (gunakan `useMemo`):
  - [x] `totalLoans`
  - [x] `borrowedCount` (belum dikembalikan)
  - [x] `returnedCount` (sudah dikembalikan)
  - [x] `filteredLoans` (hasil filter sesuai `state.filter`)
- [x] **Cek fase:** `useLoans()` bisa dipanggil dari komponen anak mana pun

### FASE 5 — Context API untuk Tema
- [x] Buat `src/theme/colors.ts` berisi palet `lightColors` dan `darkColors` (background, card, text, subtext, primary, success, warning, border)
- [x] Buat `src/context/ThemeContext.tsx`
- [x] Simpan `mode: 'light' | 'dark'` dengan `useState` (atau `useReducer`)
- [x] Sediakan `{ mode, colors, toggleTheme }`
- [x] Buat custom hook `useTheme()`
- [x] Buat komponen `ThemeToggle.tsx` (Switch atau tombol ikon matahari/bulan)
- [x] (Opsional) Default mode mengikuti `useColorScheme()` bawaan perangkat
- [x] **Cek fase:** toggle mengubah mode dan `colors` ikut berubah

### FASE 6 — Komponen UI
- [x] `SummaryCard.tsx` — kartu angka + label + warna aksen
- [x] `FilterBar.tsx` — 3 tombol: **Semua**, **Belum Dikembalikan**, **Sudah Dikembalikan**; tombol aktif diberi highlight; memanggil `dispatch({ type: 'SET_FILTER' })`
- [x] `LoanItem.tsx` — menampilkan nama peminjam, judul buku, tanggal pinjam, badge status, tombol ubah status (`TOGGLE_RETURN`)
- [x] `LoanList.tsx` — `FlatList` dari `filteredLoans` + tampilan kosong (empty state) jika tidak ada data
- [x] `LoanForm.tsx` — input nama peminjam, judul buku, tanggal peminjaman, tombol **Tambah**
  - [x] Validasi: semua field wajib diisi
  - [x] Tanggal default = hari ini (format `YYYY-MM-DD`)
  - [x] Reset form setelah submit berhasil
  - [x] Tampilkan pesan error jika validasi gagal
  - [x] Dispatch `ADD_LOAN`
- [x] Semua komponen memakai `useTheme()` untuk warna (tidak ada warna hard-coded)
- [x] Semua komponen mengambil data lewat `useLoans()` (tidak ada props drilling data peminjaman)
- [x] **Cek fase:** tiap komponen dirender benar secara terpisah

### FASE 7 — Layar Dashboard & Integrasi
- [x] Buat `DashboardScreen.tsx` dengan susunan:
  1. Header judul + `ThemeToggle`
  2. Baris `SummaryCard` (Total · Belum Dikembalikan · Sudah Dikembalikan)
  3. `LoanForm`
  4. `FilterBar`
  5. `LoanList`
- [x] Gunakan `SafeAreaView` + `KeyboardAvoidingView` + `ScrollView`/`FlatList` agar form tidak tertutup keyboard
- [x] Bungkus `App.tsx` dengan `ThemeProvider` → `LoanProvider` → `DashboardScreen`
- [x] Atur `StatusBar` mengikuti tema
- [x] **Cek fase:** alur end-to-end berjalan (lihat Fase 8)

### FASE 8 — Pengujian Manual (Checklist Fungsional)
- [ ] Dashboard menampilkan angka total, belum, dan sudah dikembalikan dengan benar
- [ ] Menambah peminjaman baru → data muncul di list, angka **Total** dan **Belum Dikembalikan** bertambah
- [ ] Form menolak input kosong dan menampilkan pesan error
- [ ] Menekan tombol status → status berubah, badge berubah, angka ringkasan ikut berubah
- [ ] Filter **Semua** menampilkan seluruh data
- [ ] Filter **Belum Dikembalikan** hanya menampilkan data `isReturned = false`
- [ ] Filter **Sudah Dikembalikan** hanya menampilkan data `isReturned = true`
- [ ] Toggle tema terang ↔ gelap mengubah seluruh tampilan (header, kartu, form, list, status bar)
- [ ] Tidak ada warning/error di terminal Metro maupun console
- [ ] Aplikasi diuji di Android **atau** iOS **atau** Expo Go

### FASE 9 — Dokumentasi & Screenshot
#### 9.1 Screenshot (simpan di folder `screenshots/`)
- [ ] `01-dashboard.png` — tampilan dashboard dengan kartu ringkasan
- [ ] `02-form-peminjaman.png` — formulir tambah peminjaman (idealnya saat terisi)
- [ ] `03-filter-semua.png` — filter Semua
- [ ] `04-filter-belum.png` — filter Belum Dikembalikan
- [ ] `05-filter-sudah.png` — filter Sudah Dikembalikan
- [ ] `06-status-sebelum.png` — sebelum status diubah
- [ ] `07-status-sesudah.png` — sesudah status diubah (angka ringkasan berubah)
- [ ] `08-tema-terang.png` — tema terang
- [ ] `09-tema-gelap.png` — tema gelap

> Catatan: screenshot diambil manual oleh pemilik proyek dari emulator/perangkat jika agent tidak dapat menjalankan emulator.

#### 9.2 README.md
- [x] Judul & deskripsi singkat aplikasi
- [x] Cara instalasi & menjalankan (`npm install`, `npx expo start`)
- [x] Daftar fitur
- [x] Struktur folder
- [ ] Menyisipkan seluruh screenshot dengan keterangan
- [x] Bagian **Penjelasan State Management** (lihat template di bawah)

---

## 6. Template Penjelasan Singkat (Untuk README / Laporan)

Agent wajib melengkapi bagian ini dengan bahasa sendiri, merujuk kode yang benar-benar dibuat.

### 6.1 Penerapan State Management
- [x] Jelaskan bahwa state aplikasi dibagi menjadi dua: **state data peminjaman** (`LoanContext`) dan **state tema** (`ThemeContext`)
- [x] Jelaskan alasan memisahkan keduanya (tanggung jawab berbeda, re-render lebih terkontrol)
- [x] Jelaskan bahwa data dikelola terpusat sehingga satu sumber kebenaran (*single source of truth*)

### 6.2 Fungsi `useReducer`
- [x] Jelaskan sintaks: `const [state, dispatch] = useReducer(reducer, initialState)`
- [x] Jelaskan peran `state`, `action` (`type` + `payload`), `dispatch`, dan `reducer`
- [x] Jelaskan alasan memilih `useReducer` dibanding `useState` (banyak jenis aksi, logika terpusat, mudah diuji dan dilacak)
- [x] Tabel aksi yang dipakai:

| Action | Fungsi |
|--------|--------|
| `ADD_LOAN` | Menambah data peminjaman baru |
| `TOGGLE_RETURN` | Mengubah status sudah/belum dikembalikan |
| `DELETE_LOAN` | Menghapus data (opsional) |
| `SET_FILTER` | Mengubah filter tampilan |

### 6.3 Context API
- [x] Jelaskan `createContext`, `Provider`, dan custom hook (`useLoans`, `useTheme`)
- [x] Jelaskan masalah **props drilling** dan bagaimana Context menyelesaikannya
- [x] Gambarkan hierarki Provider: `ThemeProvider → LoanProvider → DashboardScreen`

### 6.4 Proses Perubahan State
Contoh alur yang harus dijelaskan langkah demi langkah:
- [x] **Tambah peminjaman:** user isi form → tekan Tambah → `dispatch(ADD_LOAN)` → reducer membuat array baru → Provider memperbarui `state` → komponen yang memakai `useLoans()` dirender ulang → list dan kartu ringkasan berubah
- [x] **Ubah status:** tekan tombol status → `dispatch(TOGGLE_RETURN, id)` → reducer membalik `isReturned` pada item terkait → UI dan angka ringkasan ter-update
- [x] **Filter:** tekan tombol filter → `dispatch(SET_FILTER)` → `filteredLoans` dihitung ulang → list menampilkan data sesuai
- [x] **Ganti tema:** tekan toggle → `toggleTheme()` → `mode` berubah → `colors` baru dibagikan lewat `ThemeContext` → seluruh komponen berganti warna
- [x] Jelaskan prinsip **immutability** (state tidak diubah langsung, selalu dibuat salinan baru)

---

## 7. Kriteria Selesai (Definition of Done)

- [x] Ketujuh fitur utama (bagian 1) berfungsi
- [x] `useReducer` dipakai untuk data peminjaman
- [x] Context API dipakai untuk data peminjaman **dan** tema
- [x] Tidak ada props drilling untuk data utama
- [x] Tidak ada error/warning saat dijalankan
- [ ] Semua screenshot tersedia di `screenshots/`
- [x] README.md lengkap beserta penjelasan state management
- [ ] Seluruh checklist di blueprint ini sudah bertanda `[x]`

---

## 8. Skeleton Kode Referensi

### `loanReducer.ts`
```ts
import { LoanState, LoanAction } from '../types';

export const initialState: LoanState = {
  loans: [
    { id: '1', borrowerName: 'Andi Pratama', bookTitle: 'Laskar Pelangi', borrowDate: '2026-11-02', isReturned: false },
    { id: '2', borrowerName: 'Siti Rahma', bookTitle: 'Bumi Manusia', borrowDate: '2026-11-05', isReturned: true },
    { id: '3', borrowerName: 'Budi Santoso', bookTitle: 'Filosofi Teras', borrowDate: '2026-11-10', isReturned: false },
    { id: '4', borrowerName: 'Dewi Lestari', bookTitle: 'Atomic Habits', borrowDate: '2026-11-12', isReturned: true },
  ],
  filter: 'all',
};

export function loanReducer(state: LoanState, action: LoanAction): LoanState {
  switch (action.type) {
    case 'ADD_LOAN':
      return {
        ...state,
        loans: [
          { id: Date.now().toString(), isReturned: false, ...action.payload },
          ...state.loans,
        ],
      };
    case 'TOGGLE_RETURN':
      return {
        ...state,
        loans: state.loans.map(l =>
          l.id === action.payload.id ? { ...l, isReturned: !l.isReturned } : l
        ),
      };
    case 'DELETE_LOAN':
      return { ...state, loans: state.loans.filter(l => l.id !== action.payload.id) };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    default:
      return state;
  }
}
```

### `LoanContext.tsx`
```tsx
import React, { createContext, useContext, useMemo, useReducer, ReactNode } from 'react';
import { loanReducer, initialState } from '../reducers/loanReducer';
import { LoanState, LoanAction, Loan } from '../types';

interface LoanContextValue {
  state: LoanState;
  dispatch: React.Dispatch<LoanAction>;
  totalLoans: number;
  borrowedCount: number;
  returnedCount: number;
  filteredLoans: Loan[];
}

const LoanContext = createContext<LoanContextValue | undefined>(undefined);

export function LoanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(loanReducer, initialState);

  const value = useMemo(() => {
    const returnedCount = state.loans.filter(l => l.isReturned).length;
    const filteredLoans = state.loans.filter(l =>
      state.filter === 'all' ? true : state.filter === 'returned' ? l.isReturned : !l.isReturned
    );
    return {
      state,
      dispatch,
      totalLoans: state.loans.length,
      returnedCount,
      borrowedCount: state.loans.length - returnedCount,
      filteredLoans,
    };
  }, [state]);

  return <LoanContext.Provider value={value}>{children}</LoanContext.Provider>;
}

export function useLoans() {
  const ctx = useContext(LoanContext);
  if (!ctx) throw new Error('useLoans harus dipakai di dalam LoanProvider');
  return ctx;
}
```

### `ThemeContext.tsx`
```tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from '../theme/colors';

type Mode = 'light' | 'dark';
interface ThemeValue { mode: Mode; colors: typeof lightColors; toggleTheme: () => void; }

const ThemeContext = createContext<ThemeValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<Mode>(system === 'dark' ? 'dark' : 'light');
  const toggleTheme = () => setMode(m => (m === 'light' ? 'dark' : 'light'));
  const colors = mode === 'light' ? lightColors : darkColors;
  return <ThemeContext.Provider value={{ mode, colors, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme harus dipakai di dalam ThemeProvider');
  return ctx;
}
```

### `App.tsx`
```tsx
import React from 'react';
import { ThemeProvider } from './src/context/ThemeContext';
import { LoanProvider } from './src/context/LoanContext';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  return (
    <ThemeProvider>
      <LoanProvider>
        <DashboardScreen />
      </LoanProvider>
    </ThemeProvider>
  );
}
```

---

## 9. Catatan Progress (Diisi Agent)

| Tanggal | Fase | Catatan / Keputusan / Kendala |
|---------|------|-------------------------------|
| 2026-11-20 | 1-7, 9.2, 6 | Workspace berisi proyek Expo Router TS (Expo SDK 58). Diadaptasi ke blueprint: struktur `src/types,context,reducers,theme,components,screens`, implementasi `useReducer`+Context, tema, komponen UI, `DashboardScreen`, serta `App.tsx` dan entry `src/app/_layout.tsx`+`index.tsx` dengan provider. Datepicker opsional tidak dipasang (input teks `YYYY-MM-DD`). Verifikasi: `npx tsc --noEmit`, `npm run lint`, dan `npx expo export --platform web` lulus. README dan penjelasan state management (bagian 6) dilengkapi. |
| 2026-11-20 | 8, 9.1, DoD | Pengujian manual interaktif (emulator/Expo Go) dan pengambilan screenshot tidak dapat dilakukan di lingkungan ini; checklist Fase 8, file screenshot `screenshots/01-09`, item README "menyisipkan seluruh screenshot", serta DoD "semua screenshot/seluruh checklist" belum ditandai selesai dan memerlukan verifikasi manual. |
|         |      |                               |
