{ inputs, ... }: {
  flake.modules.homeManager.development = { pkgs, ... }: {
    home.packages = [
      inputs.ghostty.packages.${pkgs.stdenv.hostPlatform.system}.default
    ];
  };
}
