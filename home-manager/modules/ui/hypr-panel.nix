{
  lib,
  inputs,
  config,
  username,
  pkgs,
  ...
}: {
  imports = [ inputs.hyprpanel.homeManagerModules.hyprpanel ];

  sops.secrets.weather_api_key = {
    mode = "664";
  };

  programs.hyprpanel = {
    enable = true;

    systemd.enable = true;

    overwrite.enable = true;
    settings = {
      bar.launcher.icon = "";

      theme.font = {
        name = "JetBrainsMono Nerd Font";
        size = "1rem";
      };

      menus.clock.weather = {
        location = "Lviv, Ukraine";
        unit = "metric";
        key = config.sops.secrets.weather_api_key.path;
      };
    };
  };

  services.mako = {
    enable = lib.mkForce false;
  };
}
