{
  lib,
  config,
  ...
}:
{
  options.allowedUnfreePackages = lib.mkOption {
    type = lib.types.listOf lib.types.str;
  };

  config.flake.modules.nixos.base = { lib, ... }: {
    nixpkgs.config = {
      allowUnfreePredicate = pkg: builtins.elem (lib.getName pkg) config.allowedUnfreePackages;
      allowUnfree = true;
    };
  };
}
