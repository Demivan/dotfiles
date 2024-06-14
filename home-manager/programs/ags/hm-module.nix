{ inputs, pkgs, ... }:
let
  ags = pkgs.callPackage ./default.nix { inherit inputs; };
in
{
  imports = [
    inputs.ags.homeManagerModules.default
  ];

  home.packages = [ ags ];

  systemd.user.services.ags = {
    Unit = {
      Description = "Ags bar";
    };

    Install = {
      WantedBy = [ "default.target" ];
    };

    Service = {
      ExecStart = "${ags}/bin/ags";
    };
  };
}
