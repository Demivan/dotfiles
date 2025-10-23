{
  lib,
  config,
  ...
}:
{
  options.pkgs-overlays = lib.mkOption {
    type = with lib.types; listOf raw;
    default = [ ];
  };

  config.flake.modules.nixos.base = {
    nixpkgs.overlays = config.pkgs-overlays;
  };
}
