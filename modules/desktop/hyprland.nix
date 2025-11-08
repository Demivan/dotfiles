{
  flake.module.nixos.hyprland = { pkgs, ... }: {
    xdg.portal = {
      enable = true;
      configPackages = with pkgs; [
        xdg-desktop-portal-hyprland
        xdg-desktop-portal-gtk
      ];
    };
  };

  flake.module.homeManager.hyprland = {}: {
    imports = [
      # ./hyprland/hyprland.nix
      # ./hyprland/waybar.nix
      # ./hyprland/hypr-panel.nix
    ];
  };
}
