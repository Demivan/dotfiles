{
  pkgs,
  lib,
  config,
  nix-colors,
  system,
  inputs,
  username,
  ...
}: {
  imports = [
    nix-colors.homeManagerModules.default
    ./programs/hyprland.nix
  ];

  colorScheme = nix-colors.colorSchemes.catppuccin-mocha;

  # Home Manager needs a bit of information about you and the paths it should
  # manage.
  home.username = username;
  home.homeDirectory = "/home/${username}";

  # This value determines the Home Manager release that your configuration is
  # compatible with. This helps avoid breakage when a new Home Manager release
  # introduces backwards incompatible changes.
  #
  # You should not change this value, even if you update Home Manager. If you do
  # want to update the value, then make sure to first check the Home Manager
  # release notes.
  home.stateVersion = "23.11"; # Please read the comment before changing.

  # Overlays
  nixpkgs.overlays = [
    inputs.nixpkgs-mozilla.overlays.rust
    (final: prev: {
      slack = prev.slack.overrideAttrs (old: {
        fixupPhase = ''
          sed -i -e 's/,"WebRTCPipeWireCapturer"/,"LebRTCPipeWireCapturer"/' $out/lib/slack/resources/app.asar

          rm $out/bin/slack
          makeWrapper $out/lib/slack/slack $out/bin/slack \
            --prefix XDG_DATA_DIRS : $GSETTINGS_SCHEMAS_PATH \
            --suffix PATH : ${lib.makeBinPath [pkgs.xdg-utils]} \
            --add-flags "--ozone-platform-hint=auto --enable-features=WaylandWindowDecorations,WebRTCPipeWireCapturer"
        '';
      });
    })
  ];

  # The home.packages option allows you to install Nix packages into your
  # environment.
  home.packages = with pkgs; [
    # Looks
    (nerdfonts.override {fonts = [config.font.name];})

    # General
    obsidian
    nemo
    tor-browser-bundle-bin

    # Development
    pritunl-client
    git
    p7zip
    neovide
    jetbrains-toolbox
    deno
    nodejs_22
    corepack_22 # pnpm
    bun
    eza
    (with dotnetCorePackages;
      combinePackages [
        sdk_6_0
        sdk_7_0
        sdk_8_0
      ])
    just
    ((rustChannelOf {
        channel = "1.78.0";
        sha256 = "sha256-opUgs6ckUQCyDxcB9Wy51pqhd0MPGHUVbwRKKPGiwZU=";
      })
      .rust
      .override {
        extensions = [
          "rust-src"
        ];
      })
    gcc

    # NixOS
    nil
    sops
    seahorse # for gpg
    (remmina.override {
      withKf5Wallet = false;
    })

    # Communication
    slack
    discord
    telegram-desktop

    # Gaming
    starsector
    bottles
    prismlauncher

    # Media
    gimp
  ];

  services.gnome-keyring.enable = true;

  programs.gpg.enable = true;
  services.gpg-agent = {
    enable = true;
    pinentryPackage = pkgs.pinentry-gnome3;
  };

  fonts.fontconfig = {
    enable = true;

    defaultFonts = {
      monospace = [config.font.family];
    };
  };

  # Home Manager is pretty good at managing dotfiles. The primary way to manage
  # plain files is through 'home.file'.
  home.file = {
    # # Building this configuration will create a copy of 'dotfiles/screenrc' in
    # # the Nix store. Activating the configuration will then make '~/.screenrc' a
    # # symlink to the Nix store copy.
    # ".screenrc".source = dotfiles/screenrc;

    # # You can also set the file content immediately.
    # ".gradle/gradle.properties".text = ''
    #   org.gradle.console=verbose
    #   org.gradle.daemon.idletimeout=3600000
    # '';
  };

  # Home Manager can also manage your environment variables through
  # 'home.sessionVariables'.
  home.sessionVariables = {
    # NIXOS_OZONE_WL = "1";
    # EDITOR = "emacs";
  };

  # Let Home Manager install and manage itself.
  programs.home-manager.enable = true;

  programs.firefox = {
    enable = true;
    package = pkgs.floorp;

    profiles.${username} = {
    };
  };

  # Shell
  programs.fish = {enable = true;};

  programs.zoxide = {
    enable = true;
    enableFishIntegration = true;
  };

  programs.kitty = {
    enable = true;
    font = {
      name = config.font.family;
      size = 12;
    };
    theme = "Catppuccin-Mocha";
    settings = {
      window_padding_width = 6;
    };
    shellIntegration.enableFishIntegration = true;
  };

  programs.starship = {
    enable = true;
    settings = {
      add_newline = false;
      directory.fish_style_pwd_dir_length =
        1; # turn on fish directory truncation
      directory.truncation_length = 2; # number of directories not to truncate
    };
  };

  programs.direnv = {
    enable = true;
    nix-direnv.enable = true;
  };

  # Development
  programs.vscode = {
    enable = true;
    package = pkgs.vscode;
  };

  programs.zellij = {
    enable = true;
  };

  programs.neovim = {
    enable = true;

    defaultEditor = true;
    viAlias = true;
    vimAlias = true;
    vimdiffAlias = true;

    extraPackages = with pkgs; [
      wl-clipboard
      codeium
      omnisharp-roslyn
      unzip
      lazygit
      ripgrep
      fzf
      fd
    ];
  };

  xdg.configFile."nvim/lua/" = {
    source = config.lib.file.mkOutOfStoreSymlink "${config.home.homeDirectory}/.dotfiles/home-manager/programs/nvim/config/lua/";
  };

  xdg.configFile."nvim/init.lua" = {
    source = config.lib.file.mkOutOfStoreSymlink "${config.home.homeDirectory}/.dotfiles/home-manager/programs/nvim/config/init.lua";
  };

  # Media
  services.playerctld = {
    enable = true;
  };

  # Theme
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
}
