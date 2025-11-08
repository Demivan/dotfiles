{
  flake.modules.homeManager.development = { pkgs, ... }: {
    programs.fish = {enable = true;};
    programs.zoxide = {
      enable = true;
      enableFishIntegration = true;
    };

    programs.kitty = {
      enable = true;
      font = {
        name = "JetBrainsMono Nerd Font";
        size = 12;
      };

      themeFile = "Catppuccin-Mocha";
      settings = {
        window_padding_width = 6;
        confirm_os_window_close = 0;
        enable_audio_bell = false;
        input_delay = 0;
      };
    };

    programs.starship = {
      enable = true;
      settings = {
        add_newline = false;
        directory.fish_style_pwd_dir_length = 1; # turn on fish directory truncation
        directory.truncation_length = 2; # number of directories not to truncate
      };
    };

    home.packages = [
      pkgs.devenv
    ];

    programs.direnv = {
      enable = true;
      nix-direnv.enable = true;
    };
  };
}
