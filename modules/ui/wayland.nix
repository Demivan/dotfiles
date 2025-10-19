{
  pkgs,
  ...
}: {
  environment.sessionVariables = {
    # Wayland-specific settings
    NIXOS_OZONE_WL = "1";
    MOZ_ENABLE_WAYLAND = "1";
    OZONE_PLATFORM = "wayland";
    ELECTRON_OZONE_PLATFORM_HINT = "wayland";
  };

  environment.systemPackages = [
    pkgs.xwayland-satellite
  ];
}
