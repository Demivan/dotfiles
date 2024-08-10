{
  inputs,
  writeShellScript,
  system,
  stdenv,
  swww,
  nodejs,
  pnpm,
  fzf,
  brightnessctl,
  accountsservice,
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

  ags = inputs.ags.packages.${system}.default.override {
    extraPackages = [accountsservice];
  };

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
    ${ags}/bin/ags -b bar -c ${config}/config.js $@
  '';

  config = stdenv.mkDerivation {
    inherit name;
    src = ./.;

    pnpmDeps = pnpm.fetchDeps {
      pname = "ags";
      src = ./.;
      hash = "sha256-3UYm4dKllC/XgLLd6WxJc9gOXeuS4jeORBXH/3Xzo/Y=";
    };

    nativeBuildInputs = [
      nodejs
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
    src = config;

    installPhase = ''
      mkdir -p $out/bin
      cp -r . $out
      cp ${desktop} $out/bin/${name}
    '';
  }
