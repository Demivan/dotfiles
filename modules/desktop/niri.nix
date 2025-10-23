{
  inputs,
  ...
}: {
  pkgs-overlays = [inputs.niri.overlays.niri];

  flake.modules.nixos.niri = inputs.niri.nixosModules.niri;
}
