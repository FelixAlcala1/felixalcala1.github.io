/* =============================================
   FLIX SOLUTIONS — main.js
   Funciones: animaciones + modales de demo
============================================= */

/* ============================================
   1. TYPEWRITER — rota entre frases en el hero
============================================= */
const PHRASES = [
  "realmente funcionan.",
  "entregan rápido.",
  "usan código limpio.",
  "escalan sin problemas.",
  "marcan la diferencia.",
];

function runTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;

  let phraseIndex = 0;
  let charIndex   = 0;
  let deleting    = false;
  const SPEED_TYPE   = 55;
  const SPEED_DELETE = 28;
  const PAUSE_END    = 1800;
  const PAUSE_START  = 300;

  function tick() {
    const phrase = PHRASES[phraseIndex];

    if (!deleting) {
      el.textContent = phrase.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === phrase.length) {
        el.classList.add("done");
        setTimeout(() => {
          el.classList.remove("done");
          deleting = true;
          tick();
        }, PAUSE_END);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % PHRASES.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
    }

    setTimeout(tick, deleting ? SPEED_DELETE : SPEED_TYPE);
  }

  // Arrancar con un pequeño delay para que el fade-up del hero termine primero
  setTimeout(tick, 700);
}

/* ============================================
   2. COUNTER — números que cuentan desde 0
============================================= */
function animateCounter(el) {
  const target  = parseInt(el.dataset.target, 10);
  const suffix  = el.dataset.suffix || "";
  const duration = 1400; // ms
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const value  = Math.round(eased * target);
    el.textContent = value + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target + suffix;
      el.classList.add("done");
    }
  }

  requestAnimationFrame(step);
}

/* ============================================
   3. INTERSECTION OBSERVER — scroll reveal
============================================= */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  // Service cards con delay escalonado
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${i * 60}ms`;
    observer.observe(el);
  });

  // Contact features con delay escalonado
  document.querySelectorAll(".contact-feature").forEach((el, i) => {
    el.style.transitionDelay = `${i * 100}ms`;
    observer.observe(el);
  });

  // Counters: están en el hero, siempre visibles al cargar.
  // Se arrancan con delay para que la animación fade-up del hero termine primero.
  document.querySelectorAll(".counter").forEach((el) => {
    setTimeout(() => animateCounter(el), 600);
  });
}

/* ============================================
   4. INIT al cargar la página
============================================= */
document.addEventListener("DOMContentLoaded", () => {
  runTypewriter();
  initScrollReveal();
});



/* ---- Datos de demos por servicio ---- */
const demos = {
  iptv: {
    label: "Demo · Servidores IPTV",
    title: "Servidor IPTV en producción",
    body: `Tu servidor correría en un VPS con panel Xtream Codes. El cliente accede con usuario y contraseña, elige canal o película y lo reproduce en segundos, sin buffering.

Esto es un ejemplo del endpoint de la API que generaría el servidor para autenticar un usuario:`,
    code: `GET http://tu-servidor.com/player_api.php
    ?username=cliente01
    &password=clave123
    &action=get_live_categories

→ 200 OK
{
  "user_info": { "status": "Active", "exp_date": "2025-12-31" },
  "categories": [
    { "category_id": "1", "category_name": "Deportes" },
    { "category_id": "2", "category_name": "Películas HD" }
  ]
}`,
    footer: "Soporte para Xtream Codes, Stalker Portal y lista M3U directa."
  },

  android: {
    label: "Demo · Apps Android",
    title: "App de catálogo con carrito",
    body: `Un ejemplo típico: una tienda o catálogo de productos en Android. El cliente navega, agrega al carrito y genera un pedido que llega por WhatsApp o correo automáticamente.

Fragmento de la función que envía el pedido al servidor:`,
    code: `fun enviarPedido(carrito: List<Producto>) {
    val json = JSONObject().apply {
        put("cliente", usuarioActual.nombre)
        put("items", JSONArray(carrito.map {
            JSONObject()
                .put("id", it.id)
                .put("nombre", it.nombre)
                .put("cantidad", it.cantidad)
        }))
        put("total", carrito.sumOf { it.precio * it.cantidad })
    }
    ApiClient.post("/pedidos", json) { respuesta ->
        mostrarConfirmacion(respuesta.getString("numero_pedido"))
    }
}`,
    footer: "Entrega como APK listo para instalar o publicado en Google Play."
  },

  codigo: {
    label: "Demo · Corrección de código",
    title: "Bug detectado y corregido",
    body: `Un cliente tenía una función Python que calculaba mal descuentos en su tienda. El problema estaba en el orden de operaciones. Esto es un caso real simplificado:`,
    code: `# ❌ ANTES — error: descuento aplicado al precio ya reducido
def calcular_total(precio, descuento, impuesto):
    precio_con_impuesto = precio * (1 + impuesto)
    total = precio_con_impuesto - descuento  # bug: resta fija, no %
    return total

calcular_total(100, 10, 0.21)  # → 101.0  ✗

# ✅ DESPUÉS — lógica corregida y clara
def calcular_total(precio: float, descuento_pct: float, impuesto_pct: float) -> float:
    precio_descontado = precio * (1 - descuento_pct / 100)
    total = precio_descontado * (1 + impuesto_pct / 100)
    return round(total, 2)

calcular_total(100, 10, 21)    # → 108.9  ✓`,
    footer: "Se incluye documentación del cambio y pruebas básicas con cada corrección."
  },

  bots: {
    label: "Demo · Bots de Telegram",
    title: "Bot de ventas con menú interactivo",
    body: `Un bot para vender servicios o productos directamente desde Telegram. El cliente escribe /start, elige un plan y recibe instrucciones de pago automáticamente.

Fragmento del handler principal del bot:`,
    code: `@bot.callback_query_handler(func=lambda c: c.data.startswith("plan_"))
def seleccionar_plan(call):
    plan_id = call.data.split("_")[1]
    plan = PLANES[plan_id]

    texto = (
        f"✅ *{plan['nombre']}* seleccionado\\n\\n"
        f"💰 Precio: ${plan['precio']}/mes\\n"
        f"📦 Incluye: {plan['descripcion']}\\n\\n"
        f"Enviá el pago a:\\n"
        f"📱 Binance UID: 123456789"
    )
    markup = InlineKeyboardMarkup()
    markup.add(InlineKeyboardButton(
        "✅ Ya pagué", callback_data=f"pagado_{plan_id}"
    ))
    bot.edit_message_text(texto, call.message.chat.id,
                          call.message.message_id, reply_markup=markup,
                          parse_mode="Markdown")`,
    footer: "Panel de administración incluido para gestionar clientes y pagos."
  },

  servidores: {
    label: "Demo · Optimización de servidores",
    title: "Script de hardening y monitoreo",
    body: `Al recibir un VPS nuevo, se aplica un checklist de seguridad y rendimiento. Esto es un fragmento del script de configuración inicial que se ejecuta en el servidor:`,
    code: `#!/bin/bash
# flix-hardening.sh — configuración inicial segura

echo "[1/5] Actualizando paquetes..."
apt update -q && apt upgrade -y -q

echo "[2/5] Configurando firewall UFW..."
ufw default deny incoming
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable

echo "[3/5] Instalando fail2ban..."
apt install fail2ban -y -q
systemctl enable fail2ban --now

echo "[4/5] Optimizando límites del sistema..."
echo "fs.file-max = 100000" >> /etc/sysctl.conf
echo "net.core.somaxconn = 65535" >> /etc/sysctl.conf
sysctl -p > /dev/null

echo "[5/5] Instalando monitoreo (htop + netdata)..."
apt install htop -y -q
curl -s https://my-netdata.io/kickstart.sh | bash -s -- --dont-wait

echo "✅ Servidor asegurado y optimizado."`,
    footer: "Se genera un reporte final con el estado del servidor tras la optimización."
  },

  landing: {
    label: "Demo · Landing Pages",
    title: "Estructura de una landing en 48 h",
    body: `Cada landing que entrego sigue una estructura probada para convertir visitas en contactos o ventas. El código es limpio, sin frameworks ni dependencias pesadas.

Ejemplo de la estructura HTML semántica de una sección hero:`,
    code: `<!-- Sección hero — entregada en HTML/CSS/JS puro -->
<section class="hero" id="inicio">
  <div class="hero__container">

    <span class="hero__eyebrow">Tu negocio online</span>

    <h1 class="hero__title">
      El título que <strong>convierte</strong><br>
      visitantes en clientes
    </h1>

    <p class="hero__sub">
      Descripción clara del servicio, orientada
      al beneficio del cliente. Sin palabras de relleno.
    </p>

    <div class="hero__actions">
      <a href="#contacto" class="btn-primary">Quiero empezar</a>
      <a href="#servicios" class="btn-ghost">Ver más</a>
    </div>

  </div>
</section>

<!-- Tiempo de entrega promedio: 24-48 h -->
<!-- Incluye: SEO básico, mobile-first, WhatsApp integrado -->`,
    footer: "Entregada como archivo listo para subir a cualquier hosting estático."
  },

  scripts: {
    label: "Demo · Venta de scripts",
    title: "Script de backup automático",
    body: `Un script listo para usar: hace backup de una base de datos MySQL, lo comprime, lo sube a un servidor remoto y notifica por Telegram si algo falla.

Fragmento del script de backup:`,
    code: `#!/bin/bash
# flix-backup.sh — backup diario con notificación

DB_NAME="mi_base"
DB_USER="root"
DB_PASS="secreto"
DESTINO="usuario@backup-server:/backups"
TG_TOKEN="123456:ABC-token"
TG_CHAT="987654321"
FECHA=$(date +%Y-%m-%d_%H-%M)
ARCHIVO="/tmp/backup_${DB_NAME}_${FECHA}.sql.gz"

notify() {
  curl -s -X POST "https://api.telegram.org/bot${TG_TOKEN}/sendMessage" \
    -d chat_id="${TG_CHAT}" -d text="$1" > /dev/null
}

mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$ARCHIVO"

if scp "$ARCHIVO" "$DESTINO"; then
  notify "✅ Backup exitoso: backup_${DB_NAME}_${FECHA}.sql.gz"
  rm "$ARCHIVO"
else
  notify "❌ ERROR en backup de ${DB_NAME} — revisar servidor"
  exit 1
fi`,
    footer: "Cada script incluye documentación de uso y variables de configuración."
  },

  python: {
    label: "Demo · Automatizaciones Python",
    title: "Reporte automático de ventas por email",
    body: `Un ejemplo real: un script que corre cada día a las 8 AM, lee las ventas del día anterior desde una base de datos o Google Sheets, genera un PDF y lo envía por correo automáticamente.`,
    code: `# reporte_ventas.py — ejecutado por cron cada mañana

import smtplib, csv
from datetime import date, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def obtener_ventas(fecha):
    # Aquí conecta a tu DB o Google Sheets
    return [
        {"producto": "Plan Básico",  "cantidad": 5, "total": 250},
        {"producto": "Plan Premium", "cantidad": 2, "total": 300},
    ]

def generar_html(ventas, fecha):
    filas = "".join(
        f"<tr><td>{v['producto']}</td><td>{v['cantidad']}</td>"
        f"<td>${v['total']}</td></tr>"
        for v in ventas
    )
    gran_total = sum(v["total"] for v in ventas)
    return f"""<h2>Ventas del {fecha}</h2>
<table border='1'><tr><th>Producto</th><th>Unidades</th><th>Total</th></tr>
{filas}
<tr><td colspan='2'><b>TOTAL</b></td><td><b>${gran_total}</b></td></tr>
</table>"""

ayer   = date.today() - timedelta(days=1)
ventas = obtener_ventas(ayer)
html   = generar_html(ventas, ayer)

# Enviar por email (configurar con tu SMTP)
print(f"✅ Reporte del {ayer} listo para enviar.")`,
    footer: "Puede integrarse con Gmail, Outlook, SendGrid o cualquier SMTP propio."
  }
};

/* ---- Modal: abrir ---- */
function abrirDemo(id) {
  const data = demos[id];
  if (!data) return;

  document.getElementById("modal-label").textContent  = data.label;
  document.getElementById("modal-title").textContent  = data.title;
  document.getElementById("modal-body").textContent   = data.body;
  document.getElementById("modal-code").textContent   = data.code;
  document.getElementById("modal-footer").textContent = data.footer;

  const overlay = document.getElementById("modal-overlay");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

/* ---- Modal: cerrar ---- */
function cerrarModal() {
  const overlay = document.getElementById("modal-overlay");
  overlay.classList.remove("active");
  document.body.style.overflow = "";
}

/* ---- Cerrar haciendo click fuera del modal ---- */
document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("modal-overlay");

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) cerrarModal();
  });

  /* Cerrar con tecla Escape */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") cerrarModal();
  });
});
