{ inputs, ... }: {
  pkgs-overlays = [
    inputs.rust-overlay.overlays.default
  ];

  flake.modules.nixos.development = { pkgs, ... }: {
    environment.systemPackages = with pkgs; [
      (rust-bin.stable.latest.default.override {
        extensions = [ "rust-src" ];
      })
    ];
  };
}
