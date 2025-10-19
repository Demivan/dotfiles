{
  lib,
  ...
}: {
  imports = [
    ./wayland.nix
    ./greeter.nix
  ];

  options.compositor = lib.mkOption {
    type = lib.types.str;
    default = "niri";
  };
}
