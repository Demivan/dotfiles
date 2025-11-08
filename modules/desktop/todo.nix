{
  flake.modules.homeManager.todo = { pkgs,  ... }: {
    home.packages = with pkgs; [
      # Looks
      nerd-fonts.jetbrains-mono
      maple-mono.variable

      # General
      obsidian
      nemo

      # Development
      pritunl-client
      p7zip
      neovide
      nodejs_24
      corepack_24 # pnpm
      deno
      bun
      eza
      (with dotnetCorePackages;
        combinePackages [
          sdk_8_0
          sdk_9_0
        ])
      go

      # NixOS
      nil
      nixd
      sops
      seahorse # for gpg
      remmina

      # Gaming
      starsector
      bottles
      prismlauncher

      # Media
      libreoffice
      gimp
      ffmpeg

      #
      bitwarden-desktop
    ];


    programs.gpg.enable = true;
    services.gpg-agent = {
      enable = true;
      pinentry.package = pkgs.pinentry-gnome3;
    };

    fonts.fontconfig = {
      enable = true;

      defaultFonts = {
        monospace = ["JetBrainsMono Nerd Font"];
      };
    };
  };
}
