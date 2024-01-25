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
    jetbrains-toolbox
    nodejs_21
    corepack_21 # pnpm
    # dotnet-sdk_8
    dotnet-sdk_6
    opentofu

    # NixOS
    nil

    remmina

    # Communication
    slack
    telegram-desktop

    # Gaming
    bottles

    # Media
    playerctl
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

  programs.firefox = {
    enable = true;
    package = pkgs.floorp;

    profiles.demivan = {
    };
  };

  # Hyprland
  programs.waybar = {
    enable = true;
    systemd.enable = true;

    package = pkgs.waybar.override {
      swaySupport = false;
    };

    settings = {
      mainBar = {
        layer = "top"; # Waybar at top layer
        position = "top"; # Waybar position (top|bottom|left|right)
        "modules-left" = [
          "hyprland/workspaces"
          "hyprland/window"
        ];
        "modules-center" = [
          "custom/music"
        ];
        "modules-right" = [
          "pulseaudio"
          "battery"
          "clock"
          "tray"
          "custom/lock"
          "custom/power"
        ];
        "hyprland/workspaces" = {
          "disable-scroll" = true;
          "sort-by-name" = true;
          "format" = " {icon} ";
          "format-icons" = {
            default = "";
          };
        };
        "hyprland/window" = {
          "format" = " {}";
          "separate-outputs" = true;
        };
        tray = {
          "icon-size" = 21;
          spacing = 10;
        };
        "custom/music" = {
          format = " {}";
          escape = true;
          interval = 5;
          tooltip = false;
          exec = "${pkgs.playerctl}/bin/playerctl metadata --format='{{ title }}'";
          "on-click" = "${pkgs.playerctl}/bin/playerctl play-pause";
          "max-length" = 50;
        };
        clock = {
          timezone = "Europe/Kyiv";
          "tooltip-format" = "<big>{:%Y %B}</big>\n<tt><small>{calendar}</small></tt>";
          "format-alt" = "󰃭 {:%d/%m/%Y}";
          format = " {:%H:%M}";
        };
        battery = {
          states = {
            warning = 30;
            critical = 15;
          };
          format = "{icon}";
          "format-charging" = "󰂄";
          "format-plugged" = "󰂄";
          "format-alt" = "{icon}";
          "format-icons" = [
            "󰂃"
            "󰁺"
            "󰁻"
            "󰁼"
            "󰁽"
            "󰁾"
            "󰁾"
            "󰁿"
            "󰂀"
            "󰂁"
            "󰂂"
            "󰁹"
          ];
        };
        pulseaudio = {
          format = "{icon}  {volume}%";
          "format-muted" = "";
          "format-icons" = {
            default = [
              ""
              ""
              ""
            ];
          };
          "on-click" = "pavucontrol";
        };
        "custom/lock" = {
          tooltip = false;
          "on-click" = "sh -c '(sleep 0.5s; swaylock --grace 0)' & disown";
          format = "";
        };
        "custom/power" = {
          tooltip = false;
          "on-click" = "wlogout &";
          format = "󰐥";
        };
      };
    };

    style = ''
      /*
      *
      * Catppuccin Mocha palette
      * Maintainer: rubyowo
      *
      */

      @define-color base   #1e1e2e;
      @define-color mantle #181825;
      @define-color crust  #11111b;

      @define-color text     #cdd6f4;
      @define-color subtext0 #a6adc8;
      @define-color subtext1 #bac2de;

      @define-color surface0 #313244;
      @define-color surface1 #45475a;
      @define-color surface2 #585b70;

      @define-color overlay0 #6c7086;
      @define-color overlay1 #7f849c;
      @define-color overlay2 #9399b2;

      @define-color blue      #89b4fa;
      @define-color lavender  #b4befe;
      @define-color sapphire  #74c7ec;
      @define-color sky       #89dceb;
      @define-color teal      #94e2d5;
      @define-color green     #a6e3a1;
      @define-color yellow    #f9e2af;
      @define-color peach     #fab387;
      @define-color maroon    #eba0ac;
      @define-color red       #f38ba8;
      @define-color mauve     #cba6f7;
      @define-color pink      #f5c2e7;
      @define-color flamingo  #f2cdcd;
      @define-color rosewater #f5e0dc;

      * {
        font-family: ${vars.font.family};
        font-size: 16px;
        min-height: 0;
      }

      #waybar {
        background: @base;
        color: @text;
        margin: 5px 5px;
      }

      #workspaces {
        border-radius: 1rem;
        margin: 5px;
        background-color: @surface0;
        margin-left: 1rem;
      }

      #workspaces button {
        color: @lavender;
        border-radius: 1rem;
        padding: 0.4rem;
      }

      #workspaces button.active {
        color: @sky;
        border-radius: 1rem;
      }

      #workspaces button:hover {
        color: @sapphire;
        border-radius: 1rem;
      }

      #custom-music,
      #tray,
      #clock,
      #battery,
      #pulseaudio,
      #custom-lock,
      #custom-power {
        background-color: @surface0;
        padding: 0.5rem 1rem;
        margin: 5px 0;
      }

      #clock {
        color: @blue;
        border-radius: 0px 1rem 1rem 0px;
        margin-right: 1rem;
      }

      #battery {
        color: @green;
      }

      #battery.charging {
        color: @green;
      }

      #battery.warning:not(.charging) {
        color: @red;
      }

      #pulseaudio {
        color: @maroon;
        border-radius: 1rem 0px 0px 1rem;
        margin-left: 1rem;
      }

      #custom-music {
        color: @mauve;
        border-radius: 1rem;
      }

      #custom-lock {
        border-radius: 1rem 0px 0px 1rem;
        color: @lavender;
      }

      #custom-power {
        margin-right: 1rem;
        border-radius: 0px 1rem 1rem 0px;
        color: @red;
      }

      #tray {
        margin-right: 1rem;
        border-radius: 1rem;
      }
    '';
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

        "col.active_border" = vars.colors.blueHypr;
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

  programs.direnv = {
    enable = true;
    nix-direnv.enable = true;
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

  # Media
  services.playerctld = {
    enable = true;
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
