"use client"
import { useState } from "react";
export default function Home() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Fejléc */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="text-2xl font-bold text-blue-700">
            YourJob
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="/allasok" className="hover:text-blue-700">
              Állások
            </a>
            <a href="#" className="hover:text-blue-700">
              Munkáltatóknak
            </a>
            <button className="rounded-lg border px-4 py-2 hover:bg-slate-50">
              Bejelentkezés
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="mb-4 font-semibold text-blue-700">
              Találd meg a hozzád illő munkát
            </p>

            <h1 className="text-5xl font-bold tracking-tight text-slate-900">
              Kategória szerint, pontosabb szűréssel
              <br />
              Akár, ha diák vagy is egyszerűbben.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              A YourJob segít megtalálni azokat az állásokat,
              amelyek a tapasztalatodhoz, elvárásaidhoz és
              élethelyzetedhez is illenek.
            </p>
          </div>

          {/* Kereső */}
          <div className="mt-10 rounded-2xl border bg-slate-50 p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
             <input
  type="text"
  placeholder="Milyen munkát keresel?"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="rounded-xl border bg-white px-4 py-4 outline-none focus:border-blue-500"
/>
              <input
                type="text"
                placeholder="Hol szeretnél dolgozni?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-xl border bg-white px-4 py-4 outline-none focus:border-blue-500"
              />

              <a
  href={`/allasok?kereses=${encodeURIComponent(search)}`}
  className="rounded-xl bg-blue-700 px-8 py-4 font-semibold text-white hover:bg-blue-800"
>
  Állások keresése
</a>
            </div>
          </div>
        </div>
      </section>

      {/* Előnyök */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold text-slate-900">
          Több, mint egy álláskereső oldal
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6">
            <div className="text-3xl">🎯</div>
            <h3 className="mt-4 text-xl font-semibold">
              Számodra legmegfelelőbb állások kategória szerint
            </h3>
            <p className="mt-2 text-slate-600">
              Ne kelljen több száz irreleváns hirdetés között keresgélned.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <div className="text-3xl">💰</div>
            <h3 className="mt-4 text-xl font-semibold">
              Átláthatóbb fizetési összegzések
            </h3>
            <p className="mt-2 text-slate-600">
              A munkáltatók által felajánlott bérezési rendszerek összehasonlítása.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <div className="text-3xl">📍</div>
            <h3 className="mt-4 text-xl font-semibold">
              Ingázás figyelembevétele
            </h3>
            <p className="mt-2 text-slate-600">
              Menetidő szerinti különböző járművekkel megközelíthetőség.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center text-white">
          <h2 className="text-3xl font-bold">
            Itt könnyebb munkára találni.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Profil létrehozása után az megkönnyíted a számodra legrelevánsabb állásokat.
          </p>

          <button className="mt-8 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 hover:bg-slate-100">
            Profil létrehozása
          </button>
        </div>
      </section>
    </main>
  );
}