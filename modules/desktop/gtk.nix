{
  flake.modules.homeManager.desktop = { pkgs, ... }: {
    gtk = {
      enable = true;
      theme = {
        name = "catppuccin-mocha-blue-compact+rimless";
        package = pkgs.catppuccin-gtk.override {
          accents = ["blue"];
          size = "compact";
          tweaks = ["rimless"];
          variant = "mocha";
        };
      };

      iconTheme = {
        package = pkgs.fluent-icon-theme;
        name = "Fluent";
      };

      cursorTheme = {
        package = pkgs.bibata-cursors;
        name = "Bibata-Modern-Ice";
        size = 22;
      };
    };
  };
}
