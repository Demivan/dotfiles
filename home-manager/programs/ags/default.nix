{
  inputs,
  writeShellScript,
  system,
  stdenv,
  swww,
  nodejs,
  pnpm,
  dart-sass,
  fzf,
  brightnessctl,
  slurp,
  wf-recorder,
  wl-clipboard,
  wayshot,
  swappy,
  hyprpicker,
  pavucontrol,
  networkmanager,
  gtk3,
  which,
  ...
}: let
  name = "ags";

  ags = inputs.ags.packages.${system}.default;

  dependencies = [
    which
    fzf
    brightnessctl
    swww
    # inputs.matugen.packages.${system}.default
    slurp
    wf-recorder
    wl-clipboard
    wayshot
    swappy
    hyprpicker
    pavucontrol
    networkmanager
    gtk3
  ];

  addBins = list: builtins.concatStringsSep ":" (builtins.map (p: "${p}/bin") list);

  desktop = writeShellScript name ''
    export PATH=$PATH:${addBins dependencies}
    ${ags}/bin/ags -b bar -c ${agsConfig}/config.js $@
  '';

  agsConfig = stdenv.mkDerivation {
    inherit name;
    src = ./.;

    pnpmDeps = pnpm.fetchDeps {
      pname = "ags";
      src = ./.;
      hash = "sha256-3UYm4dKllC/XgLLd6WxJc9gOXeuS4jeORBXH/3Xzo/Y=";
    };

    nativeBuildInputs = [
      nodejs
      dart-sass
      pnpm.configHook
    ];

    buildPhase = ''
      ${pnpm}/bin/pnpm build -- ./main.ts ./main.js
    '';

    installPhase = ''
      mkdir -p $out
      cp -r style.css $out/style.css
      cp -f main.js $out/config.js
    '';
  };
in
  stdenv.mkDerivation {
    inherit name;
    src = agsConfig;

    installPhase = ''
      mkdir -p $out/bin
      cp -r . $out
      cp ${desktop} $out/bin/${name}
    '';
  }
