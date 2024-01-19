{
  config,
  pkgs,
  osConfig,
  lib,
  ...
}: let
  vars = import ./vars.nix;
in {
  # Home Manager needs a bit of information about you and the paths it should
  # manage.
  home.username = "demivan";
  home.homeDirectory = "/home/demivan";

  # This value determines the Home Manager release that your configuration is
  # compatible with. This helps avoid breakage when a new Home Manager release
  # introduces backwards incompatible changes.
  #
  # You should not change this value, even if you update Home Manager. If you do
  # want to update the value, then make sure to first check the Home Manager
  # release notes.
  home.stateVersion = "23.11"; # Please read the comment before changing.

  # The home.packages option allows you to install Nix packages into your
  # environment.
  home.packages = with pkgs; [
    # Looks
    (nerdfonts.override {fonts = [vars.font.name];})

    # General
    firefox-devedition
    (lib.throwIf (lib.strings.versionOlder "1.5.3" obsidian.version) "Obsidian no longer requires EOL Electron" (
      obsidian.override {
        electron = electron_25.overrideAttrs (_: {
          preFixup = "patchelf --add-needed ${libglvnd}/lib/libEGL.so.1 $out/bin/electron"; # NixOS/nixpkgs#272912
          meta.knownVulnerabilities = []; # NixOS/nixpkgs#273611
        });
      }
    ))

    # Development
    git
    p7zip
    bash
    nodejs_21
    corepack_21 # pnpm
    dotnet-sdk_8
    jetbrains-toolbox

    # NixOS
    nil

    remmina

    opentofu
    ansible
    nomad
    vault

    # Communication
    slack
    telegram-desktop

    # Gaming
    bottles
  ];

  fonts.fontconfig.enable = true;
  xdg.configFile = {
    "fontconfig/conf.d/52-hm-default-fonts.conf".text = ''
      <?xml version='1.0'?>

      <!-- Generated by Home Manager. -->

      <!DOCTYPE fontconfig SYSTEM 'urn:fontconfig:fonts.dtd'>
      <fontconfig>
        <!-- Default fonts -->
        <alias binding="same">
          <family>monospace</family>
          <prefer>${vars.font.family}</prefer>
        </alias>
      </fontconfig>
    '';
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

  # Hyprland
  programs.waybar = {
    enable = true;

    package = pkgs.waybar.override {
      swaySupport = false;
    };
  };

  programs.wofi = {
    enable = true;
    settings = {
      # Geometry
      width = "600px";
      height = "500px";

      # Style
      hide_scroll = true;
      normal_window = true;

      # Images
      allow_markup = true;
      allow_images = true;
      image_size = 24;

      # Keys
      key_expand = "Tab";
      key_exit = "Escape";
    };

    style = ''
      * {
        font-family: "${vars.font.family}", sans-serif;
        font-size: 14px;
      }

      #window {
      	background-color: ${vars.colors.base};
      	color: ${vars.colors.text};
      }

      #outer-box {
      	padding: 10px;
      }

      #input {
      	padding: 4px 12px;
      }

      #scroll {
      	margin-top: 10px;
      }

      #img {
      	padding-right: 8px;
      }

      #text {
      	color: ${vars.colors.text};
      }

      #text:selected {
      	color: ${vars.colors.base};
      }

      #entry {
      	padding: 6px;
      }

      #entry:selected {
      	background-color: ${vars.colors.blue};
      	color: ${vars.colors.base};
      }

      #input, #entry:selected {
      	border-radius: 12px;
      }
    '';
  };

  wayland.windowManager.hyprland = let
    workspaces = map toString (lib.lists.range 1 8);
  in {
    enable = true;

    settings = {
      "$mod" = "SUPER";

      general = {
        border_size = 3;
        no_border_on_floating = false;
        gaps_in = 6;
        gaps_out = 12;
        resize_on_border = true;
        extend_border_grab_area = 15;

        # col.active_border =
        # col.inactive_border =
        # col.group_border =
        # col.group_border_active =
      };

      misc = {
        vrr = 1;
        focus_on_activate = true;
      };

      decoration = {
        rounding = 12;
        "blur:enabled" = false;
        "blur:xray" = false;
        drop_shadow = true;
        shadow_range = 25;
        shadow_render_power = 15;
        shadow_ignore_window = false;
        "col.shadow" = vars.colors.base;
        "col.shadow_inactive" = vars.colors.base;
      };

      bind =
        [
          # Apps
          "$mod, Return, exec, kitty"

          "$mod, Q, killactive"

          # Wofi
          "$mod, D, exec, wofi --show drun --prompt 'Search...'"

          # Switch between windows
          "$mod, Tab, cyclenext"
          "$mod, Tab, bringactivetotop"
          "$mod, F, fullscreen, 0"
        ]
        ++ (map (w: "$mod, ${w}, workspace, ${w}") workspaces)
        ++ (map (w: "$mod_SHIFT, ${w}, movetoworkspace, ${w}") workspaces);

      bindm = [
        "$mod, mouse:272, movewindow"
        "$mod, mouse:273, resizewindow"
      ];

      animations = {
        enabled = true;
        animation = [
          "windowsIn,1,5,default,popin 0%"
          "windowsOut,1,5,default,popin"
          "windowsMove,1,5,default,slide"
          "fadeIn,1,8,default"
          "fadeOut,1,8,default"
          "fadeSwitch,1,8,default"
          "fadeShadow,1,8,default"
          "fadeDim,1,8,default"
          "border,1,10,default"
          "borderangle,1,10,default"
          "workspaces,1,3,default,slide"
          "specialWorkspace,1,5,default,fade"
        ];
      };
    };

    extraConfig = ''
      exec-once=hyprctl setcursor Bibata-Modern-Ice 22
    '';
  };

  # UI
  services.mako = {
    enable = true;
    defaultTimeout = 5000;
  };

  # Shell
  programs.fish = {enable = true;};

  programs.kitty = {
    enable = true;
    font = {
      name = vars.font.family;
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

  # Codium
  programs.vscode = {
    enable = true;
    package = pkgs.vscodium;

    extensions = with pkgs.vscode-extensions; [
      catppuccin.catppuccin-vsc
    ];

    userSettings = {
      "window.titleBarStyle" = "custom";

      "workbench.colorTheme" = "Catppuccin Mocha";

      "editor.fontFamily" = vars.font.family;
      "editor.fontSize" = 16;
      "editor.fontLigatures" = true;
      "terminal.integrated.fontSize" = 16;

      "nix.enableLanguageServer" = true;
      "nix.serverPath" = "nil";
    };
  };

  # Theme
  gtk = {
    enable = true;
    theme = {
      name = "Catppuccin-Mocha-Compact-Blue-Dark";
      package = pkgs.catppuccin-gtk.override {
        accents = ["blue"];
        size = "compact";
        tweaks = ["rimless"];
        variant = "mocha";
      };
    };

    cursorTheme = {
      package = pkgs.bibata-cursors;
      name = "Bibata-Modern-Ice";
      size = 22;
    };
  };
}
