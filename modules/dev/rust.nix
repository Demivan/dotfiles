{ inputs, ... }: {
  pkgs-overlays = [
    inputs.rust-overlay.overlays.default
  ];

  flake.modules.homeManager.development = { pkgs, ... }: {
    home.packages = with pkgs; [
      (rust-bin.stable.latest.default.override {
        extensions = [ "rust-src" ];
      })
    ];
  };
}
