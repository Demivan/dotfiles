import Y from "gi://GLib?version=2.0";
import { Variable as Qt } from "resource:///com/github/Aylur/ags/variable.js";
import K from "gi://GLib";
import L from "gi://Gdk";
import Si from "gi://Gio";
import Z from "gi://Gtk?version=3.0";
Object.assign(globalThis, {
  OPTIONS: `${Y.get_user_cache_dir()}/ags/options.json`,
  TMP: `${Y.get_tmp_dir()}/asztal`,
  USER: Y.get_user_name()
});
Utils.ensureDirectory(TMP);
App.addIcons(`${App.configDir}/assets`);
class Ii extends Qt {
  static {
    Service.register(this);
  }
  constructor(t, { persistent: i = !1 } = {}) {
    super(t), this.initial = t, this.persistent = i;
  }
  initial;
  id = "";
  persistent;
  toString() {
    return `${this.value}`;
  }
  toJSON() {
    return `opt:${this.value}`;
  }
  getValue = () => super.getValue();
  init(t) {
    const i = JSON.parse(Utils.readFile(t) || "{}")[this.id];
    i !== void 0 && (this.value = i), this.connect("changed", () => {
      const n = JSON.parse(Utils.readFile(t) || "{}");
      n[this.id] = this.value, Utils.writeFileSync(JSON.stringify(n, null, 2), t);
    });
  }
  reset() {
    if (!this.persistent && JSON.stringify(this.value) !== JSON.stringify(this.initial))
      return this.value = this.initial, this.id;
  }
}
const a = (e, t) => new Ii(e, t);
function G(e, t = "") {
  return Object.keys(e).flatMap((i) => {
    const n = e[i], o = t ? `${t}.${i}` : i;
    return n instanceof Qt ? (n.id = o, n) : typeof n == "object" ? G(n, o) : [];
  });
}
function Ai(e, t) {
  for (const c of G(t))
    c.init(e);
  Utils.ensureDirectory(e.split("/").slice(0, -1).join("/"));
  const i = `${TMP}/config.json`, n = G(t).reduce((c, { id: u, value: g }) => ({ [u]: g, ...c }), {});
  Utils.writeFileSync(JSON.stringify(n, null, 2), i), Utils.monitorFile(i, () => {
    const c = JSON.parse(Utils.readFile(i) || "{}");
    for (const u of G(t))
      JSON.stringify(c[u.id]) !== JSON.stringify(u.value) && (u.value = c[u.id]);
  });
  function o(c = 0) {
    return new Promise((u) => setTimeout(u, c));
  }
  async function r([c, ...u] = G(t), g = c?.reset()) {
    return c ? g ? [g, ...await o(50).then(() => r(u))] : await o().then(() => r(u)) : o().then(() => []);
  }
  return Object.assign(t, {
    configFile: i,
    array: () => G(t),
    async reset() {
      return (await r()).join(`
`);
    },
    handler(c, u) {
      for (const g of G(t))
        c.some((x) => g.id.startsWith(x)) && g.connect("changed", u);
    }
  });
}
const Xt = Variable(K.DateTime.new_now_local(), {
  poll: [1e3, () => K.DateTime.new_now_local()]
}), Yt = Variable(0, {
  poll: [6e4, "cat /proc/uptime", (e) => Number.parseInt(e.split(".")[0]) / 60]
}), Ui = {
  id: K.get_os_info("ID"),
  logo: K.get_os_info("LOGO")
}, Ci = {
  "transmission-gtk": "transmission",
  "blueberry.py": "blueberry",
  Caprine: "facebook-messenger",
  "com.raggesilver.BlackBox-symbolic": "terminal-symbolic",
  "org.wezfurlong.wezterm-symbolic": "terminal-symbolic",
  "audio-headset-bluetooth": "audio-headphones-symbolic",
  "audio-card-analog-usb": "audio-speakers-symbolic",
  "audio-card-analog-pci": "audio-card-symbolic",
  "preferences-system": "emblem-system-symbolic",
  "com.github.Aylur.ags-symbolic": "controls-symbolic",
  "com.github.Aylur.ags": "controls-symbolic"
}, l = {
  missing: "image-missing-symbolic",
  nix: {
    nix: "nix-snowflake-symbolic"
  },
  app: {
    terminal: "terminal-symbolic"
  },
  fallback: {
    executable: "application-x-executable",
    notification: "dialog-information-symbolic",
    video: "video-x-generic-symbolic",
    audio: "audio-x-generic-symbolic"
  },
  ui: {
    close: "window-close-symbolic",
    colorpicker: "color-select-symbolic",
    info: "info-symbolic",
    link: "external-link-symbolic",
    lock: "system-lock-screen-symbolic",
    menu: "open-menu-symbolic",
    refresh: "view-refresh-symbolic",
    search: "system-search-symbolic",
    settings: "emblem-system-symbolic",
    themes: "preferences-desktop-theme-symbolic",
    tick: "object-select-symbolic",
    time: "hourglass-symbolic",
    toolbars: "toolbars-symbolic",
    warning: "dialog-warning-symbolic",
    avatar: "avatar-default-symbolic",
    arrow: {
      right: "pan-end-symbolic",
      left: "pan-start-symbolic",
      down: "pan-down-symbolic",
      up: "pan-up-symbolic"
    }
  },
  audio: {
    mic: {
      muted: "microphone-disabled-symbolic",
      low: "microphone-sensitivity-low-symbolic",
      medium: "microphone-sensitivity-medium-symbolic",
      high: "microphone-sensitivity-high-symbolic"
    },
    volume: {
      muted: "audio-volume-muted-symbolic",
      low: "audio-volume-low-symbolic",
      medium: "audio-volume-medium-symbolic",
      high: "audio-volume-high-symbolic",
      overamplified: "audio-volume-overamplified-symbolic"
    },
    type: {
      headset: "audio-headphones-symbolic",
      speaker: "audio-speakers-symbolic",
      card: "audio-card-symbolic"
    },
    mixer: "mixer-symbolic"
  },
  powerprofile: {
    balanced: "power-profile-balanced-symbolic",
    "power-saver": "power-profile-power-saver-symbolic",
    performance: "power-profile-performance-symbolic"
  },
  asusctl: {
    profile: {
      Balanced: "power-profile-balanced-symbolic",
      Quiet: "power-profile-power-saver-symbolic",
      Performance: "power-profile-performance-symbolic"
    },
    mode: {
      Integrated: "processor-symbolic",
      Hybrid: "controller-symbolic"
    }
  },
  battery: {
    charging: "battery-flash-symbolic",
    warning: "battery-empty-symbolic"
  },
  bluetooth: {
    enabled: "bluetooth-active-symbolic",
    disabled: "bluetooth-disabled-symbolic"
  },
  brightness: {
    indicator: "display-brightness-symbolic",
    keyboard: "keyboard-brightness-symbolic",
    screen: "display-brightness-symbolic"
  },
  powermenu: {
    sleep: "weather-clear-night-symbolic",
    reboot: "system-reboot-symbolic",
    logout: "system-log-out-symbolic",
    shutdown: "system-shutdown-symbolic"
  },
  recorder: {
    recording: "media-record-symbolic"
  },
  notifications: {
    noisy: "org.gnome.Settings-notifications-symbolic",
    silent: "notifications-disabled-symbolic",
    message: "chat-bubbles-symbolic"
  },
  trash: {
    full: "user-trash-full-symbolic",
    empty: "user-trash-symbolic"
  },
  mpris: {
    shuffle: {
      enabled: "media-playlist-shuffle-symbolic",
      disabled: "media-playlist-consecutive-symbolic"
    },
    loop: {
      none: "media-playlist-repeat-symbolic",
      track: "media-playlist-repeat-song-symbolic",
      playlist: "media-playlist-repeat-symbolic"
    },
    playing: "media-playback-pause-symbolic",
    paused: "media-playback-start-symbolic",
    stopped: "media-playback-start-symbolic",
    prev: "media-skip-backward-symbolic",
    next: "media-skip-forward-symbolic"
  },
  system: {
    cpu: "org.gnome.SystemMonitor-symbolic",
    ram: "drive-harddisk-solidstate-symbolic",
    temp: "temperature-symbolic"
  },
  color: {
    dark: "dark-mode-symbolic",
    light: "light-mode-symbolic"
  }
};
function D(e, t = l.missing) {
  if (!e)
    return t || "";
  if (Y.file_test(e, Y.FileTest.EXISTS))
    return e;
  const i = Ci[e] || e;
  return Utils.lookUpIcon(i) ? i : (print(`no icon substitute "${i}" for "${e}", fallback: "${t}"`), t);
}
async function R(e, ...t) {
  const i = typeof e == "string" ? e : e.flatMap((n, o) => `${n}${t[o] ?? ""}`).join("");
  return Utils.execAsync(["bash", "-c", i]).catch((n) => (console.error(i, n), ""));
}
async function m(e) {
  return Utils.execAsync(e).catch((t) => (console.error(typeof e == "string" ? e : e.join(" "), t), ""));
}
function he(e) {
  const t = L.Display.get_default()?.get_n_monitors() || 1;
  return $e(t, 0).flatMap(e);
}
function $e(e, t = 1) {
  return Array.from({ length: e }, (i, n) => n + t);
}
function W(...e) {
  const t = e.filter((i) => Utils.exec({
    cmd: `which ${i}`,
    out: () => !1,
    err: () => !0
  }));
  return t.length > 0 && (console.warn(new Error(`missing dependencies: ${t.join(", ")}`)), Utils.notify(`missing dependencies: ${t.join(", ")}`)), t.length === 0;
}
function Be(e) {
  const t = e.executable.split(/\s+/).filter((i) => !i.startsWith("%") && !i.startsWith("@")).join(" ");
  R(`${t} &`), e.frequency += 1;
}
function Ni(e) {
  const t = imports.gi.cairo, i = e.get_allocation(), n = new t.ImageSurface(
    t.Format.ARGB32,
    i.width,
    i.height
  ), o = new t.Context(n);
  return o.setSourceRGBA(255, 255, 255, 0), o.rectangle(0, 0, i.width, i.height), o.fill(), e.draw(o), n;
}
const s = Ai(OPTIONS, {
  autotheme: a(!1),
  wallpaper: {
    resolution: a(1920),
    market: a("random")
  },
  theme: {
    dark: {
      primary: {
        bg: a("#51a4e7"),
        fg: a("#141414")
      },
      error: {
        bg: a("#e55f86"),
        fg: a("#141414")
      },
      bg: a("#171717"),
      fg: a("#eeeeee"),
      widget: a("#eeeeee"),
      border: a("#eeeeee")
    },
    light: {
      primary: {
        bg: a("#426ede"),
        fg: a("#eeeeee")
      },
      error: {
        bg: a("#b13558"),
        fg: a("#eeeeee")
      },
      bg: a("#fffffa"),
      fg: a("#080808"),
      widget: a("#080808"),
      border: a("#080808")
    },
    blur: a(0),
    scheme: a("dark"),
    widget: { opacity: a(94) },
    border: {
      width: a(1),
      opacity: a(96)
    },
    shadows: a(!0),
    padding: a(7),
    spacing: a(6),
    radius: a(11)
  },
  transition: a(200),
  font: {
    size: a(13),
    name: a("Ubuntu Nerd Font")
  },
  bar: {
    flatButtons: a(!0),
    position: a("top"),
    corners: a(!0),
    transparent: a(!1),
    layout: {
      start: a([
        "launcher",
        "workspaces",
        "taskbar",
        "expander",
        "messages"
      ]),
      center: a([
        "date"
      ]),
      end: a([
        "media",
        "expander",
        "systray",
        "colorpicker",
        "screenrecord",
        "system",
        "battery",
        "powermenu"
      ])
    },
    launcher: {
      icon: {
        colored: a(!0),
        icon: a(D(Ui.logo, l.ui.search))
      },
      label: {
        colored: a(!1),
        label: a(" Applications")
      },
      action: a(() => App.toggleWindow("launcher"))
    },
    date: {
      format: a("%H:%M - %A %e."),
      action: a(() => App.toggleWindow("datemenu"))
    },
    battery: {
      bar: a("regular"),
      charging: a("#00D787"),
      percentage: a(!0),
      blocks: a(7),
      width: a(50),
      low: a(30)
    },
    workspaces: {
      workspaces: a(7)
    },
    taskbar: {
      iconSize: a(0),
      monochrome: a(!1),
      exclusive: a(!1)
    },
    messages: {
      action: a(() => App.toggleWindow("datemenu"))
    },
    systray: {
      ignore: a([
        "KDE Connect Indicator",
        "spotify-client"
      ])
    },
    media: {
      monochrome: a(!0),
      preferred: a("spotify"),
      direction: a("right"),
      format: a("{artists} - {title}"),
      length: a(40)
    },
    powermenu: {
      monochrome: a(!1),
      action: a(() => App.toggleWindow("powermenu"))
    }
  },
  launcher: {
    width: a(0),
    margin: a(80),
    nix: {
      pkgs: a("nixpkgs/nixos-unstable"),
      max: a(8)
    },
    sh: {
      max: a(16)
    },
    apps: {
      iconSize: a(62),
      max: a(6),
      favorites: a([
        [
          "firefox",
          "wezterm",
          "org.gnome.Nautilus",
          "org.gnome.Calendar",
          "spotify"
        ]
      ])
    }
  },
  overview: {
    scale: a(9),
    workspaces: a(7),
    monochromeIcon: a(!1)
  },
  powermenu: {
    sleep: a("systemctl suspend"),
    reboot: a("systemctl reboot"),
    logout: a("pkill Hyprland"),
    shutdown: a("shutdown now"),
    layout: a("line"),
    labels: a(!0)
  },
  quicksettings: {
    avatar: {
      image: a(`/var/lib/AccountsService/icons/${Utils.USER}`),
      size: a(70)
    },
    width: a(380),
    position: a("right"),
    networkSettings: a("gtk-launch gnome-control-center"),
    media: {
      monochromeIcon: a(!0),
      coverSize: a(100)
    }
  },
  datemenu: {
    position: a("center"),
    weather: {
      interval: a(6e4),
      unit: a("metric"),
      key: a(
        JSON.parse(Utils.readFile(`${App.configDir}/.weather`) || "{}")?.key || ""
      ),
      cities: a(
        JSON.parse(Utils.readFile(`${App.configDir}/.weather`) || "{}")?.cities || []
      )
    }
  },
  osd: {
    progress: {
      vertical: a(!0),
      pack: {
        h: a("end"),
        v: a("center")
      }
    },
    microphone: {
      pack: {
        h: a("center"),
        v: a("end")
      }
    }
  },
  notifications: {
    position: a(["top", "right"]),
    blacklist: a(["Spotify"]),
    width: a(440)
  },
  hyprland: {
    gaps: a(2.4),
    inactiveBorder: a("#282828"),
    gapsWhenOnly: a(!1)
  }
});
globalThis.options = s;
const Li = [
  "font",
  "theme",
  "bar.flatButtons",
  "bar.position",
  "bar.battery.charging",
  "bar.battery.blocks"
], {
  dark: B,
  light: S,
  blur: nt,
  scheme: Kt,
  padding: Mi,
  spacing: Oi,
  radius: ot,
  shadows: Pi,
  widget: rt,
  border: Ae
} = s.theme, zi = 1.6;
function w(e, t) {
  return Kt.value === "dark" ? `${e}` : `${t}`;
}
const h = (e, t) => `--${e}: ${t};`;
function at() {
  return [
    h("bg", nt.value ? `transparentize(${w(B.bg, S.bg)}, ${nt.value / 100})` : w(B.bg, S.bg)),
    h("fg", w(B.fg, S.fg)),
    h("primary-bg", w(B.primary.bg, S.primary.bg)),
    h("primary-fg", w(B.primary.fg, S.primary.fg)),
    h("error-bg", w(B.error.bg, S.error.bg)),
    h("error-fg", w(B.error.fg, S.error.fg)),
    h("scheme", Kt),
    h("padding", `${Mi}pt`),
    h("spacing", `${Oi}pt`),
    h("radius", `${ot}px`),
    h("transition", `${s.transition}ms`),
    h("shadows", `${Pi}`),
    h("widget-bg", `transparentize(${w(B.widget, S.widget)}, ${rt.opacity.value / 100})`),
    h("hover-bg", `transparentize(${w(B.widget, S.widget)}, ${rt.opacity.value * 0.9 / 100})`),
    h("hover-fg", `lighten(${w(B.fg, S.fg)}, 8%)`),
    h("border-width", `${Ae.width}px`),
    h("border-color", `transparentize(${w(B.border, S.border)}, ${Ae.opacity.value / 100})`),
    h("border", "$border-width solid $border-color"),
    h("active-gradient", `linear-gradient(to right, ${w(B.primary.bg, S.primary.bg)}, darken(${w(B.primary.bg, S.primary.bg)}, 4%))`),
    h("shadow-color", w("rgba(0,0,0,.6)", "rgba(0,0,0,.4)")),
    h("text-shadow", w("2pt 2pt 2pt $shadow-color", "none")),
    h("box-shadow", w("2pt 2pt 2pt 0 $shadow-color, inset 0 0 0 $border-width $border-color", "none")),
    h("popover-border-color", `transparentize(${w(B.border, S.border)}, ${Math.max((Ae.opacity.value - 1) / 100, 0)})`),
    h("popover-padding", `$padding * ${zi}`),
    h("popover-radius", ot.value === 0 ? "0" : "$radius + $popover-padding"),
    h("font-size", `${s.font.size}pt`),
    h("font-name", s.font.name),
    // etc
    h("charging-bg", s.bar.battery.charging),
    h("bar-battery-blocks", s.bar.battery.blocks),
    h("bar-position", s.bar.position),
    h("hyprland-gaps-multiplier", s.hyprland.gaps)
  ];
}
async function et() {
  try {
    App.resetCss(), console.log(`:root { ${at().join(`
`)} }`), App.applyCss(`:root { ${at().join(`
`)} }`), App.applyCss(`${TMP}/style.css`);
  } catch (e) {
    e instanceof Error ? logError(e) : console.error(e);
  }
}
Utils.monitorFile(`${App.configDir}/style.css`, et);
s.handler(Li, et);
await et();
const me = `${Utils.HOME}/.config/background`, st = `${Utils.HOME}/Pictures/Wallpapers/Bing`;
let Ti = class extends Service {
  static {
    Service.register(this, {}, {
      wallpaper: ["string"]
    });
  }
  #e = !1;
  #t() {
    W("swww") && m("hyprctl cursorpos").then((t) => {
      m([
        "swww",
        "img",
        "--invert-y",
        "--transition-type",
        "grow",
        "--transition-pos",
        t.replace(" ", ""),
        me
      ]).then(() => {
        this.changed("wallpaper");
      });
    });
  }
  async #i(t) {
    this.#e = !0, await m(`cp ${t} ${me}`), this.#t(), this.#e = !1;
  }
  async #n() {
    const t = await Utils.fetch("https://bing.biturl.top/", {
      params: {
        resolution: s.wallpaper.resolution.value,
        format: "json",
        image_format: "jpg",
        index: "random",
        mkt: s.wallpaper.market.value
      }
    }).then((o) => o.text());
    if (!t.startsWith("{"))
      return console.warn("bing api", t);
    const { url: i } = JSON.parse(t), n = `${st}/${i.replace("https://www.bing.com/th?id=", "")}`;
    W("curl") && (Utils.ensureDirectory(st), await m(`curl "${i}" --output ${n}`), this.#i(n));
  }
  random = () => {
    this.#n();
  };
  set = (t) => {
    this.#i(t);
  };
  get wallpaper() {
    return me;
  }
  constructor() {
    if (super(), !W("swww"))
      return this;
    Utils.monitorFile(me, () => {
      this.#e || this.#t();
    }), Utils.execAsync("swww-daemon").then(this.#t).catch(() => null);
  }
};
const pe = new Ti();
function Ri() {
  pe.connect("changed", () => ct()), s.autotheme.connect("changed", () => ct());
}
function Di(...e) {
  const t = s.transition.value / 2;
  e.forEach((i, n) => Utils.timeout(t * n, i));
}
async function ct(e = "image", t = pe.wallpaper) {
  if (!s.autotheme.value || !W("matugen"))
    return;
  const i = await m(`matugen --dry-run -j hex ${e} ${t}`), n = JSON.parse(i).colors, { dark: o, light: r } = s.theme;
  Di(
    () => {
      o.widget.value = n.dark.on_surface, r.widget.value = n.light.on_surface;
    },
    () => {
      o.border.value = n.dark.outline, r.border.value = n.light.outline;
    },
    () => {
      o.bg.value = n.dark.surface, r.bg.value = n.light.surface;
    },
    () => {
      o.fg.value = n.dark.on_surface, r.fg.value = n.light.on_surface;
    },
    () => {
      o.primary.bg.value = n.dark.primary, r.primary.bg.value = n.light.primary, s.bar.battery.charging.value = s.theme.scheme.value === "dark" ? n.dark.primary : n.light.primary;
    },
    () => {
      o.primary.fg.value = n.dark.on_primary, r.primary.fg.value = n.light.on_primary;
    },
    () => {
      o.error.bg.value = n.dark.error, r.error.bg.value = n.light.error;
    },
    () => {
      o.error.fg.value = n.dark.on_error, r.error.fg.value = n.light.on_error;
    }
  );
}
const { messageAsync: Ei } = await Service.import("hyprland"), {
  hyprland: be,
  theme: {
    spacing: Zt,
    radius: ei,
    border: { width: ti },
    blur: ii,
    shadows: ni,
    dark: {
      primary: { bg: oi }
    },
    light: {
      primary: { bg: ri }
    },
    scheme: ai
  }
} = s, ji = [
  "hyprland",
  Zt.id,
  ei.id,
  ii.id,
  ti.id,
  ni.id,
  oi.id,
  ri.id,
  ai.id
];
function Fi() {
  return ai.value === "dark" ? oi.value : ri.value;
}
function lt(e) {
  return `rgba(${e}ff)`.replace("#", "");
}
function Ue(e) {
  const t = e.filter((i) => !!i).map((i) => `keyword ${i}`).join("; ");
  return Ei(`[[BATCH]]/${t}`);
}
async function dt() {
  const e = Math.floor(be.gaps.value * Zt.value);
  Ue([
    `general:border_size ${ti}`,
    `general:gaps_out ${e}`,
    `general:gaps_in ${Math.floor(e / 2)}`,
    `general:col.active_border ${lt(Fi())}`,
    `general:col.inactive_border ${lt(be.inactiveBorder.value)}`,
    `decoration:rounding ${ei}`,
    `decoration:drop_shadow ${ni.value ? "yes" : "no"}`,
    `dwindle:no_gaps_when_only ${be.gapsWhenOnly.value ? 0 : 1}`,
    `master:no_gaps_when_only ${be.gapsWhenOnly.value ? 0 : 1}`
  ]), await Ue(App.windows.map(({ name: t }) => `layerrule unset, ${t}`)), ii.value > 0 && Ue(App.windows.flatMap(({ name: t }) => [
    `layerrule unset, ${t}`,
    `layerrule blur, ${t}`,
    `layerrule ignorealpha ${/* based on shadow color */
    0.29}, ${t}`
  ]));
}
function Hi() {
  s.handler(ji, dt), dt();
}
async function ut() {
  const { scheme: e, dark: t, light: i } = s.theme, n = e.value === "dark" ? t.primary.bg.value : i.primary.bg.value;
  await m("which tmux").catch(() => !1) && m(`tmux set @main_accent "${n}"`);
}
function qi() {
  s.theme.dark.primary.bg.connect("changed", ut), s.theme.light.primary.bg.connect("changed", ut);
}
const Vi = new Si.Settings({
  schema: "org.gnome.desktop.interface"
});
function pt() {
  const e = s.theme.scheme.value;
  Vi.set_string("color-scheme", `prefer-${e}`);
}
function Gi() {
  s.theme.scheme.connect("changed", pt), pt();
}
async function Ji() {
  (await Service.import("battery")).connect("notify::percent", ({ percent: t, charging: i }) => {
    t !== 30 || t !== 30 / 2 || !i || Utils.notify({
      summary: `${t}% Battery Percentage`,
      iconName: l.battery.warning,
      urgency: "critical"
    });
  });
}
const Ce = await Service.import("notifications"), { blacklist: Qi } = s.notifications;
function Xi() {
  const e = Ce.constructor.prototype.Notify.bind(Ce);
  Ce.constructor.prototype.Notify = function(t, ...i) {
    return Qi.value.includes(t) ? Number.MAX_SAFE_INTEGER : e(t, ...i);
  };
}
function Yi() {
  try {
    Gi(), qi(), Ri(), Ji(), Xi(), Hi();
  } catch (e) {
    logError(e);
  }
}
const U = ({
  window: e = "",
  flat: t,
  child: i,
  setup: n,
  ...o
}) => Widget.Button({
  child: Widget.Box({ child: i }),
  setup: (r) => {
    let c = !1;
    r.toggleClassName("panel-button"), r.toggleClassName(e), r.hook(s.bar.flatButtons, () => {
      r.toggleClassName("flat", t ?? s.bar.flatButtons.value);
    }), r.hook(App, (u, g, x) => {
      g === e && (c && !x && (c = !1, r.toggleClassName("active", !1)), x && (c = !0, r.toggleClassName("active")));
    }), n && n(r);
  },
  ...o
}), k = await Service.import("battery"), { bar: J, percentage: Je, blocks: re, width: gt, low: Ki } = s.bar.battery;
function Zi() {
  return Widget.Icon({
    setup: (e) => e.hook(k, () => {
      e.icon = k.charging || k.charged ? l.battery.charging : k.icon_name;
    })
  });
}
function si() {
  return Widget.Revealer({
    transition: "slide_right",
    click_through: !0,
    reveal_child: Je.bind(),
    child: Widget.Label({
      label: k.bind("percent").as((e) => `${e}%`)
    })
  });
}
function ci() {
  const e = Widget.LevelBar({
    bar_mode: "discrete",
    max_value: re.bind(),
    visible: J.bind().as((i) => i !== "hidden"),
    value: k.bind("percent").as((i) => i / 100 * re.value)
  }), t = () => {
    e.value = k.percent / 100 * re.value, e.css = `block { min-width: ${gt.value / re.value}pt; }`;
  };
  return e.hook(gt, t).hook(re, t).hook(J, () => {
    e.vpack = J.value === "whole" ? "fill" : "center", e.hpack = J.value === "whole" ? "fill" : "center";
  });
}
function en() {
  return Widget.Overlay({
    vexpand: !0,
    child: ci(),
    class_name: "whole",
    pass_through: !0,
    overlay: Widget.Box({
      hpack: "center",
      children: [
        Widget.Icon({
          icon: l.battery.charging,
          visible: Utils.merge([
            k.bind("charging"),
            k.bind("charged")
          ], (e, t) => e || t)
        }),
        Widget.Box({
          hpack: "center",
          vpack: "center",
          child: si()
        })
      ]
    })
  });
}
function tn() {
  return Widget.Box({
    class_name: "regular",
    children: [
      Zi(),
      si(),
      ci()
    ]
  });
}
const nn = () => U({
  class_name: "battery-bar",
  hexpand: !1,
  on_clicked: () => {
    Je.value = !Je.value;
  },
  visible: k.bind("available"),
  child: Widget.Box({
    expand: !0,
    visible: k.bind("available"),
    child: J.bind().as((e) => e === "whole" ? en() : tn())
  }),
  setup: (e) => e.hook(J, (t) => t.toggleClassName("bar-hidden", J.value === "hidden")).hook(k, (t) => {
    t.toggleClassName("charging", k.charging || k.charged), t.toggleClassName("low", k.percent < Ki.value);
  })
}), ht = `${Utils.CACHE_DIR}/colorpicker.json`, on = 10;
let rn = class extends Service {
  static {
    Service.register(this, {}, {
      colors: ["jsobject"]
    });
  }
  #e = 0;
  #t = JSON.parse(Utils.readFile(ht) || "[]");
  get colors() {
    return [...this.#t];
  }
  set colors(t) {
    this.#t = t, this.changed("colors");
  }
  // TODO: doesn't work?
  async wlCopy(t) {
    W("wl-copy") && R(`wl-copy ${t}`);
  }
  pick = async () => {
    if (!W("hyprpicker"))
      return;
    const t = await R("hyprpicker -a -r");
    if (!t)
      return;
    this.wlCopy(t);
    const i = this.colors;
    i.includes(t) || (i.push(t), i.length > on && i.shift(), this.colors = i, Utils.writeFile(JSON.stringify(i, null, 2), ht)), this.#e = await Utils.notify({
      id: this.#e,
      iconName: l.ui.colorpicker,
      summary: t
    });
  };
};
const ae = new rn();
function an(e) {
  return `
* {
    background-color: ${e};
    color: transparent;
}
*:hover {
    color: white;
    text-shadow: 2px 2px 3px rgba(0,0,0,.8);
}`;
}
const sn = () => {
  const e = Widget.Menu({
    class_name: "colorpicker",
    children: ae.bind("colors").as((t) => t.map((i) => Widget.MenuItem({
      child: Widget.Label(i),
      css: an(i),
      on_activate: () => ae.wlCopy(i)
    })))
  });
  return U({
    class_name: "color-picker",
    child: Widget.Icon("color-select-symbolic"),
    tooltip_text: ae.bind("colors").as((t) => `${t.length} colors`),
    on_clicked: ae.pick,
    on_secondary_click: (t) => {
      ae.colors.length !== 0 && e.popup_at_widget(t, L.Gravity.SOUTH, L.Gravity.NORTH, null);
    }
  });
}, { format: cn, action: ln } = s.bar.date, dn = Utils.derive([Xt, cn], (e, t) => e.format(t) || ""), un = () => U({
  window: "datemenu",
  on_clicked: ln.bind(),
  child: Widget.Label({
    justification: "center",
    label: dn.bind()
  })
}), mt = `${Utils.CACHE_DIR}/nixpkgs`, pn = "legacyPackages.x86_64-linux.", gn = s.launcher.nix.max, Ne = s.launcher.nix.pkgs;
class hn extends Service {
  static {
    Service.register(this, {}, {
      available: ["boolean", "r"],
      ready: ["boolean", "rw"]
    });
  }
  #e = {};
  #t = !0;
  set ready(t) {
    this.#t = t, this.changed("ready");
  }
  get db() {
    return this.#e;
  }
  get ready() {
    return this.#t;
  }
  get available() {
    return Utils.exec("which nix", () => !0, () => !1);
  }
  constructor() {
    if (super(), !this.available)
      return this;
    this.#i(), Ne.connect("changed", this.#i);
  }
  query = async (t) => !W("fzf", "nix") || !this.#t ? [] : R(`cat ${mt} | fzf -f ${t} -e | head -n ${gn} `).then((i) => i.split(`
`).filter((n) => n));
  nix(t, i, n) {
    return Utils.execAsync(`nix ${t} ${Ne}#${i} --impure ${n}`);
  }
  run = async (t) => {
    if (W("nix"))
      try {
        const [i, ...n] = t.trim().split(/\s+/);
        this.ready = !1, await this.nix("shell", i, "--command sh -c 'exit'"), this.ready = !0, this.nix("run", i, ["--", ...n].join(" "));
      } catch (i) {
        typeof i == "string" ? Utils.notify("NixRun Error", i, l.nix.nix) : logError(i);
      } finally {
        this.ready = !0;
      }
  };
  #i = async () => {
    if (!W("nix"))
      return;
    this.ready = !1, this.#e = {};
    const t = await R(`nix search ${Ne} --json`);
    if (!t) {
      this.ready = !0;
      return;
    }
    const i = Object.entries(JSON.parse(t));
    for (const [o, r] of i) {
      const c = o.replace(pn, "");
      this.#e[c] = { ...r, name: c };
    }
    const n = Object.keys(this.#e).join(`
`);
    await Utils.writeFile(n, mt), this.ready = !0;
  };
}
const T = new hn(), { icon: Le, label: Me, action: mn } = s.bar.launcher;
function bn() {
  const e = Widget.Icon({
    icon: Le.icon.bind(),
    class_name: Utils.merge([
      Le.colored.bind(),
      T.bind("ready")
    ], (t, i) => `${t ? "colored" : ""} ${i ? "" : "spinning"}`),
    css: `
            @keyframes spin {
                to { -gtk-icon-transform: rotate(1turn); }
            }

            image.spinning {
                animation-name: spin;
                animation-duration: 1s;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
        `
  });
  return Widget.Revealer({
    transition: "slide_left",
    child: e,
    reveal_child: Utils.merge([
      Le.icon.bind(),
      T.bind("ready")
    ], (t, i) => !!(t || i))
  });
}
const fn = () => U({
  window: "launcher",
  on_clicked: mn.bind(),
  child: Widget.Box([
    bn(),
    Widget.Label({
      class_name: Me.colored.bind().as((e) => e ? "colored" : ""),
      visible: Me.label.bind().as((e) => !!e),
      label: Me.label.bind()
    })
  ])
}), Qe = await Service.import("mpris"), { length: bt, direction: ft, preferred: li, monochrome: vt, format: yt } = s.bar.media;
function wt(e = li.value) {
  return Qe.getPlayer(e) || Qe.players[0] || null;
}
function vn(e) {
  const t = Widget.Revealer({
    click_through: !0,
    visible: bt.bind().as((n) => n > 0),
    transition: ft.bind().as((n) => `slide_${n}`),
    setup: (n) => {
      let o = "";
      n.hook(e, () => {
        o !== e.track_title && (o = e.track_title, n.reveal_child = !0, Utils.timeout(3e3, () => {
          !n.is_destroyed && (n.reveal_child = !1);
        }));
      });
    },
    child: Widget.Label({
      truncate: "end",
      max_width_chars: bt.bind().as((n) => n > 0 ? n : -1),
      label: Utils.merge([
        e.bind("track_title"),
        e.bind("track_artists"),
        yt.bind()
      ], () => `${yt}`.replace("{title}", e.track_title).replace("{artists}", e.track_artists.join(", ")).replace("{artist}", e.track_artists[0] || "").replace("{album}", e.track_album).replace("{name}", e.name).replace("{identity}", e.identity))
    })
  }), i = Widget.Icon({
    icon: Utils.merge([e.bind("entry"), vt.bind()], (n) => {
      const o = `${n}${vt.value ? "-symbolic" : ""}`;
      return D(o, l.fallback.audio);
    })
  });
  return Widget.Box({
    attribute: { revealer: t },
    children: ft.bind().as((n) => n === "right" ? [i, t] : [t, i])
  });
}
const yn = () => {
  let e = wt();
  const t = U({
    class_name: "media",
    child: Widget.Icon(l.fallback.audio)
  }), i = () => {
    if (e = wt(), t.visible = !!e, !e)
      return;
    const n = vn(e), { revealer: o } = n.attribute;
    t.child = n, t.on_primary_click = () => {
      e.playPause();
    }, t.on_secondary_click = () => {
      e.playPause();
    }, t.on_scroll_up = () => {
      e.next();
    }, t.on_scroll_down = () => {
      e.previous();
    }, t.on_hover = () => {
      o.reveal_child = !0;
    }, t.on_hover_lost = () => {
      o.reveal_child = !1;
    };
  };
  return t.hook(li, i).hook(Qe, i, "notify::players");
}, { monochrome: _t, action: wn } = s.bar.powermenu, _n = () => U({
  window: "powermenu",
  on_clicked: wn.bind(),
  child: Widget.Icon(l.powermenu.shutdown),
  setup: (e) => e.hook(_t, () => {
    e.toggleClassName("colored", !_t.value), e.toggleClassName("box");
  })
}), Wn = await Service.import("systemtray"), { ignore: xn } = s.bar.systray;
function kn(e) {
  return U({
    class_name: "tray-item",
    child: Widget.Icon({ icon: e.bind("icon") }),
    tooltip_markup: e.bind("tooltip_markup"),
    setup: (t) => {
      const { menu: i } = e;
      if (!i)
        return;
      const n = i.connect("popped-up", () => {
        t.toggleClassName("active"), i.connect("notify::visible", () => {
          t.toggleClassName("active", i.visible);
        }), i.disconnect(n);
      });
      t.connect("destroy", () => i.disconnect(n));
    },
    on_primary_click: (t) => e.menu?.popup_at_widget(
      t,
      L.Gravity.SOUTH,
      L.Gravity.NORTH,
      null
    ),
    on_secondary_click: (t) => e.menu?.popup_at_widget(
      t,
      L.Gravity.SOUTH,
      L.Gravity.NORTH,
      null
    )
  });
}
const $n = () => Widget.Box().bind("children", Wn, "items", (e) => e.filter(({ id: t }) => !xn.value.includes(t)).map(kn));
class Bn extends Service {
  static {
    Service.register(this, {}, {
      profile: ["string", "r"],
      mode: ["string", "r"]
    });
  }
  get available() {
    return Utils.exec("which asusctl", () => !0, () => !1);
  }
  #e = "Balanced";
  #t = "Hybrid";
  async nextProfile() {
    await m("asusctl profile -n");
    const i = (await m("asusctl profile -p")).split(" ")[3];
    this.#e = i, this.changed("profile");
  }
  async setProfile(t) {
    await m(`asusctl profile --profile-set ${t}`), this.#e = t, this.changed("profile");
  }
  async nextMode() {
    await m(`supergfxctl -m ${this.#t === "Hybrid" ? "Integrated" : "Hybrid"}`), this.#t = await m("supergfxctl -g"), this.changed("profile");
  }
  constructor() {
    super(), this.available && (m("asusctl profile -p").then((t) => this.#e = t.split(" ")[3]), m("supergfxctl -g").then((t) => this.#t = t));
  }
  get profiles() {
    return ["Performance", "Balanced", "Quiet"];
  }
  get profile() {
    return this.#e;
  }
  get mode() {
    return this.#t;
  }
}
const _ = new Bn(), Sn = await Service.import("notifications"), Oe = await Service.import("bluetooth"), N = await Service.import("audio"), Pe = await Service.import("network"), Wt = await Service.import("powerprofiles");
function In() {
  const e = _.available ? _.bind("profile").as((i) => i !== "Balanced") : Wt.bind("active_profile").as((i) => i !== "balanced"), t = _.available ? _.bind("profile").as((i) => l.asusctl.profile[i]) : Wt.bind("active_profile").as((i) => l.powerprofile[i]);
  return Widget.Icon({ visible: e, icon: t });
}
function An() {
  return _.available ? Widget.Icon({
    visible: _.bind("mode").as((e) => e !== "Hybrid"),
    icon: _.bind("mode").as((e) => l.asusctl.mode[e])
  }) : Widget.Icon({
    setup(e) {
      Utils.idle(() => e.visible = !1);
    }
  });
}
function Un() {
  return Widget.Icon().hook(N, (e) => e.visible = N.recorders.length > 0 || N.microphone.is_muted || !1).hook(N.microphone, (e) => {
    const t = N.microphone.is_muted ? 0 : N.microphone.volume, { muted: i, low: n, medium: o, high: r } = l.audio.mic, c = [[67, r], [34, o], [1, n], [0, i]];
    e.icon = c.find(([u]) => u <= t * 100)?.[1] || "";
  });
}
function Cn() {
  return Widget.Icon({
    visible: Sn.bind("dnd"),
    icon: l.notifications.silent
  });
}
function Nn() {
  return Widget.Overlay({
    class_name: "bluetooth",
    passThrough: !0,
    visible: Oe.bind("enabled"),
    child: Widget.Icon({
      icon: l.bluetooth.enabled
    }),
    overlay: Widget.Label({
      hpack: "end",
      vpack: "start",
      label: Oe.bind("connected_devices").as((e) => `${e.length}`),
      visible: Oe.bind("connected_devices").as((e) => e.length > 0)
    })
  });
}
function Ln() {
  return Widget.Icon().hook(Pe, (e) => {
    const t = Pe[Pe.primary || "wifi"]?.icon_name;
    e.icon = t || "", e.visible = !!t;
  });
}
function Mn() {
  return Widget.Icon().hook(N.speaker, (e) => {
    const t = N.speaker.is_muted ? 0 : N.speaker.volume, { muted: i, low: n, medium: o, high: r, overamplified: c } = l.audio.volume, u = [[101, c], [67, r], [34, o], [1, n], [0, i]];
    e.icon = u.find(([g]) => g <= t * 100)?.[1] || "";
  });
}
const On = () => U({
  window: "quicksettings",
  on_clicked: () => App.toggleWindow("quicksettings"),
  on_scroll_up: () => N.speaker.volume += 0.02,
  on_scroll_down: () => N.speaker.volume -= 0.02,
  child: Widget.Box([
    In(),
    An(),
    Cn(),
    Nn(),
    Ln(),
    Mn(),
    Un()
  ])
}), I = await Service.import("hyprland"), Pn = await Service.import("applications"), { monochrome: zn, exclusive: xt, iconSize: Tn } = s.bar.taskbar, { position: Rn } = s.bar;
function Dn(e) {
  return I.messageAsync(
    `dispatch focuswindow address:${e}`
  );
}
function En(e) {
  return Widget.Box({
    attribute: { address: e },
    visible: !1
  });
}
function kt(e) {
  const t = I.getClient(e);
  if (!t || t.class === "")
    return En(e);
  const i = Pn.list.find((o) => o.match(t.class)), n = U({
    class_name: "panel-button",
    tooltip_text: Utils.watch(t.title, I, () => I.getClient(e)?.title || ""),
    on_primary_click: () => Dn(e),
    on_middle_click: () => i && Be(i),
    child: Widget.Icon({
      size: Tn.bind(),
      icon: zn.bind().as((o) => D(
        (i?.icon_name || t.class) + (o ? "-symbolic" : ""),
        l.fallback.executable + (o ? "-symbolic" : "")
      ))
    })
  });
  return Widget.Box(
    {
      attribute: { address: e },
      visible: Utils.watch(!0, [xt, I], () => xt.value ? I.active.workspace.id === t.workspace.id : !0)
    },
    Widget.Overlay({
      child: n,
      pass_through: !0,
      overlay: Widget.Box({
        className: "indicator",
        hpack: "center",
        vpack: Rn.bind().as((o) => o === "top" ? "start" : "end"),
        setup: (o) => o.hook(I, () => {
          o.toggleClassName("active", I.active.client.address === e);
        })
      })
    })
  );
}
function ze(e) {
  return e.sort(({ attribute: t }, { attribute: i }) => {
    const n = I.getClient(t.address), o = I.getClient(i.address);
    return n.workspace.id - o.workspace.id;
  });
}
const jn = () => Widget.Box({
  class_name: "taskbar",
  children: ze(I.clients.map((e) => kt(e.address))),
  setup: (e) => e.hook(I, (t, i) => {
    typeof i == "string" && (t.children = t.children.filter((n) => n.attribute.address !== i));
  }, "client-removed").hook(I, (t, i) => {
    typeof i == "string" && (t.children = ze([...t.children, kt(i)]));
  }, "client-added").hook(I, (t, i) => {
    i === "movewindow" && (t.children = ze(t.children));
  }, "event")
}), se = await Service.import("hyprland"), { workspaces: Fn } = s.bar.workspaces;
function $t(e) {
  m(`hyprctl dispatch workspace ${e}`);
}
function Hn(e) {
  return Widget.Box({
    children: $e(e || 20).map((t) => Widget.Label({
      attribute: t,
      vpack: "center",
      label: `${t}`,
      setup: (i) => i.hook(se, () => {
        i.toggleClassName("active", se.active.workspace.id === t), i.toggleClassName("occupied", (se.getWorkspace(t)?.windows || 0) > 0);
      })
    })),
    setup: (t) => {
      e === 0 && t.hook(se.active.workspace, () => t.children.map((i) => {
        i.visible = se.workspaces.some((n) => n.id === i.attribute);
      }));
    }
  });
}
const qn = () => U({
  window: "overview",
  class_name: "workspaces",
  on_scroll_up: () => $t("m+1"),
  on_scroll_down: () => $t("m-1"),
  on_clicked: () => App.toggleWindow("overview"),
  child: Fn.bind().as(Hn)
}), Bt = () => K.DateTime.new_now_local().format("%Y-%m-%d_%H-%M-%S");
class Vn extends Service {
  static {
    Service.register(this, {}, {
      timer: ["int"],
      recording: ["boolean"]
    });
  }
  #e = `${Utils.HOME}/Videos/Screencasting`;
  #t = `${Utils.HOME}/Pictures/Screenshots`;
  #i = "";
  #n = 0;
  recording = !1;
  timer = 0;
  async start() {
    W("slurp", "wf-recorder") && (this.recording || (Utils.ensureDirectory(this.#e), this.#i = `${this.#e}/${Bt()}.mp4`, m(`wf-recorder -g "${await m("slurp")}" -f ${this.#i} --pixel-format yuv420p`), this.recording = !0, this.changed("recording"), this.timer = 0, this.#n = Utils.interval(1e3, () => {
      this.changed("timer"), this.timer++;
    })));
  }
  async stop() {
    this.recording && (await R("killall -INT wf-recorder"), this.recording = !1, this.changed("recording"), K.source_remove(this.#n), Utils.notify({
      iconName: l.fallback.video,
      summary: "Screenrecord",
      body: this.#i,
      actions: {
        "Show in Files": () => m(`xdg-open ${this.#e}`),
        View: () => m(`xdg-open ${this.#i}`)
      }
    }));
  }
  async screenshot(t = !1) {
    if (!W("slurp", "wayshot"))
      return;
    const i = `${this.#t}/${Bt()}.png`;
    if (Utils.ensureDirectory(this.#t), t)
      await m(`wayshot -f ${i}`);
    else {
      const n = await m("slurp");
      if (!n)
        return;
      await m(`wayshot -f ${i} -s "${n}"`);
    }
    R(`wl-copy < ${i}`), Utils.notify({
      image: i,
      summary: "Screenshot",
      body: i,
      actions: {
        "Show in Files": () => m(`xdg-open ${this.#t}`),
        View: () => m(`xdg-open ${i}`),
        Edit: () => {
          W("swappy") && m(`swappy -f ${i}`);
        }
      }
    });
  }
}
const _e = new Vn();
Object.assign(globalThis, { recorder: _e });
const Gn = () => U({
  class_name: "recorder",
  on_clicked: () => _e.stop(),
  visible: _e.bind("recording"),
  child: Widget.Box({
    children: [
      Widget.Icon(l.recorder.recording),
      Widget.Label({
        label: _e.bind("timer").as((e) => {
          const t = e % 60;
          return `${Math.floor(e / 60)}:${t < 10 ? `0${t}` : t}`;
        })
      })
    ]
  })
}), Jn = await Service.import("notifications"), Qn = Jn.bind("notifications"), Xn = s.bar.messages.action.bind(), Yn = () => U({
  class_name: "messages",
  on_clicked: Xn,
  visible: Qn.as((e) => e.length > 0),
  child: Widget.Box([
    Widget.Icon(l.notifications.message)
  ])
}), { start: Kn, center: Zn, end: eo } = s.bar.layout, { transparent: St, position: to } = s.bar, Te = {
  battery: nn,
  colorpicker: sn,
  date: un,
  launcher: fn,
  media: yn,
  powermenu: _n,
  systray: $n,
  system: On,
  taskbar: jn,
  workspaces: qn,
  screenrecord: Gn,
  messages: Yn,
  expander: () => Widget.Box({ expand: !0 })
}, io = (e) => Widget.Window({
  monitor: e,
  class_name: "bar",
  name: `bar${e}`,
  exclusivity: "exclusive",
  anchor: to.bind().as((t) => [t, "right", "left"]),
  child: Widget.CenterBox({
    css: "min-width: 2px; min-height: 2px;",
    startWidget: Widget.Box({
      hexpand: !0,
      children: Kn.bind().as((t) => t.map((i) => Te[i]()))
    }),
    centerWidget: Widget.Box({
      hpack: "center",
      children: Zn.bind().as((t) => t.map((i) => Te[i]()))
    }),
    endWidget: Widget.Box({
      hexpand: !0,
      children: eo.bind().as((t) => t.map((i) => Te[i]()))
    })
  }),
  setup: (t) => t.hook(St, () => {
    t.toggleClassName("transparent", St.value);
  })
});
function f(e, {
  css: t = "",
  hexpand: i = !0,
  vexpand: n = !0
} = {}) {
  return Widget.EventBox({
    hexpand: i,
    vexpand: n,
    can_focus: !1,
    child: Widget.Box({ css: t }),
    setup: (o) => o.on("button-press-event", () => App.toggleWindow(e))
  });
}
function j(e, t, i = "slide_down") {
  return Widget.Box(
    { css: "padding: 1px;" },
    Widget.Revealer({
      transition: i,
      child: Widget.Box({
        class_name: "window-content",
        child: t
      }),
      transitionDuration: s.transition.bind(),
      setup: (n) => n.hook(App, (o, r, c) => {
        r === e && (n.reveal_child = c);
      })
    })
  );
}
function no(e, t, i) {
  return {
    center: () => Widget.CenterBox({}, f(e), Widget.CenterBox(
      { vertical: !0 },
      f(e),
      j(e, t, i),
      f(e)
    ), f(e)),
    top: () => Widget.CenterBox({}, f(e), Widget.Box(
      { vertical: !0 },
      j(e, t, i),
      f(e)
    ), f(e)),
    "top-right": () => Widget.Box({}, f(e), Widget.Box(
      {
        hexpand: !1,
        vertical: !0
      },
      j(e, t, i),
      f(e)
    )),
    "top-center": () => Widget.Box({}, f(e), Widget.Box(
      {
        hexpand: !1,
        vertical: !0
      },
      j(e, t, i),
      f(e)
    ), f(e)),
    "top-left": () => Widget.Box({}, Widget.Box(
      {
        hexpand: !1,
        vertical: !0
      },
      j(e, t, i),
      f(e)
    ), f(e)),
    "bottom-left": () => Widget.Box({}, Widget.Box(
      {
        hexpand: !1,
        vertical: !0
      },
      f(e),
      j(e, t, i)
    ), f(e)),
    "bottom-center": () => Widget.Box({}, f(e), Widget.Box(
      {
        hexpand: !1,
        vertical: !0
      },
      f(e),
      j(e, t, i)
    ), f(e)),
    "bottom-right": () => Widget.Box({}, f(e), Widget.Box(
      {
        hexpand: !1,
        vertical: !0
      },
      f(e),
      j(e, t, i)
    ))
  };
}
const ne = ({
  name: e,
  child: t,
  layout: i = "center",
  transition: n,
  exclusivity: o = "ignore",
  ...r
}) => Widget.Window({
  name: e,
  class_names: [e, "popup-window"],
  setup: (c) => c.keybind("Escape", () => App.closeWindow(e)),
  visible: !1,
  keymode: "on-demand",
  exclusivity: o,
  layer: "top",
  anchor: ["top", "bottom", "right", "left"],
  child: no(e, t, n)[i](),
  ...r
}), di = await Service.import("applications"), { query: We } = di, { iconSize: ui } = s.launcher.apps;
function oo(e) {
  return Widget.Button({
    hexpand: !0,
    tooltip_text: e.name,
    on_clicked: () => {
      App.closeWindow("launcher"), Be(e);
    },
    child: Widget.Icon({
      size: ui.bind(),
      icon: D(e.icon_name, l.fallback.executable)
    })
  });
}
function ro(e) {
  const t = Widget.Label({
    class_name: "title",
    label: e.name,
    hexpand: !0,
    xalign: 0,
    vpack: "center",
    truncate: "end"
  }), i = Widget.Label({
    class_name: "description",
    label: e.description || "",
    hexpand: !0,
    wrap: !0,
    max_width_chars: 30,
    xalign: 0,
    justification: "left",
    vpack: "center"
  }), n = Widget.Icon({
    icon: D(e.icon_name, l.fallback.executable),
    size: ui.bind()
  }), o = Widget.Box({
    vertical: !0,
    vpack: "center",
    children: e.description ? [t, i] : [t]
  });
  return Widget.Button({
    class_name: "app-item",
    attribute: { app: e },
    child: Widget.Box({
      children: [n, o]
    }),
    on_clicked: () => {
      App.closeWindow("launcher"), Be(e);
    }
  });
}
function ao() {
  const e = s.launcher.apps.favorites.bind();
  return Widget.Revealer({
    visible: e.as((t) => t.length > 0),
    child: Widget.Box({
      vertical: !0,
      children: e.as((t) => t.flatMap((i) => [
        Widget.Separator(),
        Widget.Box({
          class_name: "quicklaunch horizontal",
          children: i.map((n) => We(n)?.[0]).filter((n) => n).map(oo)
        })
      ]))
    })
  });
}
function so() {
  const e = Variable(We("")), t = s.launcher.apps.max;
  let i = e.value[0];
  function n(r) {
    return Widget.Revealer(
      { attribute: { app: r } },
      Widget.Box(
        { vertical: !0 },
        Widget.Separator(),
        ro(r)
      )
    );
  }
  const o = Widget.Box({
    vertical: !0,
    children: e.bind().as((r) => r.map(n)),
    setup: (r) => r.hook(di, () => e.value = We(""), "notify::frequents")
  });
  return Object.assign(o, {
    filter(r) {
      i = We(r || "")[0], o.children.reduce((c, u) => !r || c >= t.value ? (u.reveal_child = !1, c) : u.attribute.app.match(r) ? (u.reveal_child = !0, ++c) : (u.reveal_child = !1, c), 0);
    },
    launchFirst() {
      Be(i);
    }
  });
}
const pi = Variable(!1);
function co(e) {
  const t = Widget.Label({
    class_name: "name",
    label: e.name.split(".").at(-1)
  }), i = e.name.includes(".") ? Widget.Label({
    class_name: "description",
    hpack: "end",
    hexpand: !0,
    label: `  ${e.name.split(".").slice(0, -1).join(".")}`
  }) : null, n = Widget.Label({
    class_name: "version",
    label: e.version,
    hexpand: !0,
    hpack: "end"
  }), o = e.description ? Widget.Label({
    class_name: "description",
    label: e.description,
    justification: "left",
    wrap: !0,
    hpack: "start",
    max_width_chars: 40
  }) : null;
  return Widget.Box(
    {
      attribute: { name: e.name },
      vertical: !0
    },
    Widget.Separator(),
    Widget.Button(
      {
        class_name: "nix-item",
        on_clicked: () => {
          T.run(e.name), App.closeWindow("launcher");
        }
      },
      Widget.Box(
        { vertical: !0 },
        Widget.Box([t, n]),
        Widget.Box([
          o,
          i
        ])
      )
    )
  );
}
function lo() {
  const e = Widget.Icon({
    icon: l.nix.nix,
    class_name: "spinner",
    css: `
            @keyframes spin {
                to { -gtk-icon-transform: rotate(1turn); }
            }

            image.spinning {
                animation-name: spin;
                animation-duration: 1s;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
        `,
    setup: (t) => t.hook(T, () => {
      t.toggleClassName("spinning", !T.ready);
    })
  });
  return Widget.Revealer({
    transition: "slide_left",
    child: e,
    reveal_child: Utils.merge([
      T.bind("ready"),
      pi.bind()
    ], (t, i) => !t || i)
  });
}
function uo() {
  const e = Widget.Box({
    vertical: !0
  }), t = Widget.Revealer({
    child: e
  });
  async function i(n) {
    if (pi.value = !!n, n || (t.reveal_child = !1), n.trim()) {
      const o = await T.query(n);
      e.children = o.map((r) => co(T.db[r])), t.reveal_child = !0;
    }
  }
  return Object.assign(t, {
    filter: i,
    run: T.run
  });
}
const po = s.launcher.sh.max, gi = `${Utils.CACHE_DIR}/binaries`;
async function go(e) {
  return Utils.execAsync(`ls ${e}`).catch(() => "");
}
async function ho() {
  const e = await Promise.all(Y.getenv("PATH").split(":").map(go));
  Utils.writeFile(e.join(`
`), gi);
}
async function mo(e) {
  return W("fzf") ? R(`cat ${gi} | fzf -f ${e} | head -n ${po}`).then((t) => Array.from(new Set(t.split(`
`).filter((i) => i)).values())).catch((t) => (print(t), [])) : [];
}
function bo(e) {
  Utils.execAsync(e).then((t) => {
    print(`:sh ${e.trim()}:`), print(t);
  }).catch((t) => {
    Utils.notify("ShRun Error", t, l.app.terminal);
  });
}
class fo extends Service {
  static {
    Service.register(this);
  }
  constructor() {
    super(), ho();
  }
  query = mo;
  run = bo;
}
const It = new fo(), hi = Variable(!1);
function vo(e) {
  return Widget.Box(
    {
      attribute: { bin: e },
      vertical: !0
    },
    Widget.Separator(),
    Widget.Button({
      child: Widget.Label({
        label: e,
        hpack: "start"
      }),
      class_name: "sh-item",
      on_clicked: () => {
        Utils.execAsync(e), App.closeWindow("launcher");
      }
    })
  );
}
function yo() {
  const e = Widget.Icon({
    icon: l.app.terminal,
    class_name: "spinner"
  });
  return Widget.Revealer({
    transition: "slide_left",
    child: e,
    reveal_child: hi.bind()
  });
}
function wo() {
  const e = Widget.Box({
    vertical: !0
  }), t = Widget.Revealer({
    child: e
  });
  async function i(n) {
    if (hi.value = !!n, n || (t.reveal_child = !1), n.trim()) {
      const o = await It.query(n);
      e.children = o.map(vo), t.reveal_child = !0;
    }
  }
  return Object.assign(t, {
    filter: i,
    run: It.run
  });
}
const { width: _o, margin: Wo } = s.launcher, xo = T.available;
function ko() {
  const e = ao(), t = so(), i = wo(), n = yo(), o = uo(), r = lo();
  function c(p, y) {
    return Widget.Box(
      { vertical: !0 },
      Widget.Separator(),
      Widget.Button(
        {
          class_name: "help",
          on_clicked: () => {
            g.grab_focus(), g.text = `:${p} `, g.set_position(-1);
          }
        },
        Widget.Box([
          Widget.Label({
            class_name: "name",
            label: `:${p}`
          }),
          Widget.Label({
            hexpand: !0,
            hpack: "end",
            class_name: "description",
            label: y
          })
        ])
      )
    );
  }
  const u = Widget.Revealer({
    child: Widget.Box(
      { vertical: !0 },
      c("sh", "run a binary"),
      xo ? c("nx", s.launcher.nix.pkgs.bind().as(
        (p) => `run a nix package from ${p}`
      )) : Widget.Box()
    )
  }), g = Widget.Entry({
    hexpand: !0,
    primary_icon_name: l.ui.search,
    on_accept: ({ text: p }) => {
      p?.startsWith(":nx") ? o.run(p.substring(3)) : p?.startsWith(":sh") ? i.run(p.substring(3)) : t.launchFirst(), App.toggleWindow("launcher"), g.text = "";
    },
    on_change: ({ text: p }) => {
      p ||= "", e.reveal_child = p === "", u.reveal_child = p.split(" ").length === 1 && p?.startsWith(":"), p?.startsWith(":nx") ? o.filter(p.substring(3)) : o.filter(""), p?.startsWith(":sh") ? i.filter(p.substring(3)) : i.filter(""), p?.startsWith(":") || t.filter(p);
    }
  });
  function x() {
    g.text = "Search", g.set_position(-1), g.select_region(0, -1), g.grab_focus(), e.reveal_child = !0;
  }
  const E = Widget.Box({
    css: _o.bind().as((p) => `min-width: ${p}pt;`),
    class_name: "launcher",
    vertical: !0,
    vpack: "start",
    setup: (p) => p.hook(App, (y, $, ee) => {
      $ === "launcher" && (g.text = "", ee && x());
    }),
    children: [
      Widget.Box([g, r, n]),
      e,
      u,
      t,
      o,
      i
    ]
  });
  return Widget.Box(
    { vertical: !0, css: "padding: 1px" },
    f("applauncher", {
      css: Wo.bind().as((p) => `min-height: ${p}pt;`),
      vexpand: !1
    }),
    E
  );
}
const $o = () => ne({
  name: "launcher",
  layout: "top",
  child: ko()
});
function Bo(e, t = "%H:%M") {
  return K.DateTime.new_from_unix_local(e).format(t);
}
function So({ app_entry: e, app_icon: t, image: i }) {
  if (i)
    return Widget.Box({
      vpack: "start",
      hexpand: !1,
      class_name: "icon img",
      css: `
                background-image: url("${i}");
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                min-width: 78px;
                min-height: 78px;
            `
    });
  let n = l.fallback.notification;
  return Utils.lookUpIcon(t) && (n = t), Utils.lookUpIcon(e || "") && (n = e || ""), Widget.Box({
    vpack: "start",
    hexpand: !1,
    class_name: "icon",
    css: `
            min-width: 78px;
            min-height: 78px;
        `,
    child: Widget.Icon({
      icon: n,
      size: 58,
      hpack: "center",
      hexpand: !0,
      vpack: "center",
      vexpand: !0
    })
  });
}
const mi = (e) => {
  const t = Widget.Box({
    class_name: "content",
    children: [
      So(e),
      Widget.Box({
        hexpand: !0,
        vertical: !0,
        children: [
          Widget.Box({
            children: [
              Widget.Label({
                class_name: "title",
                xalign: 0,
                justification: "left",
                hexpand: !0,
                max_width_chars: 24,
                truncate: "end",
                wrap: !0,
                label: e.summary.trim(),
                use_markup: !0
              }),
              Widget.Label({
                class_name: "time",
                vpack: "start",
                label: Bo(e.time)
              }),
              Widget.Button({
                class_name: "close-button",
                vpack: "start",
                child: Widget.Icon("window-close-symbolic"),
                on_clicked: e.close
              })
            ]
          }),
          Widget.Label({
            class_name: "description",
            hexpand: !0,
            use_markup: !0,
            xalign: 0,
            justification: "left",
            label: e.body.trim(),
            max_width_chars: 24,
            wrap: !0
          })
        ]
      })
    ]
  }), i = e.actions.length > 0 ? Widget.Revealer({
    transition: "slide_down",
    child: Widget.EventBox({
      child: Widget.Box({
        class_name: "actions horizontal",
        children: e.actions.map((o) => Widget.Button({
          class_name: "action-button",
          on_clicked: () => e.invoke(o.id),
          hexpand: !0,
          child: Widget.Label(o.label)
        }))
      })
    })
  }) : null, n = Widget.EventBox({
    vexpand: !1,
    on_primary_click: e.dismiss,
    on_hover() {
      i && (i.reveal_child = !0);
    },
    on_hover_lost() {
      i && (i.reveal_child = !0), e.dismiss();
    },
    child: Widget.Box({
      vertical: !0,
      children: i ? [t, i] : [t]
    })
  });
  return Widget.Box({
    class_name: `notification ${e.urgency}`,
    child: n
  });
}, de = await Service.import("notifications"), { transition: ce } = s, { position: Io } = s.notifications, { timeout: Re, idle: Ao } = Utils;
function Uo(e) {
  const t = de.getNotification(e), i = mi(t), n = Widget.Revealer({
    transition: "slide_left",
    transition_duration: ce.value,
    child: i
  }), o = Widget.Revealer({
    transition: "slide_down",
    transition_duration: ce.value,
    child: n
  }), r = Widget.Box({
    hpack: "end",
    child: o
  });
  return Ao(() => {
    o.reveal_child = !0, Re(ce.value, () => {
      n.reveal_child = !0;
    });
  }), Object.assign(r, {
    dismiss() {
      n.reveal_child = !1, Re(ce.value, () => {
        o.reveal_child = !1, Re(ce.value, () => {
          r.destroy();
        });
      });
    }
  });
}
function Co() {
  const e = /* @__PURE__ */ new Map(), t = Widget.Box({
    hpack: "end",
    vertical: !0,
    css: s.notifications.width.bind().as((n) => `min-width: ${n}px;`)
  });
  function i(n, o) {
    e.get(o)?.dismiss(), e.delete(o);
  }
  return t.hook(de, (n, o) => {
    if (o !== void 0) {
      if (e.has(o) && i(null, o), de.dnd)
        return;
      const r = Uo(o);
      e.set(o, r), t.children = [r, ...t.children];
    }
  }, "notified").hook(de, i, "dismissed").hook(de, i, "closed");
}
const No = (e) => Widget.Window({
  monitor: e,
  name: `notifications${e}`,
  anchor: Io.bind(),
  class_name: "notifications",
  child: Widget.Box({
    css: "padding: 2px;",
    child: Co()
  })
});
W("brightnessctl") || App.quit();
const le = (e) => Number(Utils.exec(`brightnessctl ${e}`)), Lo = await R`ls -w1 /sys/class/backlight | head -1`, fe = await R`ls -w1 /sys/class/leds | head -1`;
let Mo = class extends Service {
  static {
    Service.register(this, {}, {
      screen: ["float", "rw"],
      kbd: ["int", "rw"]
    });
  }
  #e = le(`--device ${fe} max`);
  #t = le(`--device ${fe} get`);
  #i = le("max");
  #n = le("get") / (le("max") || 1);
  get kbd() {
    return this.#t;
  }
  get screen() {
    return this.#n;
  }
  set kbd(t) {
    t < 0 || t > this.#e || m(`brightnessctl -d ${fe} s ${t} -q`).then(() => {
      this.#t = t, this.changed("kbd");
    });
  }
  set screen(t) {
    t < 0 && (t = 0), t > 1 && (t = 1), m(`brightnessctl set ${Math.floor(t * 100)}% -q`).then(() => {
      this.#n = t, this.changed("screen");
    });
  }
  constructor() {
    super();
    const t = `/sys/class/backlight/${Lo}/brightness`, i = `/sys/class/leds/${fe}/brightness`;
    Utils.monitorFile(t, async (n) => {
      const o = await Utils.readFileAsync(n);
      this.#n = Number(o) / this.#i, this.changed("screen");
    }), Utils.monitorFile(i, async (n) => {
      const o = await Utils.readFileAsync(n);
      this.#t = Number(o) / this.#e, this.changed("kbd");
    });
  }
};
const V = new Mo(), Oo = ({
  height: e = 18,
  width: t = 180,
  vertical: i = !1,
  child: n
}) => {
  const o = Widget.Box({
    class_name: "fill",
    hexpand: i,
    vexpand: !i,
    hpack: i ? "fill" : "start",
    vpack: i ? "end" : "fill",
    child: n
  }), r = Widget.Box({
    class_name: "progress",
    child: o,
    css: `
            min-width: ${t}px;
            min-height: ${e}px;
        `
  });
  let c = 0, u = [];
  return Object.assign(r, {
    setValue(g) {
      if (g < 0)
        return;
      if (u.length > 0) {
        for (const Ie of u)
          Y.source_remove(Ie);
        u = [];
      }
      const x = i ? "height" : "width", E = i ? e : t, p = i ? t : e, y = (E - p) * g + p;
      if (!c) {
        c = y, o.css = `min-${x}: ${y}px;`;
        return;
      }
      const $ = s.transition.value / 10, Bi = (y - c) / $;
      u = $e($, 0).map((Ie) => Utils.timeout(5 * Ie, () => {
        c += Bi, o.css = `min-${x}: ${c}px`, u.shift();
      }));
    }
  });
}, Q = await Service.import("audio"), { progress: De, microphone: At } = s.osd, bi = 2500;
function Po(e) {
  const t = Widget.Icon({
    size: 42,
    vpack: "start"
  }), i = Oo({
    vertical: e,
    width: e ? 42 : 300,
    height: e ? 300 : 42,
    child: t
  }), n = Widget.Revealer({
    transition: "slide_left",
    child: i
  });
  let o = 0;
  function r(c, u) {
    n.reveal_child = !0, t.icon = u, i.setValue(c), o++, Utils.timeout(bi, () => {
      o--, o === 0 && (n.reveal_child = !1);
    });
  }
  return n.hook(V, () => r(
    V.screen,
    l.brightness.screen
  ), "notify::screen").hook(V, () => r(
    V.kbd,
    l.brightness.keyboard
  ), "notify::kbd").hook(Q.speaker, () => r(
    Q.speaker.volume,
    D(Q.speaker.icon_name || "", l.audio.type.speaker)
  ), "notify::volume");
}
function zo() {
  const e = Widget.Icon({
    class_name: "microphone"
  }), t = Widget.Revealer({
    transition: "slide_up",
    child: e
  });
  let i = 0, n = Q.microphone.stream?.is_muted ?? !1;
  return t.hook(Q.microphone, () => Utils.idle(() => {
    n !== Q.microphone.stream?.is_muted && (n = Q.microphone.stream.is_muted, e.icon = l.audio.mic[n ? "muted" : "high"], t.reveal_child = !0, i++, Utils.timeout(bi, () => {
      i--, i === 0 && (t.reveal_child = !1);
    }));
  }));
}
const To = (e) => Widget.Window({
  monitor: e,
  name: `indicator${e}`,
  class_name: "indicator",
  layer: "overlay",
  click_through: !0,
  anchor: ["right", "left", "top", "bottom"],
  child: Widget.Box({
    css: "padding: 2px;",
    expand: !0,
    child: Widget.Overlay(
      { child: Widget.Box({ expand: !0 }) },
      Widget.Box({
        hpack: De.pack.h.bind(),
        vpack: De.pack.v.bind(),
        child: De.vertical.bind().as(Po)
      }),
      Widget.Box({
        hpack: At.pack.h.bind(),
        vpack: At.pack.v.bind(),
        child: zo()
      })
    )
  })
}), Ro = s.overview.monochromeIcon, Do = [Z.TargetEntry.new("text/plain", Z.TargetFlags.SAME_APP, 0)], Eo = await Service.import("hyprland"), jo = await Service.import("applications"), Ut = (e) => Eo.messageAsync(`dispatch ${e}`), Fo = ({ address: e, size: [t, i], class: n, title: o }) => Widget.Button({
  class_name: "client",
  attribute: { address: e },
  tooltip_text: `${o}`,
  child: Widget.Icon({
    css: s.overview.scale.bind().as((r) => `
            min-width: ${r / 100 * t}px;
            min-height: ${r / 100 * i}px;
        `),
    icon: Ro.bind().as((r) => {
      const c = jo.list.find((u) => u.match(n));
      return c ? D(
        c.icon_name + (r ? "-symbolic" : ""),
        l.fallback.executable + (r ? "-symbolic" : "")
      ) : l.fallback.executable + (r ? "-symbolic" : "");
    })
  }),
  on_secondary_click: () => Ut(`closewindow address:${e}`),
  on_clicked: () => {
    Ut(`focuswindow address:${e}`), App.closeWindow("overview");
  },
  setup: (r) => r.on("drag-data-get", (c, u, g) => g.set_text(e, e.length)).on("drag-begin", (c, u) => {
    Z.drag_set_icon_surface(u, Ni(r)), r.toggleClassName("hidden", !0);
  }).on("drag-end", () => r.toggleClassName("hidden", !1)).drag_source_set(L.ModifierType.BUTTON1_MASK, Do, L.DragAction.COPY)
}), Ho = [Z.TargetEntry.new("text/plain", Z.TargetFlags.SAME_APP, 0)], Ct = (e) => s.overview.scale.value / 100 * e, M = await Service.import("hyprland"), Nt = (e) => M.messageAsync(`dispatch ${e}`);
function Lt(e) {
  const t = { h: 1080, w: 1920 }, i = M.getWorkspace(e);
  if (!i)
    return t;
  const n = M.getMonitor(i.monitorID);
  return n ? { h: n.height, w: n.width } : t;
}
const Ee = (e) => {
  const t = Widget.Fixed();
  async function i() {
    const n = await M.messageAsync("j/clients").catch(() => null);
    if (!n)
      return;
    t.get_children().forEach((r) => r.destroy()), JSON.parse(n).filter(({ workspace: r }) => r.id === e).forEach((r) => {
      const c = r.at[0] - (M.getMonitor(r.monitor)?.x || 0), u = r.at[1] - (M.getMonitor(r.monitor)?.y || 0);
      r.mapped && t.put(Fo(r), Ct(c), Ct(u));
    }), t.show_all();
  }
  return Widget.Box({
    attribute: { id: e },
    tooltipText: `${e}`,
    class_name: "workspace",
    vpack: "center",
    css: s.overview.scale.bind().as((n) => `
            min-width: ${n / 100 * Lt(e).w}px;
            min-height: ${n / 100 * Lt(e).h}px;
        `),
    setup(n) {
      n.hook(s.overview.scale, i), n.hook(M, i, "notify::clients"), n.hook(M.active.client, i), n.hook(M.active.workspace, () => {
        n.toggleClassName("active", M.active.workspace.id === e);
      });
    },
    child: Widget.EventBox({
      expand: !0,
      on_primary_click: () => {
        App.closeWindow("overview"), Nt(`workspace ${e}`);
      },
      setup: (n) => {
        n.drag_dest_set(Z.DestDefaults.ALL, Ho, L.DragAction.COPY), n.connect("drag-data-received", (o, r, c, u, g) => {
          const x = new TextDecoder().decode(g.get_data());
          Nt(`movetoworkspacesilent ${e},address:${x}`);
        });
      },
      child: t
    })
  });
}, je = await Service.import("hyprland");
function qo(e) {
  return Widget.Box({
    class_name: "overview horizontal",
    children: e > 0 ? $e(e).map(Ee) : je.workspaces.map(({ id: t }) => Ee(t)).sort((t, i) => t.attribute.id - i.attribute.id),
    setup: (t) => {
      e > 0 || (t.hook(je, (i, n) => {
        n !== void 0 && (i.children = i.children.filter((o) => o.attribute.id !== Number(n)));
      }, "workspace-removed"), t.hook(je, (i, n) => {
        n !== void 0 && (i.children = [...i.children, Ee(Number(n))].sort((o, r) => o.attribute.id - r.attribute.id));
      }, "workspace-added"));
    }
  });
}
const Vo = () => ne({
  name: "overview",
  layout: "center",
  child: s.overview.workspaces.bind().as(qo)
}), { sleep: Go, reboot: Jo, logout: Qo, shutdown: Xo } = s.powermenu;
let Yo = class extends Service {
  static {
    Service.register(this, {}, {
      title: ["string"],
      cmd: ["string"]
    });
  }
  #e = "";
  #t = "";
  get title() {
    return this.#e;
  }
  action(t) {
    [this.#t, this.#e] = {
      sleep: [Go.value, "Sleep"],
      reboot: [Jo.value, "Reboot"],
      logout: [Qo.value, "Log Out"],
      shutdown: [Xo.value, "Shutdown"]
    }[t], this.notify("cmd"), this.notify("title"), this.emit("changed"), App.closeWindow("powermenu"), App.openWindow("verification");
  }
  shutdown = () => {
    this.action("shutdown");
  };
  exec = () => {
    App.closeWindow("verification"), Utils.exec(this.#t);
  };
};
const ge = new Yo();
Object.assign(globalThis, { powermenu: ge });
const { layout: ve, labels: Ko } = s.powermenu;
function F(e, t) {
  return Widget.Button({
    on_clicked: () => ge.action(e),
    child: Widget.Box({
      vertical: !0,
      class_name: "system-button",
      children: [
        Widget.Icon(l.powermenu[e]),
        Widget.Label({
          label: t,
          visible: Ko.bind()
        })
      ]
    })
  });
}
const Zo = () => ne({
  name: "powermenu",
  transition: "crossfade",
  child: Widget.Box({
    class_name: "powermenu horizontal",
    setup: (e) => e.hook(ve, () => {
      e.toggleClassName("box", ve.value === "box"), e.toggleClassName("line", ve.value === "line");
    }),
    children: ve.bind().as((e) => {
      switch (e) {
        case "line":
          return [
            F("shutdown", "Shutdown"),
            F("logout", "Log Out"),
            F("reboot", "Reboot"),
            F("sleep", "Sleep")
          ];
        case "box":
          return [
            Widget.Box(
              { vertical: !0 },
              F("shutdown", "Shutdown"),
              F("logout", "Log Out")
            ),
            Widget.Box(
              { vertical: !0 },
              F("reboot", "Reboot"),
              F("sleep", "Sleep")
            )
          ];
      }
    })
  })
}), { corners: Mt, transparent: Ot } = s.bar, er = (e) => Widget.Window({
  monitor: e,
  name: `corner${e}`,
  class_name: "screen-corner",
  anchor: ["top", "bottom", "right", "left"],
  click_through: !0,
  child: Widget.Box({
    class_name: "shadow",
    child: Widget.Box({
      class_name: "border",
      expand: !0,
      child: Widget.Box({
        class_name: "corner",
        expand: !0
      })
    })
  }),
  setup: (t) => t.hook(Mt, () => {
    t.toggleClassName("corners", Mt.value);
  }).hook(Ot, () => {
    t.toggleClassName("hidden", Ot.value);
  })
}), tr = Widget.subclass(Z.Window);
function ir(e, t) {
  const i = Widget.Label({ label: e.bind().as((c) => `${c}`) }), n = (c) => {
    const u = t.findIndex((g) => g === i.label);
    e.setValue(
      c > 0 ? u + c > t.length - 1 ? t[0] : t[u + c] : u + c < 0 ? t[t.length - 1] : t[u + c]
    );
  }, o = Widget.Button({
    child: Widget.Icon(l.ui.arrow.right),
    on_clicked: () => n(1)
  }), r = Widget.Button({
    child: Widget.Icon(l.ui.arrow.left),
    on_clicked: () => n(-1)
  });
  return Widget.Box({
    class_name: "enum-setter",
    children: [i, r, o]
  });
}
function nr({
  opt: e,
  type: t = typeof e.value,
  enums: i,
  max: n = 1e3,
  min: o = 0
}) {
  switch (t) {
    case "number":
      return Widget.SpinButton({
        setup(r) {
          r.set_range(o, n), r.set_increments(1, 5), r.on("value-changed", () => e.value = r.value), r.hook(e, () => r.value = e.value);
        }
      });
    case "float":
    case "object":
      return Widget.Entry({
        on_accept: (r) => e.value = JSON.parse(r.text || ""),
        setup: (r) => r.hook(e, () => r.text = JSON.stringify(e.value))
      });
    case "string":
      return Widget.Entry({
        on_accept: (r) => e.value = r.text,
        setup: (r) => r.hook(e, () => r.text = e.value)
      });
    case "enum":
      return ir(e, i);
    case "boolean":
      return Widget.Switch().on("notify::active", (r) => e.value = r.active).hook(e, (r) => r.active = e.value);
    case "img":
      return Widget.FileChooserButton({
        on_file_set: ({ uri: r }) => {
          e.value = r.replace("file://", "");
        }
      });
    case "font":
      return Widget.FontButton({
        show_size: !1,
        use_size: !1,
        setup: (r) => r.hook(e, () => r.font = e.value).on("font-set", ({ font: c }) => e.value = c.split(" ").slice(0, -1).join(" "))
      });
    case "color":
      return Widget.ColorButton().hook(e, (r) => {
        const c = new L.RGBA();
        c.parse(e.value), r.rgba = c;
      }).on("color-set", ({ rgba: { red: r, green: c, blue: u } }) => {
        const g = (x) => {
          const E = Math.floor(255 * x).toString(16);
          return E.length === 1 ? `0${E}` : E;
        };
        e.value = `#${g(r)}${g(c)}${g(u)}`;
      });
    default:
      return Widget.Label({
        label: `no setter with type ${t}`
      });
  }
}
const d = (e) => Widget.Box(
  {
    attribute: { opt: e.opt },
    class_name: "row",
    tooltip_text: e.note ? `note: ${e.note}` : ""
  },
  Widget.Box(
    { vertical: !0, vpack: "center" },
    Widget.Label({
      xalign: 0,
      class_name: "row-title",
      label: e.title
    }),
    Widget.Label({
      xalign: 0,
      class_name: "id",
      label: e.opt.id
    })
  ),
  Widget.Box({ hexpand: !0 }),
  Widget.Box(
    { vpack: "center" },
    nr(e)
  ),
  Widget.Button({
    vpack: "center",
    class_name: "reset",
    child: Widget.Icon(l.ui.refresh),
    on_clicked: () => e.opt.reset(),
    sensitive: e.opt.bind().as((t) => t !== e.opt.initial)
  })
), v = (e, ...t) => Widget.Box(
  {
    class_name: "group",
    vertical: !0
  },
  Widget.Box([
    Widget.Label({
      hpack: "start",
      vpack: "end",
      class_name: "group-title",
      label: e,
      setup: (i) => Utils.idle(() => i.visible = !!e)
    }),
    e ? Widget.Button({
      hexpand: !0,
      hpack: "end",
      child: Widget.Icon(l.ui.refresh),
      class_name: "group-reset",
      sensitive: Utils.merge(
        t.map(({ attribute: { opt: i } }) => i.bind().as((n) => n !== i.initial)),
        (...i) => i.some((n) => n)
      ),
      on_clicked: () => t.forEach((i) => i.attribute.opt.reset())
    }) : Widget.Box()
  ]),
  Widget.Box({
    vertical: !0,
    children: t
  })
), Fe = (e, t, ...i) => Widget.Box({
  class_name: "page",
  attribute: { name: e, icon: t },
  child: Widget.Scrollable({
    css: "min-height: 300px;",
    child: Widget.Box({
      class_name: "page-content",
      vexpand: !0,
      vertical: !0,
      children: i
    })
  })
}), or = () => Widget.Box(
  { class_name: "row wallpaper" },
  Widget.Box(
    { vertical: !0 },
    Widget.Label({
      xalign: 0,
      class_name: "row-title",
      label: "Wallpaper",
      vpack: "start"
    }),
    Widget.Button({
      on_clicked: pe.random,
      label: "Random"
    }),
    Widget.FileChooserButton({
      on_file_set: ({ uri: e }) => pe.set(e.replace("file://", ""))
    })
  ),
  Widget.Box({ hexpand: !0 }),
  Widget.Box({
    class_name: "preview",
    css: pe.bind("wallpaper").as((e) => `
            min-height: 120px;
            min-width: 200px;
            background-image: url('${e}');
            background-size: cover;
        `)
  })
), {
  autotheme: rr,
  font: Pt,
  theme: ar,
  bar: b,
  launcher: He,
  overview: qe,
  powermenu: zt,
  quicksettings: ye,
  osd: Ve,
  hyprland: Tt
} = s, {
  dark: H,
  light: q,
  blur: sr,
  scheme: cr,
  padding: lr,
  spacing: dr,
  radius: ur,
  shadows: pr,
  widget: gr,
  border: Rt
} = ar, tt = [
  Fe("Theme", l.ui.themes, v("", or(), d({ opt: rr, title: "Auto Generate Color Scheme" }), d({ opt: cr, title: "Color Scheme", type: "enum", enums: ["dark", "light"] })), v("Dark Colors", d({ opt: H.bg, title: "Background", type: "color" }), d({ opt: H.fg, title: "Foreground", type: "color" }), d({ opt: H.primary.bg, title: "Primary", type: "color" }), d({ opt: H.primary.fg, title: "On Primary", type: "color" }), d({ opt: H.error.bg, title: "Error", type: "color" }), d({ opt: H.error.fg, title: "On Error", type: "color" }), d({ opt: H.widget, title: "Widget", type: "color" }), d({ opt: H.border, title: "Border", type: "color" })), v("Light Colors", d({ opt: q.bg, title: "Background", type: "color" }), d({ opt: q.fg, title: "Foreground", type: "color" }), d({ opt: q.primary.bg, title: "Primary", type: "color" }), d({ opt: q.primary.fg, title: "On Primary", type: "color" }), d({ opt: q.error.bg, title: "Error", type: "color" }), d({ opt: q.error.fg, title: "On Error", type: "color" }), d({ opt: q.widget, title: "Widget", type: "color" }), d({ opt: q.border, title: "Border", type: "color" })), v("Theme", d({ opt: pr, title: "Shadows" }), d({ opt: gr.opacity, title: "Widget Opacity", max: 100 }), d({ opt: Rt.opacity, title: "Border Opacity", max: 100 }), d({ opt: Rt.width, title: "Border Width" }), d({ opt: sr, title: "Blur", note: "0 to disable", max: 70 })), v("UI", d({ opt: lr, title: "Padding" }), d({ opt: dr, title: "Spacing" }), d({ opt: ur, title: "Roundness" }), d({ opt: Pt.size, title: "Font Size" }), d({ opt: Pt.name, title: "Font Name", type: "font" }))),
  Fe("Bar", l.ui.toolbars, v("General", d({ opt: b.transparent, title: "Transparent Bar", note: "Works best on empty-ish wallpapers" }), d({ opt: b.flatButtons, title: "Flat Buttons" }), d({ opt: b.position, title: "Position", type: "enum", enums: ["top", "bottom"] }), d({ opt: b.corners, title: "Corners" })), v("Launcher", d({ opt: b.launcher.icon.icon, title: "Icon" }), d({ opt: b.launcher.icon.colored, title: "Colored Icon" }), d({ opt: b.launcher.label.label, title: "Label" }), d({ opt: b.launcher.label.colored, title: "Colored Label" })), v("Workspaces", d({ opt: b.workspaces.workspaces, title: "Number of Workspaces", note: "0 to make it dynamic" })), v("Taskbar", d({ opt: b.taskbar.iconSize, title: "Icon Size" }), d({ opt: b.taskbar.monochrome, title: "Monochrome" }), d({ opt: b.taskbar.exclusive, title: "Exclusive to workspaces" })), v("Date", d({ opt: b.date.format, title: "Date Format" })), v("Media", d({ opt: b.media.monochrome, title: "Monochrome" }), d({ opt: b.media.preferred, title: "Preferred Player" }), d({ opt: b.media.direction, title: "Slide Direction", type: "enum", enums: ["left", "right"] }), d({ opt: b.media.format, title: "Format of the Label" }), d({ opt: b.media.length, title: "Max Length of Label" })), v("Battery", d({ opt: b.battery.bar, title: "Style", type: "enum", enums: ["hidden", "regular", "whole"] }), d({ opt: b.battery.blocks, title: "Number of Blocks" }), d({ opt: b.battery.width, title: "Width of Bar" }), d({ opt: b.battery.charging, title: "Charging Color", type: "color" })), v("Powermenu", d({ opt: b.powermenu.monochrome, title: "Monochrome" }))),
  Fe("General", l.ui.settings, v("Hyprland", d({ opt: Tt.gapsWhenOnly, title: "Gaps When Only" }), d({ opt: Tt.inactiveBorder, type: "color", title: "Inactive Border Color" })), v("Launcher", d({ opt: He.width, title: "Width" }), d({ opt: He.apps.iconSize, title: "Icon Size" }), d({ opt: He.apps.max, title: "Max Items" })), v("Overview", d({ opt: qe.scale, title: "Scale", max: 100 }), d({ opt: qe.workspaces, title: "Workspaces", max: 11, note: "set this to 0 to make it dynamic" }), d({ opt: qe.monochromeIcon, title: "Monochrome Icons" })), v("Powermenu", d({ opt: zt.layout, title: "Layout", type: "enum", enums: ["box", "line"] }), d({ opt: zt.labels, title: "Show Labels" })), v("Quicksettings", d({ opt: ye.avatar.image, title: "Avatar", type: "img" }), d({ opt: ye.avatar.size, title: "Avatar Size" }), d({ opt: ye.media.monochromeIcon, title: "Media Monochrome Icons" }), d({ opt: ye.media.coverSize, title: "Media Cover Art Size" })), v("On Screen Indicator", d({ opt: Ve.progress.vertical, title: "Vertical" }), d({ opt: Ve.progress.pack.h, title: "Horizontal Alignment", type: "enum", enums: ["start", "center", "end"] }), d({ opt: Ve.progress.pack.v, title: "Vertical Alignment", type: "enum", enums: ["start", "center", "end"] })))
], Xe = Variable(tt[0].attribute.name);
function hr() {
  return Widget.CenterBox({
    class_name: "header",
    start_widget: Widget.Button({
      class_name: "reset",
      on_clicked: s.reset,
      hpack: "start",
      vpack: "start",
      child: Widget.Icon(l.ui.refresh),
      tooltip_text: "Reset"
    }),
    center_widget: Widget.Box({
      class_name: "pager horizontal",
      children: tt.map(({ attribute: { name: e, icon: t } }) => Widget.Button({
        xalign: 0,
        class_name: Xe.bind().as((i) => `${i === e ? "active" : ""}`),
        on_clicked: () => Xe.value = e,
        child: Widget.Box([
          Widget.Icon(t),
          Widget.Label(e)
        ])
      }))
    }),
    end_widget: Widget.Button({
      class_name: "close",
      hpack: "end",
      vpack: "start",
      child: Widget.Icon(l.ui.close),
      on_clicked: () => App.closeWindow("settings-dialog")
    })
  });
}
function mr() {
  return Widget.Stack({
    transition: "slide_left_right",
    children: tt.reduce((e, t) => ({ ...e, [t.attribute.name]: t }), {}),
    shown: Xe.bind()
  });
}
const br = () => tr({
  name: "settings-dialog",
  class_name: "settings-dialog",
  title: "Settings",
  setup(e) {
    e.on("delete-event", () => (e.hide(), !0)), e.set_default_size(500, 600);
  },
  child: Widget.Box({
    vertical: !0,
    children: [
      hr(),
      mr()
    ]
  })
}), fr = () => ne({
  name: "verification",
  transition: "crossfade",
  child: Widget.Box({
    class_name: "verification",
    vertical: !0,
    children: [
      Widget.Box({
        class_name: "text-box",
        vertical: !0,
        children: [
          Widget.Label({
            class_name: "title",
            label: ge.bind("title")
          }),
          Widget.Label({
            class_name: "desc",
            label: "Are you sure?"
          })
        ]
      }),
      Widget.Box({
        class_name: "buttons horizontal",
        vexpand: !0,
        vpack: "end",
        homogeneous: !0,
        children: [
          Widget.Button({
            child: Widget.Label("No"),
            on_clicked: () => App.toggleWindow("verification"),
            setup: (e) => e.hook(App, (t, i, n) => {
              i === "verification" && n && e.grab_focus();
            })
          }),
          Widget.Button({
            child: Widget.Label("Yes"),
            on_clicked: ge.exec
          })
        ]
      })
    ]
  })
}), P = Variable("");
App.connect("window-toggled", (e, t, i) => {
  t === "quicksettings" && !i && Utils.timeout(500, () => P.value = "");
});
function Ye(e, t) {
  let i = 0, n = !1;
  const o = Widget.Icon(l.ui.arrow.right).hook(P, () => {
    if (P.value === e && !n || P.value !== e && n) {
      const r = P.value === e ? 10 : -10;
      n = !n;
      for (let c = 0; c < 9; ++c)
        Utils.timeout(15 * c, () => {
          i += r, o.setCss(`-gtk-icon-transform: rotate(${i}deg);`);
        });
    }
  });
  return Widget.Button({
    child: o,
    class_name: "arrow",
    on_clicked: () => {
      P.value = P.value === e ? "" : e, typeof t == "function" && t();
    }
  });
}
function Se({
  name: e,
  icon: t,
  label: i,
  activate: n,
  deactivate: o,
  activateOnArrow: r = !0,
  connection: [c, u]
}) {
  return Widget.Box({
    class_name: "toggle-button",
    setup: (g) => g.hook(c, () => {
      g.toggleClassName("active", u());
    }),
    children: [
      Widget.Button({
        child: Widget.Box({
          hexpand: !0,
          children: [
            Widget.Icon({
              class_name: "icon",
              icon: t
            }),
            Widget.Label({
              class_name: "label",
              max_width_chars: 10,
              truncate: "end",
              label: i
            })
          ]
        }),
        on_clicked: () => {
          u() ? (o(), P.value === e && (P.value = "")) : n();
        }
      }),
      Ye(e, r && n)
    ]
  });
}
function oe({ name: e, icon: t, title: i, content: n }) {
  return Widget.Revealer({
    transition: "slide_down",
    reveal_child: P.bind().as((o) => o === e),
    child: Widget.Box({
      class_names: ["menu", e],
      vertical: !0,
      children: [
        Widget.Box({
          class_name: "title-box",
          children: [
            Widget.Icon({
              class_name: "icon",
              icon: t
            }),
            Widget.Label({
              class_name: "title",
              truncate: "end",
              label: i
            })
          ]
        }),
        Widget.Separator(),
        Widget.Box({
          vertical: !0,
          class_name: "content vertical",
          children: n
        })
      ]
    })
  });
}
function it({
  icon: e,
  label: t,
  toggle: i,
  connection: [n, o]
}) {
  return Widget.Button({
    on_clicked: i,
    class_name: "simple-toggle",
    setup: (r) => r.hook(n, () => {
      r.toggleClassName("active", o());
    }),
    child: Widget.Box([
      Widget.Icon({ icon: e }),
      Widget.Label({
        max_width_chars: 10,
        truncate: "end",
        label: t
      })
    ])
  });
}
const Ke = _.bind("profile");
function vr() {
  return Se({
    name: "asusctl-profile",
    icon: Ke.as((e) => l.asusctl.profile[e]),
    label: Ke,
    connection: [_, () => _.profile !== "Balanced"],
    activate: () => _.setProfile("Quiet"),
    deactivate: () => _.setProfile("Balanced"),
    activateOnArrow: !1
  });
}
function yr() {
  return oe({
    name: "asusctl-profile",
    icon: Ke.as((e) => l.asusctl.profile[e]),
    title: "Profile Selector",
    content: [
      Widget.Box({
        vertical: !0,
        hexpand: !0,
        children: [
          Widget.Box({
            vertical: !0,
            children: _.profiles.map((e) => Widget.Button({
              on_clicked: () => _.setProfile(e),
              child: Widget.Box({
                children: [
                  Widget.Icon(l.asusctl.profile[e]),
                  Widget.Label(e)
                ]
              })
            }))
          })
        ]
      }),
      Widget.Separator(),
      Widget.Button({
        on_clicked: () => Utils.execAsync("rog-control-center"),
        child: Widget.Box({
          children: [
            Widget.Icon(l.ui.settings),
            Widget.Label("Rog Control Center")
          ]
        })
      })
    ]
  });
}
const X = await Service.import("powerprofiles"), Ze = X.bind("active_profile"), xe = X.profiles.map((e) => e.Profile);
function fi(e) {
  return e.split("-").map((t) => `${t.at(0)?.toUpperCase()}${t.slice(1)}`).join(" ");
}
function wr() {
  return Se({
    name: "asusctl-profile",
    icon: Ze.as((e) => l.powerprofile[e]),
    label: Ze.as(fi),
    connection: [X, () => X.active_profile !== xe[1]],
    activate: () => X.active_profile = xe[0],
    deactivate: () => X.active_profile = xe[1],
    activateOnArrow: !1
  });
}
function _r() {
  return oe({
    name: "asusctl-profile",
    icon: Ze.as((e) => l.powerprofile[e]),
    title: "Profile Selector",
    content: [Widget.Box({
      vertical: !0,
      hexpand: !0,
      child: Widget.Box({
        vertical: !0,
        children: xe.map((e) => Widget.Button({
          on_clicked: () => X.active_profile = e,
          child: Widget.Box({
            children: [
              Widget.Icon(l.powerprofile[e]),
              Widget.Label(fi(e))
            ]
          })
        }))
      })
    })]
  });
}
const Wr = _.available ? vr : wr, xr = _.available ? yr : _r, Ge = await Service.import("battery"), { image: kr, size: $r } = s.quicksettings.avatar;
function Br(e) {
  const t = Math.floor(e / 60), i = Math.floor(e % 60);
  return `${t}h ${i < 10 ? `0${i}` : i}m`;
}
function Sr() {
  return Widget.Box({
    class_name: "avatar",
    css: Utils.merge([kr.bind(), $r.bind()], (e, t) => `
        min-width: ${t}px;
        min-height: ${t}px;
        background-image: url('${e}');
        background-size: cover;
    `)
  });
}
function Dt(e) {
  return Widget.Button({
    vpack: "center",
    child: Widget.Icon(l.powermenu[e]),
    on_clicked: () => ge.action(e)
  });
}
function Ir() {
  return Widget.Box(
    { class_name: "header horizontal" },
    Sr(),
    Widget.Box({
      vertical: !0,
      vpack: "center",
      children: [
        Widget.Box({
          visible: Ge.bind("available"),
          children: [
            Widget.Icon({ icon: Ge.bind("icon_name") }),
            Widget.Label({ label: Ge.bind("percent").as((e) => `${e}%`) })
          ]
        }),
        Widget.Box([
          Widget.Icon({ icon: l.ui.time }),
          Widget.Label({ label: Yt.bind().as(Br) })
        ])
      ]
    }),
    Widget.Box({ hexpand: !0 }),
    Widget.Button({
      vpack: "center",
      child: Widget.Icon(l.ui.settings),
      on_clicked: () => {
        App.closeWindow("quicksettings"), App.closeWindow("settings-dialog"), App.openWindow("settings-dialog");
      }
    }),
    Dt("logout"),
    Dt("shutdown")
  );
}
const A = await Service.import("audio");
function vi(e = "speaker") {
  return Widget.Button({
    vpack: "center",
    on_clicked: () => A[e].is_muted = !A[e].is_muted,
    child: Widget.Icon({
      icon: A[e].bind("icon_name").as((t) => D(t || "", l.audio.mic.high)),
      tooltipText: A[e].bind("volume").as((t) => `Volume: ${Math.floor(t * 100)}%`)
    })
  });
}
function yi(e = "speaker") {
  return Widget.Slider({
    hexpand: !0,
    draw_value: !1,
    on_change: ({ value: t, dragging: i }) => {
      i && (A[e].volume = t, A[e].is_muted = !1);
    },
    value: A[e].bind("volume"),
    class_name: A[e].bind("is_muted").as((t) => t ? "muted" : "")
  });
}
function Ar() {
  return Widget.Box({
    class_name: "volume",
    children: [
      vi("speaker"),
      yi("speaker"),
      Widget.Box({
        vpack: "center",
        child: Ye("sink-selector")
      }),
      Widget.Box({
        vpack: "center",
        child: Ye("app-mixer"),
        visible: A.bind("apps").as((e) => e.length > 0)
      })
    ]
  });
}
function Ur() {
  return Widget.Box({
    class_name: "slider horizontal",
    visible: A.bind("recorders").as((e) => e.length > 0),
    children: [
      vi("microphone"),
      yi("microphone")
    ]
  });
}
function Cr(e) {
  return Widget.Box(
    {
      hexpand: !0,
      class_name: "mixer-item horizontal"
    },
    Widget.Icon({
      tooltip_text: e.bind("name").as((t) => t || ""),
      icon: e.bind("name").as((t) => Utils.lookUpIcon(t || "") ? t || "" : l.fallback.audio)
    }),
    Widget.Box(
      { vertical: !0 },
      Widget.Label({
        xalign: 0,
        truncate: "end",
        max_width_chars: 28,
        label: e.bind("description").as((t) => t || "")
      }),
      Widget.Slider({
        hexpand: !0,
        draw_value: !1,
        value: e.bind("volume"),
        on_change: ({ value: t }) => e.volume = t
      })
    )
  );
}
function Nr(e) {
  return Widget.Button({
    hexpand: !0,
    on_clicked: () => A.speaker = e,
    child: Widget.Box({
      children: [
        Widget.Icon({
          icon: D(e.icon_name || "", l.fallback.audio),
          tooltip_text: e.icon_name || ""
        }),
        Widget.Label((e.description || "").split(" ").slice(0, 4).join(" ")),
        Widget.Icon({
          icon: l.ui.tick,
          hexpand: !0,
          hpack: "end",
          visible: A.speaker.bind("stream").as((t) => t === e.stream)
        })
      ]
    })
  });
}
function wi() {
  return Widget.Button({
    on_clicked: () => {
      W("pavucontrol") && m("pavucontrol");
    },
    hexpand: !0,
    child: Widget.Box({
      children: [
        Widget.Icon(l.ui.settings),
        Widget.Label("Settings")
      ]
    })
  });
}
function Lr() {
  return oe({
    name: "app-mixer",
    icon: l.audio.mixer,
    title: "App Mixer",
    content: [
      Widget.Box({
        vertical: !0,
        class_name: "vertical mixer-item-box",
        children: A.bind("apps").as((e) => e.map(Cr))
      }),
      Widget.Separator(),
      wi()
    ]
  });
}
function Mr() {
  return oe({
    name: "sink-selector",
    icon: l.audio.type.headset,
    title: "Sink Selector",
    content: [
      Widget.Box({
        vertical: !0,
        children: A.bind("speakers").as((e) => e.map(Nr))
      }),
      Widget.Separator(),
      wi()
    ]
  });
}
function Or() {
  return Widget.Slider({
    draw_value: !1,
    hexpand: !0,
    value: V.bind("screen"),
    on_change: ({ value: e }) => V.screen = e
  });
}
function Pr() {
  return Widget.Box({
    class_name: "brightness",
    children: [
      Widget.Button({
        vpack: "center",
        child: Widget.Icon(l.brightness.indicator),
        on_clicked: () => V.screen = 0,
        tooltip_text: V.bind("screen").as((e) => `Screen Brightness: ${Math.floor(e * 100)}%`)
      }),
      Or()
    ]
  });
}
const { wifi: O } = await Service.import("network");
function zr() {
  return Se({
    name: "network",
    icon: O.bind("icon_name"),
    label: O.bind("ssid").as((e) => e || "Not Connected"),
    connection: [O, () => O.enabled],
    deactivate: () => O.enabled = !1,
    activate: () => {
      O.enabled = !0, O.scan();
    }
  });
}
function Tr() {
  return oe({
    name: "network",
    icon: O.bind("icon_name"),
    title: "Wifi Selection",
    content: [
      Widget.Box({
        vertical: !0,
        setup: (e) => e.hook(O, () => e.children = O.access_points.sort((t, i) => i.strength - t.strength).slice(0, 10).map((t) => Widget.Button({
          on_clicked: () => {
            W("nmcli") && Utils.execAsync(`nmcli device wifi connect ${t.bssid}`);
          },
          child: Widget.Box({
            children: [
              Widget.Icon(t.iconName),
              Widget.Label(t.ssid || ""),
              Widget.Icon({
                icon: l.ui.tick,
                hexpand: !0,
                hpack: "end",
                setup: (i) => Utils.idle(() => {
                  i.is_destroyed || (i.visible = t.active);
                })
              })
            ]
          })
        })))
      }),
      Widget.Separator(),
      Widget.Button({
        on_clicked: () => m(s.quicksettings.networkSettings.value),
        child: Widget.Box({
          children: [
            Widget.Icon(l.ui.settings),
            Widget.Label("Network")
          ]
        })
      })
    ]
  });
}
const C = await Service.import("bluetooth");
function Rr() {
  return Se({
    name: "bluetooth",
    icon: C.bind("enabled").as((e) => l.bluetooth[e ? "enabled" : "disabled"]),
    label: Utils.watch("Disabled", C, () => C.enabled ? C.connected_devices.length === 1 ? C.connected_devices[0].alias : `${C.connected_devices.length} Connected` : "Disabled"),
    connection: [C, () => C.enabled],
    deactivate: () => C.enabled = !1,
    activate: () => C.enabled = !0
  });
}
function Dr(e) {
  return Widget.Box({
    children: [
      Widget.Icon(`${e.icon_name}-symbolic`),
      Widget.Label(e.name),
      Widget.Label({
        label: `${e.battery_percentage}%`,
        visible: e.bind("battery_percentage").as((t) => t > 0)
      }),
      Widget.Box({ hexpand: !0 }),
      Widget.Spinner({
        active: e.bind("connecting"),
        visible: e.bind("connecting")
      }),
      Widget.Switch({
        active: e.connected,
        visible: e.bind("connecting").as((t) => !t),
        setup: (t) => t.on("notify::active", () => {
          e.setConnection(t.active);
        })
      })
    ]
  });
}
function Er() {
  return oe({
    name: "bluetooth",
    icon: l.bluetooth.disabled,
    title: "Bluetooth",
    content: [
      Widget.Box({
        class_name: "bluetooth-devices",
        hexpand: !0,
        vertical: !0,
        children: C.bind("devices").as((e) => e.filter((t) => t.name).map(Dr))
      })
    ]
  });
}
const ue = await Service.import("notifications"), Et = ue.bind("dnd");
function jr() {
  return it({
    icon: Et.as((e) => l.notifications[e ? "silent" : "noisy"]),
    label: Et.as((e) => e ? "Silent" : "Noisy"),
    toggle: () => ue.dnd = !ue.dnd,
    connection: [ue, () => ue.dnd]
  });
}
const { scheme: te } = s.theme;
function Fr() {
  return it({
    icon: te.bind().as((e) => l.color[e]),
    label: te.bind().as((e) => e === "dark" ? "Dark" : "Light"),
    toggle: () => te.value = te.value === "dark" ? "light" : "dark",
    connection: [te, () => te.value === "dark"]
  });
}
const { microphone: z } = await Service.import("audio");
function jt() {
  return z.is_muted || z.stream?.is_muted ? l.audio.mic.muted : l.audio.mic.high;
}
function Ft() {
  return z.is_muted || z.stream?.is_muted ? "Muted" : "Unmuted";
}
function Hr() {
  return it({
    icon: Utils.watch(jt(), z, jt),
    label: Utils.watch(Ft(), z, Ft),
    toggle: () => z.is_muted = !z.is_muted,
    connection: [z, () => z?.is_muted || !1]
  });
}
const qr = await Service.import("mpris"), Vr = qr.bind("players"), { media: Ht } = s.quicksettings;
function qt(e) {
  const t = Math.floor(e / 60), i = Math.floor(e % 60), n = i < 10 ? "0" : "";
  return `${t}:${n}${i}`;
}
function Gr(e) {
  const t = Widget.Box({
    class_name: "cover",
    vpack: "start",
    css: Utils.merge([
      e.bind("cover_path"),
      e.bind("track_cover_url"),
      Ht.coverSize.bind()
    ], (p, y, $) => `
            min-width: ${$}px;
            min-height: ${$}px;
            background-image: url('${p || y}');
        `)
  }), i = Widget.Label({
    class_name: "title",
    max_width_chars: 20,
    truncate: "end",
    hpack: "start",
    label: e.bind("track_title")
  }), n = Widget.Label({
    class_name: "artist",
    max_width_chars: 20,
    truncate: "end",
    hpack: "start",
    label: e.bind("track_artists").as((p) => p.join(", "))
  }), o = Widget.Slider({
    class_name: "position",
    draw_value: !1,
    on_change: ({ value: p }) => e.position = p * e.length,
    setup: (p) => {
      const y = () => {
        const { length: $, position: ee } = e;
        p.visible = $ > 0, p.value = $ > 0 ? ee / $ : 0;
      };
      p.hook(e, y), p.hook(e, y, "position"), p.poll(1e3, y);
    }
  }), r = Widget.Label({
    class_name: "position",
    hpack: "start",
    setup: (p) => {
      const y = ($, ee) => {
        p.label = qt(ee || e.position), p.visible = e.length > 0;
      };
      p.hook(e, y, "position"), p.poll(1e3, y);
    }
  }), c = Widget.Label({
    class_name: "length",
    hpack: "end",
    visible: e.bind("length").as((p) => p > 0),
    label: e.bind("length").as(qt)
  }), u = Widget.Icon({
    class_name: "icon",
    hexpand: !0,
    hpack: "end",
    vpack: "start",
    tooltip_text: e.identity || "",
    icon: Utils.merge([e.bind("entry"), Ht.monochromeIcon.bind()], (p, y) => {
      const $ = `${p}${y ? "-symbolic" : ""}`;
      return D($, l.fallback.audio);
    })
  }), g = Widget.Button({
    class_name: "play-pause",
    on_clicked: () => e.playPause(),
    visible: e.bind("can_play"),
    child: Widget.Icon({
      icon: e.bind("play_back_status").as((p) => {
        switch (p) {
          case "Playing":
            return l.mpris.playing;
          case "Paused":
          case "Stopped":
            return l.mpris.stopped;
        }
      })
    })
  }), x = Widget.Button({
    on_clicked: () => e.previous(),
    visible: e.bind("can_go_prev"),
    child: Widget.Icon(l.mpris.prev)
  }), E = Widget.Button({
    on_clicked: () => e.next(),
    visible: e.bind("can_go_next"),
    child: Widget.Icon(l.mpris.next)
  });
  return Widget.Box(
    { class_name: "player", vexpand: !1 },
    t,
    Widget.Box(
      { vertical: !0 },
      Widget.Box([
        i,
        u
      ]),
      n,
      Widget.Box({ vexpand: !0 }),
      o,
      Widget.CenterBox({
        class_name: "footer horizontal",
        start_widget: r,
        center_widget: Widget.Box([
          x,
          g,
          E
        ]),
        end_widget: c
      })
    )
  );
}
function Jr() {
  return Widget.Box({
    vertical: !0,
    class_name: "media vertical",
    children: Vr.as((e) => e.map(Gr))
  });
}
const { bar: _i, quicksettings: Wi } = s, Qr = (await Service.import("mpris")).bind("players"), xi = Utils.derive([_i.position, Wi.position], (e, t) => `${e}-${t}`);
function we(e = [], t = []) {
  return Widget.Box({
    vertical: !0,
    children: [
      Widget.Box({
        homogeneous: !0,
        class_name: "row horizontal",
        children: e.map((i) => i())
      }),
      ...t.map((i) => i())
    ]
  });
}
function Xr() {
  return Widget.Box({
    vertical: !0,
    class_name: "quicksettings vertical",
    css: Wi.width.bind().as((e) => `min-width: ${e}px;`),
    children: [
      Ir(),
      Widget.Box({
        class_name: "sliders-box vertical",
        vertical: !0,
        children: [
          we(
            [Ar],
            [Mr, Lr]
          ),
          Ur(),
          Pr()
        ]
      }),
      we(
        [zr, Rr],
        [Tr, Er]
      ),
      we(
        [Wr, Fr],
        [xr]
      ),
      we([Hr, jr]),
      Widget.Box({
        visible: Qr.as((e) => e.length > 0),
        child: Jr()
      })
    ]
  });
}
function Vt() {
  return ne({
    name: "quicksettings",
    exclusivity: "exclusive",
    transition: _i.position.bind().as((e) => e === "top" ? "slide_down" : "slide_up"),
    layout: xi.value,
    child: Xr()
  });
}
function Yr() {
  App.addWindow(Vt()), xi.connect("changed", () => {
    App.removeWindow("quicksettings"), App.addWindow(Vt());
  });
}
const ie = await Service.import("notifications"), ke = ie.bind("notifications");
function Gt(e) {
  return Widget.Revealer({
    transition_duration: s.transition.value,
    transition: "slide_down",
    child: mi(e),
    setup: (t) => Utils.timeout(s.transition.value, () => {
      t.is_destroyed || (t.reveal_child = !0);
    })
  });
}
function Kr() {
  return Widget.Button({
    on_clicked: ie.clear,
    sensitive: ke.as((e) => e.length > 0),
    child: Widget.Box({
      children: [
        Widget.Label("Clear "),
        Widget.Icon({
          icon: ke.as((e) => l.trash[e.length > 0 ? "full" : "empty"])
        })
      ]
    })
  });
}
function Zr() {
  return Widget.Box({
    class_name: "header",
    children: [
      Widget.Label({ label: "Notifications", hexpand: !0, xalign: 0 }),
      Kr()
    ]
  });
}
function ea() {
  const e = /* @__PURE__ */ new Map(), t = Widget.Box({
    vertical: !0,
    children: ie.notifications.map((n) => {
      const o = Gt(n);
      return e.set(n.id, o), o;
    }),
    visible: ke.as((n) => n.length > 0)
  });
  function i(n, o) {
    const r = e.get(o);
    r && (r.reveal_child = !1, Utils.timeout(s.transition.value, () => {
      r.destroy(), e.delete(o);
    }));
  }
  return t.hook(ie, i, "closed").hook(ie, (n, o) => {
    if (o !== void 0) {
      e.has(o) && i(null, o);
      const r = ie.getNotification(o), c = Gt(r);
      e.set(o, c), t.children = [c, ...t.children];
    }
  }, "notified");
}
function ta() {
  return Widget.Box({
    class_name: "placeholder",
    vertical: !0,
    vpack: "center",
    hpack: "center",
    vexpand: !0,
    hexpand: !0,
    visible: ke.as((e) => e.length === 0),
    children: [
      Widget.Icon(l.notifications.silent),
      Widget.Label("Your inbox is empty")
    ]
  });
}
const ia = () => Widget.Box({
  class_name: "notifications",
  css: s.notifications.width.bind().as((e) => `min-width: ${e}px`),
  vertical: !0,
  children: [
    Zr(),
    Widget.Scrollable({
      vexpand: !0,
      hscroll: "never",
      class_name: "notification-scrollable",
      child: Widget.Box({
        class_name: "notification-list vertical",
        vertical: !0,
        children: [
          ea(),
          ta()
        ]
      })
    })
  ]
});
function na(e) {
  const t = Math.floor(e / 60), i = Math.floor(e % 60);
  return `uptime: ${t}:${i < 10 ? `0${i}` : i}`;
}
const oa = () => Widget.Box({
  vertical: !0,
  class_name: "date-column vertical",
  children: [
    Widget.Box({
      class_name: "clock-box",
      vertical: !0,
      children: [
        Widget.Label({
          class_name: "clock",
          label: Xt.bind().as((e) => e.format("%H:%M"))
        }),
        Widget.Label({
          class_name: "uptime",
          label: Yt.bind().as(na)
        })
      ]
    }),
    Widget.Box({
      class_name: "calendar",
      children: [
        Widget.Calendar({
          hexpand: !0,
          hpack: "center"
        })
      ]
    })
  ]
}), { bar: ki, datemenu: ra } = s, aa = ki.position.bind(), $i = Utils.derive([ki.position, ra.position], (e, t) => `${e}-${t}`);
function sa() {
  return Widget.Box({
    class_name: "datemenu horizontal",
    vexpand: !1,
    children: [
      ia(),
      Widget.Separator({ orientation: 1 }),
      oa()
    ]
  });
}
function Jt() {
  return ne({
    name: "datemenu",
    exclusivity: "exclusive",
    transition: aa.as((e) => e === "top" ? "slide_down" : "slide_up"),
    layout: $i.value,
    child: sa()
  });
}
function ca() {
  App.addWindow(Jt()), $i.connect("changed", () => {
    App.removeWindow("datemenu"), App.addWindow(Jt());
  });
}
App.config({
  onConfigParsed: () => {
    Yr(), ca(), Yi();
  },
  closeWindowDelay: {
    launcher: s.transition.value,
    overview: s.transition.value,
    quicksettings: s.transition.value,
    datemenu: s.transition.value
  },
  windows: () => [
    ...he(io),
    ...he(No),
    ...he(er),
    ...he(To),
    $o(),
    Vo(),
    Zo(),
    br(),
    fr()
  ]
});
