{
  inputs,
  config,
  username,
  ...
}: {
  imports = [
    inputs.dankMaterialShell.nixosModules.greeter
  ];

  services.greetd = {
    settings.default_session.user = username;
  };

  programs.dankMaterialShell.greeter = {
    enable = true;
    compositor.name = config.compositor;
    configHome = "/home/${username}";
  };
}
