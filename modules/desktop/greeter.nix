{
  inputs,
  ...
}: {
  flake.modules.nixos.desktop = {
    imports = [
      inputs.dankMaterialShell.nixosModules.greeter
    ];

    services.greetd = {
      settings.default_session.user = "demivan";
    };

    programs.dankMaterialShell.greeter = {
      enable = true;
      compositor.name = "niri";
      configHome = "/home/demivan";
    };
  };
}
