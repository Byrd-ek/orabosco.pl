const _GLOBAL_CLOUD_API = "https://jsonblob.com/api/jsonBlob/1335010041282093056";

const DOMYSLNE_KAFELKI = [
    {
        nazwa: "TEST",
        kiedy: "TEST",
        gdzie: "TEST",
        godzina: "TEST",
        status: "TEST",
        waznosc: "TEST",
        dodatkoweInfo: "Test test test test test test test.",
        kolorTla: "#ffffff",
        kolorPaska: "#111111",
        kolorTekstu: "#111111",
        kolorTytulu: "#111111",
        kolorBadge: "#d50000",
        kolorBadgeTekst: "#ffffff",
        kolorRogu: "#d50000"
    },
    {
        nazwa: "TEST",
        kiedy: "TEST",
        gdzie: "TEST",
        godzina: "TEST",
        status: "TEST",
        waznosc: "TEST",
        dodatkoweInfo: "Test test test test test test test.",
        kolorTla: "#111111",
        kolorPaska: "#d50000",
        kolorTekstu: "#ffffff",
        kolorTytulu: "#d50000",
        kolorBadge: "#111111",
        kolorBadgeTekst: "#ffffff",
        kolorRogu: "#ffffff"
    },
    {
        nazwa: "TEST",
        kiedy: "TEST",
        gdzie: "TEST",
        godzina: "TEST",
        status: "TEST",
        waznosc: "TEST",
        dodatkoweInfo: "Test test test test test test test.",
        kolorTla: "#ffffff",
        kolorPaska: "#111111",
        kolorTekstu: "#111111",
        kolorTytulu: "#111111",
        kolorBadge: "#111111",
        kolorBadgeTekst: "#ffffff",
        kolorRogu: "#d50000"
    }
];

let aktualneKafelki = JSON.parse(localStorage.getItem('oratorium_teraz_data')) || DOMYSLNE_KAFELKI;

function rejestrujWizyte() {
    const dzis = new Date();
    const rokMiesiac = dzis.getFullYear() + '-' + (dzis.getMonth() + 1);
    const dzien = dzis.getDate();

    let statystyki = JSON.parse(localStorage.getItem('oratorium_stats')) || {
        total: 312,
        ostatniDzien: dzien,
        miesiac: rokMiesiac,
        dni: {}
    };

    statystyki.total = (statystyki.total || 0) + 1;
    if (statystyki.miesiac !== rokMiesiac) {
        statystyki.miesiac = rokMiesiac;
        statystyki.dni = {};
    }
    statystyki.dni[dzien] = (statystyki.dni[dzien] || 0) + 1;
    statystyki.ostatniDzien = dzien;

    localStorage.setItem('oratorium_stats', JSON.stringify(statystyki));
}

function pobierzStatystyki() {
    const dzis = new Date();
    const dzien = dzis.getDate();
    const stat = JSON.parse(localStorage.getItem('oratorium_stats')) || { total: 0, dni: {} };
    
    const total = stat.total || 0;
    const today = (stat.dni && stat.dni[dzien]) ? stat.dni[dzien] : 0;
    let sumaMiesiac = 0;
    if (stat.dni) {
        for (let d in stat.dni) sumaMiesiac += stat.dni[d];
    }
    return { total: total, today: today, month: sumaMiesiac, dni: stat.dni || {} };
}

function generujWykres(dniData) {
    const kontener = document.getElementById('chart-bars-container');
    if (!kontener) return;
    kontener.innerHTML = '';

    let maxWartosc = 1;
    for (let i = 1; i <= 31; i++) {
        if (dniData[i] && dniData[i] > maxWartosc) maxWartosc = dniData[i];
    }

    for (let i = 1; i <= 31; i++) {
        const ilosc = dniData[i] || 0;
        const procent = Math.max(6, (ilosc / maxWartosc) * 100);

        const col = document.createElement('div');
        col.className = 'chart-bar-col';
        col.title = `Dzień ${i}: ${ilosc} odwiedzin`;

        const fill = document.createElement('div');
        fill.className = 'chart-bar-fill';
        fill.style.height = procent + '%';

        const label = document.createElement('div');
        label.className = 'chart-bar-day';
        label.innerText = i;

        col.appendChild(fill);
        col.appendChild(label);
        kontener.appendChild(col);
    }
}

function renderujKafelkiTeraz() {
    const kontener = document.getElementById('oratorium-teraz-container');
    if (!kontener) return;
    kontener.innerHTML = '';

    aktualneKafelki.forEach((k, idx) => {
        const html = `
            <div class="box" id="kafelek-teraz-${idx}">
                <div class="box-border">
                    <div class="box-bg" style="background-color: ${k.kolorTla}; color: ${k.kolorTekstu};">
                        <div class="box-header-strip" style="background-color: ${k.kolorPaska};">
                            <h3 style="color: #fff;">ORATORIUM TERAZ</h3>
                            <div class="badge" style="margin-bottom:0; padding:2px 8px; font-size:0.75rem; background-color: ${k.kolorBadge}; color: ${k.kolorBadgeTekst}; border-color: ${k.kolorPaska};">${k.waznosc || 'TEST'}</div>
                        </div>
                        <div class="box-content">
                            <h3 style="color: ${k.kolorTytulu};">${k.nazwa || 'TEST'}</h3>
                            <div class="badge" style="background-color: ${k.kolorBadge}; color: ${k.kolorBadgeTekst};">${k.status || 'TEST'}</div>
                            <p><strong>KIEDY:</strong> ${k.kiedy || 'TEST'}</p>
                            <p><strong>GDZIE:</strong> ${k.gdzie || 'TEST'}</p>
                            <p><strong>GODZINA:</strong> ${k.godzina || 'TEST'}</p>
                            <p style="margin-top: 6px; font-size:0.95rem; opacity: 0.95;">${k.dodatkoweInfo || 'Test test test'}</p>
                        </div>
                    </div>
                </div>
                <div class="broken-piece">
                    <div class="broken-piece-inner" style="background-color: ${k.kolorRogu};"></div>
                </div>
            </div>
        `;
        kontener.insertAdjacentHTML('beforeend', html);
    });
}

function synchronizujKolor(textInputId, pickerInputId, zPickerDoTekstu) {
    const txt = document.getElementById(textInputId);
    const pck = document.getElementById(pickerInputId);
    if (!txt || !pck) return;
    if (zPickerDoTekstu) {
        txt.value = pck.value;
    } else {
        if (/^#[0-9A-Fa-f]{6}$/.test(txt.value)) {
            pck.value = txt.value;
        }
    }
}

function budujFormularzAdmina() {
    const kontener = document.getElementById('admin-cards-form-container');
    if (!kontener) return;
    kontener.innerHTML = '';

    aktualneKafelki.forEach((k, idx) => {
        const col = document.createElement('div');
        col.className = 'admin-card-column';
        col.innerHTML = `
            <h4>KAFELEK #${idx + 1}</h4>
            <div class="form-group">
                <label>Nazwa (Tytuł):</label>
                <input type="text" id="inp-nazwa-${idx}" value="${k.nazwa || ''}">
            </div>
            <div class="form-group">
                <label>Kiedy:</label>
                <input type="text" id="inp-kiedy-${idx}" value="${k.kiedy || ''}">
            </div>
            <div class="form-group">
                <label>Gdzie:</label>
                <input type="text" id="inp-gdzie-${idx}" value="${k.gdzie || ''}">
            </div>
            <div class="form-group">
                <label>Godzina:</label>
                <input type="text" id="inp-godzina-${idx}" value="${k.godzina || ''}">
            </div>
            <div class="form-group">
                <label>Status (np. TEST, OTWARTE):</label>
                <input type="text" id="inp-status-${idx}" value="${k.status || ''}">
            </div>
            <div class="form-group">
                <label>Ważność / Kategoria (np. TEST, SPORT):</label>
                <input type="text" id="inp-waznosc-${idx}" value="${k.waznosc || ''}">
            </div>
            <div class="form-group">
                <label>Dodatkowe Info:</label>
                <textarea id="inp-info-${idx}">${k.dodatkoweInfo || ''}</textarea>
            </div>

            <div class="color-direct-list">
                <div class="form-group">
                    <label>Wpisz kolor tła (HEX):</label>
                    <div class="custom-color-field">
                        <input type="text" id="inp-col-tlo-${idx}" value="${k.kolorTla || '#ffffff'}" oninput="synchronizujKolor('inp-col-tlo-${idx}', 'col-tlo-${idx}', false)">
                        <input type="color" id="col-tlo-${idx}" value="${k.kolorTla || '#ffffff'}" oninput="synchronizujKolor('inp-col-tlo-${idx}', 'col-tlo-${idx}', true)">
                    </div>
                </div>

                <div class="form-group">
                    <label>Wpisz kolor górnego paska (HEX):</label>
                    <div class="custom-color-field">
                        <input type="text" id="inp-col-pasek-${idx}" value="${k.kolorPaska || '#111111'}" oninput="synchronizujKolor('inp-col-pasek-${idx}', 'col-pasek-${idx}', false)">
                        <input type="color" id="col-pasek-${idx}" value="${k.kolorPaska || '#111111'}" oninput="synchronizujKolor('inp-col-pasek-${idx}', 'col-pasek-${idx}', true)">
                    </div>
                </div>

                <div class="form-group">
                    <label>Wpisz kolor tekstu / opisu (HEX):</label>
                    <div class="custom-color-field">
                        <input type="text" id="inp-col-tekst-${idx}" value="${k.kolorTekstu || '#111111'}" oninput="synchronizujKolor('inp-col-tekst-${idx}', 'col-tekst-${idx}', false)">
                        <input type="color" id="col-tekst-${idx}" value="${k.kolorTekstu || '#111111'}" oninput="synchronizujKolor('inp-col-tekst-${idx}', 'col-tekst-${idx}', true)">
                    </div>
                </div>

                <div class="form-group">
                    <label>Wpisz kolor tytułu (HEX):</label>
                    <div class="custom-color-field">
                        <input type="text" id="inp-col-tytul-${idx}" value="${k.kolorTytulu || '#111111'}" oninput="synchronizujKolor('inp-col-tytul-${idx}', 'col-tytul-${idx}', false)">
                        <input type="color" id="col-tytul-${idx}" value="${k.kolorTytulu || '#111111'}" oninput="synchronizujKolor('inp-col-tytul-${idx}', 'col-tytul-${idx}', true)">
                    </div>
                </div>

                <div class="form-group">
                    <label>Wpisz kolor tła statusu / badge (HEX):</label>
                    <div class="custom-color-field">
                        <input type="text" id="inp-col-badge-${idx}" value="${k.kolorBadge || '#d50000'}" oninput="synchronizujKolor('inp-col-badge-${idx}', 'col-badge-${idx}', false)">
                        <input type="color" id="col-badge-${idx}" value="${k.kolorBadge || '#d50000'}" oninput="synchronizujKolor('inp-col-badge-${idx}', 'col-badge-${idx}', true)">
                    </div>
                </div>

                <div class="form-group">
                    <label>Wpisz kolor uciętego rogu (HEX):</label>
                    <div class="custom-color-field">
                        <input type="text" id="inp-col-rog-${idx}" value="${k.kolorRogu || '#d50000'}" oninput="synchronizujKolor('inp-col-rog-${idx}', 'col-rog-${idx}', false)">
                        <input type="color" id="col-rog-${idx}" value="${k.kolorRogu || '#d50000'}" oninput="synchronizujKolor('inp-col-rog-${idx}', 'col-rog-${idx}', true)">
                    </div>
                </div>
            </div>
        `;
        kontener.appendChild(col);
    });
}

async function zapiszIZastosujGlobalnie() {
    const btnSave = document.getElementById('btn-save-main');
    if (btnSave) {
        btnSave.innerText = "PUBLIKOWANIE W SIECI...";
        btnSave.style.opacity = "0.7";
    }

    const noweDane = [];
    for (let i = 0; i < 3; i++) {
        const tlo = document.getElementById(`inp-col-tlo-${i}`).value.trim() || '#ffffff';
        const pasek = document.getElementById(`inp-col-pasek-${i}`).value.trim() || '#111111';
        const tekst = document.getElementById(`inp-col-tekst-${i}`).value.trim() || '#111111';
        const tytul = document.getElementById(`inp-col-tytul-${i}`).value.trim() || '#111111';
        const badge = document.getElementById(`inp-col-badge-${i}`).value.trim() || '#d50000';
        const rog = document.getElementById(`inp-col-rog-${i}`).value.trim() || '#d50000';

        noweDane.push({
            nazwa: document.getElementById(`inp-nazwa-${i}`).value,
            kiedy: document.getElementById(`inp-kiedy-${i}`).value,
            gdzie: document.getElementById(`inp-gdzie-${i}`).value,
            godzina: document.getElementById(`inp-godzina-${i}`).value,
            status: document.getElementById(`inp-status-${i}`).value,
            waznosc: document.getElementById(`inp-waznosc-${i}`).value,
            dodatkoweInfo: document.getElementById(`inp-info-${i}`).value,
            kolorTla: tlo,
            kolorPaska: pasek,
            kolorTekstu: tekst,
            kolorTytulu: tytul,
            kolorBadge: badge,
            kolorBadgeTekst: (badge.toLowerCase() === '#ffffff' || badge.toLowerCase() === '#ffeb3b') ? '#111111' : '#ffffff',
            kolorRogu: rog
        });
    }

    aktualneKafelki = noweDane;
    localStorage.setItem('oratorium_teraz_data', JSON.stringify(aktualneKafelki));
    renderujKafelkiTeraz();

    try {
        const response = await fetch(_GLOBAL_CLOUD_API, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ kafelki: aktualneKafelki })
        });

        if (!response.ok) throw new Error("Błąd chmury");
        alert("SUKCES! Zmiany zostały opublikowane i zaktualizują się u wszystkich odwiedzających!");
    } catch (err) {
        alert("Zapisano lokalnie. (Synchronizacja globalna ponowi próbę przy połączeniu).");
    } finally {
        if (btnSave) {
            btnSave.innerText = "ZAPISZ I OPUBLIKUJ DLA WSZYSTKICH";
            btnSave.style.opacity = "1";
        }
        zamknijAdminPanel();
    }
}

async function synchronizujZChmury() {
    try {
        const res = await fetch(_GLOBAL_CLOUD_API, {
            headers: { 'Accept': 'application/json' },
            cache: 'no-cache'
        });
        if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.kafelki)) {
                aktualneKafelki = data.kafelki;
                localStorage.setItem('oratorium_teraz_data', JSON.stringify(aktualneKafelki));
                renderujKafelkiTeraz();
            }
        }
    } catch (e) {
        console.log("Pobieranie z pamięci lokalnej");
    }
}

function resetujDoDomyslnych() {
    if (confirm("Czy na pewno chcesz przywrócić domyślne 3 kafelki?")) {
        aktualneKafelki = JSON.parse(JSON.stringify(DOMYSLNE_KAFELKI));
        localStorage.setItem('oratorium_teraz_data', JSON.stringify(aktualneKafelki));
        renderujKafelkiTeraz();
        budujFormularzAdmina();
    }
}

function _0x8f1b(s) {
    if (!s || s.length !== 18) return false;
    const _vec = [44, 62, 10, 29, 239, 225, 233, 201, 215, 173, 188, 191, 134, 197, 48, 33, 40, 24];
    for (let i = 0; i < 18; i++) {
        if ((s.charCodeAt(i) ^ ((i * 13 + 77) % 256)) !== _vec[i]) {
            return false;
        }
    }
    return true;
}

let _cornerClicks = 0;
let _firstCornerClick = 0;

function attachSecretCornerListeners() {
    const corners = document.querySelectorAll('.secret-target-corner');
    corners.forEach(corner => {
        corner.addEventListener('click', function(e) {
            e.stopPropagation();
            const now = Date.now();

            if (_cornerClicks === 0 || (now - _firstCornerClick > 20000)) {
                _cornerClicks = 1;
                _firstCornerClick = now;
                return;
            }

            _cornerClicks++;

            if (_cornerClicks >= 10 && (now - _firstCornerClick <= 20000)) {
                _cornerClicks = 0;
                _firstCornerClick = 0;
                
                const pass = prompt("PODAJ KLUCZ DOSTĘPU:");
                if (_0x8f1b(pass)) {
                    otworzAdminPanel();
                } else if (pass !== null) {
                    alert("ODMOWA DOSTĘPU.");
                }
            }
        });
    });
}

function otworzAdminPanel() {
    const stat = pobierzStatystyki();
    document.getElementById('adm-stat-total').innerText = stat.total;
    document.getElementById('adm-stat-today').innerText = stat.today;
    document.getElementById('adm-stat-month').innerText = stat.month;

    generujWykres(stat.dni);
    budujFormularzAdmina();

    document.getElementById('admin-panel-modal').style.display = 'block';
    document.body.classList.add('modal-open');
}

function zamknijAdminPanel() {
    document.getElementById('admin-panel-modal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function toggleDropdown(button) {
    const menu = button.nextElementSibling;
    const isOpen = menu.classList.contains('show');
    zamknijWszystkieDropdowny();
    if (!isOpen) {
        menu.classList.add('show');
        button.classList.add('active');
    }
}

function zamknijWszystkieDropdowny() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.remove('show'));
    document.querySelectorAll('.nav-category-btn').forEach(btn => btn.classList.remove('active'));
}

document.addEventListener('click', function(event) {
    if (!event.target.closest('.nav-category')) zamknijWszystkieDropdowny();
});

const maxZdjec = 10;
let aktualnyIndeks = 1;

function losujZdjecia() {
    let id1 = Math.floor(Math.random() * maxZdjec) + 1;
    let id2;
    do {
        id2 = Math.floor(Math.random() * maxZdjec) + 1;
    } while (id1 === id2);
    
    const zdj1 = document.getElementById('losowe-zdj-1');
    const zdj2 = document.getElementById('losowe-zdj-2');
    if (zdj1) zdj1.src = 'zdj' + id1 + '.png';
    if (zdj2) zdj2.src = 'zdj' + id2 + '.png';
    
    const licznik = document.getElementById('licznik-zdjec');
    if (licznik) licznik.innerText = '+' + (maxZdjec - 2);
    budujSiatkeAlbumu();
}

function budujSiatkeAlbumu() {
    const grid = document.getElementById('album-grid');
    if (!grid) return;
    grid.innerHTML = ''; 
    for(let i = 1; i <= maxZdjec; i++) {
        let img = document.createElement('img');
        img.src = 'zdj' + i + '.png';
        img.onclick = function() { otworzGalerie(i); };
        grid.appendChild(img);
    }
}

function otworzAlbum() {
    document.getElementById('album-modal').style.display = 'block';
    document.body.classList.add('modal-open');
}

function zamknijAlbum() {
    document.getElementById('album-modal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function otworzGalerie(index) {
    aktualnyIndeks = index;
    document.getElementById('lightbox').style.display = 'flex';
    aktualizujGalerie();
}

function zamknijGalerie() {
    document.getElementById('lightbox').style.display = 'none';
}

function zmienZdjecie(kierunek) {
    aktualnyIndeks += kierunek;
    if (aktualnyIndeks > maxZdjec) aktualnyIndeks = 1;
    if (aktualnyIndeks < 1) aktualnyIndeks = maxZdjec;
    aktualizujGalerie();
}

function aktualizujGalerie() {
    document.getElementById('lightbox-img').src = 'zdj' + aktualnyIndeks + '.png';
    document.getElementById('lightbox-counter').innerText = aktualnyIndeks + ' / ' + maxZdjec;
}

document.addEventListener('keydown', function(event) {
    if (document.getElementById('lightbox').style.display === 'flex') {
        if (event.key === 'Escape') zamknijGalerie();
        if (event.key === 'ArrowLeft') zmienZdjecie(-1);
        if (event.key === 'ArrowRight') zmienZdjecie(1);
    }
    if (document.getElementById('admin-panel-modal').style.display === 'block') {
        if (event.key === 'Escape') zamknijAdminPanel();
    }
});

let touchstartX = 0;
let touchendX = 0;
const poleDotykowe = document.getElementById('lightbox-touch-area');
if (poleDotykowe) {
    poleDotykowe.addEventListener('touchstart', function(e) { touchstartX = e.changedTouches[0].screenX; });
    poleDotykowe.addEventListener('touchend', function(e) {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX - 40) zmienZdjecie(1);
        if (touchendX > touchstartX + 40) zmienZdjecie(-1);
    });
}

function zmienZakladke(zakladka) {
    const widokGlowny = document.getElementById('zakladka-glowna');
    const widokPlany = document.getElementById('zakladka-plany');
    const widokMedia = document.getElementById('zakladka-media');

    widokGlowny.style.display = 'none';
    widokPlany.style.display = 'none';
    widokMedia.style.display = 'none';

    if (zakladka === 'plany') {
        widokPlany.style.display = 'block';
        window.scrollTo(0, 0); 
    } else if (zakladka === 'media') {
        widokMedia.style.display = 'block';
        window.scrollTo(0, 0); 
    } else {
        widokGlowny.style.display = 'block';
    }
}

window.addEventListener('load', function() {
    rejestrujWizyte();
    renderujKafelkiTeraz();
    synchronizujZChmury();
    losujZdjecia();
    attachSecretCornerListeners();

    setTimeout(function() {
        const loader = document.getElementById('loader-wrapper');
        if (loader) loader.classList.add('fade-out');
        document.body.classList.remove('loading');
    }, 600);
});