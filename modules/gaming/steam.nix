{
  allowedUnfreePackages = [
    "steam"
    "steam-unwrapped"
  ];

  flake.modules.nixos.gaming = { pkgs, ... }: {
    hardware.xpadneo.enable = true;

    hardware.graphics = {
      enable = true;
      enable32Bit = true;
    };

    programs.steam = {
      enable = true;
      extraCompatPackages = [
        pkgs.proton-ge-bin
      ];
    };
  };
}
