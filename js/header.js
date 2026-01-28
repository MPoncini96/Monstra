document.getElementById("siteHeader").innerHTML = `
  <header class="navbar bg-base-100 border-b">
    <div class="max-w-6xl mx-auto w-full px-4">
      <div class="flex-1">
        <a class="btn btn-ghost text-xl" href="/Monstra/v2/index.html">Monstra</a>
      </div>

      <div class="flex-none gap-2 items-center">
        <!-- Example "Monstra Bytes" pill -->
        <div class="badge badge-outline hidden sm:inline-flex">Bytes: <span class="ml-1 font-semibold" id="bytesCount">0</span></div>

        <a class="btn btn-ghost btn-sm" href="/Monstra/v2/pages/monsters.html">Monsters</a>
        <a class="btn btn-ghost btn-sm" href="/Monstra/v2/pages/bytes.html">Bytes</a>

        <!-- Preline dropdown (profile) -->
        <div class="hs-dropdown relative inline-flex">
          <button type="button" class="hs-dropdown-toggle btn btn-primary btn-sm">
            Account
            <svg class="size-4 ms-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <div class="hs-dropdown-menu hidden z-10 mt-2 w-56 rounded-lg border bg-base-100 p-2 shadow"
            role="menu" aria-orientation="vertical">
            <a class="block rounded-md px-3 py-2 hover:bg-base-200" href="/Monstra/v2/pages/register.html">Login / Register</a>
            <a class="block rounded-md px-3 py-2 hover:bg-base-200" href="/Monstra/v2/pages/profile.html">Profile</a>
          </div>
        </div>
      </div>
    </div>
  </header>
`;
